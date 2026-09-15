# 08-Security: Threat Modeling & Hardening Protocols

## Core Security Tenets
1. **Zero Trust API**: All API endpoints enforce authentication tokens, rate limiting, and strict payload validation (Zod schemas).
2. **SQL Injection Prevention**: Parameterized queries via Drizzle ORM and PostgreSQL connection pools.
3. **XSS & CSRF Defense**: Sanitized user inputs, secure HTTP-only session cookies, and strict Content Security Policy (CSP).

---

## Data Encryption & Secrets Management
- All secrets (Database credentials, Cloudflare R2 tokens, Gemini API keys) are stored in server-side environment variables (`process.env`). Never exposed to client bundle.
- Passwords hashed using industry-standard bcrypt with high work factor.
