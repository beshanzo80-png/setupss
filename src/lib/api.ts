export async function safeJsonResponse<T = any>(res: Response): Promise<T> {
  try {
    const text = await res.text();
    if (!text || !text.trim()) {
      return {
        success: false,
        error: `Boş yanıt alındı (Status: ${res.status})`,
        message: `Boş yanıt alındı (Status: ${res.status})`
      } as unknown as T;
    }

    try {
      return JSON.parse(text);
    } catch {
      // If text is not valid JSON
      if (text.includes("Rate exceeded") || text.includes("Quota exceeded") || text.includes("resource_exhausted") || res.status === 429) {
        return {
          success: false,
          error: "Yapay zeka istek limiti aşıldı (Rate exceeded). Lütfen kısa bir süre bekleyip tekrar deneyin.",
          message: "Yapay zeka istek limiti aşıldı (Rate exceeded). Lütfen kısa bir süre bekleyip tekrar deneyin.",
          remainingRequests: 0,
          resetInMinutes: 5
        } as unknown as T;
      }

      return {
        success: false,
        error: text.length < 200 ? text : `Sunucu hatası (${res.status})`,
        message: text.length < 200 ? text : `Sunucu hatası (${res.status})`
      } as unknown as T;
    }
  } catch (err: any) {
    return {
      success: false,
      error: err.message || "Ağ hatası oluştu.",
      message: err.message || "Ağ hatası oluştu."
    } as unknown as T;
  }
}
