import { pool } from "../server-db.js";
import { AppNotification } from "../src/types.js";

export class RealtimeService {
  /**
   * Update or create a user presence record in PostgreSQL
   */
  async updateUserPresence(
    userId: string,
    data: {
      name: string;
      email: string;
      avatar: string;
      status: 'online' | 'away' | 'offline';
      typing?: boolean;
    }
  ): Promise<void> {
    const timestamp = new Date().toISOString();
    try {
      await pool.query(
        `UPDATE users 
         SET last_active_date = $1, updated_at = NOW() 
         WHERE id = $2`,
        [timestamp, userId]
      );
    } catch (e) {
      console.error("Presence update failed in PostgreSQL:", e);
    }
  }

  /**
   * Fetch active online / away users from PostgreSQL
   */
  async getActiveOnlineUsers(timeoutMs = 120000): Promise<any[]> {
    try {
      const cutoff = new Date(Date.now() - timeoutMs).toISOString();
      const { rows } = await pool.query(
        `SELECT id, name, email, avatar, role, is_verified, has_rgb, last_active_date 
         FROM users 
         WHERE last_active_date >= $1 
         ORDER BY last_active_date DESC`,
        [cutoff]
      );
      return rows.map(r => ({
        id: r.id,
        name: r.name,
        email: r.email,
        avatar: r.avatar,
        status: 'online',
        lastSeen: r.last_active_date ? new Date(r.last_active_date).toISOString() : new Date().toISOString()
      }));
    } catch (e) {
      console.error("Active users query failed in PostgreSQL:", e);
      return [];
    }
  }

  /**
   * Create an in-app notification in PostgreSQL
   */
  async createNotification(
    notificationData: Omit<AppNotification, "id" | "createdAt" | "status">
  ): Promise<AppNotification> {
    const id = `notif-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
    const createdAt = new Date().toISOString();
    const newNotification: AppNotification = {
      ...notificationData,
      id,
      status: 'notification',
      createdAt
    };

    try {
      await pool.query(
        `INSERT INTO notifications (id, user_id, sender_id, sender_name, sender_avatar, type, title, content, link, status, created_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
        [
          id,
          notificationData.userId,
          notificationData.senderId || null,
          notificationData.senderName || null,
          notificationData.senderAvatar || null,
          notificationData.type,
          notificationData.title,
          notificationData.content,
          notificationData.link || null,
          'notification',
          createdAt
        ]
      );
    } catch (e) {
      console.error("Notification creation failed in PostgreSQL:", e);
    }

    return newNotification;
  }

  /**
   * Retrieve notification history for a user from PostgreSQL
   */
  async getUserNotifications(userId: string): Promise<AppNotification[]> {
    try {
      const { rows } = await pool.query(
        `SELECT * FROM notifications 
         WHERE user_id = $1 AND status != 'deleted' 
         ORDER BY created_at DESC LIMIT 50`,
        [userId]
      );

      return rows.map(r => ({
        id: r.id,
        userId: r.user_id,
        senderId: r.sender_id || undefined,
        senderName: r.sender_name || undefined,
        senderAvatar: r.sender_avatar || undefined,
        type: r.type,
        title: r.title,
        content: r.content,
        link: r.link || undefined,
        status: r.status,
        createdAt: r.created_at ? new Date(r.created_at).toISOString() : new Date().toISOString()
      }));
    } catch (e) {
      console.error("Notifications fetch failed in PostgreSQL:", e);
      return [];
    }
  }

  /**
   * Update notification status in PostgreSQL
   */
  async updateNotificationStatus(
    notificationId: string,
    status: 'notification' | 'read' | 'archived' | 'deleted'
  ): Promise<void> {
    try {
      await pool.query(
        `UPDATE notifications SET status = $1 WHERE id = $2`,
        [status, notificationId]
      );
    } catch (e) {
      console.error("Notification status update failed in PostgreSQL:", e);
    }
  }
}

export const realtimeService = new RealtimeService();
