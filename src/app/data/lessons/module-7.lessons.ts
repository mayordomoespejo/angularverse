import type { Lesson } from '../../core/models/lesson.model';

export const MODULE_7_LESSONS: Lesson[] = [
  {
    id: 'L7.1',
    module: 7,
    moduleTitle: 'HTTP y RxJS',
    title: 'HttpClient: Conecta tu app al mundo',
    subtitle: 'provideHttpClient(), inject(HttpClient) y estados de carga reactivos',
    estimatedMinutes: 14,
    xpReward: 140,
    prerequisites: ['L6.5'],
    nextLesson: 'L7.2',
    language: 'typescript',
    narrative: [
      {
        type: 'text',
        content:
          'En Angular moderno no existe `HttpClientModule` — la forma correcta es registrar `provideHttpClient()` en `app.config.ts` y luego obtener `HttpClient` con `inject(HttpClient)` dentro del servicio. Cada llamada a `.get<T>()` devuelve un `Observable<T>` frío: no ocurre nada hasta que alguien se suscribe.',
      },
      {
        type: 'tip',
        variant: 'info',
        content:
          '`toSignal(observable, { initialValue: [] })` suscribe automáticamente al observable y cancela la suscripción cuando el componente se destruye. Es el puente más limpio entre RxJS y el mundo de Signals.',
      },
      {
        type: 'text',
        content:
          'El patrón estándar para manejar estados asíncronos en Angular 19 son tres signals: `datos`, `cargando` y `error`. El componente los lee directamente en el template con `@if` para mostrar spinner, datos o mensaje de error según el estado actual.',
      },
      {
        type: 'tip',
        variant: 'angular',
        content:
          'Configura `provideHttpClient(withFetch())` si tu app se renderiza en el servidor (SSR). Angular usará la API `fetch` nativa en lugar de `XMLHttpRequest`, lo que funciona tanto en Node.js como en el browser.',
      },
      {
        type: 'checkpoint',
        question: '¿Qué función debes añadir en app.config.ts para habilitar HttpClient en Angular 19?',
        options: ['HttpClientModule', 'provideHttpClient()', 'importHttpClient()', 'enableHttp()'],
        correct: 1,
        explanation:
          '`provideHttpClient()` es la forma standalone de registrar el cliente HTTP. Se añade en el array `providers` de `appConfig`. Ya no necesitas importar `HttpClientModule` — ese es el patrón legado de módulos NgModule.',
      },
    ],
    starterCode: `import { Component, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { toSignal } from '@angular/core/rxjs-interop';
import { catchError, of } from 'rxjs';

// 📚 Biblioteca Angular — HttpClient
// app.config.ts ya tiene: provideHttpClient(withInterceptors([...]))

interface Libro {
  id: number;
  titulo: string;
  autor: string;
  genero: string;
  anio: number;
}

// ── Servicio ─────────────────────────────────────────────────
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class LibrosApiService {
  private readonly http = inject(HttpClient);
  private readonly API = 'https://api.ejemplo.com/libros';

  getLibros() {
    // Observable<Libro[]> — frío, cada suscripción dispara una petición nueva
    return this.http.get<Libro[]>(this.API);
  }

  getLibro(id: number) {
    return this.http.get<Libro>(\`\${this.API}/\${id}\`);
  }
}

// ── Componente ────────────────────────────────────────────────
@Component({
  selector: 'app-catalogo',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: \`
    <div class="catalogo">
      <h2>Catálogo de Libros</h2>

      @if (cargando()) {
        <div class="spinner">Cargando libros...</div>
      } @else if (error()) {
        <div class="error">
          <p>{{ error() }}</p>
          <button (click)="recargar()">Reintentar</button>
        </div>
      } @else {
        <div class="grid">
          @for (libro of libros(); track libro.id) {
            <div class="libro-card">
              <strong>{{ libro.titulo }}</strong>
              <span>{{ libro.autor }}</span>
            </div>
          }
        </div>
      }
    </div>
  \`,
})
export class CatalogoComponent {
  private readonly api = inject(LibrosApiService);

  readonly cargando = signal(true);
  readonly error = signal<string | null>(null);

  // toSignal() suscribe y desuscribe automáticamente
  readonly libros = toSignal(
    this.api.getLibros().pipe(
      catchError(err => {
        this.error.set('Error al cargar libros: ' + err.message);
        this.cargando.set(false);
        return of([]);
      })
    ),
    { initialValue: [] }
  );

  recargar(): void {
    this.error.set(null);
    this.cargando.set(true);
    // En una app real llamarías al servicio de nuevo
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
    button { cursor: pointer; font-family: 'Inter', sans-serif; }
    .catalogo { background: #161B22; border: 1px solid #30363D; border-radius: 12px; padding: 1.75rem; width: 100%; max-width: 480px; }
    h2 { font-size: 1.05rem; font-weight: 600; margin-bottom: 1.25rem; }
    .estado { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 2.5rem 1rem; gap: 1rem; }
    .spinner-ring { width: 36px; height: 36px; border: 3px solid #30363D; border-top-color: #8B5CF6; border-radius: 50%; animation: spin 0.8s linear infinite; }
    @keyframes spin { to { transform: rotate(360deg); } }
    .spinner-text { font-size: 0.85rem; color: #8B949E; }
    .error-box { background: rgba(239,68,68,0.08); border: 1px solid rgba(239,68,68,0.3); border-radius: 8px; padding: 1rem 1.25rem; display: flex; align-items: center; justify-content: space-between; gap: 1rem; }
    .error-msg { font-size: 0.85rem; color: #f87171; }
    .btn-retry { background: transparent; border: 1px solid rgba(239,68,68,0.4); color: #f87171; border-radius: 6px; padding: 0.4rem 0.875rem; font-size: 0.8rem; transition: background 150ms; }
    .btn-retry:hover { background: rgba(239,68,68,0.12); }
    .grid { display: flex; flex-direction: column; gap: 0.5rem; }
    .libro-card { background: #21262D; border: 1px solid #30363D; border-radius: 8px; padding: 0.875rem 1rem; display: flex; flex-direction: column; gap: 0.2rem; transition: border-color 150ms; }
    .libro-card:hover { border-color: #8B5CF6; }
    .libro-card strong { font-size: 0.9rem; font-weight: 600; color: #E6EDF3; }
    .libro-card span { font-size: 0.78rem; color: #8B949E; }
    .badge { display: inline-block; font-size: 0.68rem; font-weight: 600; padding: 0.15em 0.5em; border-radius: 4px; margin-top: 0.25rem; }
    .badge.get { background: rgba(34,197,94,0.12); color: #4ade80; border: 1px solid rgba(34,197,94,0.25); }
    .status-bar { display: flex; align-items: center; gap: 0.5rem; margin-bottom: 1rem; font-size: 0.75rem; color: #8B949E; font-family: 'JetBrains Mono', monospace; }
    .dot { width: 6px; height: 6px; border-radius: 50%; background: #22c55e; }
    .dot.loading { background: #f59e0b; animation: pulse 1s ease-in-out infinite; }
    @keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.3; } }
    .controls { display: flex; gap: 0.5rem; margin-bottom: 1rem; }
    .btn-state { background: #21262D; border: 1px solid #30363D; color: #8B949E; border-radius: 6px; padding: 0.35rem 0.75rem; font-size: 0.75rem; transition: all 150ms; }
    .btn-state:hover { border-color: #8B5CF6; color: #c4b5fd; }
    .btn-state.active { background: rgba(139,92,246,0.15); border-color: #8B5CF6; color: #c4b5fd; }
  </style>
</head>
<body>
  <span class="component-label">app-catalogo</span>
  <div class="catalogo">
    <h2>Catalogo de Libros</h2>
    <div class="controls">
      <button class="btn-state active" id="btn-loading" onclick="setState('loading')">Cargando</button>
      <button class="btn-state" id="btn-success" onclick="setState('success')">Exito</button>
      <button class="btn-state" id="btn-error" onclick="setState('error')">Error</button>
    </div>
    <div class="status-bar">
      <div class="dot loading" id="dot"></div>
      <span id="status-text">GET /api/libros</span>
    </div>
    <div id="content"></div>
  </div>
  <script>
    var libros = [
      { id: 1, titulo: 'Clean Code', autor: 'Robert C. Martin', genero: 'Programacion' },
      { id: 2, titulo: 'The Pragmatic Programmer', autor: 'Hunt & Thomas', genero: 'Programacion' },
      { id: 3, titulo: 'Designing Data-Intensive Applications', autor: 'Martin Kleppmann', genero: 'Arquitectura' },
      { id: 4, titulo: 'You Don\'t Know JS', autor: 'Kyle Simpson', genero: 'JavaScript' },
    ];
    var currentState = 'loading';
    function setState(s) {
      currentState = s;
      ['btn-loading','btn-success','btn-error'].forEach(function(id) {
        document.getElementById(id).classList.remove('active');
      });
      document.getElementById('btn-' + s).classList.add('active');
      render();
    }
    function render() {
      var dot = document.getElementById('dot');
      var statusText = document.getElementById('status-text');
      var content = document.getElementById('content');
      if (currentState === 'loading') {
        dot.className = 'dot loading';
        statusText.textContent = 'GET /api/libros — esperando...';
        content.innerHTML = '<div class="estado"><div class="spinner-ring"></div><span class="spinner-text">Cargando libros desde la API...</span></div>';
      } else if (currentState === 'error') {
        dot.className = 'dot';
        dot.style.background = '#ef4444';
        statusText.textContent = 'GET /api/libros — 503 Error';
        content.innerHTML = '<div class="error-box"><span class="error-msg">Error al cargar libros: Network error</span><button class="btn-retry" onclick="setState(\'loading\'); setTimeout(function(){setState(\'success\')},1500)">Reintentar</button></div>';
      } else {
        dot.className = 'dot';
        dot.style.background = '#22c55e';
        statusText.textContent = 'GET /api/libros — 200 OK (' + libros.length + ' items)';
        content.innerHTML = '<div class="grid">' + libros.map(function(l) {
          return '<div class="libro-card"><strong>' + l.titulo + '</strong><span>' + l.autor + '</span><span class="badge get">' + l.genero + '</span></div>';
        }).join('') + '</div>';
      }
    }
    render();
    setTimeout(function() { setState('success'); }, 1800);
  </script>
</body>
</html>`,
    aiContext:
      'El usuario está aprendiendo HttpClient en Angular 19. Ha visto provideHttpClient(), inject(HttpClient), .get<T>(), y el patrón de estados cargando/error/datos con signals. También ha visto toSignal() para conectar observables con el mundo de signals. Puede preguntar sobre la diferencia con HttpClientModule, withFetch(), withInterceptors(), o cómo manejar headers y parámetros en las peticiones.',
    introMessage:
      'En esta lección conectarás tu app Angular a una API real usando `HttpClient`.\n\nEl código muestra el patrón completo: un servicio con `inject(HttpClient)` que devuelve observables, y un componente que los convierte en signals con `toSignal()` y gestiona estados de carga, éxito y error.\n\nUsa los botones del preview para ver cada estado en acción. Pregúntame sobre `provideHttpClient()`, `toSignal()`, o cómo manejar distintos tipos de peticiones HTTP.',
    suggestedQuestions: [
      '¿Por qué HttpClient devuelve un Observable en lugar de una Promise?',
      '¿Cómo añado headers o query params a una petición HTTP?',
      '¿Cuál es la diferencia entre toSignal() y async pipe?',
    ],
  },

  {
    id: 'L7.2',
    module: 7,
    moduleTitle: 'HTTP y RxJS',
    title: 'RxJS esencial: Los operadores que usarás cada día',
    subtitle: 'pipe(), map(), tap(), catchError() y retry() — construye pipelines de datos',
    estimatedMinutes: 16,
    xpReward: 150,
    prerequisites: ['L7.1'],
    nextLesson: 'L7.3',
    language: 'typescript',
    narrative: [
      {
        type: 'text',
        content:
          'Un observable por sí solo no hace mucho. El poder de RxJS está en encadenar operadores dentro de `.pipe()`. Cada operador recibe el stream de valores, lo transforma, y pasa el resultado al siguiente. Es una tubería: los datos entran por un extremo y salen transformados por el otro.',
      },
      {
        type: 'tip',
        variant: 'info',
        content:
          '`tap()` es tu mejor amigo para depurar — ejecuta una función como efecto secundario sin modificar el valor que pasa por el pipe. Úsalo para `console.log()`, actualizar signals de estado, o llamar a servicios de analytics.',
      },
      {
        type: 'text',
        content:
          '`catchError()` intercepta cualquier error en el pipe y te permite devolver un observable alternativo. La forma más habitual es `catchError(err => of(valorPorDefecto))` — devuelves un observable que emite un valor seguro y completa limpiamente. Si no capturas el error, el observable termina y ya no recibirás más valores.',
      },
      {
        type: 'comparison',
        leftLabel: 'Sin operadores',
        rightLabel: 'Con pipe()',
        left: 'http.get<Libro[]>(url)\n// Observable crudo\n// Sin transformación\n// Sin manejo de errores\n// Si falla, la app rompe',
        right: 'http.get<Libro[]>(url).pipe(\n  tap(() => loading.set(true)),\n  map(libros => libros.filter(l => l.activo)),\n  retry({ count: 2, delay: 1000 }),\n  catchError(() => of([]))\n)',
      },
      {
        type: 'tip',
        variant: 'angular',
        content:
          '`retry({ count: 2, delay: 1000 })` reintenta automáticamente la petición HTTP hasta 2 veces con 1 segundo de espera entre intentos. Ideal para errores de red transitorios. Angular recrea el observable desde el principio en cada reintento.',
      },
      {
        type: 'checkpoint',
        question: '¿Qué operador usarías para transformar el array de libros devuelto por la API antes de guardarlo?',
        options: ['tap()', 'catchError()', 'map()', 'retry()'],
        correct: 2,
        explanation:
          '`map()` transforma cada valor que pasa por el observable. Recibe el valor emitido y devuelve el valor transformado — igual que `Array.map()` pero para streams. `tap()` no transforma nada, solo ejecuta efectos secundarios.',
      },
    ],
    starterCode: `import { Component, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { toSignal } from '@angular/core/rxjs-interop';
import { pipe, map, tap, catchError, retry, of } from 'rxjs';

// 📚 Biblioteca Angular — Pipeline RxJS
// Encadenamos operadores para transformar, observar y proteger la petición HTTP

interface LibroApi {
  id: number;
  title: string;
  author_name?: string[];
  first_publish_year?: number;
  subject?: string[];
}

interface LibroVista {
  id: number;
  titulo: string;
  autor: string;
  anio: number;
}

@Component({
  selector: 'app-pipeline-libros',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: \`
    <div class="pipeline">
      <h2>Pipeline de libros</h2>

      <div class="steps">
        <div class="step" [class.activo]="paso() >= 1">1. GET /api/libros</div>
        <div class="step" [class.activo]="paso() >= 2">2. tap → loading = true</div>
        <div class="step" [class.activo]="paso() >= 3">3. map → transformar datos</div>
        <div class="step" [class.activo]="paso() >= 4">4. catchError → fallback []</div>
        <div class="step activo-final" [class.activo]="paso() >= 5">5. toSignal → UI</div>
      </div>

      @if (cargando()) {
        <p class="hint">Construyendo pipeline...</p>
      } @else {
        <div class="lista">
          @for (libro of libros(); track libro.id) {
            <div class="libro">
              <strong>{{ libro.titulo }}</strong>
              <span>{{ libro.autor }} · {{ libro.anio }}</span>
            </div>
          }
        </div>
      }
    </div>
  \`,
})
export class PipelineLibrosComponent {
  private readonly http = inject(HttpClient);
  readonly cargando = signal(true);
  readonly paso = signal(0);

  readonly libros = toSignal(
    this.http.get<LibroApi[]>('https://openlibrary.org/search.json?q=angular').pipe(
      // tap: efecto secundario, no modifica el valor
      tap(() => {
        this.cargando.set(true);
        this.paso.set(2);
      }),
      // map: transforma cada emisión del observable
      map(data => {
        this.paso.set(3);
        return (data as any).docs?.slice(0, 5).map((l: LibroApi, i: number) => ({
          id: i,
          titulo: l.title,
          autor: l.author_name?.[0] ?? 'Desconocido',
          anio: l.first_publish_year ?? 0,
        })) as LibroVista[];
      }),
      // retry: reintenta automáticamente en caso de error de red
      retry({ count: 2, delay: 1000 }),
      // catchError: captura el error y devuelve un observable seguro
      catchError(err => {
        console.error('Error en pipeline:', err);
        this.paso.set(4);
        this.cargando.set(false);
        return of([] as LibroVista[]);
      })
    ),
    { initialValue: [] }
  );
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
    button { cursor: pointer; font-family: 'Inter', sans-serif; }
    .pipeline { background: #161B22; border: 1px solid #30363D; border-radius: 12px; padding: 1.75rem; width: 100%; max-width: 500px; }
    h2 { font-size: 1.05rem; font-weight: 600; margin-bottom: 1.25rem; }
    .steps { display: flex; flex-direction: column; gap: 0; margin-bottom: 1.5rem; position: relative; }
    .step { display: flex; align-items: center; gap: 0.75rem; padding: 0.6rem 0.875rem; font-family: 'JetBrains Mono', monospace; font-size: 0.78rem; color: #8B949E; background: #0D1117; border: 1px solid #21262D; border-bottom: none; position: relative; transition: all 300ms; }
    .step:first-child { border-radius: 8px 8px 0 0; }
    .step:last-child { border-bottom: 1px solid #21262D; border-radius: 0 0 8px 8px; }
    .step::before { content: ''; width: 8px; height: 8px; border-radius: 50%; background: #30363D; flex-shrink: 0; transition: background 300ms; }
    .step.active { background: rgba(139,92,246,0.06); border-color: rgba(139,92,246,0.25); color: #c4b5fd; }
    .step.active::before { background: #8B5CF6; box-shadow: 0 0 6px rgba(139,92,246,0.6); }
    .step.done { background: rgba(34,197,94,0.05); border-color: rgba(34,197,94,0.2); color: #86efac; }
    .step.done::before { background: #22c55e; }
    .lista { display: flex; flex-direction: column; gap: 0.5rem; }
    .libro { background: #21262D; border: 1px solid #30363D; border-radius: 8px; padding: 0.75rem 1rem; display: flex; flex-direction: column; gap: 0.15rem; animation: slideIn 300ms ease-out; }
    @keyframes slideIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
    .libro strong { font-size: 0.875rem; font-weight: 600; color: #E6EDF3; }
    .libro span { font-size: 0.75rem; color: #8B949E; }
    .btn-replay { margin-top: 1rem; width: 100%; background: #8B5CF6; color: white; border: none; border-radius: 6px; padding: 0.6rem 1rem; font-size: 0.825rem; font-weight: 500; transition: opacity 150ms; }
    .btn-replay:hover { opacity: 0.85; }
    .operator-tag { font-size: 0.68rem; font-weight: 600; padding: 0.1em 0.45em; border-radius: 4px; margin-left: auto; }
    .tag-tap { background: rgba(251,191,36,0.12); color: #fbbf24; border: 1px solid rgba(251,191,36,0.25); }
    .tag-map { background: rgba(139,92,246,0.12); color: #a78bfa; border: 1px solid rgba(139,92,246,0.25); }
    .tag-catch { background: rgba(239,68,68,0.1); color: #f87171; border: 1px solid rgba(239,68,68,0.2); }
    .tag-signal { background: rgba(34,197,94,0.1); color: #4ade80; border: 1px solid rgba(34,197,94,0.2); }
    .tag-http { background: rgba(59,130,246,0.1); color: #60a5fa; border: 1px solid rgba(59,130,246,0.2); }
  </style>
</head>
<body>
  <span class="component-label">app-pipeline-libros</span>
  <div class="pipeline">
    <h2>Pipeline de libros</h2>
    <div class="steps" id="steps">
      <div class="step" id="s1">1. GET /api/libros <span class="operator-tag tag-http">http</span></div>
      <div class="step" id="s2">2. tap() — loading = true <span class="operator-tag tag-tap">tap</span></div>
      <div class="step" id="s3">3. map() — transformar LibroApi a LibroVista <span class="operator-tag tag-map">map</span></div>
      <div class="step" id="s4">4. catchError() — fallback [] <span class="operator-tag tag-catch">catchError</span></div>
      <div class="step" id="s5">5. toSignal() — UI actualizada <span class="operator-tag tag-signal">signal</span></div>
    </div>
    <div id="content"></div>
    <button class="btn-replay" id="btn-replay">Reproducir pipeline</button>
  </div>
  <script>
    var libros = [
      { titulo: 'Pro Angular 17', autor: 'Adam Freeman', anio: 2024 },
      { titulo: 'Angular Development with TypeScript', autor: 'Yakov Fain', anio: 2023 },
      { titulo: 'Learning Angular', autor: 'Aristeidis Bampakos', anio: 2023 },
      { titulo: 'Angular Up & Running', autor: 'Shyam Seshadri', anio: 2022 },
    ];
    var currentStep = 0;
    var timers = [];
    function clearTimers() { timers.forEach(function(t) { clearTimeout(t); }); timers = []; }
    function reset() {
      clearTimers();
      currentStep = 0;
      for (var i = 1; i <= 5; i++) {
        document.getElementById('s' + i).className = 'step';
      }
      document.getElementById('content').innerHTML = '';
    }
    function activateStep(n, delay) {
      timers.push(setTimeout(function() {
        if (n > 1) { document.getElementById('s' + (n-1)).className = 'step done'; }
        document.getElementById('s' + n).className = 'step active';
        if (n === 5) {
          timers.push(setTimeout(function() {
            document.getElementById('s5').className = 'step done';
            document.getElementById('content').innerHTML = '<div class="lista">' + libros.map(function(l) {
              return '<div class="libro"><strong>' + l.titulo + '</strong><span>' + l.autor + ' · ' + l.anio + '</span></div>';
            }).join('') + '</div>';
          }, 500));
        }
      }, delay));
    }
    function run() {
      reset();
      activateStep(1, 0);
      activateStep(2, 600);
      activateStep(3, 1200);
      activateStep(4, 1800);
      activateStep(5, 2400);
    }
    document.getElementById('btn-replay').addEventListener('click', run);
    run();
  </script>
</body>
</html>`,
    aiContext:
      'El usuario está aprendiendo los operadores RxJS esenciales en Angular 19: pipe(), map(), tap(), catchError() y retry(). Ha visto cómo encadenar operadores para construir un pipeline de transformación de datos HTTP. Puede preguntar sobre la diferencia entre map y tap, cómo funciona catchError, cuándo usar retry vs retryWhen, o cómo componer operadores personalizados.',
    introMessage:
      'Esta lección te enseña a construir pipelines RxJS para transformar datos HTTP.\n\nEl preview visualiza cómo cada operador procesa el stream en secuencia: la petición sale, `tap()` registra el estado, `map()` transforma la respuesta, y `catchError()` garantiza que la UI nunca rompe.\n\nPregúntame sobre cualquier operador, sobre cómo encadenar transformaciones complejas, o sobre cuándo preferir RxJS sobre async/await.',
    suggestedQuestions: [
      '¿Cuál es la diferencia entre map() y tap() en RxJS?',
      '¿Cómo funciona catchError() — por qué debo devolver un observable?',
      '¿Cuándo uso retry() y cuándo mejor muestro un error al usuario?',
    ],
  },

  {
    id: 'L7.3',
    module: 7,
    moduleTitle: 'HTTP y RxJS',
    title: 'switchMap y búsqueda en tiempo real',
    subtitle: 'debounceTime, distinctUntilChanged y cancelación de peticiones anteriores',
    estimatedMinutes: 18,
    xpReward: 160,
    prerequisites: ['L7.2'],
    nextLesson: 'L7.4',
    language: 'typescript',
    narrative: [
      {
        type: 'text',
        content:
          'Cuando el usuario escribe en un buscador, cada keystroke puede disparar una petición HTTP. Sin control, enviarías 10 peticiones para "JavaScript" — y la respuesta que llega primero no es necesariamente la que corresponde al último término. `switchMap` resuelve esto: cancela la petición anterior y solo procesa la respuesta de la más reciente.',
      },
      {
        type: 'tip',
        variant: 'info',
        content:
          '`debounceTime(300)` espera 300ms de silencio antes de emitir. Si el usuario sigue escribiendo, reinicia el contador. `distinctUntilChanged()` evita emitir si el valor es idéntico al anterior — útil cuando el usuario borra y vuelve a escribir lo mismo.',
      },
      {
        type: 'comparison',
        leftLabel: 'switchMap',
        rightLabel: 'mergeMap / concatMap',
        left: 'switchMap(q => search(q))\n// Cancela la peticion anterior\n// Ideal: busqueda, autocompletado\n// Solo llega la respuesta mas reciente',
        right: 'mergeMap(q => search(q))\n// Corre todas en paralelo\n// Ideal: acciones independientes\n\nconcatMap(q => search(q))\n// Las encola en orden\n// Ideal: operaciones secuenciales',
      },
      {
        type: 'text',
        content:
          'El patrón completo de búsqueda reactiva en Angular 19: convierte el signal del input en un observable con `toObservable()`, aplica `debounceTime` y `distinctUntilChanged` para evitar peticiones innecesarias, y usa `switchMap` para hacer la llamada HTTP cancelando cualquier petición en vuelo.',
      },
      {
        type: 'tip',
        variant: 'angular',
        content:
          '`filter(q => q.length >= 2)` antes del `switchMap` evita enviar peticiones para términos demasiado cortos. Combínalo con `debounceTime` para una búsqueda eficiente: el usuario escribe → pausa → mínimo 2 caracteres → petición.',
      },
      {
        type: 'checkpoint',
        question: 'El usuario escribe "Angular" rápido: A-n-g-u-l-a-r. Con switchMap, ¿cuántas respuestas HTTP procesará tu componente?',
        options: ['7 (una por letra)', '2 o 3 (las últimas antes de la pausa)', '1 (solo la última petición activa)', 'Depende del servidor'],
        correct: 2,
        explanation:
          'Con `switchMap`, cada nueva emisión cancela la suscripción anterior. Cuando llega "Angular" completo, las peticiones de "A", "An", "Ang"... ya fueron canceladas. Solo se procesa la respuesta de la petición más reciente que no fue cancelada por una emisión posterior.',
      },
    ],
    starterCode: `import { Component, inject, signal, computed, ChangeDetectionStrategy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { toSignal, toObservable } from '@angular/core/rxjs-interop';
import { debounceTime, distinctUntilChanged, switchMap, filter, map, catchError, of, startWith } from 'rxjs';

// 📚 Biblioteca Angular — Búsqueda reactiva con switchMap

interface SearchResult {
  key: string;
  title: string;
  author_name?: string[];
  first_publish_year?: number;
}

@Component({
  selector: 'app-buscador-reactivo',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: \`
    <div class="buscador">
      <h2>Buscar en Open Library</h2>

      <div class="search-box">
        <input
          type="text"
          placeholder="Escribe un título o autor..."
          [value]="termino()"
          (input)="termino.set($any($event.target).value)"
        />
        @if (buscando()) {
          <span class="searching-indicator">Buscando...</span>
        }
      </div>

      @if (termino().length > 0 && termino().length < 2) {
        <p class="hint">Escribe al menos 2 caracteres</p>
      }

      <div class="resultados">
        @for (libro of resultados(); track libro.key) {
          <div class="resultado">
            <strong>{{ libro.title }}</strong>
            <span>{{ libro.author_name?.[0] ?? 'Autor desconocido' }}</span>
          </div>
        }
        @empty {
          @if (termino().length >= 2 && !buscando()) {
            <p class="hint">Sin resultados para "{{ termino() }}"</p>
          }
        }
      </div>
    </div>
  \`,
})
export class BuscadorReactivoComponent {
  private readonly http = inject(HttpClient);

  readonly termino = signal('');
  readonly buscando = signal(false);

  // toObservable() convierte el signal en un observable
  // para poder aplicar operadores RxJS de temporización
  readonly resultados = toSignal(
    toObservable(this.termino).pipe(
      debounceTime(300),               // espera 300ms de pausa
      distinctUntilChanged(),          // omite si el valor no cambió
      filter(q => q.length >= 2),      // mínimo 2 caracteres
      // switchMap cancela la petición anterior y empieza una nueva
      switchMap(query => {
        this.buscando.set(true);
        return this.http.get<{ docs: SearchResult[] }>(
          \`https://openlibrary.org/search.json?q=\${encodeURIComponent(query)}&limit=5\`
        ).pipe(
          map(res => {
            this.buscando.set(false);
            return res.docs;
          }),
          catchError(() => {
            this.buscando.set(false);
            return of([]);
          })
        );
      }),
      startWith([]),
    ),
    { initialValue: [] as SearchResult[] }
  );
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
    button { cursor: pointer; font-family: 'Inter', sans-serif; }
    .buscador { background: #161B22; border: 1px solid #30363D; border-radius: 12px; padding: 1.75rem; width: 100%; max-width: 480px; }
    h2 { font-size: 1.05rem; font-weight: 600; margin-bottom: 1.25rem; }
    .search-box { position: relative; margin-bottom: 0.75rem; }
    .search-box input { width: 100%; background: #0D1117; border: 1px solid #30363D; border-radius: 8px; padding: 0.7rem 3rem 0.7rem 1rem; color: #E6EDF3; font-size: 0.9rem; font-family: 'Inter', sans-serif; outline: none; transition: border-color 150ms; }
    .search-box input:focus { border-color: #8B5CF6; box-shadow: 0 0 0 3px rgba(139,92,246,0.12); }
    .search-box input::placeholder { color: #8B949E; }
    .spinner-sm { position: absolute; right: 0.875rem; top: 50%; transform: translateY(-50%); width: 16px; height: 16px; border: 2px solid #30363D; border-top-color: #8B5CF6; border-radius: 50%; animation: spin 0.7s linear infinite; display: none; }
    @keyframes spin { to { transform: translateY(-50%) rotate(360deg); } }
    .log-panel { background: #0D1117; border: 1px solid #21262D; border-radius: 8px; padding: 0.75rem; margin-bottom: 0.875rem; min-height: 56px; }
    .log-title { font-family: 'JetBrains Mono', monospace; font-size: 0.68rem; color: #8B949E; margin-bottom: 0.4rem; }
    .log-entry { font-family: 'JetBrains Mono', monospace; font-size: 0.72rem; padding: 0.2rem 0; display: flex; align-items: center; gap: 0.5rem; }
    .log-entry.cancel { color: #f87171; }
    .log-entry.send { color: #60a5fa; }
    .log-entry.done { color: #4ade80; }
    .log-entry.debounce { color: #fbbf24; }
    .log-dot { width: 6px; height: 6px; border-radius: 50%; background: currentColor; flex-shrink: 0; }
    .resultados { display: flex; flex-direction: column; gap: 0.4rem; min-height: 40px; }
    .resultado { background: #21262D; border: 1px solid #30363D; border-radius: 8px; padding: 0.7rem 1rem; display: flex; flex-direction: column; gap: 0.15rem; animation: fadeIn 200ms ease; }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: none; } }
    .resultado strong { font-size: 0.875rem; font-weight: 600; color: #E6EDF3; }
    .resultado span { font-size: 0.75rem; color: #8B949E; }
    .hint { font-size: 0.78rem; color: #8B949E; padding: 0.5rem 0; }
  </style>
</head>
<body>
  <span class="component-label">app-buscador-reactivo</span>
  <div class="buscador">
    <h2>Buscar en Open Library</h2>
    <div class="search-box">
      <input type="text" id="search-input" placeholder="Escribe un titulo o autor..." autocomplete="off">
      <div class="spinner-sm" id="spinner"></div>
    </div>
    <div class="log-panel">
      <div class="log-title">// switchMap log</div>
      <div id="log"></div>
    </div>
    <div class="resultados" id="resultados"></div>
  </div>
  <script>
    var resultadosData = {
      'clean': [
        { titulo: 'Clean Code', autor: 'Robert C. Martin' },
        { titulo: 'Clean Architecture', autor: 'Robert C. Martin' },
        { titulo: 'The Clean Coder', autor: 'Robert C. Martin' },
      ],
      'angular': [
        { titulo: 'Pro Angular 17', autor: 'Adam Freeman' },
        { titulo: 'Angular Up & Running', autor: 'Shyam Seshadri' },
        { titulo: 'Learning Angular', autor: 'Aristeidis Bampakos' },
      ],
      'typescript': [
        { titulo: 'Programming TypeScript', autor: 'Boris Cherny' },
        { titulo: 'Effective TypeScript', autor: 'Dan Vanderkam' },
      ],
      'javascript': [
        { titulo: 'You Don\'t Know JS', autor: 'Kyle Simpson' },
        { titulo: 'JavaScript: The Good Parts', autor: 'Douglas Crockford' },
        { titulo: 'Eloquent JavaScript', autor: 'Marijn Haverbeke' },
      ],
    };
    var debounceTimer = null;
    var requestId = 0;
    var logEntries = [];
    function addLog(msg, cls) {
      logEntries.push({ msg: msg, cls: cls });
      if (logEntries.length > 4) { logEntries = logEntries.slice(-4); }
      var logEl = document.getElementById('log');
      logEl.innerHTML = logEntries.map(function(e) {
        return '<div class="log-entry ' + e.cls + '"><span class="log-dot"></span>' + e.msg + '</div>';
      }).join('');
    }
    function findResults(q) {
      var key = Object.keys(resultadosData).find(function(k) { return k.includes(q.toLowerCase()) || q.toLowerCase().includes(k); });
      return key ? resultadosData[key] : [];
    }
    function renderResultados(items) {
      var el = document.getElementById('resultados');
      if (!items.length) {
        el.innerHTML = '<p class="hint">Sin resultados</p>';
      } else {
        el.innerHTML = items.map(function(l) {
          return '<div class="resultado"><strong>' + l.titulo + '</strong><span>' + l.autor + '</span></div>';
        }).join('');
      }
    }
    document.getElementById('search-input').addEventListener('input', function(e) {
      var val = e.target.value;
      if (debounceTimer) {
        clearTimeout(debounceTimer);
        if (requestId > 0) { addLog('cancelando peticion #' + requestId + '...', 'cancel'); }
      }
      if (val.length < 2) {
        document.getElementById('resultados').innerHTML = '';
        document.getElementById('spinner').style.display = 'none';
        return;
      }
      addLog('debounceTime(300) — esperando pausa...', 'debounce');
      debounceTimer = setTimeout(function() {
        requestId++;
        var myId = requestId;
        document.getElementById('spinner').style.display = 'block';
        addLog('switchMap — GET /search?q=' + val + ' [#' + myId + ']', 'send');
        setTimeout(function() {
          if (myId !== requestId) {
            addLog('respuesta #' + myId + ' ignorada (cancelada)', 'cancel');
            return;
          }
          document.getElementById('spinner').style.display = 'none';
          var results = findResults(val);
          addLog('respuesta #' + myId + ' OK (' + results.length + ' items)', 'done');
          renderResultados(results);
        }, 700);
      }, 500);
    });
  </script>
</body>
</html>`,
    aiContext:
      'El usuario está aprendiendo switchMap, debounceTime y distinctUntilChanged en Angular 19 para construir un buscador en tiempo real. Ha visto el patrón toObservable(signal) → debounceTime → distinctUntilChanged → filter → switchMap → HTTP. Puede preguntar sobre la diferencia entre switchMap, mergeMap y concatMap, sobre cuándo usar cada uno, o sobre el patrón de búsqueda reactiva.',
    introMessage:
      'Esta lección muestra el patrón más común de RxJS en aplicaciones Angular: búsqueda reactiva con `switchMap`.\n\nEl log del preview visualiza en tiempo real cómo `debounceTime` espera, cómo `switchMap` cancela peticiones anteriores, y cuándo llega finalmente la respuesta válida.\n\nEscribe algo en el buscador para verlo en acción. Luego pregúntame sobre `switchMap` vs `mergeMap` o sobre cómo funciona la cancelación de observables.',
    suggestedQuestions: [
      '¿Cuál es la diferencia entre switchMap, mergeMap y concatMap?',
      '¿Cómo funciona realmente la cancelación de peticiones en switchMap?',
      '¿Puedo hacer lo mismo con async/await en lugar de switchMap?',
    ],
  },

  {
    id: 'L7.4',
    module: 7,
    moduleTitle: 'HTTP y RxJS',
    title: 'Interceptores: Lógica transversal en HTTP',
    subtitle: 'HttpInterceptorFn, autenticación, logging y manejo global de errores',
    estimatedMinutes: 16,
    xpReward: 150,
    prerequisites: ['L7.3'],
    nextLesson: 'L7.5',
    language: 'typescript',
    narrative: [
      {
        type: 'text',
        content:
          'Los interceptores son middleware para tus peticiones HTTP: se ejecutan automáticamente en cada petición y respuesta, sin que tengas que modificar ningún servicio. Son el lugar correcto para añadir tokens de autenticación, medir tiempos, registrar errores globales, o transformar respuestas de forma centralizada.',
      },
      {
        type: 'tip',
        variant: 'info',
        content:
          'En Angular 17+ los interceptores son funciones simples, no clases. `HttpInterceptorFn` recibe la petición (`req`) y la función `next` para continuar la cadena. Puedes usar `inject()` dentro del interceptor para acceder a servicios.',
      },
      {
        type: 'text',
        content:
          'Los interceptores se registran en orden en `provideHttpClient(withInterceptors([auth, logging, error]))` — se ejecutan en ese orden para las peticiones salientes y en orden inverso para las respuestas entrantes. El orden importa: pon `auth` antes de `logging` para que el log ya tenga el token.',
      },
      {
        type: 'tip',
        variant: 'angular',
        content:
          '`req.clone()` crea una copia inmutable de la petición con los cambios que le pases. Los objetos `HttpRequest` son inmutables — nunca los modifiques directamente. Siempre clona y pasa el clon al `next`.',
      },
      {
        type: 'checkpoint',
        question: '¿Cómo accedes a servicios de Angular dentro de un interceptor funcional?',
        options: ['No se puede — los interceptores no tienen DI', 'Con constructor(private svc: MyService)', 'Con inject(MyService) directamente dentro de la función', 'Importando el servicio como módulo'],
        correct: 2,
        explanation:
          'Los interceptores funcionales se ejecutan en un contexto de inyección válido, por lo que puedes llamar a `inject(MiServicio)` directamente dentro de la función. Esto funciona igual que en constructores de componentes o en `effect()`.',
      },
    ],
    starterCode: `import { inject } from '@angular/core';
import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { tap, catchError, throwError } from 'rxjs';

// 📚 Biblioteca Angular — Interceptores HTTP
// Los interceptores son middleware: se ejecutan en cada petición automáticamente

// ── 1. Interceptor de autenticación ──────────────────────────
// Añade el token Bearer a todas las peticiones
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // inject() funciona dentro de interceptores funcionales
  // const auth = inject(AuthService);
  // const token = auth.token();
  const token = 'demo-jwt-token-xyz';

  // req es inmutable — siempre clona antes de modificar
  const authReq = req.clone({
    headers: req.headers.set('Authorization', 'Bearer ' + token),
  });

  return next(authReq);
};

// ── 2. Interceptor de logging ─────────────────────────────────
// Mide el tiempo de cada petición y lo registra
export const loggingInterceptor: HttpInterceptorFn = (req, next) => {
  const inicio = Date.now();

  return next(req).pipe(
    tap({
      next: () => {
        const ms = Date.now() - inicio;
        console.log(\`[HTTP] \${req.method} \${req.url} — \${ms}ms\`);
      },
    })
  );
};

// ── 3. Interceptor de errores ─────────────────────────────────
// Manejo global de errores HTTP
export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        console.error('[Auth] Token expirado — redirigiendo al login');
        // inject(Router).navigate(['/login']);
      } else if (error.status === 500) {
        console.error('[Server] Error interno:', error.message);
      } else if (error.status === 0) {
        console.error('[Network] Sin conexión a internet');
      }

      // Re-lanza el error para que los servicios individuales también lo puedan manejar
      return throwError(() => error);
    })
  );
};

// ── Registro en app.config.ts ─────────────────────────────────
// export const appConfig: ApplicationConfig = {
//   providers: [
//     provideHttpClient(
//       withInterceptors([authInterceptor, loggingInterceptor, errorInterceptor])
//     ),
//   ],
// };
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
    .panel { background: #161B22; border: 1px solid #30363D; border-radius: 12px; padding: 1.75rem; width: 100%; max-width: 520px; }
    h2 { font-size: 1.05rem; font-weight: 600; margin-bottom: 1.25rem; }
    .interceptors { display: flex; gap: 0.5rem; margin-bottom: 1.25rem; flex-wrap: wrap; }
    .badge-int { font-size: 0.72rem; font-weight: 600; padding: 0.25em 0.65em; border-radius: 20px; border: 1px solid; }
    .badge-auth { background: rgba(139,92,246,0.1); color: #a78bfa; border-color: rgba(139,92,246,0.3); }
    .badge-log { background: rgba(251,191,36,0.1); color: #fbbf24; border-color: rgba(251,191,36,0.3); }
    .badge-err { background: rgba(239,68,68,0.1); color: #f87171; border-color: rgba(239,68,68,0.3); }
    .controls { display: flex; gap: 0.5rem; margin-bottom: 1rem; flex-wrap: wrap; }
    .btn { background: #21262D; border: 1px solid #30363D; color: #8B949E; border-radius: 6px; padding: 0.4rem 0.875rem; font-size: 0.8rem; transition: all 150ms; }
    .btn:hover { border-color: #8B5CF6; color: #c4b5fd; }
    .btn.primary { background: #8B5CF6; border-color: #8B5CF6; color: white; }
    .btn.primary:hover { opacity: 0.85; }
    .btn.danger { border-color: rgba(239,68,68,0.4); color: #f87171; }
    .btn.danger:hover { background: rgba(239,68,68,0.1); }
    .log-panel { background: #0D1117; border: 1px solid #21262D; border-radius: 8px; font-family: 'JetBrains Mono', monospace; font-size: 0.72rem; overflow: hidden; }
    .log-header { display: flex; align-items: center; justify-content: space-between; padding: 0.5rem 0.875rem; border-bottom: 1px solid #21262D; color: #8B949E; }
    .log-header span { font-size: 0.68rem; }
    .log-body { padding: 0.5rem; max-height: 280px; overflow-y: auto; display: flex; flex-direction: column; gap: 0; }
    .log-line { padding: 0.3rem 0.375rem; border-radius: 4px; display: flex; align-items: flex-start; gap: 0.5rem; line-height: 1.4; }
    .log-line:hover { background: rgba(255,255,255,0.02); }
    .log-time { color: #8B949E; flex-shrink: 0; font-size: 0.68rem; }
    .log-tag { flex-shrink: 0; font-weight: 600; font-size: 0.68rem; }
    .tag-auth { color: #a78bfa; }
    .tag-log { color: #fbbf24; }
    .tag-err { color: #f87171; }
    .tag-net { color: #60a5fa; }
    .log-msg { color: #E6EDF3; word-break: break-all; }
    .log-msg .hl { color: #4ade80; }
    .log-msg .hl-err { color: #f87171; }
    .log-msg .hl-warn { color: #fbbf24; }
    .empty-log { color: #8B949E; text-align: center; padding: 1.5rem; font-size: 0.75rem; }
  </style>
</head>
<body>
  <span class="component-label">interceptores HTTP</span>
  <div class="panel">
    <h2>Request Log — Interceptores activos</h2>
    <div class="interceptors">
      <span class="badge-int badge-auth">authInterceptor</span>
      <span class="badge-int badge-log">loggingInterceptor</span>
      <span class="badge-int badge-err">errorInterceptor</span>
    </div>
    <div class="controls">
      <button class="btn primary" onclick="makeRequest('GET', '/api/libros', 200)">GET /libros</button>
      <button class="btn" onclick="makeRequest('POST', '/api/libros', 201)">POST /libros</button>
      <button class="btn danger" onclick="makeRequest('GET', '/api/admin', 401)">GET 401</button>
      <button class="btn danger" onclick="makeRequest('GET', '/api/data', 500)">GET 500</button>
      <button class="btn" onclick="clearLog()" style="margin-left:auto">Limpiar</button>
    </div>
    <div class="log-panel">
      <div class="log-header">
        <span>HTTP Interceptor Console</span>
        <span id="req-count">0 peticiones</span>
      </div>
      <div class="log-body" id="log-body">
        <div class="empty-log">Haz click en un boton para simular una peticion...</div>
      </div>
    </div>
  </div>
  <script>
    var reqCount = 0;
    var logs = [];
    function ts() {
      var d = new Date();
      return d.getHours().toString().padStart(2,'0') + ':' + d.getMinutes().toString().padStart(2,'0') + ':' + d.getSeconds().toString().padStart(2,'0') + '.' + d.getMilliseconds().toString().padStart(3,'0');
    }
    function addLog(time, tag, tagCls, msg) {
      logs.push({ time: time, tag: tag, tagCls: tagCls, msg: msg });
      renderLog();
    }
    function renderLog() {
      var body = document.getElementById('log-body');
      if (!logs.length) { body.innerHTML = '<div class="empty-log">Haz click en un boton...</div>'; return; }
      body.innerHTML = logs.map(function(l) {
        return '<div class="log-line"><span class="log-time">' + l.time + '</span><span class="log-tag ' + l.tagCls + '">[' + l.tag + ']</span><span class="log-msg">' + l.msg + '</span></div>';
      }).join('');
      body.scrollTop = body.scrollHeight;
    }
    function clearLog() { logs = []; renderLog(); }
    function makeRequest(method, url, status) {
      reqCount++;
      document.getElementById('req-count').textContent = reqCount + ' peticiones';
      var t0 = ts();
      addLog(t0, 'auth', 'tag-auth', method + ' <span class="hl">' + url + '</span> — Authorization: Bearer <span class="hl">demo-jwt-token...</span>');
      addLog(ts(), 'log', 'tag-log', method + ' ' + url + ' — enviando...');
      addLog(ts(), 'net', 'tag-net', 'Request saliendo hacia el servidor');
      var delay = 400 + Math.random() * 600;
      setTimeout(function() {
        var ms = Math.round(delay);
        if (status === 200 || status === 201) {
          addLog(ts(), 'log', 'tag-log', method + ' ' + url + ' — <span class="hl">' + status + ' OK</span> (' + ms + 'ms)');
        } else if (status === 401) {
          addLog(ts(), 'err', 'tag-err', '<span class="hl-err">401 Unauthorized</span> — Token expirado — redirigiendo a /login');
        } else if (status === 500) {
          addLog(ts(), 'err', 'tag-err', '<span class="hl-err">500 Internal Server Error</span> — Error interno del servidor');
        }
      }, delay);
    }
  </script>
</body>
</html>`,
    aiContext:
      'El usuario está aprendiendo interceptores HTTP funcionales en Angular 17+. Ha visto authInterceptor (añade Bearer token), loggingInterceptor (mide tiempos) y errorInterceptor (manejo global de 401/500/0). Puede preguntar sobre el orden de interceptores, cómo usar inject() dentro de ellos, cómo testearlos, o sobre la diferencia con los interceptores de clase del estilo Angular anterior.',
    introMessage:
      'Esta lección muestra el poder de los interceptores HTTP funcionales de Angular.\n\nEl preview simula peticiones reales y muestra en el log cómo cada interceptor actúa en orden: `authInterceptor` añade el token, `loggingInterceptor` mide el tiempo, y `errorInterceptor` captura los errores 401 y 500.\n\nPrueba los distintos botones del preview y pregúntame sobre el orden de interceptores, cómo usar `inject()` dentro de ellos, o cómo testear interceptores.',
    suggestedQuestions: [
      '¿En qué orden se ejecutan los interceptores — entrada y salida?',
      '¿Cómo puedo saltar un interceptor para ciertas peticiones?',
      '¿Cómo testeo un interceptor con HttpTestingController?',
    ],
  },

  {
    id: 'L7.5',
    module: 7,
    moduleTitle: 'HTTP y RxJS',
    title: 'resource API: el futuro reactivo de Angular',
    subtitle: 'resource(), linkedSignal y estado async declarativo sin suscripciones',
    estimatedMinutes: 18,
    xpReward: 160,
    prerequisites: ['L7.4'],
    nextLesson: 'L8.1',
    language: 'typescript',
    achievements: [
      {
        id: 'http-maestro',
        name: 'HTTP Maestro',
        description: 'Dominaste HTTP, RxJS e interceptores en Angular 19',
        icon: '🌐',
      },
    ],
    narrative: [
      {
        type: 'text',
        content:
          'Angular 19 introduce `resource()` — una API declarativa para manejar datos asíncronos sin escribir `subscribe()`, `toSignal()`, ni gestionar manualmente estados de carga. Defines qué datos necesitas (`request`) y cómo obtenerlos (`loader`), y Angular gestiona automáticamente los estados: `idle`, `loading`, `loaded`, `error`, `reloading`.',
      },
      {
        type: 'tip',
        variant: 'info',
        content:
          '`resource()` es reactivo por diseño: si el signal de `request` cambia (por ejemplo, el género seleccionado), Angular automáticamente cancela la operación en curso y dispara una nueva. No necesitas `switchMap` ni nada de RxJS para este patrón.',
      },
      {
        type: 'text',
        content:
          'El `loader` recibe el valor de `request` y debe devolver una `Promise<T>`. Esto hace que `resource()` sea ideal para usar con `fetch()` nativo. Para integrarlo con `HttpClient` (que devuelve Observables), convierte con `firstValueFrom(observable)`.',
      },
      {
        type: 'tip',
        variant: 'angular',
        content:
          '`linkedSignal()` es el complemento perfecto de `resource()` — crea un signal que se resetea cuando otra dependencia cambia. Úsalo para el estado de la página de paginación: cuando el usuario cambia de categoría, `linkedSignal` resetea automáticamente la página a 1.',
      },
      {
        type: 'checkpoint',
        question: '¿Qué pasa con una operación en curso cuando el signal de request cambia en resource()?',
        options: [
          'Se espera a que termine antes de empezar la nueva',
          'Angular la cancela automáticamente y dispara una nueva operación',
          'Ambas corren en paralelo y gana la que llegue primero',
          'Lanza un error y hay que manejar la concurrencia manualmente',
        ],
        correct: 1,
        explanation:
          'Igual que `switchMap`, `resource()` cancela la operación en curso cuando `request` cambia y dispara una nueva. Es el comportamiento por defecto y es seguro — nunca verás datos desactualizados en la UI. Angular gestiona esto sin que tengas que escribir nada extra.',
      },
    ],
    starterCode: `import { Component, signal, computed, ChangeDetectionStrategy } from '@angular/core';
import { resource, linkedSignal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';

// 📚 Biblioteca Angular — resource() API (Angular 19)
// Estado async declarativo: Angular gestiona loading/error/reloading

interface Libro {
  id: number;
  titulo: string;
  autor: string;
  anio: number;
  paginas: number;
}

const CATALOGO: Record<string, Libro[]> = {
  programacion: [
    { id: 1, titulo: 'Clean Code', autor: 'Robert C. Martin', anio: 2008, paginas: 431 },
    { id: 2, titulo: 'The Pragmatic Programmer', autor: 'Hunt & Thomas', anio: 2019, paginas: 352 },
    { id: 3, titulo: 'Refactoring', autor: 'Martin Fowler', anio: 2018, paginas: 448 },
  ],
  arquitectura: [
    { id: 4, titulo: 'Clean Architecture', autor: 'Robert C. Martin', anio: 2017, paginas: 432 },
    { id: 5, titulo: 'Designing Data-Intensive Applications', autor: 'Martin Kleppmann', anio: 2017, paginas: 611 },
  ],
  javascript: [
    { id: 6, titulo: 'You Don\'t Know JS', autor: 'Kyle Simpson', anio: 2015, paginas: 296 },
    { id: 7, titulo: 'JavaScript: The Good Parts', autor: 'Douglas Crockford', anio: 2008, paginas: 172 },
  ],
};

@Component({
  selector: 'app-catalogo-resource',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: \`
    <div class="catalogo">
      <h2>Catálogo por Género</h2>

      <div class="generos">
        @for (g of generos; track g.key) {
          <button
            [class.activo]="generoActivo() === g.key"
            (click)="generoActivo.set(g.key)"
          >{{ g.label }}</button>
        }
      </div>

      <!-- resource.status() puede ser: idle | loading | loaded | error | reloading -->
      @switch (librosResource.status()) {
        @case ('loading') {
          <div class="loading">Cargando {{ generoActivo() }}...</div>
        }
        @case ('error') {
          <div class="error">
            Error: {{ librosResource.error() }}
            <button (click)="librosResource.reload()">Reintentar</button>
          </div>
        }
        @default {
          <div class="lista">
            @for (libro of librosResource.value() ?? []; track libro.id) {
              <div class="libro">
                <strong>{{ libro.titulo }}</strong>
                <span>{{ libro.autor }} · {{ libro.paginas }} pág.</span>
              </div>
            }
          </div>
        }
      }

      <p class="status-hint">
        Estado: {{ librosResource.status() }} ·
        {{ librosResource.value()?.length ?? 0 }} libros
      </p>
    </div>
  \`,
})
export class CatalogoResourceComponent {
  readonly generos = [
    { key: 'programacion', label: 'Programación' },
    { key: 'arquitectura', label: 'Arquitectura' },
    { key: 'javascript', label: 'JavaScript' },
  ];

  readonly generoActivo = signal('programacion');

  // linkedSignal: se resetea automáticamente cuando generoActivo cambia
  readonly pagina = linkedSignal(() => {
    this.generoActivo(); // dependencia — cuando cambia, vuelve a 1
    return 1;
  });

  // resource(): cuando generoActivo cambia, Angular cancela y refetch automático
  readonly librosResource = resource({
    request: () => ({ genero: this.generoActivo(), pagina: this.pagina() }),
    loader: async ({ request }) => {
      // Simula latencia de red
      await new Promise(r => setTimeout(r, 600));
      const libros = CATALOGO[request.genero] ?? [];
      return libros;
    },
  });
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
    button { cursor: pointer; font-family: 'Inter', sans-serif; }
    .catalogo { background: #161B22; border: 1px solid #30363D; border-radius: 12px; padding: 1.75rem; width: 100%; max-width: 480px; }
    h2 { font-size: 1.05rem; font-weight: 600; margin-bottom: 1.25rem; }
    .generos { display: flex; gap: 0.5rem; margin-bottom: 1.25rem; flex-wrap: wrap; }
    .genero-btn { background: #21262D; border: 1px solid #30363D; color: #8B949E; border-radius: 20px; padding: 0.35rem 0.875rem; font-size: 0.8rem; transition: all 150ms; }
    .genero-btn:hover { border-color: #8B5CF6; color: #c4b5fd; }
    .genero-btn.activo { background: rgba(139,92,246,0.15); border-color: #8B5CF6; color: #c4b5fd; font-weight: 600; }
    .resource-state { display: flex; align-items: center; gap: 0.5rem; margin-bottom: 1rem; font-family: 'JetBrains Mono', monospace; font-size: 0.72rem; }
    .state-label { color: #8B949E; }
    .state-value { padding: 0.15em 0.5em; border-radius: 4px; font-weight: 600; }
    .state-loading { background: rgba(251,191,36,0.1); color: #fbbf24; border: 1px solid rgba(251,191,36,0.25); }
    .state-loaded { background: rgba(34,197,94,0.1); color: #4ade80; border: 1px solid rgba(34,197,94,0.2); }
    .state-reloading { background: rgba(96,165,250,0.1); color: #60a5fa; border: 1px solid rgba(96,165,250,0.2); }
    .loading-area { display: flex; align-items: center; gap: 0.875rem; padding: 1.5rem; background: #0D1117; border: 1px solid #21262D; border-radius: 8px; }
    .spinner { width: 20px; height: 20px; border: 2px solid #30363D; border-top-color: #8B5CF6; border-radius: 50%; animation: spin 0.7s linear infinite; flex-shrink: 0; }
    @keyframes spin { to { transform: rotate(360deg); } }
    .loading-text { font-size: 0.85rem; color: #8B949E; }
    .lista { display: flex; flex-direction: column; gap: 0.5rem; }
    .libro { background: #21262D; border: 1px solid #30363D; border-radius: 8px; padding: 0.875rem 1rem; display: flex; flex-direction: column; gap: 0.2rem; animation: slideIn 250ms ease-out; transition: border-color 150ms; }
    .libro:hover { border-color: #8B5CF6; }
    @keyframes slideIn { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: none; } }
    .libro strong { font-size: 0.875rem; font-weight: 600; color: #E6EDF3; }
    .libro span { font-size: 0.75rem; color: #8B949E; }
    .status-bar { margin-top: 1rem; padding-top: 0.875rem; border-top: 1px solid #21262D; display: flex; align-items: center; justify-content: space-between; }
    .status-info { font-family: 'JetBrains Mono', monospace; font-size: 0.7rem; color: #8B949E; }
    .reload-btn { background: transparent; border: 1px solid #30363D; color: #8B949E; border-radius: 6px; padding: 0.3rem 0.6rem; font-size: 0.72rem; transition: all 150ms; }
    .reload-btn:hover { border-color: #8B5CF6; color: #c4b5fd; }
    .linked-signal-tag { font-family: 'JetBrains Mono', monospace; font-size: 0.68rem; color: #f59e0b; background: rgba(245,158,11,0.08); border: 1px solid rgba(245,158,11,0.2); border-radius: 4px; padding: 0.1em 0.4em; }
  </style>
</head>
<body>
  <span class="component-label">app-catalogo-resource</span>
  <div class="catalogo">
    <h2>Catalogo por Genero</h2>
    <div class="generos" id="generos"></div>
    <div class="resource-state">
      <span class="state-label">resource.status():</span>
      <span class="state-value" id="state-badge">idle</span>
      <span class="linked-signal-tag" id="pagina-tag">pagina: 1</span>
    </div>
    <div id="content"></div>
    <div class="status-bar">
      <span class="status-info" id="status-info">0 libros cargados</span>
      <button class="reload-btn" id="reload-btn">.reload()</button>
    </div>
  </div>
  <script>
    var catalogo = {
      programacion: [
        { titulo: 'Clean Code', autor: 'Robert C. Martin', paginas: 431 },
        { titulo: 'The Pragmatic Programmer', autor: 'Hunt & Thomas', paginas: 352 },
        { titulo: 'Refactoring', autor: 'Martin Fowler', paginas: 448 },
      ],
      arquitectura: [
        { titulo: 'Clean Architecture', autor: 'Robert C. Martin', paginas: 432 },
        { titulo: 'Designing Data-Intensive Applications', autor: 'Martin Kleppmann', paginas: 611 },
      ],
      javascript: [
        { titulo: "You Don't Know JS", autor: 'Kyle Simpson', paginas: 296 },
        { titulo: 'JavaScript: The Good Parts', autor: 'Douglas Crockford', paginas: 172 },
        { titulo: 'Eloquent JavaScript', autor: 'Marijn Haverbeke', paginas: 472 },
      ],
    };
    var generos = [
      { key: 'programacion', label: 'Programacion' },
      { key: 'arquitectura', label: 'Arquitectura' },
      { key: 'javascript', label: 'JavaScript' },
    ];
    var generoActivo = 'programacion';
    var pagina = 1;
    var loadTimer = null;
    function renderGeneros() {
      document.getElementById('generos').innerHTML = generos.map(function(g) {
        return '<button class="genero-btn' + (g.key === generoActivo ? ' activo' : '') + '" onclick="selectGenero(\'' + g.key + '\')">' + g.label + '</button>';
      }).join('');
    }
    function setStateBadge(s) {
      var el = document.getElementById('state-badge');
      el.textContent = s;
      el.className = 'state-value';
      if (s === 'loading' || s === 'reloading') { el.classList.add(s === 'loading' ? 'state-loading' : 'state-reloading'); }
      else if (s === 'loaded') { el.classList.add('state-loaded'); }
    }
    function loadGenero(g, isReload) {
      if (loadTimer) { clearTimeout(loadTimer); }
      pagina = 1;
      document.getElementById('pagina-tag').textContent = 'pagina: ' + pagina;
      setStateBadge(isReload ? 'reloading' : 'loading');
      document.getElementById('content').innerHTML = '<div class="loading-area"><div class="spinner"></div><span class="loading-text">resource() cargando ' + g + '...</span></div>';
      loadTimer = setTimeout(function() {
        var libros = catalogo[g] || [];
        setStateBadge('loaded');
        document.getElementById('status-info').textContent = libros.length + ' libros cargados';
        document.getElementById('content').innerHTML = '<div class="lista">' + libros.map(function(l) {
          return '<div class="libro"><strong>' + l.titulo + '</strong><span>' + l.autor + ' · ' + l.paginas + ' pag.</span></div>';
        }).join('') + '</div>';
      }, 700);
    }
    function selectGenero(g) {
      generoActivo = g;
      renderGeneros();
      loadGenero(g, false);
    }
    document.getElementById('reload-btn').addEventListener('click', function() { loadGenero(generoActivo, true); });
    renderGeneros();
    loadGenero(generoActivo, false);
  </script>
</body>
</html>`,
    aiContext:
      'El usuario acaba de terminar el módulo 7 sobre HTTP y RxJS. Ha aprendido resource() de Angular 19, linkedSignal(), y el patrón declarativo de manejo de estado async sin suscripciones manuales. Puede preguntar sobre httpResource (la versión HTTP-específica), sobre la diferencia con toSignal(), sobre resource vs TanStack Query, o sobre cuándo elegir resource() vs el pipeline RxJS completo.',
    introMessage:
      'Esta última lección del módulo 7 te muestra `resource()` — la API declarativa de Angular 19 para datos asíncronos.\n\nSin `subscribe()`, sin `toSignal()`, sin pipes RxJS. Defines el `request` (qué quieres) y el `loader` (cómo obtenerlo), y Angular gestiona todo: loading, error, reloading y cancelación automática.\n\nPrueba cambiar de género en el preview y observa cómo `resource.status()` transita de `loading` a `loaded` automáticamente. Pregúntame sobre `resource()`, `linkedSignal()`, o sobre cuándo preferirlo sobre el pipeline RxJS.',
    suggestedQuestions: [
      '¿Cuándo usar resource() y cuándo el pipeline RxJS clásico?',
      '¿Existe httpResource() — una versión integrada con HttpClient?',
      '¿Cómo manejo paginación o carga incremental con resource()?',
    ],
  },
];
