import * as dotenv from 'dotenv';

dotenv.config({ path: __dirname + '/../../../.env' });

export const ENV = {
  NODE_ENV: process.env.NODE_ENV,
  DB_HOST: process.env.DATABASE_HOST,
  DB_PORT: +process.env.DATABASE_PORT_NUMBER,
  DB_USERNAME: process.env.DATABASE_USERNAME,
  DB_PASSWORD: process.env.DATABASE_PASSWORD,
  DB_NAME: process.env.DATABASE_NAME,
  BACKEND_PORT_NUMBER: +process.env.BACKEND_PORT_NUMBER,
  BACKEND_HOSTNAME: process.env.BACKEND_HOSTNAME,
  FRONTEND_HOSTNAME: process.env.FRONTEND_HOSTNAME,
  FRONTEND_DOMAIN: process.env.FRONTEND_HOSTNAME?.split('/')
    .filter(Boolean)
    .pop(),
  FRONTEND_PORT_NUMBER: +process.env.FRONTEND_PORT_NUMBER,
  VUE_APP_API_BASE_URL: process.env.VUE_APP_API_BASE_URL,
  SESSION_SECRET: process.env.SESSION_SECRET,
  isDev: process.env.NODE_ENV === 'development',
  isStaging: process.env.NODE_ENV === 'staging',
  isProd: process.env.NODE_ENV === 'production',
};
