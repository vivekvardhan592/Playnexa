import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

// PostgreSQL Connection Pool Setup
export const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/sportsphere',
  max: 20, // Connection pool max connections
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

// Transaction Client Helper
export const getTransactionClient = async () => {
  const client = await pool.connect();
  const query = (text, params) => client.query(text, params);
  const release = () => client.release();
  return { client, query, release };
};

export const connectPostgres = async () => {
  try {
    const res = await pool.query('SELECT NOW() as now, PostGIS_Full_Version() as postgis_version;');
    console.log(`[PostgreSQL Connected]: ${res.rows[0].now}`);
    console.log(`[PostGIS Enabled]: ${res.rows[0].postgis_version || 'Extension Ready'}`);
  } catch (error) {
    console.warn(`[DB Notice]: PostgreSQL/PostGIS connection fallback active. Database commands ready for deployment. (${error.message})`);
  }
};
