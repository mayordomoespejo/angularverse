# AngularVerse

An interactive Angular 19 learning platform with a read-only code viewer, an AI tutor (Ngbot), and structured lesson panels. Covers 52 lessons across 11 modules from Angular fundamentals through SSR and production.

---

## Stack

| Layer | Technology |
|-------|------------|
| Framework | Angular 19 |
| State | Signals (`signal`, `computed`, `effect`) |
| Change detection | OnPush + Zoneless-ready |
| AI tutor | Groq API |
| Auth | Supabase Auth (OTP + Google OAuth) |
| Persistence | Supabase (user_progress, chat_history, RLS) |
| Routing | Angular Router (standalone, lazy) |
| Styling | Angular component styles (CSS nesting) |
| Fonts | Inter, JetBrains Mono |
| Build | Angular CLI 19 |

---

## Features

- Read-only code viewer — observe real Angular code per lesson without editing
- AI tutor sidebar (Ngbot) powered by Groq for contextual Q&A
- Lesson explain panel with narrative blocks: text, tips, warnings, and checkpoints
- Iframe-based preview panel showing what each Angular concept renders
- Lesson timeline bar tracking progress across modules
- XP and streak tracking persisted in Supabase
- Three view modes: default (3 panels), lesson fullscreen, zen mode (code only)
- Auth via email OTP (6-digit boxes) and Google OAuth
- User profile with avatar upload, level selector, and account deletion
- Shared `LogoIconComponent` with animated eyes across the app
- Mobile-first responsive layout: single-panel tabs, adapted headers and timeline

---

## Getting started

1. Clone the repository.
2. Install dependencies:
   ```bash
   npm install --legacy-peer-deps
   ```
3. Copy the environment template and fill in your credentials:
   ```bash
   cp src/environments/environment.example.ts src/environments/environment.ts
   ```
4. Start the dev server:
   ```bash
   npm start
   ```

---

## Environment variables

Set these in `src/environments/environment.ts`:

| Variable | Description |
|----------|-------------|
| `groqApiKey` | API key from console.groq.com (free, no billing required) |
| `supabaseUrl` | Supabase project URL |
| `supabaseAnonKey` | Supabase anon key (Settings → API) |

---

## Curriculum

| Module | Topic | Lessons |
|--------|-------|---------|
| M0 | Onboarding | 3 |
| M1 | Fundamentals | 5 |
| M2 | Components & Signals | 6 |
| M3 | Templates & Directives | 4 |
| M4 | Services & Dependency Injection | 6 |
| M5 | Routing & Navigation | 6 |
| M6 | Forms | 5 |
| M7 | HTTP & RxJS | 5 |
| M8 | Global State with Signals | 4 |
| M9 | Testing | 4 |
| M10 | SSR, Performance & Production | 4 |

---

## Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Start dev server |
| `npm run build` | Production build |

---

## License

MIT — see [LICENSE](LICENSE)
