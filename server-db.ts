import { Pool } from 'pg';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import { SetupPost, WishlistItem, ChatMessage } from './src/types.js';
import { curatedSetups } from './src/curatedSetups.js';
import { HARDWARE_CATALOG } from './src/utils/hardwareEngine.js';

dotenv.config({ override: true });

const rawDbUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL || process.env.POSTGRES_PRISMA_URL || process.env.POSTGRES_URL_NON_POOLING || process.env.SUPABASE_DATABASE_URL;
const isValidPostgresUrl = !!(rawDbUrl && (rawDbUrl.startsWith('postgresql://') || rawDbUrl.startsWith('postgres://')));

const isVercel = !!(process.env.VERCEL || process.env.VERCEL_ENV || process.env.NOW_REGION);

const globalAny: any = globalThis;
export const pool = globalAny.dbPool || new Pool(
  isValidPostgresUrl
    ? { 
        connectionString: rawDbUrl, 
        ssl: { rejectUnauthorized: false },
        max: isVercel ? 2 : 10,
        connectionTimeoutMillis: 10000,
        idleTimeoutMillis: isVercel ? 10000 : 30000,
      }
    : {
        host: process.env.SQL_HOST,
        user: process.env.SQL_USER,
        password: process.env.SQL_PASSWORD,
        database: process.env.SQL_DB_NAME,
        connectionTimeoutMillis: 5000,
        max: isVercel ? 2 : 10,
        idleTimeoutMillis: isVercel ? 10000 : 30000,
      }
);

// Always cache pool across hot lambdas in serverless environments
globalAny.dbPool = pool;

export async function runVersionedMigrations(client: any) {
  // 1. Ensure schema_migrations tracking table exists
  await client.query(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      version VARCHAR(50) PRIMARY KEY,
      name TEXT NOT NULL,
      checksum TEXT,
      applied_at TIMESTAMPTZ DEFAULT NOW(),
      execution_time_ms INT DEFAULT 0
    );
  `);

  const { rows: appliedRows } = await client.query(`SELECT version FROM schema_migrations`);
  const appliedVersions = new Set<string>(appliedRows.map((r: any) => r.version));

  const migrations = [
    {
      version: '0001_core_tables',
      name: 'Initial core schema (users, setups, wishlist, chat_messages, friends, activity_logs, media_files, site_settings)',
      up: async (tx: any) => {
        await tx.query(`
          CREATE TABLE IF NOT EXISTS users (
            id TEXT PRIMARY KEY,
            email TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL,
            name TEXT NOT NULL,
            avatar TEXT,
            is_verified BOOLEAN DEFAULT FALSE,
            verification_code TEXT,
            created_at TIMESTAMPTZ DEFAULT NOW(),
            updated_at TIMESTAMPTZ DEFAULT NOW()
          );
        `);

        const userCols = [
          `ALTER TABLE users ADD COLUMN IF NOT EXISTS IF NOT EXISTS is_verified BOOLEAN DEFAULT FALSE;`,
          `ALTER TABLE users ADD COLUMN IF NOT EXISTS IF NOT EXISTS verification_code TEXT;`,
          `ALTER TABLE users ADD COLUMN IF NOT EXISTS IF NOT EXISTS verification_expires_at TIMESTAMPTZ;`,
          `ALTER TABLE users ADD COLUMN IF NOT EXISTS IF NOT EXISTS bio TEXT;`,
          `ALTER TABLE users ADD COLUMN IF NOT EXISTS IF NOT EXISTS github_link TEXT;`,
          `ALTER TABLE users ADD COLUMN IF NOT EXISTS IF NOT EXISTS instagram_link TEXT;`,
          `ALTER TABLE users ADD COLUMN IF NOT EXISTS IF NOT EXISTS linkedin_link TEXT;`,
          `ALTER TABLE users ADD COLUMN IF NOT EXISTS IF NOT EXISTS cover_photo TEXT;`,
          `ALTER TABLE users ADD COLUMN IF NOT EXISTS IF NOT EXISTS custom_badge TEXT;`,
          `ALTER TABLE users ADD COLUMN IF NOT EXISTS IF NOT EXISTS custom_color TEXT;`,
          `ALTER TABLE users ADD COLUMN IF NOT EXISTS IF NOT EXISTS invite_count INT DEFAULT 0;`,
          `ALTER TABLE users ADD COLUMN IF NOT EXISTS IF NOT EXISTS is_crown BOOLEAN DEFAULT FALSE;`,
          `ALTER TABLE users ADD COLUMN IF NOT EXISTS IF NOT EXISTS reference_code TEXT;`,
          `ALTER TABLE users ADD COLUMN IF NOT EXISTS IF NOT EXISTS has_rgb BOOLEAN DEFAULT FALSE;`,
          `ALTER TABLE users ADD COLUMN IF NOT EXISTS IF NOT EXISTS role TEXT DEFAULT 'user';`,
          `ALTER TABLE users ADD COLUMN IF NOT EXISTS IF NOT EXISTS is_banned BOOLEAN DEFAULT FALSE;`,
          `ALTER TABLE users ADD COLUMN IF NOT EXISTS IF NOT EXISTS streak_count INT DEFAULT 0;`,
          `ALTER TABLE users ADD COLUMN IF NOT EXISTS IF NOT EXISTS last_active_date TIMESTAMPTZ;`,
          `ALTER TABLE users ADD COLUMN IF NOT EXISTS IF NOT EXISTS streak_companion TEXT DEFAULT 'sarcastic';`,
          `ALTER TABLE users ADD COLUMN IF NOT EXISTS IF NOT EXISTS streak_freezes INT DEFAULT 1;`
        ];
        for (const colSql of userCols) {
          await tx.query(colSql).catch(() => {});
        }

        await tx.query(`
          CREATE TABLE IF NOT EXISTS setups (
            id TEXT PRIMARY KEY,
            title TEXT NOT NULL,
            owner TEXT NOT NULL,
            owner_id TEXT,
            bio TEXT,
            category TEXT NOT NULL,
            description TEXT,
            image TEXT,
            likes INTEGER DEFAULT 0,
            tags JSONB DEFAULT '[]'::jsonb,
            components JSONB DEFAULT '[]'::jsonb,
            comments JSONB DEFAULT '[]'::jsonb,
            card_theme TEXT DEFAULT 'dark',
            created_at TIMESTAMPTZ DEFAULT NOW(),
            video_url TEXT,
            is_bot_share BOOLEAN DEFAULT FALSE
          );
        `);

        await tx.query(`
          CREATE TABLE IF NOT EXISTS setup_likes (
            user_id TEXT NOT NULL,
            setup_id TEXT NOT NULL,
            PRIMARY KEY (user_id, setup_id)
          );
        `);

        await tx.query(`
          CREATE TABLE IF NOT EXISTS wishlist (
            id TEXT PRIMARY KEY,
            user_id TEXT,
            name TEXT NOT NULL,
            category TEXT NOT NULL,
            estimated_price NUMERIC DEFAULT 0,
            purchased BOOLEAN DEFAULT FALSE,
            link TEXT,
            notes TEXT,
            created_at TIMESTAMPTZ DEFAULT NOW()
          );
        `);

        await tx.query(`
          CREATE TABLE IF NOT EXISTS chat_messages (
            id TEXT PRIMARY KEY,
            sender_id TEXT NOT NULL,
            sender_name TEXT NOT NULL,
            sender_avatar TEXT,
            receiver_id TEXT NOT NULL,
            receiver_name TEXT NOT NULL,
            receiver_avatar TEXT,
            message TEXT NOT NULL,
            is_read BOOLEAN DEFAULT FALSE,
            created_at TIMESTAMPTZ DEFAULT NOW(),
            media_url TEXT,
            media_type TEXT,
            sender_has_rgb BOOLEAN DEFAULT FALSE
          );
        `);

        await tx.query(`
          CREATE TABLE IF NOT EXISTS friends (
            id TEXT PRIMARY KEY,
            user_id TEXT NOT NULL,
            friend_id TEXT NOT NULL,
            status TEXT NOT NULL,
            created_at TIMESTAMPTZ DEFAULT NOW(),
            UNIQUE(user_id, friend_id)
          );
        `);

        await tx.query(`
          CREATE TABLE IF NOT EXISTS activity_logs (
            id TEXT PRIMARY KEY,
            action_type TEXT NOT NULL,
            user_id TEXT,
            user_name TEXT,
            details TEXT,
            created_at TIMESTAMPTZ DEFAULT NOW()
          );
        `);

        await tx.query(`
          CREATE TABLE IF NOT EXISTS media_files (
            id TEXT PRIMARY KEY,
            file_name TEXT NOT NULL,
            file_url TEXT NOT NULL,
            file_type TEXT NOT NULL,
            file_size BIGINT DEFAULT 0,
            mime_type TEXT,
            uploader_id TEXT,
            uploader_name TEXT,
            created_at TIMESTAMPTZ DEFAULT NOW(),
            thumbnail_512 TEXT,
            thumbnail_256 TEXT
          );
        `);

        await tx.query(`
          CREATE TABLE IF NOT EXISTS site_settings (
            key TEXT PRIMARY KEY,
            value TEXT
          );
        `);
      }
    },
    {
      version: '0002_sprint1_entities',
      name: 'Sprint 1 Entity Knowledge Graph tables (brands, hardware_categories, hardware, games, entity_audit_logs, setup_hardware, setup_games)',
      up: async (tx: any) => {
        await tx.query(`
          CREATE TABLE IF NOT EXISTS brands (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            slug TEXT UNIQUE NOT NULL,
            logo_url TEXT,
            description TEXT,
            website TEXT,
            is_deleted BOOLEAN DEFAULT FALSE,
            created_at TIMESTAMPTZ DEFAULT NOW(),
            updated_at TIMESTAMPTZ DEFAULT NOW()
          );
        `);

        await tx.query(`
          CREATE TABLE IF NOT EXISTS hardware_categories (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            slug TEXT UNIQUE NOT NULL,
            icon TEXT,
            description TEXT,
            is_deleted BOOLEAN DEFAULT FALSE,
            created_at TIMESTAMPTZ DEFAULT NOW(),
            updated_at TIMESTAMPTZ DEFAULT NOW()
          );
        `);

        await tx.query(`
          CREATE TABLE IF NOT EXISTS hardware (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            slug TEXT UNIQUE NOT NULL,
            brand_id TEXT REFERENCES brands(id) ON DELETE SET NULL,
            category_id TEXT REFERENCES hardware_categories(id) ON DELETE SET NULL,
            description TEXT,
            specs JSONB DEFAULT '{}'::jsonb,
            image_url TEXT,
            price_estimate NUMERIC DEFAULT 0,
            is_deleted BOOLEAN DEFAULT FALSE,
            created_at TIMESTAMPTZ DEFAULT NOW(),
            updated_at TIMESTAMPTZ DEFAULT NOW()
          );
        `);

        await tx.query(`
          CREATE TABLE IF NOT EXISTS games (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            slug TEXT UNIQUE NOT NULL,
            description TEXT,
            image_url TEXT,
            genre TEXT,
            developer TEXT,
            release_year INT,
            is_deleted BOOLEAN DEFAULT FALSE,
            created_at TIMESTAMPTZ DEFAULT NOW(),
            updated_at TIMESTAMPTZ DEFAULT NOW()
          );
        `);

        await tx.query(`
          CREATE TABLE IF NOT EXISTS entity_audit_logs (
            id TEXT PRIMARY KEY,
            entity_type TEXT NOT NULL,
            entity_id TEXT NOT NULL,
            action TEXT NOT NULL,
            performed_by TEXT,
            payload JSONB,
            created_at TIMESTAMPTZ DEFAULT NOW()
          );
        `);

        await tx.query(`
          CREATE TABLE IF NOT EXISTS setup_hardware (
            setup_id TEXT REFERENCES setups(id) ON DELETE CASCADE,
            hardware_id TEXT REFERENCES hardware(id) ON DELETE CASCADE,
            notes TEXT,
            PRIMARY KEY (setup_id, hardware_id)
          );
        `);

        await tx.query(`
          CREATE TABLE IF NOT EXISTS setup_games (
            setup_id TEXT REFERENCES setups(id) ON DELETE CASCADE,
            game_id TEXT REFERENCES games(id) ON DELETE CASCADE,
            PRIMARY KEY (setup_id, game_id)
          );
        `);
      }
    },
    {
      version: '0003_sprint1_indexes',
      name: 'Sprint 1 Unique & Foreign Key Performance Indexes',
      up: async (tx: any) => {
        // Standard IF NOT EXISTS indexes executed atomically inside migration transaction
        await tx.query(`CREATE UNIQUE INDEX IF NOT EXISTS idx_brands_slug ON brands(slug);`);
        await tx.query(`CREATE UNIQUE INDEX IF NOT EXISTS idx_hardware_categories_slug ON hardware_categories(slug);`);
        await tx.query(`CREATE UNIQUE INDEX IF NOT EXISTS idx_hardware_slug ON hardware(slug);`);
        await tx.query(`CREATE UNIQUE INDEX IF NOT EXISTS idx_games_slug ON games(slug);`);
        await tx.query(`CREATE INDEX IF NOT EXISTS idx_hardware_brand ON hardware(brand_id);`);
        await tx.query(`CREATE INDEX IF NOT EXISTS idx_hardware_category ON hardware(category_id);`);
        await tx.query(`CREATE INDEX IF NOT EXISTS idx_setup_hardware_setup ON setup_hardware(setup_id);`);
        await tx.query(`CREATE INDEX IF NOT EXISTS idx_setup_hardware_hw ON setup_hardware(hardware_id);`);
        await tx.query(`CREATE INDEX IF NOT EXISTS idx_setup_games_setup ON setup_games(setup_id);`);
        await tx.query(`CREATE INDEX IF NOT EXISTS idx_setup_games_game ON setup_games(game_id);`);
      }
    },
    {
      version: '0004_branding_settings',
      name: 'Initialize default branding and site settings',
      up: async (tx: any) => {
        const defaultSettings = [
          ['site_logo_url', '/branding/logo.png'],
          ['site_logo_dark_url', '/branding/logo-dark.png'],
          ['site_icon_url', '/branding/icon.png'],
          ['logo_desktop_scale', '100'],
          ['logo_mobile_scale', '100'],
          ['logo_rotation', '0'],
          ['contact_email', 'setupss.support@gmail.com'],
          ['instagram_link', ''],
          ['twitter_link', ''],
          ['youtube_link', ''],
          ['github_link', ''],
          ['discord_link', ''],
          ['linkedin_link', '']
        ];

        for (const [key, value] of defaultSettings) {
          await tx.query(
            `INSERT INTO site_settings (key, value) VALUES ($1, $2) ON CONFLICT (key) DO NOTHING`,
            [key, value]
          );
        }
      }
    },
    {
      version: '0005_notifications_and_bots',
      name: 'Notifications, Bot Reports, and Bot Fleet seeding',
      up: async (tx: any) => {
        // Notifications Table
        await tx.query(`
          CREATE TABLE IF NOT EXISTS notifications (
            id TEXT PRIMARY KEY,
            user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
            sender_id TEXT,
            sender_name TEXT,
            sender_avatar TEXT,
            type TEXT NOT NULL, -- like, comment, friend_request, system, announcement
            title TEXT NOT NULL,
            content TEXT NOT NULL,
            link TEXT,
            status TEXT DEFAULT 'notification',
            created_at TIMESTAMPTZ DEFAULT NOW()
          );
          CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id);
        `);

        // Bot Reports Table
        await tx.query(`
          CREATE TABLE IF NOT EXISTS bot_reports (
            id SERIAL PRIMARY KEY,
            bot_id TEXT NOT NULL,
            bot_name TEXT NOT NULL,
            report_type TEXT NOT NULL, -- bug, performance, audit, moderation
            details TEXT NOT NULL,
            severity TEXT DEFAULT 'low',
            is_resolved BOOLEAN DEFAULT FALSE,
            created_at TIMESTAMPTZ DEFAULT NOW()
          );
        `);

        // Seed 30 Bot Users
        const botNames = [
          'SetupSpy_Alpha', 'BattlestationBot', 'RigReviewer_01', 'PixelPioneer', 'FrameRateFixer',
          'CableGhost', 'NeonNavigator', 'DeskDetective', 'SetupSentinel', 'ErgoExpert',
          'RgbRaider', 'ZenZoner', 'TechTarantula', 'SiliconScout', 'ByteBouncer',
          'ClockSpeedCommander', 'VramVoyager', 'ThermalThief', 'LatencyLurker', 'PingPathfinder',
          'SsdSoldier', 'PsuPaladin', 'MotherboardMonk', 'CaseCrusader', 'FanFanatic',
          'GpuGuardian', 'CpuCaptain', 'RamRanger', 'MonitorMage', 'PeripheralPrince'
        ];

        for (let i = 0; i < botNames.length; i++) {
          const botId = `bot-fleet-${i + 1}`;
          const botName = botNames[i];
          const email = `bot${i + 1}@setupss.ai`;
          const passHash = 'bot_account_secured'; // No one can login as bot
          
          await tx.query(
            `INSERT INTO users (id, email, password_hash, name, avatar, role) 
             VALUES ($1, $2, $3, $4, $5, $6) 
             ON CONFLICT (id) DO UPDATE SET name = $4`,
            [botId, email, passHash, botName, `https://api.dicebear.com/7.x/bottts/svg?seed=${botName}`, 'bot']
          );
        }
      }
    },
    {
      version: '0006_hardware_knowledge_graph_engine',
      name: 'Hardware Knowledge Graph Engine relations, benchmarks, price history, and reviews tables',
      up: async (tx: any) => {
        // 1. Hardware Relations Table (Edges)
        await tx.query(`
          CREATE TABLE IF NOT EXISTS hardware_relations (
            id TEXT PRIMARY KEY,
            source_id TEXT NOT NULL REFERENCES hardware(id) ON DELETE CASCADE,
            target_id TEXT NOT NULL REFERENCES hardware(id) ON DELETE CASCADE,
            relation_type TEXT NOT NULL, -- COMPATIBLE_WITH, RECOMMENDED_PAIRING, BOTTLENECK_PAIR, ALTERNATIVE_TO
            weight NUMERIC DEFAULT 1.0,
            metadata JSONB DEFAULT '{}'::jsonb,
            created_at TIMESTAMPTZ DEFAULT NOW(),
            CONSTRAINT unique_hardware_relation UNIQUE (source_id, target_id, relation_type)
          );
          CREATE INDEX IF NOT EXISTS idx_hw_rel_source ON hardware_relations(source_id);
          CREATE INDEX IF NOT EXISTS idx_hw_rel_target ON hardware_relations(target_id);
          CREATE INDEX IF NOT EXISTS idx_hw_rel_type ON hardware_relations(relation_type);
        `);

        // 2. Hardware Gaming & Synthetic Benchmarks Table
        await tx.query(`
          CREATE TABLE IF NOT EXISTS hardware_benchmarks (
            id TEXT PRIMARY KEY,
            hardware_id TEXT NOT NULL REFERENCES hardware(id) ON DELETE CASCADE,
            game_id TEXT REFERENCES games(id) ON DELETE SET NULL,
            resolution TEXT NOT NULL DEFAULT '1440p', -- 1080p, 1440p, 4K, 8K
            settings_preset TEXT DEFAULT 'Ultra',
            avg_fps INT NOT NULL,
            one_percent_low_fps INT,
            test_rig_cpu TEXT,
            test_rig_gpu TEXT,
            created_at TIMESTAMPTZ DEFAULT NOW()
          );
          CREATE INDEX IF NOT EXISTS idx_hw_bench_hw ON hardware_benchmarks(hardware_id);
          CREATE INDEX IF NOT EXISTS idx_hw_bench_game ON hardware_benchmarks(game_id);
        `);

        // 3. Hardware Price History
        await tx.query(`
          CREATE TABLE IF NOT EXISTS hardware_price_history (
            id TEXT PRIMARY KEY,
            hardware_id TEXT NOT NULL REFERENCES hardware(id) ON DELETE CASCADE,
            retailer TEXT NOT NULL,
            price_usd NUMERIC NOT NULL,
            in_stock BOOLEAN DEFAULT TRUE,
            recorded_at TIMESTAMPTZ DEFAULT NOW()
          );
          CREATE INDEX IF NOT EXISTS idx_hw_price_hw ON hardware_price_history(hardware_id);
        `);

        // 4. Hardware Community Reviews & Ratings
        await tx.query(`
          CREATE TABLE IF NOT EXISTS hardware_reviews (
            id TEXT PRIMARY KEY,
            hardware_id TEXT NOT NULL REFERENCES hardware(id) ON DELETE CASCADE,
            user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
            rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
            title TEXT NOT NULL,
            content TEXT NOT NULL,
            verified_owner BOOLEAN DEFAULT FALSE,
            created_at TIMESTAMPTZ DEFAULT NOW()
          );
          CREATE INDEX IF NOT EXISTS idx_hw_rev_hw ON hardware_reviews(hardware_id);
        `);
      }
    },
    {
      version: '0007_hardware_data_engine_core',
      name: 'Hardware Data Engine v2 core schema additions',
      up: async (tx: any) => {
        // 1.1 hardware table updates
        await tx.query(`
          ALTER TABLE hardware 
          ADD COLUMN IF NOT EXISTS parent_hardware_id TEXT REFERENCES hardware(id) ON DELETE SET NULL,
          ADD COLUMN IF NOT EXISTS is_canonical BOOLEAN NOT NULL DEFAULT TRUE,
          ADD COLUMN IF NOT EXISTS variant_type VARCHAR(50);
        `);
        
        await tx.query(`
          DO $$
          BEGIN
            IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'hardware_canonical_check') THEN
              ALTER TABLE hardware ADD CONSTRAINT hardware_canonical_check CHECK (
                (parent_hardware_id IS NULL AND is_canonical = TRUE) OR
                (parent_hardware_id IS NOT NULL AND is_canonical = FALSE)
              );
            END IF;
          END
          $$;
        `);

        // 1.2 user_hardware_ownership
        await tx.query(`
          CREATE TABLE IF NOT EXISTS user_hardware_ownership (
            id TEXT PRIMARY KEY,
            user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
            hardware_id TEXT NOT NULL REFERENCES hardware(id) ON DELETE CASCADE,
            purchase_date DATE,
            purchase_price NUMERIC(10, 2),
            currency VARCHAR(3),
            is_currently_owned BOOLEAN DEFAULT TRUE,
            quantity INT DEFAULT 1,
            created_at TIMESTAMPTZ DEFAULT NOW(),
            updated_at TIMESTAMPTZ DEFAULT NOW()
          );
          CREATE INDEX IF NOT EXISTS idx_user_hw_own_user ON user_hardware_ownership(user_id);
          CREATE INDEX IF NOT EXISTS idx_user_hw_own_hw ON user_hardware_ownership(hardware_id);
        `);

        // 1.3 games table additions
        await tx.query(`
          ALTER TABLE games 
          ADD COLUMN IF NOT EXISTS publisher VARCHAR(255),
          ADD COLUMN IF NOT EXISTS release_date DATE,
          ADD COLUMN IF NOT EXISTS engine VARCHAR(100),
          ADD COLUMN IF NOT EXISTS graphics_api VARCHAR(50);
        `);

        // 1.4 hardware_benchmarks updates
        await tx.query(`
          DO $$
          BEGIN
            IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'hardware_benchmarks' AND column_name = 'settings_preset') THEN
              ALTER TABLE hardware_benchmarks RENAME COLUMN settings_preset TO preset;
            END IF;
          END
          $$;
        `);

        await tx.query(`
          ALTER TABLE hardware_benchmarks 
          ADD COLUMN IF NOT EXISTS cpu_id TEXT REFERENCES hardware(id) ON DELETE SET NULL,
          ADD COLUMN IF NOT EXISTS upscaling_tech VARCHAR(50),
          ADD COLUMN IF NOT EXISTS ray_tracing_mode VARCHAR(50),
          ADD COLUMN IF NOT EXISTS source_type VARCHAR(50),
          ADD COLUMN IF NOT EXISTS source_name VARCHAR(255),
          ADD COLUMN IF NOT EXISTS source_url VARCHAR(2000),
          ADD COLUMN IF NOT EXISTS confidence_score NUMERIC(5,2),
          ADD COLUMN IF NOT EXISTS verification_status VARCHAR(50) DEFAULT 'PENDING',
          ADD COLUMN IF NOT EXISTS verified_by TEXT REFERENCES users(id) ON DELETE SET NULL,
          ADD COLUMN IF NOT EXISTS verified_at TIMESTAMPTZ,
          ADD COLUMN IF NOT EXISTS test_rig_metadata JSONB DEFAULT '{}'::jsonb;
        `);

        await tx.query(`
          ALTER TABLE hardware_benchmarks 
          ALTER COLUMN avg_fps TYPE NUMERIC(8,2) USING avg_fps::numeric,
          ALTER COLUMN one_percent_low_fps TYPE NUMERIC(8,2) USING one_percent_low_fps::numeric;
        `);

        // 1.5 hardware_aliases
        await tx.query(`
          CREATE TABLE IF NOT EXISTS hardware_aliases (
            id TEXT PRIMARY KEY,
            alias VARCHAR(255) UNIQUE NOT NULL,
            canonical_hardware_id TEXT NOT NULL REFERENCES hardware(id) ON DELETE CASCADE
          );
          CREATE INDEX IF NOT EXISTS idx_hw_aliases_alias ON hardware_aliases(alias);
        `);
      }
    },
    {
      version: '0008_canonical_supabase_rls_and_media_assets',
      name: 'Canonical Supabase Schema, Profiles Trigger, Media Assets, RLS Policies & Audit Logs',
      up: async (tx: any) => {
        // 1. Profiles Table linked to auth.users (if using Supabase Auth)
        await tx.query(`
          CREATE TABLE IF NOT EXISTS public.profiles (
            id TEXT PRIMARY KEY,
            username TEXT UNIQUE,
            display_name TEXT,
            email TEXT UNIQUE,
            avatar TEXT,
            cover_photo TEXT,
            bio TEXT,
            location TEXT,
            website TEXT,
            role TEXT DEFAULT 'user',
            is_verified BOOLEAN DEFAULT FALSE,
            has_rgb BOOLEAN DEFAULT FALSE,
            xp INT DEFAULT 0,
            level INT DEFAULT 1,
            streak_count INT DEFAULT 0,
            last_active TIMESTAMPTZ DEFAULT NOW(),
            created_at TIMESTAMPTZ DEFAULT NOW(),
            updated_at TIMESTAMPTZ DEFAULT NOW()
          );
          CREATE INDEX IF NOT EXISTS idx_profiles_username ON public.profiles(username);
          CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
        `);

        // 2. Media Assets Table for R2 object metadata tracking
        await tx.query(`
          CREATE TABLE IF NOT EXISTS public.media_assets (
            id TEXT PRIMARY KEY,
            uploader_id TEXT REFERENCES public.profiles(id) ON DELETE SET NULL,
            bucket TEXT NOT NULL DEFAULT 'setupss',
            object_key TEXT UNIQUE NOT NULL,
            public_url TEXT NOT NULL,
            original_filename TEXT,
            mime_type TEXT NOT NULL,
            file_size BIGINT NOT NULL,
            entity_type TEXT,
            entity_id TEXT,
            visibility TEXT DEFAULT 'public',
            etag TEXT,
            created_at TIMESTAMPTZ DEFAULT NOW(),
            deleted_at TIMESTAMPTZ
          );
          CREATE INDEX IF NOT EXISTS idx_media_uploader ON public.media_assets(uploader_id);
          CREATE INDEX IF NOT EXISTS idx_media_entity ON public.media_assets(entity_type, entity_id);
          CREATE INDEX IF NOT EXISTS idx_media_key ON public.media_assets(object_key);
        `);

        // 3. AI Conversations & Messages & Usage Logs
        await tx.query(`
          CREATE TABLE IF NOT EXISTS public.ai_conversations (
            id TEXT PRIMARY KEY,
            user_id TEXT REFERENCES public.profiles(id) ON DELETE CASCADE,
            title TEXT NOT NULL,
            model TEXT NOT NULL DEFAULT 'gemini-2.5-flash',
            system_prompt TEXT,
            created_at TIMESTAMPTZ DEFAULT NOW(),
            updated_at TIMESTAMPTZ DEFAULT NOW()
          );
          CREATE INDEX IF NOT EXISTS idx_ai_conv_user ON public.ai_conversations(user_id);

          CREATE TABLE IF NOT EXISTS public.ai_messages (
            id TEXT PRIMARY KEY,
            conversation_id TEXT REFERENCES public.ai_conversations(id) ON DELETE CASCADE,
            sender TEXT NOT NULL,
            content TEXT NOT NULL,
            token_count INT DEFAULT 0,
            model_used TEXT,
            error_status TEXT,
            created_at TIMESTAMPTZ DEFAULT NOW()
          );
          CREATE INDEX IF NOT EXISTS idx_ai_msg_conv ON public.ai_messages(conversation_id);

          CREATE TABLE IF NOT EXISTS public.ai_usage_logs (
            id TEXT PRIMARY KEY,
            user_id TEXT REFERENCES public.profiles(id) ON DELETE CASCADE,
            model TEXT NOT NULL,
            prompt_tokens INT DEFAULT 0,
            completion_tokens INT DEFAULT 0,
            total_tokens INT DEFAULT 0,
            latency_ms INT DEFAULT 0,
            status TEXT DEFAULT 'success',
            created_at TIMESTAMPTZ DEFAULT NOW()
          );
          CREATE INDEX IF NOT EXISTS idx_ai_usage_user ON public.ai_usage_logs(user_id);
        `);

        // 4. Chat Rooms & Realtime Messages
        await tx.query(`
          CREATE TABLE IF NOT EXISTS public.chat_rooms (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            slug TEXT UNIQUE NOT NULL,
            description TEXT,
            icon TEXT,
            is_private BOOLEAN DEFAULT FALSE,
            created_at TIMESTAMPTZ DEFAULT NOW()
          );

          CREATE TABLE IF NOT EXISTS public.chat_room_members (
            room_id TEXT REFERENCES public.chat_rooms(id) ON DELETE CASCADE,
            user_id TEXT REFERENCES public.profiles(id) ON DELETE CASCADE,
            role TEXT DEFAULT 'member',
            joined_at TIMESTAMPTZ DEFAULT NOW(),
            PRIMARY KEY (room_id, user_id)
          );

          CREATE TABLE IF NOT EXISTS public.chat_messages (
            id TEXT PRIMARY KEY,
            room_id TEXT REFERENCES public.chat_rooms(id) ON DELETE CASCADE,
            sender_id TEXT REFERENCES public.profiles(id) ON DELETE SET NULL,
            sender_name TEXT NOT NULL DEFAULT 'User',
            sender_avatar TEXT,
            sender_has_rgb BOOLEAN DEFAULT FALSE,
            message TEXT NOT NULL,
            media_url TEXT,
            media_type TEXT,
            created_at TIMESTAMPTZ DEFAULT NOW()
          );

          ALTER TABLE public.chat_messages ADD COLUMN IF NOT EXISTS room_id TEXT;
          ALTER TABLE public.chat_messages ADD COLUMN IF NOT EXISTS sender_id TEXT;
          ALTER TABLE public.chat_messages ADD COLUMN IF NOT EXISTS sender_name TEXT;
          ALTER TABLE public.chat_messages ADD COLUMN IF NOT EXISTS sender_avatar TEXT;
          ALTER TABLE public.chat_messages ADD COLUMN IF NOT EXISTS sender_has_rgb BOOLEAN DEFAULT FALSE;
          ALTER TABLE public.chat_messages ADD COLUMN IF NOT EXISTS media_url TEXT;
          ALTER TABLE public.chat_messages ADD COLUMN IF NOT EXISTS media_type TEXT;

          CREATE INDEX IF NOT EXISTS idx_chat_msg_room ON public.chat_messages(room_id, created_at DESC);
          CREATE INDEX IF NOT EXISTS idx_chat_msg_sender ON public.chat_messages(sender_id);
        `);

        await tx.query(`
          ALTER TABLE public.chat_messages REPLICA IDENTITY FULL;
        `).catch(() => {});

        // 5. System & Admin Audit Logs
        await tx.query(`
          CREATE TABLE IF NOT EXISTS public.audit_logs (
            id TEXT PRIMARY KEY,
            actor_id TEXT REFERENCES public.profiles(id) ON DELETE SET NULL,
            action TEXT NOT NULL,
            target_type TEXT NOT NULL,
            target_id TEXT,
            old_value JSONB,
            new_value JSONB,
            ip_address TEXT,
            user_agent TEXT,
            endpoint TEXT,
            created_at TIMESTAMPTZ DEFAULT NOW()
          );
          CREATE INDEX IF NOT EXISTS idx_audit_actor ON public.audit_logs(actor_id);
          CREATE INDEX IF NOT EXISTS idx_audit_target ON public.audit_logs(target_type, target_id);
          CREATE INDEX IF NOT EXISTS idx_audit_action ON public.audit_logs(action);
          CREATE INDEX IF NOT EXISTS idx_audit_created ON public.audit_logs(created_at DESC);
        `);

        // 6. Enable RLS on core tables
        const rlsTables = [
          'profiles',
          'setups',
          'media_assets',
          'ai_conversations',
          'ai_messages',
          'chat_messages',
          'notifications',
          'audit_logs'
        ];
        for (const tbl of rlsTables) {
          await tx.query(`ALTER TABLE public.${tbl} ENABLE ROW LEVEL SECURITY;`).catch(() => {});
        }

        // RLS Policies with auth function checks
        await tx.query(`
          DO $$
          BEGIN
            IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'profiles_select_public') THEN
              CREATE POLICY profiles_select_public ON public.profiles FOR SELECT USING (true);
            END IF;
            IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'setups_select_public') THEN
              CREATE POLICY setups_select_public ON public.setups FOR SELECT USING (true);
            END IF;
            IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'media_select_public') THEN
              CREATE POLICY media_select_public ON public.media_assets FOR SELECT USING (visibility = 'public');
            END IF;
            IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'chat_messages_select') THEN
              CREATE POLICY chat_messages_select ON public.chat_messages FOR SELECT USING (true);
            END IF;
          END $$;
        `);

        // Conditional Auth policies if auth.uid() function exists
        await tx.query(`
          DO $$
          BEGIN
            IF EXISTS (SELECT 1 FROM pg_proc JOIN pg_namespace ON pg_proc.pronamespace = pg_namespace.oid WHERE pg_namespace.nspname = 'auth' AND proname = 'uid') THEN
              IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'profiles_update_own') THEN
                CREATE POLICY profiles_update_own ON public.profiles FOR UPDATE USING (auth.uid()::text = id);
              END IF;
              IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'ai_conversations_own') THEN
                CREATE POLICY ai_conversations_own ON public.ai_conversations FOR ALL USING (auth.uid()::text = user_id);
              END IF;
            END IF;
          END $$;
        `);

        // 7. Supabase Auth Trigger
        await tx.query(`
          CREATE OR REPLACE FUNCTION public.handle_new_user()
          RETURNS trigger AS $$
          BEGIN
            INSERT INTO public.profiles (id, email, username, display_name, avatar, role)
            VALUES (
              NEW.id,
              NEW.email,
              COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
              COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1)),
              COALESCE(NEW.raw_user_meta_data->>'avatar_url', 'https://api.dicebear.com/7.x/bottts/svg?seed=' || NEW.id),
              'user'
            )
            ON CONFLICT (id) DO UPDATE SET
              email = EXCLUDED.email,
              updated_at = NOW();
            RETURN NEW;
          END;
          $$ LANGUAGE plpgsql SECURITY DEFINER;
        `).catch(() => {});

        await tx.query(`
          DO $$
          BEGIN
            IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'auth' AND table_name = 'users') THEN
              DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
              CREATE TRIGGER on_auth_user_created
                AFTER INSERT ON auth.users
                FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
            END IF;
          END $$;
        `).catch(() => {});
      }
    },
    {
      version: '0009_centralized_setupss_auth',
      name: 'Centralized Setupss Auth Engine (auth_identities, user_sessions, role & status columns)',
      up: async (tx: any) => {
        // 1. Ensure users table has required columns for central auth
        const userCols = [
          `ALTER TABLE users ADD COLUMN IF NOT EXISTS IF NOT EXISTS password_hash TEXT;`,
          `ALTER TABLE users ADD COLUMN IF NOT EXISTS IF NOT EXISTS email_verified BOOLEAN DEFAULT FALSE;`,
          `ALTER TABLE users ADD COLUMN IF NOT EXISTS IF NOT EXISTS status TEXT DEFAULT 'active';`,
          `ALTER TABLE users ADD COLUMN IF NOT EXISTS IF NOT EXISTS last_login_at TIMESTAMPTZ;`,
          `ALTER TABLE users ADD COLUMN IF NOT EXISTS IF NOT EXISTS role TEXT DEFAULT 'user';`
        ];
        for (const colSql of userCols) {
          await tx.query(colSql).catch(() => {});
        }

        // Set admin role for support / primary admin email
        await tx.query(`
          UPDATE users SET role = 'admin' WHERE email IN ('setupss.support@gmail.com', 'admin@setupss.com');
          UPDATE public.profiles SET role = 'admin' WHERE email IN ('setupss.support@gmail.com', 'admin@setupss.com');
        `).catch(() => {});

        // 2. Auth Identities table
        await tx.query(`
          CREATE TABLE IF NOT EXISTS auth_identities (
            id TEXT PRIMARY KEY,
            user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
            provider TEXT NOT NULL,
            provider_user_id TEXT NOT NULL,
            provider_email TEXT,
            metadata JSONB DEFAULT '{}'::jsonb,
            created_at TIMESTAMPTZ DEFAULT NOW(),
            updated_at TIMESTAMPTZ DEFAULT NOW(),
            UNIQUE(provider, provider_user_id)
          );
          CREATE INDEX IF NOT EXISTS idx_auth_identities_user_id ON auth_identities(user_id);
          CREATE INDEX IF NOT EXISTS idx_auth_identities_provider_email ON auth_identities(provider, provider_email);
        `);

        // 3. Central User Sessions table (express-session / connect-pg-simple)
        await tx.query(`
          CREATE TABLE IF NOT EXISTS user_sessions (
            sid VARCHAR NOT NULL PRIMARY KEY,
            sess JSONB NOT NULL,
            expire TIMESTAMPTZ NOT NULL
          );
          CREATE INDEX IF NOT EXISTS idx_user_sessions_expire ON user_sessions(expire);
        `);

        // 4. Also ensure standard session table exists
        await tx.query(`
          CREATE TABLE IF NOT EXISTS "session" (
            sid VARCHAR NOT NULL PRIMARY KEY,
            sess JSONB NOT NULL,
            expire TIMESTAMPTZ NOT NULL
          );
          CREATE INDEX IF NOT EXISTS "IDX_session_expire" ON "session"(expire);
        `);

        // 5. Backfill profiles from users
        await tx.query(`
          INSERT INTO public.profiles (id, email, username, display_name, avatar, role, is_verified, created_at, updated_at)
          SELECT 
            u.id, 
            u.email, 
            COALESCE(u.name, split_part(u.email, '@', 1)),
            COALESCE(u.name, split_part(u.email, '@', 1)),
            COALESCE(u.avatar, 'https://api.dicebear.com/7.x/bottts/svg?seed=' || u.id),
            COALESCE(u.role, 'user'),
            COALESCE(u.is_verified, FALSE),
            COALESCE(u.created_at, NOW()),
            NOW()
          FROM users u
          ON CONFLICT (id) DO UPDATE SET
            email = EXCLUDED.email,
            role = EXCLUDED.role,
            updated_at = NOW();
        `).catch(() => {});
      }
    },
    {
      version: '0010_icecat_hardware_specs',
      name: 'Open Icecat Hardware Specs (icecat_id, ean, specs)',
      up: async (tx: any) => {
        const icecatCols = [
          `ALTER TABLE hardware ADD COLUMN IF NOT EXISTS icecat_id BIGINT UNIQUE;`,
          `ALTER TABLE hardware ADD COLUMN IF NOT EXISTS ean VARCHAR(50);`,
          `ALTER TABLE hardware ADD COLUMN IF NOT EXISTS specs JSONB DEFAULT '{}'::jsonb;`
        ];
        for (const colSql of icecatCols) {
          await tx.query(colSql).catch(() => {});
        }
        await tx.query(`CREATE INDEX IF NOT EXISTS idx_hardware_specs ON hardware USING GIN (specs);`).catch(() => {});
      }
    },
    {
      version: '0011_blog_posts',
      name: 'Blog Posts table and initial seed articles',
      up: async (tx: any) => {
        await tx.query(`
          CREATE TABLE IF NOT EXISTS blog_posts (
            id TEXT PRIMARY KEY,
            title TEXT NOT NULL,
            slug TEXT UNIQUE NOT NULL,
            summary TEXT NOT NULL,
            content TEXT NOT NULL,
            category TEXT DEFAULT 'Rehber',
            cover_image TEXT,
            author_name TEXT DEFAULT 'Setupss Editör Ekibi',
            author_avatar TEXT,
            read_time_minutes INT DEFAULT 5,
            tags JSONB DEFAULT '[]'::jsonb,
            hardware_slugs JSONB DEFAULT '[]'::jsonb,
            is_published BOOLEAN DEFAULT TRUE,
            created_at TIMESTAMPTZ DEFAULT NOW(),
            updated_at TIMESTAMPTZ DEFAULT NOW()
          );
          CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);
          CREATE INDEX IF NOT EXISTS idx_blog_posts_category ON blog_posts(category);
        `);

        // Seed initial blog posts
        for (const post of SEED_BLOG_POSTS) {
          await tx.query(`
            INSERT INTO blog_posts (id, title, slug, summary, content, category, cover_image, author_name, author_avatar, read_time_minutes, tags, hardware_slugs, is_published, created_at, updated_at)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
            ON CONFLICT (slug) DO UPDATE SET
              title = EXCLUDED.title,
              summary = EXCLUDED.summary,
              content = EXCLUDED.content,
              cover_image = EXCLUDED.cover_image,
              updated_at = NOW();
          `, [
            post.id,
            post.title,
            post.slug,
            post.summary,
            post.content,
            post.category,
            post.coverImage,
            post.authorName,
            post.authorAvatar || '',
            post.readTimeMinutes,
            JSON.stringify(post.tags),
            JSON.stringify(post.hardwareSlugs),
            post.isPublished,
            post.createdAt,
            post.updatedAt
          ]);
        }
      }
    },
    {
      version: '0012_verification_expires_at',
      name: 'Add verification_expires_at column to users and profiles',
      up: async (tx: any) => {
        await tx.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS IF NOT EXISTS verification_expires_at TIMESTAMPTZ;`).catch(() => {});
        await tx.query(`ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS IF NOT EXISTS verification_expires_at TIMESTAMPTZ;`).catch(() => {});
      }
    }
  ];

  for (const m of migrations) {
    if (!appliedVersions.has(m.version)) {
      console.log(`⚡ [Migration Engine] Running versioned migration: ${m.version} - ${m.name}`);
      const startTime = Date.now();
      await client.query('BEGIN;');
      try {
        await m.up(client);
        const duration = Date.now() - startTime;
        await client.query(
          `INSERT INTO schema_migrations (version, name, execution_time_ms) VALUES ($1, $2, $3)`,
          [m.version, m.name, duration]
        );
        await client.query('COMMIT;');
        console.log(`✅ [Migration Engine] Migration ${m.version} applied successfully in ${duration}ms.`);
      } catch (err) {
        await client.query('ROLLBACK;');
        console.error(`❌ [Migration Engine] Migration ${m.version} failed and was automatically rolled back:`, err);
        throw err;
      }
    } else {
      console.log(`ℹ️ [Migration Engine] Migration ${m.version} already applied. Skipping.`);
    }
  }
}

export function checkDbActive(): boolean {
  const rawDbUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL || process.env.POSTGRES_PRISMA_URL || process.env.POSTGRES_URL_NON_POOLING || process.env.SUPABASE_DATABASE_URL;
  return !!((rawDbUrl && (rawDbUrl.startsWith('postgresql://') || rawDbUrl.startsWith('postgres://'))) || process.env.SQL_HOST);
}

export async function getMigrationHistoryFromDb() {
  try {
    const { rows } = await pool.query(
      `SELECT version, name, applied_at, execution_time_ms FROM schema_migrations ORDER BY version ASC`
    );
    return rows;
  } catch (err) {
    return [];
  }
}

export async function getHealthStatusFromDb() {
  const startTime = Date.now();
  const hasValidDb = checkDbActive();

  if (!hasValidDb) {
    return {
      status: 'degraded',
      mode: 'in-memory-fallback',
      dbConnected: false,
      message: 'No database configuration found (DATABASE_URL, POSTGRES_URL, or SQL_HOST are missing), running in local disk persistence mode.',
      timestamp: new Date().toISOString()
    };
  }

  try {
    const pingResult = await pool.query('SELECT 1 as ping, NOW() as server_time');
    const latencyMs = Date.now() - startTime;

    const poolMetrics = {
      totalCount: pool.totalCount,
      idleCount: pool.idleCount,
      waitingCount: pool.waitingCount
    };

    const [
      userRes,
      setupRes,
      brandRes,
      hwRes,
      gameRes,
      migrationRes
    ] = await Promise.all([
      pool.query('SELECT COUNT(*) FROM users').catch(() => ({ rows: [{ count: 0 }] })),
      pool.query('SELECT COUNT(*) FROM setups').catch(() => ({ rows: [{ count: 0 }] })),
      pool.query('SELECT COUNT(*) FROM brands').catch(() => ({ rows: [{ count: 0 }] })),
      pool.query('SELECT COUNT(*) FROM hardware').catch(() => ({ rows: [{ count: 0 }] })),
      pool.query('SELECT COUNT(*) FROM games').catch(() => ({ rows: [{ count: 0 }] })),
      pool.query('SELECT version, name, applied_at FROM schema_migrations ORDER BY version DESC LIMIT 1').catch(() => ({ rows: [] }))
    ]);

    const latestMigration = migrationRes.rows[0] || null;

    return {
      status: 'healthy',
      ready: true,
      dbConnected: true,
      latencyMs,
      pool: poolMetrics,
      counts: {
        users: parseInt(userRes.rows[0].count, 10),
        setups: parseInt(setupRes.rows[0].count, 10),
        brands: parseInt(brandRes.rows[0].count, 10),
        hardware: parseInt(hwRes.rows[0].count, 10),
        games: parseInt(gameRes.rows[0].count, 10)
      },
      latestMigration,
      seederGuard: {
        environment: process.env.NODE_ENV || 'development',
        productionSeedingAllowed: process.env.ENABLE_PRODUCTION_SEED === 'true'
      },
      timestamp: new Date().toISOString()
    };
  } catch (err: any) {
    return {
      status: 'unhealthy',
      ready: false,
      dbConnected: false,
      error: err?.message || 'Database ping failed',
      timestamp: new Date().toISOString()
    };
  }
}

export async function initDatabase() {
  const hasValidDb = checkDbActive();
  if (!hasValidDb) {
    console.warn("WARNING: Both DATABASE_URL and SQL_HOST are missing. Database initialization skipped.");
    return;
  }

  try {
    console.log("Connecting to PostgreSQL database...");
    const client = await pool.connect();
    try {
      // Execute versioned migration framework with schema_migrations tracking
      await runVersionedMigrations(client);

      // Create users table
      await client.query(`
        CREATE TABLE IF NOT EXISTS users (
          id TEXT PRIMARY KEY,
          email TEXT UNIQUE NOT NULL,
          password_hash TEXT NOT NULL,
          name TEXT NOT NULL,
          avatar TEXT,
          is_verified BOOLEAN DEFAULT FALSE,
          verification_code TEXT,
          created_at TIMESTAMPTZ DEFAULT NOW(),
          updated_at TIMESTAMPTZ DEFAULT NOW()
        );
      `);

      // Add columns if they don't exist for backward compatibility
      try {
        await client.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS is_verified BOOLEAN DEFAULT FALSE;`);
      } catch (e) {}
      try {
        await client.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS verification_code TEXT;`);
      } catch (e) {}
      try {
        await client.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS bio TEXT;`);
      } catch (e) {}
      try {
        await client.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS github_link TEXT;`);
      } catch (e) {}
      try {
        await client.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS instagram_link TEXT;`);
      } catch (e) {}
      try {
        await client.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS linkedin_link TEXT;`);
      } catch (e) {}
      try {
        await client.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS cover_photo TEXT;`);
      } catch (e) {}
      try {
        await client.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS custom_badge TEXT;`);
      } catch (e) {}
      try {
        await client.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS custom_color TEXT;`);
      } catch (e) {}
      try {
        await client.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS invite_count INT DEFAULT 0;`);
      } catch (e) {}
      try {
        await client.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS is_crown BOOLEAN DEFAULT FALSE;`);
      } catch (e) {}
      try {
        await client.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS reference_code TEXT;`);
      } catch (e) {}
      try {
        await client.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS has_rgb BOOLEAN DEFAULT FALSE;`);
      } catch (e) {}
      try {
        await client.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'user';`);
      } catch (e) {}
      try {
        await client.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS is_banned BOOLEAN DEFAULT FALSE;`);
      } catch (e) {}
      try {
        await client.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS streak_count INT DEFAULT 0;`);
      } catch (e) {}
      try {
        await client.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS last_active_date TIMESTAMPTZ;`);
      } catch (e) {}
      try {
        await client.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS streak_companion TEXT DEFAULT 'sarcastic';`);
      } catch (e) {}
      try {
        await client.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS streak_freezes INT DEFAULT 1;`);
      } catch (e) {}
      try {
        await client.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS IF NOT EXISTS verification_expires_at TIMESTAMPTZ;`);
      } catch (e) {}
      try {
        await client.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS avatar_frame TEXT DEFAULT 'none';`);
      } catch (e) {}
      try {
        await client.query(`ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS avatar_frame TEXT DEFAULT 'none';`);
      } catch (e) {}

      // Create setups table
      await client.query(`
        CREATE TABLE IF NOT EXISTS setups (
          id TEXT PRIMARY KEY,
          title TEXT NOT NULL,
          owner TEXT NOT NULL,
          owner_id TEXT,
          bio TEXT,
          category TEXT NOT NULL,
          description TEXT,
          image TEXT,
          likes INTEGER DEFAULT 0,
          tags JSONB DEFAULT '[]'::jsonb,
          components JSONB DEFAULT '[]'::jsonb,
          comments JSONB DEFAULT '[]'::jsonb,
          card_theme TEXT DEFAULT 'dark',
          created_at TIMESTAMPTZ DEFAULT NOW(),
          video_url TEXT,
          is_bot_share BOOLEAN DEFAULT FALSE,
          FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE
        );
      `);

      try {
        await client.query(`ALTER TABLE setups ADD COLUMN IF NOT EXISTS card_theme TEXT DEFAULT 'dark';`);
      } catch (e) {}

      try {
        await client.query(`ALTER TABLE setups ADD COLUMN IF NOT EXISTS owner_id TEXT;`);
      } catch (e) {}

      try {
        await client.query(`ALTER TABLE setups ADD COLUMN IF NOT EXISTS video_url TEXT;`);
      } catch (e) {}

      try {
        await client.query(`ALTER TABLE setups ADD COLUMN IF NOT EXISTS is_bot_share BOOLEAN DEFAULT FALSE;`);
      } catch (e) {}

      // Create setup_likes table
      await client.query(`
        CREATE TABLE IF NOT EXISTS setup_likes (
          user_id TEXT NOT NULL,
          setup_id TEXT NOT NULL,
          PRIMARY KEY (user_id, setup_id),
          FOREIGN KEY (setup_id) REFERENCES setups(id) ON DELETE CASCADE
        );
      `);

      // Create wishlist table
      await client.query(`
        CREATE TABLE IF NOT EXISTS wishlist (
          id TEXT PRIMARY KEY,
          user_id TEXT,
          name TEXT NOT NULL,
          category TEXT NOT NULL,
          estimated_price NUMERIC DEFAULT 0,
          purchased BOOLEAN DEFAULT FALSE,
          link TEXT,
          notes TEXT,
          created_at TIMESTAMPTZ DEFAULT NOW()
        );
      `);

      try {
        await client.query(`ALTER TABLE wishlist ADD COLUMN IF NOT EXISTS user_id TEXT;`);
      } catch (e) {}

      // Create chat_messages table
      await client.query(`
        CREATE TABLE IF NOT EXISTS chat_messages (
          id TEXT PRIMARY KEY,
          sender_id TEXT NOT NULL,
          sender_name TEXT NOT NULL,
          sender_avatar TEXT,
          receiver_id TEXT NOT NULL,
          receiver_name TEXT NOT NULL,
          receiver_avatar TEXT,
          message TEXT NOT NULL,
          is_read BOOLEAN DEFAULT FALSE,
          created_at TIMESTAMPTZ DEFAULT NOW(),
          media_url TEXT,
          media_type TEXT,
          sender_has_rgb BOOLEAN DEFAULT FALSE
        );
      `);

      // Create friends table
      await client.query(`
        CREATE TABLE IF NOT EXISTS friends (
          id TEXT PRIMARY KEY,
          user_id TEXT NOT NULL,
          friend_id TEXT NOT NULL,
          status TEXT NOT NULL,
          created_at TIMESTAMPTZ DEFAULT NOW(),
          UNIQUE(user_id, friend_id)
        );
      `);

      // Create activity_logs table
      await client.query(`
        CREATE TABLE IF NOT EXISTS activity_logs (
          id TEXT PRIMARY KEY,
          action_type TEXT NOT NULL,
          user_id TEXT,
          user_name TEXT,
          details TEXT,
          created_at TIMESTAMPTZ DEFAULT NOW()
        );
      `);

      // Create media_files table for photo, video, and data storage
      await client.query(`
        CREATE TABLE IF NOT EXISTS media_files (
          id TEXT PRIMARY KEY,
          file_name TEXT NOT NULL,
          file_url TEXT NOT NULL,
          file_type TEXT NOT NULL,
          file_size BIGINT DEFAULT 0,
          mime_type TEXT,
          uploader_id TEXT,
          uploader_name TEXT,
          created_at TIMESTAMPTZ DEFAULT NOW(),
          thumbnail_512 TEXT,
          thumbnail_256 TEXT
        );
      `);

      // Alter table to add thumbnail columns if they don't already exist
      await client.query(`
        ALTER TABLE media_files ADD COLUMN IF NOT EXISTS thumbnail_512 TEXT;
        ALTER TABLE media_files ADD COLUMN IF NOT EXISTS thumbnail_256 TEXT;
      `).catch(e => console.error("Could not run ALTER TABLE to add thumbnail columns:", e));

      // Create site_settings table
      await client.query(`
        CREATE TABLE IF NOT EXISTS site_settings (
          key TEXT PRIMARY KEY,
          value TEXT
        );
      `);

      // Seed default site settings if empty
      const { rows: settingRows } = await client.query('SELECT COUNT(*) FROM site_settings');
      if (parseInt(settingRows[0].count, 10) === 0) {
        await client.query(`INSERT INTO site_settings (key, value) VALUES 
          ('instagram_link', 'https://instagram.com'),
          ('twitter_link', 'https://twitter.com'),
          ('youtube_link', 'https://youtube.com'),
          ('github_link', 'https://github.com'),
          ('discord_link', 'https://discord.com'),
          ('linkedin_link', 'https://linkedin.com'),
          ('contact_email', 'setupss.support@gmail.com')
        ON CONFLICT (key) DO NOTHING;`);
      }

      // Add columns if they don't exist for backward compatibility (chat_messages media_url, media_type)
      try {
        await client.query(`ALTER TABLE chat_messages ADD COLUMN IF NOT EXISTS media_url TEXT;`);
      } catch (e) {}
      try {
        await client.query(`ALTER TABLE chat_messages ADD COLUMN IF NOT EXISTS media_type TEXT;`);
      } catch (e) {}
      try {
        await client.query(`ALTER TABLE chat_messages ADD COLUMN IF NOT EXISTS sender_has_rgb BOOLEAN DEFAULT FALSE;`);
      } catch (e) {}

      console.log("Database tables verified/created successfully.");

      // Purge any existing hardcoded/seeded setups or bot setups as requested by the user
      try {
        console.log("🧹 [Database Cleaner] Purging pre-embedded/bot setups to keep database strictly containing actual user-uploaded setups...");
        await client.query(`
          DELETE FROM setups 
          WHERE id IN ('setup-1', 'setup-2', 'setup-3', 'setup-4', 'setup-5') 
             OR is_bot_share = true 
             OR owner_id = 'ai-bot'
        `);
      } catch (cleanErr: any) {
        console.error("Database cleaner failed to purge pre-embedded setups:", cleanErr.message);
      }

      // INITIAL SEEDER ENGINE:
      // Always seeds initial hardware catalog, brands, categories, games, and seed users if tables are completely empty.
      const allowSeeding = true;
      console.log("🌱 [Seeder Engine] Checking and seeding initial catalog defaults if tables are empty...");
        
        // Seed wishlist if empty
        const { rows: wishlistRows } = await client.query('SELECT COUNT(*) FROM wishlist');
        const wishlistCount = parseInt(wishlistRows[0].count, 10);
        if (wishlistCount === 0) {
          console.log("Seeding wishlist database with defaults...");
          const defaultWishlist: WishlistItem[] = [
            { id: "w-1", name: "IKEA Karlby Meşe Tabla", category: "Masaüstü / Mobilya", estimatedPrice: 4200, purchased: true, notes: "Alex çekmecelerle birleştirilecek." },
            { id: "w-2", name: "Keychron K2 V2 Mekanik Klavye", category: "Klavye / Mouse", estimatedPrice: 2800, purchased: false, link: "https://keychron.com", notes: "Brown switch tercih edilecek." },
            { id: "w-3", name: "Xiaomi Monitör Arkası Işık Çubuğu", category: "Işıklandırma / Ses", estimatedPrice: 1200, purchased: false, notes: "Göz yorgunluğunu önlemek için." }
          ];

          for (const w of defaultWishlist) {
            await client.query(
              `INSERT INTO wishlist (id, name, category, estimated_price, purchased, link, notes)
               VALUES ($1, $2, $3, $4, $5, $6, $7)
               ON CONFLICT (id) DO NOTHING`,
              [w.id, w.name, w.category, w.estimatedPrice, w.purchased, w.link || null, w.notes || null]
            );
          }
          console.log("Wishlist database seeded successfully.");
        }

        // Seed default/curated users if empty or missing (UPSERT only)
        console.log("Seeding and updating default and bot users with real/historic registration dates...");
        const adminPassHash = bcrypt.hashSync("ozcan1257", 10);
        const standardPassHash = bcrypt.hashSync("123456", 10);

        const usersToSeed = [
          {
            id: "mock-user-123",
            email: "ziyaretci@setupss.ai.studio",
            password_hash: standardPassHash,
            name: "Ziyaretçi Geliştirici",
            avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150&q=80",
            is_verified: true,
            bio: "Teknoloji tutkunu ve minimal masaüstü düzeni geliştiricisi.",
            github_link: "https://github.com",
            cover_photo: "https://images.unsplash.com/photo-1547082299-de196ea013d6?auto=format&fit=crop&w=800&q=80",
            custom_badge: "Setup Paylaşımcısı 🚀",
            custom_color: "#4ECDC4",
            is_crown: false,
            has_rgb: false,
            role: "user",
            created_at: "2026-02-15T12:00:00.000Z"
          },
          {
            id: "admin",
            email: "setupss.support@gmail.com",
            password_hash: adminPassHash,
            name: "Beşir Hanzo",
            avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&h=200&q=80",
            is_verified: true,
            bio: "Kod Yazan Kahve Canavarı ☕️",
            github_link: "https://github.com",
            cover_photo: "https://images.unsplash.com/photo-1491336477066-31156b5e4f35?auto=format&fit=crop&w=800&q=80",
            custom_badge: "Kurucu & Geliştirici 👑",
            custom_color: "#FF6B6B",
            is_crown: true,
            has_rgb: true,
            role: "admin",
            created_at: "2026-01-01T09:00:00.000Z"
          },
          {
            id: "kreatif-can",
            email: "can@setupss.ai.studio",
            password_hash: standardPassHash,
            name: "Kreatif Can",
            avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=200&h=200&q=80",
            is_verified: true,
            bio: "RGB & Neon Sevdalısı 🌈",
            github_link: "https://github.com",
            cover_photo: "https://images.unsplash.com/photo-1547082299-de196ea013d6?auto=format&fit=crop&w=800&q=80",
            custom_badge: "RGB Profesörü 🌈",
            custom_color: "#9b59b6",
            is_crown: false,
            has_rgb: true,
            role: "user",
            created_at: "2026-03-20T14:30:00.000Z"
          },
          {
            id: "zeynep-tasarim",
            email: "zeynep@setupss.ai.studio",
            password_hash: standardPassHash,
            name: "Zeynep Tasarım",
            avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&h=200&q=80",
            is_verified: true,
            bio: "Piksel Bükücü & Bitki Büyücüsü 🌿",
            github_link: "https://github.com",
            cover_photo: "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=800&q=80",
            custom_badge: "Senior Designer 🎨",
            custom_color: "#2ecc71",
            is_crown: true,
            has_rgb: false,
            role: "user",
            created_at: "2026-04-05T10:15:00.000Z"
          },
          {
            id: "ai-bot",
            email: "bot@setupss.ai.studio",
            password_hash: standardPassHash,
            name: "Setupss AI",
            avatar: "/airobot.jpg",
            is_verified: true,
            bio: "Kurulum Danışmanı & Site Rehberi 🤖",
            github_link: "",
            cover_photo: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80",
            custom_badge: "Topluluk Asistanı 🤖",
            custom_color: "#FFD93D",
            is_crown: false,
            has_rgb: true,
            role: "admin",
            created_at: "2026-01-01T08:00:00.000Z"
          }
        ];

        for (const u of usersToSeed) {
          await client.query(
            `INSERT INTO users (id, email, password_hash, name, avatar, is_verified, bio, github_link, cover_photo, custom_badge, custom_color, is_crown, has_rgb, role, created_at)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
             ON CONFLICT (id) DO NOTHING`,
            [
              u.id, u.email, u.password_hash, u.name, u.avatar, u.is_verified, 
              u.bio, u.github_link, u.cover_photo, u.custom_badge, u.custom_color, 
              u.is_crown, u.has_rgb, u.role, u.created_at
            ]
          );
        }
        console.log("Users database seeded and updated successfully.");

      // --- SPRINT 1: ENTITY DATABASE SYSTEM (SAIOS v1.0) ---
      
      // 1. Create BRANDS table
      await client.query(`
        CREATE TABLE IF NOT EXISTS brands (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL UNIQUE,
          slug TEXT NOT NULL UNIQUE,
          description TEXT,
          logo_url TEXT,
          website TEXT,
          is_deleted BOOLEAN DEFAULT FALSE,
          created_at TIMESTAMPTZ DEFAULT NOW()
        );
      `);

      // 2. Create HARDWARE_CATEGORIES table
      await client.query(`
        CREATE TABLE IF NOT EXISTS hardware_categories (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL UNIQUE,
          slug TEXT NOT NULL UNIQUE,
          description TEXT,
          is_deleted BOOLEAN DEFAULT FALSE,
          created_at TIMESTAMPTZ DEFAULT NOW()
        );
      `);

      // 3. Create HARDWARE table
      await client.query(`
        CREATE TABLE IF NOT EXISTS hardware (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          slug TEXT NOT NULL UNIQUE,
          brand_id TEXT REFERENCES brands(id) ON DELETE SET NULL,
          category_id TEXT REFERENCES hardware_categories(id) ON DELETE SET NULL,
          description TEXT,
          specs JSONB DEFAULT '{}'::jsonb,
          image_url TEXT,
          price_estimate NUMERIC DEFAULT 0,
          buy_link TEXT,
          is_deleted BOOLEAN DEFAULT FALSE,
          created_at TIMESTAMPTZ DEFAULT NOW()
        );
      `);

      // 4. Create GAMES table
      await client.query(`
        CREATE TABLE IF NOT EXISTS games (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL UNIQUE,
          slug TEXT NOT NULL UNIQUE,
          description TEXT,
          image_url TEXT,
          genre TEXT,
          developer TEXT,
          release_year INT,
          steam_id INT,
          is_deleted BOOLEAN DEFAULT FALSE,
          created_at TIMESTAMPTZ DEFAULT NOW()
        );
      `);

      // Add is_deleted columns if they don't exist
      await client.query(`ALTER TABLE brands ADD COLUMN IF NOT EXISTS is_deleted BOOLEAN DEFAULT FALSE;`).catch(() => {});
      await client.query(`ALTER TABLE hardware_categories ADD COLUMN IF NOT EXISTS is_deleted BOOLEAN DEFAULT FALSE;`).catch(() => {});
      await client.query(`ALTER TABLE hardware ADD COLUMN IF NOT EXISTS is_deleted BOOLEAN DEFAULT FALSE;`).catch(() => {});
      await client.query(`ALTER TABLE games ADD COLUMN IF NOT EXISTS is_deleted BOOLEAN DEFAULT FALSE;`).catch(() => {});

      // Create ENTITY_AUDIT_LOGS table
      await client.query(`
        CREATE TABLE IF NOT EXISTS entity_audit_logs (
          id TEXT PRIMARY KEY,
          entity_type TEXT NOT NULL,
          entity_id TEXT NOT NULL,
          action TEXT NOT NULL,
          performed_by TEXT,
          payload JSONB,
          created_at TIMESTAMPTZ DEFAULT NOW()
        );
      `);

      // Performance and FK indexes for Knowledge Graph
      await client.query(`CREATE UNIQUE INDEX IF NOT EXISTS idx_brands_slug ON brands(slug);`).catch(() => {});
      await client.query(`CREATE UNIQUE INDEX IF NOT EXISTS idx_hardware_categories_slug ON hardware_categories(slug);`).catch(() => {});
      await client.query(`CREATE UNIQUE INDEX IF NOT EXISTS idx_hardware_slug ON hardware(slug);`).catch(() => {});
      await client.query(`CREATE UNIQUE INDEX IF NOT EXISTS idx_games_slug ON games(slug);`).catch(() => {});
      await client.query(`CREATE INDEX IF NOT EXISTS idx_hardware_brand ON hardware(brand_id);`).catch(() => {});
      await client.query(`CREATE INDEX IF NOT EXISTS idx_hardware_category ON hardware(category_id);`).catch(() => {});
      await client.query(`CREATE INDEX IF NOT EXISTS idx_setup_hardware_setup ON setup_hardware(setup_id);`).catch(() => {});
      await client.query(`CREATE INDEX IF NOT EXISTS idx_setup_hardware_hw ON setup_hardware(hardware_id);`).catch(() => {});
      await client.query(`CREATE INDEX IF NOT EXISTS idx_setup_games_setup ON setup_games(setup_id);`).catch(() => {});
      await client.query(`CREATE INDEX IF NOT EXISTS idx_setup_games_game ON setup_games(game_id);`).catch(() => {});

      // 5. Create SETUP_HARDWARE (Relation Setup <-> Hardware)
      await client.query(`
        CREATE TABLE IF NOT EXISTS setup_hardware (
          setup_id TEXT REFERENCES setups(id) ON DELETE CASCADE,
          hardware_id TEXT REFERENCES hardware(id) ON DELETE CASCADE,
          notes TEXT,
          PRIMARY KEY (setup_id, hardware_id)
        );
      `);

      // 6. Create SETUP_GAMES (Relation Setup <-> Game)
      await client.query(`
        CREATE TABLE IF NOT EXISTS setup_games (
          setup_id TEXT REFERENCES setups(id) ON DELETE CASCADE,
          game_id TEXT REFERENCES games(id) ON DELETE CASCADE,
          PRIMARY KEY (setup_id, game_id)
        );
      `);

      console.log("Entity tables verified/created successfully.");

      // --- SEEDING ENTITIES (Skipped in production unless ENABLE_PRODUCTION_SEED=true) ---
      if (allowSeeding) {
        // Seed Brands
        const { rows: brandCheck } = await client.query('SELECT COUNT(*) FROM brands');
        if (parseInt(brandCheck[0].count, 10) === 0) {
          console.log("Seeding brands table...");
          const brands = [
            { id: 'b-nvidia', name: 'NVIDIA', slug: 'nvidia', description: 'Graphics card and AI platform market leader.', website: 'https://nvidia.com' },
            { id: 'b-amd', name: 'AMD', slug: 'amd', description: 'High performance processors and graphics cards.', website: 'https://amd.com' },
            { id: 'b-asus', name: 'ASUS', slug: 'asus', description: 'Leading gaming hardware manufacturer.', website: 'https://asus.com' },
            { id: 'b-logitech', name: 'Logitech', slug: 'logitech', description: 'Premium computer peripherals.', website: 'https://logitech.com' },
            { id: 'b-corsair', name: 'Corsair', slug: 'corsair', description: 'High-performance PC components and gaming gear.', website: 'https://corsair.com' },
            { id: 'b-keychron', name: 'Keychron', slug: 'keychron', description: 'Custom wireless mechanical keyboards.', website: 'https://keychron.com' },
            { id: 'b-lg', name: 'LG', slug: 'lg', description: 'Innovative display technologies.', website: 'https://lg.com' },
            { id: 'b-razer', name: 'Razer', slug: 'razer', description: 'For Gamers. By Gamers.', website: 'https://razer.com' },
            { id: 'b-hermanmiller', name: 'Herman Miller', slug: 'herman-miller', description: 'Ergonomic luxury seating and furniture.', website: 'https://hermanmiller.com' }
          ];
          for (const b of brands) {
            await client.query(`
              INSERT INTO brands (id, name, slug, description, website)
              VALUES ($1, $2, $3, $4, $5)
              ON CONFLICT (id) DO NOTHING
            `, [b.id, b.name, b.slug, b.description, b.website]);
          }
        }

        // Seed Categories
        const { rows: catCheck } = await client.query('SELECT COUNT(*) FROM hardware_categories');
        if (parseInt(catCheck[0].count, 10) === 0) {
          console.log("Seeding hardware_categories table...");
          const categories = [
            { id: 'c-gpu', name: 'GPU', slug: 'gpu', description: 'Graphics processing units' },
            { id: 'c-cpu', name: 'CPU', slug: 'cpu', description: 'Central processing units' },
            { id: 'c-keyboard', name: 'Keyboard', slug: 'keyboard', description: 'Input mechanical keyboards' },
            { id: 'c-mouse', name: 'Mouse', slug: 'mouse', description: 'Input precision mice' },
            { id: 'c-chair', name: 'Chair', slug: 'chair', description: 'Ergonomic chairs' },
            { id: 'c-monitor', name: 'Monitor', slug: 'monitor', description: 'Output screens and displays' },
            { id: 'c-desk', name: 'Desk', slug: 'desk', description: 'Setup tables and custom desks' }
          ];
          for (const c of categories) {
            await client.query(`
              INSERT INTO hardware_categories (id, name, slug, description)
              VALUES ($1, $2, $3, $4)
              ON CONFLICT (id) DO NOTHING
            `, [c.id, c.name, c.slug, c.description]);
          }
        }

        // Seed Hardware using HARDWARE_CATALOG
        const { rows: hwCheck } = await client.query('SELECT COUNT(*) FROM hardware');
        if (parseInt(hwCheck[0].count, 10) === 0) {
          console.log("Seeding hardware table from HARDWARE_CATALOG...");
          for (const hw of HARDWARE_CATALOG) {
            const brandSlug = hw.brand.toLowerCase().replace(/[^a-z0-9]+/g, '-');
            const catSlug = hw.category.toLowerCase().replace(/[^a-z0-9]+/g, '-');
            
            await client.query(`
              INSERT INTO hardware (id, name, slug, brand_id, category_id, description, specs, image_url, price_estimate)
              VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
              ON CONFLICT (id) DO NOTHING
            `, [
              hw.id,
              hw.model,
              hw.slug,
              `b-${brandSlug}`,
              `c-${catSlug}`,
              hw.description,
              JSON.stringify(hw.specifications),
              hw.images[0] || null,
              hw.msrp || 0
            ]);
          }
        }

        // Seed Games
        const { rows: gameCheck } = await client.query('SELECT COUNT(*) FROM games');
        if (parseInt(gameCheck[0].count, 10) === 0) {
          console.log("Seeding games table...");
          const games = [
            { id: 'g-valorant', name: 'Valorant', slug: 'valorant', description: 'Riot Games character-based tactical shooter.', image_url: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=400&q=80', genre: 'Tactical Shooter', developer: 'Riot Games', release_year: 2020 },
            { id: 'g-cs2', name: 'Counter-Strike 2', slug: 'cs2', description: 'Valve next-gen precision shooter.', image_url: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=400&q=80', genre: 'Tactical Shooter', developer: 'Valve', release_year: 2023 },
            { id: 'g-cyberpunk', name: 'Cyberpunk 2077', slug: 'cyberpunk-2077', description: 'CD Projekt Red open-world action-RPG.', image_url: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=400&q=80', genre: 'Action RPG', developer: 'CD Projekt Red', release_year: 2020 },
            { id: 'g-eldenring', name: 'Elden Ring', slug: 'elden-ring', description: 'FromSoftware epic fantasy open-world ARPG.', image_url: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=400&q=80', genre: 'Action RPG', developer: 'FromSoftware', release_year: 2022 }
          ];
          for (const g of games) {
            await client.query(`
              INSERT INTO games (id, name, slug, description, image_url, genre, developer, release_year)
              VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
              ON CONFLICT (id) DO NOTHING
            `, [g.id, g.name, g.slug, g.description, g.image_url, g.genre, g.developer, g.release_year]);
          }
        }
      }

      // Automatically link setups to hardware and games to build the Knowledge Graph!
      const { rows: setups } = await client.query('SELECT id, components, tags FROM setups');
      for (const s of setups) {
        const componentsList = s.components || [];
        for (const comp of componentsList) {
          const modelWord = comp.name.toLowerCase().split(' ')[0];
          const { rows: matchingHw } = await client.query(
            `SELECT id FROM hardware WHERE LOWER(name) LIKE $1 OR LOWER(slug) LIKE $2 LIMIT 1`,
            [`%${modelWord}%`, `%${comp.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}%`]
          );
          if (matchingHw.length > 0) {
            await client.query(`
              INSERT INTO setup_hardware (setup_id, hardware_id, notes)
              VALUES ($1, $2, $3)
              ON CONFLICT (setup_id, hardware_id) DO NOTHING
            `, [s.id, matchingHw[0].id, comp.category]);
          }
        }

        const tagsList = s.tags || [];
        const { rows: allGames } = await client.query('SELECT id, name, slug FROM games');
        for (const game of allGames) {
          const gameWords = game.name.toLowerCase().split(' ');
          const tagMatches = tagsList.some((t: string) => t.toLowerCase() === game.slug || gameWords.some(w => t.toLowerCase().includes(w)));
          if (tagMatches) {
            await client.query(`
              INSERT INTO setup_games (setup_id, game_id)
              VALUES ($1, $2)
              ON CONFLICT (setup_id, game_id) DO NOTHING
            `, [s.id, game.id]);
          }
        }
      }
      console.log("Automatic setup relationships established in Knowledge Graph.");

    } finally {
      client.release();
    }
  } catch (err) {
    console.error("Error connecting to or initializing database:", err);
  }
}

export const initializeDatabase = initDatabase;


// User Queries
export async function getUserByEmail(email: string) {
  if (!email) return null;
  const { rows } = await pool.query('SELECT * FROM users WHERE LOWER(email) = LOWER($1)', [email.trim()]);
  return rows[0] || null;
}

export async function getUserByName(name: string) {
  const { rows } = await pool.query('SELECT * FROM users WHERE LOWER(name) = LOWER($1)', [name]);
  return rows[0] || null;
}

export async function getUserByReferenceCode(refCode: string) {
  const { rows } = await pool.query('SELECT * FROM users WHERE reference_code = $1 OR id = $1', [refCode]);
  return rows[0] || null;
}

export async function getUserById(id: string) {
  const { rows } = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
  return rows[0] || null;
}

export async function createUser(user: any) {
  const expiresAt = user.verification_expires_at || new Date(Date.now() + 10 * 60 * 1000).toISOString();
  await pool.query(
    `INSERT INTO users (id, email, password_hash, name, avatar, is_verified, verification_code, verification_expires_at, reference_code)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
    [user.id, user.email, user.password_hash, user.name, user.avatar || null, user.is_verified || false, user.verification_code || null, expiresAt, user.referenceCode || null]
  );

  // Sync to public.profiles as well
  const username = user.name ? user.name.toLowerCase().replace(/[^a-z0-9]+/g, '_') : `user_${user.id}`;
  await pool.query(
    `INSERT INTO public.profiles (id, email, username, display_name, avatar, role, is_verified)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     ON CONFLICT (id) DO NOTHING`,
    [user.id, user.email, username, user.name, user.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${user.id}`, 'user', user.is_verified || false]
  );
}

export async function verifyUser(id: string) {
  await pool.query(
    `UPDATE users SET is_verified = TRUE, verification_code = NULL, verification_expires_at = NULL WHERE id = $1`,
    [id]
  );
  await pool.query(
    `UPDATE public.profiles SET is_verified = TRUE WHERE id = $1`,
    [id]
  );
}

// Setups Queries
export async function getSetupsFromDb(userId?: string): Promise<SetupPost[]> {
  const { rows: setups } = await pool.query('SELECT * FROM setups ORDER BY created_at DESC');
  const { rows: users } = await pool.query('SELECT id, name, avatar, has_rgb, is_crown, invite_count FROM users');
  
  let likedSetups = new Set<string>();
  if (userId) {
    const { rows: likes } = await pool.query('SELECT setup_id FROM setup_likes WHERE user_id = $1', [userId]);
    likedSetups = new Set(likes.map(l => l.setup_id));
  }
  
  return setups.map(r => {
    const owner = users.find(u => u.id === r.owner_id || u.name === r.owner);
    const hasRgb = Boolean(owner?.has_rgb || (owner?.invite_count && Number(owner.invite_count) > 0));
    return {
      id: r.id,
      title: r.title,
      owner: owner?.name || r.owner,
      ownerId: owner?.id || r.owner_id,
      ownerAvatar: owner?.avatar || undefined,
      bio: r.bio || '',
      category: r.category as any,
      description: r.description || '',
      image: r.image || '',
      likes: r.likes,
      tags: Array.isArray(r.tags) ? r.tags : [],
      components: Array.isArray(r.components) ? r.components : [],
      comments: Array.isArray(r.comments) ? r.comments : [],
      cardTheme: r.card_theme as any || 'dark',
      createdAt: r.created_at ? new Date(r.created_at).toISOString() : new Date().toISOString(),
      ownerHasRgb: hasRgb,
      likedByUser: likedSetups.has(r.id),
      videoUrl: r.video_url || '',
      isBotShare: Boolean(r.is_bot_share)
    };
  });
}

export async function addSetupToDb(s: SetupPost & { videoUrl?: string; isBotShare?: boolean }): Promise<void> {
  await pool.query(
    `INSERT INTO setups (id, title, owner, owner_id, bio, category, description, image, likes, tags, components, comments, card_theme, created_at, video_url, is_bot_share)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)`,
    [
      s.id,
      s.title,
      s.owner,
      s.ownerId || null,
      s.bio,
      s.category,
      s.description,
      s.image,
      s.likes,
      JSON.stringify(s.tags),
      JSON.stringify(s.components),
      JSON.stringify(s.comments),
      s.cardTheme || 'dark',
      s.createdAt,
      s.videoUrl || null,
      s.isBotShare || false
    ]
  );
}

export async function deleteSetupFromDb(id: string, userId: string, isAdmin: boolean = false): Promise<void> {
  // 1. Fetch associated media assets to clean up from R2
  try {
    const mediaRes = await pool.query(
      `SELECT object_key FROM public.media_assets WHERE entity_id = $1 OR object_key LIKE $2`,
      [id, `setups/${id}/%`]
    );
    if (mediaRes.rows.length > 0) {
      const { storageService } = await import('./server/storageService');
      const provider = storageService.getProvider();
      for (const row of mediaRes.rows) {
        if (row.object_key) {
          await provider.deleteFile(row.object_key).catch(err => console.error(`Failed to delete R2 file ${row.object_key}:`, err));
        }
      }
      await pool.query(
        `DELETE FROM public.media_assets WHERE entity_id = $1 OR object_key LIKE $2`,
        [id, `setups/${id}/%`]
      );
    }
  } catch (err) {
    console.error("Error during media assets deletion for setup:", id, err);
  }

  // 2. Delete setup record
  if (isAdmin) {
    await pool.query('DELETE FROM setups WHERE id = $1', [id]);
  } else {
    await pool.query('DELETE FROM setups WHERE id = $1 AND owner_id = $2', [id, userId]);
  }
}

export async function updateSetupLikesInDb(id: string, likes: number): Promise<void> {
  await pool.query('UPDATE setups SET likes = $1 WHERE id = $2', [likes, id]);
}

export async function updateSetupCommentsInDb(id: string, comments: any[]): Promise<void> {
  await pool.query('UPDATE setups SET comments = $1 WHERE id = $2', [JSON.stringify(comments), id]);
}

export async function saveSetupsBatchToDb(setups: any[]): Promise<void> {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    await client.query('DELETE FROM setups');
    for (const s of setups) {
      await client.query(
        `INSERT INTO setups (id, title, owner, owner_id, bio, category, description, image, likes, tags, components, comments, card_theme, created_at, video_url, is_bot_share)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)`,
        [
          s.id,
          s.title,
          s.owner,
          s.ownerId || null,
          s.bio,
          s.category,
          s.description,
          s.image,
          s.likes,
          JSON.stringify(s.tags),
          JSON.stringify(s.components),
          JSON.stringify(s.comments),
          s.cardTheme || 'dark',
          s.createdAt,
          s.videoUrl || null,
          s.isBotShare || false
        ]
      );
    }
    await client.query('COMMIT');
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

// Wishlist Queries
export async function getWishlistFromDb(userId?: string): Promise<WishlistItem[]> {
  const targetUser = userId || 'guest';
  const { rows } = await pool.query('SELECT * FROM wishlist WHERE user_id = $1 OR user_id IS NULL ORDER BY created_at ASC', [targetUser]);
  return rows.map(r => ({
    id: r.id,
    name: r.name,
    category: r.category,
    estimatedPrice: Number(r.estimated_price),
    purchased: r.purchased,
    link: r.link || undefined,
    notes: r.notes || undefined
  }));
}

export async function addWishlistItemToDb(w: WishlistItem, userId?: string): Promise<void> {
  const targetUser = userId || 'guest';
  await pool.query(
    `INSERT INTO wishlist (id, user_id, name, category, estimated_price, purchased, link, notes)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
     ON CONFLICT (id) DO UPDATE SET user_id = $2, name = $3, category = $4, estimated_price = $5, purchased = $6, link = $7, notes = $8`,
    [w.id, targetUser, w.name, w.category, w.estimatedPrice, w.purchased, w.link || null, w.notes || null]
  );
}

export async function updateWishlistItemInDb(w: WishlistItem, userId?: string): Promise<void> {
  const targetUser = userId || 'guest';
  await pool.query(
    `UPDATE wishlist SET name = $1, category = $2, estimated_price = $3, purchased = $4, link = $5, notes = $6, user_id = $7 WHERE id = $8`,
    [w.name, w.category, w.estimatedPrice, w.purchased, w.link || null, w.notes || null, targetUser, w.id]
  );
}

export async function deleteWishlistItemFromDb(id: string): Promise<void> {
  await pool.query('DELETE FROM wishlist WHERE id = $1', [id]);
}

// Chat Messages Persistence
let localChatMessages: ChatMessage[] = [];

export async function getChatHistoryFromDb(userId1: string, userId2: string): Promise<ChatMessage[]> {
  if (checkDbActive()) {
    try {
      const { rows } = await pool.query(
        `SELECT * FROM chat_messages 
         WHERE (sender_id = $1 AND receiver_id = $2) 
            OR (sender_id = $2 AND receiver_id = $1)
         ORDER BY created_at ASC`,
        [userId1, userId2]
      );
      return rows.map(r => ({
        id: r.id,
        senderId: r.sender_id,
        senderName: r.sender_name,
        senderAvatar: r.sender_avatar || undefined,
        receiverId: r.receiver_id,
        receiverName: r.receiver_name,
        receiverAvatar: r.receiver_avatar || undefined,
        message: r.message,
        isRead: r.is_read,
        createdAt: r.created_at ? new Date(r.created_at).toISOString() : new Date().toISOString(),
        senderHasRgb: r.sender_has_rgb || false,
        mediaUrl: r.media_url || undefined,
        mediaType: r.media_type as any || undefined
      }));
    } catch (e) {
      console.error("Failed to query chat history from DB, using fallback", e);
    }
  }
  return localChatMessages.filter(
    m => (m.senderId === userId1 && m.receiverId === userId2) ||
         (m.senderId === userId2 && m.receiverId === userId1)
  ).sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
}

export async function addChatMessageToDb(msg: ChatMessage): Promise<void> {
  if (checkDbActive()) {
    try {
      await pool.query(
        `INSERT INTO chat_messages (id, sender_id, sender_name, sender_avatar, receiver_id, receiver_name, receiver_avatar, message, is_read, created_at, media_url, media_type, sender_has_rgb)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)`,
        [
          msg.id,
          msg.senderId,
          msg.senderName,
          msg.senderAvatar || null,
          msg.receiverId,
          msg.receiverName,
          msg.receiverAvatar || null,
          msg.message,
          msg.isRead,
          msg.createdAt,
          msg.mediaUrl || null,
          msg.mediaType || null,
          msg.senderHasRgb || false
        ]
      );
      return;
    } catch (e) {
      console.error("Failed to insert chat message to DB, using fallback", e);
    }
  }
  localChatMessages.push(msg);
}

export async function markMessagesAsReadInDb(senderId: string, receiverId: string): Promise<void> {
  if (checkDbActive()) {
    try {
      await pool.query(
        `UPDATE chat_messages SET is_read = TRUE 
         WHERE sender_id = $1 AND receiver_id = $2 AND is_read = FALSE`,
        [senderId, receiverId]
      );
      return;
    } catch (e) {
      console.error("Failed to mark messages as read in DB, using fallback", e);
    }
  }
  localChatMessages.forEach(m => {
    if (m.senderId === senderId && m.receiverId === receiverId) {
      m.isRead = true;
    }
  });
}

export async function getAllUserMessagesFromDb(userId: string): Promise<ChatMessage[]> {
  if (checkDbActive()) {
    try {
      const { rows } = await pool.query(
        `SELECT * FROM chat_messages 
         WHERE sender_id = $1 OR receiver_id = $1
         ORDER BY created_at ASC`,
        [userId]
      );
      return rows.map(r => ({
        id: r.id,
        senderId: r.sender_id,
        senderName: r.sender_name,
        senderAvatar: r.sender_avatar || undefined,
        receiverId: r.receiver_id,
        receiverName: r.receiver_name,
        receiverAvatar: r.receiver_avatar || undefined,
        message: r.message,
        isRead: r.is_read,
        createdAt: r.created_at ? new Date(r.created_at).toISOString() : new Date().toISOString(),
        senderHasRgb: r.sender_has_rgb || false,
        mediaUrl: r.media_url || undefined,
        mediaType: r.media_type as any || undefined
      }));
    } catch (e) {
      console.error("Failed to query all user messages from DB, using fallback", e);
    }
  }
  return localChatMessages.filter(m => m.senderId === userId || m.receiverId === userId)
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
}

// Advanced profile update query
export async function updateUserProfileInDb(
  id: string,
  name: string,
  avatar: string | null,
  bio: string | null,
  githubLink: string | null,
  instagramLink: string | null,
  linkedinLink: string | null,
  coverPhoto: string | null,
  customBadge: string | null,
  customColor: string | null,
  avatarFrame: string | null
) {
  if (checkDbActive()) {
    try {
      await pool.query(
        `UPDATE users SET 
          name = $1, 
          avatar = $2, 
          bio = $3, 
          github_link = $4, 
          instagram_link = $5, 
          linkedin_link = $6, 
          cover_photo = $7, 
          custom_badge = $8, 
          custom_color = $9, 
          avatar_frame = $10,
          updated_at = NOW() 
         WHERE id = $11`,
        [name, avatar, bio, githubLink, instagramLink, linkedinLink, coverPhoto, customBadge, customColor, avatarFrame || 'none', id]
      );

      // Also update public.profiles
      await pool.query(
        `UPDATE public.profiles SET 
          display_name = $1, 
          avatar = $2, 
          bio = $3, 
          cover_photo = $4, 
          custom_badge = $5, 
          custom_color = $6, 
          avatar_frame = $7,
          updated_at = NOW() 
         WHERE id = $8`,
        [name, avatar, bio, coverPhoto, customBadge, customColor, avatarFrame || 'none', id]
      );
    } catch (e) {
      console.error("Failed to update user profile in DB:", e);
    }
  }
}

// Friendship DB methods
export let localFriendships: any[] = [];
export let localUsersList: any[] = [];

export async function addFriendshipToDb(id: string, userId: string, friendId: string, status: 'pending' | 'accepted'): Promise<void> {
  if (checkDbActive()) {
    try {
      // Check if there is already a friendship in either direction
      const { rows } = await pool.query(
        `SELECT * FROM friends WHERE (user_id = $1 AND friend_id = $2) OR (user_id = $2 AND friend_id = $1)`,
        [userId, friendId]
      );
      
      if (rows.length > 0) {
        const existing = rows[0];
        if (existing.status === 'accepted') {
          return; // Already friends, do nothing
        }
        
        // If there's an existing pending request in the opposite direction, auto-accept it!
        if (existing.status === 'pending' && existing.user_id === friendId) {
          await pool.query(
            `UPDATE friends SET status = 'accepted' WHERE id = $1`,
            [existing.id]
          );
        }
        return;
      }
      
      await pool.query(
        `INSERT INTO friends (id, user_id, friend_id, status)
         VALUES ($1, $2, $3, $4)`,
        [id, userId, friendId, status]
      );
      return;
    } catch (e) {
      console.error("Failed to add friendship in DB:", e);
    }
  }
  
  const existing = localFriendships.find(
    f => (f.userId === userId && f.friendId === friendId) || (f.userId === friendId && f.friendId === userId)
  );
  
  if (existing) {
    if (existing.status === 'accepted') {
      return;
    }
    if (existing.status === 'pending' && existing.userId === friendId) {
      existing.status = 'accepted'; // Auto-accept reciprocal request
    }
  } else {
    localFriendships.push({ id, userId, friendId, status, createdAt: new Date().toISOString() });
  }
}

export async function updateFriendshipStatusInDb(userId: string, friendId: string, status: 'pending' | 'accepted'): Promise<void> {
  if (checkDbActive()) {
    try {
      await pool.query(
        `UPDATE friends SET status = $1 WHERE (user_id = $2 AND friend_id = $3) OR (user_id = $3 AND friend_id = $2)`,
        [status, userId, friendId]
      );
      return;
    } catch (e) {
      console.error("Failed to update friendship status in DB:", e);
    }
  }
  localFriendships.forEach(f => {
    if ((f.userId === userId && f.friendId === friendId) || (f.userId === friendId && f.friendId === userId)) {
      f.status = status;
    }
  });
}

export async function deleteFriendshipInDb(userId: string, friendId: string): Promise<void> {
  if (checkDbActive()) {
    try {
      await pool.query(
        `DELETE FROM friends WHERE (user_id = $1 AND friend_id = $2) OR (user_id = $2 AND friend_id = $1)`,
        [userId, friendId]
      );
      return;
    } catch (e) {
      console.error("Failed to delete friendship in DB:", e);
    }
  }
  localFriendships = localFriendships.filter(
    f => !((f.userId === userId && f.friendId === friendId) || (f.userId === friendId && f.friendId === userId))
  );
}

export async function getFriendshipsForUserFromDb(userId: string): Promise<any[]> {
  if (checkDbActive()) {
    try {
      const { rows } = await pool.query(
        `SELECT f.*, 
                u1.name as sender_name, u1.avatar as sender_avatar, u1.avatar_frame as sender_frame,
                u2.name as receiver_name, u2.avatar as receiver_avatar, u2.avatar_frame as receiver_frame
         FROM friends f
         JOIN users u1 ON f.user_id = u1.id
         JOIN users u2 ON f.friend_id = u2.id
         WHERE f.user_id = $1 OR f.friend_id = $1`,
        [userId]
      );
      return rows.map(r => ({
        id: r.id,
        userId: r.user_id,
        friendId: r.friend_id,
        status: r.status,
        createdAt: r.created_at ? new Date(r.created_at).toISOString() : new Date().toISOString(),
        senderName: r.sender_name,
        senderAvatar: r.sender_avatar,
        senderFrame: r.sender_frame || 'none',
        receiverName: r.receiver_name,
        receiverAvatar: r.receiver_avatar,
        receiverFrame: r.receiver_frame || 'none'
      }));
    } catch (e) {
      console.error("Failed to get friendships from DB:", e);
    }
  }
  return localFriendships.filter(f => f.userId === userId || f.friendId === userId).map(f => {
    const sender = localUsersList.find(u => u.id === f.userId);
    const receiver = localUsersList.find(u => u.id === f.friendId);
    return {
      ...f,
      senderName: sender ? (sender.name || sender.displayName) : f.userId,
      senderAvatar: sender ? sender.avatar : undefined,
      senderFrame: sender ? (sender.avatarFrame || sender.avatar_frame || 'none') : 'none',
      receiverName: receiver ? (receiver.name || receiver.displayName) : f.friendId,
      receiverAvatar: receiver ? receiver.avatar : undefined,
      receiverFrame: receiver ? (receiver.avatarFrame || receiver.avatar_frame || 'none') : 'none'
    };
  });
}

// Activity Logging & Admin Query Helpers
let localActivityLogs: any[] = [];

export async function logActivityToDb(actionType: string, userId: string | null, userName: string | null, details: string): Promise<void> {
  const logItem = {
    id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`,
    actionType,
    userId: userId || 'system',
    userName: userName || 'Anonim / Sistem',
    details,
    createdAt: new Date().toISOString()
  };
  localActivityLogs.unshift(logItem);
  if (localActivityLogs.length > 500) localActivityLogs.pop();

  if (checkDbActive()) {
    try {
      await pool.query(
        `INSERT INTO activity_logs (id, action_type, user_id, user_name, details, created_at)
         VALUES ($1, $2, $3, $4, $5, NOW())`,
        [logItem.id, actionType, userId, userName, details]
      );
    } catch (e) {
      console.error("Failed to insert activity log to DB:", e);
    }
  }
}

export async function getActivityLogsFromDb(): Promise<any[]> {
  if (checkDbActive()) {
    try {
      const { rows } = await pool.query('SELECT * FROM activity_logs ORDER BY created_at DESC LIMIT 200');
      return rows.map(r => ({
        id: r.id,
        actionType: r.action_type,
        userId: r.user_id,
        userName: r.user_name,
        details: r.details,
        createdAt: r.created_at ? new Date(r.created_at).toISOString() : new Date().toISOString()
      }));
    } catch (e) {
      console.error("Failed to get activity logs from DB:", e);
    }
  }
  return localActivityLogs;
}

export async function getAllUsersFromDb(): Promise<any[]> {
  if (checkDbActive()) {
    try {
      const { rows } = await pool.query('SELECT id, email, name, avatar, is_verified, bio, custom_badge, invite_count, is_crown, has_rgb, is_banned, avatar_frame, created_at FROM users ORDER BY created_at DESC');
      if (rows && rows.length > 0) {
        return rows.map(r => ({
          id: r.id,
          email: r.email,
          name: r.name,
          avatar: r.avatar,
          isVerified: r.is_verified,
          bio: r.bio,
          customBadge: r.custom_badge,
          inviteCount: Number(r.invite_count || 0),
          isCrown: Boolean(r.is_crown),
          hasRgb: Boolean(r.has_rgb),
          isBanned: Boolean(r.is_banned),
          avatarFrame: r.avatar_frame || 'none',
          createdAt: r.created_at ? new Date(r.created_at).toISOString() : new Date().toISOString()
        }));
      }
    } catch (e) {
      console.error("Failed to fetch all users from DB:", e);
    }
  }
  return localUsersList || [];
}

export async function getAllMessagesFromDb(): Promise<ChatMessage[]> {
  if (checkDbActive()) {
    try {
      const { rows } = await pool.query('SELECT * FROM chat_messages ORDER BY created_at DESC LIMIT 500');
      return rows.map(r => ({
        id: r.id,
        senderId: r.sender_id,
        senderName: r.sender_name,
        senderAvatar: r.sender_avatar,
        receiverId: r.receiver_id,
        receiverName: r.receiver_name,
        receiverAvatar: r.receiver_avatar,
        message: r.message,
        createdAt: r.created_at ? new Date(r.created_at).toISOString() : new Date().toISOString(),
        isRead: r.is_read,
        senderHasRgb: r.sender_has_rgb || false,
        mediaUrl: r.media_url,
        mediaType: r.media_type
      }));
    } catch (e) {
      console.error("Failed to fetch all messages from DB:", e);
    }
  }
  return [];
}

export async function updateUserInDb(userId: string, data: any): Promise<void> {
  if (checkDbActive()) {
    try {
      const { name, bio, isVerified, customBadge, role, isCrown, hasRgb, isBanned } = data;
      await pool.query(
        `UPDATE users SET 
          name = $1, 
          bio = $2, 
          is_verified = $3, 
          custom_badge = $4, 
          role = $5, 
          is_crown = $6, 
          has_rgb = $7,
          is_banned = $8,
          updated_at = NOW()
         WHERE id = $9`,
        [name, bio, isVerified, customBadge, role, isCrown, hasRgb, isBanned, userId]
      );
    } catch (e) {
      console.error("Failed to update user in DB:", e);
    }
  }
}

export async function broadcastMessageToDb(message: string, senderId: string, senderName: string, senderAvatar?: string): Promise<void> {
  if (checkDbActive()) {
    try {
      const { rows: users } = await pool.query('SELECT id FROM users');
      const now = new Date().toISOString();
      const queries = users.map(u => {
        const id = `msg-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
        return pool.query(
          `INSERT INTO chat_messages (id, sender_id, sender_name, sender_avatar, receiver_id, receiver_name, receiver_avatar, message, created_at, is_read)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
          [id, senderId, senderName, senderAvatar, u.id, 'Sistem Duyurusu', null, message, now, false]
        );
      });
      await Promise.all(queries);
    } catch (e) {
      console.error("Failed to broadcast message in DB:", e);
    }
  }
}

export async function deleteUserFromDb(userId: string): Promise<boolean> {
  if (checkDbActive()) {
    try {
      // 1. Fetch user email to ensure cleanup across tables referencing email or id
      let targetId = userId;
      let targetEmail: string | null = null;
      try {
        const { rows } = await pool.query('SELECT id, email FROM users WHERE id::text = $1 OR LOWER(email) = LOWER($1)', [userId]);
        if (rows[0]) {
          targetId = rows[0].id ? String(rows[0].id) : userId;
          targetEmail = rows[0].email ? rows[0].email.toLowerCase() : null;
        } else {
          const { rows: pRows } = await pool.query('SELECT id, email FROM public.profiles WHERE id::text = $1 OR LOWER(email) = LOWER($1)', [userId]);
          if (pRows[0]) {
            targetId = pRows[0].id ? String(pRows[0].id) : userId;
            targetEmail = pRows[0].email ? pRows[0].email.toLowerCase() : null;
          }
        }
      } catch (err) {
        console.warn("Could not query user before deletion:", err);
      }

      // 2. Cascade delete dependent rows in order to prevent FK constraints
      try { await pool.query('DELETE FROM auth_identities WHERE user_id::text = $1', [targetId]); } catch {}
      try { await pool.query('DELETE FROM user_sessions WHERE user_id::text = $1', [targetId]); } catch {}
      try { await pool.query('DELETE FROM notifications WHERE user_id::text = $1 OR sender_id::text = $1', [targetId]); } catch {}
      try { await pool.query('DELETE FROM setup_likes WHERE user_id::text = $1', [targetId]); } catch {}
      try { await pool.query('DELETE FROM wishlist WHERE user_id::text = $1', [targetId]); } catch {}
      try { await pool.query('DELETE FROM friends WHERE user_id::text = $1 OR friend_id::text = $1', [targetId]); } catch {}
      try { await pool.query('DELETE FROM activity_logs WHERE user_id::text = $1', [targetId]); } catch {}
      try { await pool.query('DELETE FROM chat_messages WHERE sender_id::text = $1 OR user_id::text = $1', [targetId]); } catch {}
      try { await pool.query('DELETE FROM public.chat_messages WHERE sender_id::text = $1 OR user_id::text = $1', [targetId]); } catch {}
      try { await pool.query('DELETE FROM public.chat_room_members WHERE user_id::text = $1', [targetId]); } catch {}
      try { await pool.query('DELETE FROM hardware_reviews WHERE user_id::text = $1', [targetId]); } catch {}
      try { await pool.query('DELETE FROM user_hardware_ownership WHERE user_id::text = $1', [targetId]); } catch {}
      try { await pool.query('DELETE FROM public.ai_usage_logs WHERE user_id::text = $1', [targetId]); } catch {}
      try { await pool.query('DELETE FROM public.ai_messages WHERE conversation_id IN (SELECT id FROM public.ai_conversations WHERE user_id::text = $1)', [targetId]); } catch {}
      try { await pool.query('DELETE FROM public.ai_conversations WHERE user_id::text = $1', [targetId]); } catch {}
      try { await pool.query('DELETE FROM setup_hardware WHERE setup_id IN (SELECT id FROM setups WHERE owner_id::text = $1 OR user_id::text = $1)', [targetId]); } catch {}
      try { await pool.query('DELETE FROM setup_games WHERE setup_id IN (SELECT id FROM setups WHERE owner_id::text = $1 OR user_id::text = $1)', [targetId]); } catch {}
      try { await pool.query('DELETE FROM setups WHERE owner_id::text = $1 OR user_id::text = $1', [targetId]); } catch {}

      // 3. Delete from public.profiles
      try {
        if (targetEmail) {
          await pool.query('DELETE FROM public.profiles WHERE id::text = $1 OR LOWER(email) = LOWER($2)', [targetId, targetEmail]);
        } else {
          await pool.query('DELETE FROM public.profiles WHERE id::text = $1', [targetId]);
        }
      } catch (err) {
        console.warn("Error deleting from profiles:", err);
      }

      // 4. Delete from users table
      try {
        if (targetEmail) {
          await pool.query('DELETE FROM users WHERE id::text = $1 OR LOWER(email) = LOWER($2)', [targetId, targetEmail]);
        } else {
          await pool.query('DELETE FROM users WHERE id::text = $1', [targetId]);
        }
      } catch (err) {
        console.error("Error deleting from users:", err);
      }

      console.log(`Successfully deleted user ${targetId} (${targetEmail || 'no-email'}) from DB.`);
      return true;
    } catch (e) {
      console.error("Failed to delete user from DB:", e);
      throw e;
    }
  }
  return false;
}

export async function deleteChatMessageFromDb(msgId: string): Promise<void> {
  if (checkDbActive()) {
    try {
      await pool.query('DELETE FROM chat_messages WHERE id = $1', [msgId]);
    } catch (e) {
      console.error("Failed to delete message from DB:", e);
    }
  }
}

// Media Storage Database Queries
export interface MediaFileRecord {
  id: string;
  fileName: string;
  fileUrl: string;
  fileType: string;
  fileSize?: number;
  mimeType?: string;
  uploaderId?: string;
  uploaderName?: string;
  createdAt?: string;
  thumbnail512?: string;
  thumbnail256?: string;
}

export async function addMediaFileToDb(media: MediaFileRecord): Promise<void> {
  if (checkDbActive()) {
    try {
      await pool.query(
        `INSERT INTO media_files (id, file_name, file_url, file_type, file_size, mime_type, uploader_id, uploader_name, created_at, thumbnail_512, thumbnail_256)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW(), $9, $10)`,
        [
          media.id,
          media.fileName,
          media.fileUrl,
          media.fileType,
          media.fileSize || 0,
          media.mimeType || null,
          media.uploaderId || null,
          media.uploaderName || null,
          media.thumbnail512 || null,
          media.thumbnail256 || null
        ]
      );
    } catch (e) {
      console.error("Failed to insert media file to DB:", e);
    }
  }
}

export async function getMediaFilesFromDb(): Promise<MediaFileRecord[]> {
  if (checkDbActive()) {
    try {
      const { rows } = await pool.query('SELECT * FROM media_files ORDER BY created_at DESC LIMIT 500');
      return rows.map(r => ({
        id: r.id,
        fileName: r.file_name,
        fileUrl: r.file_url,
        fileType: r.file_type,
        fileSize: Number(r.file_size || 0),
        mimeType: r.mime_type,
        uploaderId: r.uploader_id,
        uploaderName: r.uploader_name,
        createdAt: r.created_at ? new Date(r.created_at).toISOString() : new Date().toISOString(),
        thumbnail512: r.thumbnail_512 || null,
        thumbnail256: r.thumbnail_256 || null
      }));
    } catch (e) {
      console.error("Failed to fetch media files from DB:", e);
    }
  }
  return [];
}

export async function addCommentToDb(setupId: string, comment: any): Promise<void> {
  if (checkDbActive()) {
    try {
      await pool.query(
        `UPDATE setups SET comments = comments || $1::jsonb WHERE id = $2`,
        [JSON.stringify([comment]), setupId]
      );
      return;
    } catch (e) {
      console.error("Failed to add comment to DB:", e);
    }
  }
}

export async function incrementInviteCount(userId: string) {
  if (checkDbActive()) {
    try {
      await pool.query(
        `UPDATE users SET invite_count = COALESCE(invite_count, 0) + 1, is_crown = TRUE, has_rgb = TRUE WHERE id = $1`,
        [userId]
      );
    } catch (e) {
      console.error("Failed to increment invite count in DB:", e);
    }
  }
}

export async function deleteMediaFileFromDb(id: string): Promise<void> {
  if (checkDbActive()) {
    try {
      await pool.query('DELETE FROM media_files WHERE id = $1', [id]);
    } catch (e) {
      console.error("Failed to delete media file from DB:", e);
    }
  }
}

let localSiteSettings: Record<string, string> = {
  instagram_link: 'https://instagram.com',
  twitter_link: 'https://twitter.com',
  youtube_link: 'https://youtube.com',
  github_link: 'https://github.com',
  discord_link: 'https://discord.com',
  linkedin_link: 'https://linkedin.com',
  contact_email: 'setupss.support@gmail.com'
};

export async function getSiteSettingsFromDb(): Promise<Record<string, string>> {
  if (checkDbActive()) {
    try {
      const { rows } = await pool.query('SELECT key, value FROM site_settings');
      const settings: Record<string, string> = { ...localSiteSettings };
      for (const r of rows) {
        settings[r.key] = r.value;
      }
      return settings;
    } catch (e) {
      console.error("Failed to fetch site settings from DB:", e);
    }
  }
  return localSiteSettings;
}

export async function updateSiteSettingsInDb(newSettings: Record<string, string>): Promise<void> {
  localSiteSettings = { ...localSiteSettings, ...newSettings };
  if (checkDbActive()) {
    try {
      for (const [key, value] of Object.entries(newSettings)) {
        await pool.query(
          `INSERT INTO site_settings (key, value) VALUES ($1, $2) ON CONFLICT (key) DO UPDATE SET value = $2`,
          [key, value]
        );
      }
    } catch (e) {
      console.error("Failed to update site settings in DB:", e);
    }
  }
}

// In-memory Fallback Stores for Sprint 1 Entity Database
let localBrands: any[] = [
  { id: 'b-asus', name: 'ASUS', slug: 'asus', description: 'Republic of Gamers & TUF Gaming hardware', logo_url: 'https://logo.clearbit.com/asus.com', website: 'https://asus.com', is_deleted: false },
  { id: 'b-logitech', name: 'Logitech', slug: 'logitech', description: 'Logitech G peripherals and creator tools', logo_url: 'https://logo.clearbit.com/logitech.com', website: 'https://logitech.com', is_deleted: false },
  { id: 'b-nvidia', name: 'NVIDIA', slug: 'nvidia', description: 'GeForce RTX graphics processors', logo_url: 'https://logo.clearbit.com/nvidia.com', website: 'https://nvidia.com', is_deleted: false },
  { id: 'b-amd', name: 'AMD', slug: 'amd', description: 'Ryzen processors and Radeon graphics', logo_url: 'https://logo.clearbit.com/amd.com', website: 'https://amd.com', is_deleted: false }
];

let localCategories: any[] = [
  { id: 'c-gpu', name: 'GPU', slug: 'gpu', description: 'Graphics Cards & Display Processors', is_deleted: false },
  { id: 'c-cpu', name: 'CPU', slug: 'cpu', description: 'Central Processing Units', is_deleted: false },
  { id: 'c-keyboard', name: 'Klavye', slug: 'klavye', description: 'Mechanical & Custom Keyboards', is_deleted: false },
  { id: 'c-mouse', name: 'Mouse', slug: 'mouse', description: 'Gaming & Ergonomic Mice', is_deleted: false }
];

let localHardware: any[] = [
  { id: 'hw-5090', name: 'NVIDIA GeForce RTX 5090', slug: 'rtx-5090', brand_id: 'b-nvidia', category_id: 'c-gpu', description: 'Flagship Blackwell Architecture GPU', specs: { vram: '32GB GDDR7', bus: '512-bit' }, price_estimate: 79999, is_deleted: false },
  { id: 'hw-7800x3d', name: 'AMD Ryzen 7 7800X3D', slug: 'ryzen-7-7800x3d', brand_id: 'b-amd', category_id: 'c-cpu', description: 'Ultimate Gaming Processor with 3D V-Cache', specs: { cores: 8, threads: 16, cache: '104MB' }, price_estimate: 15499, is_deleted: false }
];

let localGames: any[] = [
  { id: 'g-valorant', name: 'Valorant', slug: 'valorant', description: 'Tactical 5v5 character-based shooter', genre: 'FPS', developer: 'Riot Games', release_year: 2020, is_deleted: false },
  { id: 'g-cs2', name: 'Counter-Strike 2', slug: 'cs2', description: 'Tactical FPS built on Source 2', genre: 'FPS', developer: 'Valve', release_year: 2023, is_deleted: false }
];

let localSetupHardware: any[] = [];
let localSetupGames: any[] = [];
let localEntityAuditLogs: any[] = [];

// ==========================================
// SPRINT 1: BRAND ENTITY DATABASE API HELPERS
// ==========================================
export async function getBrandsFromDb(): Promise<any[]> {
  if (checkDbActive()) {
    try {
      const { rows } = await pool.query('SELECT * FROM brands WHERE (is_deleted IS NOT TRUE) ORDER BY name ASC');
      return rows;
    } catch (e) {
      console.error("Failed to fetch brands:", e);
    }
  }
  return localBrands.filter(b => !b.is_deleted);
}

export async function getBrandByIdOrSlug(idOrSlug: string): Promise<any | null> {
  if (checkDbActive()) {
    try {
      const { rows } = await pool.query('SELECT * FROM brands WHERE (id = $1 OR slug = $2) AND (is_deleted IS NOT TRUE)', [idOrSlug, idOrSlug]);
      return rows[0] || null;
    } catch (e) {
      console.error("Failed to fetch brand by id/slug:", e);
    }
  }
  return localBrands.find(b => (b.id === idOrSlug || b.slug === idOrSlug) && !b.is_deleted) || null;
}

export async function createBrandInDb(id: string, name: string, slug: string, description?: string, logoUrl?: string, website?: string): Promise<void> {
  const brand = { id, name, slug, description: description || null, logo_url: logoUrl || null, website: website || null, is_deleted: false, created_at: new Date().toISOString() };
  const existingIdx = localBrands.findIndex(b => b.id === id);
  if (existingIdx >= 0) {
    localBrands[existingIdx] = { ...localBrands[existingIdx], ...brand };
  } else {
    localBrands.push(brand);
  }
  if (checkDbActive()) {
    try {
      await pool.query(
        `INSERT INTO brands (id, name, slug, description, logo_url, website) VALUES ($1, $2, $3, $4, $5, $6) ON CONFLICT (id) DO NOTHING`,
        [id, name, slug, description || null, logoUrl || null, website || null]
      );
    } catch (e) {
      console.error("Failed to create brand:", e);
    }
  }
}

export async function updateBrandInDb(id: string, name: string, slug: string, description?: string, logoUrl?: string, website?: string): Promise<void> {
  const idx = localBrands.findIndex(b => b.id === id);
  if (idx >= 0) {
    localBrands[idx] = { ...localBrands[idx], name, slug, description: description || null, logo_url: logoUrl || null, website: website || null };
  }
  if (checkDbActive()) {
    try {
      await pool.query(
        `UPDATE brands SET name = $2, slug = $3, description = $4, logo_url = $5, website = $6 WHERE id = $1`,
        [id, name, slug, description || null, logoUrl || null, website || null]
      );
    } catch (e) {
      console.error("Failed to update brand:", e);
    }
  }
}

export async function deleteBrandFromDb(id: string): Promise<void> {
  localBrands = localBrands.filter(b => b.id !== id);
  if (checkDbActive()) {
    try {
      await pool.query('DELETE FROM brands WHERE id = $1', [id]);
    } catch (e) {
      console.error("Failed to delete brand:", e);
    }
  }
}

// =====================================================
// SPRINT 1: HARDWARE CATEGORY ENTITY DATABASE API HELPERS
// =====================================================
export async function getHardwareCategoriesFromDb(): Promise<any[]> {
  if (checkDbActive()) {
    try {
      const { rows } = await pool.query('SELECT * FROM hardware_categories WHERE (is_deleted IS NOT TRUE) ORDER BY name ASC');
      return rows;
    } catch (e) {
      console.error("Failed to fetch hardware categories:", e);
    }
  }
  return localCategories.filter(c => !c.is_deleted);
}

export async function getHardwareCategoryByIdOrSlug(idOrSlug: string): Promise<any | null> {
  if (checkDbActive()) {
    try {
      const { rows } = await pool.query('SELECT * FROM hardware_categories WHERE (id = $1 OR slug = $2) AND (is_deleted IS NOT TRUE)', [idOrSlug, idOrSlug]);
      return rows[0] || null;
    } catch (e) {
      console.error("Failed to fetch hardware category:", e);
    }
  }
  return localCategories.find(c => (c.id === idOrSlug || c.slug === idOrSlug) && !c.is_deleted) || null;
}

export async function createHardwareCategoryInDb(id: string, name: string, slug: string, description?: string): Promise<void> {
  const cat = { id, name, slug, description: description || null, is_deleted: false, created_at: new Date().toISOString() };
  const idx = localCategories.findIndex(c => c.id === id);
  if (idx >= 0) localCategories[idx] = { ...localCategories[idx], ...cat };
  else localCategories.push(cat);

  if (checkDbActive()) {
    try {
      await pool.query(
        `INSERT INTO hardware_categories (id, name, slug, description) VALUES ($1, $2, $3, $4) ON CONFLICT (id) DO NOTHING`,
        [id, name, slug, description || null]
      );
    } catch (e) {
      console.error("Failed to create hardware category:", e);
    }
  }
}

export async function updateHardwareCategoryInDb(id: string, name: string, slug: string, description?: string): Promise<void> {
  const idx = localCategories.findIndex(c => c.id === id);
  if (idx >= 0) localCategories[idx] = { ...localCategories[idx], name, slug, description: description || null };

  if (checkDbActive()) {
    try {
      await pool.query(
        `UPDATE hardware_categories SET name = $2, slug = $3, description = $4 WHERE id = $1`,
        [id, name, slug, description || null]
      );
    } catch (e) {
      console.error("Failed to update hardware category:", e);
    }
  }
}

export async function deleteHardwareCategoryFromDb(id: string): Promise<void> {
  localCategories = localCategories.filter(c => c.id !== id);
  if (checkDbActive()) {
    try {
      await pool.query('DELETE FROM hardware_categories WHERE id = $1', [id]);
    } catch (e) {
      console.error("Failed to delete hardware category:", e);
    }
  }
}

// =============================================
// SPRINT 1: HARDWARE ENTITY DATABASE API HELPERS
// =============================================
export async function getHardwareFromDb(): Promise<any[]> {
  if (checkDbActive()) {
    try {
      const { rows } = await pool.query(`
        SELECT h.*, b.name as brand_name, c.name as category_name 
        FROM hardware h
        LEFT JOIN brands b ON h.brand_id = b.id
        LEFT JOIN hardware_categories c ON h.category_id = c.id
        WHERE (h.is_deleted IS NOT TRUE)
        ORDER BY h.name ASC
      `);
      return rows;
    } catch (e) {
      console.error("Failed to fetch hardware:", e);
    }
  }
  return localHardware.filter(h => !h.is_deleted).map(h => {
    const brand = localBrands.find(b => b.id === h.brand_id);
    const cat = localCategories.find(c => c.id === h.category_id);
    return { ...h, brand_name: brand?.name || null, category_name: cat?.name || null };
  });
}

export async function getHardwareByIdOrSlug(idOrSlug: string): Promise<any | null> {
  if (checkDbActive()) {
    try {
      const { rows } = await pool.query(`
        SELECT h.*, b.name as brand_name, c.name as category_name 
        FROM hardware h
        LEFT JOIN brands b ON h.brand_id = b.id
        LEFT JOIN hardware_categories c ON h.category_id = c.id
        WHERE (h.id = $1 OR h.slug = $2) AND (h.is_deleted IS NOT TRUE)
      `, [idOrSlug, idOrSlug]);
      return rows[0] || null;
    } catch (e) {
      console.error("Failed to fetch hardware by id/slug:", e);
    }
  }
  const item = localHardware.find(h => (h.id === idOrSlug || h.slug === idOrSlug) && !h.is_deleted);
  if (!item) return null;
  const brand = localBrands.find(b => b.id === item.brand_id);
  const cat = localCategories.find(c => c.id === item.category_id);
  return { ...item, brand_name: brand?.name || null, category_name: cat?.name || null };
}

export async function createHardwareInDb(id: string, name: string, slug: string, brandId?: string, categoryId?: string, description?: string, specs?: any, imageUrl?: string, priceEstimate?: number, buyLink?: string): Promise<void> {
  const item = {
    id, name, slug, brand_id: brandId || null, category_id: categoryId || null, description: description || null,
    specs: specs || {}, image_url: imageUrl || null, price_estimate: priceEstimate || 0, buy_link: buyLink || null,
    is_deleted: false, created_at: new Date().toISOString()
  };
  const idx = localHardware.findIndex(h => h.id === id);
  if (idx >= 0) localHardware[idx] = { ...localHardware[idx], ...item };
  else localHardware.push(item);

  if (checkDbActive()) {
    try {
      await pool.query(
        `INSERT INTO hardware (id, name, slug, brand_id, category_id, description, specs, image_url, price_estimate, buy_link) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) ON CONFLICT (id) DO NOTHING`,
        [id, name, slug, brandId || null, categoryId || null, description || null, specs ? JSON.stringify(specs) : '{}', imageUrl || null, priceEstimate || 0, buyLink || null]
      );
    } catch (e) {
      console.error("Failed to create hardware:", e);
    }
  }
}

export async function updateHardwareInDb(id: string, name: string, slug: string, brandId?: string, categoryId?: string, description?: string, specs?: any, imageUrl?: string, priceEstimate?: number, buyLink?: string): Promise<void> {
  const idx = localHardware.findIndex(h => h.id === id);
  if (idx >= 0) {
    localHardware[idx] = {
      ...localHardware[idx], name, slug, brand_id: brandId || null, category_id: categoryId || null,
      description: description || null, specs: specs || {}, image_url: imageUrl || null,
      price_estimate: priceEstimate || 0, buy_link: buyLink || null
    };
  }

  if (checkDbActive()) {
    try {
      await pool.query(
        `UPDATE hardware SET name = $2, slug = $3, brand_id = $4, category_id = $5, description = $6, specs = $7, image_url = $8, price_estimate = $9, buy_link = $10 WHERE id = $1`,
        [id, name, slug, brandId || null, categoryId || null, description || null, specs ? JSON.stringify(specs) : '{}', imageUrl || null, priceEstimate || 0, buyLink || null]
      );
    } catch (e) {
      console.error("Failed to update hardware:", e);
    }
  }
}

export async function deleteHardwareFromDb(id: string): Promise<void> {
  localHardware = localHardware.filter(h => h.id !== id);
  if (checkDbActive()) {
    try {
      await pool.query('DELETE FROM hardware WHERE id = $1', [id]);
    } catch (e) {
      console.error("Failed to delete hardware:", e);
    }
  }
}

// =========================================
// SPRINT 1: GAME ENTITY DATABASE API HELPERS
// =========================================
export async function getGamesFromDb(): Promise<any[]> {
  if (checkDbActive()) {
    try {
      const { rows } = await pool.query('SELECT * FROM games WHERE (is_deleted IS NOT TRUE) ORDER BY name ASC');
      return rows;
    } catch (e) {
      console.error("Failed to fetch games:", e);
    }
  }
  return localGames.filter(g => !g.is_deleted);
}

export async function getGameByIdOrSlug(idOrSlug: string): Promise<any | null> {
  if (checkDbActive()) {
    try {
      const { rows } = await pool.query('SELECT * FROM games WHERE (id = $1 OR slug = $2) AND (is_deleted IS NOT TRUE)', [idOrSlug, idOrSlug]);
      return rows[0] || null;
    } catch (e) {
      console.error("Failed to fetch game by id/slug:", e);
    }
  }
  return localGames.find(g => (g.id === idOrSlug || g.slug === idOrSlug) && !g.is_deleted) || null;
}

export async function createGameInDb(id: string, name: string, slug: string, description?: string, imageUrl?: string, genre?: string, developer?: string, releaseYear?: number, steamId?: number): Promise<void> {
  const game = { id, name, slug, description: description || null, image_url: imageUrl || null, genre: genre || null, developer: developer || null, release_year: releaseYear || null, steam_id: steamId || null, is_deleted: false, created_at: new Date().toISOString() };
  const idx = localGames.findIndex(g => g.id === id);
  if (idx >= 0) localGames[idx] = { ...localGames[idx], ...game };
  else localGames.push(game);

  if (checkDbActive()) {
    try {
      await pool.query(
        `INSERT INTO games (id, name, slug, description, image_url, genre, developer, release_year, steam_id) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) ON CONFLICT (id) DO NOTHING`,
        [id, name, slug, description || null, imageUrl || null, genre || null, developer || null, releaseYear || null, steamId || null]
      );
    } catch (e) {
      console.error("Failed to create game:", e);
    }
  }
}

export async function updateGameInDb(id: string, name: string, slug: string, description?: string, imageUrl?: string, genre?: string, developer?: string, releaseYear?: number, steamId?: number): Promise<void> {
  const idx = localGames.findIndex(g => g.id === id);
  if (idx >= 0) {
    localGames[idx] = { ...localGames[idx], name, slug, description: description || null, image_url: imageUrl || null, genre: genre || null, developer: developer || null, release_year: releaseYear || null, steam_id: steamId || null };
  }

  if (checkDbActive()) {
    try {
      await pool.query(
        `UPDATE games SET name = $2, slug = $3, description = $4, image_url = $5, genre = $6, developer = $7, release_year = $8, steam_id = $9 WHERE id = $1`,
        [id, name, slug, description || null, imageUrl || null, genre || null, developer || null, releaseYear || null, steamId || null]
      );
    } catch (e) {
      console.error("Failed to update game:", e);
    }
  }
}

export async function deleteGameFromDb(id: string): Promise<void> {
  localGames = localGames.filter(g => g.id !== id);
  if (checkDbActive()) {
    try {
      await pool.query('DELETE FROM games WHERE id = $1', [id]);
    } catch (e) {
      console.error("Failed to delete game:", e);
    }
  }
}

// ================================================
// SPRINT 1: SETUP RELATIONSHIP ENTITY DATABASE HELPERS
// ================================================
export async function linkSetupToHardware(setupId: string, hardwareId: string, notes?: string): Promise<void> {
  const existingIdx = localSetupHardware.findIndex(sh => sh.setup_id === setupId && sh.hardware_id === hardwareId);
  if (existingIdx >= 0) {
    localSetupHardware[existingIdx].notes = notes || null;
  } else {
    localSetupHardware.push({ setup_id: setupId, hardware_id: hardwareId, notes: notes || null });
  }

  if (checkDbActive()) {
    try {
      await pool.query(
        `INSERT INTO setup_hardware (setup_id, hardware_id, notes) VALUES ($1, $2, $3) ON CONFLICT (setup_id, hardware_id) DO UPDATE SET notes = $3`,
        [setupId, hardwareId, notes || null]
      );
    } catch (e) {
      console.error("Failed to link setup to hardware:", e);
    }
  }
}

export async function unlinkSetupFromHardware(setupId: string, hardwareId: string): Promise<void> {
  localSetupHardware = localSetupHardware.filter(sh => !(sh.setup_id === setupId && sh.hardware_id === hardwareId));
  if (checkDbActive()) {
    try {
      await pool.query('DELETE FROM setup_hardware WHERE setup_id = $1 AND hardware_id = $2', [setupId, hardwareId]);
    } catch (e) {
      console.error("Failed to unlink setup from hardware:", e);
    }
  }
}

export async function linkSetupToGame(setupId: string, gameId: string): Promise<void> {
  if (!localSetupGames.some(sg => sg.setup_id === setupId && sg.game_id === gameId)) {
    localSetupGames.push({ setup_id: setupId, game_id: gameId });
  }
  if (checkDbActive()) {
    try {
      await pool.query(
        `INSERT INTO setup_games (setup_id, game_id) VALUES ($1, $2) ON CONFLICT (setup_id, game_id) DO NOTHING`,
        [setupId, gameId]
      );
    } catch (e) {
      console.error("Failed to link setup to game:", e);
    }
  }
}

export async function unlinkSetupFromGame(setupId: string, gameId: string): Promise<void> {
  localSetupGames = localSetupGames.filter(sg => !(sg.setup_id === setupId && sg.game_id === gameId));
  if (checkDbActive()) {
    try {
      await pool.query('DELETE FROM setup_games WHERE setup_id = $1 AND game_id = $2', [setupId, gameId]);
    } catch (e) {
      console.error("Failed to unlink setup from game:", e);
    }
  }
}

export async function getSetupHardware(setupId: string): Promise<any[]> {
  if (checkDbActive()) {
    try {
      const { rows } = await pool.query(`
        SELECT h.*, sh.notes, b.name as brand_name, c.name as category_name
        FROM setup_hardware sh
        JOIN hardware h ON sh.hardware_id = h.id
        LEFT JOIN brands b ON h.brand_id = b.id
        LEFT JOIN hardware_categories c ON h.category_id = c.id
        WHERE sh.setup_id = $1 AND (h.is_deleted IS NOT TRUE)
      `, [setupId]);
      return rows;
    } catch (e) {
      console.error("Failed to fetch setup hardware:", e);
    }
  }
  return localSetupHardware.filter(sh => sh.setup_id === setupId).map(sh => {
    const h = localHardware.find(item => item.id === sh.hardware_id && !item.is_deleted);
    if (!h) return null;
    const brand = localBrands.find(b => b.id === h.brand_id);
    const cat = localCategories.find(c => c.id === h.category_id);
    return { ...h, notes: sh.notes, brand_name: brand?.name || null, category_name: cat?.name || null };
  }).filter(Boolean);
}

export async function getSetupGames(setupId: string): Promise<any[]> {
  if (checkDbActive()) {
    try {
      const { rows } = await pool.query(`
        SELECT g.*
        FROM setup_games sg
        JOIN games g ON sg.game_id = g.id
        WHERE sg.setup_id = $1 AND (g.is_deleted IS NOT TRUE)
      `, [setupId]);
      return rows;
    } catch (e) {
      console.error("Failed to fetch setup games:", e);
    }
  }
  return localSetupGames.filter(sg => sg.setup_id === setupId).map(sg => {
    return localGames.find(g => g.id === sg.game_id && !g.is_deleted);
  }).filter(Boolean);
}

// =========================================================================
// SPRINT 1 PRO: AUDIT LOGGING, SOFT DELETE, PAGINATION & BULK INSERT HELPERS
// =========================================================================

export async function createEntityAuditLog(entityType: string, entityId: string, action: string, performedBy?: string, payload?: any): Promise<void> {
  const logEntry = {
    id: `audit-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`,
    entity_type: entityType,
    entity_id: entityId,
    action,
    performed_by: performedBy || 'system',
    payload: payload || null,
    created_at: new Date().toISOString()
  };
  localEntityAuditLogs.unshift(logEntry);

  if (checkDbActive()) {
    try {
      await pool.query(
        `INSERT INTO entity_audit_logs (id, entity_type, entity_id, action, performed_by, payload) VALUES ($1, $2, $3, $4, $5, $6)`,
        [logEntry.id, entityType, entityId, action, performedBy || 'system', payload ? JSON.stringify(payload) : null]
      );
    } catch (e) {
      console.error("Failed to create entity audit log:", e);
    }
  }
}

export async function getEntityAuditLogs(limit: number = 50): Promise<any[]> {
  if (checkDbActive()) {
    try {
      const { rows } = await pool.query(`SELECT * FROM entity_audit_logs ORDER BY created_at DESC LIMIT $1`, [limit]);
      return rows;
    } catch (e) {
      console.error("Failed to fetch entity audit logs:", e);
    }
  }
  return localEntityAuditLogs.slice(0, limit);
}

export async function getHardwarePaginated(options: {
  page?: number;
  limit?: number;
  search?: string;
  brandId?: string;
  categoryId?: string;
}): Promise<{ items: any[]; total: number; page: number; limit: number; totalPages: number }> {
  const page = Math.max(1, options.page || 1);
  const limit = Math.min(100, Math.max(1, options.limit || 20));
  const offset = (page - 1) * limit;

  if (checkDbActive()) {
    try {
      let whereClause = `WHERE (h.is_deleted IS NOT TRUE)`;
      const params: any[] = [];

      if (options.search) {
        params.push(`%${options.search}%`);
        whereClause += ` AND (h.name ILIKE $${params.length} OR h.description ILIKE $${params.length} OR h.slug ILIKE $${params.length})`;
      }
      if (options.brandId) {
        params.push(options.brandId);
        whereClause += ` AND h.brand_id = $${params.length}`;
      }
      if (options.categoryId) {
        params.push(options.categoryId);
        whereClause += ` AND h.category_id = $${params.length}`;
      }

      const countQuery = `SELECT COUNT(*) FROM hardware h ${whereClause}`;
      const countRes = await pool.query(countQuery, params);
      const total = parseInt(countRes.rows[0].count, 10);

      const dataQuery = `
        SELECT h.*, b.name as brand_name, c.name as category_name
        FROM hardware h
        LEFT JOIN brands b ON h.brand_id = b.id
        LEFT JOIN hardware_categories c ON h.category_id = c.id
        ${whereClause}
        ORDER BY h.name ASC
        LIMIT $${params.length + 1} OFFSET $${params.length + 2}
      `;
      const dataRes = await pool.query(dataQuery, [...params, limit, offset]);

      return {
        items: dataRes.rows,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit) || 1
      };
    } catch (e) {
      console.error("Failed to fetch paginated hardware:", e);
    }
  }

  let filtered = localHardware.filter(h => !h.is_deleted);
  if (options.search) {
    const q = options.search.toLowerCase();
    filtered = filtered.filter(h => h.name.toLowerCase().includes(q) || (h.description && h.description.toLowerCase().includes(q)) || h.slug.toLowerCase().includes(q));
  }
  if (options.brandId) filtered = filtered.filter(h => h.brand_id === options.brandId);
  if (options.categoryId) filtered = filtered.filter(h => h.category_id === options.categoryId);

  const total = filtered.length;
  const sliced = filtered.slice(offset, offset + limit).map(h => {
    const brand = localBrands.find(b => b.id === h.brand_id);
    const cat = localCategories.find(c => c.id === h.category_id);
    return { ...h, brand_name: brand?.name || null, category_name: cat?.name || null };
  });

  return { items: sliced, total, page, limit, totalPages: Math.ceil(total / limit) || 1 };
}

export async function getBrandsPaginated(options: {
  page?: number;
  limit?: number;
  search?: string;
}): Promise<{ items: any[]; total: number; page: number; limit: number; totalPages: number }> {
  const page = Math.max(1, options.page || 1);
  const limit = Math.min(100, Math.max(1, options.limit || 20));
  const offset = (page - 1) * limit;

  if (checkDbActive()) {
    try {
      let whereClause = `WHERE (is_deleted IS NOT TRUE)`;
      const params: any[] = [];

      if (options.search) {
        params.push(`%${options.search}%`);
        whereClause += ` AND (name ILIKE $${params.length} OR description ILIKE $${params.length} OR slug ILIKE $${params.length})`;
      }

      const countRes = await pool.query(`SELECT COUNT(*) FROM brands ${whereClause}`, params);
      const total = parseInt(countRes.rows[0].count, 10);

      const dataRes = await pool.query(`SELECT * FROM brands ${whereClause} ORDER BY name ASC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`, [...params, limit, offset]);

      return {
        items: dataRes.rows,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit) || 1
      };
    } catch (e) {
      console.error("Failed to fetch paginated brands:", e);
    }
  }

  let filtered = localBrands.filter(b => !b.is_deleted);
  if (options.search) {
    const q = options.search.toLowerCase();
    filtered = filtered.filter(b => b.name.toLowerCase().includes(q) || (b.description && b.description.toLowerCase().includes(q)) || b.slug.toLowerCase().includes(q));
  }
  const total = filtered.length;
  const sliced = filtered.slice(offset, offset + limit);
  return { items: sliced, total, page, limit, totalPages: Math.ceil(total / limit) || 1 };
}

export async function getGamesPaginated(options: {
  page?: number;
  limit?: number;
  search?: string;
}): Promise<{ items: any[]; total: number; page: number; limit: number; totalPages: number }> {
  const page = Math.max(1, options.page || 1);
  const limit = Math.min(100, Math.max(1, options.limit || 20));
  const offset = (page - 1) * limit;

  if (checkDbActive()) {
    try {
      let whereClause = `WHERE (is_deleted IS NOT TRUE)`;
      const params: any[] = [];

      if (options.search) {
        params.push(`%${options.search}%`);
        whereClause += ` AND (name ILIKE $${params.length} OR genre ILIKE $${params.length} OR developer ILIKE $${params.length} OR slug ILIKE $${params.length})`;
      }

      const countRes = await pool.query(`SELECT COUNT(*) FROM games ${whereClause}`, params);
      const total = parseInt(countRes.rows[0].count, 10);

      const dataRes = await pool.query(`SELECT * FROM games ${whereClause} ORDER BY name ASC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`, [...params, limit, offset]);

      return {
        items: dataRes.rows,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit) || 1
      };
    } catch (e) {
      console.error("Failed to fetch paginated games:", e);
    }
  }

  let filtered = localGames.filter(g => !g.is_deleted);
  if (options.search) {
    const q = options.search.toLowerCase();
    filtered = filtered.filter(g => g.name.toLowerCase().includes(q) || (g.genre && g.genre.toLowerCase().includes(q)) || g.slug.toLowerCase().includes(q));
  }
  const total = filtered.length;
  const sliced = filtered.slice(offset, offset + limit);
  return { items: sliced, total, page, limit, totalPages: Math.ceil(total / limit) || 1 };
}

export async function softDeleteEntityInDb(entityType: 'hardware' | 'brands' | 'categories' | 'games', id: string, performedBy?: string): Promise<boolean> {
  if (entityType === 'hardware') {
    const item = localHardware.find(h => h.id === id);
    if (item) item.is_deleted = true;
  } else if (entityType === 'brands') {
    const item = localBrands.find(b => b.id === id);
    if (item) item.is_deleted = true;
  } else if (entityType === 'categories') {
    const item = localCategories.find(c => c.id === id);
    if (item) item.is_deleted = true;
  } else if (entityType === 'games') {
    const item = localGames.find(g => g.id === id);
    if (item) item.is_deleted = true;
  }
  await createEntityAuditLog(entityType, id, 'SOFT_DELETE', performedBy, { id });

  if (checkDbActive()) {
    try {
      const tableMap = {
        hardware: 'hardware',
        brands: 'brands',
        categories: 'hardware_categories',
        games: 'games'
      };
      const tableName = tableMap[entityType];
      if (!tableName) return false;

      await pool.query(`UPDATE ${tableName} SET is_deleted = TRUE WHERE id = $1`, [id]);
      return true;
    } catch (e) {
      console.error(`Failed to soft delete ${entityType}:`, e);
    }
  }
  return true;
}

export async function bulkInsertHardwareInDb(items: any[], performedBy?: string): Promise<{ inserted: number; errors: any[] }> {
  let inserted = 0;
  const errors: any[] = [];
  if (checkDbActive()) {
    for (const item of items) {
      try {
        if (!item.id || !item.name || !item.slug) {
          errors.push({ item, error: "id, name and slug required" });
          continue;
        }
        await createHardwareInDb(item.id, item.name, item.slug, item.brandId, item.categoryId, item.description, item.specs, item.imageUrl, item.priceEstimate, item.buyLink);
        inserted++;
      } catch (err: any) {
        errors.push({ item, error: err.message });
      }
    }
    await createEntityAuditLog('hardware', 'bulk', 'BULK_INSERT', performedBy, { count: inserted, errorsCount: errors.length });
  }
  return { inserted, errors };
}

// --- NEW NOTIFICATIONS & BOT FLEET FUNCTIONS ---

export async function addNotificationToDb(notification: any) {
  if (checkDbActive()) {
    try {
      await pool.query(
        `INSERT INTO notifications (id, user_id, sender_id, sender_name, sender_avatar, type, title, content, link)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
        [
          notification.id, notification.userId, notification.senderId || null, 
          notification.senderName || null, notification.senderAvatar || null, 
          notification.type, notification.title, notification.content, notification.link || null
        ]
      );
    } catch (e) {
      console.error("Failed to add notification:", e);
    }
  }
}

export async function addBotReportToDb(report: any) {
  if (checkDbActive()) {
    try {
      await pool.query(
        `INSERT INTO bot_reports (bot_id, bot_name, report_type, details, severity)
         VALUES ($1, $2, $3, $4, $5)`,
        [report.botId, report.botName, report.reportType, report.details, report.severity || 'low']
      );
    } catch (e) {
      console.error("Failed to add bot report:", e);
    }
  }
}

export async function getBotReportsFromDb() {
  if (checkDbActive()) {
    try {
      const { rows } = await pool.query(`SELECT * FROM bot_reports ORDER BY created_at DESC LIMIT 100`);
      return rows;
    } catch (e) {
      console.error("Failed to fetch bot reports:", e);
    }
  }
  return [];
}

export async function resolveBotReportInDb(reportId: number) {
  if (checkDbActive()) {
    try {
      await pool.query(`DELETE FROM bot_reports WHERE id = $1`, [reportId]);
    } catch (e) {
      console.error("Failed to resolve bot report:", e);
    }
  }
}

export async function clearBotReportsInDb() {
  if (checkDbActive()) {
    try {
      await pool.query(`DELETE FROM bot_reports`);
    } catch (e) {
      console.error("Failed to clear bot reports:", e);
    }
  }
}

export async function getGlobalChatHistoryFromDb(limit: number = 50) {
  if (checkDbActive()) {
    try {
      const { rows } = await pool.query(
        `SELECT * FROM chat_messages WHERE receiver_id = 'global' ORDER BY created_at DESC LIMIT $1`,
        [limit]
      );
      return rows.reverse();
    } catch (e) {
      console.error("Failed to fetch global chat history:", e);
    }
  }
  return [];
}

// ==========================================
// AI CONVERSATIONS & MESSAGES PERSISTENCE
// ==========================================
export async function createAiConversation(userId: string, title: string, model: string = 'gemini-2.5-flash', systemPrompt?: string) {
  const id = `conv-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
  if (checkDbActive()) {
    await pool.query(
      `INSERT INTO ai_conversations (id, user_id, title, model, system_prompt, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, NOW(), NOW())`,
      [id, userId, title, model, systemPrompt || null]
    );
  }
  return id;
}

export async function addAiMessage(conversationId: string, sender: 'user' | 'assistant' | 'system', text: string, tokenCount: number = 0, modelUsed?: string, errorStatus?: string) {
  const id = `msg-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
  if (checkDbActive()) {
    await pool.query(
      `INSERT INTO ai_messages (id, conversation_id, sender, text, token_count, model_used, error_status, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())`,
      [id, conversationId, sender, text, tokenCount, modelUsed || null, errorStatus || null]
    );
    await pool.query(
      `UPDATE ai_conversations SET updated_at = NOW(), total_tokens = COALESCE(total_tokens, 0) + $1 WHERE id = $2`,
      [tokenCount, conversationId]
    );
  }
  return id;
}

export async function getAiConversationsForUser(userId: string) {
  if (checkDbActive()) {
    const { rows } = await pool.query(
      `SELECT * FROM ai_conversations WHERE user_id = $1 ORDER BY updated_at DESC`,
      [userId]
    );
    return rows;
  }
  return [];
}

export async function getAiMessagesForConversation(conversationId: string) {
  if (checkDbActive()) {
    const { rows } = await pool.query(
      `SELECT * FROM ai_messages WHERE conversation_id = $1 ORDER BY created_at ASC`,
      [conversationId]
    );
    return rows;
  }
  return [];
}

export async function logAiUsage(userId: string | null, conversationId: string | null, model: string, promptTokens: number, completionTokens: number, totalTokens: number, latencyMs: number) {
  const id = `usage-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
  if (checkDbActive()) {
    await pool.query(
      `INSERT INTO ai_usage (id, user_id, conversation_id, model, prompt_tokens, completion_tokens, total_tokens, latency_ms, status, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW())`,
      [id, userId || null, conversationId || null, model, promptTokens, completionTokens, totalTokens, latencyMs, 'success']
    );
  }
}

export async function getAiAnalyticsForAdmin() {
  if (checkDbActive()) {
    const conversationsCountRes = await pool.query(`SELECT COUNT(*) FROM ai_conversations`);
    const messagesCountRes = await pool.query(`SELECT COUNT(*) FROM ai_messages`);
    const tokensSumRes = await pool.query(`SELECT COALESCE(SUM(total_tokens), 0) as total FROM ai_usage`);
    const recentConvs = await pool.query(
      `SELECT c.*, u.name as user_name, u.email as user_email 
       FROM ai_conversations c 
       LEFT JOIN users u ON c.user_id = u.id 
       ORDER BY c.updated_at DESC LIMIT 20`
    );
    return {
      totalConversations: parseInt(conversationsCountRes.rows[0].count, 10),
      totalMessages: parseInt(messagesCountRes.rows[0].count, 10),
      totalTokensUsed: parseInt(tokensSumRes.rows[0].total, 10),
      recentConversations: recentConvs.rows
    };
  }
  return { totalConversations: 0, totalMessages: 0, totalTokensUsed: 0, recentConversations: [] };
}

// ==========================================
// DISCORD-LIKE CHAT ROOMS PERSISTENCE
// ==========================================
export async function getChatRooms() {
  if (checkDbActive()) {
    const { rows } = await pool.query(`SELECT * FROM chat_rooms ORDER BY name ASC`);
    return rows;
  }
  return [
    { id: 'global', name: 'Global Sohbet', type: 'global', description: 'Tüm Setupss topluluğu genel sohbet odası', is_private: false },
    { id: 'hardware', name: 'Donanım & Setup Lounge', type: 'hardware', description: 'Ekran kartı, işlemci, kasa ve çevre birimi tartışmaları', is_private: false },
    { id: 'ai-hub', name: 'AI Bütçe & Danışman', type: 'ai-hub', description: 'Yapay zeka sistem toplama ve optimizasyon sohbetleri', is_private: false }
  ];
}

export async function getRoomMessages(roomId: string, limit: number = 50) {
  if (checkDbActive()) {
    const { rows } = await pool.query(
      `SELECT * FROM chat_messages WHERE receiver_id = $1 ORDER BY created_at DESC LIMIT $2`,
      [roomId, limit]
    );
    return rows.reverse();
  }
  return [];
}

export async function addRoomMessage(msg: {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  roomId: string;
  message: string;
  mediaUrl?: string;
  mediaType?: string;
  senderHasRgb?: boolean;
}) {
  if (checkDbActive()) {
    await pool.query(
      `INSERT INTO chat_messages (id, sender_id, sender_name, sender_avatar, receiver_id, receiver_name, message, created_at, media_url, media_type, sender_has_rgb, is_read)
       VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), $8, $9, $10, TRUE)`,
      [
        msg.id,
        msg.senderId,
        msg.senderName,
        msg.senderAvatar || null,
        msg.roomId,
        'Oda Sohbeti',
        msg.message,
        msg.mediaUrl || null,
        msg.mediaType || null,
        msg.senderHasRgb || false
      ]
    );
  }
}

export async function createChatRoom(room: {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  isPrivate?: boolean;
}) {
  if (checkDbActive()) {
    await pool.query(
      `INSERT INTO chat_rooms (id, name, slug, description, icon, is_private, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, NOW())
       ON CONFLICT (id) DO NOTHING`,
      [
        room.id,
        room.name,
        room.slug,
        room.description || null,
        room.icon || null,
        room.isPrivate || false
      ]
    );
  }
}

// ==========================================
// BLOG POSTS PERSISTENCE
// ==========================================
import { SEED_BLOG_POSTS, BlogPost } from './src/data/seedBlogPosts.js';

let localBlogPosts: BlogPost[] = JSON.parse(JSON.stringify(SEED_BLOG_POSTS));

export async function getBlogPostsFromDb(category?: string, search?: string): Promise<BlogPost[]> {
  try {
    if (!checkDbActive()) {
      let filtered = localBlogPosts.filter(p => p.isPublished);
      if (category && category !== 'Tümü' && category !== 'all') {
        filtered = filtered.filter(p => p.category.toLowerCase().includes(category.toLowerCase()));
      }
      if (search) {
        const q = search.toLowerCase();
        filtered = filtered.filter(p => p.title.toLowerCase().includes(q) || p.summary.toLowerCase().includes(q) || p.tags.some(t => t.toLowerCase().includes(q)));
      }
      return filtered;
    }
    let query = `SELECT id, title, slug, summary, content, category, cover_image as "coverImage", author_name as "authorName", author_avatar as "authorAvatar", read_time_minutes as "readTimeMinutes", tags, hardware_slugs as "hardwareSlugs", is_published as "isPublished", created_at as "createdAt", updated_at as "updatedAt" FROM blog_posts WHERE is_published = TRUE`;
    const params: any[] = [];
    if (category && category !== 'Tümü' && category !== 'all') {
      params.push(`%${category}%`);
      query += ` AND category ILIKE $${params.length}`;
    }
    if (search) {
      params.push(`%${search}%`);
      query += ` AND (title ILIKE $${params.length} OR summary ILIKE $${params.length} OR content ILIKE $${params.length})`;
    }
    query += ` ORDER BY created_at DESC`;
    const res = await pool.query(query, params);
    if (res.rows.length === 0 && localBlogPosts.length > 0) return localBlogPosts;
    return res.rows;
  } catch {
    return localBlogPosts;
  }
}

export async function getBlogPostBySlugFromDb(slug: string): Promise<BlogPost | null> {
  const cleanSlug = slug.toLowerCase().trim();
  try {
    if (!checkDbActive()) {
      return localBlogPosts.find(p => p.slug === cleanSlug || p.id === cleanSlug) || localBlogPosts[0] || null;
    }
    const res = await pool.query(
      `SELECT id, title, slug, summary, content, category, cover_image as "coverImage", author_name as "authorName", author_avatar as "authorAvatar", read_time_minutes as "readTimeMinutes", tags, hardware_slugs as "hardwareSlugs", is_published as "isPublished", created_at as "createdAt", updated_at as "updatedAt" 
       FROM blog_posts WHERE slug = $1 OR id = $1`,
      [cleanSlug]
    );
    if (res.rows.length === 0) {
      return localBlogPosts.find(p => p.slug === cleanSlug || p.id === cleanSlug) || localBlogPosts[0] || null;
    }
    return res.rows[0];
  } catch {
    return localBlogPosts.find(p => p.slug === cleanSlug || p.id === cleanSlug) || localBlogPosts[0] || null;
  }
}

export async function createBlogPostInDb(post: Partial<BlogPost>): Promise<BlogPost> {
  const newPost: BlogPost = {
    id: post.id || `blog-${Date.now()}`,
    title: post.title || 'Yeni Blog Yazısı',
    slug: post.slug || `blog-${Date.now()}`,
    summary: post.summary || '',
    content: post.content || '',
    category: post.category || 'Rehber',
    coverImage: post.coverImage || 'https://images.unsplash.com/photo-1547082299-de196ea013d6?auto=format&fit=crop&w=1200&q=80',
    authorName: post.authorName || 'Setupss Üyesi',
    authorAvatar: post.authorAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&h=200&q=80',
    readTimeMinutes: post.readTimeMinutes || 5,
    tags: post.tags || [],
    hardwareSlugs: post.hardwareSlugs || [],
    isPublished: post.isPublished ?? true,
    likesCount: post.likesCount || 0,
    dislikesCount: post.dislikesCount || 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  localBlogPosts.unshift(newPost);

  try {
    if (checkDbActive()) {
      await pool.query(`
        INSERT INTO blog_posts (id, title, slug, summary, content, category, cover_image, author_name, author_avatar, read_time_minutes, tags, hardware_slugs, is_published, likes_count, dislikes_count, created_at, updated_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, NOW(), NOW())
        ON CONFLICT (slug) DO UPDATE SET
          title = EXCLUDED.title,
          summary = EXCLUDED.summary,
          content = EXCLUDED.content,
          cover_image = EXCLUDED.cover_image,
          updated_at = NOW();
      `, [
        newPost.id, newPost.title, newPost.slug, newPost.summary, newPost.content,
        newPost.category, newPost.coverImage, newPost.authorName, newPost.authorAvatar,
        newPost.readTimeMinutes, JSON.stringify(newPost.tags), JSON.stringify(newPost.hardwareSlugs),
        newPost.isPublished, newPost.likesCount, newPost.dislikesCount
      ]);
    }
  } catch (e) {
    console.error("Failed to insert blog post to DB:", e);
  }

  return newPost;
}

export async function voteBlogPostInDb(id: string, type: 'like' | 'dislike'): Promise<{ likesCount: number; dislikesCount: number }> {
  let target = localBlogPosts.find(p => p.id === id || p.slug === id);
  if (target) {
    if (type === 'like') {
      target.likesCount = (target.likesCount || 0) + 1;
    } else {
      target.dislikesCount = (target.dislikesCount || 0) + 1;
    }
  }

  try {
    if (checkDbActive()) {
      const col = type === 'like' ? 'likes_count' : 'dislikes_count';
      await pool.query(`
        UPDATE blog_posts 
        SET ${col} = COALESCE(${col}, 0) + 1 
        WHERE id = $1 OR slug = $1
      `, [id]);
      
      const res = await pool.query(
        `SELECT COALESCE(likes_count, 0) as "likesCount", COALESCE(dislikes_count, 0) as "dislikesCount" FROM blog_posts WHERE id = $1 OR slug = $1`,
        [id]
      );
      if (res.rows.length > 0) {
        return {
          likesCount: parseInt(res.rows[0].likesCount, 10),
          dislikesCount: parseInt(res.rows[0].dislikesCount, 10)
        };
      }
    }
  } catch (e) {
    console.error("Failed to vote blog post in DB:", e);
  }

  return {
    likesCount: target?.likesCount || (type === 'like' ? 1 : 0),
    dislikesCount: target?.dislikesCount || (type === 'dislike' ? 1 : 0)
  };
}








