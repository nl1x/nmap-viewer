import dotenv from 'dotenv';

dotenv.config();

export interface Config {
  database: {
    db_name: string;
    host: string;
    port: number;
    username: string;
    password: string;
  }
  port: number;
  environnement: string;
  isProduction: () => boolean;
  isDevelopment: () => boolean;
}

const config: Config = {
  database: {
    db_name: process.env.DB_NAME || 'db_name',
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 5432,
    username: process.env.DB_USER || 'user',
    password: process.env.DB_PASSWORD || 'password',
  },
  port: Number(process.env.APP_PORT) || 3000,
  environnement: process.env.APP_ENVIRONNEMENT || 'development',
  isProduction() {
    return this.environnement == 'production';
  },
  isDevelopment() {
    return this.environnement == 'development';
  }
};

export default config;
