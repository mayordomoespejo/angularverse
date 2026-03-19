import type { Lesson } from '../../core/models/lesson.model';

export const MODULE_4_LESSONS: Lesson[] = [
  {
    id: 'L4.1',
    module: 4,
    moduleTitle: 'Servicios e Inyección de Dependencias',
    title: '¿Qué es un Servicio? Tu primera clase @Injectable',
    subtitle: 'Extrae lógica y estado a servicios reutilizables y compartidos',
    estimatedMinutes: 12,
    xpReward: 120,
    prerequisites: ['L3.6'],
    nextLesson: 'L4.2',
    language: 'typescript',
    narrative: [
      {
        type: 'text',
        content:
          'Hasta ahora, toda la lógica y el estado de tu Biblioteca Angular vivían dentro de los componentes. Eso funciona para un componente en solitario, pero ¿qué pasa cuando dos componentes distintos necesitan el mismo listado de libros? Los servicios son clases TypeScript ordinarias decoradas con `@Injectable` que Angular gestiona por ti — los crea, los guarda y los entrega a quien los necesite.',
      },
      {
        type: 'tip',
        variant: 'info',
        content:
          '`providedIn: \'root\'` significa que Angular crea una única instancia del servicio para toda la aplicación (singleton). No necesitas registrarlo en ningún módulo — Angular lo incluye automáticamente en el bundle solo si alguien lo inyecta (tree-shakeable).',
      },
      {
        type: 'text',
        content:
          'La regla de oro de los servicios: los componentes se ocupan de presentar datos y responder a eventos del usuario. Los servicios se ocupan del estado compartido, la lógica de negocio y las llamadas a APIs. Cuando extraes `BibliotecaService`, cualquier componente de la app puede leer la misma lista de libros sin duplicar estado.',
      },
      {
        type: 'tip',
        variant: 'angular',
        content:
          'Los servicios con signals son la combinación perfecta: el servicio expone signals como fuente de verdad única, y cualquier componente que las lea se re-renderiza automáticamente cuando el estado cambia. Sin eventos, sin subscripciones, sin `BehaviorSubject`.',
      },
      {
        type: 'checkpoint',
        question: '¿Qué hace `providedIn: \'root\'` en un @Injectable?',
        options: [
          'Limita el servicio al componente donde se declara',
          'Crea una instancia singleton accesible en toda la app y lo hace tree-shakeable',
          'Obliga a declararlo en el array providers de AppModule',
          'Hace que el servicio se destruya junto con el componente',
        ],
        correct: 1,
        explanation:
          '`providedIn: \'root\'` registra el servicio en el inyector raíz de la aplicación, creando una sola instancia para toda la app. Además, Angular solo incluye el servicio en el bundle si algo lo inyecta — esto es tree-shaking automático sin configuración extra.',
      },
    ],
    starterCode: `import { Injectable, signal, computed } from '@angular/core';
import { Component, ChangeDetectionStrategy, inject } from '@angular/core';

// 📚 Biblioteca Angular — Módulo 4: Servicios
// BibliotecaService centraliza el estado de los libros

interface Libro {
  id: number;
  titulo: string;
  autor: string;
  leido: boolean;
}

// ── El Servicio ──────────────────────────────────────────────
@Injectable({
  providedIn: 'root', // ← singleton, tree-shakeable, sin registro manual
})
export class BibliotecaService {
  // Estado privado — solo mutable dentro del servicio
  private readonly _libros = signal<Libro[]>([
    { id: 1, titulo: 'Clean Code', autor: 'Robert C. Martin', leido: true },
    { id: 2, titulo: 'The Pragmatic Programmer', autor: 'Hunt & Thomas', leido: false },
    { id: 3, titulo: 'Refactoring', autor: 'Martin Fowler', leido: false },
  ]);

  // API pública — solo lectura para los consumidores
  readonly libros = this._libros.asReadonly();
  readonly total = computed(() => this._libros().length);
  readonly totalLeidos = computed(() => this._libros().filter(l => l.leido).length);

  agregarLibro(titulo: string, autor: string): void {
    const nuevo: Libro = {
      id: Date.now(),
      titulo,
      autor,
      leido: false,
    };
    this._libros.update(lista => [...lista, nuevo]);
  }

  eliminarLibro(id: number): void {
    this._libros.update(lista => lista.filter(l => l.id !== id));
  }

  marcarLeido(id: number): void {
    this._libros.update(lista =>
      lista.map(l => l.id === id ? { ...l, leido: !l.leido } : l)
    );
  }
}

// ── Componente que consume el servicio ──────────────────────
@Component({
  selector: 'app-biblioteca-lista',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: \`
    <div class="biblioteca">
      <header>
        <h2>Biblioteca</h2>
        <span class="badge">{{ svc.totalLeidos() }}/{{ svc.total() }} leídos</span>
      </header>

      @for (libro of svc.libros(); track libro.id) {
        <div class="libro-item" [class.leido]="libro.leido">
          <div class="libro-info">
            <strong>{{ libro.titulo }}</strong>
            <span>{{ libro.autor }}</span>
          </div>
          <div class="libro-acciones">
            <button class="btn-leido" (click)="svc.marcarLeido(libro.id)">
              {{ libro.leido ? '✓' : '○' }}
            </button>
            <button class="btn-eliminar" (click)="svc.eliminarLibro(libro.id)">✕</button>
          </div>
        </div>
      }

      <div class="agregar">
        <button (click)="agregar()">+ Agregar libro</button>
      </div>
    </div>
  \`,
})
export class BibliotecaListaComponent {
  // inject() — la forma moderna de obtener el servicio
  readonly svc = inject(BibliotecaService);

  private contador = 4;

  agregar(): void {
    this.svc.agregarLibro(
      'Libro #' + this.contador,
      'Autor ' + this.contador
    );
    this.contador++;
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
    .service-badge { position: fixed; top: 12px; left: 12px; font-family: 'JetBrains Mono', monospace; font-size: 0.625rem; color: #22c55e; background: rgba(34,197,94,0.08); border: 1px solid rgba(34,197,94,0.25); padding: 0.2em 0.5em; border-radius: 4px; }
    button { cursor: pointer; font-family: 'Inter', sans-serif; }
    .biblioteca { background: #161B22; border: 1px solid #30363D; border-radius: 12px; overflow: hidden; width: 100%; max-width: 420px; }
    header { display: flex; align-items: center; justify-content: space-between; padding: 1.25rem 1.5rem; border-bottom: 1px solid #30363D; background: #0D1117; }
    header h2 { font-size: 1rem; font-weight: 600; }
    .badge { background: #21262D; border: 1px solid #30363D; color: #8B949E; font-size: 0.75rem; padding: 0.2em 0.6em; border-radius: 20px; font-weight: 500; }
    .libro-item { display: flex; align-items: center; justify-content: space-between; padding: 0.875rem 1.5rem; border-bottom: 1px solid #21262D; border-left: 3px solid transparent; transition: all 200ms; }
    .libro-item.leido { border-left-color: #22c55e; background: rgba(34,197,94,0.04); }
    .libro-info { display: flex; flex-direction: column; gap: 0.15rem; flex: 1; }
    .libro-info strong { font-size: 0.875rem; font-weight: 600; color: #E6EDF3; }
    .libro-info span { font-size: 0.76rem; color: #8B949E; }
    .libro-acciones { display: flex; gap: 0.5rem; }
    .btn-leido { background: transparent; border: 1px solid #30363D; color: #8B949E; border-radius: 50%; width: 28px; height: 28px; font-size: 0.8rem; display: flex; align-items: center; justify-content: center; transition: all 150ms; }
    .libro-item.leido .btn-leido { border-color: #22c55e; color: #22c55e; background: rgba(34,197,94,0.08); }
    .btn-eliminar { background: transparent; border: 1px solid transparent; color: #8B949E; border-radius: 50%; width: 28px; height: 28px; font-size: 0.75rem; display: flex; align-items: center; justify-content: center; transition: all 150ms; }
    .btn-eliminar:hover { border-color: #f85149; color: #f85149; background: rgba(248,81,73,0.08); }
    .agregar { padding: 1rem 1.5rem; }
    .agregar button { width: 100%; background: #7C3AED; color: white; border: none; border-radius: 8px; padding: 0.625rem 1rem; font-size: 0.875rem; font-weight: 500; transition: opacity 150ms; }
    .agregar button:hover { opacity: 0.85; }
    .injectable-tag { font-family: 'JetBrains Mono', monospace; font-size: 0.7rem; color: #7C3AED; }
  </style>
</head>
<body>
  <span class="service-badge">@Injectable BibliotecaService</span>
  <span class="component-label">app-biblioteca-lista</span>
  <div class="biblioteca">
    <header>
      <h2>Biblioteca</h2>
      <span class="badge" id="badge">1/3 leidos</span>
    </header>
    <div id="lista"></div>
    <div class="agregar">
      <button id="btn-agregar">+ Agregar libro</button>
    </div>
  </div>
  <script>
    var libros = [
      { id: 1, titulo: 'Clean Code', autor: 'Robert C. Martin', leido: true },
      { id: 2, titulo: 'The Pragmatic Programmer', autor: 'Hunt & Thomas', leido: false },
      { id: 3, titulo: 'Refactoring', autor: 'Martin Fowler', leido: false }
    ];
    var contador = 4;
    function render() {
      var leidos = libros.filter(function(l) { return l.leido; }).length;
      document.getElementById('badge').textContent = leidos + '/' + libros.length + ' leidos';
      var html = '';
      libros.forEach(function(l) {
        html += '<div class="libro-item' + (l.leido ? ' leido' : '') + '" data-id="' + l.id + '">';
        html += '<div class="libro-info"><strong>' + l.titulo + '</strong><span>' + l.autor + '</span></div>';
        html += '<div class="libro-acciones">';
        html += '<button class="btn-leido" onclick="toggleLeido(' + l.id + ')">' + (l.leido ? '✓' : '○') + '</button>';
        html += '<button class="btn-eliminar" onclick="eliminar(' + l.id + ')">✕</button>';
        html += '</div></div>';
      });
      document.getElementById('lista').innerHTML = html;
    }
    function toggleLeido(id) {
      libros = libros.map(function(l) { return l.id === id ? Object.assign({}, l, { leido: !l.leido }) : l; });
      render();
    }
    function eliminar(id) {
      libros = libros.filter(function(l) { return l.id !== id; });
      render();
    }
    document.getElementById('btn-agregar').addEventListener('click', function() {
      libros.push({ id: contador, titulo: 'Libro #' + contador, autor: 'Autor ' + contador, leido: false });
      contador++;
      render();
    });
    render();
  </script>
</body>
</html>`,
    aiContext:
      'El usuario está aprendiendo qué son los servicios de Angular 19 y cómo crear un @Injectable con providedIn: root. Ha visto BibliotecaService con signals encapsuladas y un componente que lo consume con inject(). Puede preguntar sobre la diferencia entre servicios y componentes, sobre singleton, sobre tree-shaking, o sobre cómo el servicio comparte estado.',
    introMessage:
      'En esta primera lección del Módulo 4 crearás tu primer servicio Angular.\n\nEl código muestra `BibliotecaService` con `@Injectable({ providedIn: \'root\' })` — una clase que centraliza el estado de los libros y expone métodos para mutarlo. El componente solo consume el servicio, sin guardar estado propio.\n\nPregúntame sobre `@Injectable`, sobre singletons, o sobre por qué separar lógica en servicios.',
    suggestedQuestions: [
      '¿Cuál es la diferencia entre un servicio y un componente en Angular?',
      '¿Qué significa que un servicio sea "tree-shakeable"?',
      '¿Puedo tener múltiples instancias del mismo servicio?',
    ],
  },

  {
    id: 'L4.2',
    module: 4,
    moduleTitle: 'Servicios e Inyección de Dependencias',
    title: 'inject(): La forma moderna de inyección',
    subtitle: 'Di adiós al constructor — inject() en field initializers',
    estimatedMinutes: 12,
    xpReward: 130,
    prerequisites: ['L4.1'],
    nextLesson: 'L4.3',
    language: 'typescript',
    narrative: [
      {
        type: 'text',
        content:
          'Angular 14 introdujo la función `inject()` como alternativa al constructor injection. En lugar de declarar dependencias en el constructor, las declaras directamente como propiedades de clase. Esto elimina el boilerplate del constructor y permite encapsular la inyección en funciones reutilizables fuera de la clase.',
      },
      {
        type: 'comparison',
        leftLabel: 'Constructor injection (legacy)',
        rightLabel: 'inject() moderno',
        left: 'constructor(\n  private readonly svc: BibliotecaService,\n  private readonly router: Router\n) {}',
        right: 'readonly svc = inject(BibliotecaService);\nreadonly router = inject(Router);',
      },
      {
        type: 'text',
        content:
          'La ventaja más importante de `inject()` va más allá de la sintaxis: puedes llamarlo desde funciones que se ejecutan en contexto de inyección — como funciones helper, composables o guards funcionales. Con el constructor, la inyección quedaba atrapada dentro de la clase. Con `inject()`, es composable.',
      },
      {
        type: 'tip',
        variant: 'warning',
        content:
          '`inject()` solo funciona durante la construcción del componente — en field initializers o en el constructor, pero NO en métodos ordinarios ni en setTimeout. Si intentas llamarlo fuera del contexto de inyección, Angular lanzará un error en tiempo de ejecución.',
      },
      {
        type: 'checkpoint',
        question: '¿Dónde puedes usar inject() de forma válida?',
        options: [
          'En cualquier método de la clase',
          'Solo en el constructor',
          'En field initializers y en el cuerpo del constructor',
          'En callbacks de setTimeout y addEventListener',
        ],
        correct: 2,
        explanation:
          '`inject()` solo puede llamarse durante el contexto de construcción del componente: en field initializers (cuando declaras las propiedades) o dentro del constructor. Angular necesita el contexto de inyección activo para resolver la dependencia — fuera de ese contexto, lanza un error.',
      },
    ],
    starterCode: `import { Injectable, inject, signal, computed, ChangeDetectionStrategy } from '@angular/core';
import { Component } from '@angular/core';

// 📚 Biblioteca Angular — inject() moderno
// Dos componentes leen del mismo BibliotecaService via inject()

interface Libro {
  id: number;
  titulo: string;
  autor: string;
  leido: boolean;
}

@Injectable({ providedIn: 'root' })
export class BibliotecaService {
  private readonly _libros = signal<Libro[]>([
    { id: 1, titulo: 'Clean Code', autor: 'Robert C. Martin', leido: true },
    { id: 2, titulo: 'The Pragmatic Programmer', autor: 'Hunt & Thomas', leido: false },
    { id: 3, titulo: 'Refactoring', autor: 'Martin Fowler', leido: true },
    { id: 4, titulo: 'Clean Architecture', autor: 'Robert C. Martin', leido: false },
    { id: 5, titulo: 'Design Patterns', autor: 'Gang of Four', leido: false },
  ]);

  readonly libros = this._libros.asReadonly();
  readonly total = computed(() => this._libros().length);
  readonly totalLeidos = computed(() => this._libros().filter(l => l.leido).length);
  readonly porcentaje = computed(() =>
    this.total() === 0 ? 0 : Math.round((this.totalLeidos() / this.total()) * 100)
  );

  toggleLeido(id: number): void {
    this._libros.update(lista =>
      lista.map(l => l.id === id ? { ...l, leido: !l.leido } : l)
    );
  }
}

// ── Componente 1: muestra la lista ───────────────────────────
@Component({
  selector: 'app-lista-libros',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: \`
    <div class="panel">
      <h3>Lista de libros</h3>
      @for (libro of svc.libros(); track libro.id) {
        <div class="libro-row" [class.leido]="libro.leido">
          <span>{{ libro.titulo }}</span>
          <button (click)="svc.toggleLeido(libro.id)">
            {{ libro.leido ? '✓ Leído' : 'Marcar' }}
          </button>
        </div>
      }
    </div>
  \`,
})
export class ListaLibrosComponent {
  // inject() como field initializer — sin constructor
  readonly svc = inject(BibliotecaService);
}

// ── Componente 2: muestra estadísticas ───────────────────────
@Component({
  selector: 'app-stats-biblioteca',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: \`
    <div class="stats-panel">
      <h3>Estadísticas</h3>
      <div class="stat-row">
        <span>Total libros</span>
        <strong>{{ svc.total() }}</strong>
      </div>
      <div class="stat-row">
        <span>Leídos</span>
        <strong class="verde">{{ svc.totalLeidos() }}</strong>
      </div>
      <div class="stat-row">
        <span>Progreso</span>
        <strong class="morado">{{ svc.porcentaje() }}%</strong>
      </div>
      <div class="progress-bar">
        <div class="progress-fill" [style.width.%]="svc.porcentaje()"></div>
      </div>
    </div>
  \`,
})
export class StatsBibliotecaComponent {
  // La misma instancia del servicio — Angular inyecta el mismo singleton
  readonly svc = inject(BibliotecaService);
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
    .layout { display: flex; gap: 1rem; width: 100%; max-width: 700px; align-items: flex-start; flex-wrap: wrap; }
    .panel { background: #161B22; border: 1px solid #30363D; border-radius: 12px; overflow: hidden; flex: 1; min-width: 260px; }
    .panel h3 { font-size: 0.875rem; font-weight: 600; padding: 1rem 1.25rem; border-bottom: 1px solid #30363D; background: #0D1117; color: #8B5CF6; }
    .libro-row { display: flex; align-items: center; justify-content: space-between; padding: 0.625rem 1.25rem; border-bottom: 1px solid #21262D; border-left: 3px solid transparent; font-size: 0.82rem; transition: all 200ms; }
    .libro-row:last-child { border-bottom: none; }
    .libro-row.leido { border-left-color: #22c55e; background: rgba(34,197,94,0.04); color: #8B949E; }
    .libro-row button { background: transparent; border: 1px solid #30363D; color: #8B949E; border-radius: 5px; padding: 0.25rem 0.6rem; font-size: 0.75rem; transition: all 150ms; white-space: nowrap; }
    .libro-row.leido button { border-color: #22c55e; color: #22c55e; }
    .stats-panel { background: #161B22; border: 1px solid #30363D; border-radius: 12px; overflow: hidden; flex: 0 0 200px; }
    .stats-panel h3 { font-size: 0.875rem; font-weight: 600; padding: 1rem 1.25rem; border-bottom: 1px solid #30363D; background: #0D1117; color: #8B5CF6; }
    .stat-row { display: flex; align-items: center; justify-content: space-between; padding: 0.75rem 1.25rem; border-bottom: 1px solid #21262D; font-size: 0.82rem; color: #8B949E; }
    .stat-row:last-of-type { border-bottom: none; }
    .stat-row strong { color: #E6EDF3; }
    .verde { color: #22c55e !important; }
    .morado { color: #8B5CF6 !important; }
    .progress-bar { margin: 1rem; height: 6px; background: #21262D; border-radius: 3px; overflow: hidden; }
    .progress-fill { height: 100%; background: linear-gradient(90deg, #7C3AED, #8B5CF6); border-radius: 3px; transition: width 300ms ease; }
    .shared-label { width: 100%; text-align: center; font-family: 'JetBrains Mono', monospace; font-size: 0.65rem; color: #8B949E; margin-bottom: 0.5rem; }
    .shared-label span { color: #22c55e; }
  </style>
</head>
<body>
  <span class="component-label">inject() — estado compartido</span>
  <div style="width:100%;max-width:700px;">
    <p class="shared-label">Ambos componentes leen del mismo <span>BibliotecaService</span></p>
    <div class="layout">
      <div class="panel">
        <h3>app-lista-libros</h3>
        <div id="lista"></div>
      </div>
      <div class="stats-panel">
        <h3>app-stats-biblioteca</h3>
        <div class="stat-row"><span>Total libros</span><strong id="total">5</strong></div>
        <div class="stat-row"><span>Leidos</span><strong class="verde" id="leidos">2</strong></div>
        <div class="stat-row"><span>Progreso</span><strong class="morado" id="pct">40%</strong></div>
        <div class="progress-bar"><div class="progress-fill" id="fill" style="width:40%"></div></div>
      </div>
    </div>
  </div>
  <script>
    var libros = [
      { id: 1, titulo: 'Clean Code', autor: 'Robert C. Martin', leido: true },
      { id: 2, titulo: 'The Pragmatic Programmer', autor: 'Hunt & Thomas', leido: false },
      { id: 3, titulo: 'Refactoring', autor: 'Martin Fowler', leido: true },
      { id: 4, titulo: 'Clean Architecture', autor: 'Robert C. Martin', leido: false },
      { id: 5, titulo: 'Design Patterns', autor: 'Gang of Four', leido: false }
    ];
    function render() {
      var leidos = libros.filter(function(l) { return l.leido; }).length;
      var pct = Math.round(leidos / libros.length * 100);
      document.getElementById('total').textContent = libros.length;
      document.getElementById('leidos').textContent = leidos;
      document.getElementById('pct').textContent = pct + '%';
      document.getElementById('fill').style.width = pct + '%';
      var html = '';
      libros.forEach(function(l) {
        html += '<div class="libro-row' + (l.leido ? ' leido' : '') + '">';
        html += '<span>' + l.titulo + '</span>';
        html += '<button onclick="toggle(' + l.id + ')">' + (l.leido ? '✓ Leido' : 'Marcar') + '</button>';
        html += '</div>';
      });
      document.getElementById('lista').innerHTML = html;
    }
    function toggle(id) {
      libros = libros.map(function(l) { return l.id === id ? Object.assign({}, l, { leido: !l.leido }) : l; });
      render();
    }
    render();
  </script>
</body>
</html>`,
    aiContext:
      'El usuario está aprendiendo inject() en Angular 19 como alternativa moderna al constructor injection. Ha visto dos componentes que comparten el mismo BibliotecaService via inject() y observan cómo el estado se sincroniza. Puede preguntar sobre inject() vs constructor, sobre dónde se puede llamar inject(), sobre composables o funciones de inyección reutilizables.',
    introMessage:
      'Esta lección presenta `inject()` — la forma moderna de obtener servicios en Angular 19.\n\nDos componentes independientes (`app-lista-libros` y `app-stats-biblioteca`) llaman a `inject(BibliotecaService)` como field initializer. Angular les entrega la misma instancia singleton — cuando marcas un libro en la lista, el contador de estadísticas se actualiza inmediatamente.\n\nPregúntame sobre `inject()` vs constructor injection, o sobre dónde se puede (y no se puede) llamar.',
    suggestedQuestions: [
      '¿Puedo llamar inject() dentro de un método de la clase?',
      '¿Qué ventaja tiene inject() sobre el constructor para componer lógica?',
      '¿Cómo sé que los dos componentes están obteniendo la misma instancia del servicio?',
    ],
  },

  {
    id: 'L4.3',
    module: 4,
    moduleTitle: 'Servicios e Inyección de Dependencias',
    title: 'Servicios con estado: Signals compartidas entre componentes',
    subtitle: 'El servicio como fuente de verdad única con encapsulación correcta',
    estimatedMinutes: 15,
    xpReward: 150,
    prerequisites: ['L4.2'],
    nextLesson: 'L4.4',
    language: 'typescript',
    narrative: [
      {
        type: 'text',
        content:
          'Un servicio bien diseñado expone signals de solo lectura al exterior y mutación únicamente a través de métodos explícitos. Este patrón — private writable signal + public readonly signal + métodos de mutación — es el equivalente Angular del patrón de store: predecible, trazable y fácil de testear.',
      },
      {
        type: 'tip',
        variant: 'info',
        content:
          '`signal.asReadonly()` devuelve un `Signal<T>` en lugar de un `WritableSignal<T>`. Los consumidores pueden leer el valor, pero TypeScript no les dejará llamar `.set()` ni `.update()`. El estado solo cambia por los caminos que tú controlas.',
      },
      {
        type: 'text',
        content:
          'Los `computed()` dentro del servicio son igual de valiosos que en los componentes. Un `total` computado en el servicio es compartido y memoizado — todos los componentes que lo lean obtienen el mismo valor cacheado, no cada uno su propio cómputo independiente.',
      },
      {
        type: 'tip',
        variant: 'angular',
        content:
          'Este patrón de "servicio con signals" es la alternativa Angular moderna a NgRx para el estado de feature. Para apps medianas no necesitas un store externo — un servicio bien encapsulado con signals tiene el 90% del beneficio con el 10% de la complejidad.',
      },
      {
        type: 'checkpoint',
        question: '¿Por qué exponer las signals del servicio como asReadonly()?',
        options: [
          'Para mejorar el rendimiento en tiempo de ejecución',
          'Para que TypeScript impida mutaciones accidentales desde componentes externos',
          'Porque asReadonly() es obligatorio en servicios con providedIn: root',
          'Para activar la detección de cambios OnPush en los componentes consumidores',
        ],
        correct: 1,
        explanation:
          '`asReadonly()` convierte un `WritableSignal<T>` en un `Signal<T>` (sin `.set()` ni `.update()`). TypeScript impide en compilación que cualquier componente mute el estado directamente. Toda mutación pasa por los métodos del servicio — tu código es predecible y trazable.',
      },
    ],
    starterCode: `import { Injectable, inject, signal, computed, ChangeDetectionStrategy } from '@angular/core';
import { Component } from '@angular/core';

// 📚 Biblioteca Angular — Servicio como fuente de verdad única

interface Libro {
  id: number;
  titulo: string;
  autor: string;
  genero: string;
  leido: boolean;
  favorito: boolean;
}

// ── Servicio bien encapsulado ────────────────────────────────
@Injectable({ providedIn: 'root' })
export class BibliotecaService {
  // Estado PRIVADO y mutable — solo el servicio puede escribirlo
  private readonly _libros = signal<Libro[]>([
    { id: 1, titulo: 'Clean Code', autor: 'R. C. Martin', genero: 'Programación', leido: true, favorito: true },
    { id: 2, titulo: 'The Pragmatic Programmer', autor: 'Hunt & Thomas', genero: 'Programación', leido: true, favorito: false },
    { id: 3, titulo: 'Refactoring', autor: 'M. Fowler', genero: 'Programación', leido: false, favorito: true },
    { id: 4, titulo: 'Dune', autor: 'Frank Herbert', genero: 'Ciencia Ficción', leido: false, favorito: false },
    { id: 5, titulo: '1984', autor: 'George Orwell', genero: 'Distopía', leido: true, favorito: true },
  ]);

  // API PÚBLICA de solo lectura — los componentes leen, el servicio escribe
  readonly libros = this._libros.asReadonly();

  // Derived state — memoizado y compartido entre todos los consumidores
  readonly total = computed(() => this._libros().length);
  readonly leidos = computed(() => this._libros().filter(l => l.leido).length);
  readonly favoritos = computed(() => this._libros().filter(l => l.favorito));
  readonly totalFavoritos = computed(() => this.favoritos().length);
  readonly porcentajeLeido = computed(() =>
    this.total() === 0 ? 0 : Math.round((this.leidos() / this.total()) * 100)
  );
  readonly generos = computed(() =>
    [...new Set(this._libros().map(l => l.genero))]
  );

  // Métodos de mutación — único camino para cambiar el estado
  toggleLeido(id: number): void {
    this._libros.update(lista =>
      lista.map(l => l.id === id ? { ...l, leido: !l.leido } : l)
    );
  }

  toggleFavorito(id: number): void {
    this._libros.update(lista =>
      lista.map(l => l.id === id ? { ...l, favorito: !l.favorito } : l)
    );
  }
}

// ── Dashboard: usa TODOS los computed del servicio ──────────
@Component({
  selector: 'app-dashboard-biblioteca',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: \`
    <div class="dashboard">
      <h2>Dashboard Biblioteca</h2>

      <div class="cards">
        <div class="card">
          <span class="card-num">{{ svc.total() }}</span>
          <span class="card-label">Total</span>
        </div>
        <div class="card verde">
          <span class="card-num">{{ svc.leidos() }}</span>
          <span class="card-label">Leídos</span>
        </div>
        <div class="card morado">
          <span class="card-num">{{ svc.totalFavoritos() }}</span>
          <span class="card-label">Favoritos</span>
        </div>
        <div class="card azul">
          <span class="card-num">{{ svc.generos().length }}</span>
          <span class="card-label">Géneros</span>
        </div>
      </div>

      <div class="progress-section">
        <div class="progress-header">
          <span>Progreso de lectura</span>
          <span class="pct">{{ svc.porcentajeLeido() }}%</span>
        </div>
        <div class="progress-bar">
          <div class="progress-fill" [style.width.%]="svc.porcentajeLeido()"></div>
        </div>
      </div>

      <div class="libro-list">
        @for (libro of svc.libros(); track libro.id) {
          <div class="libro-row" [class.leido]="libro.leido">
            <div class="libro-meta">
              <strong>{{ libro.titulo }}</strong>
              <span class="genero-tag">{{ libro.genero }}</span>
            </div>
            <div class="libro-btns">
              <button (click)="svc.toggleFavorito(libro.id)" [class.activo]="libro.favorito">♥</button>
              <button (click)="svc.toggleLeido(libro.id)" [class.activo]="libro.leido">✓</button>
            </div>
          </div>
        }
      </div>
    </div>
  \`,
})
export class DashboardBibliotecaComponent {
  readonly svc = inject(BibliotecaService);
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
    .dashboard { background: #161B22; border: 1px solid #30363D; border-radius: 12px; padding: 1.5rem; width: 100%; max-width: 460px; }
    .dashboard h2 { font-size: 1rem; font-weight: 600; margin-bottom: 1.25rem; }
    .cards { display: grid; grid-template-columns: repeat(4, 1fr); gap: 0.625rem; margin-bottom: 1.25rem; }
    .card { background: #21262D; border: 1px solid #30363D; border-radius: 8px; padding: 0.75rem 0.5rem; text-align: center; }
    .card.verde { border-color: rgba(34,197,94,0.3); background: rgba(34,197,94,0.06); }
    .card.morado { border-color: rgba(124,58,237,0.4); background: rgba(124,58,237,0.08); }
    .card.azul { border-color: rgba(56,189,248,0.3); background: rgba(56,189,248,0.06); }
    .card-num { display: block; font-size: 1.6rem; font-weight: 700; color: #E6EDF3; line-height: 1; }
    .card.verde .card-num { color: #22c55e; }
    .card.morado .card-num { color: #8B5CF6; }
    .card.azul .card-num { color: #38bdf8; }
    .card-label { display: block; font-size: 0.68rem; color: #8B949E; margin-top: 0.2rem; }
    .progress-section { margin-bottom: 1.25rem; }
    .progress-header { display: flex; justify-content: space-between; font-size: 0.8rem; color: #8B949E; margin-bottom: 0.5rem; }
    .pct { color: #8B5CF6; font-weight: 600; }
    .progress-bar { height: 6px; background: #21262D; border-radius: 3px; overflow: hidden; }
    .progress-fill { height: 100%; background: linear-gradient(90deg, #7C3AED, #8B5CF6); border-radius: 3px; transition: width 300ms; }
    .libro-list { display: flex; flex-direction: column; gap: 0; border: 1px solid #30363D; border-radius: 8px; overflow: hidden; }
    .libro-row { display: flex; align-items: center; justify-content: space-between; padding: 0.625rem 0.875rem; background: #0D1117; border-bottom: 1px solid #21262D; border-left: 3px solid transparent; transition: all 200ms; }
    .libro-row:last-child { border-bottom: none; }
    .libro-row.leido { border-left-color: #22c55e; }
    .libro-meta { display: flex; align-items: center; gap: 0.5rem; flex: 1; min-width: 0; }
    .libro-meta strong { font-size: 0.8rem; font-weight: 600; color: #E6EDF3; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .genero-tag { font-size: 0.65rem; color: #8B949E; background: #21262D; border: 1px solid #30363D; padding: 0.1em 0.4em; border-radius: 4px; white-space: nowrap; flex-shrink: 0; }
    .libro-btns { display: flex; gap: 0.4rem; }
    .libro-btns button { background: transparent; border: 1px solid #30363D; color: #8B949E; border-radius: 5px; width: 26px; height: 26px; font-size: 0.8rem; display: flex; align-items: center; justify-content: center; transition: all 150ms; }
    .libro-btns button.activo { border-color: #8B5CF6; color: #8B5CF6; background: rgba(139,92,246,0.1); }
    .libro-btns button:first-child.activo { border-color: #f43f5e; color: #f43f5e; background: rgba(244,63,94,0.1); }
  </style>
</head>
<body>
  <span class="component-label">app-dashboard-biblioteca</span>
  <div class="dashboard">
    <h2>Dashboard Biblioteca</h2>
    <div class="cards">
      <div class="card"><span class="card-num" id="c-total">5</span><span class="card-label">Total</span></div>
      <div class="card verde"><span class="card-num" id="c-leidos">3</span><span class="card-label">Leidos</span></div>
      <div class="card morado"><span class="card-num" id="c-favs">3</span><span class="card-label">Favoritos</span></div>
      <div class="card azul"><span class="card-num" id="c-gen">3</span><span class="card-label">Generos</span></div>
    </div>
    <div class="progress-section">
      <div class="progress-header"><span>Progreso de lectura</span><span class="pct" id="pct-label">60%</span></div>
      <div class="progress-bar"><div class="progress-fill" id="fill" style="width:60%"></div></div>
    </div>
    <div class="libro-list" id="lista"></div>
  </div>
  <script>
    var libros = [
      { id: 1, titulo: 'Clean Code', genero: 'Programacion', leido: true, favorito: true },
      { id: 2, titulo: 'The Pragmatic Programmer', genero: 'Programacion', leido: true, favorito: false },
      { id: 3, titulo: 'Refactoring', genero: 'Programacion', leido: false, favorito: true },
      { id: 4, titulo: 'Dune', genero: 'Ciencia Ficcion', leido: false, favorito: false },
      { id: 5, titulo: '1984', genero: 'Distopia', leido: true, favorito: true }
    ];
    function getGeneros() { return [...new Set(libros.map(function(l) { return l.genero; }))]; }
    function render() {
      var leidos = libros.filter(function(l) { return l.leido; }).length;
      var favs = libros.filter(function(l) { return l.favorito; }).length;
      var pct = Math.round(leidos / libros.length * 100);
      document.getElementById('c-total').textContent = libros.length;
      document.getElementById('c-leidos').textContent = leidos;
      document.getElementById('c-favs').textContent = favs;
      document.getElementById('c-gen').textContent = getGeneros().length;
      document.getElementById('pct-label').textContent = pct + '%';
      document.getElementById('fill').style.width = pct + '%';
      var html = '';
      libros.forEach(function(l) {
        html += '<div class="libro-row' + (l.leido ? ' leido' : '') + '">';
        html += '<div class="libro-meta"><strong>' + l.titulo + '</strong><span class="genero-tag">' + l.genero + '</span></div>';
        html += '<div class="libro-btns">';
        html += '<button class="' + (l.favorito ? 'activo' : '') + '" onclick="toggleFav(' + l.id + ')">♥</button>';
        html += '<button class="' + (l.leido ? 'activo' : '') + '" onclick="toggleLeido(' + l.id + ')">✓</button>';
        html += '</div></div>';
      });
      document.getElementById('lista').innerHTML = html;
    }
    function toggleFav(id) { libros = libros.map(function(l) { return l.id === id ? Object.assign({}, l, { favorito: !l.favorito }) : l; }); render(); }
    function toggleLeido(id) { libros = libros.map(function(l) { return l.id === id ? Object.assign({}, l, { leido: !l.leido }) : l; }); render(); }
    render();
  </script>
</body>
</html>`,
    aiContext:
      'El usuario está aprendiendo a diseñar servicios con signals bien encapsulados en Angular 19: private WritableSignal + asReadonly() + computed() + métodos de mutación. Ha visto un dashboard completo donde todas las métricas derivan del mismo estado. Puede preguntar sobre asReadonly(), sobre el patrón store, sobre computed() en servicios, o comparar con NgRx.',
    introMessage:
      'Esta lección muestra el patrón de servicio con estado correcto: state privado, API pública readonly, y mutación solo a través de métodos.\n\nEl dashboard tiene cuatro contadores, una barra de progreso y una lista — todo derivado del mismo `_libros` signal privado. Cambia favoritos o leídos y observa cómo todo se sincroniza a la vez.\n\nPregúntame sobre `asReadonly()`, sobre `computed()` en servicios, o sobre cuándo vale la pena usar NgRx.',
    suggestedQuestions: [
      '¿Cuál es la diferencia entre WritableSignal y Signal en el contexto de un servicio?',
      '¿Los computed() del servicio se recalculan por separado para cada componente que los lee?',
      '¿Cuándo debería usar NgRx en lugar de un servicio con signals?',
    ],
  },

  {
    id: 'L4.4',
    module: 4,
    moduleTitle: 'Servicios e Inyección de Dependencias',
    title: 'Providers de componente: Instancias aisladas',
    subtitle: 'Controla el scope de tus servicios con providers en el decorador',
    estimatedMinutes: 13,
    xpReward: 140,
    prerequisites: ['L4.3'],
    nextLesson: 'L4.5',
    language: 'typescript',
    narrative: [
      {
        type: 'text',
        content:
          'Por defecto, `providedIn: \'root\'` crea un singleton para toda la app. Pero a veces quieres una instancia separada por cada componente — por ejemplo, un carrito de compras temporal, un formulario wizard con múltiples pasos, o un panel modal que necesita su propio estado independiente. La solución: `providers: [MiServicio]` en el decorador del componente.',
      },
      {
        type: 'tip',
        variant: 'info',
        content:
          'Cuando declaras un servicio en `providers` de un componente, Angular crea una nueva instancia de ese servicio para ese componente y sus hijos. La instancia existe mientras existe el componente — cuando Angular destruye el componente, destruye también la instancia del servicio.',
      },
      {
        type: 'text',
        content:
          'Esto es especialmente poderoso para componentes que se instancian múltiples veces en la misma página. Cada instancia del componente tiene su propio servicio — completamente aislado de las demás. Sin conflictos de estado, sin necesidad de IDs para separar los datos.',
      },
      {
        type: 'tip',
        variant: 'warning',
        content:
          'Si un componente hijo inyecta el mismo servicio que ya está en `providers` del padre, recibe la instancia del padre (herencia de injector). Solo si el hijo también lo declara en sus propios `providers` obtendrá una instancia nueva. El injector sube por el árbol hasta encontrar un proveedor.',
      },
      {
        type: 'checkpoint',
        question: '¿Qué sucede cuando destruyes un componente que tiene un servicio en su providers?',
        options: [
          'El servicio permanece activo porque sigue registrado en el injector raíz',
          'El servicio se destruye junto con el componente',
          'Angular lanza un error si el servicio tiene estado',
          'El servicio migra automáticamente al siguiente componente',
        ],
        correct: 1,
        explanation:
          'Cuando Angular destruye un componente, también destruye las instancias de los servicios declarados en sus `providers`. Esta vinculación de ciclo de vida es una de las ventajas clave de los providers de componente: no hay leaks de estado entre sesiones o navegaciones.',
      },
    ],
    starterCode: `import { Injectable, inject, signal, computed, ChangeDetectionStrategy } from '@angular/core';
import { Component } from '@angular/core';

// 📚 Biblioteca Angular — Providers de componente
// CarritoService SIN providedIn: root — se provee a nivel de componente

interface LibroCarrito {
  id: number;
  titulo: string;
  precio: number;
}

// ⚠️ Sin providedIn: 'root' — el scope lo define quien lo declare en providers
@Injectable()
export class CarritoService {
  private readonly _items = signal<LibroCarrito[]>([]);

  readonly items = this._items.asReadonly();
  readonly totalItems = computed(() => this._items().length);
  readonly totalPrecio = computed(() =>
    this._items().reduce((acc, item) => acc + item.precio, 0)
  );

  agregar(libro: LibroCarrito): void {
    if (!this._items().find(i => i.id === libro.id)) {
      this._items.update(items => [...items, libro]);
    }
  }

  vaciar(): void {
    this._items.set([]);
  }
}

const LIBROS_DISPONIBLES: LibroCarrito[] = [
  { id: 1, titulo: 'Clean Code', precio: 29 },
  { id: 2, titulo: 'Refactoring', precio: 34 },
  { id: 3, titulo: 'Design Patterns', precio: 45 },
];

// ── Componente con su PROPIA instancia del servicio ─────────
// Cada instancia de este componente tiene un carrito independiente
@Component({
  selector: 'app-carrito-panel',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  // ↓ Esta línea crea una instancia nueva de CarritoService
  //   para este componente y sus hijos
  providers: [CarritoService],
  template: \`
    <div class="carrito-panel">
      <h3>{{ titulo }} <span class="badge">{{ carrito.totalItems() }}</span></h3>

      <div class="libros-disponibles">
        @for (libro of libros; track libro.id) {
          <button class="libro-btn" (click)="carrito.agregar(libro)">
            + {{ libro.titulo }} ({{ libro.precio }}€)
          </button>
        }
      </div>

      @if (carrito.totalItems() > 0) {
        <div class="items-carrito">
          @for (item of carrito.items(); track item.id) {
            <div class="item">{{ item.titulo }} — {{ item.precio }}€</div>
          }
          <div class="total">Total: {{ carrito.totalPrecio() }}€</div>
        </div>
        <button class="btn-vaciar" (click)="carrito.vaciar()">Vaciar carrito</button>
      } @else {
        <p class="vacio">Carrito vacío</p>
      }
    </div>
  \`,
})
export class CarritoPanelComponent {
  // inject() obtiene la instancia PROPIA de este componente
  readonly carrito = inject(CarritoService);
  readonly libros = LIBROS_DISPONIBLES;
  readonly titulo = 'Carrito';
}

// ── Página que muestra DOS instancias independientes ─────────
@Component({
  selector: 'app-tienda-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CarritoPanelComponent],
  template: \`
    <div class="tienda">
      <p class="hint">Cada panel tiene su propio CarritoService — instancias aisladas</p>
      <div class="paneles">
        <app-carrito-panel />
        <app-carrito-panel />
      </div>
    </div>
  \`,
})
export class TiendaPageComponent {}
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
    .tienda { width: 100%; max-width: 700px; }
    .hint { font-size: 0.75rem; color: #8B949E; text-align: center; margin-bottom: 1rem; font-family: 'JetBrains Mono', monospace; }
    .hint span { color: #7C3AED; }
    .paneles { display: flex; gap: 1rem; flex-wrap: wrap; justify-content: center; }
    .carrito-panel { background: #161B22; border: 1px solid #30363D; border-radius: 12px; padding: 1.25rem; flex: 1; min-width: 260px; max-width: 320px; }
    .carrito-panel h3 { font-size: 0.875rem; font-weight: 600; margin-bottom: 1rem; display: flex; align-items: center; gap: 0.5rem; }
    .badge { background: #7C3AED; color: white; font-size: 0.7rem; font-weight: 700; padding: 0.1em 0.5em; border-radius: 10px; min-width: 18px; text-align: center; }
    .libros-disponibles { display: flex; flex-direction: column; gap: 0.4rem; margin-bottom: 1rem; }
    .libro-btn { background: #21262D; border: 1px solid #30363D; color: #8B949E; border-radius: 6px; padding: 0.5rem 0.75rem; font-size: 0.8rem; text-align: left; transition: all 150ms; }
    .libro-btn:hover { border-color: #7C3AED; color: #c4b5fd; background: rgba(124,58,237,0.08); }
    .items-carrito { background: #0D1117; border: 1px solid #21262D; border-radius: 6px; padding: 0.75rem; margin-bottom: 0.75rem; }
    .item { font-size: 0.8rem; color: #E6EDF3; padding: 0.25rem 0; border-bottom: 1px solid #21262D; }
    .item:last-of-type { border-bottom: none; }
    .total { font-size: 0.85rem; font-weight: 700; color: #7C3AED; margin-top: 0.5rem; padding-top: 0.5rem; border-top: 1px solid #30363D; }
    .btn-vaciar { background: transparent; border: 1px solid #f85149; color: #f85149; border-radius: 6px; padding: 0.4rem 0.875rem; font-size: 0.78rem; transition: all 150ms; width: 100%; }
    .btn-vaciar:hover { background: rgba(248,81,73,0.08); }
    .vacio { font-size: 0.8rem; color: #8B949E; text-align: center; padding: 0.75rem 0; }
    .panel-label { font-size: 0.65rem; color: #8B949E; font-family: 'JetBrains Mono', monospace; margin-bottom: 0.5rem; }
  </style>
</head>
<body>
  <span class="component-label">app-tienda-page</span>
  <div class="tienda">
    <p class="hint">Cada panel tiene su propio <span>CarritoService</span> — instancias aisladas</p>
    <div class="paneles">
      <div class="carrito-panel" id="panel-a">
        <p class="panel-label">providers: [CarritoService] — instancia A</p>
        <h3>Carrito <span class="badge" id="badge-a">0</span></h3>
        <div class="libros-disponibles">
          <button class="libro-btn" onclick="agregar('a',1,'Clean Code',29)">+ Clean Code (29€)</button>
          <button class="libro-btn" onclick="agregar('a',2,'Refactoring',34)">+ Refactoring (34€)</button>
          <button class="libro-btn" onclick="agregar('a',3,'Design Patterns',45)">+ Design Patterns (45€)</button>
        </div>
        <div id="items-a"></div>
      </div>
      <div class="carrito-panel" id="panel-b">
        <p class="panel-label">providers: [CarritoService] — instancia B</p>
        <h3>Carrito <span class="badge" id="badge-b">0</span></h3>
        <div class="libros-disponibles">
          <button class="libro-btn" onclick="agregar('b',1,'Clean Code',29)">+ Clean Code (29€)</button>
          <button class="libro-btn" onclick="agregar('b',2,'Refactoring',34)">+ Refactoring (34€)</button>
          <button class="libro-btn" onclick="agregar('b',3,'Design Patterns',45)">+ Design Patterns (45€)</button>
        </div>
        <div id="items-b"></div>
      </div>
    </div>
  </div>
  <script>
    var carritos = { a: [], b: [] };
    function agregar(panel, id, titulo, precio) {
      if (!carritos[panel].find(function(i) { return i.id === id; })) {
        carritos[panel].push({ id: id, titulo: titulo, precio: precio });
        renderPanel(panel);
      }
    }
    function vaciar(panel) { carritos[panel] = []; renderPanel(panel); }
    function renderPanel(panel) {
      var items = carritos[panel];
      var total = items.reduce(function(acc, i) { return acc + i.precio; }, 0);
      document.getElementById('badge-' + panel).textContent = items.length;
      var el = document.getElementById('items-' + panel);
      if (items.length === 0) {
        el.innerHTML = '<p class="vacio">Carrito vacio</p>';
      } else {
        var html = '<div class="items-carrito">';
        items.forEach(function(i) { html += '<div class="item">' + i.titulo + ' — ' + i.precio + '€</div>'; });
        html += '<div class="total">Total: ' + total + '€</div></div>';
        html += '<button class="btn-vaciar" onclick="vaciar(\'' + panel + '\')">Vaciar carrito</button>';
        el.innerHTML = html;
      }
    }
    renderPanel('a');
    renderPanel('b');
  </script>
</body>
</html>`,
    aiContext:
      'El usuario está aprendiendo providers de componente en Angular 19: cómo declarar un servicio en providers[] del decorador @Component para obtener instancias aisladas. Ha visto dos carritos independientes usando la misma clase CarritoService. Puede preguntar sobre la herencia de injector, sobre cuándo usar scope de componente vs root, o sobre el ciclo de vida de las instancias.',
    introMessage:
      'Esta lección muestra cómo crear instancias aisladas de un servicio con `providers: [CarritoService]` en el decorador del componente.\n\nDos paneles de carrito usan la misma clase `CarritoService` pero cada uno tiene su propia instancia independiente. Agrega libros en uno — el otro no se entera.\n\nPregúntame sobre la jerarquía de injectors, sobre cuándo aislar vs compartir, o sobre el ciclo de vida de estos servicios.',
    suggestedQuestions: [
      '¿Qué pasa si un componente hijo también declara el mismo servicio en providers?',
      '¿Cuándo tiene sentido usar providers de componente en lugar de providedIn: root?',
      '¿Se destruye el servicio cuando el componente se destruye?',
    ],
  },

  {
    id: 'L4.5',
    module: 4,
    moduleTitle: 'Servicios e Inyección de Dependencias',
    title: 'InjectionToken: Inyectar valores, no solo clases',
    subtitle: 'Configura tu app con tokens tipados para primitivas y objetos de config',
    estimatedMinutes: 13,
    xpReward: 130,
    prerequisites: ['L4.4'],
    nextLesson: 'L4.6',
    language: 'typescript',
    narrative: [
      {
        type: 'text',
        content:
          'La inyección de dependencias de Angular no se limita a clases — también puede inyectar strings, números, objetos de configuración o funciones. Para eso existe `InjectionToken<T>`: un token tipado que actúa como clave única en el sistema de DI. Es la solución correcta para inyectar configuración de la app sin acoplar los componentes a un objeto global.',
      },
      {
        type: 'tip',
        variant: 'info',
        content:
          'El segundo argumento de `InjectionToken` acepta un objeto con `providedIn` y `factory`. Si lo incluyes, el token se auto-provee con ese valor por defecto — sin necesidad de declararlo en ningún `providers` array. Útil para configuraciones con valores razonables por defecto.',
      },
      {
        type: 'text',
        content:
          'Para consumir un `InjectionToken` con `inject()`, pásalo directamente: `const config = inject(APP_CONFIG)`. TypeScript infiere el tipo automáticamente del genérico del token. Para valores opcionales, usa `inject(TOKEN, { optional: true })` — devuelve `null` si no está provisto en lugar de lanzar error.',
      },
      {
        type: 'tip',
        variant: 'angular',
        content:
          'Los `InjectionToken` con `factory` integrado son la alternativa moderna a los archivos `environment.ts` del antiguo CLI. En lugar de importar un objeto global, inyectas la configuración — testeable, sobreescribible, y con tipo seguro.',
      },
      {
        type: 'checkpoint',
        question: '¿Por qué usar InjectionToken en lugar de importar directamente un objeto de config?',
        options: [
          'Porque InjectionToken es más rápido en tiempo de ejecución',
          'Porque permite sobreescribir el valor en tests y configuraciones alternativas sin cambiar el código del componente',
          'Porque Angular requiere InjectionToken para cualquier valor que no sea una clase',
          'Solo por convención estética — ambas formas son equivalentes',
        ],
        correct: 1,
        explanation:
          'Con `InjectionToken`, los tests pueden proveer una configuración diferente sin modificar el componente (`providers: [{ provide: APP_CONFIG, useValue: mockConfig }]`). Con un import directo, el componente está acoplado a ese objeto y no es sobreescribible sin modificar el módulo de Angular.',
      },
    ],
    starterCode: `import { InjectionToken, inject, ChangeDetectionStrategy, signal } from '@angular/core';
import { Component } from '@angular/core';

// 📚 Biblioteca Angular — InjectionToken para configuración tipada

// ── Tipo e InjectionToken ─────────────────────────────────────
interface AppConfig {
  maxFavoritos: number;
  idioma: 'es' | 'en';
  temaOscuro: boolean;
  nombreApp: string;
  version: string;
}

// El token actúa como clave única en el sistema de DI
// La factory integrada provee los valores por defecto
export const APP_CONFIG = new InjectionToken<AppConfig>('APP_CONFIG', {
  providedIn: 'root',
  factory: () => ({
    maxFavoritos: 10,
    idioma: 'es' as const,
    temaOscuro: true,
    nombreApp: 'Biblioteca Angular',
    version: '4.0.0',
  }),
});

// ── Componente que consume el token ──────────────────────────
@Component({
  selector: 'app-config-panel',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: \`
    <div class="config-panel">
      <h2>{{ config.nombreApp }}</h2>
      <span class="version">v{{ config.version }}</span>

      <div class="config-grid">
        <div class="config-item">
          <span class="config-key">maxFavoritos</span>
          <span class="config-val">{{ config.maxFavoritos }}</span>
        </div>
        <div class="config-item">
          <span class="config-key">idioma</span>
          <span class="config-val">{{ config.idioma }}</span>
        </div>
        <div class="config-item">
          <span class="config-key">temaOscuro</span>
          <span class="config-val" [class.activo]="config.temaOscuro">
            {{ config.temaOscuro ? 'activado' : 'desactivado' }}
          </span>
        </div>
      </div>

      <div class="favoritos-info">
        <div class="fav-bar">
          <span>Favoritos usados: {{ favoritosUsados() }}/{{ config.maxFavoritos }}</span>
          <div class="bar-track">
            <div class="bar-fill"
              [style.width.%]="(favoritosUsados() / config.maxFavoritos) * 100"
              [class.lleno]="favoritosUsados() >= config.maxFavoritos">
            </div>
          </div>
        </div>
        <button (click)="agregarFavorito()" [disabled]="favoritosUsados() >= config.maxFavoritos">
          + Agregar favorito
        </button>
      </div>
    </div>
  \`,
})
export class ConfigPanelComponent {
  // inject() con InjectionToken — TypeScript conoce el tipo AppConfig
  readonly config = inject(APP_CONFIG);
  readonly favoritosUsados = signal(3);

  agregarFavorito(): void {
    if (this.favoritosUsados() < this.config.maxFavoritos) {
      this.favoritosUsados.update(n => n + 1);
    }
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
    .token-badge { position: fixed; top: 12px; left: 12px; font-family: 'JetBrains Mono', monospace; font-size: 0.625rem; color: #f59e0b; background: rgba(245,158,11,0.08); border: 1px solid rgba(245,158,11,0.25); padding: 0.2em 0.5em; border-radius: 4px; }
    button { cursor: pointer; font-family: 'Inter', sans-serif; }
    .config-panel { background: #161B22; border: 1px solid #30363D; border-radius: 12px; padding: 1.5rem; width: 100%; max-width: 400px; }
    .config-panel h2 { font-size: 1rem; font-weight: 600; margin-bottom: 0.25rem; }
    .version { font-family: 'JetBrains Mono', monospace; font-size: 0.7rem; color: #8B949E; display: block; margin-bottom: 1.25rem; }
    .config-grid { display: flex; flex-direction: column; gap: 0; border: 1px solid #30363D; border-radius: 8px; overflow: hidden; margin-bottom: 1.25rem; }
    .config-item { display: flex; align-items: center; justify-content: space-between; padding: 0.625rem 1rem; border-bottom: 1px solid #21262D; }
    .config-item:last-child { border-bottom: none; }
    .config-key { font-family: 'JetBrains Mono', monospace; font-size: 0.78rem; color: #8B949E; }
    .config-val { font-family: 'JetBrains Mono', monospace; font-size: 0.78rem; color: #E6EDF3; background: #0D1117; border: 1px solid #30363D; padding: 0.15em 0.5em; border-radius: 4px; }
    .config-val.activo { color: #22c55e; border-color: rgba(34,197,94,0.3); background: rgba(34,197,94,0.06); }
    .favoritos-info { background: #0D1117; border: 1px solid #21262D; border-radius: 8px; padding: 1rem; }
    .fav-bar { margin-bottom: 0.75rem; }
    .fav-bar span { font-size: 0.8rem; color: #8B949E; display: block; margin-bottom: 0.5rem; }
    .bar-track { height: 6px; background: #21262D; border-radius: 3px; overflow: hidden; }
    .bar-fill { height: 100%; background: linear-gradient(90deg, #7C3AED, #8B5CF6); border-radius: 3px; transition: width 300ms; }
    .bar-fill.lleno { background: #f85149; }
    .favoritos-info button { width: 100%; background: #7C3AED; color: white; border: none; border-radius: 6px; padding: 0.55rem 1rem; font-size: 0.85rem; font-weight: 500; transition: opacity 150ms; }
    .favoritos-info button:hover:not(:disabled) { opacity: 0.85; }
    .favoritos-info button:disabled { opacity: 0.35; cursor: not-allowed; }
    .token-hint { margin-top: 1rem; font-size: 0.72rem; color: #8B949E; text-align: center; font-family: 'JetBrains Mono', monospace; }
    .token-hint span { color: #f59e0b; }
  </style>
</head>
<body>
  <span class="token-badge">InjectionToken&lt;AppConfig&gt;</span>
  <span class="component-label">app-config-panel</span>
  <div class="config-panel">
    <h2>Biblioteca Angular</h2>
    <span class="version">v4.0.0</span>
    <div class="config-grid">
      <div class="config-item">
        <span class="config-key">maxFavoritos</span>
        <span class="config-val" id="max-favs">10</span>
      </div>
      <div class="config-item">
        <span class="config-key">idioma</span>
        <span class="config-val">es</span>
      </div>
      <div class="config-item">
        <span class="config-key">temaOscuro</span>
        <span class="config-val activo">activado</span>
      </div>
    </div>
    <div class="favoritos-info">
      <div class="fav-bar">
        <span id="fav-label">Favoritos usados: 3/10</span>
        <div class="bar-track"><div class="bar-fill" id="bar-fill" style="width:30%"></div></div>
      </div>
      <button id="btn-fav">+ Agregar favorito</button>
    </div>
    <p class="token-hint">Valor inyectado via <span>APP_CONFIG</span> token</p>
  </div>
  <script>
    var maxFavoritos = 10;
    var usados = 3;
    function render() {
      var pct = Math.round(usados / maxFavoritos * 100);
      document.getElementById('fav-label').textContent = 'Favoritos usados: ' + usados + '/' + maxFavoritos;
      var fill = document.getElementById('bar-fill');
      fill.style.width = pct + '%';
      fill.className = 'bar-fill' + (usados >= maxFavoritos ? ' lleno' : '');
      document.getElementById('btn-fav').disabled = usados >= maxFavoritos;
    }
    document.getElementById('btn-fav').addEventListener('click', function() {
      if (usados < maxFavoritos) { usados++; render(); }
    });
    render();
  </script>
</body>
</html>`,
    aiContext:
      'El usuario está aprendiendo InjectionToken en Angular 19 para inyectar configuración tipada en lugar de importar objetos globales. Ha visto APP_CONFIG con factory integrada y un componente que lo consume con inject(). Puede preguntar sobre useValue vs factory en el token, sobre inject(TOKEN, { optional: true }), sobre environment.ts vs InjectionToken, o sobre multi-providers.',
    introMessage:
      'Esta lección introduce `InjectionToken<T>` — la herramienta para inyectar configuración tipada, no solo clases.\n\nEl panel muestra los valores del token `APP_CONFIG` inyectado con `inject(APP_CONFIG)`. TypeScript conoce el tipo exacto. Modifica el límite de favoritos e interactúa con la barra.\n\nPregúntame sobre cómo sobreescribir tokens en tests, sobre `inject(TOKEN, { optional: true })`, o sobre la diferencia con importar un objeto directamente.',
    suggestedQuestions: [
      '¿Cómo sobreescribo el valor de un InjectionToken en tests?',
      '¿Cuándo usar useValue vs factory en InjectionToken?',
      '¿InjectionToken reemplaza completamente los archivos environment.ts?',
    ],
  },

  {
    id: 'L4.6',
    module: 4,
    moduleTitle: 'Servicios e Inyección de Dependencias',
    title: 'Factories y providers avanzados',
    subtitle: 'useFactory, useValue, useExisting — el toolkit completo de DI',
    estimatedMinutes: 15,
    xpReward: 150,
    prerequisites: ['L4.5'],
    nextLesson: 'L5.1',
    language: 'typescript',
    achievements: [
      {
        id: 'di-master',
        name: 'Dependency Injection Master',
        description: 'Dominaste el sistema completo de DI de Angular 19',
        icon: 'injection-syringe',
      },
    ],
    narrative: [
      {
        type: 'text',
        content:
          'Hasta ahora hemos usado `providedIn: \'root\'` y `providers: [Clase]`. Pero el sistema de DI de Angular tiene un toolkit completo para casos más complejos: `useValue` para valores estáticos, `useFactory` para lógica de creación, `useExisting` para aliases entre tokens, y `deps` para pasar dependencias a una factory.',
      },
      {
        type: 'comparison',
        leftLabel: 'useValue — valor estático',
        rightLabel: 'useFactory — lógica de creación',
        left: 'providers: [{\n  provide: LOG_LEVEL,\n  useValue: \'debug\'\n}]',
        right: 'providers: [{\n  provide: LoggerService,\n  useFactory: (cfg) => new LoggerService(cfg),\n  deps: [APP_CONFIG]\n}]',
      },
      {
        type: 'text',
        content:
          '`useFactory` es el más poderoso: recibes una función que Angular llama cuando necesita crear el servicio. El array `deps` lista las dependencias que Angular inyectará como argumentos de la factory — en el mismo orden. Esto te permite configurar servicios con lógica compleja, condiciones de entorno, o valores calculados.',
      },
      {
        type: 'tip',
        variant: 'info',
        content:
          '`useExisting` crea un alias: inyectar el token A devuelve la misma instancia ya creada del token B. Útil cuando tienes una interfaz abstracta (`AbstractLogger`) y una implementación concreta (`ConsoleLogger`) — los componentes dependen de la abstracción, la implementación real se configura en providers.',
      },
      {
        type: 'tip',
        variant: 'angular',
        content:
          '`multi: true` en un provider indica que múltiples proveedores pueden registrarse para el mismo token — Angular los acumula en un array en lugar de reemplazarse. Es el patrón detrás de `HTTP_INTERCEPTORS`, `APP_INITIALIZER` y los guards funcionales de Angular.',
      },
      {
        type: 'checkpoint',
        question: '¿Qué hace el array deps en un provider useFactory?',
        options: [
          'Lista los módulos que el servicio necesita importar',
          'Declara las dependencias que Angular inyectará como argumentos de la función factory',
          'Define el orden en que se crean los servicios',
          'Son los tipos TypeScript para verificación estática de la factory',
        ],
        correct: 1,
        explanation:
          'El array `deps` en `useFactory` le dice a Angular qué dependencias resolver e inyectar como argumentos de la función factory, en el mismo orden. Angular actúa como intermediario: resuelve cada token del array y los pasa a la factory cuando la llama para crear el servicio.',
      },
    ],
    starterCode: `import { InjectionToken, inject, Injectable, signal, ChangeDetectionStrategy } from '@angular/core';
import { Component } from '@angular/core';

// 📚 Biblioteca Angular — useFactory, useValue, useExisting

// ── Tokens y tipos ────────────────────────────────────────────
interface AppConfig {
  nombreApp: string;
  logLevel: 'debug' | 'info' | 'error' | 'silent';
  maxLibros: number;
}

export const APP_CONFIG = new InjectionToken<AppConfig>('APP_CONFIG', {
  providedIn: 'root',
  factory: () => ({
    nombreApp: 'Biblioteca Angular',
    logLevel: 'debug' as const,
    maxLibros: 100,
  }),
});

// ── Servicio abstracto (interfaz) ────────────────────────────
export abstract class AbstractLogger {
  abstract log(nivel: string, mensaje: string): void;
  abstract getLogs(): Array<{ nivel: string; mensaje: string; ts: string }>;
}

// ── Implementación concreta ───────────────────────────────────
@Injectable()
export class BibliotecaLogger extends AbstractLogger {
  private readonly _logs = signal<Array<{ nivel: string; mensaje: string; ts: string }>>([]);

  constructor(private config: AppConfig) {
    super();
  }

  log(nivel: string, mensaje: string): void {
    const niveles = ['debug', 'info', 'error'];
    const nivelActual = niveles.indexOf(this.config.logLevel);
    const nivelMensaje = niveles.indexOf(nivel);

    if (this.config.logLevel === 'silent' || nivelMensaje < nivelActual) return;

    const ts = new Date().toLocaleTimeString('es-ES', { hour12: false });
    this._logs.update(logs => [...logs.slice(-9), { nivel, mensaje, ts }]);
  }

  getLogs() {
    return this._logs();
  }
}

// ── Providers avanzados ───────────────────────────────────────
// En tu AppComponent o ApplicationConfig:
const BIBLIOTECA_PROVIDERS = [
  // useValue: valor estático
  { provide: 'APP_NAME', useValue: 'Biblioteca Angular v4' },

  // useFactory: lógica de creación con dependencias resueltas
  {
    provide: BibliotecaLogger,
    useFactory: (config: AppConfig) => new BibliotecaLogger(config),
    deps: [APP_CONFIG], // Angular inyecta APP_CONFIG como primer argumento
  },

  // useExisting: alias — AbstractLogger devuelve la instancia de BibliotecaLogger
  {
    provide: AbstractLogger,
    useExisting: BibliotecaLogger,
  },
];

// ── Componente que usa el logger via AbstractLogger ──────────
@Component({
  selector: 'app-log-panel',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  // Declara los providers avanzados en este componente
  providers: BIBLIOTECA_PROVIDERS,
  template: \`
    <div class="log-panel">
      <h3>Panel de Logs — {{ appName }}</h3>
      <p class="config-info">
        logLevel: <code>{{ config.logLevel }}</code> · maxLibros: <code>{{ config.maxLibros }}</code>
      </p>

      <div class="log-acciones">
        <button class="btn-debug" (click)="loguear('debug', 'Libro cargado correctamente')">DEBUG</button>
        <button class="btn-info"  (click)="loguear('info',  'Usuario marcó favorito')">INFO</button>
        <button class="btn-error" (click)="loguear('error', 'Error al guardar')">ERROR</button>
      </div>

      <div class="log-lista">
        @for (log of logger.getLogs(); track $index) {
          <div class="log-entry" [class]="'log-' + log.nivel">
            <span class="log-ts">{{ log.ts }}</span>
            <span class="log-nivel">{{ log.nivel.toUpperCase() }}</span>
            <span class="log-msg">{{ log.mensaje }}</span>
          </div>
        } @empty {
          <p class="log-empty">Sin logs aún — pulsa un botón</p>
        }
      </div>
    </div>
  \`,
})
export class LogPanelComponent {
  // AbstractLogger resuelve a BibliotecaLogger via useExisting
  readonly logger = inject(AbstractLogger) as BibliotecaLogger;
  readonly config = inject(APP_CONFIG);
  readonly appName = inject<string>('APP_NAME' as any);

  loguear(nivel: string, mensaje: string): void {
    this.logger.log(nivel, mensaje);
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
    .factory-badge { position: fixed; top: 12px; left: 12px; font-family: 'JetBrains Mono', monospace; font-size: 0.625rem; color: #38bdf8; background: rgba(56,189,248,0.08); border: 1px solid rgba(56,189,248,0.25); padding: 0.2em 0.5em; border-radius: 4px; }
    button { cursor: pointer; font-family: 'Inter', sans-serif; }
    .log-panel { background: #161B22; border: 1px solid #30363D; border-radius: 12px; padding: 1.5rem; width: 100%; max-width: 480px; }
    .log-panel h3 { font-size: 0.9rem; font-weight: 600; margin-bottom: 0.5rem; }
    .config-info { font-family: 'JetBrains Mono', monospace; font-size: 0.72rem; color: #8B949E; margin-bottom: 1.25rem; }
    .config-info code { color: #38bdf8; }
    .log-acciones { display: flex; gap: 0.5rem; margin-bottom: 1rem; }
    .btn-debug { flex: 1; background: rgba(100,116,139,0.15); border: 1px solid rgba(100,116,139,0.4); color: #94a3b8; border-radius: 6px; padding: 0.5rem; font-size: 0.78rem; font-weight: 600; font-family: 'JetBrains Mono', monospace; transition: all 150ms; }
    .btn-debug:hover { background: rgba(100,116,139,0.25); }
    .btn-info { flex: 1; background: rgba(56,189,248,0.08); border: 1px solid rgba(56,189,248,0.3); color: #38bdf8; border-radius: 6px; padding: 0.5rem; font-size: 0.78rem; font-weight: 600; font-family: 'JetBrains Mono', monospace; transition: all 150ms; }
    .btn-info:hover { background: rgba(56,189,248,0.15); }
    .btn-error { flex: 1; background: rgba(248,81,73,0.08); border: 1px solid rgba(248,81,73,0.3); color: #f85149; border-radius: 6px; padding: 0.5rem; font-size: 0.78rem; font-weight: 600; font-family: 'JetBrains Mono', monospace; transition: all 150ms; }
    .btn-error:hover { background: rgba(248,81,73,0.15); }
    .log-lista { background: #0D1117; border: 1px solid #21262D; border-radius: 8px; overflow: hidden; min-height: 120px; }
    .log-entry { display: grid; grid-template-columns: auto auto 1fr; gap: 0.75rem; align-items: center; padding: 0.5rem 0.875rem; border-bottom: 1px solid #161B22; border-left: 3px solid; font-size: 0.78rem; }
    .log-entry:last-child { border-bottom: none; }
    .log-entry.log-debug { border-left-color: #64748b; }
    .log-entry.log-info { border-left-color: #38bdf8; background: rgba(56,189,248,0.04); }
    .log-entry.log-error { border-left-color: #f85149; background: rgba(248,81,73,0.04); }
    .log-ts { font-family: 'JetBrains Mono', monospace; font-size: 0.7rem; color: #8B949E; white-space: nowrap; }
    .log-nivel { font-family: 'JetBrains Mono', monospace; font-size: 0.7rem; font-weight: 700; padding: 0.1em 0.4em; border-radius: 3px; white-space: nowrap; }
    .log-debug .log-nivel { color: #94a3b8; background: rgba(100,116,139,0.15); }
    .log-info .log-nivel { color: #38bdf8; background: rgba(56,189,248,0.1); }
    .log-error .log-nivel { color: #f85149; background: rgba(248,81,73,0.1); }
    .log-msg { font-family: 'JetBrains Mono', monospace; font-size: 0.75rem; color: #E6EDF3; }
    .log-empty { font-family: 'JetBrains Mono', monospace; font-size: 0.75rem; color: #8B949E; text-align: center; padding: 2rem; }
    .providers-hint { margin-top: 1rem; padding-top: 0.875rem; border-top: 1px solid #21262D; }
    .provider-tag { display: inline-block; font-family: 'JetBrains Mono', monospace; font-size: 0.65rem; padding: 0.15em 0.5em; border-radius: 4px; margin: 0.2rem; }
    .tag-factory { color: #38bdf8; background: rgba(56,189,248,0.08); border: 1px solid rgba(56,189,248,0.2); }
    .tag-value { color: #f59e0b; background: rgba(245,158,11,0.08); border: 1px solid rgba(245,158,11,0.2); }
    .tag-existing { color: #a78bfa; background: rgba(167,139,250,0.08); border: 1px solid rgba(167,139,250,0.2); }
  </style>
</head>
<body>
  <span class="factory-badge">useFactory + useExisting</span>
  <span class="component-label">app-log-panel</span>
  <div class="log-panel">
    <h3>Panel de Logs — Biblioteca Angular v4</h3>
    <p class="config-info">logLevel: <code>debug</code> · maxLibros: <code>100</code></p>
    <div class="log-acciones">
      <button class="btn-debug" onclick="loguear('debug','Libro cargado correctamente')">DEBUG</button>
      <button class="btn-info" onclick="loguear('info','Usuario marco favorito')">INFO</button>
      <button class="btn-error" onclick="loguear('error','Error al guardar')">ERROR</button>
    </div>
    <div class="log-lista" id="log-lista">
      <p class="log-empty">Sin logs aun — pulsa un boton</p>
    </div>
    <div class="providers-hint">
      <span class="provider-tag tag-factory">useFactory: BibliotecaLogger</span>
      <span class="provider-tag tag-value">useValue: APP_NAME</span>
      <span class="provider-tag tag-existing">useExisting: AbstractLogger</span>
    </div>
  </div>
  <script>
    var logs = [];
    function ahora() { return new Date().toLocaleTimeString('es-ES', { hour12: false }); }
    function loguear(nivel, mensaje) {
      logs.push({ nivel: nivel, mensaje: mensaje, ts: ahora() });
      if (logs.length > 10) logs = logs.slice(-10);
      renderLogs();
    }
    function renderLogs() {
      if (logs.length === 0) {
        document.getElementById('log-lista').innerHTML = '<p class="log-empty">Sin logs aun — pulsa un boton</p>';
        return;
      }
      var html = '';
      logs.forEach(function(l) {
        html += '<div class="log-entry log-' + l.nivel + '">';
        html += '<span class="log-ts">' + l.ts + '</span>';
        html += '<span class="log-nivel">' + l.nivel.toUpperCase() + '</span>';
        html += '<span class="log-msg">' + l.mensaje + '</span>';
        html += '</div>';
      });
      document.getElementById('log-lista').innerHTML = html;
    }
  </script>
</body>
</html>`,
    aiContext:
      'El usuario está completando el módulo de DI de Angular 19. Ha visto providers avanzados: useFactory con deps[], useValue para strings, useExisting para aliases y la diferencia entre AbstractLogger y BibliotecaLogger. Puede preguntar sobre multi: true para interceptors, sobre APP_INITIALIZER, sobre la diferencia useClass vs useFactory, o sobre cómo testear providers con overrides.',
    introMessage:
      'Esta última lección del Módulo 4 completa el toolkit de DI: `useFactory`, `useValue`, `useExisting` y el array `deps`.\n\nEl logger se crea via factory que recibe `APP_CONFIG` como dependencia. `AbstractLogger` es un alias (useExisting) que apunta a la implementación concreta. El panel muestra los tres niveles de log con su color correspondiente.\n\nPregúntame sobre `multi: true`, sobre `APP_INITIALIZER`, o sobre cómo testear servicios con providers alternativos.',
    suggestedQuestions: [
      '¿Cuándo usaría useClass en lugar de useFactory?',
      '¿Qué es multi: true y para qué se usa en Angular?',
      '¿Cómo sobreescribo un provider en un test de componente?',
    ],
  },
];
