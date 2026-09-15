# Sprint 3A: Hardware Knowledge Graph Engine & Data Core

## Architectural Overview

Sprint 3A establishes the production-level **Hardware Knowledge Graph Engine** data model, relational graph schema, entity relation traveral APIs, bottleneck calculator algorithms, and gaming benchmark engines for Setupss.

### Core Data Model Architecture

```
[Hardware Entity (CPU, GPU, RAM, SSD, PSU, Case, etc.)]
   │
   ├──► [Hardware Relations] (Edges: COMPATIBLE_WITH, RECOMMENDED_PAIRING, BOTTLENECK_PAIR)
   ├──► [Hardware Benchmarks] (Game FPS, Settings, Resolution)
   ├──► [Hardware Price History] (Retailer, Stock, Historical USD)
   └──► [Hardware Reviews & Community Ratings]
```

## Database Schema (Migration `0006_hardware_knowledge_graph_engine`)

### 1. `hardware_relations`
- `id`: PRIMARY KEY
- `source_id`: FK to `hardware.id`
- `target_id`: FK to `hardware.id`
- `relation_type`: `COMPATIBLE_WITH`, `RECOMMENDED_PAIRING`, `BOTTLENECK_PAIR`, `ALTERNATIVE_TO`
- `weight`: NUMERIC confidence/performance score
- `metadata`: JSONB attributes

### 2. `hardware_benchmarks`
- `id`: PRIMARY KEY
- `hardware_id`: FK to `hardware.id`
- `game_id`: FK to `games.id`
- `resolution`: `1080p`, `1440p`, `4K`, `8K`
- `settings_preset`: `Ultra`, `High`, `Medium`
- `avg_fps`: INT
- `one_percent_low_fps`: INT

### 3. `hardware_price_history` & `hardware_reviews`
- Price tracking across retailers and user verification scores.

## API Endpoints

- `GET /api/hardware` -> List & filter hardware entities
- `GET /api/hardware/:slug` -> Wikipedia-style entity details with graph connections
- `GET /api/hardware/:slug/graph` -> Graph node & edge topology for visual/AI processors
- `GET /api/hardware/bottleneck` -> AI & Benchmark calculated bottleneck analysis (`?cpu=...&gpu=...&resolution=...`)

## Status
✅ Complete & Deployed in Production.
