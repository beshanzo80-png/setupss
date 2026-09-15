# 05-Mobile: Cross-Platform Strategy & React Native Bridge

## Multi-Platform Vision
Setupss is built with a unified core mindset. While the initial web application runs on React/Vite, the architecture is specifically prepared for React Native / Native iOS & Android clients sharing the exact same backend API and database schemas.

---

## Architectural Principles
1. **Shared Business Logic**: Authentication, hardware lookup, AI validation, and setup parsing logic encapsulated in shared TypeScript modules.
2. **Platform-Specific Navigation**: Bottom tabs for mobile navigation mimicking the web app's streamlined single-view and modal patterns.
3. **Offline Resilience**: Local SQLite caching on mobile devices for offline hardware browsing and draft setup creation.
