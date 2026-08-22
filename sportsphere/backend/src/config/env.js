import dotenv from 'dotenv';

dotenv.config();

export const validateEnv = () => {
  const required = ['DATABASE_URL', 'JWT_SECRET'];
  const missing = required.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    console.warn(`[ENV WARNING]: Missing environment variables: ${missing.join(', ')}. Using safe defaults for local development.`);
  }

  return {
    PORT: process.env.PORT || 5000,
    DATABASE_URL: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/sportsphere',
    JWT_SECRET: process.env.JWT_SECRET || 'sportsphere_ultra_secure_jwt_secret_2026_key',
    FRONTEND_URL: process.env.FRONTEND_URL || process.env.CLIENT_URL || 'http://localhost:5173',
    NODE_ENV: process.env.NODE_ENV || 'development',
  };
};

export const env = validateEnv();
