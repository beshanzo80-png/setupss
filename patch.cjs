const fs = require('fs');
const file = 'server/repositories/HardwareRepository.ts';
let content = fs.readFileSync(file, 'utf8');

const target = `  static async listAll(category?: string, query?: string, limit: number = 50) {
    let sql = \`
      SELECT h.*, b.name as brand_name 
      FROM hardware h
      LEFT JOIN brands b ON h.brand_id = b.id
      WHERE (h.is_deleted IS FALSE OR h.is_deleted IS NULL)
    \`;
    const params: any[] = [];

    if (category && category !== 'ALL') {
      params.push(category);
      sql += \` AND (h.category = $\${params.length} OR h.category_id = $\${params.length})\`;
    }

    if (query && query.trim() !== '') {
      params.push(\`%\${query.trim().toLowerCase()}%\`);
      sql += \` AND (LOWER(h.name) LIKE $\${params.length} OR LOWER(h.slug) LIKE $\${params.length} OR LOWER(b.name) LIKE $\${params.length})\`;
    }

    params.push(limit);
    sql += \` ORDER BY h.created_at DESC LIMIT $\${params.length}\`;

    const { rows } = await pool.query(sql, params);
    return rows;
  }`;

const replacement = `  static async listAll(category?: string, query?: string, limit: number = 50) {
    let sql = \`
      SELECT h.*, b.name as brand_name, hc.slug as category_slug, hc.name as category_name
      FROM hardware h
      LEFT JOIN brands b ON h.brand_id = b.id
      LEFT JOIN hardware_categories hc ON h.category_id = hc.id
      WHERE (h.is_deleted IS FALSE OR h.is_deleted IS NULL)
    \`;
    const params: any[] = [];

    if (category && category !== 'ALL') {
      params.push(category.toLowerCase());
      sql += \` AND (
        LOWER(hc.slug) = $\${params.length} OR 
        LOWER(hc.name) = $\${params.length} OR
        (LOWER($\${params.length}) = 'gpu' AND hc.slug = 'graphics-cards') OR
        (LOWER($\${params.length}) = 'cpu' AND hc.slug = 'processors') OR
        (LOWER($\${params.length}) = 'motherboard' AND hc.slug = 'motherboards') OR
        (LOWER($\${params.length}) = 'ram' AND hc.slug = 'memory') OR
        (LOWER($\${params.length}) = 'monitor' AND hc.slug = 'monitors') OR
        (LOWER($\${params.length}) = 'mouse' AND hc.slug = 'mice') OR
        (LOWER($\${params.length}) = 'keyboard' AND hc.slug = 'keyboards') OR
        (LOWER($\${params.length}) = 'desk pad' AND hc.slug = 'mice') OR
        h.category_id = $\${params.length}
      )\`;
    }

    if (query && query.trim() !== '') {
      params.push(\`%\${query.trim().toLowerCase()}%\`);
      sql += \` AND (LOWER(h.name) LIKE $\${params.length} OR LOWER(h.slug) LIKE $\${params.length} OR LOWER(b.name) LIKE $\${params.length})\`;
    }

    params.push(limit);
    sql += \` ORDER BY h.created_at DESC LIMIT $\${params.length}\`;

    const { rows } = await pool.query(sql, params);
    return rows;
  }`;

// Use replace but insensitive to exact spacing
const regex = /static async listAll[\s\S]*?return rows;\n  }/;
content = content.replace(regex, replacement);

fs.writeFileSync(file, content);
