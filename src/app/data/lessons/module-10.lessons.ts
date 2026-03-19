import type { Lesson } from '../../core/models/lesson.model';

export const MODULE_10_LESSONS: Lesson[] = [
  {
    id: 'L10.1',
    module: 10,
    moduleTitle: 'SSR, Performance y Producción',
    title: 'Server-Side Rendering: Angular en el servidor',
    subtitle: 'SSR, hydration y TransferState para apps más rápidas y SEO-friendly',
    estimatedMinutes: 18,
    xpReward: 170,
    prerequisites: ['L9.4'],
    nextLesson: 'L10.2',
    language: 'typescript',
    narrative: [
      {
        type: 'text',
        content:
          'Por defecto, Angular genera una Single Page Application (SPA): el servidor envía un HTML casi vacío y el navegador descarga, parsea y ejecuta todo el JavaScript antes de mostrar algo. Esto penaliza el First Contentful Paint (FCP) y dificulta el SEO. Server-Side Rendering (SSR) invierte el orden: Angular corre en Node.js, genera el HTML completo en el servidor, y el navegador lo muestra de inmediato. Después, Angular "hidrata" la página — adjunta los event listeners al HTML ya visible.',
      },
      {
        type: 'tip',
        variant: 'info',
        content:
          'Añade SSR a una app existente con un solo comando: `ng add @angular/ssr`. Esto configura Express, ajusta el `app.config.ts` para incluir `provideServerRendering()`, y genera los archivos de servidor necesarios.',
      },
      {
        type: 'text',
        content:
          'El desafío de SSR es que el código corre en dos entornos: servidor (Node.js) y navegador. APIs como `localStorage`, `window` o `document` no existen en Node. Para detectar el entorno usa `isPlatformBrowser(PLATFORM_ID)` inyectado por DI. Para ejecutar código exclusivamente en el navegador tras el primer render, usa `afterNextRender()` — Angular garantiza que este callback nunca se ejecuta en el servidor.',
      },
      {
        type: 'tip',
        variant: 'angular',
        content:
          '`TransferState` evita el doble-fetch: si el servidor cargó los datos de la API, los serializa en el HTML y el cliente los lee directamente sin hacer otra petición HTTP. El resultado es una hidratación instantánea sin parpadeos ni peticiones duplicadas.',
      },
      {
        type: 'checkpoint',
        question: '¿Qué función garantiza que un bloque de código solo se ejecuta en el navegador, nunca en el servidor SSR?',
        options: [
          'isPlatformBrowser(PLATFORM_ID)',
          'afterNextRender()',
          'ngOnInit()',
          'provideServerRendering()',
        ],
        correct: 1,
        explanation:
          '`afterNextRender()` es un hook que Angular garantiza que solo se ejecuta en el navegador, después del primer render. `isPlatformBrowser()` es una comprobación de runtime útil dentro de lógica condicional, pero `afterNextRender()` es la forma declarativa y recomendada para código que no puede correr en el servidor.',
      },
    ],
    starterCode: `import {
  Component,
  OnInit,
  inject,
  signal,
  PLATFORM_ID,
  afterNextRender,
  ChangeDetectionStrategy,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { TransferState, makeStateKey } from '@angular/core';

// 📚 Biblioteca Angular — Server-Side Rendering
// SSR + Hydration + TransferState para datos sin doble-fetch

interface Libro {
  id: number;
  titulo: string;
  autor: string;
  genero: string;
}

// Clave tipada para TransferState
const LIBROS_KEY = makeStateKey<Libro[]>('libros-destacados');

@Component({
  selector: 'app-biblioteca-ssr',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: \`
    <div class="biblioteca-ssr">
      <header class="ssr-header">
        <h2>Biblioteca — SSR Edition</h2>
        <span class="env-badge" [class.browser]="esBrowser()">
          {{ esBrowser() ? 'Navegador' : 'Servidor' }}
        </span>
      </header>

      @if (cargando()) {
        <div class="skeleton-list">
          @for (_ of [1,2,3]; track $index) {
            <div class="skeleton-item"></div>
          }
        </div>
      } @else {
        <ul class="lista-libros">
          @for (libro of libros(); track libro.id) {
            <li class="libro-row">
              <span class="libro-titulo">{{ libro.titulo }}</span>
              <span class="libro-autor">{{ libro.autor }}</span>
              <span class="genero-badge">{{ libro.genero }}</span>
            </li>
          }
        </ul>
      }

      <footer class="ssr-footer">
        <span class="transfer-note">
          Datos via TransferState — sin doble-fetch al hidratar
        </span>
      </footer>
    </div>
  \`,
})
export class BibliotecaSsrComponent implements OnInit {
  private readonly http = inject(HttpClient);
  private readonly transferState = inject(TransferState);
  private readonly platformId = inject(PLATFORM_ID);

  readonly esBrowser = signal(false);
  readonly cargando = signal(true);
  readonly libros = signal<Libro[]>([]);

  // Datos de ejemplo (en prod vendrían de una API real)
  private readonly datosEjemplo: Libro[] = [
    { id: 1, titulo: 'Clean Code', autor: 'Robert C. Martin', genero: 'Programación' },
    { id: 2, titulo: 'The Pragmatic Programmer', autor: 'Hunt & Thomas', genero: 'Programación' },
    { id: 3, titulo: 'Design Patterns', autor: 'Gang of Four', genero: 'Arquitectura' },
  ];

  constructor() {
    // afterNextRender() — solo en el navegador, nunca en Node/SSR
    afterNextRender(() => {
      this.esBrowser.set(true);
    });
  }

  ngOnInit(): void {
    // Intenta leer del TransferState primero (cliente)
    const datosTransferidos = this.transferState.get(LIBROS_KEY, null);

    if (datosTransferidos) {
      // El servidor ya cargó los datos — usarlos directamente
      this.libros.set(datosTransferidos);
      this.cargando.set(false);
      this.transferState.remove(LIBROS_KEY);
      return;
    }

    // Sin TransferState: cargar (servidor o primera carga cliente)
    this.cargarLibros();
  }

  private cargarLibros(): void {
    // Simulamos latencia de API
    setTimeout(() => {
      const datos = this.datosEjemplo;

      // En el servidor: persiste los datos para que el cliente los recoja
      if (!isPlatformBrowser(this.platformId)) {
        this.transferState.set(LIBROS_KEY, datos);
      }

      this.libros.set(datos);
      this.cargando.set(false);
    }, 600);
  }
}
`,
    solutionCode: '',
    previewHtml: `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Inter', sans-serif; background: #0D1117; color: #E6EDF3; min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 2rem; }
    .component-label { position: fixed; top: 12px; right: 12px; font-family: 'JetBrains Mono', monospace; font-size: 0.625rem; color: #8B949E; background: #161B22; border: 1px solid #30363D; padding: 0.2em 0.5em; border-radius: 4px; }
    .biblioteca-ssr { background: #161B22; border: 1px solid #30363D; border-radius: 12px; overflow: hidden; width: 100%; max-width: 480px; }
    .ssr-header { display: flex; align-items: center; justify-content: space-between; padding: 1.25rem 1.5rem; border-bottom: 1px solid #30363D; background: #0D1117; }
    .ssr-header h2 { font-size: 1rem; font-weight: 600; }
    .env-badge { font-size: 0.72rem; font-weight: 600; padding: 0.25em 0.7em; border-radius: 20px; border: 1px solid #30363D; color: #8B949E; background: #21262D; transition: all 400ms; }
    .env-badge.browser { color: #34d399; border-color: rgba(52,211,153,0.4); background: rgba(52,211,153,0.08); }
    .timeline { padding: 1.5rem; display: flex; flex-direction: column; gap: 0; }
    .timeline-row { display: flex; align-items: flex-start; gap: 0.875rem; padding-bottom: 1.25rem; position: relative; }
    .timeline-row:not(:last-child)::after { content: ''; position: absolute; left: 15px; top: 32px; bottom: 0; width: 2px; background: #30363D; }
    .timeline-icon { width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 0.875rem; flex-shrink: 0; border: 2px solid transparent; transition: all 300ms; }
    .timeline-icon.server { background: rgba(139,92,246,0.12); border-color: rgba(139,92,246,0.4); color: #a78bfa; }
    .timeline-icon.transfer { background: rgba(251,191,36,0.1); border-color: rgba(251,191,36,0.35); color: #fbbf24; }
    .timeline-icon.hydrate { background: rgba(52,211,153,0.1); border-color: rgba(52,211,153,0.35); color: #34d399; }
    .timeline-icon.done { background: rgba(34,197,94,0.1); border-color: rgba(34,197,94,0.35); color: #22c55e; }
    .timeline-body { flex: 1; padding-top: 0.35rem; }
    .timeline-label { font-size: 0.82rem; font-weight: 600; color: #E6EDF3; margin-bottom: 0.15rem; }
    .timeline-desc { font-size: 0.75rem; color: #8B949E; line-height: 1.5; }
    .timeline-time { font-family: 'JetBrains Mono', monospace; font-size: 0.7rem; color: #8B5CF6; }
    .pending .timeline-icon { opacity: 0.35; }
    .pending .timeline-label { color: #8B949E; }
    .lista-preview { padding: 0 1.5rem 1rem; }
    .libro-row { display: flex; align-items: center; gap: 0.75rem; padding: 0.7rem 1rem; border-radius: 8px; background: #21262D; border: 1px solid #30363D; margin-bottom: 0.5rem; }
    .libro-titulo { font-size: 0.85rem; font-weight: 600; flex: 1; }
    .libro-autor { font-size: 0.75rem; color: #8B949E; }
    .genero-badge { font-size: 0.68rem; color: #a78bfa; background: rgba(139,92,246,0.1); border: 1px solid rgba(139,92,246,0.25); padding: 0.15em 0.5em; border-radius: 4px; white-space: nowrap; }
    .ssr-footer { padding: 0.875rem 1.5rem; border-top: 1px solid #21262D; background: #0D1117; }
    .transfer-note { font-size: 0.72rem; color: #8B949E; font-family: 'JetBrains Mono', monospace; }
    .skeleton-item { height: 44px; border-radius: 8px; background: linear-gradient(90deg, #21262D 25%, #30363D 50%, #21262D 75%); background-size: 200% 100%; animation: shimmer 1.4s infinite; margin-bottom: 0.5rem; }
    @keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }
    .hidden { display: none; }
  </style>
</head>
<body>
  <span class="component-label">app-biblioteca-ssr</span>
  <div class="biblioteca-ssr">
    <div class="ssr-header">
      <h2>Biblioteca — SSR Edition</h2>
      <span class="env-badge" id="env-badge">Servidor</span>
    </div>

    <div class="timeline" id="timeline">
      <div class="timeline-row" id="step-server">
        <div class="timeline-icon server">S</div>
        <div class="timeline-body">
          <div class="timeline-label">Render en servidor</div>
          <div class="timeline-desc">Node.js genera HTML completo con datos</div>
          <div class="timeline-time" id="t1">t=0ms</div>
        </div>
      </div>
      <div class="timeline-row pending" id="step-transfer">
        <div class="timeline-icon transfer">T</div>
        <div class="timeline-body">
          <div class="timeline-label">TransferState serializado</div>
          <div class="timeline-desc">Datos incrustados en el HTML — sin doble-fetch</div>
          <div class="timeline-time" id="t2">esperando...</div>
        </div>
      </div>
      <div class="timeline-row pending" id="step-hydrate">
        <div class="timeline-icon hydrate">H</div>
        <div class="timeline-body">
          <div class="timeline-label">Hydration</div>
          <div class="timeline-desc">Angular adjunta eventos al HTML existente</div>
          <div class="timeline-time" id="t3">esperando...</div>
        </div>
      </div>
      <div class="timeline-row pending" id="step-done">
        <div class="timeline-icon done">✓</div>
        <div class="timeline-body">
          <div class="timeline-label">App interactiva</div>
          <div class="timeline-desc">FCP alcanzado — el usuario ya puede interactuar</div>
          <div class="timeline-time" id="t4">esperando...</div>
        </div>
      </div>
    </div>

    <div class="lista-preview hidden" id="lista">
      <div class="libro-row"><span class="libro-titulo">Clean Code</span><span class="libro-autor">Robert C. Martin</span><span class="genero-badge">Programación</span></div>
      <div class="libro-row"><span class="libro-titulo">The Pragmatic Programmer</span><span class="libro-autor">Hunt &amp; Thomas</span><span class="genero-badge">Programación</span></div>
      <div class="libro-row"><span class="libro-titulo">Design Patterns</span><span class="libro-autor">Gang of Four</span><span class="genero-badge">Arquitectura</span></div>
    </div>

    <div class="ssr-footer">
      <span class="transfer-note" id="footer-note">Render en progreso...</span>
    </div>
  </div>

  <script>
    const steps = ['step-transfer', 'step-hydrate', 'step-done'];
    const times = ['t2', 't3', 't4'];
    const delays = [400, 900, 1400];
    const labels = ['t=120ms', 't=380ms', 't=420ms'];

    delays.forEach((d, i) => {
      setTimeout(() => {
        document.getElementById(steps[i]).classList.remove('pending');
        document.getElementById(times[i]).textContent = labels[i];
        if (i === 2) {
          document.getElementById('lista').classList.remove('hidden');
          document.getElementById('timeline').style.display = 'none';
          document.getElementById('env-badge').classList.add('browser');
          document.getElementById('env-badge').textContent = 'Navegador';
          document.getElementById('footer-note').textContent = 'Datos via TransferState — sin doble-fetch al hidratar';
        }
      }, d);
    });
  </script>
</body>
</html>`,
    aiContext:
      'El usuario está aprendiendo SSR en Angular 19/20. Ha visto cómo funciona el pipeline de render servidor → TransferState → hydration, cómo usar isPlatformBrowser, afterNextRender, y el peligro de acceder a APIs de browser en el servidor. Puede preguntar sobre diferencias CSR vs SSR, cómo depurar problemas de hydration, qué es partial hydration, o cómo funciona ng add @angular/ssr.',
    introMessage:
      'Esta lección introduce el Server-Side Rendering en Angular: el servidor genera el HTML completo, el navegador lo muestra de inmediato y Angular lo hidrata.\n\nEl código muestra el patrón completo: `TransferState` para evitar doble-fetch, `afterNextRender()` para código solo de navegador, e `isPlatformBrowser()` para lógica condicional.\n\nSi tienes dudas sobre SSR, hydration, o cómo evitar errores de "window is not defined", pregúntame.',
    suggestedQuestions: [
      '¿Qué pasa si accedo a localStorage sin comprobar isPlatformBrowser?',
      '¿Cuál es la diferencia entre afterNextRender y afterRender?',
      '¿TransferState funciona con cualquier fuente de datos o solo con HttpClient?',
    ],
  },

  {
    id: 'L10.2',
    module: 10,
    moduleTitle: 'SSR, Performance y Producción',
    title: '@defer avanzado: carga diferida inteligente',
    subtitle: 'Todos los triggers, prefetch y timing para optimizar el bundle inicial',
    estimatedMinutes: 16,
    xpReward: 160,
    prerequisites: ['L10.1'],
    nextLesson: 'L10.3',
    language: 'typescript',
    narrative: [
      {
        type: 'text',
        content:
          '`@defer` divide tu aplicación en chunks lazy que se cargan solo cuando son necesarios. La clave está en elegir el trigger correcto: `on idle` carga cuando el browser está desocupado (ideal para widgets no críticos), `on viewport` espera a que el elemento entre en pantalla (perfecto para contenido below the fold), `on interaction` espera el primer click o focus (para paneles que el usuario puede no abrir nunca), e `on hover` reacciona al mouseover.',
      },
      {
        type: 'tip',
        variant: 'info',
        content:
          '`prefetch on idle` es una combinación poderosa: muestra el `@placeholder` inmediatamente, pero en segundo plano descarga el chunk lazy mientras el browser está libre. Cuando el trigger real se dispara (por ejemplo, `on viewport`), la carga ya está lista — latencia cero para el usuario.',
      },
      {
        type: 'text',
        content:
          'Los bloques `@loading`, `@placeholder` y `@error` controlan los estados visuales. `@loading(minimum 500ms; after 100ms)` es especialmente útil: `after 100ms` evita que el spinner aparezca para cargas rápidas (menor de 100ms), y `minimum 500ms` evita el flash de contenido si la carga termina muy rápido. El bloque `@error` captura fallos en la carga del chunk lazy.',
      },
      {
        type: 'tip',
        variant: 'angular',
        content:
          'Puedes combinar múltiples triggers: `@defer (on viewport; on timer(5s))` carga cuando el elemento entra en pantalla O cuando pasan 5 segundos — lo que ocurra primero. `when miSignal()` usa una expresión reactiva como trigger y se dispara en cuanto la expresión es truthy.',
      },
      {
        type: 'checkpoint',
        question: '¿Qué combinación de @defer usarías para mostrar un widget de recomendaciones: empezar a descargarlo en background pero mostrarlo solo cuando entre en el viewport?',
        options: [
          '@defer (on viewport)',
          '@defer (on idle)',
          '@defer (on viewport; prefetch on idle)',
          '@defer (when true)',
        ],
        correct: 2,
        explanation:
          '`@defer (on viewport; prefetch on idle)` es la combinación ideal: `prefetch on idle` descarga el chunk lazy en background cuando el browser está libre, y `on viewport` es el trigger real que muestra el contenido. Cuando el usuario llega al widget, la descarga ya está lista — experiencia instantánea.',
      },
    ],
    starterCode: `import { Component, signal, ChangeDetectionStrategy } from '@angular/core';

// 📚 Biblioteca Angular — @defer avanzado
// Múltiples triggers para carga diferida inteligente

// Componente diferido: estadísticas (carga on idle)
@Component({
  selector: 'app-estadisticas-biblioteca',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: \`
    <div class="stats-panel">
      <h4>Estadísticas de lectura</h4>
      <div class="stats-grid">
        <div class="stat-item"><span class="val">127</span><span class="lbl">Libros leídos</span></div>
        <div class="stat-item"><span class="val">34</span><span class="lbl">Este año</span></div>
        <div class="stat-item"><span class="val">12h</span><span class="lbl">Media semanal</span></div>
        <div class="stat-item"><span class="val">4.2★</span><span class="lbl">Calificación media</span></div>
      </div>
    </div>
  \`,
})
export class EstadisticasBibliotecaComponent {}

// Componente diferido: recomendaciones (carga on viewport)
@Component({
  selector: 'app-recomendaciones',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: \`
    <div class="recom-panel">
      <h4>Recomendaciones para ti</h4>
      <div class="recom-lista">
        @for (libro of libros; track libro) {
          <div class="recom-item">{{ libro }}</div>
        }
      </div>
    </div>
  \`,
})
export class RecomendacionesComponent {
  libros = ['The Clean Coder', 'A Philosophy of Software Design', 'Working Effectively with Legacy Code'];
}

// Componente diferido: detalle expandido (carga on interaction)
@Component({
  selector: 'app-detalle-expandido',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: \`
    <div class="detalle-panel">
      <h4>Detalles del libro</h4>
      <p>ISBN: 978-0-13-235088-4</p>
      <p>Editorial: Prentice Hall · 1ra edición</p>
      <p>Páginas: 431 · Idioma: Inglés</p>
    </div>
  \`,
})
export class DetalleExpandidoComponent {}

// ── Componente principal con los tres patrones @defer ─────────
@Component({
  selector: 'app-biblioteca-defer',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [EstadisticasBibliotecaComponent, RecomendacionesComponent, DetalleExpandidoComponent],
  template: \`
    <div class="biblioteca-defer">
      <h2>Mi Biblioteca</h2>

      <!-- ① on idle: carga cuando el browser está libre -->
      @defer (on idle) {
        <app-estadisticas-biblioteca />
      } @loading (minimum 500ms; after 100ms) {
        <div class="skeleton-panel">Cargando estadísticas...</div>
      } @placeholder {
        <div class="placeholder-panel">Estadísticas de lectura</div>
      }

      <!-- ② on viewport + prefetch on idle: prerga en background, muestra al entrar -->
      @defer (on viewport; prefetch on idle) {
        <app-recomendaciones />
      } @loading (minimum 500ms; after 100ms) {
        <div class="skeleton-panel">Cargando recomendaciones...</div>
      } @placeholder {
        <div class="placeholder-panel">Recomendaciones personalizadas</div>
      } @error {
        <div class="error-panel">No se pudieron cargar las recomendaciones.</div>
      }

      <!-- ③ on interaction: carga solo si el usuario expande -->
      <button class="expand-btn" #expandBtn>Ver detalles del libro</button>
      @defer (on interaction(expandBtn)) {
        <app-detalle-expandido />
      } @placeholder {
        <div class="placeholder-panel">Haz clic para ver los detalles</div>
      }
    </div>
  \`,
})
export class BibliotecaDeferComponent {}
`,
    solutionCode: '',
    previewHtml: `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Inter', sans-serif; background: #0D1117; color: #E6EDF3; min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 2rem; }
    .component-label { position: fixed; top: 12px; right: 12px; font-family: 'JetBrains Mono', monospace; font-size: 0.625rem; color: #8B949E; background: #161B22; border: 1px solid #30363D; padding: 0.2em 0.5em; border-radius: 4px; }
    button { cursor: pointer; font-family: 'Inter', sans-serif; }
    .biblioteca-defer { background: #161B22; border: 1px solid #30363D; border-radius: 12px; padding: 1.5rem; width: 100%; max-width: 480px; display: flex; flex-direction: column; gap: 1rem; }
    h2 { font-size: 1.05rem; font-weight: 700; margin-bottom: 0.25rem; }
    .defer-block { border: 1px dashed #30363D; border-radius: 8px; overflow: hidden; transition: border-color 300ms; }
    .defer-block.loaded { border-style: solid; border-color: #30363D; }
    .block-header { display: flex; align-items: center; justify-content: space-between; padding: 0.5rem 0.875rem; background: #0D1117; border-bottom: 1px solid #21262D; }
    .trigger-badge { font-family: 'JetBrains Mono', monospace; font-size: 0.65rem; padding: 0.15em 0.5em; border-radius: 4px; font-weight: 600; }
    .trigger-badge.idle { background: rgba(139,92,246,0.15); color: #a78bfa; border: 1px solid rgba(139,92,246,0.3); }
    .trigger-badge.viewport { background: rgba(59,130,246,0.12); color: #60a5fa; border: 1px solid rgba(59,130,246,0.3); }
    .trigger-badge.interaction { background: rgba(245,158,11,0.12); color: #fbbf24; border: 1px solid rgba(245,158,11,0.3); }
    .status-dot { width: 8px; height: 8px; border-radius: 50%; background: #30363D; transition: background 300ms; }
    .status-dot.loading { background: #fbbf24; animation: pulse 700ms infinite alternate; }
    .status-dot.loaded { background: #22c55e; }
    @keyframes pulse { from { opacity: 0.4; } to { opacity: 1; } }
    .block-body { padding: 0.875rem 1rem; min-height: 52px; }
    .placeholder-text { font-size: 0.8rem; color: #8B949E; }
    .stats-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem; }
    .stat-item { background: #21262D; border-radius: 6px; padding: 0.6rem 0.75rem; }
    .stat-item .val { display: block; font-size: 1.2rem; font-weight: 700; color: #a78bfa; }
    .stat-item .lbl { font-size: 0.7rem; color: #8B949E; }
    .recom-list { display: flex; flex-direction: column; gap: 0.4rem; }
    .recom-item { background: #21262D; border-radius: 6px; padding: 0.5rem 0.75rem; font-size: 0.82rem; color: #E6EDF3; }
    .detalle-list { display: flex; flex-direction: column; gap: 0.35rem; }
    .detalle-list p { font-size: 0.82rem; color: #8B949E; }
    .expand-btn { background: transparent; border: 1px solid #30363D; color: #8B5CF6; border-radius: 6px; padding: 0.5rem 1rem; font-size: 0.82rem; font-weight: 500; width: 100%; transition: all 150ms; }
    .expand-btn:hover { border-color: #8B5CF6; background: rgba(139,92,246,0.06); }
    .skeleton-anim { height: 80px; border-radius: 6px; background: linear-gradient(90deg, #21262D 25%, #30363D 50%, #21262D 75%); background-size: 200% 100%; animation: shimmer 1.2s infinite; }
    @keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }
    h4 { font-size: 0.82rem; font-weight: 600; color: #8B949E; margin-bottom: 0.6rem; text-transform: uppercase; letter-spacing: 0.04em; }
  </style>
</head>
<body>
  <span class="component-label">app-biblioteca-defer</span>
  <div class="biblioteca-defer">
    <h2>Mi Biblioteca</h2>

    <!-- Block 1: on idle -->
    <div class="defer-block" id="block1">
      <div class="block-header">
        <span class="trigger-badge idle">on idle</span>
        <div class="status-dot loading" id="dot1"></div>
      </div>
      <div class="block-body" id="body1">
        <div class="skeleton-anim"></div>
      </div>
    </div>

    <!-- Block 2: on viewport -->
    <div class="defer-block" id="block2">
      <div class="block-header">
        <span class="trigger-badge viewport">on viewport + prefetch on idle</span>
        <div class="status-dot" id="dot2"></div>
      </div>
      <div class="block-body" id="body2">
        <p class="placeholder-text">Recomendaciones personalizadas</p>
      </div>
    </div>

    <!-- Block 3: on interaction -->
    <button class="expand-btn" id="expand-btn">Ver detalles del libro</button>
    <div class="defer-block" id="block3" style="display:none">
      <div class="block-header">
        <span class="trigger-badge interaction">on interaction</span>
        <div class="status-dot loading" id="dot3"></div>
      </div>
      <div class="block-body" id="body3">
        <div class="skeleton-anim"></div>
      </div>
    </div>
  </div>

  <script>
    // Block 1: simulates on idle (loads after short delay)
    setTimeout(() => {
      document.getElementById('dot1').className = 'status-dot loaded';
      document.getElementById('block1').classList.add('loaded');
      document.getElementById('body1').innerHTML = '<h4>Estadísticas de lectura</h4><div class="stats-grid"><div class="stat-item"><span class="val">127</span><span class="lbl">Libros leídos</span></div><div class="stat-item"><span class="val">34</span><span class="lbl">Este año</span></div><div class="stat-item"><span class="val">12h</span><span class="lbl">Media semanal</span></div><div class="stat-item"><span class="val">4.2★</span><span class="lbl">Calificación media</span></div></div>';
    }, 900);

    // Block 2: simulates prefetch in background, then loads
    setTimeout(() => {
      document.getElementById('dot2').className = 'status-dot loading';
    }, 600);
    setTimeout(() => {
      document.getElementById('dot2').className = 'status-dot loaded';
      document.getElementById('block2').classList.add('loaded');
      document.getElementById('body2').innerHTML = '<h4>Recomendaciones para ti</h4><div class="recom-list"><div class="recom-item">The Clean Coder</div><div class="recom-item">A Philosophy of Software Design</div><div class="recom-item">Working Effectively with Legacy Code</div></div>';
    }, 1800);

    // Block 3: on interaction
    document.getElementById('expand-btn').addEventListener('click', () => {
      document.getElementById('block3').style.display = 'block';
      setTimeout(() => {
        document.getElementById('dot3').className = 'status-dot loaded';
        document.getElementById('block3').classList.add('loaded');
        document.getElementById('body3').innerHTML = '<h4>Detalles del libro</h4><div class="detalle-list"><p>ISBN: 978-0-13-235088-4</p><p>Editorial: Prentice Hall · 1ra edición</p><p>Páginas: 431 · Idioma: Inglés</p></div>';
        document.getElementById('expand-btn').style.display = 'none';
      }, 500);
    });
  </script>
</body>
</html>`,
    aiContext:
      'El usuario está aprendiendo @defer avanzado en Angular 19/20. Ha visto todos los triggers (idle, viewport, interaction, hover, timer, when), prefetch on idle, y los bloques @loading/@placeholder/@error con timing. Puede preguntar sobre cuándo elegir cada trigger, cómo combinarlos, cómo @defer interactúa con SSR, o cómo depurar chunks lazy que fallan.',
    introMessage:
      'Esta lección explora todos los triggers de `@defer` para controlar cuándo se descarga cada chunk de tu aplicación.\n\nEl código muestra tres patrones: `on idle` para estadísticas no críticas, `on viewport + prefetch on idle` para recomendaciones below the fold, y `on interaction` para paneles que el usuario quizás no abra nunca.\n\nPregúntame sobre triggers, prefetch, el bloque @error, o cómo @defer afecta al bundle final.',
    suggestedQuestions: [
      '¿Cómo afecta @defer al tamaño del bundle inicial?',
      '¿Se puede usar @defer dentro de @for o @if?',
      '¿Qué pasa con @defer cuando usamos SSR — el servidor lo renderiza o no?',
    ],
  },

  {
    id: 'L10.3',
    module: 10,
    moduleTitle: 'SSR, Performance y Producción',
    title: 'NgOptimizedImage y assets optimizados',
    subtitle: 'LCP, lazy loading automático y placeholders con la directiva oficial',
    estimatedMinutes: 14,
    xpReward: 150,
    prerequisites: ['L10.2'],
    nextLesson: 'L10.4',
    language: 'typescript',
    narrative: [
      {
        type: 'text',
        content:
          'Las imágenes son el mayor culpable de un Largest Contentful Paint (LCP) lento. `NgOptimizedImage` es la directiva oficial de Angular que reemplaza `<img src>` por `<img ngSrc>`. Automáticamente añade `loading="lazy"` a todas las imágenes no críticas, genera `srcset` para múltiples resoluciones, y fuerza que declares `width` y `height` para evitar Cumulative Layout Shift (CLS).',
      },
      {
        type: 'tip',
        variant: 'info',
        content:
          'El atributo `priority` es crucial: marca la imagen como imagen LCP, añade `fetchpriority="high"` y `preload` al `<head>`. Úsalo en la imagen hero o la primera imagen visible above the fold. Solo una o dos imágenes por página deberían tener `priority`.',
      },
      {
        type: 'text',
        content:
          'El modo `fill` elimina la necesidad de `width` y `height` cuando la imagen debe ocupar 100% de su contenedor. Combínalo con `object-fit: cover` en CSS. Para imágenes de fondo responsivas en contenedores de aspect-ratio desconocido, `fill` es la solución correcta. Los image loaders (Cloudinary, Imgix, etc.) se configuran una vez en el provider y automáticamente generan las URLs optimizadas para cada tamaño.',
      },
      {
        type: 'tip',
        variant: 'angular',
        content:
          'Si el src de tu imagen es dinámico (viene de un signal o una variable), usa property binding: `[ngSrc]="libro.portadaUrl"`. NgOptimizedImage admite URLs absolutas y relativas; para URLs absolutas necesitas registrar el dominio en `provideImgixLoader` o usar `withConfig`.',
      },
      {
        type: 'checkpoint',
        question: '¿Qué atributo debes añadir a la imagen principal (hero) de la página para optimizar el LCP?',
        options: ['loading="eager"', 'fetchpriority="high"', 'priority', 'preload'],
        correct: 2,
        explanation:
          'El atributo `priority` de NgOptimizedImage se encarga automáticamente de todo: añade `fetchpriority="high"`, genera un `<link rel="preload">` en el head, y elimina el lazy loading de esa imagen. Es un atributo de la directiva Angular, no del HTML estándar — y es la forma recomendada para señalar la imagen LCP.',
      },
    ],
    starterCode: `import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';

// 📚 Biblioteca Angular — NgOptimizedImage
// Imágenes optimizadas: LCP, lazy loading, CLS prevention

interface Libro {
  id: number;
  titulo: string;
  autor: string;
  portada: string;  // URL de la imagen de portada
  esHero: boolean;  // true para la imagen LCP/hero
}

@Component({
  selector: 'app-biblioteca-imagenes',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgOptimizedImage],
  template: \`
    <div class="biblioteca-imagenes">
      <section class="hero-section">
        <h2>Destacado del mes</h2>

        <!-- ✅ priority: imagen LCP — carga con alta prioridad -->
        <!-- width y height requeridos: previenen CLS -->
        <div class="hero-portada">
          <img
            ngSrc="/assets/portadas/clean-code.jpg"
            alt="Clean Code — Robert C. Martin"
            width="300"
            height="400"
            priority
          />
          <div class="hero-info">
            <h3>Clean Code</h3>
            <p>Robert C. Martin</p>
            <span class="badge-lcp">LCP Image · priority</span>
          </div>
        </div>
      </section>

      <section class="grid-section">
        <h3>Colección</h3>
        <div class="libros-grid">
          @for (libro of libros(); track libro.id) {
            <div class="libro-card">

              <!-- Sin priority: lazy loading automático -->
              <img
                [ngSrc]="libro.portada"
                [alt]="libro.titulo"
                width="120"
                height="160"
              />
              <div class="libro-info">
                <span class="titulo">{{ libro.titulo }}</span>
                <span class="autor">{{ libro.autor }}</span>
              </div>
            </div>
          }
        </div>
      </section>

      <section class="fill-section">
        <h3>Banner de la semana</h3>
        <!-- fill mode: ocupa el 100% del contenedor, sin width/height fijo -->
        <div class="banner-container">
          <img
            ngSrc="/assets/banners/semana.jpg"
            alt="Banner semanal de la biblioteca"
            fill
            style="object-fit: cover;"
          />
          <div class="banner-overlay">
            <span>Semana de arquitectura de software</span>
          </div>
        </div>
      </section>
    </div>
  \`,
})
export class BibliotecaImagenesComponent {
  readonly libros = signal<Libro[]>([
    { id: 1, titulo: 'The Pragmatic Programmer', autor: 'Hunt & Thomas', portada: '/assets/portadas/pragmatic.jpg', esHero: false },
    { id: 2, titulo: 'Design Patterns', autor: 'Gang of Four', portada: '/assets/portadas/gof.jpg', esHero: false },
    { id: 3, titulo: 'Clean Architecture', autor: 'Robert C. Martin', portada: '/assets/portadas/clean-arch.jpg', esHero: false },
    { id: 4, titulo: 'Refactoring', autor: 'Martin Fowler', portada: '/assets/portadas/refactoring.jpg', esHero: false },
  ]);
}
`,
    solutionCode: '',
    previewHtml: `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Inter', sans-serif; background: #0D1117; color: #E6EDF3; min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 2rem; }
    .component-label { position: fixed; top: 12px; right: 12px; font-family: 'JetBrains Mono', monospace; font-size: 0.625rem; color: #8B949E; background: #161B22; border: 1px solid #30363D; padding: 0.2em 0.5em; border-radius: 4px; }
    .biblioteca-imagenes { width: 100%; max-width: 500px; display: flex; flex-direction: column; gap: 1.5rem; }
    h2 { font-size: 1.05rem; font-weight: 700; }
    h3 { font-size: 0.9rem; font-weight: 600; color: #8B949E; margin-bottom: 0.875rem; text-transform: uppercase; letter-spacing: 0.04em; }
    .hero-section { background: #161B22; border: 1px solid #30363D; border-radius: 12px; padding: 1.25rem; }
    .hero-section h2 { margin-bottom: 1rem; }
    .hero-portada { display: flex; gap: 1.25rem; align-items: center; }
    .img-mock { border-radius: 8px; flex-shrink: 0; display: flex; align-items: center; justify-content: center; font-size: 0.65rem; color: #8B949E; font-family: 'JetBrains Mono', monospace; text-align: center; border: 1px solid #30363D; }
    .img-hero { width: 90px; height: 120px; background: linear-gradient(135deg, #1e1b4b, #312e81); }
    .img-hero.loaded { background: linear-gradient(135deg, #4c1d95, #7c3aed); border-color: #7c3aed; }
    .hero-info h3 { font-size: 1rem; font-weight: 700; color: #E6EDF3; margin-bottom: 0.25rem; text-transform: none; letter-spacing: 0; }
    .hero-info p { font-size: 0.82rem; color: #8B949E; margin-bottom: 0.6rem; }
    .badge-lcp { font-family: 'JetBrains Mono', monospace; font-size: 0.65rem; background: rgba(251,191,36,0.12); color: #fbbf24; border: 1px solid rgba(251,191,36,0.3); padding: 0.2em 0.5em; border-radius: 4px; }
    .badge-lazy { font-family: 'JetBrains Mono', monospace; font-size: 0.6rem; background: rgba(100,116,139,0.12); color: #94a3b8; border: 1px solid rgba(100,116,139,0.2); padding: 0.15em 0.4em; border-radius: 4px; }
    .load-indicator { font-size: 0.65rem; margin-top: 0.3rem; display: flex; align-items: center; gap: 0.3rem; color: #8B949E; }
    .load-dot { width: 6px; height: 6px; border-radius: 50%; background: #30363D; transition: background 300ms; }
    .load-dot.eager { background: #fbbf24; }
    .load-dot.lazy { background: #30363D; }
    .load-dot.loaded { background: #22c55e; }
    .grid-section { background: #161B22; border: 1px solid #30363D; border-radius: 12px; padding: 1.25rem; }
    .libros-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 0.75rem; }
    .libro-card { display: flex; flex-direction: column; gap: 0.4rem; }
    .img-lazy { width: 100%; aspect-ratio: 3/4; background: linear-gradient(135deg, #1e293b, #0f172a); }
    .img-lazy.loaded { background: linear-gradient(135deg, #1d1b4b, #2e1065); border-color: #4c1d95; }
    .libro-info .titulo { display: block; font-size: 0.7rem; font-weight: 600; color: #E6EDF3; line-height: 1.3; }
    .libro-info .autor { display: block; font-size: 0.65rem; color: #8B949E; margin-top: 0.1rem; }
    .fill-section { background: #161B22; border: 1px solid #30363D; border-radius: 12px; padding: 1.25rem; }
    .banner-container { position: relative; width: 100%; height: 80px; border-radius: 8px; overflow: hidden; background: linear-gradient(135deg, #1e1b4b, #4c1d95); border: 1px solid #30363D; transition: background 400ms; }
    .banner-container.loaded { background: linear-gradient(135deg, #312e81, #6d28d9); }
    .banner-overlay { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; background: rgba(0,0,0,0.45); font-size: 0.82rem; font-weight: 600; color: #E6EDF3; text-align: center; padding: 0.5rem; }
    .img-attrs { display: flex; gap: 0.4rem; flex-wrap: wrap; margin-top: 0.4rem; }
    .attr-tag { font-family: 'JetBrains Mono', monospace; font-size: 0.6rem; background: #21262D; border: 1px solid #30363D; color: #a78bfa; padding: 0.15em 0.4em; border-radius: 3px; }
  </style>
</head>
<body>
  <span class="component-label">app-biblioteca-imagenes</span>
  <div class="biblioteca-imagenes">

    <div class="hero-section">
      <h2>Destacado del mes</h2>
      <div class="hero-portada">
        <div>
          <div class="img-mock img-hero" id="img-hero">ngSrc</div>
          <div class="img-attrs">
            <span class="attr-tag">priority</span>
            <span class="attr-tag">width=300</span>
            <span class="attr-tag">height=400</span>
          </div>
          <div class="load-indicator">
            <div class="load-dot eager" id="dot-hero"></div>
            <span id="label-hero">fetchpriority="high" — cargando...</span>
          </div>
        </div>
        <div class="hero-info">
          <h3>Clean Code</h3>
          <p>Robert C. Martin</p>
          <span class="badge-lcp">LCP Image · priority</span>
        </div>
      </div>
    </div>

    <div class="grid-section">
      <h3>Colección</h3>
      <div class="libros-grid" id="grid">
        <div class="libro-card"><div class="img-mock img-lazy" id="lazy1">ngSrc</div><div class="img-attrs"><span class="attr-tag">lazy</span></div><div class="libro-info"><span class="titulo">The Pragmatic Programmer</span><span class="autor">Hunt &amp; Thomas</span></div></div>
        <div class="libro-card"><div class="img-mock img-lazy" id="lazy2">ngSrc</div><div class="img-attrs"><span class="attr-tag">lazy</span></div><div class="libro-info"><span class="titulo">Design Patterns</span><span class="autor">Gang of Four</span></div></div>
        <div class="libro-card"><div class="img-mock img-lazy" id="lazy3">ngSrc</div><div class="img-attrs"><span class="attr-tag">lazy</span></div><div class="libro-info"><span class="titulo">Clean Architecture</span><span class="autor">R.C. Martin</span></div></div>
        <div class="libro-card"><div class="img-mock img-lazy" id="lazy4">ngSrc</div><div class="img-attrs"><span class="attr-tag">lazy</span></div><div class="libro-info"><span class="titulo">Refactoring</span><span class="autor">M. Fowler</span></div></div>
      </div>
    </div>

    <div class="fill-section">
      <h3>Banner de la semana</h3>
      <div class="banner-container" id="banner">
        <div class="banner-overlay">Semana de arquitectura de software</div>
      </div>
      <div class="img-attrs" style="margin-top:0.5rem">
        <span class="attr-tag">fill</span>
        <span class="attr-tag">object-fit:cover</span>
        <span class="attr-tag">lazy</span>
      </div>
    </div>
  </div>

  <script>
    // Hero: loads immediately (priority/eager)
    setTimeout(() => {
      document.getElementById('img-hero').classList.add('loaded');
      document.getElementById('dot-hero').className = 'load-dot loaded';
      document.getElementById('label-hero').textContent = 'Cargado con alta prioridad (LCP)';
    }, 300);

    // Lazy images: load progressively as they "enter viewport"
    [1,2,3,4].forEach((i, idx) => {
      setTimeout(() => {
        document.getElementById('lazy' + i).classList.add('loaded');
      }, 800 + idx * 250);
    });

    // Banner fill: lazy
    setTimeout(() => {
      document.getElementById('banner').classList.add('loaded');
    }, 1600);
  </script>
</body>
</html>`,
    aiContext:
      'El usuario está aprendiendo NgOptimizedImage en Angular 19/20. Ha visto el uso de ngSrc vs src, el atributo priority para LCP, width/height obligatorios para evitar CLS, y el modo fill. Puede preguntar sobre image loaders (Cloudinary, Imgix), LQIP, cómo configurar dominios externos, o la diferencia entre LCP y CLS.',
    introMessage:
      'Esta lección presenta `NgOptimizedImage` — la directiva oficial de Angular para imágenes de alto rendimiento.\n\nEl código muestra tres patrones: imagen hero con `priority` (LCP), galería con lazy loading automático, y un banner con modo `fill`. Observa cómo `priority` cambia el comportamiento de carga.\n\nPregúntame sobre LCP, CLS, image loaders externos, o cómo migrar `<img src>` a `<img ngSrc>` en una app existente.',
    suggestedQuestions: [
      '¿Por qué width y height son obligatorios con NgOptimizedImage?',
      '¿Cómo configuro un image loader de Cloudinary o Imgix?',
      '¿Cuántas imágenes deberían tener el atributo priority?',
    ],
  },

  {
    id: 'L10.4',
    module: 10,
    moduleTitle: 'SSR, Performance y Producción',
    title: 'Producción: build, zoneless y el futuro de Angular',
    subtitle: 'ng build optimizado, detección de cambios sin Zone.js, y qué viene después',
    estimatedMinutes: 20,
    xpReward: 180,
    prerequisites: ['L10.3'],
    nextLesson: null,
    language: 'typescript',
    achievements: [
      {
        id: 'angular-graduate',
        name: 'Angular Graduate',
        description: 'Completaste el curso completo de Angular en AngularVerse',
        icon: 'graduation-cap',
      },
    ],
    narrative: [
      {
        type: 'text',
        content:
          'El comando `ng build` genera un bundle de producción con tree-shaking, minificación, y code-splitting automático. Los archivos de entorno (`environment.ts` / `environment.prod.ts`) permiten tener configuraciones distintas por ambiente sin modificar el código. `ng build --configuration production` es el comando estándar en CI/CD — Angular CLI hace el swap de archivos de entorno automáticamente.',
      },
      {
        type: 'tip',
        variant: 'info',
        content:
          'Para analizar el bundle, ejecuta `ng build --stats-json` y abre el `stats.json` resultante en `webpack-bundle-analyzer`. Verás qué dependencias ocupan más espacio y detectarás imports innecesarios o duplicados que aumentan el tiempo de carga.',
      },
      {
        type: 'text',
        content:
          '`provideExperimentalZonelessChangeDetection()` elimina Zone.js completamente. Zone.js parcheaba APIs del navegador (setTimeout, fetch, eventos DOM) para detectar cambios — útil pero costoso. En modo zoneless, Angular depende 100% de Signals para saber cuándo re-renderizar. El resultado: bundles más pequeños (~20KB menos), mejor compatibilidad con web workers y micro-frontends, y renders aún más rápidos.',
      },
      {
        type: 'tip',
        variant: 'angular',
        content:
          'El futuro de Angular es signals everywhere: signal-based components, signal queries, signal-based routing y formularios reactivos basados en signals. La dirección es clara — si escribes código Angular moderno con signals hoy, estás alineado con el futuro del framework.',
      },
      {
        type: 'checkpoint',
        question: '¿Qué provider debes añadir en app.config.ts para eliminar Zone.js de tu aplicación Angular?',
        options: [
          'provideNoopAnimations()',
          'provideExperimentalZonelessChangeDetection()',
          'provideServerRendering()',
          'withEventReplay()',
        ],
        correct: 1,
        explanation:
          '`provideExperimentalZonelessChangeDetection()` deshabilita Zone.js y activa el modo donde Angular usa exclusivamente Signals para detectar cambios. Es "experimental" en versiones actuales, pero es la dirección definitiva del framework. Recuerda también eliminar `zone.js` de los `polyfills` en `angular.json`.',
      },
    ],
    starterCode: `// 📚 Biblioteca Angular — Configuración de producción
// app.config.ts con zoneless + SSR + optimizaciones

import { ApplicationConfig, provideExperimentalZonelessChangeDetection } from '@angular/core';
import { provideRouter, withComponentInputBinding, withViewTransitions } from '@angular/router';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    // ① Router: binding de inputs + View Transitions API
    provideRouter(
      routes,
      withComponentInputBinding(),   // params de ruta como @Input() signals
      withViewTransitions(),          // transiciones CSS nativas entre rutas
    ),

    // ② HTTP: usa fetch() nativo en lugar de XMLHttpRequest
    provideHttpClient(
      withFetch(),                    // compatible con SSR y service workers
    ),

    // ③ SSR Hydration: rehidrata sin re-renderizar + replay de eventos
    provideClientHydration(
      withEventReplay(),              // captura y reproduce clicks durante hydration
    ),

    // ④ Zoneless: elimina Zone.js — Angular usa solo Signals
    provideExperimentalZonelessChangeDetection(),
  ],
};

// ─── environment.prod.ts ──────────────────────────────────────
// Valores sobreescritos automáticamente en ng build --configuration production
export const environment = {
  production: true,
  apiUrl: 'https://api.mibiblioteca.com/v1',
  analyticsId: 'G-XXXXXXXXXX',
  logLevel: 'error',           // solo errores en prod — no verbose logging
};

// ─── environment.ts (development) ────────────────────────────
// export const environment = {
//   production: false,
//   apiUrl: 'http://localhost:3000/api/v1',
//   analyticsId: '',
//   logLevel: 'debug',
// };

// ─── angular.json (fragmento relevante) ──────────────────────
// "configurations": {
//   "production": {
//     "budgets": [
//       { "type": "initial", "maximumWarning": "500kb", "maximumError": "1mb" },
//       { "type": "anyComponentStyle", "maximumWarning": "2kb", "maximumError": "4kb" }
//     ],
//     "fileReplacements": [
//       { "replace": "src/environments/environment.ts",
//         "with": "src/environments/environment.prod.ts" }
//     ],
//     "outputHashing": "all"   // hashes en nombres de archivo para cache-busting
//   }
// }
`,
    solutionCode: '',
    previewHtml: `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Inter', sans-serif; background: #0D1117; color: #E6EDF3; min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 2rem; }
    .component-label { position: fixed; top: 12px; right: 12px; font-family: 'JetBrains Mono', monospace; font-size: 0.625rem; color: #8B949E; background: #161B22; border: 1px solid #30363D; padding: 0.2em 0.5em; border-radius: 4px; }
    button { cursor: pointer; font-family: 'Inter', sans-serif; }
    .prod-dashboard { width: 100%; max-width: 500px; display: flex; flex-direction: column; gap: 1.25rem; }
    .section-card { background: #161B22; border: 1px solid #30363D; border-radius: 12px; overflow: hidden; }
    .card-header { padding: 0.875rem 1.25rem; background: #0D1117; border-bottom: 1px solid #21262D; display: flex; align-items: center; gap: 0.625rem; }
    .card-header h3 { font-size: 0.85rem; font-weight: 600; }
    .card-icon { font-size: 1rem; }
    .card-body { padding: 1.25rem; }
    .build-btn { width: 100%; background: linear-gradient(135deg, #6d28d9, #8B5CF6); color: white; border: none; border-radius: 8px; padding: 0.75rem 1.5rem; font-size: 0.875rem; font-weight: 600; margin-bottom: 1.25rem; transition: opacity 150ms; display: flex; align-items: center; justify-content: center; gap: 0.5rem; }
    .build-btn:hover:not(:disabled) { opacity: 0.88; }
    .build-btn:disabled { opacity: 0.5; cursor: not-allowed; }
    .terminal { background: #0D1117; border: 1px solid #30363D; border-radius: 6px; padding: 0.875rem 1rem; font-family: 'JetBrains Mono', monospace; font-size: 0.72rem; color: #8B949E; min-height: 72px; }
    .terminal .line { margin-bottom: 0.2rem; display: flex; gap: 0.5rem; }
    .terminal .prompt { color: #30363D; }
    .terminal .cmd { color: #a78bfa; }
    .terminal .out { color: #8B949E; }
    .terminal .success { color: #22c55e; }
    .terminal .warn { color: #fbbf24; }
    .bundle-bars { display: flex; flex-direction: column; gap: 0.6rem; }
    .bundle-row { display: flex; align-items: center; gap: 0.75rem; }
    .bundle-label { font-size: 0.75rem; color: #8B949E; width: 90px; flex-shrink: 0; font-family: 'JetBrains Mono', monospace; }
    .bundle-bar-wrap { flex: 1; background: #21262D; border-radius: 4px; height: 8px; overflow: hidden; }
    .bundle-bar { height: 100%; border-radius: 4px; width: 0; transition: width 800ms ease-out; }
    .bundle-bar.main { background: #8B5CF6; }
    .bundle-bar.vendor { background: #3b82f6; }
    .bundle-bar.polyfills { background: #f59e0b; }
    .bundle-bar.styles { background: #34d399; }
    .bundle-size { font-family: 'JetBrains Mono', monospace; font-size: 0.72rem; color: #8B949E; width: 55px; text-align: right; }
    .perf-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; }
    .perf-item { background: #21262D; border: 1px solid #30363D; border-radius: 8px; padding: 0.75rem; }
    .perf-label { font-size: 0.68rem; color: #8B949E; text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: 0.35rem; }
    .perf-value { font-size: 1.35rem; font-weight: 800; line-height: 1; }
    .perf-value.good { color: #22c55e; }
    .perf-value.ok { color: #fbbf24; }
    .perf-change { font-size: 0.68rem; color: #8B949E; margin-top: 0.2rem; }
    .perf-change.improve { color: #34d399; }
    .zoneless-row { display: flex; align-items: center; justify-content: space-between; padding: 0.6rem 0; border-bottom: 1px solid #21262D; }
    .zoneless-row:last-child { border-bottom: none; }
    .zoneless-label { font-size: 0.82rem; color: #E6EDF3; }
    .zoneless-badge { font-family: 'JetBrains Mono', monospace; font-size: 0.68rem; padding: 0.2em 0.55em; border-radius: 4px; }
    .badge-off { background: rgba(239,68,68,0.1); color: #f87171; border: 1px solid rgba(239,68,68,0.25); }
    .badge-on { background: rgba(34,197,94,0.1); color: #4ade80; border: 1px solid rgba(34,197,94,0.25); }
    .badge-saved { background: rgba(139,92,246,0.1); color: #a78bfa; border: 1px solid rgba(139,92,246,0.25); }
    .achievement-banner { background: linear-gradient(135deg, rgba(109,40,217,0.2), rgba(139,92,246,0.1)); border: 1px solid rgba(139,92,246,0.4); border-radius: 12px; padding: 1.5rem; text-align: center; }
    .achievement-icon { font-size: 2.5rem; margin-bottom: 0.75rem; display: block; }
    .achievement-title { font-size: 1.1rem; font-weight: 800; color: #E6EDF3; margin-bottom: 0.3rem; }
    .achievement-desc { font-size: 0.82rem; color: #8B949E; line-height: 1.5; margin-bottom: 0.875rem; }
    .xp-bonus { display: inline-flex; align-items: center; gap: 0.4rem; background: rgba(251,191,36,0.12); color: #fbbf24; border: 1px solid rgba(251,191,36,0.3); padding: 0.3em 0.875em; border-radius: 20px; font-size: 0.82rem; font-weight: 700; }
    .hidden { display: none; }
  </style>
</head>
<body>
  <span class="component-label">ng build --configuration production</span>
  <div class="prod-dashboard">

    <!-- Build runner -->
    <div class="section-card">
      <div class="card-header">
        <span class="card-icon">⚙</span>
        <h3>Production Build</h3>
      </div>
      <div class="card-body">
        <button class="build-btn" id="build-btn" onclick="runBuild()">
          <span>▶</span> ng build --configuration production
        </button>
        <div class="terminal" id="terminal">
          <div class="line"><span class="prompt">$</span><span class="out">Listo para compilar. Haz clic en el botón para simular el build.</span></div>
        </div>
      </div>
    </div>

    <!-- Bundle sizes -->
    <div class="section-card hidden" id="bundle-section">
      <div class="card-header">
        <span class="card-icon">📦</span>
        <h3>Bundle Analysis</h3>
      </div>
      <div class="card-body">
        <div class="bundle-bars">
          <div class="bundle-row"><span class="bundle-label">main.js</span><div class="bundle-bar-wrap"><div class="bundle-bar main" id="bar-main"></div></div><span class="bundle-size" id="sz-main">0 KB</span></div>
          <div class="bundle-row"><span class="bundle-label">vendor.js</span><div class="bundle-bar-wrap"><div class="bundle-bar vendor" id="bar-vendor"></div></div><span class="bundle-size" id="sz-vendor">0 KB</span></div>
          <div class="bundle-row"><span class="bundle-label">polyfills.js</span><div class="bundle-bar-wrap"><div class="bundle-bar polyfills" id="bar-polyfills"></div></div><span class="bundle-size" id="sz-polyfills">0 KB</span></div>
          <div class="bundle-row"><span class="bundle-label">styles.css</span><div class="bundle-bar-wrap"><div class="bundle-bar styles" id="bar-styles"></div></div><span class="bundle-size" id="sz-styles">0 KB</span></div>
        </div>
      </div>
    </div>

    <!-- Zoneless config -->
    <div class="section-card hidden" id="zoneless-section">
      <div class="card-header">
        <span class="card-icon">⚡</span>
        <h3>Zoneless Change Detection</h3>
      </div>
      <div class="card-body">
        <div class="zoneless-row">
          <span class="zoneless-label">Zone.js</span>
          <span class="zoneless-badge badge-off">eliminado</span>
        </div>
        <div class="zoneless-row">
          <span class="zoneless-label">Signals como única fuente de verdad</span>
          <span class="zoneless-badge badge-on">activo</span>
        </div>
        <div class="zoneless-row">
          <span class="zoneless-label">Ahorro en bundle</span>
          <span class="zoneless-badge badge-saved">-21 KB (gzip)</span>
        </div>
        <div class="zoneless-row">
          <span class="zoneless-label">Compatibilidad web workers</span>
          <span class="zoneless-badge badge-on">total</span>
        </div>
      </div>
    </div>

    <!-- Perf scores -->
    <div class="section-card hidden" id="perf-section">
      <div class="card-header">
        <span class="card-icon">📊</span>
        <h3>Lighthouse Score (simulado)</h3>
      </div>
      <div class="card-body">
        <div class="perf-grid">
          <div class="perf-item"><div class="perf-label">Performance</div><div class="perf-value good" id="perf-num">--</div><div class="perf-change improve" id="perf-delta"></div></div>
          <div class="perf-item"><div class="perf-label">LCP</div><div class="perf-value good" id="lcp-num">--</div><div class="perf-change improve" id="lcp-delta"></div></div>
          <div class="perf-item"><div class="perf-label">TBT</div><div class="perf-value good" id="tbt-num">--</div><div class="perf-change improve" id="tbt-delta"></div></div>
          <div class="perf-item"><div class="perf-label">CLS</div><div class="perf-value good" id="cls-num">--</div><div class="perf-change improve" id="cls-delta"></div></div>
        </div>
      </div>
    </div>

    <!-- Achievement -->
    <div class="achievement-banner hidden" id="achievement">
      <span class="achievement-icon">🎓</span>
      <div class="achievement-title">Angular Graduate</div>
      <div class="achievement-desc">Has completado el curso completo de Angular en AngularVerse. Desde componentes y signals hasta SSR, zoneless y producción.</div>
      <span class="xp-bonus">+200 XP Bonus de finalización</span>
    </div>
  </div>

  <script>
    function runBuild() {
      const btn = document.getElementById('build-btn');
      btn.disabled = true;
      btn.innerHTML = '<span>⟳</span> Compilando...';
      const term = document.getElementById('terminal');

      const lines = [
        { text: '$ ng build --configuration production', cls: 'cmd', delay: 100 },
        { text: 'Building Angular application...', cls: 'out', delay: 400 },
        { text: 'Generating optimized bundles (tree-shaking)...', cls: 'out', delay: 900 },
        { text: 'WARN Budget warning: styles (1.8 KB / 2 KB limit)', cls: 'warn', delay: 1500 },
        { text: 'Removing Zone.js from bundle...', cls: 'out', delay: 1900 },
        { text: 'Build complete! Output: dist/biblioteca-angular/', cls: 'success', delay: 2500 },
      ];

      term.innerHTML = '';
      lines.forEach(({ text, cls, delay }) => {
        setTimeout(() => {
          const div = document.createElement('div');
          div.className = 'line';
          div.innerHTML = '<span class="' + cls + '">' + text + '</span>';
          term.appendChild(div);
        }, delay);
      });

      setTimeout(() => {
        btn.innerHTML = '<span>✓</span> Build completado';
        document.getElementById('bundle-section').classList.remove('hidden');
        setTimeout(() => {
          document.getElementById('bar-main').style.width = '65%';
          document.getElementById('bar-vendor').style.width = '88%';
          document.getElementById('bar-polyfills').style.width = '12%';
          document.getElementById('bar-styles').style.width = '18%';
          document.getElementById('sz-main').textContent = '89 KB';
          document.getElementById('sz-vendor').textContent = '124 KB';
          document.getElementById('sz-polyfills').textContent = '18 KB';
          document.getElementById('sz-styles').textContent = '26 KB';
        }, 100);
      }, 2700);

      setTimeout(() => {
        document.getElementById('zoneless-section').classList.remove('hidden');
      }, 3200);

      setTimeout(() => {
        document.getElementById('perf-section').classList.remove('hidden');
        setTimeout(() => {
          document.getElementById('perf-num').textContent = '98';
          document.getElementById('perf-delta').textContent = '+12 vs CSR sin optimizar';
          document.getElementById('lcp-num').textContent = '1.1s';
          document.getElementById('lcp-delta').textContent = 'Mejora vs 3.4s CSR';
          document.getElementById('tbt-num').textContent = '40ms';
          document.getElementById('tbt-delta').textContent = 'Reducido con zoneless';
          document.getElementById('cls-num').textContent = '0.02';
          document.getElementById('cls-delta').textContent = 'NgOptimizedImage activo';
        }, 200);
      }, 4000);

      setTimeout(() => {
        document.getElementById('achievement').classList.remove('hidden');
      }, 5000);
    }
  </script>
</body>
</html>`,
    aiContext:
      'El usuario está terminando el curso de Angular en AngularVerse. Ha visto la configuración de producción completa: ng build, zoneless con provideExperimentalZonelessChangeDetection, archivos de entorno, y análisis de bundles. Puede preguntar sobre la hoja de ruta de Angular (signals everywhere, full zoneless), cómo depurar bundles grandes, cómo configurar environments, o qué sigue después del curso.',
    introMessage:
      'Esta es la última lección del curso. Cerramos con la configuración de producción completa: build optimizado, zoneless change detection y visión del futuro de Angular.\n\nEl código muestra un `app.config.ts` de producción completo con `provideExperimentalZonelessChangeDetection()` — el futuro del framework. Simula el build haciendo clic en el botón del preview.\n\nSi tienes preguntas sobre el build, zoneless, environments, o qué aprender después de este curso, pregúntame.',
    suggestedQuestions: [
      '¿Zoneless es estable para producción hoy en día?',
      '¿Cómo depuro si el bundle es demasiado grande?',
      '¿Qué es la hoja de ruta de signals en Angular y qué cambia?',
    ],
  },
];
