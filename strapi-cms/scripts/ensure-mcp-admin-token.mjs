#!/usr/bin/env node
/**
 * Create (or rotate) a Strapi Admin token for MCP (Cursor / Claude Code).
 *
 * Modes:
 *   1) HTTP (default if STRAPI_ADMIN_PASSWORD set):
 *        login → POST /admin/admin-tokens
 *   2) Bootstrap (no password): loads Strapi once, uses api-token-admin service.
 *
 * Scope default `content` = visitor CTs + upload (no MUBES/PII).
 * MCP_TOKEN_SCOPE=full → all explorer + upload actions registered in the app.
 *
 * Writes plaintext once to ~/.config/agoraacta/strapi-mcp.token (mode 600).
 *
 *   node scripts/ensure-mcp-admin-token.mjs
 *   node scripts/ensure-mcp-admin-token.mjs --rotate
 *   node scripts/ensure-mcp-admin-token.mjs --bootstrap --rotate
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { homedir } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const require = createRequire(join(ROOT, 'package.json'));

function loadEnvFile(path) {
  if (!existsSync(path)) return;
  for (const line of readFileSync(path, 'utf8').split('\n')) {
    const t = line.trim();
    if (!t || t.startsWith('#') || !t.includes('=')) continue;
    const i = t.indexOf('=');
    const k = t.slice(0, i).trim();
    let v = t.slice(i + 1).trim();
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
      v = v.slice(1, -1);
    }
    if (process.env[k] === undefined) process.env[k] = v;
  }
}
loadEnvFile(join(ROOT, '.env'));

const API_URL = (process.env.STRAPI_URL || 'http://127.0.0.1:1337').replace(/\/$/, '');
const ADMIN_EMAIL = process.env.STRAPI_ADMIN_EMAIL || '';
const ADMIN_PASSWORD = process.env.STRAPI_ADMIN_PASSWORD || '';
const TOKEN_NAME = process.env.STRAPI_MCP_TOKEN_NAME || 'cursor-claude-mcp-content';
const SCOPE = (process.env.MCP_TOKEN_SCOPE || 'content').toLowerCase();
const ROTATE = process.argv.includes('--rotate');
const FORCE_BOOTSTRAP =
  process.argv.includes('--bootstrap') || process.env.MCP_TOKEN_MODE === 'bootstrap';
const CONFIG_DIR = join(homedir(), '.config', 'agoraacta');
const TOKEN_FILE = join(CONFIG_DIR, 'strapi-mcp.token');

const CM = {
  read: 'plugin::content-manager.explorer.read',
  create: 'plugin::content-manager.explorer.create',
  update: 'plugin::content-manager.explorer.update',
  delete: 'plugin::content-manager.explorer.delete',
  publish: 'plugin::content-manager.explorer.publish',
};

const CONTENT_UIDS = [
  'api::halaman.halaman',
  'api::artikel-mading.artikel-mading',
  'api::event.event',
  'api::sekbid.sekbid',
  'api::program-kerja.program-kerja',
  'api::anggota-osis.anggota-osis',
  'api::galeri-foto.galeri-foto',
  'api::partner.partner',
  'api::media-asset.media-asset',
  'api::edufest-config.edufest-config',
  'api::edufest-division.edufest-division',
  'api::edufest-member.edufest-member',
  'api::edufest-timeline.edufest-timeline',
  'api::bg-texture-config.bg-texture-config',
  'api::footer-config.footer-config',
  'api::navbar-config.navbar-config',
];

function contentAdminPermissions() {
  const perms = [];
  for (const subject of CONTENT_UIDS) {
    for (const action of Object.values(CM)) {
      perms.push({ action, subject, properties: {}, conditions: [] });
    }
  }
  for (const action of [
    'plugin::upload.read',
    'plugin::upload.assets.create',
    'plugin::upload.assets.update',
  ]) {
    perms.push({ action, properties: {}, conditions: [] });
  }
  return perms;
}

function saveToken(accessKey, meta = {}) {
  mkdirSync(CONFIG_DIR, { recursive: true, mode: 0o700 });
  writeFileSync(TOKEN_FILE, accessKey + '\n', { mode: 0o600 });
  console.log(`Wrote token → ${TOKEN_FILE} (mode 600)`);
  if (meta.id) console.log(`Token id=${meta.id} name=${meta.name || TOKEN_NAME}`);
  console.log('\n--- Claude Code ---');
  console.log(
    `claude mcp remove strapi-mcp 2>/dev/null; claude mcp add strapi-mcp --transport http http://127.0.0.1:1337/mcp -H "Authorization: Bearer $(cat ${TOKEN_FILE})"`
  );
  console.log('\n--- Cursor header ---');
  console.log(`Authorization: Bearer <contents of ${TOKEN_FILE}>`);
  console.log(`URL: http://127.0.0.1:1337/mcp`);
}

async function viaHttp() {
  console.log(`Mode: HTTP login @ ${API_URL}`);
  const loginRes = await fetch(`${API_URL}/admin/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD }),
  });
  const loginBody = await loginRes.json().catch(() => ({}));
  if (!loginRes.ok) {
    throw new Error(`Admin login failed ${loginRes.status}: ${JSON.stringify(loginBody)}`);
  }
  const jwt = loginBody?.data?.token;
  if (!jwt) throw new Error('No JWT from admin login');

  const listRes = await fetch(`${API_URL}/admin/admin-tokens`, {
    headers: { Authorization: `Bearer ${jwt}` },
  });
  const listBody = await listRes.json().catch(() => ({}));
  if (!listRes.ok) throw new Error(`list tokens ${listRes.status}`);
  const existing = (listBody.data || []).filter((t) => t.name === TOKEN_NAME);

  if (existing.length && !ROTATE) {
    console.log(`Token "${TOKEN_NAME}" exists. Pass --rotate to mint a new key.`);
    if (existsSync(TOKEN_FILE)) console.log(`Local file: ${TOKEN_FILE}`);
    return;
  }

  for (const t of existing) {
    const del = await fetch(`${API_URL}/admin/admin-tokens/${t.id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${jwt}` },
    });
    if (!del.ok) console.warn(`revoke ${t.id} → ${del.status}`);
  }

  const createRes = await fetch(`${API_URL}/admin/admin-tokens`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${jwt}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: TOKEN_NAME,
      description: `MCP Cursor+Claude. scope=${SCOPE}`,
      lifespan: null,
      adminPermissions: contentAdminPermissions(),
    }),
  });
  const created = await createRes.json().catch(() => ({}));
  if (!createRes.ok) throw new Error(`create ${createRes.status}: ${JSON.stringify(created)}`);
  const accessKey = created?.data?.accessKey;
  if (!accessKey) throw new Error('No accessKey in create response');
  saveToken(accessKey, created.data);
}

async function viaBootstrap() {
  console.log('Mode: Strapi bootstrap (no admin password)');
  // Avoid port clash with running PM2 instance + skip mysql→sqlite fork noise
  process.env.PORT = process.env.MCP_BOOTSTRAP_PORT || '1338';
  process.env.HOST = '127.0.0.1';
  process.env.DB_SYNC_INTERVAL_MS = process.env.DB_SYNC_INTERVAL_MS || '0';
  process.env.MCP_BOOTSTRAP = '1';

  const { createStrapi } = require('@strapi/strapi');
  const app = await createStrapi({ distDir: join(ROOT, 'dist'), appDir: ROOT }).load();

  try {
    const userService = app.admin.services.user;
    const tokenService = app.admin.services['api-token-admin'];

    const users = await app.db.query('admin::user').findMany({
      where: { isActive: true },
      populate: ['roles'],
      limit: 20,
    });
    if (!users.length) throw new Error('No active admin user in DB');

    const superAdmin =
      users.find((u) => u.roles?.some((r) => r.code === 'strapi-super-admin')) || users[0];
    console.log(`Owner admin: ${superAdmin.email} (id=${superAdmin.id})`);

    // Load full user with roles for ceiling
    const callingUser = await userService.findOne(superAdmin.id);

    const existing = await app.db.query('admin::api-token').findMany({
      where: { name: TOKEN_NAME, kind: 'admin' },
    });

    if (existing.length && !ROTATE) {
      console.log(`Token "${TOKEN_NAME}" exists (ids=${existing.map((t) => t.id).join(',')}).`);
      console.log('Pass --rotate to revoke + recreate.');
      if (existsSync(TOKEN_FILE)) console.log(`Local file: ${TOKEN_FILE}`);
      return;
    }

    for (const t of existing) {
      console.log(`Revoking id=${t.id}…`);
      await tokenService.revoke(t.id);
    }

    let adminPermissions = contentAdminPermissions();
    if (SCOPE === 'full') {
      const ownerPerms = await app.admin.services.permission.findUserPermissions(callingUser);
      adminPermissions = ownerPerms
        .filter(
          (p) =>
            p.action?.startsWith('plugin::content-manager.explorer.') ||
            p.action?.startsWith('plugin::upload.')
        )
        .map((p) => ({
          action: p.action,
          subject: p.subject || undefined,
          properties: p.properties || {},
          conditions: [],
        }));
      console.log(`full scope: ${adminPermissions.length} owner explorer/upload perms`);
    }

    const created = await tokenService.create(
      {
        kind: 'admin',
        name: TOKEN_NAME,
        description: `MCP Cursor+Claude. scope=${SCOPE}. bootstrap script`,
        lifespan: null,
        adminPermissions,
      },
      callingUser
    );

    if (!created?.accessKey) throw new Error('Bootstrap create returned no accessKey');
    saveToken(created.accessKey, created);
  } finally {
    await app.destroy();
  }
}

async function main() {
  console.log(`Token name: ${TOKEN_NAME} | scope: ${SCOPE}`);
  if (FORCE_BOOTSTRAP || !ADMIN_PASSWORD) {
    if (!ADMIN_PASSWORD && !FORCE_BOOTSTRAP) {
      console.log('STRAPI_ADMIN_PASSWORD unset → bootstrap mode');
    }
    await viaBootstrap();
  } else {
    try {
      await viaHttp();
    } catch (err) {
      console.warn('HTTP mode failed:', err.message);
      console.warn('Falling back to bootstrap…');
      await viaBootstrap();
    }
  }
  console.log('\nDone.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
