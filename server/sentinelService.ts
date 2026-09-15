import { GoogleGenAI } from "@google/genai";
import { pool } from "../server-db.js";
import { realtimeService } from "./realtimeService.js";

export interface SentinelReferralLog {
  id: string;
  inviter: string;
  inviterId: string;
  inviterAvatar?: string;
  referred: string;
  referredId: string;
  referredAvatar?: string;
  code: string;
  timestamp: string;
  ipCheck: 'TEMİZ (MATCH FREE)' | 'ÇAKIŞMA (CONFLICT)';
  deviceCheck: 'EŞSİZ (UNIQUE)' | 'BENZER (DUPLICATE)';
  status: 'APPROVED' | 'REJECTED';
  reason: string;
  rewardGranted: string;
}

export interface ChatReportLog {
  id: string;
  reporterId: string;
  reporterName: string;
  messageId: string;
  messageContent: string;
  senderId: string;
  senderName: string;
  status: 'PENDING' | 'RESOLVED_BANNED' | 'RESOLVED_CLEAN';
  reason: string;
  timestamp: string;
}

// In-memory logs as secure local fallbacks
let localReferralLogs: SentinelReferralLog[] = [
  {
    id: "log-1",
    inviter: "Beşir Hanzo",
    inviterId: "user-besir",
    inviterAvatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150&q=80",
    referred: "AhmetK_Dev",
    referredId: "user-ahmet",
    referredAvatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=150&h=150&q=80",
    code: "BESIR5",
    timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
    ipCheck: "TEMİZ (MATCH FREE)",
    deviceCheck: "EŞSİZ (UNIQUE)",
    status: "APPROVED",
    reason: "Eşsiz cihaz parmak izi, aktif GitHub hesabı ve özgün setup paylaşımı doğrulandı.",
    rewardGranted: "Dinamik RGB Efekti & Kral Tacı Etkin 👑🌈"
  }
];

let localChatReports: ChatReportLog[] = [];

export class SentinelService {
  private getGemini(): GoogleGenAI | null {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      console.warn("Sentinel: GEMINI_API_KEY environment variable is missing.");
      return null;
    }
    return new GoogleGenAI({ apiKey: key });
  }

  // 1. GET ALL REFERRAL LOGS
  async getReferralLogs(): Promise<SentinelReferralLog[]> {
    return localReferralLogs;
  }

  // 2. GET ALL CHAT REPORTS
  async getChatReports(): Promise<ChatReportLog[]> {
    return localChatReports;
  }

  // 3. AUDIT A REFERRAL DURING REGISTER
  async auditReferral(
    inviter: any,
    referred: any,
    code: string,
    ip: string,
    userAgent: string
  ): Promise<SentinelReferralLog> {
    const id = `ref-audit-${Date.now()}`;
    const timestamp = new Date().toISOString();

    let ipCheck: 'TEMİZ (MATCH FREE)' | 'ÇAKIŞMA (CONFLICT)' = 'TEMİZ (MATCH FREE)';
    let deviceCheck: 'EŞSİZ (UNIQUE)' | 'BENZER (DUPLICATE)' = 'EŞSİZ (UNIQUE)';
    let status: 'APPROVED' | 'REJECTED' = 'APPROVED';
    let reason = "Temiz IP adresi ve eşsiz tarayıcı imzası ile gerçek kullanıcı katılımı onaylandı.";
    let rewardGranted = "Dinamik RGB Efekti & Kral Tacı Etkin 👑🌈";

    // Heuristics
    const isSameIp = ip && inviter.lastIp === ip;
    const isSameUa = userAgent && inviter.lastUa === userAgent;
    const isSameEmailDomain = inviter.email && referred.email && inviter.email.split('@')[0] === referred.email.split('@')[0];

    if (isSameIp) {
      ipCheck = 'ÇAKIŞMA (CONFLICT)';
      status = 'REJECTED';
      reason = "Aynı IP adresi tespit edildi. Kendini davet etme (Self-referral) şüphesiyle reddedildi.";
      rewardGranted = "ENGELLENDİ (Ödül Askıya Alındı) ❌";
    } else if (isSameUa && userAgent.length > 5) {
      deviceCheck = 'BENZER (DUPLICATE)';
      status = 'REJECTED';
      reason = "Tarayıcı/cihaz parmak izi eşleşti. Çoklu hesapla kendini davet etme teşebbüsü engellendi.";
      rewardGranted = "ENGELLENDİ (Ödül Askıya Alındı) ❌";
    } else if (isSameEmailDomain) {
      status = 'REJECTED';
      reason = "Benzer e-posta kullanıcı adı kalıbı saptandı. Bot kayıt engellendi.";
      rewardGranted = "ENGELLENDİ (Ödül Askıya Alındı) ❌";
    }

    const newLog: SentinelReferralLog = {
      id,
      inviter: inviter.name || inviter.displayName || "Davet Eden",
      inviterId: inviter.id,
      inviterAvatar: inviter.avatar || "",
      referred: referred.name || referred.displayName || "Davet Edilen",
      referredId: referred.id,
      referredAvatar: referred.avatar || "",
      code,
      timestamp,
      ipCheck,
      deviceCheck,
      status,
      reason,
      rewardGranted
    };

    localReferralLogs.unshift(newLog);

    // Save to Database activity logs if SQL database is running
    const hasValidDb = !!(process.env.DATABASE_URL || process.env.SQL_HOST);
    if (hasValidDb && pool) {
      try {
        const details = `[REFERRAL AUDIT - ${status}] ${inviter.name} -> ${referred.name} (${code}). Sonuç: ${reason}`;
        const logId = `activity-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
        await pool.query(
          `INSERT INTO activity_logs (id, action_type, user_id, user_name, details, created_at)
           VALUES ($1, $2, $3, $4, $5, NOW())`,
          [logId, 'REFERRAL_AUDIT', inviter.id, inviter.name, details]
        );
      } catch (err) {
        console.error("Sentinel failed to write to database activity_logs:", err);
      }
    }

    return newLog;
  }

  // 4. AUDIT A CHAT MESSAGE REPORT WITH GEMINI
  async auditChatMessage(
    reporterId: string,
    reporterName: string,
    messageId: string,
    messageContent: string,
    senderId: string,
    senderName: string
  ): Promise<{ success: boolean; isProfane: boolean; reason: string }> {
    const reportId = `report-${Date.now()}`;
    const timestamp = new Date().toISOString();

    const newReport: ChatReportLog = {
      id: reportId,
      reporterId,
      reporterName,
      messageId,
      messageContent,
      senderId,
      senderName,
      status: 'PENDING',
      reason: 'Sentinel V900 incelemesi bekleniyor.',
      timestamp
    };

    localChatReports.unshift(newReport);

    const ai = this.getGemini();
    let isProfane = false;
    let reason = "Sentinel V900 incelemesinde küfür veya ağır hakaret tespit edilmedi.";

    if (ai) {
      try {
        const prompt = `You are Sentinel V900, the AI moderating system for Setupss (PC setup social platform).
Analyze the following chat message for profanity, swears, severe slurs, intense insults, or toxic comments in English, Turkish, German, French, or Spanish.
Ignore casual tech talk, mild slang, or friendly banter (e.g. "lan", "kanka", "oha" are mild and shouldn't be banned unless combined with swearing).

Message to analyze: "${messageContent}"

Respond STRICTLY in JSON format with exactly two keys:
- "isProfane" (boolean): true if it contains offensive profanity, swears, slurs, or heavy insults; false otherwise.
- "reason" (string): brief explanation in Turkish (max 1 sentence) of why or why not, or what profanity was detected. Do not mention any other text.`;

        const response = await ai.models.generateContent({
          model: "gemini-2.5-flash",
          contents: prompt,
          config: {
            responseMimeType: "application/json"
          }
        });

        const responseText = response.text || "{}";
        const result = JSON.parse(responseText);
        
        isProfane = !!result.isProfane;
        reason = result.reason || reason;
      } catch (e: any) {
        console.error("Sentinel Gemini audit failed, falling back to heuristic profanity check:", e);
        // Fallback local heuristic check
        const lowercaseMsg = messageContent.toLowerCase();
        const profaneWords = ['siktir', 'orospu', 'piç', 'göt', 'amına', 'sikeyim', 'kaltak', 'yarrak', 'fuck', 'bitch', 'asshole', 'bastard'];
        const matches = profaneWords.some(word => lowercaseMsg.includes(word));
        if (matches) {
          isProfane = true;
          reason = "Heuristics profanity audit triggered: Ağır küfür/hakaret kelimesi tespit edildi.";
        }
      }
    } else {
      // Local heuristic check if AI is unconfigured
      const lowercaseMsg = messageContent.toLowerCase();
      const profaneWords = ['siktir', 'orospu', 'piç', 'göt', 'amına', 'sikeyim', 'kaltak', 'yarrak', 'fuck', 'bitch', 'asshole', 'bastard'];
      const matches = profaneWords.some(word => lowercaseMsg.includes(word));
      if (matches) {
        isProfane = true;
        reason = "Sentinel Yerel Filtresi: Ağır küfür/hakaret kelimesi tespit edildi.";
      }
    }

    // Resolve report
    newReport.status = isProfane ? 'RESOLVED_BANNED' : 'RESOLVED_CLEAN';
    newReport.reason = reason;

    if (isProfane) {
      // 1. Mark user as banned in Postgres and in-memory cache
      const hasValidDb = !!(process.env.DATABASE_URL || process.env.SQL_HOST);
      if (hasValidDb && pool) {
        try {
          await pool.query(
            `UPDATE users SET is_banned = TRUE WHERE id = $1`,
            [senderId]
          );
          // Redact the reported message from the chat_messages table
          await pool.query(
            `UPDATE chat_messages SET message = $1 WHERE id = $2`,
            [`[Bu mesaj Sentinel V900 tarafından küfür/hakaret tespitiyle kaldırılmıştır. Kullanıcı uzaklaştırılmıştır.]`, messageId]
          );
        } catch (dbErr) {
          console.error("Db ban write failed:", dbErr);
        }
      }

      // 2. Notify reporter that user has been banned
      await realtimeService.createNotification({
        userId: reporterId,
        senderId: 'system-sentinel',
        senderName: 'Sentinel V900',
        senderAvatar: '/setupss_icon.svg',
        type: 'like', // sentinel type
        title: 'Şikayetin İncelendi! 🛡️',
        content: `Sentinel V900 yaptığın bildirim üzerine "${senderName}" isimli kullanıcıyı küfür/hakaret tespitiyle uzaklaştırdı. Katkın için teşekkürler!`,
        link: '/chat'
      });
    }

    return { success: true, isProfane, reason };
  }
}

export const sentinelService = new SentinelService();
