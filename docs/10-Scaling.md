# 10-Scaling: Horizontal Growth & Load Balancing

## Scaling Milestones
- **100 - 1,000 Users**: Single VPS / Cloud Run instance with Neon DB free tier.
- **10,000 - 100,000 Users**: Pooled PostgreSQL connections, Redis caching layer for hardware lookups and session store.
- **1,000,000+ Users**: Multi-region database read replicas, dedicated chat/websocket microservices, and Cloudflare CDN edge caching.
