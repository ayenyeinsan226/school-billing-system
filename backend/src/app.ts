import express, { Request, Response } from 'express';
import cors from 'cors';
import { Pool } from 'pg';
import dotenv from 'dotenv';

// .env ဖိုင်ကို ဖတ်ရန်
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware များ သတ်မှတ်ခြင်း
app.use(cors());
app.use(express.json());

// PostgreSQL Pool Connection Settings
// (သင်၏ Local Database Info များနှင့် ကိုက်ညီအောင် ပြင်ပေးပါ)
const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'school_billing_db',
  password: process.env.DB_PASSWORD || 'password',
  port: Number(process.env.DB_PORT) || 5432,
});

// Test Database Connection
pool.connect()
  .then(() => console.log('🚀 Connected to PostgreSQL successfully!'))
  .catch((err) => console.error('❌ Database connection error:', err));

// Basic Route
app.use('/', (req: Request, res: Response) => {
  res.json({ message: "Welcome to School Billing System Backend (TypeScript)!" });
});

// Server ကို စတင် Run ခြင်း
app.listen(PORT, () => {
  console.log(`⚡️ Server is running on http://localhost:${PORT}`);
});