import type { Core } from '@strapi/strapi';
import { fork } from 'child_process';
import path from 'path';
import fs from 'fs';

function setupDatabaseSync() {
  const syncScript = path.join(__dirname, '../../scripts/sync-db.js');
  if (!fs.existsSync(syncScript)) {
    console.warn(`[Sync] Warning: Database sync script not found at ${syncScript}. Skipping sync scheduling.`);
    return;
  }

  // Run sync immediately on startup
  console.log('[Sync] Spawning initial database sync process...');
  fork(syncScript, [], { stdio: 'inherit' });

  // Schedule to run every 10 minutes (600000 ms)
  const intervalMs = parseInt(process.env.DB_SYNC_INTERVAL_MS || '600000', 10);
  console.log(`[Sync] Scheduling database sync process to run every ${intervalMs / 1000}s`);

  setInterval(() => {
    console.log('[Sync] Spawning background database sync process...');
    const child = fork(syncScript, [], { stdio: 'inherit' });
    child.on('error', (err) => {
      console.error('[Sync] Background sync process error:', err.message);
    });
  }, intervalMs);
}

export default {
  register({ strapi }: { strapi: Core.Strapi }) {
    // Document Service Middleware: Global Audit Logger
    strapi.documents.use(async (context: any, next: any) => {
      const { action, uid, params } = context;
      const trackedActions = ['create', 'update', 'delete', 'publish', 'unpublish'];

      if (
        !trackedActions.includes(action) ||
        (uid as string) === 'api::audit-log.audit-log' ||
        (uid as string) === 'api::login-event.login-event'
      ) {
        return next();
      }

      let beforeData = null;
      if (['update', 'delete', 'publish', 'unpublish'].includes(action) && params?.documentId) {
        try {
          beforeData = await strapi.documents(uid as any).findOne({
            documentId: params.documentId,
          });
        } catch {
          beforeData = null;
        }
      }

      const result = await next();

      try {
        const actor = context.state?.user;
        const actorId = actor?.id ? String(actor.id) : (params?.data?.clerk_actor_id || 'system');
        const actorName = actor
          ? `${actor.firstname ?? ''} ${actor.lastname ?? ''}`.trim()
          : (params?.data?.clerk_actor_name || 'System / BFF');

        setImmediate(async () => {
          try {
            await (strapi.documents('api::audit-log.audit-log' as any) as any).create({
              data: {
                content_type: uid,
                target_document_id: params?.documentId || (result as any)?.documentId || 'unknown',
                action,
                actor_id: actorId,
                actor_name: actorName,
                before_data: beforeData,
                after_data: result,
              } as any,
            });
          } catch (err: any) {
            strapi.log.error(`[AuditLog Middleware Error]: ${err.message}`);
          }
        });
      } catch (err: any) {
        strapi.log.error(`[AuditLog State Error]: ${err.message}`);
      }

      return result;
    });
  },

  async bootstrap({ strapi }: { strapi: Core.Strapi }) {
    // 1. Setup RBAC Roles & Permissions
    await setupRBAC(strapi);

    // 2. Setup Public Read-Only Access
    await setupPublicPermissions(strapi);

    // 3. Seed Initial Data from Hardcoded Frontend (if empty)
    await seedInitialData(strapi);

    // 3b. Ensure default Media Assets exist
    await ensureDefaultMediaAssets(strapi);

    // 4. Ensure all seeded documents are published for REST API
    await publishExistingDrafts(strapi);

    // 4b. Seed Partner entries if empty
    await seedPartnerData(strapi);

    // 5. Schedule database sync if running on MySQL (main)
    const dbClient = strapi.config.get('database.connection.client');
    if (dbClient === 'mysql') {
      setupDatabaseSync();
    }
  },
};

/**
 * Setup RBAC roles and permissions for OSIS CMS
 */
async function setupRBAC(strapi: Core.Strapi) {
  const allContentTypes = [
    'api::sekbid.sekbid',
    'api::program-kerja.program-kerja',
    'api::event.event',
    'api::anggota-osis.anggota-osis',
    'api::artikel-mading.artikel-mading',
    'api::galeri-foto.galeri-foto',
    'api::media-asset.media-asset',
    'api::halaman.halaman',
    'api::bg-texture-config.bg-texture-config',
    'api::edufest-division.edufest-division',
    'api::edufest-member.edufest-member',
    'api::edufest-timeline.edufest-timeline',
    'api::edufest-config.edufest-config',
    'api::partner.partner',
  ];

  const contributorContentTypes = [
    'api::program-kerja.program-kerja',
    'api::event.event',
    'api::artikel-mading.artikel-mading',
  ];

  const existingRoles = await strapi
    .plugin('users-permissions')
    .service('role')
    .find();

  const roleNames = existingRoles.map((r: any) => r.name);

  // === Chief Editor Role ===
  if (!roleNames.includes('Chief Editor')) {
    await strapi.plugin('users-permissions').service('role').createRole({
      name: 'Chief Editor',
      description:
        'Ketua/Wakil/Sekjen OSIS — Full CRUD semua content, publish/approve, manage Contributors.',
      type: 'chief_editor',
    });
    strapi.log.info('✅ Chief Editor role created');
  }

  // === Content Contributor Role ===
  if (!roleNames.includes('Content Contributor')) {
    await strapi.plugin('users-permissions').service('role').createRole({
      name: 'Content Contributor',
      description:
        'Pengurus Sekbid — Create/Edit draft content miliknya, submit for review.',
      type: 'content_contributor',
    });
    strapi.log.info('✅ Content Contributor role created');
  }

  // Set permissions for roles
  const roles = await strapi
    .plugin('users-permissions')
    .service('role')
    .find();

  for (const role of roles) {
    if (role.name === 'Chief Editor') {
      await setChiefEditorPermissions(strapi, role.id, allContentTypes);
    } else if (role.name === 'Content Contributor') {
      await setContributorPermissions(
        strapi,
        role.id,
        contributorContentTypes,
        allContentTypes
      );
    }
  }
}

async function setChiefEditorPermissions(
  strapi: Core.Strapi,
  roleId: number,
  contentTypes: string[]
) {
  const permissions: any = {};
  for (const ct of contentTypes) {
    const [, fullName] = ct.split('::');
    const [apiName] = fullName.split('.');
    permissions[`api::${apiName}`] = {
      controllers: {
        [apiName]: {
          find: { enabled: true },
          findOne: { enabled: true },
          create: { enabled: true },
          update: { enabled: true },
          delete: { enabled: true },
        },
      },
    };
  }
  permissions['plugin::upload'] = {
    controllers: {
      content: {
        find: { enabled: true },
        findOne: { enabled: true },
        upload: { enabled: true },
        destroy: { enabled: true },
      },
    },
  };
  try {
    await strapi.plugin('users-permissions').service('role').updateRole(roleId, { permissions });
    strapi.log.info('✅ Chief Editor permissions set');
  } catch (error: any) {
    strapi.log.warn('⚠️ Could not set Chief Editor permissions');
  }
}

async function setContributorPermissions(
  strapi: Core.Strapi,
  roleId: number,
  writableContentTypes: string[],
  allContentTypes: string[]
) {
  const permissions: any = {};
  for (const ct of allContentTypes) {
    const [, fullName] = ct.split('::');
    const [apiName] = fullName.split('.');
    const isWritable = writableContentTypes.includes(ct);
    permissions[`api::${apiName}`] = {
      controllers: {
        [apiName]: {
          find: { enabled: true },
          findOne: { enabled: true },
          create: { enabled: isWritable },
          update: { enabled: isWritable },
          delete: { enabled: false },
        },
      },
    };
  }
  permissions['plugin::upload'] = {
    controllers: {
      content: {
        find: { enabled: true },
        findOne: { enabled: true },
        upload: { enabled: true },
        destroy: { enabled: false },
      },
    },
  };
  try {
    await strapi.plugin('users-permissions').service('role').updateRole(roleId, { permissions });
    strapi.log.info('✅ Content Contributor permissions set');
  } catch (error: any) {
    strapi.log.warn('⚠️ Could not set Contributor permissions');
  }
}

async function setupPublicPermissions(strapi: Core.Strapi) {
  const publicRole = await strapi
    .plugin('users-permissions')
    .service('role')
    .find();
  const publicRoleEntry = publicRole.find((r: any) => r.type === 'public');
  if (!publicRoleEntry) return;

  const publicContentTypes = [
    'sekbid',
    'program-kerja',
    'event',
    'anggota-osis',
    'artikel-mading',
    'galeri-foto',
    'media-asset',
    'halaman',
    'bg-texture-config',
    'edufest-division',
    'edufest-member',
    'edufest-timeline',
    'edufest-config',
    'partner',
  ];
  const permissions: any = {};
  for (const apiName of publicContentTypes) {
    permissions[`api::${apiName}`] = {
      controllers: {
        [apiName]: {
          find: { enabled: true },
          findOne: { enabled: true },
          create: { enabled: false },
          update: { enabled: false },
          delete: { enabled: false },
        },
      },
    };
  }
  try {
    await strapi.plugin('users-permissions').service('role').updateRole(publicRoleEntry.id, { permissions });
    strapi.log.info('✅ Public read-only permissions set including media-asset');
  } catch (error) {
    strapi.log.warn('⚠️ Could not set public permissions');
  }
}

// ============================================
// Automatic Seeding Logic (Internal strapi.db / documents API)
// ============================================
// ============================================
// Ensure Default Media Assets & Layout Config
// ============================================
async function ensureDefaultMediaAssets(strapi: Core.Strapi) {
  // Sync Content Manager Layout Config for Halaman Utama to force display of new fields in Strapi Admin Form
  try {
    const layoutKey = 'plugin_content_manager_configuration_content_types::api::halaman.halaman';
    const store = (strapi.db.query('strapi_core_store_settings') as any);
    if (store) {
      const configRecord = await store.findOne({ where: { key: layoutKey } });
      if (configRecord && configRecord.value) {
        let val = typeof configRecord.value === 'string' ? JSON.parse(configRecord.value) : configRecord.value;
        let layoutModified = false;

        // Ensure overlay_image and background_image are present in edit layout
        if (val?.layouts?.edit) {
          const editLayout: any[][] = val.layouts.edit;
          const flatFields = editLayout.flat().map((item: any) => item.name);

          if (!flatFields.includes('overlay_image')) {
            editLayout.push([{ name: 'overlay_image', size: 6 }]);
            layoutModified = true;
          }
          if (!flatFields.includes('background_image')) {
            editLayout.push([{ name: 'background_image', size: 6 }]);
            layoutModified = true;
          }

          if (layoutModified) {
            await store.update({
              where: { id: configRecord.id },
              data: { value: JSON.stringify(val) },
            });
            strapi.log.info('✅ Forced Content Manager layout refresh for Halaman Utama (overlay_image & background_image)');
          }
        }
      }
    }
  } catch (err: any) {
    strapi.log.warn('⚠️ Could not update content-manager layout for Halaman Utama: ' + err.message);
  }

  const defaultMediaAssets = [
    { key: 'about-collaboration', judul: 'Kolaborasi OSIS Agora Acta', kategori: 'about', tipe_media: 'foto', url_external: '/media/about/osis_about_collaboration.jpg', deskripsi: 'Foto Kolaborasi OSIS', urutan: 1 },
    { key: 'about-leadership', judul: 'Kepemimpinan OSIS Agora Acta', kategori: 'about', tipe_media: 'foto', url_external: '/media/about/osis_about_leadership.jpg', deskripsi: 'Foto Kepemimpinan OSIS', urutan: 2 },
    { key: 'bg-soundtrack', judul: 'Soundtrack Background Music Website', kategori: 'audio', tipe_media: 'audio', url_external: '/sounds/Aidentity.mp3', deskripsi: 'Musik Latar Website OSIS', urutan: 1 },
    { key: 'sosmed-bg', judul: 'Sosmed Hub Background', kategori: 'sosmed', tipe_media: 'foto', url_external: '/media/sosmed/sosmed_bg.jpg', deskripsi: 'Background Halaman Sosmed Hub', urutan: 1 },
    { key: 'logo', judul: 'Logo Utama Website', kategori: 'general', tipe_media: 'foto', url_external: '/images/logo-infinity.png', deskripsi: 'Logo utama OSIS di navbar', urutan: 1 },
    { key: 'ticker-1', judul: 'Dokumentasi 1', kategori: 'ticker', tipe_media: 'foto', url_external: '/images/hover-1.JPG', urutan: 1 },
    { key: 'ticker-2', judul: 'Dokumentasi 2', kategori: 'ticker', tipe_media: 'foto', url_external: '/images/hover-2.JPG', urutan: 2 },
    { key: 'ticker-3', judul: 'Dokumentasi 3', kategori: 'ticker', tipe_media: 'foto', url_external: '/images/hover-3.HEIC', urutan: 3 },
    { key: 'hero-1', judul: 'Hero Banner 1', kategori: 'hero', tipe_media: 'foto', url_external: '/images/placeholder-visual.jpg', deskripsi: 'Banner utama beranda 1', urutan: 1 },
    { key: 'hero-2', judul: 'Hero Banner 2', kategori: 'hero', tipe_media: 'foto', url_external: '/images/placeholder-visual.jpg', deskripsi: 'Banner utama beranda 2', urutan: 2 },
    { key: 'home-overlay-image', judul: 'Foto Kartu Utama (Teks Bergerak Bersama)', kategori: 'hero', tipe_media: 'foto', url_external: '/images/hover-1.JPG', deskripsi: 'Gambar untuk kartu tengah horizontal scroll', urutan: 3 },
  ];

  strapi.log.info('Checking/Syncing default Media Assets...');
  try {
    const existingAssets = await (strapi.documents as any)('api::media-asset.media-asset').findMany({
      fields: ['key'],
    });
    const existingKeys = new Set((existingAssets || []).map((a: any) => a.key));

    for (const ma of defaultMediaAssets) {
      if (!existingKeys.has(ma.key)) {
        strapi.log.info(`Seeding missing Media Asset: ${ma.key}`);
        const created = await (strapi.documents as any)('api::media-asset.media-asset').create({
          data: {
            ...ma,
            status: 'published',
          } as any,
        });
        if (created && created.documentId) {
          await (strapi.documents as any)('api::media-asset.media-asset').publish({ documentId: created.documentId });
        }
      }
    }
  } catch (error) {
    strapi.log.error(`Failed to seed default media assets: ${(error as any).message}`);
  }
}

async function seedInitialData(strapi: Core.Strapi) {
  // Always seed 5 Halaman Utama and Edufest if empty
  await seedHalamanUtama(strapi);
  await seedEdufestData(strapi);

  const count = await strapi.documents('api::sekbid.sekbid').count({});
  if (count > 0) {
    strapi.log.info('ℹ️ Database already contains data. Skipping initial seeding.');
    return;
  }

  strapi.log.info('🌱 Database is empty. Seeding initial data from frontend...');

  // 1. Seed Sekbids
  const sekbidData = [
    { judul: 'Kerohanian', nomor: 1, deskripsi: 'Pembinaan keimanan dan ketakwaan melalui kegiatan keagamaan seperti tilawah, kultum, takhosus, dan pendampingan rohis.', visi: 'Pembinaan Keimanan dan Ketakwaan terhadap Tuhan Yang Maha Esa.', slug: 'sekbid-1', highlight_type: 'terpopuler', highlight_title: 'Tilawah OSIS (TILSIS)', highlight_desc: "Tilawah harian untuk memperlancar bacaan Al-Qur'an." },
    { judul: 'Kesiswaan / Ketertiban', nomor: 2, deskripsi: 'Membangun kedisiplinan dan ketertiban siswa melalui sidak tata tertib, piket kedisiplinan, dan apresiasi kelas disiplin.', visi: 'Membangun Kedisiplinan dan Ketertiban Siswa.', slug: 'sekbid-2', highlight_type: 'showcase', highlight_title: 'Class of Discipline (COD)', highlight_desc: 'Apresiasi siswa/i yang taat pada peraturan sekolah.' },
    { judul: 'Edukasi', nomor: 3, deskripsi: 'Pengembangan potensi akademik melalui study club, notifikasi edukasi, dan konten pembelajaran singkat.', visi: 'Pengembangan Potensi Akademik dan Edukasi Siswa.', slug: 'sekbid-3', highlight_type: 'showcase', highlight_title: 'University Day x Fi Flick', highlight_desc: 'Sharing alumni dan informasi perguruan tinggi.' },
    { judul: 'Bahasa', nomor: 4, deskripsi: 'Pengembangan literasi dan bahasa melalui sayembara menulis, podcast sastra, dan kuis literasi rutin.', visi: 'Pengembangan Literasi dan Bahasa Siswa.', slug: 'sekbid-4', highlight_type: 'showcase', highlight_title: 'Write Your Ideas (WYI)', highlight_desc: 'Sayembara menulis karya sastra bulanan.' },
    { judul: 'Minat & Bakat', nomor: 5, deskripsi: 'Wadah pengembangan minat dan bakat siswa melalui talent showcase, refleksi diri, dan informasi lomba non-akademik.', visi: 'Wadah Pengembangan Minat dan Bakat Siswa.', slug: 'sekbid-5', highlight_type: 'showcase', highlight_title: 'Classmeet x Market Day — Dynamite', highlight_desc: 'Kompetisi dan pengalaman wirausaha nyata.' },
    { judul: 'Kesehatan & Lingkungan', nomor: 6, deskripsi: 'Pengembangan kebersihan, kesehatan, dan lingkungan hidup melalui cleaning day, senam, dan edukasi gizi.', visi: 'Pengembangan Kebersihan, Kesehatan, dan Lingkungan Hidup.', slug: 'sekbid-6', highlight_type: 'showcase', highlight_title: 'Healthy Movement', highlight_desc: 'Senam bersama untuk hidup sehat setiap Rabu.' },
    { judul: 'Kewirausahaan', nomor: 7, deskripsi: 'Pengembangan jiwa kewirausahaan dan ekonomi kreatif melalui weekly market, wawancara pengusaha, dan direct marketing.', visi: 'Pengembangan Jiwa Kewirausahaan dan Ekonomi Kreatif.', slug: 'sekbid-7', highlight_type: 'showcase', highlight_title: 'Weekly Market', highlight_desc: 'Penjualan rutin oleh pengurus OSIS 2x seminggu.' },
    { judul: 'Kominfo', nomor: 8, deskripsi: 'Pengelolaan komunikasi, informasi, dan media digital OSIS melalui sosial media, mading, website, dan studio konten.', visi: 'Pengelolaan Komunikasi, Informasi, dan Media Digital OSIS.', slug: 'sekbid-8', highlight_type: 'terpopuler', highlight_title: 'SiteStream', highlight_desc: 'Website informasi resmi OSIS Fithrah Insani.' },
  ];

  const sekbidMap = new Map<number, any>();
  for (const s of sekbidData) {
    const created = await strapi.documents('api::sekbid.sekbid').create({
      data: s as any,
    });
    if (created && created.documentId) {
      await strapi.documents('api::sekbid.sekbid').publish({ documentId: created.documentId });
    }
    sekbidMap.set(s.nomor, created.id);
  }
  strapi.log.info(`  ✅ Created ${sekbidMap.size} Sekbid entries`);

  // 2. Seed Anggota OSIS (65 Members)
  const anggotaData = [
    // Pengurus Inti (BPH)
    { nama_lengkap: 'SURYA SIGIT', jabatan: 'Ketua', kelas: 'XI B', divisi: 'BPH', deskripsi: 'Kelas XI B', urutan: 1 },
    { nama_lengkap: 'AISHA GHASSANI SHALIHA', jabatan: 'Wakil Ketua', kelas: 'XI D', divisi: 'BPH', deskripsi: 'Kelas XI D', urutan: 2 },
    { nama_lengkap: 'RIZKA RASYIDAH', jabatan: 'Sekretaris', kelas: 'XI E', divisi: 'BPH', deskripsi: 'Kelas XI E', urutan: 3 },
    { nama_lengkap: 'MUHAMMAD HAMMAM JUNDURRAHMAN', jabatan: 'Bendahara', kelas: 'XI B', divisi: 'BPH', deskripsi: 'Kelas XI B', urutan: 4 },

    // Sekbid 1: Kerohanian
    { nama_lengkap: 'ADHIENA ZAHRA RIZKYA', jabatan: 'Koordinator Sekbid 1', kelas: 'XI D', divisi: 'Sekbid_1', deskripsi: 'Kelas XI D', urutan: 5 },
    { nama_lengkap: 'VANESHA SESILLAWATI', jabatan: 'Sekretaris Sekbid 1', kelas: 'XI D', divisi: 'Sekbid_1', deskripsi: 'Kelas XI D', urutan: 6 },
    { nama_lengkap: 'AQILA AL HUMAIRA', jabatan: 'Anggota Sekbid 1', kelas: 'X F', divisi: 'Sekbid_1', deskripsi: 'Kelas X F', urutan: 7 },
    { nama_lengkap: 'ZALFA NUR AFIFA ZAKAUHA', jabatan: 'Anggota Sekbid 1', kelas: 'X F', divisi: 'Sekbid_1', deskripsi: 'Kelas X F', urutan: 8 },
    { nama_lengkap: 'AFIQOH DAYINI ATHAULLAH PURWANA', jabatan: 'Anggota Sekbid 1', kelas: 'X D', divisi: 'Sekbid_1', deskripsi: 'Kelas X D', urutan: 9 },
    { nama_lengkap: 'MUHAMMAD HAIDAR AL AYYUBI', jabatan: 'Anggota Sekbid 1', kelas: 'X A', divisi: 'Sekbid_1', deskripsi: 'Kelas X A', urutan: 10 },
    { nama_lengkap: 'MUHAMMAD FATHIAN AKBAR', jabatan: 'Anggota Sekbid 1', kelas: 'X A', divisi: 'Sekbid_1', deskripsi: 'Kelas X A', urutan: 11 },

    // Sekbid 2: Kaderisasi
    { nama_lengkap: 'AHWAN M. KA’BAH', jabatan: 'Koordinator Sekbid 2', kelas: 'XI C', divisi: 'Sekbid_2', deskripsi: 'Kelas XI C', urutan: 12 },
    { nama_lengkap: 'BANITA ALIYA ASROFA', jabatan: 'Sekretaris Sekbid 2', kelas: 'XI D', divisi: 'Sekbid_2', deskripsi: 'Kelas XI D', urutan: 13 },
    { nama_lengkap: 'NAFEEZA KEYSYAKURA ALBANNA', jabatan: 'Anggota Sekbid 2', kelas: 'X E', divisi: 'Sekbid_2', deskripsi: 'Kelas X E', urutan: 14 },
    { nama_lengkap: 'YUSSIE YUKENNITA RAMADHANI', jabatan: 'Anggota Sekbid 2', kelas: 'X E', divisi: 'Sekbid_2', deskripsi: 'Kelas X E', urutan: 15 },
    { nama_lengkap: 'RAIHANAH GHINA ELTSURAYYA', jabatan: 'Anggota Sekbid 2', kelas: 'X F', divisi: 'Sekbid_2', deskripsi: 'Kelas X F', urutan: 16 },
    { nama_lengkap: 'RAY ZIBRIL RIDWAN', jabatan: 'Anggota Sekbid 2', kelas: 'X B', divisi: 'Sekbid_2', deskripsi: 'Kelas X B', urutan: 17 },
    { nama_lengkap: 'KHAIDAR MIFTAH BADRUZZAMAN', jabatan: 'Anggota Sekbid 2', kelas: 'X B', divisi: 'Sekbid_2', deskripsi: 'Kelas X B', urutan: 18 },
    { nama_lengkap: 'ANANDA P. PRATAMA', jabatan: 'Anggota Sekbid 2', kelas: 'X B', divisi: 'Sekbid_2', deskripsi: 'Kelas X B', urutan: 19 },

    // Sekbid 3: Edukasi
    { nama_lengkap: 'MUHAMMAD AZZAM FIRDAUS', jabatan: 'Koordinator Sekbid 3', kelas: 'XI B', divisi: 'Sekbid_3', deskripsi: 'Kelas XI B', urutan: 20 },
    { nama_lengkap: 'SHYFA PUTRI AZZAHRA', jabatan: 'Sekretaris Sekbid 3', kelas: 'XI E', divisi: 'Sekbid_3', deskripsi: 'Kelas XI E', urutan: 21 },
    { nama_lengkap: 'ZAKI IBRAHIM AZIS', jabatan: 'Anggota Sekbid 3', kelas: 'X A', divisi: 'Sekbid_3', deskripsi: 'Kelas X A', urutan: 22 },
    { nama_lengkap: 'PRANANDA RAMADHAN AHMAD', jabatan: 'Anggota Sekbid 3', kelas: 'X A', divisi: 'Sekbid_3', deskripsi: 'Kelas X A', urutan: 23 },
    { nama_lengkap: 'SASKIA MEKA TADRIANA', jabatan: 'Anggota Sekbid 3', kelas: 'X E', divisi: 'Sekbid_3', deskripsi: 'Kelas X E', urutan: 24 },
    { nama_lengkap: 'ALIYA MARWA RUWAIDA', jabatan: 'Anggota Sekbid 3', kelas: 'X E', divisi: 'Sekbid_3', deskripsi: 'Kelas X E', urutan: 25 },
    { nama_lengkap: 'FATHIMAH TASLIMAH RAHMA FACHELFI', jabatan: 'Anggota Sekbid 3', kelas: 'X D', divisi: 'Sekbid_3', deskripsi: 'Kelas X D', urutan: 26 },

    // Sekbid 4: Bahasa
    { nama_lengkap: 'MASAGUS HAFIDHUDDIN', jabatan: 'Koordinator Sekbid 4', kelas: 'XI B', divisi: 'Sekbid_4', deskripsi: 'Kelas XI B', urutan: 27 },
    { nama_lengkap: 'MUHAMMAD RIZKY TANTANA', jabatan: 'Sekretaris Sekbid 4', kelas: 'XI A', divisi: 'Sekbid_4', deskripsi: 'Kelas XI A', urutan: 28 },
    { nama_lengkap: 'THIFANI ARIFA KHILFA H.', jabatan: 'Anggota Sekbid 4', kelas: 'X F', divisi: 'Sekbid_4', deskripsi: 'Kelas X F', urutan: 29 },
    { nama_lengkap: 'RAIHAN PUTRA ARIFANDRA', jabatan: 'Anggota Sekbid 4', kelas: 'X A', divisi: 'Sekbid_4', deskripsi: 'Kelas X A', urutan: 30 },
    { nama_lengkap: 'ALUNA ADELIA PUTRI', jabatan: 'Anggota Sekbid 4', kelas: 'X D', divisi: 'Sekbid_4', deskripsi: 'Kelas X D', urutan: 31 },
    { nama_lengkap: 'ACHMAD ANSHOR', jabatan: 'Anggota Sekbid 4', kelas: 'X C', divisi: 'Sekbid_4', deskripsi: 'Kelas X C', urutan: 32 },
    { nama_lengkap: 'RAISSA ZALIKA SADINA', jabatan: 'Anggota Sekbid 4', kelas: 'X E', divisi: 'Sekbid_4', deskripsi: 'Kelas X E', urutan: 33 },

    // Sekbid 5: Minat dan Bakat
    { nama_lengkap: 'JASMINE VANYA ABERKA', jabatan: 'Koordinator Sekbid 5', kelas: 'XI E', divisi: 'Sekbid_5', deskripsi: 'Kelas XI E', urutan: 34 },
    { nama_lengkap: 'IRSYAD ASHAVIN', jabatan: 'Sekretaris Sekbid 5', kelas: 'XI C', divisi: 'Sekbid_5', deskripsi: 'Kelas XI C', urutan: 35 },
    { nama_lengkap: 'AISYAH', jabatan: 'Anggota Sekbid 5', kelas: 'X D', divisi: 'Sekbid_5', deskripsi: 'Kelas X D', urutan: 36 },
    { nama_lengkap: 'WANIA AULIYA RAMADHANI', jabatan: 'Anggota Sekbid 5', kelas: 'X E', divisi: 'Sekbid_5', deskripsi: 'Kelas X E', urutan: 37 },
    { nama_lengkap: 'ADHWA NABILAH PUTRI MARSILAN', jabatan: 'Anggota Sekbid 5', kelas: 'X E', divisi: 'Sekbid_5', deskripsi: 'Kelas X E', urutan: 38 },
    { nama_lengkap: 'KEANU REIVAN AGASHA', jabatan: 'Anggota Sekbid 5', kelas: 'X C', divisi: 'Sekbid_5', deskripsi: 'Kelas X C', urutan: 39 },
    { nama_lengkap: 'ALFIAN PRAMUDYA', jabatan: 'Anggota Sekbid 5', kelas: 'X C', divisi: 'Sekbid_5', deskripsi: 'Kelas X C', urutan: 40 },

    // Sekbid 6: Kesehatan dan Lingkungan
    { nama_lengkap: 'KEZZIA ANNISA SALSABILA', jabatan: 'Koordinator Sekbid 6', kelas: 'XI E', divisi: 'Sekbid_6', deskripsi: 'Kelas XI E', urutan: 41 },
    { nama_lengkap: 'KAYYISA FATHIYYAH', jabatan: 'Sekretaris Sekbid 6', kelas: 'XI D', divisi: 'Sekbid_6', deskripsi: 'Kelas XI D', urutan: 42 },
    { nama_lengkap: 'HANUM SALSABILA', jabatan: 'Anggota Sekbid 6', kelas: 'X E', divisi: 'Sekbid_6', deskripsi: 'Kelas X E', urutan: 43 },
    { nama_lengkap: 'RASHIKA RIZQUENA', jabatan: 'Anggota Sekbid 6', kelas: 'X E', divisi: 'Sekbid_6', deskripsi: 'Kelas X E', urutan: 44 },
    { nama_lengkap: 'REYFA SAFFA MAHESWARA', jabatan: 'Anggota Sekbid 6', kelas: 'X A', divisi: 'Sekbid_6', deskripsi: 'Kelas X A', urutan: 45 },
    { nama_lengkap: 'KEYSHA NAFIDHA ALMIRA GUNAWAN', jabatan: 'Anggota Sekbid 6', kelas: 'XI D', divisi: 'Sekbid_6', deskripsi: 'Kelas XI D', urutan: 46 },
    { nama_lengkap: 'SYARLA SYAFANA DEWI', jabatan: 'Anggota Sekbid 6', kelas: 'X D', divisi: 'Sekbid_6', deskripsi: 'Kelas X D', urutan: 47 },
    { nama_lengkap: 'HADZIQ MAHFUZ MUHAMMAD', jabatan: 'Anggota Sekbid 6', kelas: 'X B', divisi: 'Sekbid_6', deskripsi: 'Kelas X B', urutan: 48 },

    // Sekbid 7: Kewirausahaan
    { nama_lengkap: 'RAKEAN EKA LINGGA WARDANA', jabatan: 'Koordinator Sekbid 7', kelas: 'XI B', divisi: 'Sekbid_7', deskripsi: 'Kelas XI B', urutan: 49 },
    { nama_lengkap: 'AZKARIN FIDELYA KHANSABIRA', jabatan: 'Sekretaris Sekbid 7', kelas: 'XI E', divisi: 'Sekbid_7', deskripsi: 'Kelas XI E', urutan: 50 },
    { nama_lengkap: 'AFIYAH FITRI RAMADANI', jabatan: 'Anggota Sekbid 7', kelas: 'X F', divisi: 'Sekbid_7', deskripsi: 'Kelas X F', urutan: 51 },
    { nama_lengkap: 'ANAKIA MUNGGARANTI YUSAN', jabatan: 'Anggota Sekbid 7', kelas: 'XI E', divisi: 'Sekbid_7', deskripsi: 'Kelas XI E', urutan: 52 },
    { nama_lengkap: 'RADYTIA NUR HIDAYAH', jabatan: 'Anggota Sekbid 7', kelas: 'X A', divisi: 'Sekbid_7', deskripsi: 'Kelas X A', urutan: 53 },
    { nama_lengkap: 'ZULFAN ARIFIN RUSTANDI', jabatan: 'Anggota Sekbid 7', kelas: 'X C', divisi: 'Sekbid_7', deskripsi: 'Kelas X C', urutan: 54 },
    { nama_lengkap: 'KHALISA KASIH ANINDYA KIRANI PUTRI', jabatan: 'Anggota Sekbid 7', kelas: 'X E', divisi: 'Sekbid_7', deskripsi: 'Kelas X E', urutan: 55 },
    { nama_lengkap: 'FATHURROCHMAN ROZIQ', jabatan: 'Anggota Sekbid 7', kelas: 'X A', divisi: 'Sekbid_7', deskripsi: 'Kelas X A', urutan: 56 },
    { nama_lengkap: 'AINA RAHMA AULIA', jabatan: 'Anggota Sekbid 7', kelas: 'XI D', divisi: 'Sekbid_7', deskripsi: 'Kelas XI D', urutan: 57 },

    // Sekbid 8: Komunikasi dan Informasi
    { nama_lengkap: 'MUHAMMAD SYARIF ATTABI', jabatan: 'Koordinator Sekbid 8', kelas: 'XI B', divisi: 'Sekbid_8', deskripsi: 'Kelas XI B', urutan: 58 },
    { nama_lengkap: 'NAMIRA PUTRI FACHRUDDIN', jabatan: 'Sekretaris Sekbid 8', kelas: 'XI D', divisi: 'Sekbid_8', deskripsi: 'Kelas XI D', urutan: 59 },
    { nama_lengkap: 'RHESA ADILFI DARMA S.', jabatan: 'Anggota Sekbid 8', kelas: 'XI C', divisi: 'Sekbid_8', deskripsi: 'Kelas XI C', urutan: 60 },
    { nama_lengkap: 'LAILA KHUSFI ZAHRANI', jabatan: 'Anggota Sekbid 8', kelas: 'X E', divisi: 'Sekbid_8', deskripsi: 'Kelas X E', urutan: 61 },
    { nama_lengkap: 'MUHAMMAD FAHMI RAMADHANI F.', jabatan: 'Anggota Sekbid 8', kelas: 'X A', divisi: 'Sekbid_8', deskripsi: 'Kelas X A', urutan: 62 },
    { nama_lengkap: 'FIRJATULLAH AR-RIZQU SYAKIRA H.', jabatan: 'Anggota Sekbid 8', kelas: 'X A', divisi: 'Sekbid_8', deskripsi: 'Kelas X A', urutan: 63 },
    { nama_lengkap: 'RIZKI NUR MUZAKI PARNO PUTRA', jabatan: 'Anggota Sekbid 8', kelas: 'X B', divisi: 'Sekbid_8', deskripsi: 'Kelas X B', urutan: 64 },
    { nama_lengkap: 'KEISHA CLEO RUSTANDI', jabatan: 'Anggota Sekbid 8', kelas: 'X D', divisi: 'Sekbid_8', deskripsi: 'Kelas X D', urutan: 65 },
  ];

  for (const a of anggotaData) {
    const created = await strapi.documents('api::anggota-osis.anggota-osis').create({
      data: { ...a, periode: '2025-2026', status_aktif: 'aktif' } as any,
    });
    if (created && created.documentId) {
      await strapi.documents('api::anggota-osis.anggota-osis').publish({ documentId: created.documentId });
    }
  }
  strapi.log.info(`  ✅ Created ${anggotaData.length} Anggota OSIS entries`);

  // 3. Seed Program Kerja
  const programKerjaData = [
    { judul: 'Tilawah OSIS (TILSIS)', slug: 'tilawah-osis', kategori: 'rutin', sekbid_nomor: 1, tujuan: "Membantu seluruh pengurus OSIS menambah dan memperlancar bacaan tilawah Al-Qur'an.", teknis_pelaksanaan: 'Tilawah dilakukan setiap hari sejak pagi, kehadiran dicatat via Google Form, direkap tiap sekbid secara berkala (triwulan).', evaluasi_deskripsi: 'Kehadiran dicatat via Google Form dan direkap tiap sekbid secara berkala setiap triwulan.', evaluasi_form_url: '#', bg_color: 'bg-teal-50', icon_color: 'text-[#009689]', tujuan_detail: [{ title: 'Kedisiplinan Ibadah', deskripsi: 'Membiasakan tilawah sebelum rapat umum sebagai bentuk kedisiplinan ibadah.' }, { title: "Konsistensi Al-Qur'an", deskripsi: "Meningkatkan interaksi pengurus dengan Al-Qur'an secara konsisten." }], ketua_nama: 'Pengurus OSIS', ketua_jabatan: 'Penanggung Jawab Program' },
    { judul: 'Hadist of the Week (HOTW)', slug: 'hadist-of-the-week', kategori: 'rutin', sekbid_nomor: 1, tujuan: 'Mengenalkan hadits-hadits pilihan kepada siswa/i agar dapat diamalkan sehari-hari.', teknis_pelaksanaan: 'Hadits disampaikan lewat radio sekolah (± pukul 06.20–06.40) setiap Jumat, kadang disertai broadcast voice note ke grup kelas.', evaluasi_deskripsi: 'Evaluasi dilakukan melalui feedback siswa dan monitoring penyampaian mingguan.', evaluasi_form_url: '#', bg_color: 'bg-orange-50', icon_color: 'text-[#E17100]', tujuan_detail: [{ title: 'Pemahaman Hadits', deskripsi: 'Menyampaikan hadits dari kitab Arbain An-Nawawi secara bertahap.' }, { title: 'Media Aksesibel', deskripsi: 'Memperluas pemahaman keagamaan lewat media yang mudah diakses.' }], ketua_nama: 'Pengurus OSIS', ketua_jabatan: 'Penanggung Jawab Program' },
    { judul: 'Pendampingan Rohis', slug: 'pendampingan-rohis', kategori: 'rutin', sekbid_nomor: 1, tujuan: 'Menumbuhkan semangat religius dan kepedulian sosial siswa lewat kegiatan keagamaan rutin.', teknis_pelaksanaan: 'Al-Kahfi setiap Jumat pagi saat pengkondisian; infak dikumpulkan tiap hari saat Dzuhur; Islamic of the Month dan sesi keakhwatan tiap pekan ke-4.', evaluasi_deskripsi: 'Evaluasi dilakukan melalui laporan mingguan pengumpulan infak dan kehadiran kegiatan rohis.', evaluasi_form_url: '#', bg_color: 'bg-blue-50', icon_color: 'text-[#155DFC]', tujuan_detail: [{ title: 'Pembinaan Rohis', deskripsi: 'Membina program-program rohis: Al-Kahfi, pengelolaan infak, Islamic of the Month, keakhwatan.' }, { title: 'Wawasan Berkelanjutan', deskripsi: 'Meningkatkan wawasan keislaman siswa secara berkelanjutan.' }], ketua_nama: 'Pengurus OSIS', ketua_jabatan: 'Penanggung Jawab Program' },
    { judul: 'Takhosus', slug: 'takhosus', kategori: 'rutin', sekbid_nomor: 1, tujuan: "Menambah dan menguatkan hafalan Al-Qur'an siswa/i secara intensif.", teknis_pelaksanaan: 'Dilaksanakan Selasa–Kamis pukul 06.30–07.00 di masjid, dengan pendataan kehadiran per sesi.', evaluasi_deskripsi: 'Kehadiran dicatat per sesi dan progres hafalan dipantau secara berkala.', evaluasi_form_url: '#', bg_color: 'bg-rose-50', icon_color: 'text-[#EC003F]', tujuan_detail: [{ title: 'Hafalan Terstruktur', deskripsi: "Memfasilitasi metode hafalan terstruktur (simak, tikrar, muraja'ah)." }, { title: 'Pembinaan Lanjutan', deskripsi: 'Wajib bagi siswa/i yang sudah hafal 30 juz sebagai pembinaan lanjutan.' }], ketua_nama: 'Pengurus OSIS', ketua_jabatan: 'Penanggung Jawab Program' },
    { judul: 'Kultum', slug: 'kultum', kategori: 'rutin', sekbid_nomor: 1, tujuan: 'Menambah wawasan keagamaan siswa/i sekaligus melatih rasa percaya diri.', teknis_pelaksanaan: 'Dilaksanakan setiap hari kerja (Senin–Jumat, Jumat khusus akhwat), masing-masing dengan tema harian berbeda.', evaluasi_deskripsi: 'Siswa/i yang bertugas dicatat dan dievaluasi kualitas penyampaiannya oleh pembina.', evaluasi_form_url: '#', bg_color: 'bg-indigo-50', icon_color: 'text-[#4F39F6]', tujuan_detail: [{ title: 'Ceramah Bergilir', deskripsi: 'Siswa/i bergiliran menyampaikan ceramah singkat dengan tema yang sudah ditentukan.' }, { title: 'Tema Berjenjang', deskripsi: 'Topik disusun berjenjang (akhlak, ibadah, adab) agar pembahasan bervariasi.' }], ketua_nama: 'Pengurus OSIS', ketua_jabatan: 'Penanggung Jawab Program' },
    { judul: 'PHBI (Peringatan Hari Besar Islam)', slug: 'phbi', kategori: 'insidental', sekbid_nomor: 1, tujuan: "Memperingati dan menghayati hari-hari besar Islam (Maulid Nabi, Isra Mi'raj, Idul Fitri, Idul Adha, Muharram) untuk memperkuat keimanan dan ketakwaan siswa/i.", teknis_pelaksanaan: 'Dilaksanakan sesuai kalender hari besar Islam, dengan rangkaian acara ceramah, lomba, dan kegiatan keagamaan lainnya.', evaluasi_deskripsi: 'Proposal per sub-acara belum diunggah di Drive.', evaluasi_form_url: '#', bg_color: 'bg-emerald-50', icon_color: 'text-[#009966]', tujuan_detail: [{ title: 'Penguatan Iman', deskripsi: 'Menumbuhkan kesadaran dan penghayatan terhadap peristiwa-peristiwa penting dalam sejarah Islam.' }, { title: 'Ukhuwah Islamiyah', deskripsi: 'Mempererat tali persaudaraan dan kebersamaan seluruh warga sekolah.' }], ketua_nama: 'Pengurus OSIS', ketua_jabatan: 'Penanggung Jawab Program' },
    { judul: 'One Day One Juz', slug: 'one-day-one-juz', kategori: 'insidental', sekbid_nomor: 1, tujuan: "Membudayakan khatam Al-Qur'an bersama selama bulan Ramadhan melalui program satu juz per hari.", teknis_pelaksanaan: "Program pembacaan Al-Qur'an satu juz per hari selama bulan Ramadhan secara bersama-sama.", evaluasi_deskripsi: 'Proposal belum diunggah di Drive.', evaluasi_form_url: '#', bg_color: 'bg-purple-50', icon_color: 'text-[#9810FA]', tujuan_detail: [{ title: 'Khatam Bersama', deskripsi: "Memfasilitasi siswa/i untuk khatam Al-Qur'an secara kolektif selama Ramadhan." }, { title: "Cinta Al-Qur'an", deskripsi: "Menumbuhkan kecintaan dan kebiasaan membaca Al-Qur'an setiap hari." }], ketua_nama: 'Pengurus OSIS', ketua_jabatan: 'Penanggung Jawab Program' },
    { judul: 'Ramadhan Ceria — Pohon Kurma', slug: 'ramadhan-ceria', kategori: 'insidental', sekbid_nomor: 1, tujuan: 'Menumbuhkan pemahaman keislaman serta sikap kebersamaan dan kepedulian sosial siswa/i selama bulan Ramadhan.', teknis_pelaksanaan: 'Dilaksanakan 2 hari (Maret 2026), diisi kegiatan bernuansa Ramadhan dan lingkungan. Gabungan dengan Baksos Sekbid 2.', evaluasi_deskripsi: 'Evaluasi dilaksanakan pasca kegiatan melalui rapat internal.', evaluasi_form_url: '#', bg_color: 'bg-rose-50', icon_color: 'text-[#E7000B]', tujuan_detail: [{ title: 'Karakter Islami', deskripsi: 'Penguatan karakter Islami (olah hati dan akhlak).' }, { title: 'Kepedulian Sosial', deskripsi: 'Kepedulian sosial lewat kegiatan bakti sosial.' }], ketua_nama: 'Pengurus OSIS', ketua_jabatan: 'Penanggung Jawab Program' },
    { judul: 'Sidak Tata Tertib (STT)', slug: 'sidak-tata-tertib', kategori: 'rutin', sekbid_nomor: 2, tujuan: 'Menguatkan karakter disiplin dan tanggung jawab anggota OSIS.', teknis_pelaksanaan: 'Sidak dilakukan Sekbid 2 sebelum rapat OSIS.', evaluasi_deskripsi: 'Rekap pelanggaran dicatat dan dilaporkan.', evaluasi_form_url: '#', bg_color: 'bg-red-50', icon_color: 'text-red-600', tujuan_detail: [{ title: 'Pemeriksaan Atribut', deskripsi: 'Pemeriksaan atribut seragam dan kerapian.' }, { title: 'Penegakan Disiplin', deskripsi: 'Penegakan lewat teguran dan pembinaan.' }], ketua_nama: 'Pengurus OSIS', ketua_jabatan: 'Penanggung Jawab Program' },
    { judul: 'Class of Discipline (COD)', slug: 'class-of-discipline', kategori: 'rutin', sekbid_nomor: 2, tujuan: 'Mengapresiasi siswa/i yang taat pada peraturan sekolah.', teknis_pelaksanaan: 'Merekap data pelanggaran bulanan.', evaluasi_deskripsi: 'Data pelanggaran direkap setiap bulan.', evaluasi_form_url: '#', bg_color: 'bg-blue-50', icon_color: 'text-blue-600', tujuan_detail: [{ title: 'Perspektif Positif', deskripsi: 'Mengubah cara pandang siswa terhadap aturan.' }, { title: 'Penghargaan', deskripsi: 'Memberi penghargaan kepada kelas dengan pelanggaran tersedikit.' }], ketua_nama: 'Pengurus OSIS', ketua_jabatan: 'Penanggung Jawab Program' },
    { judul: 'Kompas OSIS', slug: 'kompas-osis', kategori: 'rutin', sekbid_nomor: 2, tujuan: 'Menjadikan seluruh anggota OSIS lebih disiplin dan patuh pada peraturan sekolah.', teknis_pelaksanaan: 'Pemeriksaan atribut pengurus OSIS.', evaluasi_deskripsi: 'Catatan pelanggaran pengurus OSIS direkap.', evaluasi_form_url: '#', bg_color: 'bg-indigo-50', icon_color: 'text-indigo-600', tujuan_detail: [{ title: 'Teladan OSIS', deskripsi: 'OSIS sebagai teladan menaati aturan.' }, { title: 'Sanksi Tegas', deskripsi: 'Sanksi diberlakukan bila melanggar aturan.' }], ketua_nama: 'Pengurus OSIS', ketua_jabatan: 'Penanggung Jawab Program' },
    { judul: 'Piket Kedisiplinan', slug: 'piket-kedisiplinan', kategori: 'rutin', sekbid_nomor: 2, tujuan: 'Menertibkan siswa/i terkait kerapian, atribut, dan ketepatan waktu.', teknis_pelaksanaan: 'Piket setiap hari di titik-titik gedung.', evaluasi_deskripsi: 'Laporan piket harian dicatat.', evaluasi_form_url: '#', bg_color: 'bg-purple-50', icon_color: 'text-purple-600', tujuan_detail: [{ title: 'Piket Pagi', deskripsi: 'Memeriksa kelengkapan atribut.' }, { title: 'Piket Siang', deskripsi: 'Mengawal sholat Dzuhur berjamaah.' }], ketua_nama: 'Pengurus OSIS', ketua_jabatan: 'Penanggung Jawab Program' },
    { judul: 'PHBN (Peringatan Hari Besar Nasional)', slug: 'phbn', kategori: 'insidental', sekbid_nomor: 2, tujuan: 'Menjadikan siswa/i lebih menghormati dan mengapresiasi jasa guru.', teknis_pelaksanaan: 'Acara sehari penuh dengan kepanitiaan lengkap.', evaluasi_deskripsi: 'Evaluasi pasca kegiatan melalui rapat internal.', evaluasi_form_url: '#', bg_color: 'bg-red-50', icon_color: 'text-red-600', tujuan_detail: [{ title: 'Cahaya Pembimbing', deskripsi: 'Guru diposisikan sebagai cahaya pembimbing.' }, { title: 'Kesadaran Nasional', deskripsi: 'Menumbuhkan kesadaran menghargai pahlawan.' }], ketua_nama: 'Pengurus OSIS', ketua_jabatan: 'Penanggung Jawab Program' },
    { judul: 'Bakti Sosial (Baksos)', slug: 'bakti-sosial', kategori: 'insidental', sekbid_nomor: 2, tujuan: 'Melatih siswa/i untuk berempati dan berbagi dengan sesama.', teknis_pelaksanaan: 'Penggalangan dana insidental.', evaluasi_deskripsi: 'Laporan penyaluran dana disusun.', evaluasi_form_url: '#', bg_color: 'bg-emerald-50', icon_color: 'text-emerald-600', tujuan_detail: [{ title: 'Penggalangan Dana', deskripsi: 'Mengumpulkan dana bakti sosial.' }, { title: 'Gotong Royong', deskripsi: 'Menanamkan nilai kemanusiaan.' }], ketua_nama: 'Pengurus OSIS', ketua_jabatan: 'Penanggung Jawab Program' },
    { judul: 'Notifikasi Edukasi', slug: 'notifikasi-edukasi', kategori: 'rutin', sekbid_nomor: 3, tujuan: 'Menjadi wadah bagi siswa/i memperoleh informasi beasiswa dan lomba.', teknis_pelaksanaan: 'Info disebar lewat poster digital dan mading.', evaluasi_deskripsi: 'Efektivitas diukur dari respons siswa.', evaluasi_form_url: '#', bg_color: 'bg-blue-50', icon_color: 'text-blue-600', tujuan_detail: [{ title: 'Akses Informasi', deskripsi: 'Mengatasi minimnya informasi lomba.' }, { title: 'Kompetisi Akademik', deskripsi: 'Aktif mengikuti kompetisi.' }], ketua_nama: 'Pengurus OSIS', ketua_jabatan: 'Penanggung Jawab Program' },
    { judul: 'Study Club', slug: 'study-club', kategori: 'rutin', sekbid_nomor: 3, tujuan: 'Meningkatkan pemahaman akademik dan mempersiapkan ujian.', teknis_pelaksanaan: 'Dilaksanakan H-1 setiap ujian.', evaluasi_deskripsi: 'Kehadiran guru dan siswa dicatat.', evaluasi_form_url: '#', bg_color: 'bg-emerald-50', icon_color: 'text-emerald-600', tujuan_detail: [{ title: 'Kisi-kisi Bersama', deskripsi: 'Pembahasan kisi-kisi soal bersama guru.' }, { title: 'Belajar Efektif', deskripsi: 'Membentuk kebiasaan belajar efektif.' }], ketua_nama: 'Pengurus OSIS', ketua_jabatan: 'Penanggung Jawab Program' },
    { judul: 'Two Minutes Class', slug: 'two-minutes-class', kategori: 'rutin', sekbid_nomor: 3, tujuan: 'Meningkatkan pemahaman materi pelajaran lewat konten singkat.', teknis_pelaksanaan: 'Video ± 2 menit diunggah ke Instagram & TikTok OSIS.', evaluasi_deskripsi: 'Engagement konten dipantau.', evaluasi_form_url: '#', bg_color: 'bg-amber-50', icon_color: 'text-amber-600', tujuan_detail: [{ title: 'Kolaborasi Guru', deskripsi: 'Bekerja sama dengan guru mapel.' }, { title: 'Media Menarik', deskripsi: 'Media belajar yang ringan.' }], ketua_nama: 'Pengurus OSIS', ketua_jabatan: 'Penanggung Jawab Program' },
    { judul: 'Hari Pendidikan', slug: 'hari-pendidikan', kategori: 'insidental', sekbid_nomor: 3, tujuan: 'Memperingati Hari Pendidikan Nasional.', teknis_pelaksanaan: 'Rangkaian kegiatan edukasi.', evaluasi_deskripsi: 'Laporan evaluasi disusun.', evaluasi_form_url: '#', bg_color: 'bg-teal-50', icon_color: 'text-teal-600', tujuan_detail: [{ title: 'Semangat Pendidikan', deskripsi: 'Menumbuhkan semangat belajar.' }, { title: 'Refleksi Belajar', deskripsi: 'Merefleksikan pentingnya pendidikan.' }], ketua_nama: 'Pengurus OSIS', ketua_jabatan: 'Penanggung Jawab Program' },
    { judul: 'University Day x Fi Flick — Enchanted Path', slug: 'university-day', kategori: 'insidental', sekbid_nomor: 3, tujuan: 'Memberikan informasi perguruan tinggi lewat sharing alumni.', teknis_pelaksanaan: 'Parade kampus, sharing alumni, dan booth foto.', evaluasi_deskripsi: 'Feedback peserta dikumpulkan.', evaluasi_form_url: '#', bg_color: 'bg-indigo-50', icon_color: 'text-indigo-600', tujuan_detail: [{ title: 'Sharing Alumni', deskripsi: 'Alumni berbagi pengalaman kuliah.' }, { title: 'Fi Flick', deskripsi: 'Photobooth untuk dokumentasi.' }], ketua_nama: 'Pengurus OSIS', ketua_jabatan: 'Penanggung Jawab Program' },
    { judul: 'Write Your Ideas (WYI)', slug: 'write-your-ideas', kategori: 'rutin', sekbid_nomor: 4, tujuan: 'Wadah mengasah keterampilan menulis karya sastra.', teknis_pelaksanaan: 'Sayembara menulis bulanan.', evaluasi_deskripsi: 'Partisipasi dipantau tiap bulan.', evaluasi_form_url: '#', bg_color: 'bg-rose-50', icon_color: 'text-rose-600', tujuan_detail: [{ title: 'Ruang Berkarya', deskripsi: 'Memberi ruang bagi siswa berkarya.' }, { title: 'Apresiasi Publik', deskripsi: 'Apresiasi karya lewat media sosial.' }], ketua_nama: 'Pengurus OSIS', ketua_jabatan: 'Penanggung Jawab Program' },
    { judul: 'Suara Sastra', slug: 'suara-sastra', kategori: 'rutin', sekbid_nomor: 4, tujuan: 'Memperluas wawasan literasi lewat podcast.', teknis_pelaksanaan: 'Podcast bulanan wawancara pemenang WYI.', evaluasi_deskripsi: 'Analytics dipantau.', evaluasi_form_url: '#', bg_color: 'bg-blue-50', icon_color: 'text-blue-600', tujuan_detail: [{ title: 'Apresiasi Berkelanjutan', deskripsi: 'Wawancara pemenang WYI.' }, { title: 'Kesadaran Literasi', deskripsi: 'Meningkatkan literasi.' }], ketua_nama: 'Pengurus OSIS', ketua_jabatan: 'Penanggung Jawab Program' },
    { judul: 'Enlightment Trip (ET)', slug: 'enlightment-trip', kategori: 'rutin', sekbid_nomor: 4, tujuan: 'Keterampilan literasi lewat membaca dan kuis.', teknis_pelaksanaan: 'Kuis Quizizz tiap Kamis.', evaluasi_deskripsi: 'Dipantau via Quizizz.', evaluasi_form_url: '#', bg_color: 'bg-emerald-50', icon_color: 'text-emerald-600', tujuan_detail: [{ title: 'Literasi Aktif', deskripsi: 'Membaca rutin.' }, { title: 'Kuis Interaktif', deskripsi: 'Kuis Kamis.' }], ketua_nama: 'Pengurus OSIS', ketua_jabatan: 'Penanggung Jawab Program' },
    { judul: 'Quotes of the Month (QOTM)', slug: 'quotes-of-the-month', kategori: 'rutin', sekbid_nomor: 4, tujuan: 'Kutipan inspiratif bulanan.', teknis_pelaksanaan: 'Kutipan inspiratif di Instagram.', evaluasi_deskripsi: 'Engagement dipantau.', evaluasi_form_url: '#', bg_color: 'bg-amber-50', icon_color: 'text-amber-600', tujuan_detail: [{ title: 'Motivasi Siswa', deskripsi: 'Semangat belajar.' }, { title: 'Inspirasi Bulanan', deskripsi: 'Kutipan inspiratif.' }], ketua_nama: 'Pengurus OSIS', ketua_jabatan: 'Penanggung Jawab Program' },
    { judul: 'Ourself Journey (OJ)', slug: 'ourself-journey', kategori: 'rutin', sekbid_nomor: 5, tujuan: 'Memahami diri dan potensi.', teknis_pelaksanaan: 'Konten refleksi diri digital.', evaluasi_deskripsi: 'Analytics dipantau.', evaluasi_form_url: '#', bg_color: 'bg-pink-50', icon_color: 'text-pink-600', tujuan_detail: [{ title: 'Refleksi Diri', deskripsi: 'Memahami potensi.' }, { title: 'Konten Digital', deskripsi: 'Konten relatable.' }], ketua_nama: 'Pengurus OSIS', ketua_jabatan: 'Penanggung Jawab Program' },
    { judul: 'Talent Showcase', slug: 'talent-showcase', kategori: 'rutin', sekbid_nomor: 5, tujuan: 'Panggung bakat offline dan online.', teknis_pelaksanaan: 'Showcase bakat rutin.', evaluasi_deskripsi: 'Feedback peserta.', evaluasi_form_url: '#', bg_color: 'bg-rose-50', icon_color: 'text-rose-600', tujuan_detail: [{ title: 'Panggung Bakat', deskripsi: 'Wadah ekspresi.' }, { title: 'Offline & Online', deskripsi: 'Multi platform.' }], ketua_nama: 'Pengurus OSIS', ketua_jabatan: 'Penanggung Jawab Program' },
    { judul: 'Classmeet x Market Day — Dynamite', slug: 'classmeet', kategori: 'insidental', sekbid_nomor: 5, tujuan: 'Kompetisi non-akademik dan wirausaha.', teknis_pelaksanaan: 'Lomba dan bazar sekolah.', evaluasi_deskripsi: 'Laporan LPJ.', evaluasi_form_url: '#', bg_color: 'bg-purple-50', icon_color: 'text-purple-600', tujuan_detail: [{ title: 'Kompetisi Non-Akademik', deskripsi: 'Lomba antar kelas.' }, { title: 'Pengalaman Wirausaha', deskripsi: 'Market Day nyata.' }], ketua_nama: 'Pengurus OSIS', ketua_jabatan: 'Penanggung Jawab Program' },
    { judul: 'Cleaning Day', slug: 'cleaning-day', kategori: 'rutin', sekbid_nomor: 6, tujuan: 'Kerja bakti kebersihan sekolah.', teknis_pelaksanaan: 'Jumat pagi.', evaluasi_deskripsi: 'Rekap kebersihan.', evaluasi_form_url: '#', bg_color: 'bg-teal-50', icon_color: 'text-teal-600', tujuan_detail: [{ title: 'Kesadaran Kebersihan', deskripsi: 'Lingkungan bersih.' }, { title: 'Kerja Bakti Rutin', deskripsi: 'Jumat pagi.' }], ketua_nama: 'Pengurus OSIS', ketua_jabatan: 'Penanggung Jawab Program' },
    { judul: 'Healthy Movement', slug: 'healthy-movement', kategori: 'rutin', sekbid_nomor: 6, tujuan: 'Senam bersama hidup sehat.', teknis_pelaksanaan: 'Rabu pagi.', evaluasi_deskripsi: 'Kehadiran.', evaluasi_form_url: '#', bg_color: 'bg-emerald-50', icon_color: 'text-emerald-600', tujuan_detail: [{ title: 'Kesehatan Tubuh', deskripsi: 'Senam rutin.' }, { title: 'Senam Rutin', deskripsi: 'Hari Rabu.' }], ketua_nama: 'Pengurus OSIS', ketua_jabatan: 'Penanggung Jawab Program' },
    { judul: 'Weekly Market', slug: 'weekly-market', kategori: 'rutin', sekbid_nomor: 7, tujuan: 'Wirausaha pengurus OSIS.', teknis_pelaksanaan: 'Penjualan 2x seminggu.', evaluasi_deskripsi: 'Laporan keuangan.', evaluasi_form_url: '#', bg_color: 'bg-emerald-50', icon_color: 'text-emerald-600', tujuan_detail: [{ title: 'Kemampuan Wirausaha', deskripsi: 'Praktek bisnis.' }, { title: 'Dana Organisasi', deskripsi: 'Dana operasional.' }], ketua_nama: 'Pengurus OSIS', ketua_jabatan: 'Penanggung Jawab Program' },
    { judul: 'Ngobrol Bisnis (NGOBISS)', slug: 'ngobrol-bisnis', kategori: 'rutin', sekbid_nomor: 7, tujuan: 'Wawancara pengusaha sukses.', teknis_pelaksanaan: 'Wawancara bisnis.', evaluasi_deskripsi: 'Analytics.', evaluasi_form_url: '#', bg_color: 'bg-amber-50', icon_color: 'text-amber-600', tujuan_detail: [{ title: 'Inspirasi Bisnis', deskripsi: 'Ilmu wirausaha.' }, { title: 'Wawancara Pengusaha', deskripsi: 'Sharing pengusaha.' }], ketua_nama: 'Pengurus OSIS', ketua_jabatan: 'Penanggung Jawab Program' },
    { judul: 'School Announcement', slug: 'school-announcement', kategori: 'rutin', sekbid_nomor: 8, tujuan: 'Pengumuman resmi sekolah.', teknis_pelaksanaan: 'Media digital OSIS.', evaluasi_deskripsi: 'Feedback.', evaluasi_form_url: '#', bg_color: 'bg-blue-50', icon_color: 'text-blue-600', tujuan_detail: [{ title: 'Media Resmi', deskripsi: 'Pengumuman sekolah.' }, { title: 'Akses Mudah', deskripsi: 'Informasi cepat.' }], ketua_nama: 'Pengurus OSIS', ketua_jabatan: 'Penanggung Jawab Program' },
    { judul: 'SiteStream', slug: 'sites-stream', kategori: 'rutin', sekbid_nomor: 8, tujuan: 'Website resmi OSIS.', teknis_pelaksanaan: 'Website portal OSIS.', evaluasi_deskripsi: 'Traffic analytics.', evaluasi_form_url: '#', bg_color: 'bg-teal-50', icon_color: 'text-teal-600', tujuan_detail: [{ title: 'Website Resmi', deskripsi: 'Portal OSIS.' }, { title: 'Akses Publik', deskripsi: 'Informasi publik.' }], ketua_nama: 'Pengurus OSIS', ketua_jabatan: 'Penanggung Jawab Program' },
    { judul: 'Pengelolaan Sosial Media', slug: 'social-media', kategori: 'rutin', sekbid_nomor: 8, tujuan: 'Publikasi media sosial.', teknis_pelaksanaan: 'Konten Instagram & TikTok.', evaluasi_deskripsi: 'Reach analytics.', evaluasi_form_url: '#', bg_color: 'bg-indigo-50', icon_color: 'text-indigo-600', tujuan_detail: [{ title: 'Jangkauan Luas', deskripsi: 'Publikasi digital.' }, { title: 'Media Sosial', deskripsi: 'Sosmed OSIS.' }], ketua_nama: 'Pengurus OSIS', ketua_jabatan: 'Penanggung Jawab Program' },
    { judul: 'Majalah Dinding (Mading)', slug: 'mading', kategori: 'rutin', sekbid_nomor: 8, tujuan: 'Mading fisik sekolah.', teknis_pelaksanaan: 'Pembaruan mading.', evaluasi_deskripsi: 'Monitoring mading.', evaluasi_form_url: '#', bg_color: 'bg-amber-50', icon_color: 'text-amber-600', tujuan_detail: [{ title: 'Kreativitas', deskripsi: 'Karya siswa.' }, { title: 'Media Offline', deskripsi: 'Mading sekolah.' }], ketua_nama: 'Pengurus OSIS', ketua_jabatan: 'Penanggung Jawab Program' },
    { judul: 'Studio OSIS', slug: 'studio-osis', kategori: 'rutin', sekbid_nomor: 8, tujuan: 'Produksi media visual.', teknis_pelaksanaan: 'Pembuatan video & poster.', evaluasi_deskripsi: 'Laporan konten.', evaluasi_form_url: '#', bg_color: 'bg-purple-50', icon_color: 'text-purple-600', tujuan_detail: [{ title: 'Konten Visual', deskripsi: 'Desain & video.' }, { title: 'Lintas Sekbid', deskripsi: 'Dukungan media.' }], ketua_nama: 'Pengurus OSIS', ketua_jabatan: 'Penanggung Jawab Program' },
  ];

  for (const pk of programKerjaData) {
    const sekbidId = sekbidMap.get(pk.sekbid_nomor);
    const created = await strapi.documents('api::program-kerja.program-kerja').create({
      data: {
        judul: pk.judul,
        slug: pk.slug,
        kategori: pk.kategori,
        tujuan: pk.tujuan,
        teknis_pelaksanaan: pk.teknis_pelaksanaan,
        evaluasi_deskripsi: pk.evaluasi_deskripsi,
        evaluasi_form_url: pk.evaluasi_form_url,
        tampilkan_evaluasi: true,
        bg_color: pk.bg_color,
        icon_color: pk.icon_color,
        tujuan_detail: pk.tujuan_detail,
        ketua_nama: pk.ketua_nama,
        ketua_jabatan: pk.ketua_jabatan,
        status: 'published',
        sekbid: sekbidId ? { id: sekbidId } : undefined,
      } as any,
    });
    if (created && created.documentId) {
      await strapi.documents('api::program-kerja.program-kerja').publish({ documentId: created.documentId });
    }
  }
  strapi.log.info(`  ✅ Created ${programKerjaData.length} Program Kerja entries`);

  // 4. Seed Events
  const createdEvent = await strapi.documents('api::event.event').create({
    data: {
      nama: 'EDUFEST - INFINITY',
      slug: 'edufest-infinity',
      deskripsi: 'Edufest merupakan event tahunan yang dilaksanakan oleh SMA IT Fithrah Insani dan SMK Informatika Fithrah Insani yang berisi kegiatan perlombaan untuk mewadahi bakat kreatif Siswa/i SMP/MTs sederajat dalam bidang Pendidikan dan Teknologi, serta melatih meningkatkan kepedulian terhadap sesama manusia melalui kegiatan amal.',
      kategori: 'eksternal',
      status: 'published',
      tema: 'Ketakterbatasan Potensi Bakat Remaja',
      tagline: 'Growing Talents Beyond Infinity',
      youtube_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    } as any,
  });
  if (createdEvent && createdEvent.documentId) {
    await strapi.documents('api::event.event').publish({ documentId: createdEvent.documentId });
  }
  // 5. Seed Media Assets
  const mediaAssetData = [
    { key: 'about-collaboration', judul: 'Kolaborasi OSIS Agora Acta', kategori: 'about', tipe_media: 'foto', url_external: '/media/about/osis_about_collaboration.jpg', deskripsi: 'Foto Kolaborasi OSIS' },
    { key: 'about-leadership', judul: 'Kepemimpinan OSIS Agora Acta', kategori: 'about', tipe_media: 'foto', url_external: '/media/about/osis_about_leadership.jpg', deskripsi: 'Foto Kepemimpinan OSIS' },
    { key: 'bg-soundtrack', judul: 'Soundtrack Background Music Website', kategori: 'audio', tipe_media: 'audio', url_external: '/sounds/Aidentity.mp3', deskripsi: 'Musik Latar Website OSIS' },
    { key: 'sosmed-bg', judul: 'Sosmed Hub Background', kategori: 'sosmed', tipe_media: 'foto', url_external: '/media/sosmed/sosmed_bg.jpg', deskripsi: 'Background Halaman Sosmed Hub' },
    { key: 'ticker-1', judul: 'Documentation 1', kategori: 'ticker', tipe_media: 'foto', url_external: '/images/hover-1.JPG', urutan: 1 },
    { key: 'ticker-2', judul: 'Documentation 2', kategori: 'ticker', tipe_media: 'foto', url_external: '/images/hover-2.JPG', urutan: 2 },
    { key: 'ticker-3', judul: 'Documentation 3', kategori: 'ticker', tipe_media: 'foto', url_external: '/images/hover-3.HEIC', urutan: 3 },
  ];

  for (const ma of mediaAssetData) {
    const created = await (strapi.documents as any)('api::media-asset.media-asset').create({
      data: ma as any,
    });
    if (created && created.documentId) {
      await (strapi.documents as any)('api::media-asset.media-asset').publish({ documentId: created.documentId });
    }
  }
  strapi.log.info(`  ✅ Created ${mediaAssetData.length} Media Asset entries`);

  strapi.log.info('🎉 Initial seeding completed successfully!');
}

async function seedHalamanUtama(strapi: Core.Strapi) {
  try {
    const existingMediaSosial = await (strapi.documents as any)('api::halaman.halaman').findMany({
      filters: { slug: 'media-sosial' }
    });

    const defaultMetadata = {
      social_accounts: {
        instagram: { name: 'Osis SMAIT FI', handle: '@osissmaitfi', followers: '1,203', link: 'https://www.instagram.com/osissmaitfi' },
        tiktok: { name: 'Osis SMAIT FI', handle: '@osissmaitfi', followers: '144', link: 'https://www.tiktok.com/@osissmaitfi' },
        youtube: { name: 'SMAIT Fithrah Insani', handle: '@osissmaitfithrahinsani9481', followers: '267', link: 'https://www.youtube.com/@osissmaitfithrahinsani9481' },
        spotify: { name: 'Agora Talk', handle: 'OSIS Podcast', followers: '436', link: 'https://spotify.com' }
      },
      embeds: {
        youtube: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        spotify: 'https://open.spotify.com/episode/3Zg0z8C6f1z',
        tiktok: '',
        instagram: ''
      }
    };

    if (existingMediaSosial && existingMediaSosial.length > 0) {
      const target = existingMediaSosial[0];
      if (!target.metadata_json) {
        await (strapi.documents as any)('api::halaman.halaman').update({
          documentId: target.documentId,
          data: {
            metadata_json: defaultMetadata,
            embed_youtube: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
            embed_spotify: 'https://open.spotify.com/episode/3Zg0z8C6f1z',
            link_instagram: 'https://www.instagram.com/osissmaitfi',
            link_tiktok: 'https://www.tiktok.com/@osissmaitfi',
            link_youtube: 'https://www.youtube.com/@osissmaitfithrahinsani9481',
            link_spotify: 'https://spotify.com',
          }
        });
        await (strapi.documents as any)('api::halaman.halaman').publish({ documentId: target.documentId });
        strapi.log.info('  ✅ Restored metadata_json and social links for Halaman Media Sosial');
      }
    }
  } catch (err: any) {
    strapi.log.warn('⚠️ Error updating Media Sosial entry: ' + err.message);
  }

  const countHalaman = await (strapi.documents as any)('api::halaman.halaman').count({});
  if (countHalaman > 0) {
    return;
  }

  strapi.log.info('🌱 Seeding Halaman Utama entries...');
  const halamanData = [
    {
      nama_halaman: 'Partners & Contributors',
      slug: 'partners',
      judul_hero: 'Partners & Contributors',
      sub_judul: 'Sinergi, Kolaborasi & Mitra Strategis OSIS Agora Acta',
      deskripsi: 'Wadah apreasiasi bagi seluruh mitra, sponsor, dan kontributor yang bergerak bersama mendukung setiap program dan inisiatif OSIS SMAIT Fithrah Insani.',
      seo_title: 'Partners & Contributors | OSIS SMAIT Fithrah Insani',
      seo_description: 'Mitra strategis, sponsor, dan kontributor pendukung OSIS SMAIT Fithrah Insani Agora Acta.',
      is_active: true,
    },
    {
      nama_halaman: 'Beranda Utama',
      slug: 'home',
      judul_hero: 'OSIS SMAIT FITHRAH INSANI',
      sub_judul: 'Dari Gagasan Menuju Aksi,\ndari Partisipasi Menuju Kontribusi',
      deskripsi: 'Agora Acta bukan sekadar organisasi, melainkan ruang bersama tempat ide bertumbuh, kolaborasi terjadi, dan setiap kegiatan dihadirkan dengan tujuan yang nyata.',
      overlay_text: 'Bergerak\nBersama,\nMenciptakan Jejak\nPositif',
      bg_color: '#185FA5',
      dot_color: 'rgba(0, 0, 0, 0.25)',
      dot_size: '2.5px',
      dot_gap: '24px 24px',
      seo_title: 'Beranda | OSIS SMAIT Fithrah Insani',
      seo_description: 'Selamat datang di portal resmi OSIS SMAIT Fithrah Insani Agora Acta 2025.',
      is_active: true,
    },
    {
      nama_halaman: 'Tentang Kami',
      slug: 'about',
      judul_hero: 'Tentang OSIS SMAIT FI',
      sub_judul: 'Profil, Visi, Misi & Kabinet Agora Acta',
      deskripsi: 'Mengenal lebih dekat struktur kepengurusan, nilai dasar, dan perjalanan OSIS SMAIT Fithrah Insani.',
      seo_title: 'Tentang Kami | OSIS SMAIT Fithrah Insani',
      seo_description: 'Profil, Visi, Misi, dan Struktur Kabinet OSIS SMAIT Fithrah Insani.',
      is_active: true,
    },
    {
      nama_halaman: 'Program Kerja',
      slug: 'program-kerja',
      judul_hero: 'Program Kerja & Sekbid',
      sub_judul: 'Inisiatif dan Kegiatan 8 Seksi Bidang',
      deskripsi: 'Daftar lengkap program kerja unggulan, rutinan, dan insidental dari setiap Seksi Bidang.',
      seo_title: 'Program Kerja | OSIS SMAIT Fithrah Insani',
      seo_description: 'Program kerja dan agenda kegiatan Seksi Bidang OSIS SMAIT Fithrah Insani.',
      is_active: true,
    },
    {
      nama_halaman: 'Media Sosial',
      slug: 'media-sosial',
      judul_hero: 'Hub Media Sosial',
      sub_judul: 'Koneksi dan Terhubung dengan Kami',
      deskripsi: 'Kanal resmi media sosial OSIS SMAIT Fithrah Insani (Instagram, TikTok, YouTube, Spotify).',
      seo_title: 'Media Sosial | OSIS SMAIT Fithrah Insani',
      seo_description: 'Saluran media sosial resmi OSIS SMAIT Fithrah Insani.',
      is_active: true,
      metadata_json: {
        social_accounts: {
          instagram: { name: 'Osis SMAIT FI', handle: '@osissmaitfi', followers: '1,203', link: 'https://www.instagram.com/osissmaitfi' },
          tiktok: { name: 'Osis SMAIT FI', handle: '@osissmaitfi', followers: '144', link: 'https://www.tiktok.com/@osissmaitfi' },
          youtube: { name: 'SMAIT Fithrah Insani', handle: '@osissmaitfithrahinsani9481', followers: '267', link: 'https://www.youtube.com/@osissmaitfithrahinsani9481' },
          spotify: { name: 'Agora Talk', handle: 'OSIS Podcast', followers: '436', link: 'https://spotify.com' }
        },
        embeds: {
          youtube: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
          spotify: 'https://open.spotify.com/episode/3Zg0z8C6f1z',
          tiktok: '',
          instagram: ''
        }
      }
    },
    {
      nama_halaman: 'Anggota OSIS',
      slug: 'anggota',
      judul_hero: 'Pengurus OSIS',
      sub_judul: 'Struktur & Anggota Kabinet Agora Acta',
      deskripsi: 'Daftar pengurus BPH dan Sekbid OSIS SMAIT Fithrah Insani periode 2025.',
      seo_title: 'Anggota | OSIS SMAIT Fithrah Insani',
      seo_description: 'Daftar pengurus dan struktur organisasi OSIS SMAIT Fithrah Insani.',
      is_active: true,
    },
    {
      nama_halaman: 'Kebijakan Privasi',
      slug: 'privacy-policy',
      judul_hero: 'Kebijakan Privasi',
      sub_judul: 'Perlindungan Data & Ketentuan Privasi Pengguna',
      deskripsi: 'Kebijakan Privasi ini menjelaskan komitmen OSIS SMAIT Fithrah Insani dalam menjaga privasi dan keamanan data pengunjung situs web.',
      seo_title: 'Kebijakan Privasi | OSIS SMAIT Fithrah Insani',
      seo_description: 'Kebijakan Privasi resmi OSIS SMAIT Fithrah Insani.',
      is_active: true,
    },
  ];

  for (const h of halamanData) {
    const created = await (strapi.documents as any)('api::halaman.halaman').create({
      data: h as any,
    });
    if (created && created.documentId) {
      await (strapi.documents as any)('api::halaman.halaman').publish({ documentId: created.documentId });
    }
  }
  strapi.log.info(`  ✅ Created ${halamanData.length} Halaman Utama entries`);
}

async function publishExistingDrafts(strapi: Core.Strapi) {
  const contentTypes = [
    'api::sekbid.sekbid',
    'api::program-kerja.program-kerja',
    'api::anggota-osis.anggota-osis',
    'api::event.event',
    'api::media-asset.media-asset',
    'api::halaman.halaman',
    'api::edufest-division.edufest-division',
    'api::edufest-member.edufest-member',
    'api::edufest-timeline.edufest-timeline',
    'api::partner.partner',
  ];

  for (const uid of contentTypes) {
    try {
      const drafts = await strapi.documents(uid as any).findMany({ status: 'draft' });
      if (drafts && drafts.length > 0) {
        for (const doc of drafts) {
          if (doc.documentId) {
            await strapi.documents(uid as any).publish({ documentId: doc.documentId });
          }
        }
        strapi.log.info(`  ✅ Published ${drafts.length} ${uid} entries`);
      }
    } catch (e) {
      // Ignore if document service fails for an item
    }
  }
}

async function seedEdufestData(strapi: Core.Strapi) {
  try {
    // 1. Seed Edufest Config
    const configCount = await (strapi.documents as any)('api::edufest-config.edufest-config').count({});
    if (configCount === 0) {
      await (strapi.documents as any)('api::edufest-config.edufest-config').create({
        data: {
          title: 'INFINITY - Edufest 2025',
          tagline: 'Growing Talents Beyond Infinity',
          event_date: '13-14 Februari 2025',
          about_title: 'About Edufest',
          about_text: 'Edufest merupakan event rutin yang dilaksanakan oleh SMA IT Fithrah Insani dan SMK Informatika Fithrah Insani yang berisi kegiatan perlombaan untuk mewadahi bakat kreatif Siswa/i SMP/MTs sederajat dalam bidang Pendidikan dan Teknologi, serta melatih meningkatkan kepedulian terhadap sesama manusia melalui kegiatan amal.',
          selayang_title: 'Selayang Pandang',
          selayang_text: 'Tema "Ketakterbatasan Potensi Bakat Remaja" diangkat karena kekhawatiran mengenai remaja Indonesia yang takut mencoba hal baru, keluar dari zona nyamannya, dan malu peduli dengan lingkungan sekitar.',
          location_name: 'SMA dan SMK Fithrah Insani',
          maps_embed_url: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2984.2941894147434!2d107.52111289259334!3d-6.8650087692923354!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e68e489587729b1%3A0xa3166256027d8007!2sSMA%20dan%20SMK%20Fithrah%20Insani!5e1!3m2!1sid!2sid!4v1767604243358!5m2!1sid!2sid',
          scenes: [
            { scene_id: 'intro', title: 'Aidentity', subtitle: 'INFINITY - Edufest 2025', active: true },
            { scene_id: 'one', title: 'Potential • Hope • Opportunity', active: true },
            { scene_id: 'about', title: 'About Edufest', active: true },
            { scene_id: 'selayang', title: 'Selayang Pandang', active: true },
            { scene_id: 'interactive', title: 'Join Us', active: true }
          ]
        } as any
      });
      strapi.log.info('  ✅ Seeded Edufest Config');
    }

    // 2. Seed Edufest Divisions & Members
    const divCount = await (strapi.documents as any)('api::edufest-division.edufest-division').count({});
    if (divCount === 0) {
      const committeeData = [
        {
          name: "Panitia Inti",
          slug: "panitia-inti",
          type: "core",
          order: 1,
          members: [
            { name: "Muhammad Azzam Firdaus", role: "主席 (Ketua Umum)", order: 1 },
            { name: "Novel Windu Fajrian", role: "副主席 (Waket)", order: 2 },
            { name: "Muhammad Hammam Jundurrahman", role: "秘书 (Sek)", order: 3 },
            { name: "Rakean Eka Lingga Wardana", role: "财务 (Bend)", order: 4 }
          ]
        },
        {
          name: "Divisi Acara",
          slug: "divisi-acara",
          type: "division",
          coordinator_name: "Surya SIGIT",
          order: 2,
          members: [
            { name: "Raihanah Ghina Eltsurayya", order: 1 },
            { name: "Wania Auliya Ramadani", order: 2 },
            { name: "Radytia Nur Hidayah", order: 3 },
            { name: "Aqila Al Humaira", order: 4 },
            { name: "Namira Putri Fachruddin", order: 5 },
            { name: "Al Fajri Alif Aumi", order: 6 },
            { name: "Muhammad Irsyad Kaamil Pasha", order: 7 },
            { name: "Achmad Anshor", order: 8 },
            { name: "Muhammad Haidar Al Ayyubi", order: 9 }
          ]
        },
        {
          name: "Divisi Lomba",
          slug: "divisi-lomba",
          type: "division",
          coordinator_name: "Shyfa Putri Azzahra",
          order: 3,
          members: [
            { name: "Irsyad Muthi Amrullah", order: 1 },
            { name: "Almer Shaquelle Althafurrahmad Darmawan", order: 2 },
            { name: "Lian Muhamad Yaqzan", order: 3 },
            { name: "Yussie Yukennita Ramadani", order: 4 },
            { name: "Saskia Meka Tadriana", order: 5 },
            { name: "Fathimah Taslimah Rahma Fachelfi", order: 6 },
            { name: "Thifani Arifa Khilfa H.", order: 7 },
            { name: "Aina Rahma Aulia", order: 8 },
            { name: "Fathurrochman Roziq", order: 9 },
            { name: "Qaila Nusaybah Amani", order: 10 }
          ]
        },
        {
          name: "Konsumsi & P3K",
          slug: "konsumsi-p3k",
          type: "division",
          coordinator_name: "Kayyisa Fathiyyah",
          order: 4,
          members: [
            { name: "Fatiya Kayisah Az-Zahra", order: 1 },
            { name: "Zalfa Nur Afifa Zakauha", order: 2 },
            { name: "Afiqoh Dayini Ataullah Purwana", order: 3 },
            { name: "Alifah Shafina Amanda", order: 4 },
            { name: "Raissa Zalika Sadina", order: 5 },
            { name: "Afiyah Fitriyani Ramadani", order: 6 }
          ]
        },
        {
          name: "Humbas",
          slug: "humbas",
          type: "division",
          coordinator_name: "Jasmine Vanya Aberka",
          order: 5,
          members: [
            { name: "Khalisa Kasih Anindya Kirani Putri", order: 1 },
            { name: "Adhwa Nabilah Putri Marsilan", order: 2 },
            { name: "Ananda P. Pratama", order: 3 },
            { name: "Irvan Ramadhan Syahputra", order: 4 },
            { name: "Keysha Cleo Rustandi", order: 5 },
            { name: "Nafeeza Keysyakura Albanna", order: 6 },
            { name: "Muhammad Rizky Tantana", order: 7 }
          ]
        },
        {
          name: "Kesekretariatan",
          slug: "kesekretariatan",
          type: "division",
          coordinator_name: "Rizka Rasyidah",
          order: 6,
          members: [
            { name: "Vanesha Sesillawati", order: 1 },
            { name: "Azkarin Fidelya Khansabira", order: 2 },
            { name: "Hanum Salsabila", order: 3 },
            { name: "Fathian Akbar", order: 4 },
            { name: "Zaki Ibrahim Azis", order: 5 },
            { name: "Raihan Putra Arifandra", order: 6 }
          ]
        },
        {
          name: "Keamanan",
          slug: "keamanan",
          type: "division",
          coordinator_name: "Abdurrahman Taqi Prasetyo",
          order: 7,
          members: [
            { name: "Khaidar Miftah Badruzzaman", order: 1 },
            { name: "Ray Zibril Ridwan", order: 2 },
            { name: "Zulfan Arifin Rustandi", order: 3 },
            { name: "Ahwan M. Ka’bah", order: 4 },
            { name: "Hadziq Mahfuz Muhammad", order: 5 },
            { name: "Reyfa Saffa Maheswara", order: 6 },
            { name: "Alfian Pramudya", order: 7 },
            { name: "Prananda Ramadhan Ahmad", order: 8 }
          ]
        },
        {
          name: "Pubdok",
          slug: "pubdok",
          type: "division",
          coordinator_name: "Keysha Nafidha Almira Gunawan",
          order: 8,
          members: [
            { name: "Keanu Reivan Agasha", order: 1 },
            { name: "Firjatullah Ar-Rizqu Syakira H.", order: 2 },
            { name: "Aliya Marwa Ruwaida", order: 3 },
            { name: "Muhammad Syarif Attabi", order: 4 },
            { name: "Muhammad Fahmi Ramadhani F.", order: 5 },
            { name: "Aluna Adelia Putri", order: 6 },
            { name: "Syarla Syafana Dewi", order: 7 },
            { name: "Aisyah", order: 8 }
          ]
        },
        {
          name: "Liaison Officer (LO)",
          slug: "liaison-officer",
          type: "division",
          coordinator_name: "Adhiena Zahra Rizkya",
          order: 9,
          members: [
            { name: "Aisha Ghassani Shaliha", order: 1 },
            { name: "Masagus Hafidhuddin", order: 2 },
            { name: "Irsyad Ashavin", order: 3 },
            { name: "Rashika Rizquena", order: 4 },
            { name: "Anakia Munggaranti Yusan", order: 5 },
            { name: "Rizki Nur Muzaki Parno Putra", order: 6 },
            { name: "Laila Khusfi Zahrani", order: 7 },
            { name: "Rhesa Adilfi Darma S.", order: 8 }
          ]
        }
      ];

      for (const d of committeeData) {
        const createdDiv = await (strapi.documents as any)('api::edufest-division.edufest-division').create({
          data: {
            name: d.name,
            slug: d.slug,
            type: d.type,
            coordinator_name: d.coordinator_name || null,
            order: d.order
          } as any
        });
        if (createdDiv && createdDiv.documentId) {
          await (strapi.documents as any)('api::edufest-division.edufest-division').publish({ documentId: createdDiv.documentId });
          for (const m of d.members) {
            const createdMem = await (strapi.documents as any)('api::edufest-member.edufest-member').create({
              data: {
                name: m.name,
                role: (m as any).role || undefined,
                order: m.order,
                division: { id: createdDiv.id }
              } as any
            });
            if (createdMem && createdMem.documentId) {
              await (strapi.documents as any)('api::edufest-member.edufest-member').publish({ documentId: createdMem.documentId });
            }
          }
        }
      }
      strapi.log.info('  ✅ Seeded Edufest Divisions and Committee Members');
    }

    // 3. Seed Edufest Timeline
    const timeCount = await (strapi.documents as any)('api::edufest-timeline.edufest-timeline').count({});
    if (timeCount === 0) {
      const timelineData = [
        {
          year: "2017",
          date_label: "19 Februari 2017",
          theme: "Pentas Seni, Perlombaan, Penggalangan Dana",
          participants: "500 (Peserta & Audiens)",
          order: 1,
          guests: [
            { name: "Shoutul Harokah", object_position: "50% 35%" },
            { name: "Ebith Beat A", object_position: "50% 50%" }
          ]
        },
        {
          year: "2018",
          date_label: "16–17 Februari 2018",
          theme: "It’s Time To Shine",
          participants: "625 (Peserta & Audiens)",
          order: 2,
          guests: [
            { name: "Ust. Zae Hannan" },
            { name: "Syekh Nashif Nashir" },
            { name: "Ali Sastra" }
          ]
        },
        {
          year: "2019",
          date_label: "16–17 Februari 2019",
          theme: "Prove Our Ability Show Our Creativity",
          participants: "760 (Peserta & Audiens)",
          order: 3,
          guests: [
            { name: "Ridwan Hafidz" },
            { name: "Ibnu The Jenggot" }
          ]
        },
        {
          year: "2020",
          date_label: "14 Februari 2020",
          theme: "ANAGATA: Today For The Future",
          participants: "800 (Peserta & Audiens)",
          order: 4,
          guests: [
            { name: "Kang Yan Hidayatullah" },
            { name: "Aleehya" }
          ]
        },
        {
          year: "2023",
          date_label: "13–14 Februari 2023",
          theme: "Universe: Be The Best In The Universe (Kajian Palestina, Bazaar)",
          participants: "900 (Peserta & Audiens)",
          order: 5,
          guests: [
            { name: "Genya" },
            { name: "Ust. Handy Bonny" }
          ]
        },
        {
          year: "2024",
          date_label: "18–19 Februari 2024",
          theme: "Unity: Unity In Diversity",
          participants: "1000 (Peserta & Audiens)",
          order: 6,
          guests: [
            { name: "Ustadzah Haneen Akira" }
          ]
        },
        {
          year: "2025",
          date_label: "13–14 Februari 2025",
          theme: "Aidentity: Amazing Intelligence, Delightful Entertain and Humanity",
          participants: "1500 (Peserta & Audiens)",
          order: 7,
          guests: [
            { name: "Fajri (Unity)" },
            { name: "Zein Permana", object_position: "50% 35%" },
            { name: "Ray Shareza" }
          ]
        },
        {
          year: "2026",
          date_label: "13–14 Februari 2026",
          theme: "Infinity: Growing Talents Beyond Infinity",
          participants: "To Be Continued",
          order: 8,
          guests: []
        }
      ];

      for (const t of timelineData) {
        const createdT = await (strapi.documents as any)('api::edufest-timeline.edufest-timeline').create({
          data: t as any
        });
        if (createdT && createdT.documentId) {
          await (strapi.documents as any)('api::edufest-timeline.edufest-timeline').publish({ documentId: createdT.documentId });
        }
      }
      strapi.log.info('  ✅ Seeded Edufest Timeline events');
    }
  } catch (err: any) {
    strapi.log.warn('⚠️ Error seeding Edufest data: ' + err.message);
  }
}

async function seedPartnerData(strapi: Core.Strapi) {
  try {
    const count = await (strapi.documents as any)('api::partner.partner').count({});
    if (count === 0) {
      const samplePartners = [
        {
          nama: 'SMAIT Fithrah Insani',
          role: 'Pembina & Instansi Utama',
          deskripsi: 'Sekolah Menengah Atas Islam Terpadu Fithrah Insani Bandung Barat.',
          urutan: 1,
          is_active: true,
          tags: ['Sekolah', 'Pembina'],
        },
        {
          nama: 'Komite Sekolah SMAIT FI',
          role: 'Mitra Orang Tua & Pendukung',
          deskripsi: 'Komite Orang Tua Murid SMAIT Fithrah Insani.',
          urutan: 2,
          is_active: true,
          tags: ['Komite', 'Sponsor'],
        },
      ];

      for (const p of samplePartners) {
        const createdP = await (strapi.documents as any)('api::partner.partner').create({
          data: p as any,
        });
        if (createdP && createdP.documentId) {
          await (strapi.documents as any)('api::partner.partner').publish({ documentId: createdP.documentId });
        }
      }
      strapi.log.info('  ✅ Seeded Partner entries');
    }
  } catch (err: any) {
    strapi.log.warn('⚠️ Error seeding Partner data: ' + err.message);
  }
}

