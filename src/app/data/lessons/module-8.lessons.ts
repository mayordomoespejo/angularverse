import type { Lesson } from '../../core/models/lesson.model';

export const MODULE_8_LESSONS: Lesson[] = [
  {
    id: 'L8.1',
    module: 8,
    moduleTitle: 'Estado Global con Signals',
    title: 'El patrón Store con Signals: Estado global sin librerías',
    subtitle: 'Servicios como fuentes de verdad únicas con signals privados y API pública',
    estimatedMinutes: 15,
    xpReward: 160,
    prerequisites: ['L7.4'],
    nextLesson: 'L8.2',
    language: 'typescript',
    narrative: [
      {
        type: 'text',
        content:
          'Cuando dos o más componentes necesitan compartir estado, necesitas un lugar central donde viva ese estado. En Angular moderno, la solución más elegante es un servicio inyectable que usa signals internamente. Este patrón, llamado "Feature Store", te da gestión de estado predecible sin añadir una sola dependencia externa.',
      },
      {
        type: 'tip',
        variant: 'info',
        content:
          'La regla de oro del patrón Store: los signals son privados, la mutación solo ocurre a través de métodos del servicio, y lo que expones hacia afuera es de solo lectura con `.asReadonly()`. Nadie fuera del store puede romper el estado accidentalmente.',
      },
      {
        type: 'text',
        content:
          '`computed()` es el aliado natural del store: filtros, totales, estadísticas derivadas — todo vive dentro del store como valores calculados. Los componentes solo suscriben a lo que necesitan y Angular actualiza solo lo que cambió. No hay `ChangeDetectorRef.markForCheck()`, no hay Subject ni BehaviorSubject de RxJS — solo signals.',
      },
      {
        type: 'tip',
        variant: 'angular',
        content:
          'AngularVerse mismo usa este patrón para gestionar el progreso del usuario: un `ProgressStore` con signals privados para XP, lecciones completadas y logros. Cada componente que muestra la barra de progreso lee del mismo store sin acoplarse a ningún otro componente.',
      },
      {
        type: 'checkpoint',
        question: '¿Por qué los signals internos de un store deben ser privados?',
        options: [
          'Por convención de estilo, no hay razón técnica',
          'Para que solo los métodos del store puedan mutarlos, manteniendo el flujo de datos predecible',
          'Porque Angular no permite signals públicos en servicios',
          'Para mejorar el rendimiento de la detección de cambios',
        ],
        correct: 1,
        explanation:
          'Si los signals fueran públicos, cualquier componente podría llamar a `.set()` directamente y el estado mutaría desde cualquier lugar. Con signals privados y métodos públicos, hay un único camino para mutar el estado — los métodos del store — lo que hace los bugs mucho más fáciles de rastrear.',
      },
    ],
    starterCode: `import { Injectable, signal, computed, effect, inject } from '@angular/core';
import { Component, ChangeDetectionStrategy } from '@angular/core';

// 📚 Biblioteca Angular — Feature Store con Signals
// Un servicio como fuente de verdad única para toda la app

interface Libro {
  id: number;
  titulo: string;
  autor: string;
  genero: string;
}

// ── Store: fuente de verdad única ────────────────────────────
@Injectable({ providedIn: 'root' })
export class BibliotecaStore {
  // Signals PRIVADOS — solo el store puede mutarlos
  private readonly _libros = signal<Libro[]>([
    { id: 1, titulo: 'Clean Code', autor: 'Robert C. Martin', genero: 'Programación' },
    { id: 2, titulo: 'The Pragmatic Programmer', autor: 'Hunt & Thomas', genero: 'Programación' },
    { id: 3, titulo: 'Dune', autor: 'Frank Herbert', genero: 'Ciencia Ficción' },
    { id: 4, titulo: 'Sapiens', autor: 'Yuval Noah Harari', genero: 'Historia' },
  ]);

  private readonly _favoritos = signal<Set<number>>(new Set());
  private readonly _filtro = signal<string>('');

  // API PÚBLICA de solo lectura — los componentes solo pueden leer
  readonly libros = this._libros.asReadonly();
  readonly filtro = this._filtro.asReadonly();

  // computed() para estado derivado — vive dentro del store
  readonly librosFiltrados = computed(() => {
    const f = this._filtro().toLowerCase();
    if (!f) return this._libros();
    return this._libros().filter(
      l => l.titulo.toLowerCase().includes(f) || l.autor.toLowerCase().includes(f)
    );
  });

  readonly totalFavoritos = computed(() => this._favoritos().size);

  readonly esFavorito = (id: number) => computed(() => this._favoritos().has(id));

  constructor() {
    // effect() para sincronizar con localStorage
    effect(() => {
      const ids = [...this._favoritos()];
      localStorage.setItem('favoritos', JSON.stringify(ids));
    });
  }

  // Métodos de mutación — la única forma de cambiar el estado
  setFiltro(valor: string): void {
    this._filtro.set(valor);
  }

  toggleFavorito(id: number): void {
    this._favoritos.update(favs => {
      const nuevo = new Set(favs);
      nuevo.has(id) ? nuevo.delete(id) : nuevo.add(id);
      return nuevo;
    });
  }
}

// ── Componente que consume el store ──────────────────────────
@Component({
  selector: 'app-biblioteca-dashboard',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: \`
    <div class="dashboard">
      <header class="dashboard-header">
        <h2>Biblioteca</h2>
        <span class="favoritos-badge">
          ♥ {{ store.totalFavoritos() }} favoritos
        </span>
      </header>

      <div class="filtro-bar">
        <input
          type="text"
          placeholder="Filtrar libros..."
          [value]="store.filtro()"
          (input)="store.setFiltro($any($event.target).value)"
          class="filtro-input"
        />
      </div>

      <div class="lista-libros">
        @for (libro of store.librosFiltrados(); track libro.id) {
          <div class="libro-row">
            <div class="libro-info">
              <strong>{{ libro.titulo }}</strong>
              <span>{{ libro.autor }}</span>
            </div>
            <button
              class="btn-fav"
              [class.activo]="store.esFavorito(libro.id)()"
              (click)="store.toggleFavorito(libro.id)"
            >
              {{ store.esFavorito(libro.id)() ? '♥' : '♡' }}
            </button>
          </div>
        }

        @if (store.librosFiltrados().length === 0) {
          <p class="empty">Sin resultados para "{{ store.filtro() }}"</p>
        }
      </div>
    </div>
  \`,
})
export class BibliotecaDashboardComponent {
  readonly store = inject(BibliotecaStore);
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
    .dashboard { background: #161B22; border: 1px solid #30363D; border-radius: 12px; overflow: hidden; width: 100%; max-width: 420px; }
    .dashboard-header { display: flex; align-items: center; justify-content: space-between; padding: 1.25rem 1.5rem; border-bottom: 1px solid #30363D; }
    .dashboard-header h2 { font-size: 1rem; font-weight: 600; }
    .favoritos-badge { font-size: 0.8rem; color: #f472b6; background: rgba(244,114,182,0.1); border: 1px solid rgba(244,114,182,0.25); padding: 0.25em 0.6em; border-radius: 20px; font-weight: 500; transition: all 200ms; }
    .filtro-bar { padding: 1rem 1.5rem; border-bottom: 1px solid #21262D; }
    .filtro-input { width: 100%; background: #0D1117; border: 1px solid #30363D; border-radius: 6px; padding: 0.55rem 0.875rem; color: #E6EDF3; font-size: 0.875rem; font-family: 'Inter', sans-serif; outline: none; transition: border-color 150ms; }
    .filtro-input:focus { border-color: #7C3AED; }
    .filtro-input::placeholder { color: #8B949E; }
    .lista-libros { padding: 0.5rem 0; }
    .libro-row { display: flex; align-items: center; justify-content: space-between; padding: 0.75rem 1.5rem; border-bottom: 1px solid #21262D; transition: background 150ms; }
    .libro-row:last-child { border-bottom: none; }
    .libro-row:hover { background: rgba(255,255,255,0.02); }
    .libro-info { display: flex; flex-direction: column; gap: 0.15rem; }
    .libro-info strong { font-size: 0.875rem; font-weight: 600; color: #E6EDF3; }
    .libro-info span { font-size: 0.75rem; color: #8B949E; }
    .btn-fav { background: transparent; border: 1px solid #30363D; border-radius: 6px; color: #8B949E; padding: 0.35rem 0.6rem; font-size: 1rem; transition: all 150ms; line-height: 1; }
    .btn-fav:hover { border-color: #f472b6; color: #f472b6; }
    .btn-fav.activo { border-color: #f472b6; color: #f472b6; background: rgba(244,114,182,0.08); }
    .empty { padding: 1.5rem; text-align: center; color: #8B949E; font-size: 0.85rem; }
  </style>
</head>
<body>
  <span class="component-label">BibliotecaStore + app-biblioteca-dashboard</span>
  <div class="dashboard">
    <div class="dashboard-header">
      <h2>Biblioteca</h2>
      <span class="favoritos-badge" id="fav-count">♥ 0 favoritos</span>
    </div>
    <div class="filtro-bar">
      <input id="filtro" type="text" class="filtro-input" placeholder="Filtrar libros..." autocomplete="off">
    </div>
    <div class="lista-libros" id="lista"></div>
  </div>
  <script>
    const libros = [
      { id: 1, titulo: 'Clean Code', autor: 'Robert C. Martin' },
      { id: 2, titulo: 'The Pragmatic Programmer', autor: 'Hunt & Thomas' },
      { id: 3, titulo: 'Dune', autor: 'Frank Herbert' },
      { id: 4, titulo: 'Sapiens', autor: 'Yuval Noah Harari' },
    ];
    const favoritos = new Set();
    function render() {
      const f = document.getElementById('filtro').value.toLowerCase();
      const filtrados = f ? libros.filter(l => l.titulo.toLowerCase().includes(f) || l.autor.toLowerCase().includes(f)) : libros;
      document.getElementById('fav-count').textContent = '\u2665 ' + favoritos.size + ' favorito' + (favoritos.size !== 1 ? 's' : '');
      const lista = document.getElementById('lista');
      if (!filtrados.length) {
        lista.innerHTML = '<p class="empty">Sin resultados para "' + document.getElementById('filtro').value + '"</p>';
        return;
      }
      lista.innerHTML = filtrados.map(l => {
        const fav = favoritos.has(l.id);
        return '<div class="libro-row"><div class="libro-info"><strong>' + l.titulo + '</strong><span>' + l.autor + '</span></div><button class="btn-fav' + (fav ? ' activo' : '') + '" data-id="' + l.id + '">' + (fav ? '\u2665' : '\u2661') + '</button></div>';
      }).join('');
      lista.querySelectorAll('.btn-fav').forEach(btn => {
        btn.addEventListener('click', () => {
          const id = +btn.getAttribute('data-id');
          favoritos.has(id) ? favoritos.delete(id) : favoritos.add(id);
          render();
        });
      });
    }
    document.getElementById('filtro').addEventListener('input', render);
    render();
  </script>
</body>
</html>`,
    aiContext:
      'El usuario está aprendiendo el patrón Feature Store con signals en Angular 20. Ha visto BibliotecaStore: signals privados, asReadonly(), computed() para librosFiltrados y totalFavoritos, y effect() para sincronizar con localStorage. Puede preguntar sobre cuándo usar este patrón vs NgRx, sobre providedIn vs provide en el módulo, o sobre cómo compartir el store entre componentes en rutas diferentes.',
    introMessage:
      'En esta lección analizas el patrón Feature Store con Angular signals puros — sin NgRx, sin RxJS.\n\nEl código muestra `BibliotecaStore`: un servicio inyectable con signals privados, métodos de mutación, y `computed()` para filtrado y conteo de favoritos. El componente solo lee y llama a métodos — nunca muta directamente.\n\nPregúntame sobre el patrón store, asReadonly(), o cuándo vale la pena añadir NgRx.',
    suggestedQuestions: [
      '¿Por qué usar asReadonly() en lugar de simplemente no exponer el signal?',
      '¿Cómo comparto este store entre componentes en rutas distintas?',
      '¿Cuándo este patrón se queda corto y necesito NgRx?',
    ],
  },

  {
    id: 'L8.2',
    module: 8,
    moduleTitle: 'Estado Global con Signals',
    title: 'linkedSignal y resource: Estado asíncrono reactivo',
    subtitle: 'Reemplaza el trio loading/error/data con primitivas nativas de Angular',
    estimatedMinutes: 18,
    xpReward: 170,
    prerequisites: ['L8.1'],
    nextLesson: 'L8.3',
    language: 'typescript',
    narrative: [
      {
        type: 'text',
        content:
          'La gestión de estado asíncrono tradicional implica crear tres signals a mano: uno para los datos, uno para el estado de carga, y uno para el error. `resource()` encapsula ese patrón: declara la petición como un signal reactivo y Angular se encarga de orquestar loading/error/resolved automáticamente. Cuando la petición cambia, `resource` cancela la anterior y lanza la nueva.',
      },
      {
        type: 'tip',
        variant: 'info',
        content:
          '`resource.status()` devuelve un string tipado: "idle" | "loading" | "refreshing" | "resolved" | "error" | "local". "refreshing" es el estado intermedio cuando ya tienes datos pero estás refetchando — perfecto para mostrar un spinner sutil sin borrar el contenido anterior.',
      },
      {
        type: 'text',
        content:
          '`linkedSignal({ source, computation })` resuelve un problema diferente: estado que debe resetearse cuando otra cosa cambia. El caso clásico es un elemento seleccionado de una lista — cuando la lista cambia (por un filtro nuevo, por ejemplo), la selección debe volver a `null` automáticamente. Sin `linkedSignal` tendrías que acordarte de resetearla en cada método que cambia la fuente.',
      },
      {
        type: 'tip',
        variant: 'angular',
        content:
          '`resource()` es una API estable desde Angular 19.2. El loader recibe un objeto `{ request, abortSignal }` — usa `abortSignal` en tu `fetch()` para cancelar peticiones cuando el usuario cambia de filtro antes de que responda el servidor.',
      },
      {
        type: 'checkpoint',
        question: '¿Qué ventaja tiene resource() sobre gestionar loading/error/data con tres signals separados?',
        options: [
          'Es más rápido en tiempo de ejecución',
          'Coordina automáticamente los estados, cancela peticiones anteriores y maneja el ciclo de vida del request',
          'Permite usar async/await en los templates',
          'Solo funciona con HttpClient de Angular',
        ],
        correct: 1,
        explanation:
          '`resource()` coordina el ciclo de vida completo de una petición asíncrona: detecta cuando el request cambia, cancela la petición anterior, transiciona entre estados (loading → refreshing → resolved → error) y expone todo mediante signals. Con tres signals separados serías tú quien tendría que orquestar toda esa lógica.',
      },
    ],
    starterCode: `import { Component, signal, computed, linkedSignal, resource, ChangeDetectionStrategy } from '@angular/core';

// 📚 Biblioteca Angular — resource() y linkedSignal()
// Estado asíncrono reactivo sin gestionar loading/error/data a mano

interface Libro {
  id: number;
  titulo: string;
  autor: string;
}

// Simula una API que filtra por género con latencia de red
async function fetchLibrosPorGenero(genero: string, signal: AbortSignal): Promise<Libro[]> {
  await new Promise((res, rej) => {
    const t = setTimeout(res, 800);
    signal.addEventListener('abort', () => { clearTimeout(t); rej(new DOMException('aborted')); });
  });
  const catalogo: Record<string, Libro[]> = {
    'Programación': [
      { id: 1, titulo: 'Clean Code', autor: 'Robert C. Martin' },
      { id: 2, titulo: 'The Pragmatic Programmer', autor: 'Hunt & Thomas' },
      { id: 3, titulo: 'Refactoring', autor: 'Martin Fowler' },
    ],
    'Ciencia Ficción': [
      { id: 4, titulo: 'Dune', autor: 'Frank Herbert' },
      { id: 5, titulo: 'Foundation', autor: 'Isaac Asimov' },
    ],
    'Historia': [
      { id: 6, titulo: 'Sapiens', autor: 'Yuval Noah Harari' },
      { id: 7, titulo: 'Guns, Germs, and Steel', autor: 'Jared Diamond' },
    ],
  };
  return catalogo[genero] ?? [];
}

@Component({
  selector: 'app-catalogo-genero',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: \`
    <div class="catalogo">
      <h2>Catálogo por género</h2>

      <div class="generos">
        @for (g of generos; track g) {
          <button
            class="btn-genero"
            [class.activo]="generoSeleccionado() === g"
            (click)="generoSeleccionado.set(g)"
          >{{ g }}</button>
        }
      </div>

      <div class="resultados">
        @switch (librosResource.status()) {
          @case ('loading') {
            <div class="estado-carga">
              <span class="spinner"></span> Cargando {{ generoSeleccionado() }}...
            </div>
          }
          @case ('refreshing') {
            <div class="estado-carga sutil">Actualizando...</div>
          }
          @case ('error') {
            <div class="estado-error">Error al cargar libros</div>
          }
          @default {
            @for (libro of librosResource.value(); track libro.id) {
              <div
                class="libro-item"
                [class.seleccionado]="libroActivo()?.id === libro.id"
                (click)="libroActivo.set(libro)"
              >
                <strong>{{ libro.titulo }}</strong>
                <span>{{ libro.autor }}</span>
              </div>
            }
          }
        }
      </div>

      @if (libroActivo()) {
        <div class="detalle">
          <span class="detalle-label">Seleccionado:</span>
          <strong>{{ libroActivo()!.titulo }}</strong>
          <span class="detalle-reset-hint">(cambia de género para resetear)</span>
        </div>
      }
    </div>
  \`,
})
export class CatalogoGeneroComponent {
  readonly generos = ['Programación', 'Ciencia Ficción', 'Historia'];
  readonly generoSeleccionado = signal('Programación');

  // resource() — gestiona loading/error/data automáticamente
  // Cuando generoSeleccionado cambia, cancela la petición anterior y lanza una nueva
  readonly librosResource = resource({
    request: () => this.generoSeleccionado(),
    loader: async ({ request: genero, abortSignal }) =>
      fetchLibrosPorGenero(genero, abortSignal),
  });

  // linkedSignal — se resetea automáticamente cuando cambia la fuente (el género)
  // Sin esto tendrías que resetear libroActivo manualmente en cada setter del género
  readonly libroActivo = linkedSignal({
    source: this.generoSeleccionado,
    computation: () => null as Libro | null,
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
    .catalogo { background: #161B22; border: 1px solid #30363D; border-radius: 12px; padding: 1.5rem; width: 100%; max-width: 440px; }
    h2 { font-size: 1rem; font-weight: 600; margin-bottom: 1.25rem; }
    .generos { display: flex; gap: 0.5rem; flex-wrap: wrap; margin-bottom: 1.25rem; }
    .btn-genero { background: #21262D; border: 1px solid #30363D; color: #8B949E; border-radius: 6px; padding: 0.4rem 0.875rem; font-size: 0.8rem; font-weight: 500; transition: all 150ms; }
    .btn-genero:hover { border-color: #7C3AED; color: #c4b5fd; }
    .btn-genero.activo { background: rgba(124,58,237,0.15); border-color: #7C3AED; color: #c4b5fd; }
    .resultados { min-height: 140px; }
    .estado-carga { display: flex; align-items: center; gap: 0.6rem; padding: 1rem 0; color: #8B949E; font-size: 0.85rem; }
    .estado-carga.sutil { font-size: 0.75rem; color: #8B949E; padding: 0.5rem 0; }
    .spinner { width: 16px; height: 16px; border: 2px solid #30363D; border-top-color: #7C3AED; border-radius: 50%; animation: spin 700ms linear infinite; flex-shrink: 0; }
    @keyframes spin { to { transform: rotate(360deg); } }
    .libro-item { display: flex; flex-direction: column; gap: 0.15rem; padding: 0.7rem 0.875rem; border-radius: 6px; border: 1px solid transparent; margin-bottom: 0.35rem; cursor: pointer; transition: all 150ms; }
    .libro-item:hover { background: rgba(255,255,255,0.03); border-color: #30363D; }
    .libro-item.seleccionado { background: rgba(124,58,237,0.08); border-color: rgba(124,58,237,0.4); }
    .libro-item strong { font-size: 0.875rem; font-weight: 600; color: #E6EDF3; }
    .libro-item span { font-size: 0.75rem; color: #8B949E; }
    .detalle { margin-top: 1rem; background: #21262D; border: 1px solid #30363D; border-radius: 8px; padding: 0.75rem 1rem; display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap; }
    .detalle-label { font-size: 0.72rem; color: #8B949E; }
    .detalle strong { font-size: 0.875rem; color: #E6EDF3; }
    .detalle-reset-hint { font-size: 0.7rem; color: #8B949E; font-style: italic; }
  </style>
</head>
<body>
  <span class="component-label">app-catalogo-genero</span>
  <div class="catalogo">
    <h2>Catálogo por género</h2>
    <div class="generos" id="generos"></div>
    <div class="resultados" id="resultados"></div>
    <div id="detalle" style="display:none" class="detalle">
      <span class="detalle-label">Seleccionado:</span>
      <strong id="detalle-titulo"></strong>
      <span class="detalle-reset-hint">(cambia de género para resetear)</span>
    </div>
  </div>
  <script>
    const catalogo = {
      'Programación': [
        { id: 1, titulo: 'Clean Code', autor: 'Robert C. Martin' },
        { id: 2, titulo: 'The Pragmatic Programmer', autor: 'Hunt & Thomas' },
        { id: 3, titulo: 'Refactoring', autor: 'Martin Fowler' },
      ],
      'Ciencia Ficción': [
        { id: 4, titulo: 'Dune', autor: 'Frank Herbert' },
        { id: 5, titulo: 'Foundation', autor: 'Isaac Asimov' },
      ],
      'Historia': [
        { id: 6, titulo: 'Sapiens', autor: 'Yuval Noah Harari' },
        { id: 7, titulo: 'Guns, Germs, and Steel', autor: 'Jared Diamond' },
      ],
    };
    const generos = Object.keys(catalogo);
    let generoActual = 'Programación';
    let libroActivo = null;
    let timer = null;

    function renderGeneros() {
      document.getElementById('generos').innerHTML = generos.map(g =>
        '<button class="btn-genero' + (g === generoActual ? ' activo' : '') + '" data-g="' + g + '">' + g + '</button>'
      ).join('');
      document.querySelectorAll('.btn-genero').forEach(btn => {
        btn.addEventListener('click', () => seleccionarGenero(btn.getAttribute('data-g')));
      });
    }

    function renderDetalle() {
      const el = document.getElementById('detalle');
      if (libroActivo) {
        document.getElementById('detalle-titulo').textContent = libroActivo.titulo;
        el.style.display = 'flex';
      } else {
        el.style.display = 'none';
      }
    }

    function seleccionarGenero(g) {
      generoActual = g;
      libroActivo = null;
      renderGeneros();
      renderDetalle();
      cargar();
    }

    function cargar() {
      if (timer) clearTimeout(timer);
      document.getElementById('resultados').innerHTML = '<div class="estado-carga"><span class="spinner"></span> Cargando ' + generoActual + '...</div>';
      timer = setTimeout(() => {
        const libros = catalogo[generoActual] || [];
        document.getElementById('resultados').innerHTML = libros.map(l =>
          '<div class="libro-item" data-id="' + l.id + '"><strong>' + l.titulo + '</strong><span>' + l.autor + '</span></div>'
        ).join('');
        document.querySelectorAll('.libro-item').forEach((item, i) => {
          item.addEventListener('click', () => {
            libroActivo = libros[i];
            document.querySelectorAll('.libro-item').forEach(el => el.classList.remove('seleccionado'));
            item.classList.add('seleccionado');
            renderDetalle();
          });
        });
      }, 800);
    }

    renderGeneros();
    cargar();
  </script>
</body>
</html>`,
    aiContext:
      'El usuario está aprendiendo resource() y linkedSignal() en Angular 20. Ha visto un catálogo por género: resource() que se retriggeriza cuando cambia el género (con AbortSignal para cancelar peticiones), y linkedSignal() que resetea el libro seleccionado automáticamente al cambiar de género. Puede preguntar sobre resource.reload(), sobre los estados de resource.status(), sobre linkedSignal vs computed, o sobre cómo usar resource con HttpClient.',
    introMessage:
      'Esta lección presenta dos primitivas de Angular 20 para estado asíncrono reactivo.\n\n`resource()` reemplaza el patrón manual de tres signals (loading + error + data). Cambia el género y observa cómo el resource cancela automáticamente la petición anterior y transiciona entre estados.\n\n`linkedSignal()` resetea el libro seleccionado cada vez que cambias de género — sin código extra en el setter del género.\n\nPregúntame sobre resource.status(), AbortSignal, o cuándo usar linkedSignal vs un effect().',
    suggestedQuestions: [
      '¿Cuál es la diferencia entre "loading" y "refreshing" en resource.status()?',
      '¿Cómo uso resource() con HttpClient en lugar de fetch()?',
      '¿Cuándo debería usar linkedSignal en vez de un effect que resetea un signal?',
    ],
  },

  {
    id: 'L8.3',
    module: 8,
    moduleTitle: 'Estado Global con Signals',
    title: 'NgRx Signals: Stores escalables para equipos',
    subtitle: 'signalStore(), withState, withComputed, withMethods y patchState',
    estimatedMinutes: 20,
    xpReward: 170,
    prerequisites: ['L8.2'],
    nextLesson: 'L8.4',
    language: 'typescript',
    narrative: [
      {
        type: 'text',
        content:
          'El patrón store que aprendiste en L8.1 escala bien hasta cierto punto. En equipos grandes, con múltiples desarrolladores tocando el mismo estado, es valioso tener una API estandarizada con convenciones explícitas. NgRx Signals ofrece exactamente eso: `signalStore()` es una función que compone bloques (`withState`, `withComputed`, `withMethods`) en un servicio inyectable totalmente tipado.',
      },
      {
        type: 'comparison',
        leftLabel: 'Plain Service Store (L8.1)',
        rightLabel: 'NgRx signalStore()',
        left: 'Signals privados manuales\nasReadonly() para exponer\nMétodos como funciones normales\nCero dependencias extra\nIdeal para 1-3 devs / features pequeñas',
        right: 'withState() declara la forma\nwithComputed() para derivados\nwithMethods() + patchState()\nConvenciones explícitas para equipos\nIdeal para apps grandes / múltiples equipos',
      },
      {
        type: 'text',
        content:
          '`patchState(store, partial)` es la función de mutación de NgRx Signals — recibe el store y un objeto parcial con los campos que quieres actualizar. No puedes mutar el estado directamente desde fuera de `withMethods`, lo que garantiza las mismas propiedades de flujo unidireccional del patrón de L8.1, pero con convenciones más explícitas.',
      },
      {
        type: 'tip',
        variant: 'angular',
        content:
          'NgRx Signals no requiere acciones ni reducers — esa complejidad es opcional y solo necesaria si quieres DevTools o time-travel debugging. Para la mayoría de las features, `signalStore` + `withMethods` + `patchState` es todo lo que necesitas.',
      },
      {
        type: 'checkpoint',
        question: '¿Cuál es la función correcta para actualizar estado dentro de withMethods en NgRx Signals?',
        options: [
          'setState(store, partial)',
          'store.update(partial)',
          'patchState(store, partial)',
          'store.set(partial)',
        ],
        correct: 2,
        explanation:
          '`patchState(store, partial)` es la API de NgRx Signals para actualizar estado dentro de `withMethods`. Recibe la referencia del store (disponible como parámetro de la función pasada a `withMethods`) y un objeto parcial. Solo actualiza los campos especificados — el resto del estado permanece sin cambios.',
      },
    ],
    starterCode: `// 📚 Biblioteca Angular — NgRx Signals Store
// signalStore() como alternativa estructurada al service store manual
// Instalar: npm install @ngrx/signals

import { Component, ChangeDetectionStrategy, inject, computed } from '@angular/core';
import { signalStore, withState, withComputed, withMethods, patchState } from '@ngrx/signals';

interface Libro {
  id: number;
  titulo: string;
  autor: string;
  genero: string;
  favorito: boolean;
}

interface LibraryState {
  libros: Libro[];
  filtro: string;
  generoActivo: string | null;
}

// ── NgRx signalStore() ───────────────────────────────────────
// Cada "with*()" es un bloque composable que añade capacidades al store
export const LibraryStore = signalStore(
  { providedIn: 'root' },

  // withState() — declara la forma del estado y los valores iniciales
  withState<LibraryState>({
    libros: [
      { id: 1, titulo: 'Clean Code', autor: 'Robert C. Martin', genero: 'Programación', favorito: false },
      { id: 2, titulo: 'The Pragmatic Programmer', autor: 'Hunt & Thomas', genero: 'Programación', favorito: true },
      { id: 3, titulo: 'Dune', autor: 'Frank Herbert', genero: 'Ciencia Ficción', favorito: false },
      { id: 4, titulo: 'Sapiens', autor: 'Yuval Noah Harari', genero: 'Historia', favorito: false },
    ],
    filtro: '',
    generoActivo: null,
  }),

  // withComputed() — valores derivados del estado, equivalente a computed()
  withComputed(({ libros, filtro, generoActivo }) => ({
    librosFiltrados: computed(() => {
      const f = filtro().toLowerCase();
      const g = generoActivo();
      return libros().filter(l => {
        const matchFiltro = !f || l.titulo.toLowerCase().includes(f) || l.autor.toLowerCase().includes(f);
        const matchGenero = !g || l.genero === g;
        return matchFiltro && matchGenero;
      });
    }),
    totalFavoritos: computed(() => libros().filter(l => l.favorito).length),
    generos: computed(() => [...new Set(libros().map(l => l.genero))]),
  })),

  // withMethods() — las únicas formas de mutar el estado
  withMethods((store) => ({
    setFiltro(filtro: string): void {
      patchState(store, { filtro });
    },
    setGenero(generoActivo: string | null): void {
      patchState(store, { generoActivo });
    },
    toggleFavorito(id: number): void {
      patchState(store, {
        libros: store.libros().map(l =>
          l.id === id ? { ...l, favorito: !l.favorito } : l
        ),
      });
    },
  }))
);

// ── Componente que consume el NgRx store ─────────────────────
@Component({
  selector: 'app-library-ngrx',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: \`
    <div class="library">
      <header>
        <h2>Library Store <span class="badge">NgRx Signals</span></h2>
        <span class="fav-count">♥ {{ store.totalFavoritos() }}</span>
      </header>

      <div class="filtros">
        <input
          type="text"
          placeholder="Buscar..."
          [value]="store.filtro()"
          (input)="store.setFiltro($any($event.target).value)"
        />
        <div class="genero-pills">
          <button
            class="pill"
            [class.activo]="store.generoActivo() === null"
            (click)="store.setGenero(null)"
          >Todos</button>
          @for (g of store.generos(); track g) {
            <button
              class="pill"
              [class.activo]="store.generoActivo() === g"
              (click)="store.setGenero(g)"
            >{{ g }}</button>
          }
        </div>
      </div>

      <div class="lista">
        @for (libro of store.librosFiltrados(); track libro.id) {
          <div class="libro">
            <div class="libro-meta">
              <strong>{{ libro.titulo }}</strong>
              <span>{{ libro.autor }} · {{ libro.genero }}</span>
            </div>
            <button
              class="btn-fav"
              [class.activo]="libro.favorito"
              (click)="store.toggleFavorito(libro.id)"
            >{{ libro.favorito ? '♥' : '♡' }}</button>
          </div>
        }
      </div>
    </div>
  \`,
})
export class LibraryNgrxComponent {
  readonly store = inject(LibraryStore);
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
    .library { background: #161B22; border: 1px solid #30363D; border-radius: 12px; overflow: hidden; width: 100%; max-width: 460px; }
    header { display: flex; align-items: center; justify-content: space-between; padding: 1.25rem 1.5rem; border-bottom: 1px solid #30363D; }
    header h2 { font-size: 1rem; font-weight: 600; display: flex; align-items: center; gap: 0.5rem; }
    .badge { font-size: 0.65rem; font-weight: 600; background: rgba(124,58,237,0.15); border: 1px solid rgba(124,58,237,0.35); color: #a78bfa; padding: 0.15em 0.5em; border-radius: 4px; text-transform: uppercase; letter-spacing: 0.04em; }
    .fav-count { font-size: 0.85rem; color: #f472b6; font-weight: 600; }
    .filtros { padding: 1rem 1.5rem; border-bottom: 1px solid #21262D; display: flex; flex-direction: column; gap: 0.75rem; }
    .filtros input { background: #0D1117; border: 1px solid #30363D; border-radius: 6px; padding: 0.55rem 0.875rem; color: #E6EDF3; font-size: 0.875rem; font-family: 'Inter', sans-serif; outline: none; transition: border-color 150ms; }
    .filtros input:focus { border-color: #7C3AED; }
    .filtros input::placeholder { color: #8B949E; }
    .genero-pills { display: flex; gap: 0.4rem; flex-wrap: wrap; }
    .pill { background: #21262D; border: 1px solid #30363D; color: #8B949E; border-radius: 20px; padding: 0.3rem 0.75rem; font-size: 0.75rem; font-weight: 500; transition: all 150ms; }
    .pill:hover { border-color: #7C3AED; color: #c4b5fd; }
    .pill.activo { background: rgba(124,58,237,0.15); border-color: #7C3AED; color: #c4b5fd; }
    .lista { padding: 0.5rem 0; }
    .libro { display: flex; align-items: center; justify-content: space-between; padding: 0.75rem 1.5rem; border-bottom: 1px solid #21262D; transition: background 150ms; }
    .libro:last-child { border-bottom: none; }
    .libro-meta { display: flex; flex-direction: column; gap: 0.15rem; }
    .libro-meta strong { font-size: 0.875rem; font-weight: 600; color: #E6EDF3; }
    .libro-meta span { font-size: 0.72rem; color: #8B949E; }
    .btn-fav { background: transparent; border: 1px solid #30363D; border-radius: 6px; color: #8B949E; padding: 0.35rem 0.6rem; font-size: 1rem; transition: all 150ms; }
    .btn-fav:hover { border-color: #f472b6; color: #f472b6; }
    .btn-fav.activo { border-color: #f472b6; color: #f472b6; background: rgba(244,114,182,0.08); }
  </style>
</head>
<body>
  <span class="component-label">LibraryStore (NgRx Signals) + app-library-ngrx</span>
  <div class="library">
    <header>
      <h2>Library Store <span class="badge">NgRx Signals</span></h2>
      <span class="fav-count" id="fav-count">♥ 1</span>
    </header>
    <div class="filtros">
      <input id="filtro" type="text" placeholder="Buscar..." autocomplete="off">
      <div class="genero-pills" id="pills"></div>
    </div>
    <div class="lista" id="lista"></div>
  </div>
  <script>
    const libros = [
      { id: 1, titulo: 'Clean Code', autor: 'Robert C. Martin', genero: 'Programación', favorito: false },
      { id: 2, titulo: 'The Pragmatic Programmer', autor: 'Hunt & Thomas', genero: 'Programación', favorito: true },
      { id: 3, titulo: 'Dune', autor: 'Frank Herbert', genero: 'Ciencia Ficción', favorito: false },
      { id: 4, titulo: 'Sapiens', autor: 'Yuval Noah Harari', genero: 'Historia', favorito: false },
    ];
    let filtro = '', generoActivo = null;
    const generos = [...new Set(libros.map(l => l.genero))];

    function render() {
      const f = filtro.toLowerCase();
      const filtrados = libros.filter(l => {
        const mf = !f || l.titulo.toLowerCase().includes(f) || l.autor.toLowerCase().includes(f);
        const mg = !generoActivo || l.genero === generoActivo;
        return mf && mg;
      });
      const totalFav = libros.filter(l => l.favorito).length;
      document.getElementById('fav-count').textContent = '\u2665 ' + totalFav;

      document.getElementById('pills').innerHTML =
        '<button class="pill' + (!generoActivo ? ' activo' : '') + '" data-g="all">Todos</button>' +
        generos.map(g => '<button class="pill' + (generoActivo === g ? ' activo' : '') + '" data-g="' + g + '">' + g + '</button>').join('');
      document.querySelectorAll('.pill').forEach(btn => {
        btn.addEventListener('click', () => {
          generoActivo = btn.getAttribute('data-g') === 'all' ? null : btn.getAttribute('data-g');
          render();
        });
      });

      document.getElementById('lista').innerHTML = filtrados.map(l =>
        '<div class="libro"><div class="libro-meta"><strong>' + l.titulo + '</strong><span>' + l.autor + ' \u00b7 ' + l.genero + '</span></div>' +
        '<button class="btn-fav' + (l.favorito ? ' activo' : '') + '" data-id="' + l.id + '">' + (l.favorito ? '\u2665' : '\u2661') + '</button></div>'
      ).join('');
      document.querySelectorAll('.btn-fav').forEach(btn => {
        btn.addEventListener('click', () => {
          const id = +btn.getAttribute('data-id');
          const libro = libros.find(l => l.id === id);
          if (libro) { libro.favorito = !libro.favorito; render(); }
        });
      });
    }

    document.getElementById('filtro').addEventListener('input', e => { filtro = e.target.value; render(); });
    render();
  </script>
</body>
</html>`,
    aiContext:
      'El usuario está aprendiendo NgRx Signals en Angular 20: signalStore(), withState(), withComputed(), withMethods() y patchState(). Viene de haber visto el patrón service store manual en L8.1. Puede preguntar sobre cuándo elegir NgRx Signals vs el store manual, sobre withEntities() para colecciones, sobre DevTools de NgRx, o sobre cómo migrar un store existente a NgRx Signals.',
    introMessage:
      'Esta lección muestra NgRx Signals — la versión estructurada del patrón store que construiste en L8.1.\n\nEl mismo `BibliotecaStore` pero ahora con `signalStore()`, `withState()`, `withComputed()`, `withMethods()` y `patchState()`. La funcionalidad es idéntica; la diferencia está en las convenciones y en cómo escala en equipos.\n\nPregúntame sobre la comparativa con el store manual, sobre `withEntities()` para listas, o sobre cuándo vale la pena instalar NgRx.',
    suggestedQuestions: [
      '¿Cuándo tiene sentido añadir @ngrx/signals en lugar de usar el patrón de L8.1?',
      '¿Qué es withEntities() y para qué sirve?',
      '¿NgRx Signals tiene DevTools para inspeccionar el estado?',
    ],
  },

  {
    id: 'L8.4',
    module: 8,
    moduleTitle: 'Estado Global con Signals',
    title: 'Arquitectura de estado en apps reales',
    subtitle: 'Estado local, feature store y store global: cuándo usar cada nivel',
    estimatedMinutes: 20,
    xpReward: 180,
    prerequisites: ['L8.3'],
    nextLesson: 'L9.1',
    language: 'typescript',
    achievements: [
      {
        id: 'state-architect',
        name: 'State Architect',
        description: 'Dominaste los tres niveles de estado en Angular: local, feature y global',
        icon: '🏛️',
      },
    ],
    narrative: [
      {
        type: 'text',
        content:
          'Una de las decisiones más importantes en una app Angular es elegir dónde vive cada trozo de estado. La regla general: mantén el estado tan cerca como sea posible de donde se usa. Si solo un componente necesita un valor, que sea un signal local. Si varios componentes de una feature lo comparten, que sea un feature store. Solo si el estado cruza rutas o es verdaderamente global (sesión de usuario, tema) debería vivir en un store global.',
      },
      {
        type: 'comparison',
        leftLabel: 'Cuándo NO elevar el estado',
        rightLabel: 'Cuándo SÍ elevarlo',
        left: 'Estado de un formulario\nUI state (tooltip visible, drawer open)\nDatos que solo usa un componente\nEstado temporal de una interacción',
        right: 'Favoritos compartidos entre tabs\nCarrito de compras multi-pantalla\nSesión/perfil del usuario\nFiltros que persisten entre navegaciones',
      },
      {
        type: 'text',
        content:
          'La inyección de dependencias de Angular hace que compartir un feature store sea trivial: cualquier componente dentro de la misma jerarquía puede hacer `inject(BibliotecaStore)` y acceder al mismo estado sin prop drilling — sin `@Input()` en cadena a través de 4 niveles de componentes. Ese es el "lift state up" con signals: eleva el estado al servicio, no al componente padre.',
      },
      {
        type: 'tip',
        variant: 'info',
        content:
          'Usa `providedIn: "root"` para stores verdaderamente globales (usuario, tema). Para stores de feature, provéelos en la configuración de la ruta con `providers: [BibliotecaStore]` — así el store se destruye cuando el usuario abandona la ruta y no acumulas estado obsoleto.',
      },
      {
        type: 'tip',
        variant: 'angular',
        content:
          'Señal de código problemático: un componente con muchos `@Input()` que no hace nada con los datos excepto pasarlos hacia abajo. Si ves eso, probablemente ese estado debería ser un feature store que los componentes hijos inyectan directamente.',
      },
      {
        type: 'checkpoint',
        question: '¿Dónde deberías guardar el estado de "tema oscuro/claro" de la aplicación?',
        options: [
          'Signal local en el componente raíz AppComponent',
          'Feature store solo para el módulo de configuración',
          'Store global con providedIn: "root" ya que todos los componentes lo necesitan',
          'En localStorage directamente, sin signals',
        ],
        correct: 2,
        explanation:
          'El tema de la aplicación es estado verdaderamente global — todos los componentes lo necesitan y debe persistir entre rutas. Un store global con `providedIn: "root"` es la solución correcta. Se puede complementar con un `effect()` que sincronice con `localStorage` para persistencia entre sesiones.',
      },
    ],
    starterCode: `import { Injectable, signal, computed, effect, inject } from '@angular/core';
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

// 📚 Biblioteca Angular — Arquitectura de tres capas de estado
// Nivel 1: Estado local (formulario en el componente)
// Nivel 2: Feature store (colección de libros de la biblioteca)
// Nivel 3: Store global (preferencias del usuario)

// ── NIVEL 3: Store global — preferencias del usuario ─────────
// providedIn: 'root' porque todas las partes de la app pueden necesitarlo
@Injectable({ providedIn: 'root' })
export class UserPrefsStore {
  private readonly _tema = signal<'dark' | 'light'>('dark');
  private readonly _idioma = signal<'es' | 'en'>('es');

  readonly tema = this._tema.asReadonly();
  readonly idioma = this._idioma.asReadonly();
  readonly temaLabel = computed(() => this._tema() === 'dark' ? '🌙 Oscuro' : '☀️ Claro');

  constructor() {
    effect(() => {
      document.documentElement.setAttribute('data-theme', this._tema());
    });
  }

  toggleTema(): void {
    this._tema.update(t => t === 'dark' ? 'light' : 'dark');
  }
}

// ── NIVEL 2: Feature store — colección de libros ─────────────
// Provisión por ruta en una app real: providers: [BibliotecaStore]
// Aquí usamos providedIn: 'root' para simplificar el ejemplo
@Injectable({ providedIn: 'root' })
export class BibliotecaStore {
  private readonly _libros = signal([
    { id: 1, titulo: 'Clean Code', autor: 'Robert C. Martin' },
    { id: 2, titulo: 'Dune', autor: 'Frank Herbert' },
  ]);

  readonly libros = this._libros.asReadonly();
  readonly total = computed(() => this._libros().length);

  agregar(titulo: string, autor: string): void {
    const id = Date.now();
    this._libros.update(ls => [...ls, { id, titulo, autor }]);
  }

  eliminar(id: number): void {
    this._libros.update(ls => ls.filter(l => l.id !== id));
  }
}

// ── NIVEL 1: Estado local — formulario de añadir libro ───────
// El estado del formulario NO necesita salir de este componente
@Component({
  selector: 'app-anadir-libro-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: \`
    <form [formGroup]="form" (ngSubmit)="onSubmit()" class="form-card">
      <h3>Añadir libro</h3>
      <input formControlName="titulo" placeholder="Título" class="input" />
      <input formControlName="autor" placeholder="Autor" class="input" />
      <button type="submit" [disabled]="form.invalid" class="btn-submit">
        + Añadir
      </button>
    </form>
  \`,
})
export class AnadirLibroFormComponent {
  // Estado local: solo este componente lo necesita
  readonly form = inject(FormBuilder).group({
    titulo: ['', Validators.required],
    autor: ['', Validators.required],
  });

  // Accede al feature store directamente sin prop drilling
  private readonly biblioteca = inject(BibliotecaStore);

  onSubmit(): void {
    if (this.form.valid) {
      const { titulo, autor } = this.form.getRawValue();
      this.biblioteca.agregar(titulo!, autor!);
      this.form.reset();
    }
  }
}

// ── Componente raíz que compone los tres niveles ─────────────
@Component({
  selector: 'app-biblioteca-completa',
  standalone: true,
  imports: [AnadirLibroFormComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: \`
    <div class="app" [attr.data-tema]="prefs.tema()">
      <header class="app-bar">
        <h2>📚 Biblioteca</h2>
        <div class="app-bar-actions">
          <span class="total-badge">{{ biblioteca.total() }} libros</span>
          <button class="btn-tema" (click)="prefs.toggleTema()">
            {{ prefs.temaLabel() }}
          </button>
        </div>
      </header>

      <div class="content">
        <!-- Nivel 2: lista de la feature -->
        <div class="lista-seccion">
          <h3 class="seccion-title">Colección</h3>
          @for (libro of biblioteca.libros(); track libro.id) {
            <div class="libro-row">
              <div class="libro-info">
                <strong>{{ libro.titulo }}</strong>
                <span>{{ libro.autor }}</span>
              </div>
              <button class="btn-eliminar" (click)="biblioteca.eliminar(libro.id)">✕</button>
            </div>
          }
        </div>

        <!-- Nivel 1: formulario con estado local -->
        <app-anadir-libro-form />
      </div>

      <footer class="app-footer">
        <span>Tema: {{ prefs.temaLabel() }}</span>
        <span>Idioma: {{ prefs.idioma() }}</span>
      </footer>
    </div>
  \`,
})
export class BibliotecaCompletaComponent {
  readonly prefs = inject(UserPrefsStore);       // Nivel 3 — global
  readonly biblioteca = inject(BibliotecaStore); // Nivel 2 — feature
  // El nivel 1 vive dentro de AnadirLibroFormComponent
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
    .app { background: #161B22; border: 1px solid #30363D; border-radius: 12px; overflow: hidden; width: 100%; max-width: 460px; }
    .app-bar { display: flex; align-items: center; justify-content: space-between; padding: 1rem 1.5rem; border-bottom: 1px solid #30363D; background: #161B22; }
    .app-bar h2 { font-size: 1rem; font-weight: 600; }
    .app-bar-actions { display: flex; align-items: center; gap: 0.75rem; }
    .total-badge { font-size: 0.75rem; color: #8B949E; background: #21262D; border: 1px solid #30363D; padding: 0.2em 0.6em; border-radius: 20px; }
    .btn-tema { background: #21262D; border: 1px solid #30363D; color: #E6EDF3; border-radius: 6px; padding: 0.35rem 0.7rem; font-size: 0.78rem; transition: all 150ms; }
    .btn-tema:hover { border-color: #7C3AED; }
    .content { display: flex; flex-direction: column; gap: 0; }
    .lista-seccion { padding: 1rem 1.5rem; border-bottom: 1px solid #30363D; }
    .seccion-title { font-size: 0.72rem; font-weight: 600; color: #8B949E; text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: 0.75rem; }
    .libro-row { display: flex; align-items: center; justify-content: space-between; padding: 0.55rem 0.75rem; border-radius: 6px; margin-bottom: 0.3rem; background: #21262D; border: 1px solid #30363D; }
    .libro-info { display: flex; flex-direction: column; gap: 0.1rem; }
    .libro-info strong { font-size: 0.85rem; font-weight: 600; color: #E6EDF3; }
    .libro-info span { font-size: 0.72rem; color: #8B949E; }
    .btn-eliminar { background: transparent; border: none; color: #8B949E; font-size: 0.85rem; padding: 0.2rem 0.4rem; border-radius: 4px; transition: all 150ms; }
    .btn-eliminar:hover { color: #f87171; background: rgba(248,113,113,0.1); }
    .form-card { padding: 1rem 1.5rem; display: flex; flex-direction: column; gap: 0.6rem; }
    .form-card h3 { font-size: 0.85rem; font-weight: 600; color: #8B949E; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.1rem; }
    .input { background: #0D1117; border: 1px solid #30363D; border-radius: 6px; padding: 0.5rem 0.75rem; color: #E6EDF3; font-size: 0.875rem; font-family: 'Inter', sans-serif; outline: none; transition: border-color 150ms; }
    .input:focus { border-color: #7C3AED; }
    .input::placeholder { color: #8B949E; }
    .btn-submit { background: #7C3AED; color: white; border: none; border-radius: 6px; padding: 0.55rem 1rem; font-size: 0.875rem; font-weight: 500; transition: opacity 150ms; }
    .btn-submit:hover:not(:disabled) { opacity: 0.85; }
    .btn-submit:disabled { opacity: 0.35; cursor: not-allowed; }
    .app-footer { display: flex; justify-content: space-between; padding: 0.75rem 1.5rem; border-top: 1px solid #21262D; background: #0D1117; }
    .app-footer span { font-size: 0.72rem; color: #8B949E; font-family: 'JetBrains Mono', monospace; }
    .nivel-tags { display: flex; gap: 0.4rem; flex-wrap: wrap; padding: 0.5rem 1.5rem; border-bottom: 1px solid #21262D; }
    .nivel-tag { font-size: 0.65rem; font-weight: 600; padding: 0.2em 0.55em; border-radius: 4px; border: 1px solid; }
    .nivel-tag.local { color: #34d399; border-color: rgba(52,211,153,0.3); background: rgba(52,211,153,0.08); }
    .nivel-tag.feature { color: #60a5fa; border-color: rgba(96,165,250,0.3); background: rgba(96,165,250,0.08); }
    .nivel-tag.global { color: #c084fc; border-color: rgba(192,132,252,0.3); background: rgba(192,132,252,0.08); }
  </style>
</head>
<body>
  <span class="component-label">UserPrefsStore + BibliotecaStore + local form state</span>
  <div class="app">
    <div class="app-bar">
      <h2>Biblioteca</h2>
      <div class="app-bar-actions">
        <span class="total-badge" id="total-badge">2 libros</span>
        <button class="btn-tema" id="btn-tema">🌙 Oscuro</button>
      </div>
    </div>
    <div class="nivel-tags">
      <span class="nivel-tag global">Nivel 3: UserPrefsStore (global)</span>
      <span class="nivel-tag feature">Nivel 2: BibliotecaStore (feature)</span>
      <span class="nivel-tag local">Nivel 1: form state (local)</span>
    </div>
    <div class="content">
      <div class="lista-seccion">
        <div class="seccion-title">Colección</div>
        <div id="lista"></div>
      </div>
      <div class="form-card">
        <h3>Añadir libro</h3>
        <input id="inp-titulo" class="input" placeholder="Título" autocomplete="off">
        <input id="inp-autor" class="input" placeholder="Autor" autocomplete="off">
        <button class="btn-submit" id="btn-agregar" disabled>+ Añadir</button>
      </div>
    </div>
    <div class="app-footer">
      <span id="footer-tema">Tema: 🌙 Oscuro</span>
      <span>Idioma: es</span>
    </div>
  </div>
  <script>
    const libros = [
      { id: 1, titulo: 'Clean Code', autor: 'Robert C. Martin' },
      { id: 2, titulo: 'Dune', autor: 'Frank Herbert' },
    ];
    let tema = 'dark';
    let nextId = 10;

    function renderLista() {
      document.getElementById('total-badge').textContent = libros.length + ' libro' + (libros.length !== 1 ? 's' : '');
      document.getElementById('lista').innerHTML = libros.map(l =>
        '<div class="libro-row"><div class="libro-info"><strong>' + l.titulo + '</strong><span>' + l.autor + '</span></div>' +
        '<button class="btn-eliminar" data-id="' + l.id + '">✕</button></div>'
      ).join('');
      document.querySelectorAll('.btn-eliminar').forEach(btn => {
        btn.addEventListener('click', () => {
          const id = +btn.getAttribute('data-id');
          const idx = libros.findIndex(l => l.id === id);
          if (idx !== -1) { libros.splice(idx, 1); renderLista(); }
        });
      });
    }

    document.getElementById('btn-tema').addEventListener('click', () => {
      tema = tema === 'dark' ? 'light' : 'dark';
      const label = tema === 'dark' ? '🌙 Oscuro' : '☀️ Claro';
      document.getElementById('btn-tema').textContent = label;
      document.getElementById('footer-tema').textContent = 'Tema: ' + label;
    });

    const inpTitulo = document.getElementById('inp-titulo');
    const inpAutor = document.getElementById('inp-autor');
    const btnAgregar = document.getElementById('btn-agregar');

    function checkForm() {
      btnAgregar.disabled = !(inpTitulo.value.trim() && inpAutor.value.trim());
    }
    inpTitulo.addEventListener('input', checkForm);
    inpAutor.addEventListener('input', checkForm);

    btnAgregar.addEventListener('click', () => {
      const t = inpTitulo.value.trim();
      const a = inpAutor.value.trim();
      if (t && a) {
        libros.push({ id: nextId++, titulo: t, autor: a });
        inpTitulo.value = '';
        inpAutor.value = '';
        checkForm();
        renderLista();
      }
    });

    renderLista();
  </script>
</body>
</html>`,
    aiContext:
      'El usuario está terminando el módulo 8 sobre estado global con signals. Ha aprendido los tres niveles de estado: local (signals/forms en el componente), feature store (servicio inyectable con signals), y store global (providedIn root). Ha construido BibliotecaStore manual, usado resource() y linkedSignal(), visto NgRx Signals. Puede preguntar sobre cómo elegir entre los niveles, sobre state colocation, prop drilling, la estrategia de providedIn vs providers en rutas, o sobre cuándo introducir NgRx completo (con efectos/acciones).',
    introMessage:
      'Esta lección final del módulo cierra con la pregunta más importante: ¿dónde debería vivir cada trozo de estado en una app Angular real?\n\nEl código muestra los tres niveles en acción: estado local del formulario, `BibliotecaStore` como feature store, y `UserPrefsStore` como store global. Ningún componente pasa datos por props — cada uno inyecta exactamente lo que necesita.\n\nPregúntame sobre la decisión local vs feature vs global, sobre cómo proveer un store por ruta, o sobre cuándo introducir NgRx completo.',
    suggestedQuestions: [
      '¿Cómo sé si un estado debe ser local o elevarlo a un feature store?',
      '¿Cómo proveo un store solo para una ruta y lo destruyo al salir?',
      '¿Cuándo tiene sentido añadir NgRx completo con acciones y efectos?',
    ],
  },
];
