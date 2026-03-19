# AngularVerse

An interactive Angular 19 learning platform with a read-only code viewer, an AI tutor (Ngbot), and structured lesson panels. Covers 52 lessons across 10 modules from Angular fundamentals through SSR and production.

## Features

- Read-only code viewer — observe real Angular code per lesson without editing
- AI tutor sidebar (Ngbot) powered by OpenRouter for contextual Q&A
- Lesson explain panel with narrative blocks: text, tips, warnings, and checkpoints
- Iframe-based preview panel showing what each Angular concept renders
- Lesson timeline bar tracking progress across modules
- XP and streak tracking persisted in Supabase via anonymous device_id pattern
- Three view modes: default (3 panels), lesson fullscreen, code fullscreen (zen mode)
- Keyboard shortcut `Ctrl+Shift+Z` to toggle zen mode

## Tech stack

| Layer | Library |
|---|---|
| Framework | Angular 19 |
| State | Signals (`signal`, `computed`, `effect`) |
| Change detection | OnPush + Zoneless-ready |
| AI tutor | OpenRouter API |
| Persistence | Supabase (anon device_id, RLS) |
| Routing | Angular Router (standalone, lazy) |
| Styling | Angular component styles (CSS nesting) |
| Fonts | Inter, JetBrains Mono |
| Build | Angular CLI 19 |

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

## Environment variables

Set these in `src/environments/environment.ts`:

| Variable | Description |
|----------|-------------|
| `openRouterApiKey` | API key from openrouter.ai |
| `supabaseUrl` | Supabase project URL |
| `supabaseAnonKey` | Supabase anon key (Settings → API) |

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

## Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Start dev server |
| `npm run build` | Production build |
