# 01-Architecture: System & Modular Monolith Principles

## Architectural Tenets
1. **Modular Monolith First**: Single backend, single PostgreSQL database, single API, structured with Domain-Driven Design (DDD) module boundaries.
2. **Zero Technical Debt**: No temporary fixes, no hardcoded stubs, no duplicate tables or APIs.
3. **Multi-Platform Consistency**: Shared backend and RESTful/Realtime APIs powering Web (React/Vite) and future native mobile apps (React Native / Native iOS & Android).
4. **Future Proof**: Built from day one to scale seamlessly to millions of concurrent enthusiasts without architectural rewrites.

---

## Domain-Driven Design (DDD) Modules
- **accounts/**: User management, authentication, roles, profiles, badges, and reputation scores.
- **community/**: Setup showcases, posts, comments, likes, voting, and discussion threads.
- **knowledge/**: Hardware Knowledge Graph (CPUs, GPUs, RAM, motherboards, monitors, games, benchmarks).
- **ai/**: Autonomous bot fleet, AI Builder compatibility, bottleneck analysis, and recommendation engines.
- **social/**: Friendship system, direct messaging, global chat, and activity feeds.
- **media/**: Cloudflare R2 object storage, image/video optimization, and streaming asset delivery.
- **search/**: Full-text search, semantic filtering, and programmatic SEO prerendering.
- **admin/**: Administrative controls, security logs, database health checks, and bot fleet monitoring.
