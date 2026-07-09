import type { Knex } from 'knex';
import dotenv from 'dotenv';

dotenv.config();

const config: { [key: string]: Knex.Config } = {
  development: {
    client: 'pg',
    connection: {
      host: process.env.DB_HOST || '127.0.0.1',
      port: Number(process.env.DB_PORT) || 5432,
      user: process.env.DB_USER || 'ayenyeinsan', // သင့် Mac Username
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'school_billing_db',
    },
    migrations: {
      extension: 'ts',
      directory: './src/migrations',
    },
    seeds: {
      extension: 'ts',
      directory: './src/seeds',
    },
  },
};

export default config;