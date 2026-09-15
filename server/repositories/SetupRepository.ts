import { pool } from '../shared/database.js';

export class SetupRepository {
  static async listAll() {
    const { rows } = await pool.query('SELECT * FROM setups ORDER BY created_at DESC');
    return rows;
  }

  static async findById(id: string) {
    const { rows } = await pool.query('SELECT * FROM setups WHERE id = $1', [id]);
    return rows[0] || null;
  }

  static async create(setup: {
    id: string;
    title: string;
    owner: string;
    ownerId?: string;
    category: string;
    description?: string;
    image?: string;
    tags?: any;
    components?: any;
    videoUrl?: string;
  }) {
    const { rows } = await pool.query(
      `INSERT INTO setups (id, title, owner, owner_id, category, description, image, tags, components, video_url, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8::jsonb, $9::jsonb, $10, NOW()) RETURNING *`,
      [
        setup.id,
        setup.title,
        setup.owner,
        setup.ownerId || null,
        setup.category,
        setup.description || null,
        setup.image || null,
        JSON.stringify(setup.tags || []),
        JSON.stringify(setup.components || []),
        setup.videoUrl || null
      ]
    );
    return rows[0];
  }

  static async updateLikes(id: string, likes: number) {
    const { rows } = await pool.query('UPDATE setups SET likes = $1 WHERE id = $2 RETURNING *', [likes, id]);
    return rows[0] || null;
  }
}
