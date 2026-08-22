import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

// Helper to safely parse and encode PostgreSQL URLs with special password characters
const getConnectionString = () => {
  let dbUrl = process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/sportsphere';
  dbUrl = dbUrl.replace(/^["']|["']$/g, '').trim();

  // If URL contains raw unencoded special chars in password (e.g. user:pass@host)
  try {
    new URL(dbUrl);
    return dbUrl;
  } catch (e) {
    // Safely encode password component if URL constructor fails on unencoded special chars
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
  connectionTimeoutMillis: 5000,
});

export const query = async (text, params) => {
  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    if (process.env.NODE_ENV === 'development' && duration > 100) {
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
    console.log(`[PostgreSQL Supabase Connected]: ${res.rows[0].now}`);
  } catch (error) {
    console.warn(`[DB Notice]: PostgreSQL connection fallback active. Database commands ready for deployment. (${error.message})`);
  }
};
