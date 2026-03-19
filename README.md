# AngularVerse

Plataforma interactiva para aprender Angular con un tutor AI, editor en vivo y lecciones progresivas.

## Stack

- **Angular 19** — Standalone components, Signals, OnPush, new control flow
- **Supabase** — Progreso del usuario persistente (anon device_id pattern)
- **OpenRouter** — AI tutor (Ngbot) con contexto de la lección actual
- **JetBrains Mono / Inter** — Tipografía

## Setup

```bash
# 1. Clona el repo
git clone https://github.com/TU_USUARIO/angularverse.git
cd angularverse

# 2. Instala dependencias
npm install --legacy-peer-deps

# 3. Configura las variables de entorno
cp src/environments/environment.example.ts src/environments/environment.ts
# Edita environment.ts con tus credenciales

# 4. Arranca el servidor de desarrollo
npm start
```

## Variables de entorno

Copia `src/environments/environment.example.ts` a `src/environments/environment.ts` y rellena:

| Variable | Descripción |
|----------|-------------|
| `openRouterApiKey` | API key de [OpenRouter](https://openrouter.ai) |
| `supabaseUrl` | URL de tu proyecto Supabase |
| `supabaseAnonKey` | Anon key de Supabase (Settings → API) |

## Estructura

```
src/app/
├── core/
│   ├── models/          # Interfaces TypeScript
│   └── services/        # LessonProgressService, SupabaseService, ChatService
├── data/lessons/        # Contenido del curriculum (M0–M10)
├── features/
│   ├── lesson/          # Shell + paneles (explain, code, preview, chat)
│   ├── timeline/        # Barra de progreso superior
│   └── welcome/         # Página de inicio
└── shared/
    └── components/      # ProgressNodeComponent, etc.
```

## Curriculum

| Módulo | Tema | Lecciones |
|--------|------|-----------|
| M0 | Onboarding | 3 |
| M1 | Fundamentos | 5 |
| M2 | Componentes y Signals | 6 |
| M3 | Templates y Directivas | 4 |
| M4 | Servicios e Inyección de Dependencias | 6 |
| M5 | Routing y Navegación | 6 |
| M6 | Formularios | 5 |
| M7 | HTTP y RxJS | 5 |
| M8 | Estado Global con Signals | 4 |
| M9 | Testing | 4 |
| M10 | SSR, Performance y Producción | 4 |

## License

MIT
