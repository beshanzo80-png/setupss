import { pool } from '../shared/database.js';

export interface HardwareEntityRecord {
  id: string;
  name: string;
  slug: string;
  brand_id?: string;
  category: string;
  brand_name?: string;
  model: string;
  release_date?: string;
  architecture?: string;
  socket?: string;
  chipset?: string;
  tdp_watts?: number;
  msrp_usd?: number;
  benchmark_score?: number;
  description?: string;
  specs: any;
  image_url?: string;
  gallery?: any;
  ai_summary?: string;
  created_at: Date;
  updated_at: Date;
}

export class HardwareRepository {
  static async findBySlug(slug: string) {
    const { rows } = await pool.query(
      `SELECT h.*, b.name as brand_name, b.logo_url as brand_logo
       FROM hardware h
       LEFT JOIN brands b ON h.brand_id = b.id
       WHERE h.slug = $1 AND (h.is_deleted IS FALSE OR h.is_deleted IS NULL)`,
      [slug]
    );
    return rows[0] || null;
  }

  static async findById(id: string) {
    const { rows } = await pool.query(
      `SELECT h.*, b.name as brand_name
       FROM hardware h
       LEFT JOIN brands b ON h.brand_id = b.id
       WHERE h.id = $1`,
      [id]
    );
    return rows[0] || null;
  }

      static async listAll(category?: string, query?: string, limit: number = 50) {
    let sql = `
      SELECT h.*, b.name as brand_name, 
             COALESCE(hc.name, h.category_id) as category_name, 
             COALESCE(hc.slug, h.category_id) as category_slug
      FROM hardware h
      LEFT JOIN brands b ON h.brand_id = b.id
      LEFT JOIN hardware_categories hc ON h.category_id = hc.id
      WHERE (h.is_deleted IS FALSE OR h.is_deleted IS NULL)
    `;
    const params: any[] = [];

    if (category && category.trim() !== '' && category.toUpperCase() !== 'ALL') {
      const catLower = category.trim().toLowerCase();
      let catVariants: string[] = [catLower];

      if (catLower === 'gpu' || catLower === 'graphics-cards') catVariants = ['gpu', 'graphics-cards'];
      else if (catLower === 'cpu' || catLower === 'processors') catVariants = ['cpu', 'processors'];
      else if (catLower === 'motherboard' || catLower === 'motherboards') catVariants = ['motherboard', 'motherboards'];
      else if (catLower === 'ram' || catLower === 'memory') catVariants = ['ram', 'memory'];
      else if (catLower === 'storage' || catLower === 'storage_ssd' || catLower === 'ssd') catVariants = ['storage', 'storage_ssd', 'storage_hdd', 'ssd'];
      else if (catLower === 'monitor' || catLower === 'monitors') catVariants = ['monitor', 'monitors'];
      else if (catLower === 'mouse' || catLower === 'mice') catVariants = ['mouse', 'mice'];
      else if (catLower === 'keyboard' || catLower === 'keyboards') catVariants = ['keyboard', 'keyboards'];
      else if (catLower === 'desk pad' || catLower === 'desk_pad' || catLower === 'deskpad' || catLower === 'mousepad') catVariants = ['desk pad', 'desk_pad', 'deskpad', 'mousepad'];

      params.push(catVariants);
      sql += ` AND (
        LOWER(COALESCE(hc.slug, '')) = ANY($${params.length}::text[]) OR 
        LOWER(COALESCE(hc.name, '')) = ANY($${params.length}::text[]) OR 
        LOWER(COALESCE(h.category_id, '')) = ANY($${params.length}::text[])
      )`;
    }

    if (query && query.trim() !== '') {
      params.push(`%${query.trim().toLowerCase()}%`);
      sql += ` AND (LOWER(h.name) LIKE $${params.length} OR LOWER(h.slug) LIKE $${params.length} OR LOWER(b.name) LIKE $${params.length})`;
    }

    params.push(limit);
    sql += ` ORDER BY h.created_at DESC LIMIT $${params.length}`;

    console.log('EXECUTING LISTALL SQL:', sql);
    console.log('EXECUTING LISTALL PARAMS:', params);

    const { rows } = await pool.query(sql, params);
    return rows;
  }

  static async getRelations(hardwareId: string) {
    const { rows } = await pool.query(
      `SELECT hr.*, 
              h_source.name as source_name, h_source.slug as source_slug, h_source.category as source_category,
              h_target.name as target_name, h_target.slug as target_slug, h_target.category as target_category, h_target.image_url as target_image
       FROM hardware_relations hr
       JOIN hardware h_source ON hr.source_id = h_source.id
       JOIN hardware h_target ON hr.target_id = h_target.id
       WHERE hr.source_id = $1 OR hr.target_id = $1`,
      [hardwareId]
    );
    return rows;
  }

  static async getBenchmarks(hardwareId: string) {
    const { rows } = await pool.query(
      `SELECT hb.*, g.name as game_name, g.slug as game_slug, g.image_url as game_image
       FROM hardware_benchmarks hb
       LEFT JOIN games g ON hb.game_id = g.id
       WHERE hb.hardware_id = $1
       ORDER BY hb.avg_fps DESC`,
      [hardwareId]
    );
    return rows;
  }

  static async getPriceHistory(hardwareId: string) {
    const { rows } = await pool.query(
      `SELECT * FROM hardware_price_history 
       WHERE hardware_id = $1 
       ORDER BY recorded_at ASC`,
      [hardwareId]
    );
    return rows;
  }

  static async getPairedSetups(hardwareSlug: string, limit: number = 10) {
    const { rows } = await pool.query(
      `SELECT s.* FROM setups s
       JOIN setup_hardware sh ON s.id = sh.setup_id
       JOIN hardware h ON sh.hardware_id = h.id
       WHERE h.slug = $1
       ORDER BY s.created_at DESC LIMIT $2`,
      [hardwareSlug, limit]
    );
    return rows;
  }
}
