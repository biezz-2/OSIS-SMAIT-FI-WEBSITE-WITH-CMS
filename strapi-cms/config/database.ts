import path from 'path';
import type { Core } from '@strapi/strapi';
import { execSync } from 'child_process';

function isPortOpen(host: string, port: number): boolean {
  try {
    const code = `const net = require('net'); const client = net.createConnection(${port}, '${host}', () => { client.end(); process.exit(0); }); client.on('error', () => process.exit(1)); setTimeout(() => process.exit(1), 1000);`;
    execSync(`"${process.execPath}" -e "${code}"`, { stdio: 'ignore', timeout: 1500 });
    return true;
  } catch (e) {
    console.error(`[isPortOpen] Connection check to ${host}:${port} failed:`, e instanceof Error ? e.message : e);
    return false;
  }
}

const config = ({ env }: Core.Config.Shared.ConfigParams): Core.Config.Database => {
  let client = env('DATABASE_CLIENT', 'sqlite');

  if (client === 'mysql') {
    const host = env('DATABASE_HOST', 'localhost');
    const port = env.int('DATABASE_PORT', 3306);
    console.log(`Checking connection to main database (MySQL) at ${host}:${port}...`);
    
    const isProd = env('NODE_ENV') === 'production';
    if (!isPortOpen(host, port)) {
      if (isProd) {
        console.warn(`\n⚠️  WARNING: Main MySQL database at ${host}:${port} is UNREACHABLE!`);
        console.warn(`⚠️  Production mode active: NOT falling back to SQLite. Attempting to use MySQL directly.\n`);
      } else {
        console.warn(`\n⚠️  WARNING: Main MySQL database at ${host}:${port} is UNREACHABLE!`);
        console.warn(`⚠️  Falling back to local backup SQLite database.\n`);
        client = 'sqlite';
      }
    } else {
      console.log(`✅ Main database (MySQL) is reachable. Using MySQL.`);
    }
  }

  const validClients = ['postgres', 'mysql', 'sqlite'];
  if (!validClients.includes(client)) {
    throw new Error(
      `Unsupported DATABASE_CLIENT: ${client}. Use "postgres", "mysql", or "sqlite".`
    );
  }

  const connections: Record<string, any> = {
    mysql: {
      client: 'mysql',
      connection: {
        host: env('DATABASE_HOST', 'localhost'),
        port: env.int('DATABASE_PORT', 3306),
        database: env('DATABASE_NAME', 'strapi'),
        user: env('DATABASE_USERNAME', 'strapi'),
        password: env('DATABASE_PASSWORD', 'strapi'),
        ssl: env.bool('DATABASE_SSL', false) && {
          key: env('DATABASE_SSL_KEY', undefined),
          cert: env('DATABASE_SSL_CERT', undefined),
          ca: env('DATABASE_SSL_CA', undefined),
          capath: env('DATABASE_SSL_CAPATH', undefined),
          cipher: env('DATABASE_SSL_CIPHER', undefined),
          rejectUnauthorized: env.bool('DATABASE_SSL_REJECT_UNAUTHORIZED', true),
        },
      },
      pool: { min: env.int('DATABASE_POOL_MIN', 2), max: env.int('DATABASE_POOL_MAX', 10) },
    },
    postgres: {
      client: 'postgres',
      connection: {
        connectionString: env('DATABASE_URL'),
        host: env('DATABASE_HOST', 'localhost'),
        port: env.int('DATABASE_PORT', 5432),
        database: env('DATABASE_NAME', 'strapi'),
        user: env('DATABASE_USERNAME', 'strapi'),
        password: env('DATABASE_PASSWORD', 'strapi'),
        ssl: env.bool('DATABASE_SSL', false) && {
          key: env('DATABASE_SSL_KEY', undefined),
          cert: env('DATABASE_SSL_CERT', undefined),
          ca: env('DATABASE_SSL_CA', undefined),
          capath: env('DATABASE_SSL_CAPATH', undefined),
          cipher: env('DATABASE_SSL_CIPHER', undefined),
          rejectUnauthorized: env.bool('DATABASE_SSL_REJECT_UNAUTHORIZED', true),
        },
        schema: env('DATABASE_SCHEMA', 'public'),
      },
      pool: { min: env.int('DATABASE_POOL_MIN', 2), max: env.int('DATABASE_POOL_MAX', 10) },
    },
    sqlite: {
      client: 'sqlite',
      connection: {
        filename: path.resolve(env('DATABASE_FILENAME') || 'C:/Users/attab/.gemini/antigravity/strapi_data.db'),
      },
      useNullAsDefault: true,
    },
  };

  return {
    connection: {
      ...connections[client],
      acquireConnectionTimeout: env.int('DATABASE_CONNECTION_TIMEOUT', 60000),
    },
  };
};

export default config;
