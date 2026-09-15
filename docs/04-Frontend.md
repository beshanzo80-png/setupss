# 04-Frontend: Component Architecture & State Management

## Core Framework & Routing
- **Framework**: React 18+ with Vite & TypeScript.
- **Styling**: Tailwind CSS with Neo-Brutalist design tokens (vibrant-yellow `#ffd93d`, vibrant-dark `#1a1a1a`, bold 2px-4px borders, hard offset shadows).
- **State Management**: React Context & Hooks for local UI state; server-state synchronization via REST/WebSocket hooks.

---

## Component Module Structure
- `/src/components/`
  - `Navbar.tsx`: Global navigation, quick search, notifications trigger, auth status.
  - `AppFooter.tsx`: Footer with platform links, branding, and creator attribution.
  - `AdminPanel.tsx`: Secure administrative control center, DB stats, and 30-bot fleet logs.
  - `AuthModal.tsx`: Authentication dialog for login/register with verification.
  - `SetupCard.tsx`: Reusable setup showcase card with interactive likes, comments, and hardware badges.
  - `SetupDetail.tsx`: Deep-dive modal/view for individual setups with AI bottleneck analysis.
  - `AiReferralAuditor.tsx`: AI referral & bot verification auditing panel.
