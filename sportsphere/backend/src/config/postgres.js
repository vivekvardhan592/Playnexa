import pg from 'pg';
import { env } from './env.js';

const { Pool } = pg;

const getConnectionString = () => {
  let dbUrl = env.DATABASE_URL.replace(/^["']|["']$/g, '').trim();
  try {
    new URL(dbUrl);
    return dbUrl;
  } catch (e) {
    const match = dbUrl.match(/^postgresql:\/\/([^:]+):(.+)@([^@]+)$/);
    if (match) {
      const user = match[1];
      const pass = encodeURIComponent(match[2]);
      const hostPath = match[3];
      return `postgresql://${user}:${pass}@${hostPath}`;
    }
    return dbUrl;
  }
};

const connectionString = getConnectionString();
const isCloudDB = connectionString.includes('supabase') || connectionString.includes('neon') || connectionString.includes('render');

export const pool = new Pool({
  connectionString,
  ssl: isCloudDB ? { rejectUnauthorized: false } : false,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 15000,
});

pool.on('error', (err) => {
  console.error('[PostgreSQL Pool Unexpected Error]:', err.message);
});

export const query = async (text, params) => {
  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    if (env.NODE_ENV === 'development' && duration > 150) {
      console.log(`[SLOW QUERY]: ${duration}ms | Executed: ${text.slice(0, 80)}`);
    }
    return res;
  } catch (error) {
    console.error(`[DB QUERY ERROR]: ${error.message} | Query: ${text}`);
    throw error;
  }
};

export const getTransactionClient = async () => {
  const client = await pool.connect();
  const query = (text, params) => client.query(text, params);
  const release = () => client.release();
  return { client, query, release };
};

export const connectPostgres = async () => {
  try {
    const res = await pool.query('SELECT NOW() as now;');
    console.log(`[PostgreSQL Connected]: ${res.rows[0].now}`);
  } catch (error) {
    console.warn(`[DB Notice]: PostgreSQL connection pool initialized. (${error.message})`);
  }
};

export const checkDatabaseHealth = async () => {
  try {
    const res = await pool.query('SELECT 1 as healthy, NOW() as time;');
    return { healthy: true, time: res.rows[0].time };
  } catch (error) {
    return { healthy: false, error: error.message };
  }
};

export const closePostgresPool = async () => {
  console.log('🔌 Closing PostgreSQL pool...');
  await pool.end();
  console.log('✅ PostgreSQL pool closed cleanly.');
};
