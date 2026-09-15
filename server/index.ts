import express from "express";
import { createRequire } from "node:module";
import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const require = createRequire(import.meta.url);

let appInstance: any = null;
let initPromise: Promise<any> | null = null;
let lastInitializationError: Error | any = null;
let candidateAttempts: Array<{ path: string; status: string; error?: string }> = [];

/**
 * Asynchronously loads and initializes the Express application instance.
 * Thread-safe / Promise-coalesced for Serverless environments (e.g., Vercel).
 */
export async function getServerApp(): Promise<any> {
  if (appInstance && typeof appInstance === "function") {
    return appInstance;
  }

  if (initPromise) {
    return await initPromise;
  }

  initPromise = (async () => {
    candidateAttempts = [];
    const candidatePaths = [
      path.resolve(process.cwd(), "dist/server.cjs"),
      path.resolve(__dirname, "../dist/server.cjs"),
      path.resolve(__dirname, "./dist/server.cjs"),
      path.resolve(__dirname, "../../dist/server.cjs"),
      "/var/task/dist/server.cjs",
      path.resolve(process.cwd(), "server.cjs"),
      "/var/task/server.cjs"
    ];

    for (const p of candidatePaths) {
      if (fs.existsSync(p)) {
        try {
          console.log(`[server/index.ts] Found server bundle at: ${p}`);
          const mod = require(p);
          const candidateApp = mod.app || mod.default || mod;

          if (typeof candidateApp === "function") {
            // Optional grace period for database migration/schema verification
            if (mod.dbInitPromise && typeof mod.dbInitPromise.then === "function") {
              try {
                await Promise.race([
                  mod.dbInitPromise,
                  new Promise((resolve) => setTimeout(resolve, 2000))
                ]);
              } catch (dbErr: any) {
                console.warn("[server/index.ts] Database startup warning (proceeding with app):", dbErr?.message || dbErr);
              }
            }

            appInstance = candidateApp;
            lastInitializationError = null;
            candidateAttempts.push({ path: p, status: "loaded_successfully" });
            console.log(`[server/index.ts] Successfully initialized Express app from ${p}`);
            return appInstance;
          } else {
            const typeErr = `Module export is not a function (received: ${typeof candidateApp})`;
            candidateAttempts.push({ path: p, status: "invalid_export", error: typeErr });
          }
        } catch (err: any) {
          console.error(`[server/index.ts] Error requiring bundle at ${p}:`, err);
          lastInitializationError = err;
          candidateAttempts.push({ path: p, status: "require_failed", error: err?.message || String(err) });
        }
      } else {
        candidateAttempts.push({ path: p, status: "file_not_found" });
      }
    }

    // Dynamic import fallback for dev or environments where server.ts can be evaluated directly
    if (!appInstance) {
      try {
        console.log("[server/index.ts] Candidate paths failed. Attempting dynamic import of server module...");
        const tsMod: any = await import("../server.js" as any).catch(() => import("../server.ts" as any));
        const candidateApp = tsMod?.app || tsMod?.default || tsMod;
        if (typeof candidateApp === "function") {
          appInstance = candidateApp;
          lastInitializationError = null;
          console.log("[server/index.ts] Successfully loaded app via dynamic import.");
          return appInstance;
        }
      } catch (dynErr: any) {
        console.warn("[server/index.ts] Dynamic import fallback error:", dynErr?.message || dynErr);
        candidateAttempts.push({ path: "../server.ts", status: "dynamic_import_failed", error: dynErr?.message || String(dynErr) });
      }
    }

    if (!appInstance || typeof appInstance !== "function") {
      const errorDetail = lastInitializationError?.message 
        ? lastInitializationError.message 
        : "Could not locate or initialize dist/server.cjs in any candidate path";
      const finalError = new Error(`Server initialization failed: ${errorDetail}`);
      if (lastInitializationError?.stack) {
        finalError.stack = lastInitializationError.stack;
      }
      lastInitializationError = finalError;
      throw finalError;
    }

    return appInstance;
  })();

  try {
    return await initPromise;
  } catch (err) {
    // Reset so subsequent requests have a chance to retry rather than being permanently locked
    initPromise = null;
    throw err;
  }
}

// Start async initialization in background early (best effort, non-blocking)
getServerApp().catch(() => {});

/**
 * Serverless HTTP Handler that awaits Express initialization before serving.
 */
export const handler = async (req: any, res: any) => {
  try {
    const app = await getServerApp();
    if (typeof app === "function") {
      return app(req, res);
    }
    throw new Error(`Resolved Express app is not a function (received: ${typeof app})`);
  } catch (err: any) {
    console.error("[server/index.ts] Serverless Handler error:", err);
    if (!res.headersSent) {
      res.statusCode = 500;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify({
        error: "Express server instance not ready.",
        message: err?.message || String(err),
        name: err?.name || "InitializationError",
        attempts: candidateAttempts,
        stack: process.env.NODE_ENV !== "production" ? err?.stack : undefined,
        timestamp: new Date().toISOString()
      }));
    }
  }
};

export const app = handler;
export default handler;
