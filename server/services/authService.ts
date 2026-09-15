import bcrypt from 'bcryptjs';
import { pool } from '../../server-db.js';

export interface UserDto {
  id: string;
  email: string;
  displayName: string;
  avatar: string;
  bio: string;
  githubLink: string;
  instagramLink: string;
  linkedinLink: string;
  coverPhoto: string;
  customBadge: string;
  customColor: string;
  referenceCode: string;
  inviteCount: number;
  isCrown: boolean;
  hasRgb: boolean;
  hasRgbEffect: boolean;
  role: 'user' | 'admin' | string;
  isVerified: boolean;
  is_verified?: boolean;
  verificationCode?: string | null;
  verification_code?: string | null;
  isBanned: boolean;
  avatarFrame: string;
  createdAt?: string;
}

export class AuthService {
  async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 10);
  }

  async comparePassword(password: string, hash: string): Promise<boolean> {
    if (!password || !hash) return false;
    return await bcrypt.compare(password, hash);
  }

  formatUserDto(row: any): UserDto {
    if (!row) return null as any;
    const isCrown = Boolean(row.is_crown || row.isCrown || (row.invite_count > 0 || row.inviteCount > 0));
    const hasRgb = Boolean(row.has_rgb || row.hasRgb || row.hasRgbEffect || (row.invite_count > 0 || row.inviteCount > 0));
    const isVerified = Boolean(row.is_verified || row.isVerified || row.email_verified);
    const verificationCode = row.verification_code || row.verificationCode || null;
    
    return {
      id: row.id,
      email: row.email,
      displayName: row.name || row.displayName || row.display_name || row.username || (row.email ? row.email.split('@')[0] : 'Kullanıcı'),
      avatar: row.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${row.id}`,
      bio: row.bio || '',
      githubLink: row.github_link || row.githubLink || '',
      instagramLink: row.instagram_link || row.instagramLink || '',
      linkedinLink: row.linkedin_link || row.linkedinLink || '',
      coverPhoto: row.cover_photo || row.coverPhoto || '',
      customBadge: row.custom_badge || row.customBadge || '',
      customColor: row.custom_color || row.customColor || '',
      referenceCode: row.reference_code || row.referenceCode || '',
      inviteCount: row.invite_count || row.inviteCount || 0,
      isCrown,
      hasRgb,
      hasRgbEffect: hasRgb,
      role: row.role || 'user',
      isVerified,
      is_verified: isVerified,
      verificationCode,
      verification_code: verificationCode,
      isBanned: Boolean(row.is_banned || row.isBanned || row.status === 'banned'),
      avatarFrame: row.avatar_frame || row.avatarFrame || 'none',
      createdAt: row.created_at || row.createdAt
    };
  }

  async getUserById(id: string): Promise<UserDto | null> {
    if (!id) return null;
    if (!(process.env.DATABASE_URL || process.env.SQL_HOST) || !pool) return null;

    try {
      const { rows } = await pool.query(
        `SELECT u.*, p.username, p.display_name, p.cover_photo, p.bio, COALESCE(u.avatar_frame, p.avatar_frame, 'none') AS avatar_frame
         FROM users u
         LEFT JOIN public.profiles p ON u.id = p.id
         WHERE u.id = $1 LIMIT 1`,
        [id]
      );
      if (rows.length === 0) return null;
      return this.formatUserDto(rows[0]);
    } catch (err) {
      console.error("AuthService: Error in getUserById:", err);
      return null;
    }
  }

  async getUserByEmail(email: string): Promise<any | null> {
    if (!email) return null;
    if (!(process.env.DATABASE_URL || process.env.SQL_HOST) || !pool) return null;

    try {
      const { rows } = await pool.query(
        `SELECT u.*, p.username, p.display_name, p.cover_photo, p.bio, COALESCE(u.avatar_frame, p.avatar_frame, 'none') AS avatar_frame
         FROM users u
         LEFT JOIN public.profiles p ON u.id = p.id
         WHERE LOWER(u.email) = LOWER($1) LIMIT 1`,
        [email.trim()]
      );
      if (rows.length === 0) return null;
      return rows[0];
    } catch (err) {
      console.error("AuthService: Error in getUserByEmail:", err);
      return null;
    }
  }

  async findOrCreateGoogleUser(googlePayload: {
    googleSubId: string;
    email: string;
    displayName?: string;
    photoUrl?: string;
    metadata?: any;
  }): Promise<UserDto> {
    const { googleSubId, email, displayName, photoUrl, metadata } = googlePayload;
    const cleanEmail = email.trim().toLowerCase();

    if (!pool || !(process.env.DATABASE_URL || process.env.SQL_HOST)) {
      throw new Error("Database connection required for Google Authentication.");
    }

    // 1. Check if auth_identities already links this googleSubId
    const identityRes = await pool.query(
      `SELECT user_id FROM auth_identities WHERE provider = 'google' AND provider_user_id = $1 LIMIT 1`,
      [googleSubId]
    );

    let userId: string | null = identityRes.rows[0]?.user_id || null;

    if (!userId) {
      // 2. Check if a user with this email already exists in users table
      const existingUser = await this.getUserByEmail(cleanEmail);

      if (existingUser) {
        userId = existingUser.id;
      } else {
        // 3. Create new user in users and public.profiles
        userId = `usr_g_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
        const name = displayName || splitEmailName(cleanEmail);
        const avatar = photoUrl || `https://api.dicebear.com/7.x/bottts/svg?seed=${userId}`;
        const refCode = Math.random().toString(36).substring(2, 10).toUpperCase();
        const role = cleanEmail === 'setupss.support@gmail.com' ? 'admin' : 'user';

        await pool.query(
          `INSERT INTO users (id, email, password_hash, name, avatar, is_verified, email_verified, reference_code, role, last_login_at)
           VALUES ($1, $2, $3, $4, $5, TRUE, TRUE, $6, $7, NOW())`,
          [userId, cleanEmail, '', name, avatar, refCode, role]
        );

        await pool.query(
          `INSERT INTO public.profiles (id, email, username, display_name, avatar, role, is_verified)
           VALUES ($1, $2, $3, $4, $5, $6, TRUE)
           ON CONFLICT (id) DO UPDATE SET email = EXCLUDED.email, updated_at = NOW()`,
          [userId, cleanEmail, splitEmailName(cleanEmail), name, avatar, role]
        );
      }

      // 4. Record identity link in auth_identities
      await pool.query(
        `INSERT INTO auth_identities (id, user_id, provider, provider_user_id, provider_email, metadata)
         VALUES ($1, $2, 'google', $3, $4, $5)
         ON CONFLICT (provider, provider_user_id) DO UPDATE SET provider_email = EXCLUDED.provider_email, updated_at = NOW()`,
        [`ident_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`, userId, googleSubId, cleanEmail, JSON.stringify(metadata || {})]
      );
    } else {
      // Update last_login_at
      await pool.query(`UPDATE users SET last_login_at = NOW() WHERE id = $1`, [userId]);
    }

    const updatedUser = await this.getUserById(userId);
    if (!updatedUser) {
      throw new Error("Failed to retrieve created or linked Google user.");
    }

    return updatedUser;
  }
}

function splitEmailName(email: string): string {
  if (!email || !email.includes('@')) return 'User';
  return email.split('@')[0];
}

export const authService = new AuthService();
