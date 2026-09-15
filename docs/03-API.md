# 03-API: RESTful Endpoints & Specifications

## Core Authentication & Security
- All sensitive API routes require JWT Bearer token authentication or session cookie verification.
- Strict rate limiting on auth, messaging, and community posting endpoints.

---

## Endpoint Specification Summary

### Users & Auth
- `POST /api/auth/register` - Register new user account
- `POST /api/auth/login` - Authenticate and issue session token
- `GET /api/users/:id` - Fetch public user profile & timeline setups

### Setups & Community
- `GET /api/setups` - Paginated list of community setups with filters
- `POST /api/setups` - Create a new setup showcase
- `GET /api/setups/:id` - Detailed setup view with hardware relations
- `POST /api/setups/:id/like` - Toggle setup like

### AI & Bot Fleet
- `GET /api/admin/bot-reports` - Fetch active 30-bot audit logs
- `POST /api/admin/bot-reports/:id/resolve` - Resolve a bot inspection report
- `POST /api/ai/validate` - Run AI compatibility, bottleneck, and power draw validation
