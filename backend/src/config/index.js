import 'dotenv/config';

const parseList = (value) =>
  (value ?? '')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);

const env = process.env.NODE_ENV ?? 'development';

export const config = Object.freeze({
  env,
  isProduction: env === 'production',
  isTest: env === 'test',
  port: Number(process.env.PORT) || 4000,
  corsOrigins: parseList(process.env.CORS_ORIGINS ?? 'http://localhost:5173'),
});
