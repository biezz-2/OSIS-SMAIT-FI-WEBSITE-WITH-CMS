const path = require('path');
const mysql = require('mysql2/promise');
const Database = require('better-sqlite3');

// Load environment variables from .env
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const mysqlConfig = {
  host: process.env.DATABASE_HOST || '192.168.101.19',
  port: parseInt(process.env.DATABASE_PORT || '3306', 10),
  database: process.env.DATABASE_NAME || 'strapi-osis-agoraacta',
  user: process.env.DATABASE_USERNAME || 'root',
  password: process.env.DATABASE_PASSWORD || 'root',
};

const sqlitePath = process.env.DATABASE_FILENAME || 'C:/Users/attab/.gemini/antigravity/strapi_data.db';

async function sync() {
  console.log(`[${new Date().toISOString()}] Starting MySQL to SQLite synchronization...`);
  let mysqlConn;
  let sqliteDb;

  try {
    // 1. Connect to MySQL
    mysqlConn = await mysql.createConnection(mysqlConfig);
    console.log('Connected to MySQL source database.');

    // 2. Connect to SQLite
    sqliteDb = new Database(sqlitePath);
    console.log(`Connected to SQLite destination database at: ${sqlitePath}`);

    // Disable foreign key constraints temporarily to allow clearing/populating
    sqliteDb.pragma('foreign_keys = OFF');

    // 3. Get all tables from MySQL
    const [tables] = await mysqlConn.query('SHOW TABLES');
    if (tables.length === 0) {
      console.log('No tables found in MySQL database.');
      return;
    }

    const tableKey = Object.keys(tables[0])[0];
    const tableNames = tables.map(row => row[tableKey]);

    // 4. Copy each table
    for (const tableName of tableNames) {
      // Skip Strapi's internal lock table to avoid locking the backup DB
      if (tableName === 'strapi_database_schema') continue;

      try {
        const [rows] = await mysqlConn.query(`SELECT * FROM \`${tableName}\``);
        
        // Check if table exists in SQLite
        const tableCheck = sqliteDb.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name=?").get(tableName);
        if (!tableCheck) {
          console.warn(`Table "${tableName}" does not exist in SQLite. Skipping...`);
          continue;
        }

        // Clear existing data in SQLite table
        sqliteDb.prepare(`DELETE FROM \`${tableName}\``).run();

        if (rows.length > 0) {
          const columns = Object.keys(rows[0]);
          const placeholders = columns.map(() => '?').join(', ');
          const insertStmt = sqliteDb.prepare(`INSERT INTO \`${tableName}\` (${columns.map(c => `\`${c}\``).join(', ')}) VALUES (${placeholders})`);

          // Insert rows inside a transaction for high performance
          const insertTransaction = sqliteDb.transaction((data) => {
            for (const row of data) {
              const values = columns.map(col => {
                const val = row[col];
                // Convert booleans/objects to format SQLite expects
                if (typeof val === 'boolean') return val ? 1 : 0;
                if (val instanceof Date) return val.toISOString();
                if (val && typeof val === 'object') return JSON.stringify(val);
                return val;
              });
              insertStmt.run(values);
            }
          });

          insertTransaction(rows);
        }
        console.log(`Synced table "${tableName}" (${rows.length} rows)`);
      } catch (err) {
        console.error(`Error syncing table "${tableName}":`, err.message);
      }
    }

    // Re-enable foreign key constraints
    sqliteDb.pragma('foreign_keys = ON');
    console.log('Synchronization completed successfully!');
  } catch (error) {
    console.error('Synchronization failed:', error.message);
  } finally {
    if (mysqlConn) await mysqlConn.end();
    if (sqliteDb) sqliteDb.close();
  }
}

sync();
