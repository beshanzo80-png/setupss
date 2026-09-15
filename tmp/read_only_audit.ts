import { pool } from "../server-db";

async function runAudit() {
  try {
    console.log("=== DB CONNECTION & SERVER DB METADATA ===");
    const dbInfo = await pool.query("SELECT NOW(), current_database(), current_user, version()");
    console.log("Connected DB Info:", dbInfo.rows[0]);

    console.log("\n=== APPLIED MIGRATIONS (schema_migrations) ===");
    const migCheck = await pool.query(`SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'schema_migrations');`);
    if (migCheck.rows[0].exists) {
      const migs = await pool.query("SELECT version, name, applied_at FROM schema_migrations ORDER BY applied_at ASC;");
      console.table(migs.rows);
    } else {
      console.log("schema_migrations table DOES NOT EXIST!");
    }

    console.log("\n=== PUBLIC BASE TABLES & ROW COUNTS ===");
    const tables = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' AND table_type = 'BASE TABLE'
      ORDER BY table_name;
    `);

    const tableStats = [];
    for (const t of tables.rows) {
      const name = t.table_name;
      let count = -1;
      try {
        const countRes = await pool.query(`SELECT COUNT(*) FROM "${name}";`);
        count = parseInt(countRes.rows[0].count, 10);
      } catch (e) {
        count = -1;
      }
      tableStats.push({ tableName: name, rowCount: count });
    }
    console.table(tableStats);

    console.log("\n=== RLS POLICIES STATUS ===");
    const rlsCheck = await pool.query(`
      SELECT tablename, rowsecurity 
      FROM pg_tables 
      WHERE schemaname = 'public' 
      ORDER BY tablename;
    `);
    console.table(rlsCheck.rows);

    console.log("\n=== FOREIGN KEYS IN PUBLIC SCHEMA ===");
    const fkCheck = await pool.query(`
      SELECT
        tc.table_name, 
        kcu.column_name, 
        ccu.table_name AS foreign_table_name,
        ccu.column_name AS foreign_column_name 
      FROM information_schema.table_constraints AS tc 
      JOIN information_schema.key_column_usage AS kcu
        ON tc.constraint_name = kcu.constraint_name
        AND tc.table_schema = kcu.table_schema
      JOIN information_schema.constraint_column_usage AS ccu
        ON ccu.constraint_name = tc.constraint_name
        AND ccu.table_schema = tc.table_schema
      WHERE tc.constraint_type = 'FOREIGN KEY' AND tc.table_schema='public';
    `);
    console.table(fkCheck.rows);

    process.exit(0);
  } catch (err) {
    console.error("Audit failed:", err);
    process.exit(1);
  }
}

runAudit();
