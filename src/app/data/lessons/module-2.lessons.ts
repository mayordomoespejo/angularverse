import type { Lesson } from '../../core/models/lesson.model';

export const MODULE_2_LESSONS: Lesson[] = [
  {
    id: 'L2.1',
    module: 2,
    moduleTitle: 'Componentes y Signals',
    title: 'Signals: el corazón reactivo de Angular',
    subtitle: 'signal(), computed() y effect() en profundidad',
    estimatedMinutes: 12,
    xpReward: 100,
    prerequisites: ['L1.5'],
    nextLesson: 'L2.2',
    language: 'typescript',
    narrative: [
      {
        type: 'text',
        content:
          'Los Signals son primitivas reactivas que le dicen a Angular exactamente qué cambió y cuándo. Antes de los Signals, Angular usaba Zone.js para detectar cambios — comprobaba todo en cada evento, sin importar si algo había cambiado realmente. Los Signals hacen esa detección quirúrgica y eficiente. Hay tres primitivas fundamentales: `signal()` para estado mutable, `computed()` para valores derivados, y `effect()` para efectos secundarios.',
      },
      {
        type: 'tip',
        variant: 'info',
        content:
          'Los valores `computed()` son lazy y están memoizados — solo se recalculan cuando alguna de sus dependencias cambia. Si ningún código los lee, directamente no se ejecutan.',
      },
      {
        type: 'text',
        content:
          'La diferencia clave entre las tres primitivas: `signal()` es escribible — puedes cambiar su valor con `.set()` o `.update()`. `computed()` es de solo lectura — se deriva automáticamente de otros signals y nunca se asigna directamente. `effect()` ejecuta un bloque de código como efecto secundario cada vez que una dependencia cambia — úsalo con moderación, y prefiere `computed()` para todo lo que sea UI.',
      },
      {
        type: 'tip',
        variant: 'angular',
        content:
          'En AngularVerse, TODOS los componentes usan Signals. El contador de XP, la barra de progreso, el chat — todos funcionan con las mismas primitivas que estás aprendiendo ahora mismo.',
      },
      {
        type: 'checkpoint',
        question: '¿Qué función usas para crear un valor que se recalcula automáticamente?',
        options: ['signal()', 'computed()', 'effect()', 'input()'],
        correct: 1,
        explanation:
          '`computed()` crea un valor derivado que se recalcula automáticamente cuando cambian sus dependencias. `signal()` es para estado mutable que asignas tú. `effect()` es para efectos secundarios, no para derivar valores.',
      },
    ],
    starterCode: `import { Component, signal, computed, effect, ChangeDetectionStrategy } from '@angular/core';

// 📚 Biblioteca Angular — Signals
// Las tres primitivas reactivas de Angular moderno

@Component({
  selector: 'app-biblioteca-signals',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: \`
    <div class="biblioteca">
      <h2>{{ tituloSeccion() }}</h2>

      <div class="stats">
        <div class="stat">
          <span class="stat-numero">{{ totalLibros() }}</span>
          <span class="stat-label">Total</span>
        </div>
        <div class="stat">
          <span class="stat-numero">{{ librosLeidos() }}</span>
          <span class="stat-label">Leídos</span>
        </div>
        <div class="stat destacado">
          <span class="stat-numero">{{ porcentajeLeido() }}%</span>
          <span class="stat-label">Completado</span>
        </div>
      </div>

      <div class="acciones">
        <button (click)="totalLibros.update(n => n + 1)">+ Agregar libro</button>
        <button (click)="marcarLeido()" [disabled]="librosLeidos() >= totalLibros()">
          ✓ Marcar leído
        </button>
      </div>

      @if (porcentajeLeido() === 100) {
        <div class="completado">🎉 ¡Biblioteca completada!</div>
      }
    </div>
  \`,
})
export class BibliotecaSignalsComponent {
  // signal() — estado mutable y reactivo
  readonly totalLibros = signal(5);
  readonly librosLeidos = signal(2);

  // computed() — valor derivado, se recalcula automáticamente
  readonly porcentajeLeido = computed(() =>
    this.totalLibros() === 0 ? 0 : Math.round((this.librosLeidos() / this.totalLibros()) * 100)
  );

  readonly tituloSeccion = computed(() =>
    \`Mi Biblioteca (\${this.totalLibros()} libros)\`
  );

  constructor() {
    // effect() — efecto secundario cuando una dependencia cambia
    effect(() => {
      console.log(\`Progreso: \${this.porcentajeLeido()}%\`);
    });
  }

  marcarLeido(): void {
    if (this.librosLeidos() < this.totalLibros()) {
      this.librosLeidos.update(n => n + 1);
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
    button { cursor: pointer; font-family: 'Inter', sans-serif; }
    .biblioteca { background: #161B22; border: 1px solid #30363D; border-radius: 12px; padding: 2rem; width: 100%; max-width: 420px; }
    h2 { font-size: 1.1rem; font-weight: 600; margin-bottom: 1.5rem; color: #E6EDF3; }
    .stats { display: flex; gap: 1rem; margin-bottom: 1.5rem; }
    .stat { flex: 1; background: #21262D; border: 1px solid #30363D; border-radius: 8px; padding: 1rem; text-align: center; }
    .stat.destacado { border-color: #8B5CF6; background: rgba(139,92,246,0.08); }
    .stat-numero { display: block; font-size: 2rem; font-weight: 700; color: #E6EDF3; line-height: 1; }
    .stat.destacado .stat-numero { color: #8B5CF6; }
    .stat-label { display: block; font-size: 0.75rem; color: #8B949E; margin-top: 0.25rem; }
    .acciones { display: flex; gap: 0.75rem; }
    .acciones button { flex: 1; background: #8B5CF6; color: white; border: none; border-radius: 6px; padding: 0.625rem 1rem; font-size: 0.875rem; font-weight: 500; transition: opacity 150ms; }
    .acciones button:hover:not(:disabled) { opacity: 0.85; }
    .acciones button:disabled { opacity: 0.35; cursor: not-allowed; }
    .completado { margin-top: 1.25rem; background: rgba(139,92,246,0.15); border: 1px solid rgba(139,92,246,0.4); border-radius: 8px; padding: 0.75rem 1rem; text-align: center; font-size: 0.9rem; color: #c4b5fd; font-weight: 500; }
  </style>
</head>
<body>
  <span class="component-label">app-biblioteca-signals</span>
  <div class="biblioteca">
    <h2 id="titulo">Mi Biblioteca (5 libros)</h2>
    <div class="stats">
      <div class="stat">
        <span class="stat-numero" id="total">5</span>
        <span class="stat-label">Total</span>
      </div>
      <div class="stat">
        <span class="stat-numero" id="leidos">2</span>
        <span class="stat-label">Leídos</span>
      </div>
      <div class="stat destacado">
        <span class="stat-numero" id="pct">40%</span>
        <span class="stat-label">Completado</span>
      </div>
    </div>
    <div class="acciones">
      <button id="btn-agregar">+ Agregar libro</button>
      <button id="btn-leido">✓ Marcar leído</button>
    </div>
    <div class="completado" id="completado" style="display:none">🎉 ¡Biblioteca completada!</div>
  </div>
  <script>
    let total = 5, leidos = 2;
    function update() {
      const pct = total === 0 ? 0 : Math.round((leidos / total) * 100);
      document.getElementById('titulo').textContent = 'Mi Biblioteca (' + total + ' libros)';
      document.getElementById('total').textContent = total;
      document.getElementById('leidos').textContent = leidos;
      document.getElementById('pct').textContent = pct + '%';
      document.getElementById('btn-leido').disabled = leidos >= total;
      document.getElementById('completado').style.display = pct === 100 ? 'block' : 'none';
    }
    document.getElementById('btn-agregar').addEventListener('click', () => { total++; update(); });
    document.getElementById('btn-leido').addEventListener('click', () => { if (leidos < total) { leidos++; update(); } });
    update();
  </script>
</body>
</html>`,
    aiContext:
      'El usuario está aprendiendo signals de Angular 19. Ha visto signal(), computed() y effect() en el contexto de una biblioteca de libros. Puede preguntar sobre diferencias con variables normales, con RxJS, con el antiguo @Input(), o sobre cuándo usar cada primitiva.',
    introMessage:
      'En esta lección conocerás las tres primitivas reactivas de Angular moderno: `signal()`, `computed()` y `effect()`.\n\nEl código muestra una biblioteca con estadísticas reactivas — observa cómo `computed()` actualiza el porcentaje automáticamente cuando cambias el total o los leídos.\n\nSi tienes dudas sobre signals o sobre la diferencia con el antiguo `@Input()`, pregúntame.',
    suggestedQuestions: [
      '¿En qué se diferencia signal() de una variable normal?',
      '¿Cuándo debo usar effect() en lugar de computed()?',
      '¿Los signals reemplazan completamente a RxJS?',
    ],
  },

  {
    id: 'L2.2',
    module: 2,
    moduleTitle: 'Componentes y Signals',
    title: 'input() y output(): comunicación entre componentes',
    subtitle: 'Del padre al hijo y del hijo al padre con la API moderna',
    estimatedMinutes: 15,
    xpReward: 100,
    prerequisites: ['L2.1'],
    nextLesson: 'L2.3',
    language: 'typescript',
    narrative: [
      {
        type: 'text',
        content:
          'Toda aplicación Angular es un árbol de componentes. Los datos fluyen hacia abajo (padre→hijo) mediante `input()`, y los eventos fluyen hacia arriba (hijo→padre) mediante `output()`. Este flujo unidireccional hace que las apps sean predecibles y fáciles de depurar.',
      },
      {
        type: 'tip',
        variant: 'info',
        content:
          '`input()` reemplaza al antiguo decorador `@Input()`. Devuelve un signal — lo lees con `libro()`, no simplemente `libro`. `input.required<T>()` hace que el input sea obligatorio y TypeScript lo verificará en tiempo de compilación.',
      },
      {
        type: 'text',
        content:
          '`output()` reemplaza `@Output() + EventEmitter`. La sintaxis es más limpia: `readonly seleccionado = output<Libro>()` y luego emites con `this.seleccionado.emit(libro)`. No necesitas `new EventEmitter()` ni imports adicionales de RxJS.',
      },
      {
        type: 'tip',
        variant: 'angular',
        content:
          '`model()` es para two-way binding — combina input y output en uno. Perfecto para campos de formulario y toggles donde el padre quiere tanto leer como escribir el valor del hijo.',
      },
      {
        type: 'checkpoint',
        question: '¿Qué función usarías para que un componente hijo envíe datos al padre?',
        options: ['input()', 'output()', 'signal()', 'model()'],
        correct: 1,
        explanation:
          '`output()` permite que un componente hijo emita eventos hacia su padre. El padre escucha con `(nombreEvento)="handler($event)"`. `input()` es para recibir datos del padre, no para enviarlos.',
      },
    ],
    starterCode: `import { Component, input, output, signal, computed, ChangeDetectionStrategy } from '@angular/core';

// 📚 Biblioteca Angular — Comunicación entre componentes
// LibroItem (hijo) ← recibe datos → padre
// LibroItem (hijo) → emite eventos → padre

interface Libro {
  id: number;
  titulo: string;
  autor: string;
  leido: boolean;
}

// ── Componente HIJO ──────────────────────────────────────────
@Component({
  selector: 'app-libro-item',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: \`
    <div class="libro-item" [class.leido]="libro().leido">
      <div class="libro-info">
        <strong>{{ libro().titulo }}</strong>
        <span>{{ libro().autor }}</span>
      </div>
      <button class="btn-toggle" (click)="toggleLeido.emit(libro().id)">
        {{ libro().leido ? '✓ Leído' : 'Marcar leído' }}
      </button>
    </div>
  \`,
})
export class LibroItemComponent {
  readonly libro = input.required<Libro>();           // ← recibe del padre
  readonly toggleLeido = output<number>();            // → emite al padre
}

// ── Componente PADRE ─────────────────────────────────────────
@Component({
  selector: 'app-biblioteca-lista',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LibroItemComponent],
  template: \`
    <div class="biblioteca">
      <header>
        <h2>Biblioteca</h2>
        <span class="badge">{{ resumen() }}</span>
      </header>
      @for (libro of libros(); track libro.id) {
        <app-libro-item
          [libro]="libro"
          (toggleLeido)="onToggle($event)"
        />
      }
    </div>
  \`,
})
export class BibliotecaListaComponent {
  readonly libros = signal<Libro[]>([
    { id: 1, titulo: 'Clean Code', autor: 'Robert C. Martin', leido: true },
    { id: 2, titulo: 'The Pragmatic Programmer', autor: 'Hunt & Thomas', leido: false },
    { id: 3, titulo: 'Design Patterns', autor: 'Gang of Four', leido: false },
  ]);

  readonly resumen = computed(() => {
    const leidos = this.libros().filter(l => l.leido).length;
    return \`\${leidos}/\${this.libros().length} leídos\`;
  });

  onToggle(id: number): void {
    this.libros.update(libros =>
      libros.map(l => l.id === id ? { ...l, leido: !l.leido } : l)
    );
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
    .biblioteca { background: #161B22; border: 1px solid #30363D; border-radius: 12px; overflow: hidden; width: 100%; max-width: 420px; }
    header { display: flex; align-items: center; justify-content: space-between; padding: 1.25rem 1.5rem; border-bottom: 1px solid #30363D; }
    header h2 { font-size: 1rem; font-weight: 600; }
    .badge { background: #21262D; border: 1px solid #30363D; color: #8B949E; font-size: 0.75rem; padding: 0.2em 0.6em; border-radius: 20px; font-weight: 500; }
    .libro-item { display: flex; align-items: center; justify-content: space-between; padding: 1rem 1.5rem; border-bottom: 1px solid #21262D; border-left: 3px solid transparent; transition: border-color 200ms, background 200ms; }
    .libro-item:last-child { border-bottom: none; }
    .libro-item.leido { border-left-color: #22c55e; background: rgba(34,197,94,0.04); }
    .libro-info { display: flex; flex-direction: column; gap: 0.2rem; }
    .libro-info strong { font-size: 0.9rem; font-weight: 600; color: #E6EDF3; }
    .libro-info span { font-size: 0.78rem; color: #8B949E; }
    .btn-toggle { background: transparent; border: 1px solid #30363D; color: #8B949E; border-radius: 6px; padding: 0.35rem 0.75rem; font-size: 0.78rem; transition: all 150ms; white-space: nowrap; }
    .libro-item.leido .btn-toggle { border-color: #22c55e; color: #22c55e; }
    .btn-toggle:hover { border-color: #8B5CF6; color: #8B5CF6; }
  </style>
</head>
<body>
  <span class="component-label">app-biblioteca-lista</span>
  <div class="biblioteca">
    <header>
      <h2>Biblioteca</h2>
      <span class="badge" id="resumen">1/3 leídos</span>
    </header>
    <div id="lista"></div>
  </div>
  <script>
    const libros = [
      { id: 1, titulo: 'Clean Code', autor: 'Robert C. Martin', leido: true },
      { id: 2, titulo: 'The Pragmatic Programmer', autor: 'Hunt & Thomas', leido: false },
      { id: 3, titulo: 'Design Patterns', autor: 'Gang of Four', leido: false },
    ];
    function render() {
      const leidos = libros.filter(l => l.leido).length;
      document.getElementById('resumen').textContent = leidos + '/' + libros.length + ' leídos';
      const lista = document.getElementById('lista');
      lista.innerHTML = libros.map(l => \`
        <div class="libro-item \${l.leido ? 'leido' : ''}" data-id="\${l.id}">
          <div class="libro-info">
            <strong>\${l.titulo}</strong>
            <span>\${l.autor}</span>
          </div>
          <button class="btn-toggle">\${l.leido ? '✓ Leído' : 'Marcar leído'}</button>
        </div>
      \`).join('');
      lista.querySelectorAll('.btn-toggle').forEach((btn, i) => {
        btn.addEventListener('click', () => { libros[i].leido = !libros[i].leido; render(); });
      });
    }
    render();
  </script>
</body>
</html>`,
    aiContext:
      'El usuario está aprendiendo comunicación padre-hijo en Angular 19 con input(), output() y el patrón unidireccional. Ha visto un ejemplo con una lista de libros. Puede preguntar sobre input.required(), model(), EventEmitter legacy, o comunicación entre componentes no relacionados (para lo que existirían servicios).',
    introMessage:
      'Esta lección muestra comunicación entre dos componentes: un padre (`app-biblioteca-lista`) que gestiona la lista, y un hijo (`app-libro-item`) que muestra cada libro.\n\nObserva cómo el padre pasa datos al hijo con `[libro]` y el hijo notifica al padre con `(toggleLeido)`. El contador del header se actualiza automáticamente.\n\nPregúntame sobre `input()`, `output()`, `model()` o cómo funciona el flujo de datos en Angular.',
    suggestedQuestions: [
      '¿Cuál es la diferencia entre input() y model()?',
      '¿Puedo comunicar componentes que no son padre-hijo directamente?',
      '¿Qué ventaja tiene output() sobre @Output() + EventEmitter?',
    ],
  },

  {
    id: 'L2.3',
    module: 2,
    moduleTitle: 'Componentes y Signals',
    title: 'Ciclo de vida de un componente',
    subtitle: 'De la creación a la destrucción — hooks y DestroyRef',
    estimatedMinutes: 12,
    xpReward: 100,
    prerequisites: ['L2.2'],
    nextLesson: 'L2.4',
    language: 'typescript',
    narrative: [
      {
        type: 'text',
        content:
          'Cada componente Angular tiene un ciclo de vida: desde su creación hasta su destrucción. Los hooks de ciclo de vida te permiten ejecutar código en momentos específicos. Los más importantes son `ngOnInit` (los inputs ya están listos) y `ngOnDestroy` (limpieza justo antes de destruirse).',
      },
      {
        type: 'tip',
        variant: 'info',
        content:
          'Con signals y `effect()`, muchos hooks se vuelven menos necesarios. Raramente necesitas `ngOnChanges` cuando los inputs son signals — basta con un `computed()` o `effect()` que dependa de ellos.',
      },
      {
        type: 'text',
        content:
          '`ngOnDestroy` es crítico para hacer limpieza: cancelar timers, cancelar subscripciones a observables. La alternativa moderna: `inject(DestroyRef).onDestroy(() => cleanup())` — funciona desde cualquier lugar, no solo en la clase del componente, y es más composable.',
      },
      {
        type: 'tip',
        variant: 'angular',
        content:
          '`afterNextRender()` y `afterRender()` reemplazan a `ngAfterViewInit` en Angular moderno. Son compatibles con la renderización sin Zone.js (zoneless) y son más predecibles en Server-Side Rendering.',
      },
      {
        type: 'checkpoint',
        question: '¿En qué hook deberías limpiar timers y subscripciones?',
        options: ['constructor()', 'ngOnInit()', 'ngOnDestroy()', 'ngOnChanges()'],
        correct: 2,
        explanation:
          '`ngOnDestroy()` es el hook que Angular ejecuta justo antes de destruir el componente. Es el lugar correcto para cancelar timers, unsubscribir de observables y liberar cualquier recurso. La alternativa moderna es `inject(DestroyRef).onDestroy()`.',
      },
    ],
    starterCode: `import { Component, OnInit, OnDestroy, signal, inject, DestroyRef, ChangeDetectionStrategy } from '@angular/core';

// 📚 Biblioteca Angular — Ciclo de vida
// Los hooks de ciclo de vida nos permiten ejecutar lógica en momentos clave

@Component({
  selector: 'app-libro-detalle',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: \`
    <div class="detalle">
      <div class="titulo-seccion">
        <h3>Ciclo de vida del componente</h3>
        <span class="timer">⏱ {{ tiempoActivo() }}s activo</span>
      </div>

      <div class="log">
        @for (evento of eventos(); track $index) {
          <div class="log-entrada" [class]="evento.tipo">
            <span class="log-hook">{{ evento.hook }}</span>
            <span class="log-desc">{{ evento.descripcion }}</span>
            <span class="log-tiempo">{{ evento.tiempo }}</span>
          </div>
        }
      </div>

      <p class="hint">
        Los eventos aparecen automáticamente al montar el componente.
      </p>
    </div>
  \`,
})
export class LibroDetalleComponent implements OnInit, OnDestroy {
  private readonly destroyRef = inject(DestroyRef);

  readonly tiempoActivo = signal(0);
  readonly eventos = signal<Array<{
    hook: string;
    descripcion: string;
    tiempo: string;
    tipo: string;
  }>>([]);

  private timer?: ReturnType<typeof setInterval>;

  constructor() {
    this.log('constructor()', 'Componente creado, DI resuelta', 'constructor');
  }

  ngOnInit(): void {
    this.log('ngOnInit()', 'Inputs listos — iniciamos el timer', 'init');

    this.timer = setInterval(() => {
      this.tiempoActivo.update(t => t + 1);
    }, 1000);

    // Forma moderna de limpiar sin ngOnDestroy
    this.destroyRef.onDestroy(() => {
      this.log('DestroyRef', 'Limpieza via DestroyRef.onDestroy()', 'destroy');
      clearInterval(this.timer);
    });
  }

  ngOnDestroy(): void {
    this.log('ngOnDestroy()', 'Componente destruido', 'destroy');
  }

  private log(hook: string, descripcion: string, tipo: string): void {
    const tiempo = new Date().toLocaleTimeString('es-ES', { hour12: false });
    this.eventos.update(e => [...e, { hook, descripcion, tiempo, tipo }]);
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
    .detalle { background: #161B22; border: 1px solid #30363D; border-radius: 12px; padding: 1.5rem; width: 100%; max-width: 480px; }
    .titulo-seccion { display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.25rem; }
    .titulo-seccion h3 { font-size: 0.95rem; font-weight: 600; }
    .timer { font-family: 'JetBrains Mono', monospace; font-size: 0.8rem; color: #8B5CF6; background: rgba(139,92,246,0.1); border: 1px solid rgba(139,92,246,0.3); padding: 0.2em 0.6em; border-radius: 4px; }
    .log { display: flex; flex-direction: column; gap: 0.5rem; }
    .log-entrada { display: grid; grid-template-columns: 1fr 2fr auto; gap: 0.75rem; align-items: center; padding: 0.6rem 0.875rem; border-radius: 6px; border-left: 3px solid; font-size: 0.8rem; }
    .log-entrada.constructor { background: rgba(100,116,139,0.1); border-left-color: #64748b; }
    .log-entrada.init { background: rgba(34,197,94,0.08); border-left-color: #22c55e; }
    .log-entrada.destroy { background: rgba(249,115,22,0.08); border-left-color: #f97316; }
    .log-hook { font-family: 'JetBrains Mono', monospace; font-size: 0.75rem; font-weight: 500; color: #E6EDF3; }
    .log-desc { color: #8B949E; font-size: 0.775rem; }
    .log-tiempo { font-family: 'JetBrains Mono', monospace; font-size: 0.7rem; color: #8B949E; white-space: nowrap; }
    .hint { margin-top: 1rem; font-size: 0.78rem; color: #8B949E; border-top: 1px solid #21262D; padding-top: 0.875rem; }
  </style>
</head>
<body>
  <span class="component-label">app-libro-detalle</span>
  <div class="detalle">
    <div class="titulo-seccion">
      <h3>Ciclo de vida del componente</h3>
      <span class="timer" id="timer">⏱ 0s activo</span>
    </div>
    <div class="log" id="log"></div>
    <p class="hint">Los eventos aparecen automáticamente al montar el componente.</p>
  </div>
  <script>
    let segundos = 0;
    function ahora() {
      return new Date().toLocaleTimeString('es-ES', { hour12: false });
    }
    function addLog(hook, desc, tipo) {
      const el = document.createElement('div');
      el.className = 'log-entrada ' + tipo;
      el.innerHTML = '<span class="log-hook">' + hook + '</span><span class="log-desc">' + desc + '</span><span class="log-tiempo">' + ahora() + '</span>';
      document.getElementById('log').appendChild(el);
    }
    addLog('constructor()', 'Componente creado, DI resuelta', 'constructor');
    setTimeout(() => {
      addLog('ngOnInit()', 'Inputs listos — iniciamos el timer', 'init');
      setInterval(() => {
        segundos++;
        document.getElementById('timer').textContent = '⏱ ' + segundos + 's activo';
      }, 1000);
    }, 120);
  </script>
</body>
</html>`,
    aiContext:
      'El usuario está aprendiendo el ciclo de vida de Angular 19: constructor, ngOnInit, ngOnDestroy, DestroyRef. Ha visto un componente que registra visualmente cuándo se ejecuta cada hook. Puede preguntar sobre cuándo usar cada hook, sobre DestroyRef vs ngOnDestroy, sobre afterNextRender, o sobre memory leaks.',
    introMessage:
      'Esta lección muestra el ciclo de vida de un componente Angular en acción.\n\nEl componente del código registra automáticamente en qué momento se ejecuta cada hook. Observa la secuencia: `constructor()` → `ngOnInit()` → timer activo → `ngOnDestroy()` al desmontar.\n\nPregúntame sobre DestroyRef, afterNextRender, o cuándo usar cada hook.',
    suggestedQuestions: [
      '¿Cuándo usar ngOnInit vs el constructor?',
      '¿Qué pasa si no limpio un timer en ngOnDestroy?',
      '¿DestroyRef reemplaza completamente a ngOnDestroy?',
    ],
  },

  {
    id: 'L2.4',
    module: 2,
    moduleTitle: 'Componentes y Signals',
    title: 'viewChild y queries de template',
    subtitle: 'Accede a elementos e hijos directamente desde TypeScript',
    estimatedMinutes: 10,
    xpReward: 100,
    prerequisites: ['L2.3'],
    nextLesson: 'L2.5',
    language: 'typescript',
    narrative: [
      {
        type: 'text',
        content:
          'A veces necesitas acceso directo a un elemento del DOM o a un componente hijo desde TypeScript — para enfocar un input, leer sus dimensiones, o llamar a un método. `viewChild()` te da ese acceso como un signal.',
      },
      {
        type: 'tip',
        variant: 'info',
        content:
          '`viewChild()` es el reemplazo basado en signals del antiguo `@ViewChild()`. El resultado es un signal que devuelve el elemento después de que la vista se renderiza — antes de eso, su valor es `undefined`.',
      },
      {
        type: 'text',
        content:
          'Usa variables de referencia de template (`#miRef`) para marcar elementos, y luego consúltalos con `viewChild<ElementRef>(\'miRef\')`. Para acceder a múltiples elementos del mismo tipo, usa `viewChildren()` que devuelve un signal con un array.',
      },
      {
        type: 'tip',
        variant: 'angular',
        content:
          'Prefiere outputs del componente hijo sobre llamadas directas a sus métodos cuando sea posible — mantiene los componentes desacoplados. Usa `viewChild` cuando genuinamente necesitas acceso a nivel de DOM.',
      },
      {
        type: 'checkpoint',
        question: '¿Cuándo está disponible el valor de viewChild()?',
        options: ['En el constructor', 'En ngOnInit', 'Después de que la vista se renderiza', 'Al declarar la propiedad'],
        correct: 2,
        explanation:
          'El valor de `viewChild()` solo está disponible después de que Angular ha renderizado la vista del componente. En el constructor y en ngOnInit todavía es `undefined`. Usa `afterNextRender()` si necesitas acceder al elemento justo después del primer render.',
      },
    ],
    starterCode: `import { Component, viewChild, viewChildren, ElementRef, signal, afterNextRender, ChangeDetectionStrategy } from '@angular/core';

// 📚 Biblioteca Angular — viewChild
// Acceso directo a elementos del template desde TypeScript

@Component({
  selector: 'app-buscador-biblioteca',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: \`
    <div class="buscador">
      <h3>Buscar en la Biblioteca</h3>

      <div class="input-grupo">
        <input
          #inputBusqueda
          type="text"
          class="input-search"
          placeholder="Título o autor..."
          (input)="onInput($event)"
        />
        <button (click)="enfocar()">🔍</button>
      </div>

      @if (termino()) {
        <p class="resultado-label">
          Resultados para: <strong>{{ termino() }}</strong>
        </p>
      }

      <div class="libro-resultados">
        @for (libro of resultados(); track libro) {
          <div #resultadoEl class="libro-resultado">{{ libro }}</div>
        }
      </div>

      <p class="hint">
        El campo se enfoca automáticamente.
        Encontrados: {{ viewChildren('resultadoEl').length }} resultados
      </p>
    </div>
  \`,
})
export class BuscadorBibliotecaComponent {
  // viewChild() — acceso a un único elemento por referencia de template
  readonly inputBusqueda = viewChild<ElementRef<HTMLInputElement>>('inputBusqueda');

  // viewChildren() — acceso a múltiples elementos
  readonly resultadosEls = viewChildren<ElementRef>('resultadoEl');

  readonly termino = signal('');
  readonly todosLibros = ['Clean Code', 'The Pragmatic Programmer', 'Design Patterns', 'Refactoring', 'Clean Architecture'];
  readonly resultados = signal<string[]>([]);

  constructor() {
    afterNextRender(() => {
      this.enfocar(); // auto-focus al cargar
    });
  }

  enfocar(): void {
    this.inputBusqueda()?.nativeElement.focus();
  }

  onInput(event: Event): void {
    const valor = (event.target as HTMLInputElement).value;
    this.termino.set(valor);
    this.resultados.set(
      valor ? this.todosLibros.filter(l => l.toLowerCase().includes(valor.toLowerCase())) : []
    );
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
    .buscador { background: #161B22; border: 1px solid #30363D; border-radius: 12px; padding: 1.5rem; width: 100%; max-width: 400px; }
    h3 { font-size: 0.95rem; font-weight: 600; margin-bottom: 1rem; }
    .input-grupo { display: flex; gap: 0.5rem; margin-bottom: 1rem; }
    .input-search { flex: 1; background: #0D1117; border: 1px solid #30363D; border-radius: 6px; padding: 0.6rem 0.875rem; color: #E6EDF3; font-size: 0.875rem; font-family: 'Inter', sans-serif; outline: none; }
    .input-search:focus { border-color: #8B5CF6; box-shadow: 0 0 0 3px rgba(139,92,246,0.15); }
    .input-search::placeholder { color: #8B949E; }
    .input-grupo button { background: #8B5CF6; color: white; border: none; border-radius: 6px; padding: 0 0.875rem; font-size: 1rem; }
    .resultado-label { font-size: 0.8rem; color: #8B949E; margin-bottom: 0.75rem; }
    .resultado-label strong { color: #E6EDF3; }
    .libro-resultado { background: #21262D; border: 1px solid #30363D; border-radius: 6px; padding: 0.6rem 0.875rem; font-size: 0.875rem; margin-bottom: 0.4rem; }
    .hint { margin-top: 1rem; font-size: 0.775rem; color: #8B949E; border-top: 1px solid #21262D; padding-top: 0.875rem; }
    .no-results { font-size: 0.85rem; color: #8B949E; padding: 0.5rem 0; }
  </style>
</head>
<body>
  <span class="component-label">app-buscador-biblioteca</span>
  <div class="buscador">
    <h3>Buscar en la Biblioteca</h3>
    <div class="input-grupo">
      <input id="busqueda" type="text" class="input-search" placeholder="Título o autor..." autocomplete="off">
      <button onclick="document.getElementById('busqueda').focus()">🔍</button>
    </div>
    <div id="label-container"></div>
    <div id="resultados"></div>
    <p class="hint" id="hint">El campo se enfoca automáticamente. Encontrados: <span id="count">0</span> resultados.</p>
  </div>
  <script>
    const libros = ['Clean Code', 'The Pragmatic Programmer', 'Design Patterns', 'Refactoring', 'Clean Architecture'];
    const input = document.getElementById('busqueda');
    const labelContainer = document.getElementById('label-container');
    const resultadosEl = document.getElementById('resultados');
    const countEl = document.getElementById('count');
    function render(valor) {
      const filtrados = valor ? libros.filter(l => l.toLowerCase().includes(valor.toLowerCase())) : [];
      labelContainer.innerHTML = valor ? '<p class="resultado-label">Resultados para: <strong>' + valor + '</strong></p>' : '';
      resultadosEl.innerHTML = filtrados.length
        ? filtrados.map(l => '<div class="libro-resultado">' + l + '</div>').join('')
        : (valor ? '<p class="no-results">Sin resultados.</p>' : '');
      countEl.textContent = filtrados.length;
    }
    input.addEventListener('input', e => render(e.target.value));
    setTimeout(() => input.focus(), 100);
    render('');
  </script>
</body>
</html>`,
    aiContext:
      'El usuario está aprendiendo viewChild() y viewChildren() en Angular 19. Ha visto un buscador que usa template reference variables y viewChild para auto-enfocar el input. Puede preguntar sobre viewChild vs @ViewChild legacy, contentChild, afterNextRender, o cuándo es apropiado acceder al DOM directamente.',
    introMessage:
      'Esta lección muestra cómo acceder a elementos del template directamente desde TypeScript con `viewChild()`.\n\nEl buscador se auto-enfoca al cargar (usando `afterNextRender`) y muestra resultados en tiempo real. Observa cómo `viewChild(\'inputBusqueda\')` da acceso al elemento DOM.\n\nPregúntame sobre viewChild, viewChildren, template references, o afterNextRender.',
    suggestedQuestions: [
      '¿Cuál es la diferencia entre viewChild y contentChild?',
      '¿Puedo llamar métodos de un componente hijo con viewChild?',
      '¿Por qué usar afterNextRender en lugar de ngAfterViewInit?',
    ],
  },

  {
    id: 'L2.5',
    module: 2,
    moduleTitle: 'Componentes y Signals',
    title: 'ng-content: proyección de contenido',
    subtitle: 'Crea componentes contenedor reutilizables con slots',
    estimatedMinutes: 10,
    xpReward: 100,
    prerequisites: ['L2.4'],
    nextLesson: 'L2.6',
    language: 'typescript',
    narrative: [
      {
        type: 'text',
        content:
          'La proyección de contenido permite que un componente reciba y muestre HTML desde fuera de sí mismo. Piensa en ello como slots o marcadores de posición que el componente padre rellena. Esta es la base para construir componentes contenedor reutilizables: tarjetas, modales, paneles y layouts.',
      },
      {
        type: 'tip',
        variant: 'info',
        content:
          '`<ng-content />` es el slot por defecto — acepta todo el contenido que no esté marcado. `<ng-content select="[slot=header]" />` es un slot con nombre — solo el contenido con ese atributo va ahí.',
      },
      {
        type: 'text',
        content:
          'El componente padre pasa contenido entre las etiquetas de apertura y cierre del hijo. El hijo decide dónde colocarlo usando `ng-content`. Esto es fundamentalmente diferente a `@Input()` — estás proyectando estructura HTML, no datos primitivos.',
      },
      {
        type: 'tip',
        variant: 'angular',
        content:
          'Así es como funcionan internamente `<mat-card>`, `<mat-dialog>` y similares de Angular Material. Entender la proyección de contenido te permite leer y usar cualquier librería de UI de Angular con confianza.',
      },
      {
        type: 'checkpoint',
        question: '¿Qué atributo en ng-content permite crear slots con nombre?',
        options: ['name=', 'id=', 'select=', 'slot='],
        correct: 2,
        explanation:
          'El atributo `select=` en `<ng-content>` actúa como un selector CSS — solo proyecta el contenido que coincide. Por ejemplo, `<ng-content select="[slot=header]" />` solo proyecta elementos que tienen el atributo `slot="header"`.',
      },
    ],
    starterCode: `import { Component, ChangeDetectionStrategy } from '@angular/core';

// 📚 Biblioteca Angular — Content Projection
// ng-content permite que un componente reciba HTML desde su exterior
// Es la base de tarjetas, modales y layouts reutilizables

// ── Componente reutilizable (define los slots) ──────────────
@Component({
  selector: 'app-libro-card-v2',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: \`
    <article class="card">
      <header class="card-header">
        <ng-content select="[slot=header]" />
      </header>
      <div class="card-body">
        <ng-content />
      </div>
      <footer class="card-footer">
        <ng-content select="[slot=footer]" />
      </footer>
    </article>
  \`,
})
export class LibroCardV2Component {}

// ── Componente padre (usa app-libro-card-v2 con su contenido) ─
@Component({
  selector: 'app-biblioteca-cards',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LibroCardV2Component],
  template: \`
    <div class="lista-cards">
      <app-libro-card-v2>
        <div slot="header">
          <span class="categoria">Programación</span>
          <h3>Clean Code</h3>
        </div>

        <p>Robert C. Martin · 2008</p>
        <p class="descripcion">
          Principios y prácticas para escribir código limpio, legible y mantenible.
        </p>

        <div slot="footer">
          <span class="paginas">431 páginas</span>
          <button class="btn">Añadir a lista</button>
        </div>
      </app-libro-card-v2>

      <app-libro-card-v2>
        <div slot="header">
          <span class="categoria">Arquitectura</span>
          <h3>Clean Architecture</h3>
        </div>

        <p>Robert C. Martin · 2017</p>
        <p class="descripcion">
          Principios de diseño de software para crear sistemas mantenibles y escalables.
        </p>

        <div slot="footer">
          <span class="paginas">432 páginas</span>
          <button class="btn">Añadir a lista</button>
        </div>
      </app-libro-card-v2>
    </div>
  \`,
})
export class BibliotecaCardsComponent {}
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
    .lista-cards { display: flex; gap: 1rem; flex-wrap: wrap; justify-content: center; width: 100%; max-width: 640px; }
    .card { background: #161B22; border: 1px solid #30363D; border-radius: 12px; overflow: hidden; width: 100%; max-width: 280px; display: flex; flex-direction: column; }
    .card-header { background: #21262D; padding: 1rem 1.25rem; border-bottom: 1px solid #30363D; }
    .categoria { display: inline-block; font-size: 0.7rem; font-weight: 600; color: #8B5CF6; background: rgba(139,92,246,0.12); border: 1px solid rgba(139,92,246,0.25); padding: 0.15em 0.5em; border-radius: 4px; margin-bottom: 0.4rem; text-transform: uppercase; letter-spacing: 0.04em; }
    .card-header h3 { font-size: 1rem; font-weight: 600; color: #E6EDF3; }
    .card-body { padding: 1rem 1.25rem; flex: 1; }
    .card-body p { font-size: 0.83rem; color: #8B949E; margin-bottom: 0.5rem; }
    .card-body .descripcion { color: #8B949E; font-size: 0.8rem; line-height: 1.5; }
    .card-footer { display: flex; align-items: center; justify-content: space-between; padding: 0.875rem 1.25rem; background: #0D1117; border-top: 1px solid #21262D; }
    .paginas { font-size: 0.75rem; color: #8B949E; }
    .btn { background: #8B5CF6; color: white; border: none; border-radius: 6px; padding: 0.4rem 0.875rem; font-size: 0.8rem; font-weight: 500; transition: opacity 150ms, background 150ms; }
    .btn:hover { opacity: 0.85; }
    .btn.added { background: #22c55e; }
  </style>
</head>
<body>
  <span class="component-label">app-biblioteca-cards</span>
  <div class="lista-cards">
    <div class="card">
      <div class="card-header">
        <span class="categoria">Programación</span>
        <h3>Clean Code</h3>
      </div>
      <div class="card-body">
        <p>Robert C. Martin · 2008</p>
        <p class="descripcion">Principios y prácticas para escribir código limpio, legible y mantenible.</p>
      </div>
      <div class="card-footer">
        <span class="paginas">431 páginas</span>
        <button class="btn" onclick="toggle(this)">Añadir a lista</button>
      </div>
    </div>
    <div class="card">
      <div class="card-header">
        <span class="categoria">Arquitectura</span>
        <h3>Clean Architecture</h3>
      </div>
      <div class="card-body">
        <p>Robert C. Martin · 2017</p>
        <p class="descripcion">Principios de diseño de software para crear sistemas mantenibles y escalables.</p>
      </div>
      <div class="card-footer">
        <span class="paginas">432 páginas</span>
        <button class="btn" onclick="toggle(this)">Añadir a lista</button>
      </div>
    </div>
  </div>
  <script>
    function toggle(btn) {
      const added = btn.classList.toggle('added');
      btn.textContent = added ? '✓ Añadido' : 'Añadir a lista';
    }
  </script>
</body>
</html>`,
    aiContext:
      'El usuario está aprendiendo content projection con ng-content en Angular 19. Ha visto un sistema de cards con 3 slots (header, default, footer). Puede preguntar sobre slots con select, contentChild, la diferencia con @Input(), o cómo funcionan las librerías de UI como Angular Material internamente.',
    introMessage:
      'Esta lección muestra `ng-content` — la herramienta para crear componentes contenedor reutilizables.\n\nEl código define `app-libro-card-v2` con 3 slots (header, body, footer) y luego lo usa dos veces con contenido diferente. El componente tarjeta no sabe qué contenido recibirá — solo define la estructura.\n\nPregúntame sobre ng-content, slots con nombre, o cómo funciona esto en comparación con @Input().',
    suggestedQuestions: [
      '¿Cuándo usar ng-content vs @Input() para pasar contenido?',
      '¿Puedo tener múltiples ng-content sin select?',
      '¿Cómo accedo al contenido proyectado desde TypeScript?',
    ],
  },

  {
    id: 'L2.6',
    module: 2,
    moduleTitle: 'Componentes y Signals',
    title: 'ChangeDetectionStrategy.OnPush',
    subtitle: 'Optimiza el rendimiento desde el principio',
    estimatedMinutes: 10,
    xpReward: 150,
    prerequisites: ['L2.5'],
    nextLesson: 'L3.1',
    language: 'typescript',
    achievements: [
      {
        id: 'signals-master',
        name: 'Signals Master',
        description: 'Dominaste componentes y signals en Angular 19',
        icon: '⚡',
      },
    ],
    narrative: [
      {
        type: 'text',
        content:
          'La detección de cambios por defecto de Angular revisa todos los componentes en cada evento del browser. OnPush es un contrato: "Prometo que este componente solo necesita actualizarse cuando sus inputs cambian por referencia, se dispara un evento, o un signal/observable emite." Angular respeta esto y se salta el componente en todos los demás casos.',
      },
      {
        type: 'tip',
        variant: 'angular',
        content:
          'Todos los componentes de AngularVerse usan `ChangeDetectionStrategy.OnPush`. Combinado con signals, Angular sabe exactamente qué actualizar — nada más, nada menos. Esta combinación es lo que hace que Angular moderno sea extremadamente rápido.',
      },
      {
        type: 'text',
        content:
          'Con signals, OnPush se vuelve casi automático: los signals notifican a Angular cuando cambian, por lo que Angular solo re-renderiza los componentes que realmente tienen datos nuevos. La combinación signals + OnPush es el patrón recomendado para todo el código Angular nuevo.',
      },
      {
        type: 'tip',
        variant: 'info',
        content:
          'Si estás migrando una app existente, puedes adoptar OnPush de forma incremental — componente a componente. Cada adopción reduce el árbol de detección de cambios que Angular tiene que recorrer.',
      },
      {
        type: 'checkpoint',
        question: '¿Cuándo ejecuta Angular la detección de cambios en un componente OnPush?',
        options: [
          'En cada evento del browser, siempre',
          'Solo cuando sus signal inputs cambian, emite un evento, o un signal interno cambia',
          'Solo cuando llamas a markForCheck() manualmente',
          'Nunca — debes forzarlo siempre',
        ],
        correct: 1,
        explanation:
          'Con OnPush, Angular solo revisita el componente cuando: (1) alguno de sus inputs cambia por referencia, (2) el componente o algún hijo dispara un evento, o (3) un signal o observable marcado con async pipe emite un nuevo valor. En todos los demás casos, Angular se salta el componente completamente.',
      },
    ],
    starterCode: `import { Component, ChangeDetectionStrategy, signal, computed } from '@angular/core';

// 📚 Biblioteca Angular — ChangeDetectionStrategy.OnPush
// OnPush + Signals = el patrón de rendimiento estándar de Angular moderno

@Component({
  selector: 'app-biblioteca-optimizada',
  standalone: true,
  // ✅ Siempre usa OnPush — Angular solo revisa este componente cuando hay razón
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: \`
    <div class="biblioteca-app">
      <header class="app-header">
        <h2>{{ titulo() }}</h2>
        <span class="nivel-badge">{{ nivelColeccion() }}</span>
      </header>

      <div class="metricas">
        <div class="metrica">
          <span class="metrica-valor">{{ totalLibros() }}</span>
          <span class="metrica-label">Libros</span>
        </div>
        <div class="metrica">
          <span class="metrica-valor">{{ autoresUnicos() }}</span>
          <span class="metrica-label">Autores</span>
        </div>
        <div class="metrica">
          <span class="metrica-valor">{{ generosUnicos() }}</span>
          <span class="metrica-label">Géneros</span>
        </div>
      </div>

      <div class="acciones">
        <button (click)="agregarLibro()">+ Nuevo libro</button>
        <button (click)="agregarAutor()">+ Nuevo autor</button>
      </div>

      <p class="onpush-info">
        OnPush activo — Angular solo actualiza esta vista cuando cambia un signal.
      </p>
    </div>
  \`,
})
export class BibliotecaOptimizadaComponent {
  readonly totalLibros = signal(12);
  readonly autoresUnicos = signal(8);
  readonly generosUnicos = signal(5);

  // computed() — derivados que OnPush rastrea automáticamente
  readonly titulo = computed(() => \`📚 Biblioteca (\${this.totalLibros()} libros)\`);

  readonly nivelColeccion = computed(() => {
    const n = this.totalLibros();
    if (n < 10) return '🌱 Iniciando';
    if (n < 25) return '📚 Creciendo';
    if (n < 50) return '🏛️ Coleccionista';
    return '🎓 Bibliófilo';
  });

  agregarLibro(): void {
    this.totalLibros.update(n => n + 1);
  }

  agregarAutor(): void {
    this.autoresUnicos.update(n => n + 1);
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
    .biblioteca-app { background: #161B22; border: 1px solid #30363D; border-radius: 12px; padding: 1.5rem; width: 100%; max-width: 400px; }
    .app-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.5rem; }
    .app-header h2 { font-size: 1rem; font-weight: 600; }
    .nivel-badge { font-size: 0.78rem; color: #8B5CF6; background: rgba(139,92,246,0.1); border: 1px solid rgba(139,92,246,0.25); padding: 0.2em 0.6em; border-radius: 20px; white-space: nowrap; }
    .metricas { display: flex; gap: 0.75rem; margin-bottom: 1.5rem; }
    .metrica { flex: 1; background: #21262D; border: 1px solid #30363D; border-radius: 8px; padding: 0.875rem; text-align: center; }
    .metrica-valor { display: block; font-size: 1.75rem; font-weight: 700; color: #E6EDF3; line-height: 1; }
    .metrica-label { display: block; font-size: 0.72rem; color: #8B949E; margin-top: 0.25rem; }
    .acciones { display: flex; gap: 0.75rem; margin-bottom: 1rem; }
    .acciones button { flex: 1; background: #8B5CF6; color: white; border: none; border-radius: 6px; padding: 0.6rem 1rem; font-size: 0.8rem; font-weight: 500; transition: opacity 150ms; }
    .acciones button:hover { opacity: 0.85; }
    .onpush-info { font-size: 0.72rem; color: #8B949E; text-align: center; border-top: 1px solid #21262D; padding-top: 0.875rem; }
  </style>
</head>
<body>
  <span class="component-label">app-biblioteca-optimizada</span>
  <div class="biblioteca-app">
    <div class="app-header">
      <h2 id="titulo">📚 Biblioteca (12 libros)</h2>
      <span class="nivel-badge" id="nivel">📚 Creciendo</span>
    </div>
    <div class="metricas">
      <div class="metrica">
        <span class="metrica-valor" id="libros">12</span>
        <span class="metrica-label">Libros</span>
      </div>
      <div class="metrica">
        <span class="metrica-valor" id="autores">8</span>
        <span class="metrica-label">Autores</span>
      </div>
      <div class="metrica">
        <span class="metrica-valor" id="generos">5</span>
        <span class="metrica-label">Géneros</span>
      </div>
    </div>
    <div class="acciones">
      <button id="btn-libro">+ Nuevo libro</button>
      <button id="btn-autor">+ Nuevo autor</button>
    </div>
    <p class="onpush-info">OnPush activo — Angular solo actualiza esta vista cuando cambia un signal.</p>
  </div>
  <script>
    let totalLibros = 12, autores = 8;
    function nivel(n) {
      if (n < 10) return '🌱 Iniciando';
      if (n < 25) return '📚 Creciendo';
      if (n < 50) return '🏛️ Coleccionista';
      return '🎓 Bibliófilo';
    }
    function update() {
      document.getElementById('titulo').textContent = '📚 Biblioteca (' + totalLibros + ' libros)';
      document.getElementById('nivel').textContent = nivel(totalLibros);
      document.getElementById('libros').textContent = totalLibros;
      document.getElementById('autores').textContent = autores;
    }
    document.getElementById('btn-libro').addEventListener('click', () => { totalLibros++; update(); });
    document.getElementById('btn-autor').addEventListener('click', () => { autores++; update(); });
  </script>
</body>
</html>`,
    aiContext:
      'El usuario está terminando el módulo 2 sobre componentes y signals. Está aprendiendo ChangeDetectionStrategy.OnPush y cómo combinarlo con signals. AngularVerse mismo usa OnPush en todos sus componentes. Puede preguntar sobre zone.js, zoneless, markForCheck(), detectChanges(), o problemas de UI que no se actualiza.',
    introMessage:
      'Esta lección cierra el módulo de Componentes y Signals con `ChangeDetectionStrategy.OnPush`.\n\nTodos los componentes de AngularVerse usan OnPush. Observa cómo las métricas se actualizan únicamente cuando cambias un signal — Angular no revisa nada más.\n\nSi tienes preguntas sobre OnPush, zoneless, o cómo Angular decide qué componentes actualizar, pregúntame.',
    suggestedQuestions: [
      '¿Qué pasa si uso OnPush con @Input() en lugar de signals?',
      '¿Qué es zoneless y cómo se relaciona con OnPush?',
      '¿OnPush puede causar que la UI no se actualice cuando debería?',
    ],
  },
];
