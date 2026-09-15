import { pool } from '../shared/database.js';

export class UserRepository {
  static async findByEmail(email: string) {
    const { rows } = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    return rows[0] || null;
  }

  static async findById(id: string) {
    const { rows } = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
    return rows[0] || null;
  }

  static async create(user: { id: string; email: string; passwordHash: string; name: string; role?: string }) {
    const { rows } = await pool.query(
      `INSERT INTO users (id, email, password_hash, name, role, created_at, updated_at) 
       VALUES ($1, $2, $3, $4, $5, NOW(), NOW()) RETURNING *`,
      [user.id, user.email, user.passwordHash, user.name, user.role || 'user']
    );
    return rows[0];
  }

  static async listAll() {
    const { rows } = await pool.query('SELECT id, email, name, role, is_verified, created_at FROM users ORDER BY created_at DESC');
    return rows;
  }
}
