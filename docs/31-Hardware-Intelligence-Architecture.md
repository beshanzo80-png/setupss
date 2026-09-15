# Hardware Intelligence & Data Ingestion Architecture
**Version:** 1.0
**Status:** 🟢 ARCHITECTURE DEFINED

This document outlines the real-world data sourcing and AI-driven normalization pipeline for Setupss' Hardware Knowledge Graph.

## 1. Data Source Research & Evaluation

We evaluated multiple public and commercial data sources to build a robust, verifiable hardware database without violating ToS or relying on hallucinated AI data.

### 1.1 Hardware Specifications (CPU, GPU, RAM, Motherboards, etc.)
| Source | Type | Cost | Commercial Use | Pros | Cons | Decision |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **BuildCores OpenDB** | GitHub Repo (JSON) | Free (ODC-By v1.0) | Yes | Community-driven, open-source, no rate limits, highly structured. | Requires periodic pulling from GitHub. | **PRIMARY** for base components. |
| **TechSpecs API** | REST API | Freemium/Paid | Yes | Extremely comprehensive (laptops, peripherals). | Pricing can scale quickly. | **SECONDARY** (Fallback/Enrichment). |
| **TechPowerUp** | Web/API | Free/Partner | Restricted | Most accurate GPU/CPU data globally. | Strict anti-scraping for commercial without partnership. | **ENRICHMENT** (via manual dumps/partner API). |
| **PCPartPicker** | Web | N/A | No | Real-time pricing, massive DB. | No public API. Aggressive anti-scraping (breaks ToS). | **AVOID** direct scraping. |

### 1.2 Gaming Data (For Benchmark Context)
| Source | Type | Cost | Commercial Use | Pros | Cons | Decision |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **IGDB (by Twitch)** | REST API | Free | Yes (Free Partner tier) | Massive database, accurate game engines, release dates. | Rate limit: 4 req/sec. Requires Twitch Auth. | **PRIMARY** for Game Entities. |
| **RAWG** | REST API | Freemium | Restricted | Good metadata. | Free tier limits commercial use. | **AVOID**. |

### 1.3 Benchmark Data (FPS, Temps, Power)
*There is no single "API" for reliable gaming benchmarks. UserBenchmark is unreliable/biased. PassMark is paid and focuses on synthetic scores.*
* **Strategy:** AI-Driven Extraction from Trusted Reviewers.
* **Sources:** TechSpot, Tom's Hardware, RTings, Hardware Unboxed (via transcript extraction).
* **Process:** Web Scraper → Raw Article HTML/Text → Gemini Pro Normalization → `hardware_benchmarks` table with `confidence_score`.

---

## 2. Category & Relationship Boundaries

The AI Normalizer will enforce strict relationship boundaries based on Hardware Category. "Everything relates to everything" is banned.

**Defined Categories:**
`CPU`, `GPU`, `MOTHERBOARD`, `RAM`, `STORAGE_SSD`, `STORAGE_HDD`, `PSU`, `CASE`, `COOLER_CPU`, `MONITOR`, `KEYBOARD`, `MOUSE`, `HEADSET`, `MIC`, `WEBCAM`, `GAMEPAD`, `CHAIR`, `SPEAKER`, `NETWORK`.

**Strict Relationship Matrix (Examples):**
* `CPU` ↔ `MOTHERBOARD`: Allowed (`COMPATIBLE_WITH` - Socket match).
* `MOTHERBOARD` ↔ `RAM`: Allowed (`COMPATIBLE_WITH` - DDR generation match).
* `GPU` ↔ `PSU`: Allowed (`POWER_REQUIRED` - Minimum wattage).
* `CPU` ↔ `GPU`: Allowed (`BOTTLENECK_PAIR` - Only with benchmark proof).
* `MOUSE` ↔ `CPU`: **REJECTED** by AI Validator.
* `CHAIR` ↔ `MONITOR`: **REJECTED** by AI Validator.

---

## 3. The AI Data Engine Pipeline (Architecture)

We will build a Node.js microservice/worker (`HardwareIntelligenceService`) that orchestrates this flow:

### Stage 1: Ingestion (The Gatherer)
* Cron jobs pull raw JSON from **BuildCores OpenDB** nightly.
* Searches IGDB API for requested games.
* Scrapes trusted hardware review articles (via headless browser/Apify) for benchmark tables.

### Stage 2: AI Normalization (The Brain)
Raw JSON or Text is sent to **Gemini API** with strict Zod schemas (using Structured Outputs).
* **Task 1 (Entity Resolution):** Is this a canonical entity (e.g., "RTX 4070") or a variant (e.g., "ASUS TUF RTX 4070")?
* **Task 2 (Data Extraction):** Pull VRAM, TDP, Socket, PCIe gen.
* **Task 3 (Relationship Proposal):** Propose relationships (e.g., requires 650W PSU).

### Stage 3: Validation & Confidence Scoring (The Judge)
* **Rule Engine:** Checks the Category Matrix (e.g., drops Mouse-to-CPU relations).
* **Confidence Score (0-100):**
  * Data from Official Source / BuildCores: `95.00`
  * AI Extracted from Tom's Hardware: `85.00`
  * AI Extracted from Unknown Source: `40.00` (Flags for manual review).

### Stage 4: Database Upsert (The Writer)
* Updates `hardware`, `hardware_aliases`, `games`, `hardware_relations`, and `hardware_benchmarks`.
* Items with `confidence_score < 80` are inserted with `verification_status = 'PENDING'`.
* Items with `confidence_score >= 80` go live as `VERIFIED`.

---

## 4. Updates to the 0007 Schema Migration

To support this real-world flow, the `0007` migration is structurally sound, but we will add specific category enums and source tracking fields in the codebase.

**Codebase Additions (TypeScript/Zod):**
1. `HardwareCategoryEnum` (Strict 20-item list).
2. `IngestionSourceType` ('BUILDCORES', 'IGDB', 'TECHPOWERUP', 'AI_SCRAPER', 'MANUAL').
3. The `HardwareService` will now expose an internal `ingestRawData(payload, source)` endpoint specifically for the AI Engine to push data into.

## 5. Next Steps for Implementation
1. We will NOT write mock data scripts anymore.
2. We will implement the `0007` migration exactly as designed.
3. We will create the `HardwareIntelligenceService` class to handle the Gemini structured parsing.
4. We will connect IGDB and BuildCores as the first two real ingestion pipelines.
