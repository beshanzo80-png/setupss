# Sprint 3B: Final Implementation Contract & Schema Freeze
**Migration:** `0007_hardware_data_engine_core`
**Status:** 🟡 PENDING IMPLEMENTATION

This document defines the strict schema and implementation contract for the Hardware Data Engine v2, incorporating all 10 mandatory architectural corrections from the CTO review.

## 1. Database Schema Additions & Constraints

### 1.1 `hardware` table updates
- `parent_hardware_id`: `UUID` (FK to `hardware.id`, nullable). *Name fixed to match existing terminology.*
- `is_canonical`: `BOOLEAN` (NOT NULL, defaults to TRUE).
- `variant_type`: `VARCHAR(50)` (Nullable, e.g., 'AIB_PARTNER', 'BOX', 'OEM').

**Crucial Constraints:**
- **Canonical Rule Check:** A database `CHECK` constraint must enforce the logical relationship between `parent_hardware_id` and `is_canonical`:
  ```sql
  CHECK (
    (parent_hardware_id IS NULL AND is_canonical = TRUE) OR
    (parent_hardware_id IS NOT NULL AND is_canonical = FALSE)
  )
  ```
- **Cycle Prevention:** Service layer must strictly ensure that assigning a `parent_hardware_id` does not create a cyclical hierarchy (e.g., A -> B -> A).

### 1.2 `user_hardware_ownership` table
- `id`: `UUID` PRIMARY KEY
- `user_id`: FK to `users.id`
- `hardware_id`: FK to `hardware.id`
- `purchase_date`: `DATE` (Optional)
- `purchase_price`: `NUMERIC(10, 2)` (Optional)
- `currency`: `VARCHAR(3)` (Optional, e.g., 'USD', 'EUR', 'TRY'). *Fixed from TEXT(3).*
- `is_currently_owned`: `BOOLEAN` DEFAULT true
- `quantity`: `INT` DEFAULT 1. *Added to handle multiples of the same hardware smoothly without spamming duplicate rows for a single purchase.*
- `created_at`: `TIMESTAMPTZ`
- `updated_at`: `TIMESTAMPTZ`

### 1.3 `games` table (First-Class Domain Entity)
- `id`: `UUID` PRIMARY KEY
- `name`: `VARCHAR(255)` NOT NULL
- `slug`: `VARCHAR(255)` UNIQUE NOT NULL
- `developer`: `VARCHAR(255)`
- `publisher`: `VARCHAR(255)`
- `release_date`: `DATE`
- `engine`: `VARCHAR(100)`
- `graphics_api`: `VARCHAR(50)`

### 1.4 `hardware_benchmarks` updates (Hybrid Model)
**Relational Dimensions (For Grouping/Filtering):**
- `hardware_id`: FK to `hardware.id`
- `game_id`: FK to `games.id`
- `cpu_id`: FK to `hardware.id` (Optional)
- `resolution`: `VARCHAR(50)`
- `preset`: `VARCHAR(50)`
- `upscaling_tech`: `VARCHAR(50)`
- `ray_tracing_mode`: `VARCHAR(50)`
- `avg_fps`: `NUMERIC(8,2)`
- `one_percent_low_fps`: `NUMERIC(8,2)`

**Provenance & Verification:**
- `source_type`: `VARCHAR(50)` ('OFFICIAL', 'PROFESSIONAL_REVIEW', 'COMMUNITY', 'AI_GENERATED')
- `source_name`: `VARCHAR(255)`
- `source_url`: `VARCHAR(2000)`
- `confidence_score`: `NUMERIC(5,2)` (0.00 to 100.00, computed by the backend service. Not a hardcoded starting value.)
- `verification_status`: `VARCHAR(50)` ('PENDING', 'VERIFIED', 'REJECTED')
- `verified_by`: FK to `users.id`
- `verified_at`: `TIMESTAMPTZ`

**Extras:**
- `test_rig_metadata`: `JSONB`

**Conflict Grouping Rule:**
Canonical selection for benchmarks is grouped strictly by:
`hardware_id` + `game_id` + `resolution` + `preset` + `upscaling_tech` + `ray_tracing_mode`.
Among benchmarks with *identical* conditions, the one with the highest calculated `confidence_score` acts as the canonical result.

### 1.5 `hardware_aliases`
- `id`: `UUID` PRIMARY KEY
- `alias`: `VARCHAR(255)` UNIQUE NOT NULL
- `canonical_hardware_id`: FK to `hardware.id`

**Normalization Rule:** The Service layer MUST `.trim().toLowerCase()` all incoming alias strings before saving or querying.

## 2. API & Zod Contracts

### 2.1 Relation Metadata Strict Validation
`hardware_relations.metadata` Zod validation must strictly pair `relation_type` with its exact metadata shape. No generic fallbacks that accept garbage data.
```typescript
const RelationSchema = z.discriminatedUnion('relation_type', [
  z.object({
    relation_type: z.literal('POWER_REQUIRED'),
    metadata: z.object({ reason: z.literal('power_requirement'), required_watts: z.number() })
  }),
  z.object({
    relation_type: z.literal('COMPATIBLE_WITH'),
    metadata: z.object({ reason: z.literal('socket_match'), socket: z.string() })
  }),
  // ...other strict mappings
]);
```

### 2.2 Graph Visibility Context
The Unified Logical Graph API will separate Public vs. Admin views:
- **PUBLIC View:** Only returns nodes/edges with `verification_status = 'VERIFIED'` and crossing a minimum `confidence_score` threshold.
- **ADMIN/MOD View:** Returns all nodes including `PENDING` items, avoiding data blindness in the backend.

### 2.3 API Versioning
All new endpoints and DTO updates will remain under `/api/v2/`. We are not moving to `v3`.

## 3. Migration Strategy (`0007_hardware_data_engine_core`)

### 3.1 `CREATE INDEX CONCURRENTLY` Risk
`CREATE INDEX CONCURRENTLY` cannot run inside standard PostgreSQL transaction blocks (`BEGIN ... COMMIT`).
- **Action:** For the migration runner, we will use standard `CREATE INDEX` to maintain transaction safety during development. If a table is massive in production, `CONCURRENTLY` will be executed out-of-band via raw SQL scripts or a dedicated non-transactional migration step.

### 3.2 Rollback Strategy & Integrity
- The `down()` method must meticulously drop all added constraints, columns (`parent_hardware_id`, `is_canonical`), and tables (`games`, `user_hardware_ownership`, `hardware_aliases`).
- **Warning:** Reverting 0007 after subsequent migrations (0008+) run may cause data corruption if those migrations rely on 0007's structures. 0007 is only fully safe to rollback if it is the latest applied migration.

## 4. Final Sign-off
This document is the **Final Schema Freeze** for the 0007 implementation. Once approved, no structural changes will be introduced quietly during the coding phase.
