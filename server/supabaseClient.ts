import { createClient } from '@supabase/supabase-js';
import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config({ override: true });

const supabaseUrl = process.env.SUPABASE_URL || 'https://your-supabase-project.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || 'your-service-role-key';

export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

// Configure direct Postgres pool to Supabase database (or fallback SQL connection string if provided)
const rawDbUrl = process.env.DATABASE_URL;
const isValidPostgresUrl = !!(rawDbUrl && (rawDbUrl.startsWith('postgresql://') || rawDbUrl.startsWith('postgres://')));

const dbConnectionString = isValidPostgresUrl ? rawDbUrl : 
  (process.env.SQL_HOST && process.env.SQL_USER && process.env.SQL_PASSWORD && process.env.SQL_DB_NAME
    ? `postgresql://${process.env.SQL_USER}:${process.env.SQL_PASSWORD}@${process.env.SQL_HOST}:${process.env.SQL_PORT || 5432}/${process.env.SQL_DB_NAME}`
    : undefined);

const globalAny: any = globalThis;
export const pool = globalAny.supabaseDbPool || new Pool({
  connectionString: dbConnectionString,
  ssl: dbConnectionString && !dbConnectionString.includes('localhost') && !dbConnectionString.includes('127.0.0.1') ? { rejectUnauthorized: false } : false,
  connectionTimeoutMillis: 10000,
  max: 10,
  idleTimeoutMillis: 30000,
});

if (process.env.NODE_ENV !== 'production') {
  globalAny.supabaseDbPool = pool;
}

export async function checkDatabaseConnection(): Promise<boolean> {
  if (!dbConnectionString) {
    console.warn("⚠️ [Supabase Database] Neither DATABASE_URL nor SQL_HOST configured.");
    return false;
  }
  try {
    const client = await pool.connect();
    await client.query("SELECT 1");
    client.release();
    return true;
  } catch (err) {
    console.error("❌ [Supabase Database] Connection error:", err);
    return false;
  }
}
