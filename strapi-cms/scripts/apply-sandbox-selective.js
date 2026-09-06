const path = require('path');
const mysql = require('mysql2/promise');
const Database = require('better-sqlite3');

// Load environment variables from .env in strapi-cms root
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const isDryRun = process.argv.includes('--dry-run') || !process.argv.includes('--apply');

const sqlitePath = process.env.DATABASE_FILENAME || path.join(__dirname, '../.tmp/data_sandbox.db');

const mysqlConfig = {
  host: process.env.DATABASE_HOST || '192.168.101.19',
  port: parseInt(process.env.DATABASE_PORT || '3306', 10),
  database: process.env.DATABASE_NAME || 'strapi-osis-agoraacta',
  user: process.env.DATABASE_USERNAME || 'root',
  password: process.env.DATABASE_PASSWORD || 'root',
};

async function runSelectiveMigration() {
  console.log(`=======================================================`);
  console.log(` SELECTIVE SANDBOX TO PRODUCTION MIGRATION SCRIPT `);
  console.log(` Mode: ${isDryRun ? 'DRY-RUN (Simulasi - Tanpa Perubahan Data)' : 'LIVE APPLY (Transactional Execute)'}`);
  console.log(` Sandbox DB  : ${sqlitePath}`);
  console.log(` Target DB   : MySQL (${mysqlConfig.host}:${mysqlConfig.port}/${mysqlConfig.database})`);
  console.log(`=======================================================\n`);

  let mysqlConn;
  let sqliteDb;

  try {
    // 1. Connect to SQLite Sandbox
    try {
      sqliteDb = new Database(sqlitePath, { readonly: true });
      console.log('✔ Connected to SQLite Sandbox DB.');
    } catch (err) {
      console.error('✖ Failed to connect to SQLite Sandbox DB:', err.message);
      return;
    }

    // 2. Connect to Production MySQL
    try {
      mysqlConn = await mysql.createConnection(mysqlConfig);
      console.log('✔ Connected to Production MySQL DB.');
    } catch (err) {
      console.error('✖ Failed to connect to Production MySQL DB:', err.message);
      return;
    }

    if (!isDryRun) {
      await mysqlConn.beginTransaction();
      console.log('🔒 Database Transaction Started (Rollback Protection Active).');
    }

    // ----------------------------------------------------
    // TASK A: Selective Sync for `halamans`
    // ----------------------------------------------------
    console.log('\n--- [1/2] Processing Collection: Halaman Utama (`halamans`) ---');
    const sqliteHalamans = sqliteDb.prepare('SELECT * FROM halamans').all();
    console.log(`Found ${sqliteHalamans.length} records in Sandbox \`halamans\`.`);

    const fieldsToSyncHalamans = [
      'metadata_json',
      'mode_ukuran_frame',
      'layout_grid_dokumentasi',
      'bg_color',
      'dot_color',
      'dot_size',
      'dot_gap',
      'is_active'
    ];

    let halamansUpdated = 0;
    for (const sandboxRow of sqliteHalamans) {
      if (!sandboxRow.slug) continue;

      // Check if row exists in production MySQL
      const [prodRows] = await mysqlConn.query('SELECT * FROM `halamans` WHERE `slug` = ?', [sandboxRow.slug]);

      if (prodRows.length > 0) {
        const prodRow = prodRows[0];
        const updates = {};
        const updateFields = [];
        const updateParams = [];

        for (const field of fieldsToSyncHalamans) {
          if (sandboxRow[field] !== undefined && sandboxRow[field] !== null) {
            let sandboxVal = sandboxRow[field];
            let prodVal = prodRow[field];

            // Normalize JSON string comparison
            if (field === 'metadata_json') {
              const sandboxJsonStr = typeof sandboxVal === 'object' ? JSON.stringify(sandboxVal) : sandboxVal;
              const prodJsonStr = typeof prodVal === 'object' ? JSON.stringify(prodVal) : (typeof prodVal === 'string' ? prodVal : JSON.stringify(prodVal || {}));
              if (sandboxJsonStr !== prodJsonStr) {
                updates[field] = sandboxJsonStr;
              }
            } else if (sandboxVal !== prodVal) {
              updates[field] = sandboxVal;
            }
          }
        }

        if (Object.keys(updates).length > 0) {
          console.log(`  [UPDATE] Halaman slug "${sandboxRow.slug}":`);
          for (const [k, v] of Object.entries(updates)) {
            console.log(`    - ${k}: ${String(v).slice(0, 80)}...`);
            updateFields.push(`\`${k}\` = ?`);
            updateParams.push(v);
          }
          updateParams.push(sandboxRow.slug);

          if (!isDryRun) {
            const sql = `UPDATE \`halamans\` SET ${updateFields.join(', ')} WHERE \`slug\` = ?`;
            await mysqlConn.query(sql, updateParams);
          }
          halamansUpdated++;
        } else {
          console.log(`  [NO CHANGE] Halaman slug "${sandboxRow.slug}" is already up to date.`);
        }
      } else {
        console.log(`  [SKIP/NOTICE] Halaman slug "${sandboxRow.slug}" in Sandbox does not exist in Production. Preserving Production structure.`);
      }
    }
    console.log(`Summary: ${halamansUpdated} halaman records updated.`);

    // ----------------------------------------------------
    // TASK B: Selective Sync for `media_assets`
    // ----------------------------------------------------
    console.log('\n--- [2/2] Processing Collection: Media Assets (`media_assets`) ---');
    const sqliteMediaAssetsCheck = sqliteDb.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='media_assets'").get();

    if (sqliteMediaAssetsCheck) {
      const sqliteAssets = sqliteDb.prepare('SELECT * FROM media_assets').all();
      console.log(`Found ${sqliteAssets.length} records in Sandbox \`media_assets\`.`);

      let assetsInserted = 0;
      let assetsUpdated = 0;

      for (const sandboxAsset of sqliteAssets) {
        if (!sandboxAsset.key) continue;

        const [prodAssets] = await mysqlConn.query('SELECT * FROM `media_assets` WHERE `key` = ?', [sandboxAsset.key]);

        if (prodAssets.length === 0) {
          console.log(`  [NEW ASSET INSERT] Key "${sandboxAsset.key}" (${sandboxAsset.judul || 'Untitled'}):`);
          const columns = Object.keys(sandboxAsset).filter(c => c !== 'id');
          const values = columns.map(c => {
            let val = sandboxAsset[c];
            if (typeof val === 'boolean') return val ? 1 : 0;
            if (val && typeof val === 'object') return JSON.stringify(val);
            return val;
          });

          if (!isDryRun) {
            const sql = `INSERT INTO \`media_assets\` (${columns.map(c => `\`${c}\``).join(', ')}) VALUES (${columns.map(() => '?').join(', ')})`;
            await mysqlConn.query(sql, values);
          }
          assetsInserted++;
        } else {
          // Update selective properties for existing asset (kategori, urutan, deskripsi)
          const prodAsset = prodAssets[0];
          const updateFields = [];
          const updateParams = [];
          const keysToSync = ['kategori', 'urutan', 'deskripsi'];

          for (const k of keysToSync) {
            if (sandboxAsset[k] !== undefined && sandboxAsset[k] !== null && sandboxAsset[k] !== prodAsset[k]) {
              updateFields.push(`\`${k}\` = ?`);
              updateParams.push(sandboxAsset[k]);
            }
          }

          if (updateFields.length > 0) {
            console.log(`  [ASSET UPDATE] Key "${sandboxAsset.key}": ${updateFields.join(', ')}`);
            updateParams.push(sandboxAsset.key);
            if (!isDryRun) {
              const sql = `UPDATE \`media_assets\` SET ${updateFields.join(', ')} WHERE \`key\` = ?`;
              await mysqlConn.query(sql, updateParams);
            }
            assetsUpdated++;
          }
        }
      }
      console.log(`Summary: ${assetsInserted} media assets inserted, ${assetsUpdated} media assets updated.`);
    } else {
      console.log('Notice: `media_assets` table not found in Sandbox DB, skipping.');
    }

    if (!isDryRun) {
      await mysqlConn.commit();
      console.log('\n✅ TRANSACTION COMMITTED SUCCESSFULLY! Sandbox changes applied to Production.');
    } else {
      console.log('\nℹ DRY-RUN COMPLETE. No actual data was modified in Production.');
      console.log('To apply changes live, run: node scripts/apply-sandbox-selective.js --apply');
    }

  } catch (err) {
    if (!isDryRun && mysqlConn) {
      await mysqlConn.rollback();
      console.error('\n🚨 ERROR ENCOUNTERED - TRANSACTION ROLLED BACK:', err.message);
    } else {
      console.error('\n🚨 ERROR:', err.message);
    }
  } finally {
    if (mysqlConn) await mysqlConn.end();
    if (sqliteDb) sqliteDb.close();
  }
}

runSelectiveMigration();
