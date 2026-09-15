# Architecture Design v2.1: Hardware Data Engine & Knowledge Graph
**Status:** 🟡 APPROVED WITH CHANGES (Implementation Pending)

## 1. Unified Logical Knowledge Graph
**Concept:** A Service/Domain Graph Layer that aggregates separate relational tables into a unified logical graph traversable via API, without using Neo4j currently.

**Graph Relationships (Logical Edges):**
- **Hardware → Hardware:** `hardware_relations` table.
- **User → Hardware:** `user_hardware_ownership` table (Owns/Used to own).
- **User → Setup:** `setups` table (`user_id` FK).
- **Hardware → Setup:** `setup_hardware` table.
- **Setup → Game:** (Future) `setup_games` table (Played on).
- **Hardware → Game:** Derived through `hardware_benchmarks` table.
- **User → Review:** `hardware_reviews` table.
- **Hardware → Review:** `hardware_reviews` table.

**Service Layer:** The `HardwareGraphService` will abstract these domain tables. It will expose a traversal API (e.g., `getUnifiedGraph(nodeId, depth)`) resolving edges dynamically based on the requested domain connections, avoiding a monolithic graph schema.

## 2. User Hardware Ownership
**Refined Table: `user_hardware_ownership`**
- `id`: UUID PRIMARY KEY
- `user_id`: FK to `users.id`
- `hardware_id`: FK to `hardware.id`
- `purchase_date`: DATE (Optional)
- `purchase_price`: NUMERIC (Optional)
- `currency`: VARCHAR(3) (Optional)
- `is_currently_owned`: BOOLEAN DEFAULT true
- `created_at`: TIMESTAMPTZ
- `updated_at`: TIMESTAMPTZ
- **Privacy Rule:** No `serial_or_note` or sensitive personally identifiable hardware metrics will be collected.

## 3. Benchmark Data Model
**Hybrid Model:** Normalized columns for frequent filtering, JSONB for flexible test-rig extras.

**Normalized Columns (For Filtering & Aggregation):**
- `id`, `hardware_id`, `game_id`
- `cpu_id` (FK to hardware, for bottleneck tracking)
- `resolution` (1080p, 1440p, 4K)
- `preset` (Low, Medium, High, Ultra)
- `upscaling_tech` (None, DLSS, FSR, XeSS)
- `ray_tracing_mode` (Off, On, Overdrive)
- `avg_fps`, `one_percent_low_fps`

**JSONB Columns (For Detail Rendering, Not Filtering):**
- `test_rig_extras`: `{ "ram_config": "32GB DDR5 6000MHz", "os": "Windows 11 23H2", "driver_version": "551.23", "gpu_clock_offset": "+150MHz" }`

## 4. Benchmark Provenance
**Goal:** Track origin, trust level, and source URL of every benchmark.

**Columns to add to `hardware_benchmarks`:**
- `source_type`: ENUM ('OFFICIAL', 'PROFESSIONAL_REVIEW', 'COMMUNITY', 'AI_GENERATED')
- `source_name`: VARCHAR (e.g., 'TechPowerUp', 'Hardware Unboxed', 'User: beshanzo')
- `source_url`: VARCHAR (Optional reference link)
- `confidence_score`: NUMERIC (1-100) (Calculated by the engine based on source trust)
- `collected_at`: TIMESTAMPTZ

**Conflict Resolution:** If multiple sources submit the exact same benchmark config, the engine will prioritize `PROFESSIONAL_REVIEW` > `OFFICIAL` > `COMMUNITY`. An aggregated `avg_fps` across all community submissions will be calculated via material views if volume scales.

## 5. Verification ≠ Source
Separate verification state from data provenance.

**Columns to add to entities (hardware, benchmarks):**
- `verification_status`: ENUM ('PENDING', 'VERIFIED', 'REJECTED', 'FLAGGED')
- `verified_by`: FK to `users.id` (Admin/Moderator who approved it)
- `verified_at`: TIMESTAMPTZ
- `source_metadata`: JSONB (For internal provenance details: URL, scraping agent ID, submitter ID).

## 6. Hardware Relation Metadata
`hardware_relations.metadata` will be validated via strict Zod schemas on the backend, rather than arbitrary JSONB, preventing technical debt.

**Examples of validated schemas:**
- **Socket Match:** `{ "reason": "socket_match", "socket": "AM5" }`
- **Power Requirement:** `{ "reason": "power_requirement", "required_watts": 850 }`
- **PCIe Gen:** `{ "reason": "pcie_compatibility", "pcie_generation": 5 }`

## 7. Graph Scaling
**Architectural Triggers (SLOs) to migrate from PostgreSQL Recursive CTEs to a dedicated Graph DB (Neo4j):**
- **Node Count:** > 5,000,000 active graph nodes.
- **Edge Count:** > 50,000,000 relationships.
- **p95 Latency:** Deep traversal (3+ hops) exceeds 200ms.
- **CPU Utilization:** PostgreSQL DB CPU consistently > 70% during graph reads.
*Currently, PostgreSQL is perfectly sufficient. We will monitor these metrics as targets, not hard facts yet.*

## 8. Canonical + Variant Model
**Generalizing Parent-Child beyond GPUs:**
- **`hardware` table additions:**
  - `parent_id`: FK to `hardware.id` (Self-referencing)
  - `is_canonical`: BOOLEAN (True if it's the base chip/architecture).
  - `variant_type`: ENUM ('AIB_PARTNER', 'BOX', 'OEM', 'REVISION', 'CUSTOM_LOOP')

**Categories:**
- **GPU:** Canonical: RTX 5090 -> Variant: ASUS ROG Strix RTX 5090
- **CPU:** Canonical: Ryzen 9800X3D -> Variant: 9800X3D Boxed / Tray
- **Mouse:** Canonical: Logitech G Pro X Superlight -> Variant: Magenta / White / Black

## 9. Game Domain
**Games as First-Class Entities:**
`games` table will track benchmark targets.
- `id`, `name`, `slug`
- `developer`, `publisher`, `release_date`
- `engine` (e.g., Unreal Engine 5, CyberEngine) -> Important for benchmark correlations.
- `graphics_api` (DX12, Vulkan)

*Will not over-normalize DLCs or editions unless they severely impact FPS (e.g., Next-Gen Updates).*

## 10. Search Architecture
- **Unified Search Service:** A unified endpoint `/api/v2/search?q=...` covering Hardware, Games, Setups, and Users.
- **Tech:** PostgreSQL `tsvector` + `pg_trgm` on indexed columns.
- **Future:** OpenSearch integration is deferred until search query latency exceeds target 150ms p95 or full-text typo tolerance in PostgreSQL becomes insufficient.

## 11. SEO & Canonicalization
- **Aliases:** `hardware_aliases` table (`alias` -> `canonical_hardware_id`).
- **Redirects:** If a user navigates to `/hardware/rtx-5090`, the server resolves the alias, returns a 301 Permanent Redirect to `/hardware/nvidia-geforce-rtx-5090`.
- This ensures 0 duplicate content indexing by Google.

## 12. Mobile API & DTO Standard
- `/api/v2/` will serve both Next.js/React and iOS/Android.
- **DTOs:** Responses will not expose raw DB rows. Strict TypeScript interfaces (and their Kotlin/Swift equivalents) will define `HardwareDto`, `BenchmarkDto`, `UnifiedGraphDto`.
- **Versioning:** API changes to the Graph will increment `/api/v3/`.

## 13. Database Migration Safety (0007 Analysis)
- **Additive-Only:** `hardware_relations` additions, `user_hardware_ownership`, `hardware_benchmarks` updates, `games`, `hardware_aliases`.
- **Backward Compatible:** Existing `setup_hardware` and `hardware` tables will not be dropped or renamed. `parent_id` added as nullable.
- **Index Creation:** To prevent locking the active DB, indices on large tables (`CREATE INDEX CONCURRENTLY`) will be utilized in production environments.

## 14. Current Codebase Compatibility
- **`server-db.ts`:** Needs migration 0007 structured exactly according to this spec.
- **`HardwareRepository.ts`:** Needs to be updated to query `parent_id`, `hardware_aliases`, and `games` joins, fetching provenance data.
- **`HardwareService.ts` & `HardwareKnowledgeGraphExplorer.tsx`:** UI needs tweaks to display provenance (source of benchmark) and variant hierarchies, but the existing component structure is highly compatible. API responses will remain backwards compatible via logical layer abstractions.

## 15. Final CTO Decision
**Verdict: 🟡 APPROVED WITH CHANGES**

**Next Steps to clear for 0007 Implementation:**
This document serves as the final schema contract for Architecture Design v2.1. Once this is reviewed and structurally validated against the existing codebase by the CTO, we are cleared to execute the actual `0007_hardware_data_engine_core` migration and write the corresponding Backend DTOs, Repository methods, and Zod schemas.
