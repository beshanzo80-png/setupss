// Ensure serverless mode flags are active before importing server bundle
process.env.SERVERLESS = "1";
if (!process.env.VERCEL) {
  process.env.VERCEL = "1";
}

// Explicitly referenced production dependencies for Vercel NFT (Node File Trace)
import express from "express";
import "pg";
import "connect-pg-simple";
import "express-session";
import "helmet";
import "compression";
import "express-rate-limit";
import "bcryptjs";
import "dotenv";
import "@google/genai";
import "socket.io";
import "ws";
import "nodemailer";
import "passport";
import "passport-local";
import "passport-google-oauth20";
import "firebase-admin/app";
import "firebase-admin/auth";
import "@aws-sdk/client-s3";
import "@aws-sdk/s3-request-presigner";
import "sharp";
import "node-cron";

import { createRequire } from "node:module";
import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from "node:url";
import type { Request, Response } from "express";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const require = createRequire(import.meta.url);

let cachedApp: any = null;
let initPromise: Promise<any> | null = null;

async function resolveServerApp() {
  if (cachedApp && typeof cachedApp === "function") {
    return cachedApp;
  }

  if (initPromise) {
    return await initPromise;
  }

  initPromise = (async () => {
    // 1. Try pre-bundled dist/server.cjs (production Vercel artifact)
    const candidatePaths = [
      path.resolve(process.cwd(), "dist/server.cjs"),
      path.resolve(__dirname, "../dist/server.cjs"),
      path.resolve(__dirname, "./dist/server.cjs"),
      "/var/task/dist/server.cjs",
      path.resolve(process.cwd(), "server.cjs"),
      "/var/task/server.cjs"
    ];

    for (const p of candidatePaths) {
      if (fs.existsSync(p)) {
        try {
          console.log(`[api/index.ts] Found production server bundle at: ${p}`);
          const mod = require(p);
          const app = mod.app || mod.default || mod;
          if (typeof app === "function") {
            cachedApp = app;
            return cachedApp;
          }
        } catch (e: any) {
          console.warn(`[api/index.ts] Error loading bundle at ${p}:`, e?.message);
        }
      }
    }

    // 2. Fallback: Import source server.ts dynamically if running in dev / tsx mode
    try {
      const serverModule = await import("../server.js").catch(() => import("../server.ts"));
      const app = (serverModule as any).app || (serverModule as any).default;
      if (typeof app === "function") {
        cachedApp = app;
        return cachedApp;
      }
    } catch (e: any) {
      console.warn("[api/index.ts] Error importing server.ts fallback:", e?.message);
    }

    throw new Error("Could not resolve Express app instance from bundle or source.");
  })();

  return await initPromise;
}

/**
 * Vercel Serverless Entry Point
 * Ensures Express application and core services are fully loaded and awaited
 * before dispatching HTTP requests. If an error occurs, logs and responds with
 * HTTP 500 and real error details.
 */
export default async function handler(req: Request | any, res: Response | any) {
  try {
    const expressApp = await resolveServerApp();
    if (typeof expressApp === "function") {
      return expressApp(req, res);
    }
    throw new Error(`Serverless Express instance is not a function (received: ${typeof expressApp})`);
  } catch (err: any) {
    console.error("[api/index.ts] Serverless Handler Invocation Error:", err);
    if (!res.headersSent) {
      res.statusCode = 500;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify({
        error: "Express server instance not ready.",
        message: err?.message || String(err),
        name: err?.name || "InitializationError",
        stack: process.env.NODE_ENV !== "production" ? err?.stack : undefined,
        timestamp: new Date().toISOString()
      }));
    }
  }
}

export const app = handler;
