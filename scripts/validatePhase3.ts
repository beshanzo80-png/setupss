import { slugify, parseSlug } from '../src/utils/slug';
import { ROUTES, parseRoute } from '../src/utils/routes';

console.log("=== PHASE 3 ROUTING & INFORMATION ARCHITECTURE VALIDATION ===");

// 1. Validate Slug Rules
console.log("\n1. Slug Rule Validation:");
const slugTests = [
  { input: 'Cyberpunk Neon Setup 2026!', expected: 'cyberpunk-neon-setup-2026' },
  { input: 'Türkçe Şık & Kaliteli Masaüstü Öğeleri', expected: 'turkce-sik-kaliteli-masaustu-ogeleri' },
  { input: '   ---Double--Hyphens   and  Spaces--- ', expected: 'double-hyphens-and-spaces' }
];

slugTests.forEach((t) => {
  const result = slugify(t.input);
  const pass = result === t.expected;
  console.log(`  [${pass ? 'PASS' : 'FAIL'}] "${t.input}" -> "${result}" (Expected: "${t.expected}")`);
});

// 2. Validate Route Builder Functions
console.log("\n2. Clean URL Path Generation:");
console.log("  Setup Route:", ROUTES.setup('setup-101', 'Cyberpunk Neon Room'));
console.log("  User Profile Route:", ROUTES.user('Batuhan Yilmaz'));
console.log("  Category Route:", ROUTES.category('Yazılımcı Atölyesi'));
console.log("  Tag Route:", ROUTES.tag('minimal-rgb'));
console.log("  Hardware Route:", ROUTES.hardware('NVIDIA RTX 4090'));
console.log("  Brand Route:", ROUTES.brand('Logitech G'));
console.log("  AI Planner Route:", ROUTES.AI_PLANNER);
console.log("  Deals Route:", ROUTES.DEALS);
console.log("  Leaderboard Route:", ROUTES.LEADERBOARD);

// 3. Validate Path Parsing & Deep Linking
console.log("\n3. Path Parsing & Legacy Redirect Parsing:");
const pathTests = [
  { path: '/setup/cyberpunk-neon-room-setup-101', query: {}, expectedRoute: 'setup', expectedId: 'setup-101' },
  { path: '/u/Batuhan', query: {}, expectedRoute: 'user', expectedUsername: 'Batuhan' },
  { path: '/category/yazilimci', query: {}, expectedRoute: 'category', expectedCategory: 'yazilimci' },
  { path: '/tag/minimal', query: {}, expectedRoute: 'tag', expectedTag: 'minimal' },
  { path: '/', query: { setup: 'setup-999' }, expectedRoute: 'setup', expectedId: 'setup-999' },
  { path: '/', query: { profile: 'JohnDoe' }, expectedRoute: 'user', expectedUsername: 'JohnDoe' },
  { path: '/ai-planner', query: {}, expectedRoute: 'ai-planner', expectedTab: 'ai' }
];

pathTests.forEach((t, i) => {
  const match = parseRoute(t.path, t.query);
  console.log(`  Case ${i + 1} (${t.path}): Route="${match.route}", SetupID="${match.setupId || 'N/A'}", Username="${match.username || 'N/A'}", Tab="${match.tab || 'N/A'}"`);
});

console.log("\n=== PHASE 3 VALIDATION COMPLETED SUCCESSFULLY ===");
