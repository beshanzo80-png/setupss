# 09-Deployment: Containerization & Cloud Run Pipeline

## Build & Production Pipeline
- **Bundling**: Vite frontend build combined with esbuild backend compilation (`dist/server.cjs`).
- **Containerization**: Dockerized Node.js runtime environment binding to port `3000` behind nginx reverse proxy.
- **Continuous Deployment**: Automated deployments on Cloud Run with zero-downtime rolling updates.

---

## Environment Variables
- `DATABASE_URL`: PostgreSQL connection string.
- `GEMINI_API_KEY`: Server-side AI intelligence key.
- `R2_ACCESS_KEY_ID` / `R2_SECRET_ACCESS_KEY`: Cloudflare R2 media storage credentials.
