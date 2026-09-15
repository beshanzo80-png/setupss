# 02-Database: PostgreSQL Schema & Migration Strategy

## Core Principles
1. **Additive-Only Migrations**: Schema changes must never drop or alter existing production columns destructively without safe backward-compatible transitional states.
2. **Data Integrity**: Foreign key constraints, indexes on high-frequency query columns (user_id, created_at, hardware slugs), and soft deletes where applicable.

---

## Key Database Tables

### 1. `users`
- `id` (VARCHAR, PK)
- `email` (VARCHAR, Unique)
- `password_hash` (VARCHAR)
- `name` (VARCHAR)
- `bio` (TEXT)
- `avatar` (TEXT)
- `role` (VARCHAR: 'admin' | 'moderator' | 'user')
- `is_verified` (BOOLEAN)
- `created_at` (TIMESTAMP)

### 2. `setups`
- `id` (VARCHAR, PK)
- `user_id` (VARCHAR, FK -> users.id)
- `title` (VARCHAR)
- `description` (TEXT)
- `image_url` (TEXT)
- `video_url` (TEXT)
- `components` (JSONB)
- `likes_count` (INTEGER)
- `created_at` (TIMESTAMP)

### 3. `hardware_items`
- `id` (VARCHAR, PK)
- `category` (VARCHAR: 'cpu' | 'gpu' | 'ram' | 'motherboard' | 'monitor' | etc.)
- `name` (VARCHAR)
- `specs` (JSONB)
- `benchmark_score` (INTEGER)
- `created_at` (TIMESTAMP)

### 4. `bot_reports`
- `id` (SERIAL, PK)
- `bot_id` (VARCHAR)
- `bot_name` (VARCHAR)
- `report_type` (VARCHAR)
- `details` (TEXT)
- `severity` (VARCHAR)
- `resolved` (BOOLEAN)
- `created_at` (TIMESTAMP)
