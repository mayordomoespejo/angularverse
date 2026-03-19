import type { Lesson } from '../../core/models/lesson.model';

export const MODULE_9_LESSONS: Lesson[] = [
  {
    id: 'L9.1',
    module: 9,
    moduleTitle: 'Testing',
    title: 'Testing en Angular: Tu primera suite con TestBed',
    subtitle: 'ComponentFixture, detectChanges() y tu primera aserción real',
    estimatedMinutes: 14,
    xpReward: 150,
    prerequisites: ['L8.4'],
    nextLesson: 'L9.2',
    language: 'typescript',
    narrative: [
      {
        type: 'text',
        content:
          'Testear no es opcional — es lo que separa el código que funciona hoy del código que funciona mañana. Angular incluye `TestBed`, un entorno de testing que levanta un mini-módulo Angular en memoria. Con él puedes crear componentes, inyectar servicios y ejecutar el ciclo completo de detección de cambios en una fracción de segundo.',
      },
      {
        type: 'tip',
        variant: 'info',
        content:
          '`TestBed.configureTestingModule({ imports: [MiComponente] })` es el equivalente a bootstrapear tu app, pero solo para el test. A partir de Angular 14, los componentes standalone se importan directamente en `imports` — no necesitas un `declarations`.',
      },
      {
        type: 'text',
        content:
          '`TestBed.createComponent(LibroCardComponent)` devuelve un `ComponentFixture<T>`. Ese fixture es tu ventana al componente: `fixture.componentInstance` accede a la clase TypeScript, `fixture.nativeElement` accede al DOM real, y `fixture.debugElement.query(By.css(\'selector\'))` es la forma Angular-idiomática de buscar en el árbol. Siempre llama a `fixture.detectChanges()` después de cambiar inputs — sin esa llamada, el template no se actualiza.',
      },
      {
        type: 'tip',
        variant: 'angular',
        content:
          'Para signal inputs, usa `fixture.componentRef.setInput(\'nombre\', valor)` en lugar de asignar directamente a la propiedad. Los signal inputs son de solo lectura desde fuera del componente.',
      },
      {
        type: 'checkpoint',
        question: '¿Qué debes llamar para que el template refleje un cambio de input en un test?',
        options: [
          'fixture.update()',
          'fixture.detectChanges()',
          'fixture.render()',
          'TestBed.flush()',
        ],
        correct: 1,
        explanation:
          '`fixture.detectChanges()` dispara el ciclo de detección de cambios de Angular en el entorno de test. Sin esa llamada, el template queda desincronizado con el estado del componente — la prueba estaría verificando el DOM de antes del cambio.',
      },
    ],
    starterCode: `import { TestBed, ComponentFixture } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Component, input, ChangeDetectionStrategy } from '@angular/core';

// ---- Componente bajo prueba ----------------------------------------
interface Libro {
  titulo: string;
  autor: string;
  leido: boolean;
}

@Component({
  selector: 'app-libro-card',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: \`
    <article class="libro-card" [class.leido]="libro().leido">
      <h3 class="titulo">{{ libro().titulo }}</h3>
      <p class="autor">{{ libro().autor }}</p>
      @if (libro().leido) {
        <span class="badge-leido">Leído</span>
      }
    </article>
  \`,
})
export class LibroCardComponent {
  readonly libro = input.required<Libro>();
}

// ---- Suite de tests -------------------------------------------------
describe('LibroCardComponent', () => {
  let fixture: ComponentFixture<LibroCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      // Los componentes standalone se importan directamente
      imports: [LibroCardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LibroCardComponent);
  });

  it('debería renderizar el título del libro', () => {
    // 1. Establecer el input con setInput() (obligatorio para signal inputs)
    fixture.componentRef.setInput('libro', {
      titulo: 'Clean Code',
      autor: 'Robert C. Martin',
      leido: false,
    });

    // 2. Disparar detección de cambios para que el template se actualice
    fixture.detectChanges();

    // 3. Consultar el DOM
    const tituloEl = fixture.debugElement.query(By.css('.titulo'));
    expect(tituloEl.nativeElement.textContent).toContain('Clean Code');
  });

  it('debería mostrar el badge "Leído" solo cuando leido es true', () => {
    fixture.componentRef.setInput('libro', {
      titulo: 'The Pragmatic Programmer',
      autor: 'Hunt & Thomas',
      leido: true,
    });
    fixture.detectChanges();

    const badge = fixture.debugElement.query(By.css('.badge-leido'));
    expect(badge).not.toBeNull();
  });

  it('NO debería mostrar el badge cuando leido es false', () => {
    fixture.componentRef.setInput('libro', {
      titulo: 'Design Patterns',
      autor: 'Gang of Four',
      leido: false,
    });
    fixture.detectChanges();

    const badge = fixture.debugElement.query(By.css('.badge-leido'));
    expect(badge).toBeNull();
  });

  it('debería añadir la clase "leido" al artículo cuando está leído', () => {
    fixture.componentRef.setInput('libro', {
      titulo: 'Refactoring',
      autor: 'Martin Fowler',
      leido: true,
    });
    fixture.detectChanges();

    const card = fixture.debugElement.query(By.css('.libro-card'));
    expect(card.nativeElement.classList).toContain('leido');
  });
});
`,
    solutionCode: '',
    previewHtml: `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Inter', sans-serif; background: #0D1117; color: #E6EDF3; min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 1.5rem; }
    .runner { background: #161B22; border: 1px solid #30363D; border-radius: 12px; width: 100%; max-width: 480px; overflow: hidden; }
    .runner-header { display: flex; align-items: center; justify-content: space-between; padding: 0.875rem 1.25rem; background: #0D1117; border-bottom: 1px solid #30363D; }
    .runner-title { font-family: 'JetBrains Mono', monospace; font-size: 0.78rem; color: #8B949E; }
    .run-btn { background: #7C3AED; color: white; border: none; border-radius: 6px; padding: 0.3rem 0.875rem; font-size: 0.75rem; font-weight: 600; cursor: pointer; font-family: 'Inter', sans-serif; transition: opacity 150ms; }
    .run-btn:hover { opacity: 0.85; }
    .run-btn:disabled { opacity: 0.45; cursor: not-allowed; }
    .suite-label { padding: 0.875rem 1.25rem 0.4rem; font-size: 0.72rem; color: #8B949E; font-family: 'JetBrains Mono', monospace; }
    .suite-name { font-weight: 600; color: #c4b5fd; }
    .tests { padding: 0 0.875rem 0.875rem; display: flex; flex-direction: column; gap: 0.3rem; }
    .test { display: flex; align-items: flex-start; gap: 0.625rem; padding: 0.5rem 0.75rem; border-radius: 6px; background: #0D1117; border: 1px solid #21262D; font-size: 0.78rem; opacity: 0.45; transition: opacity 300ms, border-color 300ms, background 300ms; }
    .test.pass { opacity: 1; border-color: rgba(34,197,94,0.3); background: rgba(34,197,94,0.05); }
    .test.fail { opacity: 1; border-color: rgba(239,68,68,0.3); background: rgba(239,68,68,0.05); }
    .test.running { opacity: 1; border-color: rgba(124,58,237,0.35); background: rgba(124,58,237,0.06); animation: pulse 700ms ease-in-out infinite; }
    @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.6; } }
    .icon { font-size: 0.85rem; flex-shrink: 0; margin-top: 0.02rem; }
    .desc { color: #8B949E; line-height: 1.4; }
    .test.pass .desc { color: #E6EDF3; }
    .test.fail .desc { color: #fca5a5; }
    .summary { display: flex; align-items: center; gap: 1rem; padding: 0.75rem 1.25rem; border-top: 1px solid #21262D; font-size: 0.78rem; }
    .pill { padding: 0.2em 0.6em; border-radius: 20px; font-weight: 600; font-size: 0.72rem; }
    .pill.pass { background: rgba(34,197,94,0.15); color: #4ade80; border: 1px solid rgba(34,197,94,0.25); }
    .pill.fail { background: rgba(239,68,68,0.12); color: #f87171; border: 1px solid rgba(239,68,68,0.2); }
    .pill.pending { background: rgba(124,58,237,0.12); color: #a78bfa; border: 1px solid rgba(124,58,237,0.2); }
    .time { margin-left: auto; font-family: 'JetBrains Mono', monospace; color: #8B949E; font-size: 0.7rem; }
  </style>
</head>
<body>
  <div class="runner">
    <div class="runner-header">
      <span class="runner-title">Karma Test Runner</span>
      <button class="run-btn" id="runBtn" onclick="runTests()">Run Tests</button>
    </div>
    <div class="suite-label">describe(<span class="suite-name">'LibroCardComponent'</span>)</div>
    <div class="tests" id="tests">
      <div class="test" id="t0"><span class="icon">○</span><span class="desc">debería renderizar el título del libro</span></div>
      <div class="test" id="t1"><span class="icon">○</span><span class="desc">debería mostrar el badge "Leído" solo cuando leido es true</span></div>
      <div class="test" id="t2"><span class="icon">○</span><span class="desc">NO debería mostrar el badge cuando leido es false</span></div>
      <div class="test" id="t3"><span class="icon">○</span><span class="desc">debería añadir la clase "leido" al artículo cuando está leído</span></div>
    </div>
    <div class="summary" id="summary">
      <span class="pill pending">4 pending</span>
      <span class="time" id="elapsed"></span>
    </div>
  </div>
  <script>
    const results = [true, true, true, true];
    let running = false;
    function runTests() {
      if (running) return;
      running = true;
      document.getElementById('runBtn').disabled = true;
      const start = Date.now();
      for (let i = 0; i < 4; i++) {
        const el = document.getElementById('t' + i);
        el.className = 'test';
        el.querySelector('.icon').textContent = '○';
      }
      document.getElementById('summary').innerHTML = '<span class="pill pending">running...</span>';
      let i = 0;
      function next() {
        if (i >= 4) {
          const ms = Date.now() - start;
          const passed = results.filter(Boolean).length;
          const failed = results.filter(r => !r).length;
          let html = '';
          if (passed) html += '<span class="pill pass">' + passed + ' passed</span>';
          if (failed) html += '<span class="pill fail">' + failed + ' failed</span>';
          html += '<span class="time">' + ms + 'ms</span>';
          document.getElementById('summary').innerHTML = html;
          document.getElementById('runBtn').disabled = false;
          running = false;
          return;
        }
        const el = document.getElementById('t' + i);
        el.className = 'test running';
        el.querySelector('.icon').textContent = '…';
        setTimeout(() => {
          const ok = results[i];
          el.className = 'test ' + (ok ? 'pass' : 'fail');
          el.querySelector('.icon').textContent = ok ? '✓' : '✗';
          i++;
          setTimeout(next, 180);
        }, 420);
      }
      next();
    }
  </script>
</body>
</html>`,
    aiContext:
      'El usuario está aprendiendo testing en Angular 19 con TestBed. Ha visto TestBed.configureTestingModule, ComponentFixture, detectChanges y setInput para signal inputs. Puede preguntar sobre la diferencia entre nativeElement y debugElement, por qué se necesita detectChanges, cómo configurar el módulo de testing, o sobre Jasmine vs Jest.',
    introMessage:
      'Esta lección te introduce al testing de componentes Angular con `TestBed`.\n\nEl código muestra una suite completa con 4 tests para `LibroCardComponent`: renderizado de título, visibilidad condicional del badge, y clases CSS según el estado. Observa el patrón Arrange → Act → Assert en cada `it()`.\n\nPregúntame sobre `ComponentFixture`, `debugElement`, `setInput()`, o cómo estructurar una suite de tests.',
    suggestedQuestions: [
      '¿Cuál es la diferencia entre debugElement y nativeElement?',
      '¿Por qué necesito llamar detectChanges() después de setInput()?',
      '¿Puedo usar Jest en lugar de Jasmine con Angular?',
    ],
  },

  {
    id: 'L9.2',
    module: 9,
    moduleTitle: 'Testing',
    title: 'Testing de servicios y signals',
    subtitle: 'Signals son síncronos — testearlos es sencillo',
    estimatedMinutes: 14,
    xpReward: 160,
    prerequisites: ['L9.1'],
    nextLesson: 'L9.3',
    language: 'typescript',
    narrative: [
      {
        type: 'text',
        content:
          'Los servicios son la parte más fácil de testear en Angular: no tienen template, no tienen DOM, solo lógica. Con `TestBed.inject(MiServicio)` obtienes la instancia del servicio desde el inyector de tests. A partir de ahí, llamas métodos y verificas el estado resultante.',
      },
      {
        type: 'tip',
        variant: 'info',
        content:
          'Los signals son síncronos — no necesitas `async/await` para testearlos. Después de llamar a un método que actualiza un signal, lees su valor directamente con `servicio.miSignal()`. No hay nada que esperar.',
      },
      {
        type: 'text',
        content:
          'Para testear `computed()`, simplemente léelos después de modificar sus dependencias. Para testear `effect()`, Angular 19 introduce `TestBed.flushEffects()` que ejecuta los efectos pendientes sincrónicamente en el contexto de test. Sin esa llamada, un `effect()` podría no haberse ejecutado todavía cuando hagas tu `expect()`.',
      },
      {
        type: 'tip',
        variant: 'angular',
        content:
          'Si tu servicio no tiene dependencias, ni siquiera necesitas TestBed — puedes instanciarlo directamente con `new MiServicio()`. Usa TestBed cuando el servicio use `inject()` internamente o cuando quieras probar la inyección de dependencias.',
      },
      {
        type: 'checkpoint',
        question: '¿Cómo lees el valor actual de un signal en un test?',
        options: [
          'await signal.getValue()',
          'signal.subscribe(v => expect(v)...)',
          'signal()',
          'TestBed.getSignalValue(signal)',
        ],
        correct: 2,
        explanation:
          'Los signals son funciones síncronas — los lees llamándolos como función: `miSignal()`. No hay promesas, no hay observables, no hay callbacks. Esto es precisamente lo que hace que los signals sean tan fáciles de testear.',
      },
    ],
    starterCode: `import { TestBed } from '@angular/core/testing';
import { Injectable, signal, computed } from '@angular/core';

// ---- Servicio bajo prueba ------------------------------------------
interface Libro {
  id: number;
  titulo: string;
  autor: string;
  leido: boolean;
}

@Injectable({ providedIn: 'root' })
export class BibliotecaService {
  private readonly _libros = signal<Libro[]>([
    { id: 1, titulo: 'Clean Code', autor: 'Robert C. Martin', leido: false },
    { id: 2, titulo: 'The Pragmatic Programmer', autor: 'Hunt & Thomas', leido: true },
  ]);

  readonly libros = this._libros.asReadonly();

  readonly totalLibros = computed(() => this._libros().length);

  readonly librosLeidos = computed(() =>
    this._libros().filter(l => l.leido).length
  );

  readonly porcentajeLeido = computed(() => {
    const total = this.totalLibros();
    return total === 0 ? 0 : Math.round((this.librosLeidos() / total) * 100);
  });

  agregarLibro(libro: Omit<Libro, 'id'>): void {
    const id = this._libros().length + 1;
    this._libros.update(libros => [...libros, { ...libro, id }]);
  }

  eliminarLibro(id: number): void {
    this._libros.update(libros => libros.filter(l => l.id !== id));
  }

  marcarLeido(id: number): void {
    this._libros.update(libros =>
      libros.map(l => l.id === id ? { ...l, leido: true } : l)
    );
  }
}

// ---- Suite de tests -------------------------------------------------
describe('BibliotecaService', () => {
  let service: BibliotecaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BibliotecaService);
  });

  it('debería tener 2 libros al iniciar', () => {
    // Los signals son síncronos: leemos el valor directamente
    expect(service.totalLibros()).toBe(2);
  });

  it('debería incrementar totalLibros después de agregarLibro()', () => {
    service.agregarLibro({ titulo: 'Design Patterns', autor: 'GoF', leido: false });

    // computed() se recalcula automáticamente
    expect(service.totalLibros()).toBe(3);
  });

  it('debería decrementar totalLibros después de eliminarLibro()', () => {
    service.eliminarLibro(1);
    expect(service.totalLibros()).toBe(1);
    expect(service.libros()[0].titulo).toBe('The Pragmatic Programmer');
  });

  it('debería calcular librosLeidos correctamente', () => {
    // Estado inicial: 1 de 2 leídos
    expect(service.librosLeidos()).toBe(1);
    expect(service.porcentajeLeido()).toBe(50);

    // Marcamos el segundo como leído
    service.marcarLeido(1);
    expect(service.librosLeidos()).toBe(2);
    expect(service.porcentajeLeido()).toBe(100);
  });

  it('debería devolver 0% cuando no hay libros', () => {
    service.eliminarLibro(1);
    service.eliminarLibro(2);

    expect(service.totalLibros()).toBe(0);
    expect(service.porcentajeLeido()).toBe(0);
  });
});
`,
    solutionCode: '',
    previewHtml: `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Inter', sans-serif; background: #0D1117; color: #E6EDF3; min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 1.5rem; }
    .panel { background: #161B22; border: 1px solid #30363D; border-radius: 12px; width: 100%; max-width: 480px; overflow: hidden; }
    .panel-header { display: flex; align-items: center; justify-content: space-between; padding: 0.875rem 1.25rem; background: #0D1117; border-bottom: 1px solid #30363D; }
    .panel-title { font-family: 'JetBrains Mono', monospace; font-size: 0.78rem; color: #8B949E; }
    .run-btn { background: #7C3AED; color: white; border: none; border-radius: 6px; padding: 0.3rem 0.875rem; font-size: 0.75rem; font-weight: 600; cursor: pointer; font-family: 'Inter', sans-serif; transition: opacity 150ms; }
    .run-btn:hover { opacity: 0.85; }
    .run-btn:disabled { opacity: 0.4; cursor: not-allowed; }
    .suite-label { padding: 0.875rem 1.25rem 0.4rem; font-size: 0.72rem; color: #8B949E; font-family: 'JetBrains Mono', monospace; }
    .suite-name { font-weight: 600; color: #c4b5fd; }
    .tests { padding: 0 0.875rem 0.875rem; display: flex; flex-direction: column; gap: 0.3rem; }
    .test { display: flex; align-items: flex-start; gap: 0.625rem; padding: 0.5rem 0.75rem; border-radius: 6px; background: #0D1117; border: 1px solid #21262D; font-size: 0.78rem; opacity: 0.4; transition: all 300ms; }
    .test.pass { opacity: 1; border-color: rgba(34,197,94,0.3); background: rgba(34,197,94,0.05); }
    .test.fail { opacity: 1; border-color: rgba(239,68,68,0.3); background: rgba(239,68,68,0.05); }
    .test.running { opacity: 1; border-color: rgba(124,58,237,0.35); background: rgba(124,58,237,0.06); animation: pulse 700ms ease-in-out infinite; }
    @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.6; } }
    .icon { font-size: 0.85rem; flex-shrink: 0; margin-top: 0.02rem; }
    .desc { color: #8B949E; line-height: 1.4; }
    .test.pass .desc { color: #E6EDF3; }
    .assert-line { margin-top: 0.3rem; font-family: 'JetBrains Mono', monospace; font-size: 0.7rem; color: #4ade80; opacity: 0; transition: opacity 400ms; }
    .test.pass .assert-line { opacity: 1; }
    .summary { display: flex; align-items: center; gap: 0.75rem; padding: 0.75rem 1.25rem; border-top: 1px solid #21262D; font-size: 0.78rem; }
    .pill { padding: 0.2em 0.6em; border-radius: 20px; font-weight: 600; font-size: 0.72rem; }
    .pill.pass { background: rgba(34,197,94,0.15); color: #4ade80; border: 1px solid rgba(34,197,94,0.25); }
    .pill.pending { background: rgba(124,58,237,0.12); color: #a78bfa; border: 1px solid rgba(124,58,237,0.2); }
    .time { margin-left: auto; font-family: 'JetBrains Mono', monospace; color: #8B949E; font-size: 0.7rem; }
  </style>
</head>
<body>
  <div class="panel">
    <div class="panel-header">
      <span class="panel-title">BibliotecaService — Signal Tests</span>
      <button class="run-btn" id="runBtn" onclick="run()">Run Tests</button>
    </div>
    <div class="suite-label">describe(<span class="suite-name">'BibliotecaService'</span>)</div>
    <div class="tests" id="tests">
      <div class="test" id="t0"><div><span class="icon">○</span></div><div class="desc">debería tener 2 libros al iniciar<div class="assert-line">expect(totalLibros()).toBe(2) ✓</div></div></div>
      <div class="test" id="t1"><div><span class="icon">○</span></div><div class="desc">debería incrementar totalLibros después de agregarLibro()<div class="assert-line">expect(totalLibros()).toBe(3) ✓</div></div></div>
      <div class="test" id="t2"><div><span class="icon">○</span></div><div class="desc">debería decrementar totalLibros después de eliminarLibro()<div class="assert-line">expect(totalLibros()).toBe(1) ✓</div></div></div>
      <div class="test" id="t3"><div><span class="icon">○</span></div><div class="desc">debería calcular librosLeidos y porcentajeLeido correctamente<div class="assert-line">expect(porcentajeLeido()).toBe(100) ✓</div></div></div>
      <div class="test" id="t4"><div><span class="icon">○</span></div><div class="desc">debería devolver 0% cuando no hay libros<div class="assert-line">expect(porcentajeLeido()).toBe(0) ✓</div></div></div>
    </div>
    <div class="summary" id="summary"><span class="pill pending">5 pending</span></div>
  </div>
  <script>
    let running = false;
    function run() {
      if (running) return;
      running = true;
      document.getElementById('runBtn').disabled = true;
      for (let i = 0; i < 5; i++) {
        const el = document.getElementById('t' + i);
        el.className = 'test';
        el.querySelector('.icon').textContent = '○';
      }
      document.getElementById('summary').innerHTML = '<span class="pill pending">running...</span>';
      const start = Date.now();
      let i = 0;
      function next() {
        if (i >= 5) {
          document.getElementById('summary').innerHTML = '<span class="pill pass">5 passed</span><span class="time">' + (Date.now() - start) + 'ms</span>';
          document.getElementById('runBtn').disabled = false;
          running = false;
          return;
        }
        const el = document.getElementById('t' + i);
        el.className = 'test running';
        el.querySelector('.icon').textContent = '…';
        setTimeout(() => {
          el.className = 'test pass';
          el.querySelector('.icon').textContent = '✓';
          i++;
          setTimeout(next, 160);
        }, 380);
      }
      next();
    }
  </script>
</body>
</html>`,
    aiContext:
      'El usuario está aprendiendo a testear servicios Angular 19 con signals. Ha visto TestBed.inject(), signals síncronos, computed() y cómo verificar que los valores derivados se actualizan automáticamente. Puede preguntar sobre TestBed.flushEffects(), diferencia entre signal y BehaviorSubject para tests, o cómo aislar el servicio de sus dependencias.',
    introMessage:
      'Esta lección muestra cómo testear `BibliotecaService` — un servicio con signals, computed y lógica de negocio.\n\nLo clave: los signals son síncronos. Después de llamar a `agregarLibro()`, lees `totalLibros()` directamente sin `async`. El `computed()` ya tiene el valor correcto.\n\nPregúntame sobre `TestBed.inject()`, `flushEffects()`, o cómo funciona la detección de cambios en tests de servicios.',
    suggestedQuestions: [
      '¿Por qué no necesito async/await para testear signals?',
      '¿Cuándo necesito TestBed.flushEffects()?',
      '¿Puedo instanciar un servicio sin TestBed en los tests?',
    ],
  },

  {
    id: 'L9.3',
    module: 9,
    moduleTitle: 'Testing',
    title: 'Mocking y testing de componentes con dependencias',
    subtitle: 'Controla las dependencias con jasmine.createSpyObj y useValue',
    estimatedMinutes: 15,
    xpReward: 160,
    prerequisites: ['L9.2'],
    nextLesson: 'L9.4',
    language: 'typescript',
    narrative: [
      {
        type: 'text',
        content:
          'Cuando un componente depende de un servicio, testear el componente directamente significaría testear también el servicio — y eso viola el principio de aislamiento. La solución es un mock: un objeto falso que imita la interfaz del servicio real pero devuelve valores controlados por ti.',
      },
      {
        type: 'tip',
        variant: 'info',
        content:
          '`jasmine.createSpyObj("BibliotecaService", ["agregarLibro", "eliminarLibro"])` crea un objeto con esos métodos como spies — funciones que registran si fueron llamadas, con qué argumentos, y pueden configurarse para devolver valores específicos con `.and.returnValue()`.',
      },
      {
        type: 'text',
        content:
          'En `TestBed.configureTestingModule`, la clave es el array `providers`. Con `{ provide: BibliotecaService, useValue: mockService }` le dices a Angular: "cuando alguien pida `BibliotecaService`, dales `mockService` en su lugar". El componente bajo test nunca sabe que está usando un fake.',
      },
      {
        type: 'tip',
        variant: 'angular',
        content:
          'Después de `fixture.detectChanges()`, usa `expect(mockService.metodo).toHaveBeenCalledWith(args)` para verificar que el componente llamó al servicio correctamente. Esta es la aserción más valiosa en tests de integración ligera.',
      },
      {
        type: 'checkpoint',
        question: '¿Qué proveedor usas en TestBed para sustituir un servicio real por un mock?',
        options: [
          '{ provide: RealService, useClass: MockService }',
          '{ provide: RealService, useValue: mockObject }',
          '{ mock: RealService, with: mockObject }',
          'TestBed.mockService(RealService, mockObject)',
        ],
        correct: 1,
        explanation:
          '`{ provide: RealService, useValue: mockObject }` es la forma estándar de inyectar un mock en TestBed. `useValue` permite pasar cualquier objeto — incluyendo los creados con `jasmine.createSpyObj`. `useClass` funcionaría si tuvieras una clase mock completa, pero `useValue` es más conciso para spies.',
      },
    ],
    starterCode: `import { TestBed, ComponentFixture } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Component, inject, signal, computed, ChangeDetectionStrategy } from '@angular/core';
import { Injectable } from '@angular/core';

// ---- Servicio real (NO se usa en los tests — lo mockeamos) ---------
interface Libro { id: number; titulo: string; autor: string; leido: boolean; }

@Injectable({ providedIn: 'root' })
export class BibliotecaService {
  readonly libros = signal<Libro[]>([]);
  readonly totalLibros = computed(() => this.libros().length);
  agregarLibro(_libro: Omit<Libro, 'id'>): void {}
  eliminarLibro(_id: number): void {}
}

// ---- Componente bajo prueba ----------------------------------------
@Component({
  selector: 'app-catalogo',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: \`
    <div class="catalogo">
      <p class="contador">Total: {{ service.totalLibros() }} libros</p>
      <ul>
        @for (libro of service.libros(); track libro.id) {
          <li class="libro-item">
            <span class="libro-titulo">{{ libro.titulo }}</span>
            <button class="btn-eliminar" (click)="eliminar(libro.id)">Eliminar</button>
          </li>
        }
      </ul>
      <button class="btn-agregar" (click)="agregar()">Agregar libro</button>
    </div>
  \`,
})
export class CatalogoComponent {
  readonly service = inject(BibliotecaService);

  agregar(): void {
    this.service.agregarLibro({ titulo: 'Nuevo libro', autor: 'Autor', leido: false });
  }

  eliminar(id: number): void {
    this.service.eliminarLibro(id);
  }
}

// ---- Suite de tests con mock ----------------------------------------
describe('CatalogoComponent (con mock)', () => {
  let fixture: ComponentFixture<CatalogoComponent>;
  let mockService: jasmine.SpyObj<BibliotecaService>;

  beforeEach(async () => {
    // Creamos un spy object que imita la interfaz de BibliotecaService
    mockService = jasmine.createSpyObj('BibliotecaService', ['agregarLibro', 'eliminarLibro']);

    // Configuramos los signals del mock con valores que controlamos
    const librosSignal = signal<Libro[]>([
      { id: 1, titulo: 'Clean Code', autor: 'Robert C. Martin', leido: false },
      { id: 2, titulo: 'Refactoring', autor: 'Martin Fowler', leido: true },
    ]);
    (mockService as any).libros = librosSignal.asReadonly();
    (mockService as any).totalLibros = computed(() => librosSignal().length);

    await TestBed.configureTestingModule({
      imports: [CatalogoComponent],
      providers: [
        // useValue reemplaza el servicio real por nuestro mock
        { provide: BibliotecaService, useValue: mockService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CatalogoComponent);
    fixture.detectChanges();
  });

  it('debería renderizar todos los libros del mock', () => {
    const items = fixture.debugElement.queryAll(By.css('.libro-item'));
    expect(items.length).toBe(2);
  });

  it('debería mostrar el contador correcto', () => {
    const contador = fixture.debugElement.query(By.css('.contador'));
    expect(contador.nativeElement.textContent).toContain('2');
  });

  it('debería llamar a agregarLibro() al pulsar el botón Agregar', () => {
    const btn = fixture.debugElement.query(By.css('.btn-agregar'));
    btn.nativeElement.click();

    // Verificamos que el componente llamó al servicio — no qué hizo el servicio
    expect(mockService.agregarLibro).toHaveBeenCalledOnceWith({
      titulo: 'Nuevo libro',
      autor: 'Autor',
      leido: false,
    });
  });

  it('debería llamar a eliminarLibro() con el id correcto', () => {
    const botones = fixture.debugElement.queryAll(By.css('.btn-eliminar'));
    botones[0].nativeElement.click();

    expect(mockService.eliminarLibro).toHaveBeenCalledOnceWith(1);
  });
});
`,
    solutionCode: '',
    previewHtml: `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Inter', sans-serif; background: #0D1117; color: #E6EDF3; min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 1.5rem; }
    .layout { display: flex; gap: 1rem; width: 100%; max-width: 640px; flex-wrap: wrap; justify-content: center; }
    .box { background: #161B22; border: 1px solid #30363D; border-radius: 10px; overflow: hidden; flex: 1; min-width: 240px; }
    .box-header { padding: 0.6rem 1rem; background: #0D1117; border-bottom: 1px solid #30363D; font-size: 0.72rem; font-family: 'JetBrains Mono', monospace; }
    .real-label { color: #f97316; }
    .mock-label { color: #4ade80; }
    .box-body { padding: 0.875rem; }
    .service-row { display: flex; align-items: center; gap: 0.5rem; padding: 0.35rem 0.5rem; border-radius: 5px; font-size: 0.75rem; margin-bottom: 0.3rem; border: 1px solid #21262D; background: #0D1117; }
    .method { font-family: 'JetBrains Mono', monospace; color: #E6EDF3; }
    .return-val { margin-left: auto; font-family: 'JetBrains Mono', monospace; font-size: 0.7rem; color: #8B949E; }
    .mock-row .method { color: #4ade80; }
    .mock-row .return-val { color: #a78bfa; }
    .spy-badge { font-size: 0.65rem; background: rgba(74,222,128,0.1); color: #4ade80; border: 1px solid rgba(74,222,128,0.2); padding: 0.1em 0.4em; border-radius: 3px; margin-left: auto; }
    .call-counter { margin-top: 0.875rem; border-top: 1px solid #21262D; padding-top: 0.75rem; }
    .call-label { font-size: 0.7rem; color: #8B949E; margin-bottom: 0.4rem; }
    .call-row { display: flex; align-items: center; gap: 0.5rem; font-size: 0.72rem; margin-bottom: 0.25rem; }
    .call-method { font-family: 'JetBrains Mono', monospace; color: #c4b5fd; }
    .call-count { margin-left: auto; font-family: 'JetBrains Mono', monospace; font-size: 0.7rem; }
    .call-count.active { color: #4ade80; }
    .call-count.zero { color: #8B949E; }
    .sim-btn { width: 100%; background: #7C3AED; color: white; border: none; border-radius: 6px; padding: 0.5rem; font-size: 0.8rem; font-weight: 600; cursor: pointer; font-family: 'Inter', sans-serif; margin-top: 0.75rem; transition: opacity 150ms; }
    .sim-btn:hover { opacity: 0.85; }
    .runner { flex: 1 1 100%; }
    .tests { padding: 0 0.875rem 0.875rem; display: flex; flex-direction: column; gap: 0.25rem; margin-top: 0.5rem; }
    .test { display: flex; align-items: center; gap: 0.5rem; padding: 0.45rem 0.75rem; border-radius: 5px; border: 1px solid #21262D; background: #0D1117; font-size: 0.75rem; opacity: 0.4; transition: all 300ms; }
    .test.pass { opacity: 1; border-color: rgba(34,197,94,0.3); background: rgba(34,197,94,0.05); }
    .test.running { opacity: 1; border-color: rgba(124,58,237,0.35); animation: pulse 700ms ease-in-out infinite; }
    @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.6; } }
    .icon { font-size: 0.8rem; }
    .desc { color: #8B949E; }
    .test.pass .desc { color: #E6EDF3; }
  </style>
</head>
<body>
  <div class="layout">
    <div class="box">
      <div class="box-header"><span class="real-label">REAL</span> BibliotecaService</div>
      <div class="box-body">
        <div class="service-row"><span class="method">agregarLibro()</span><span class="return-val">side-effect</span></div>
        <div class="service-row"><span class="method">eliminarLibro()</span><span class="return-val">side-effect</span></div>
        <div class="service-row"><span class="method">libros()</span><span class="return-val">signal&lt;Libro[]&gt;</span></div>
        <div class="service-row"><span class="method">totalLibros()</span><span class="return-val">computed</span></div>
      </div>
    </div>
    <div class="box">
      <div class="box-header"><span class="mock-label">MOCK</span> createSpyObj</div>
      <div class="box-body">
        <div class="service-row mock-row"><span class="method">agregarLibro()</span><span class="spy-badge">spy</span></div>
        <div class="service-row mock-row"><span class="method">eliminarLibro()</span><span class="spy-badge">spy</span></div>
        <div class="service-row mock-row"><span class="method">libros()</span><span class="return-val">[Clean Code, Refactoring]</span></div>
        <div class="service-row mock-row"><span class="method">totalLibros()</span><span class="return-val">2</span></div>
        <div class="call-counter">
          <div class="call-label">spy call tracker</div>
          <div class="call-row"><span class="call-method">agregarLibro</span><span class="call-count zero" id="addCount">0 calls</span></div>
          <div class="call-row"><span class="call-method">eliminarLibro</span><span class="call-count zero" id="delCount">0 calls</span></div>
        </div>
        <button class="sim-btn" onclick="simulate()">Simular interacción</button>
      </div>
    </div>
    <div class="box runner">
      <div class="box-header" style="display:flex;align-items:center;justify-content:space-between;">
        <span style="color:#8B949E;font-size:0.72rem;font-family:'JetBrains Mono',monospace;">CatalogoComponent (con mock)</span>
        <button class="sim-btn" style="width:auto;margin-top:0;padding:0.25rem 0.75rem;font-size:0.72rem;" id="runBtn" onclick="runTests()">Run Tests</button>
      </div>
      <div class="tests" id="tests">
        <div class="test" id="t0"><span class="icon">○</span><span class="desc">debería renderizar todos los libros del mock</span></div>
        <div class="test" id="t1"><span class="icon">○</span><span class="desc">debería mostrar el contador correcto</span></div>
        <div class="test" id="t2"><span class="icon">○</span><span class="desc">debería llamar a agregarLibro() al pulsar Agregar</span></div>
        <div class="test" id="t3"><span class="icon">○</span><span class="desc">debería llamar a eliminarLibro() con el id correcto</span></div>
      </div>
    </div>
  </div>
  <script>
    let addCalls = 0, delCalls = 0, running = false;
    function simulate() {
      addCalls++;
      delCalls++;
      document.getElementById('addCount').textContent = addCalls + ' call' + (addCalls !== 1 ? 's' : '');
      document.getElementById('addCount').className = 'call-count active';
      document.getElementById('delCount').textContent = delCalls + ' call' + (delCalls !== 1 ? 's' : '');
      document.getElementById('delCount').className = 'call-count active';
    }
    function runTests() {
      if (running) return;
      running = true;
      document.getElementById('runBtn').disabled = true;
      for (let i = 0; i < 4; i++) { const el = document.getElementById('t' + i); el.className = 'test'; el.querySelector('.icon').textContent = '○'; }
      let i = 0;
      function next() {
        if (i >= 4) { document.getElementById('runBtn').disabled = false; running = false; return; }
        const el = document.getElementById('t' + i);
        el.className = 'test running';
        el.querySelector('.icon').textContent = '…';
        setTimeout(() => {
          el.className = 'test pass';
          el.querySelector('.icon').textContent = '✓';
          i++; setTimeout(next, 170);
        }, 400);
      }
      next();
    }
  </script>
</body>
</html>`,
    aiContext:
      'El usuario está aprendiendo mocking en Angular 19 con jasmine.createSpyObj y useValue en TestBed. Ha visto cómo sustituir un servicio real por un mock y verificar llamadas con toHaveBeenCalledWith. Puede preguntar sobre la diferencia entre useValue, useClass y useFactory, sobre cómo mockear signals, o sobre cuándo es mejor no mockear.',
    introMessage:
      'Esta lección muestra la técnica fundamental del testing: aislar el componente de sus dependencias con mocks.\n\n`jasmine.createSpyObj` crea un servicio falso que registra cada llamada. El componente `CatalogoComponent` nunca sabe que está usando un mock — solo llama a los métodos que espera tener.\n\nPregúntame sobre `useValue` vs `useClass`, cómo mockear signals, o cuándo es mejor no mockear.',
    suggestedQuestions: [
      '¿Cuándo es mejor no mockear el servicio y usarlo real?',
      '¿Cómo mockeo un signal dentro del spy object?',
      '¿Qué diferencia hay entre useValue, useClass y useFactory?',
    ],
  },

  {
    id: 'L9.4',
    module: 9,
    moduleTitle: 'Testing',
    title: 'Testing HTTP y formularios',
    subtitle: 'HttpTestingController, flush() y validación de formularios reactivos',
    estimatedMinutes: 16,
    xpReward: 170,
    prerequisites: ['L9.3'],
    nextLesson: 'L10.1',
    language: 'typescript',
    achievements: [
      {
        id: 'qa-engineer',
        name: 'QA Engineer',
        description: 'Completaste el módulo de Testing — tus apps ahora tienen respaldo',
        icon: '🧪',
      },
    ],
    narrative: [
      {
        type: 'text',
        content:
          'Las llamadas HTTP son un caso especial en testing: no quieres hacer peticiones reales en tus tests. Angular incluye `provideHttpClientTesting()`, que reemplaza `HttpClient` por una versión que intercepta peticiones en lugar de enviarlas. Tú controlas qué respuesta devuelve cada petición con `httpMock.expectOne(url).flush(data)`.',
      },
      {
        type: 'tip',
        variant: 'info',
        content:
          '`httpMock.expectOne(url)` hace dos cosas a la vez: verifica que se hizo exactamente una petición a esa URL, y devuelve un `TestRequest` con el que puedes responder. Si la petición no se hizo, el test falla aquí mismo. Llama siempre a `httpMock.verify()` al final para confirmar que no quedaron peticiones sin atender.',
      },
      {
        type: 'text',
        content:
          'Para formularios reactivos, el testing es directo: accede a los controles con `form.get(\'campo\')`, establece valores con `.setValue()`, y verifica el estado con `.valid`, `.invalid`, `.errors`. No necesitas el DOM para testear la lógica de validación — el formulario es un objeto TypeScript.',
      },
      {
        type: 'tip',
        variant: 'angular',
        content:
          'Después de `flush()`, la petición HTTP se resuelve síncronamente en el contexto de test. No necesitas `async/await` si usas `HttpTestingController` — la respuesta llega inmediatamente y el observable emite en el mismo tick.',
      },
      {
        type: 'checkpoint',
        question: '¿Qué método de HttpTestingController simula la respuesta del servidor?',
        options: ['.respond(data)', '.flush(data)', '.resolve(data)', '.reply(data)'],
        correct: 1,
        explanation:
          '`.flush(data)` en un `TestRequest` simula la respuesta del servidor con los datos que le pases. Puedes también llamar a `.flush(data, { status: 404, statusText: "Not Found" })` para simular errores HTTP. `.error(new ErrorEvent(...))` simula errores de red.',
      },
    ],
    starterCode: `import { TestBed } from '@angular/core/testing';
import { HttpClient, provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Injectable } from '@angular/core';

// ---- Servicio HTTP bajo prueba -------------------------------------
interface Libro {
  id: number;
  titulo: string;
  autor: string;
}

@Injectable({ providedIn: 'root' })
export class LibrosApiService {
  private readonly API = 'https://api.biblioteca.dev/libros';

  constructor(private http: HttpClient) {}

  getLibros() {
    return this.http.get<Libro[]>(this.API);
  }

  getLibro(id: number) {
    return this.http.get<Libro>(\`\${this.API}/\${id}\`);
  }

  crearLibro(libro: Omit<Libro, 'id'>) {
    return this.http.post<Libro>(this.API, libro);
  }

  eliminarLibro(id: number) {
    return this.http.delete<void>(\`\${this.API}/\${id}\`);
  }
}

// ---- Tests HTTP con HttpTestingController --------------------------
describe('LibrosApiService', () => {
  let service: LibrosApiService;
  let httpMock: HttpTestingController;

  const LIBROS_MOCK: Libro[] = [
    { id: 1, titulo: 'Clean Code', autor: 'Robert C. Martin' },
    { id: 2, titulo: 'Refactoring', autor: 'Martin Fowler' },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(), // reemplaza HttpClient por la versión de test
      ],
    });

    service = TestBed.inject(LibrosApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    // Verifica que no quedan peticiones pendientes sin atender
    httpMock.verify();
  });

  it('debería obtener la lista de libros', () => {
    let resultado: Libro[] | undefined;

    service.getLibros().subscribe(libros => {
      resultado = libros;
    });

    // Interceptamos la petición y respondemos con datos controlados
    const req = httpMock.expectOne('https://api.biblioteca.dev/libros');
    expect(req.request.method).toBe('GET');
    req.flush(LIBROS_MOCK); // flush() es la respuesta simulada del servidor

    // Después del flush, el observable ya emitió de forma síncrona
    expect(resultado).toEqual(LIBROS_MOCK);
    expect(resultado?.length).toBe(2);
  });

  it('debería crear un libro con POST', () => {
    const nuevoLibro = { titulo: 'Design Patterns', autor: 'GoF' };
    let creado: Libro | undefined;

    service.crearLibro(nuevoLibro).subscribe(libro => {
      creado = libro;
    });

    const req = httpMock.expectOne('https://api.biblioteca.dev/libros');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(nuevoLibro);
    req.flush({ id: 3, ...nuevoLibro });

    expect(creado?.id).toBe(3);
  });
});

// ---- Tests de formulario reactivo ----------------------------------
describe('Formulario Añadir Libro', () => {
  let fb: FormBuilder;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
    });
    fb = TestBed.inject(FormBuilder);
  });

  function crearFormulario() {
    return fb.group({
      titulo: ['', [Validators.required, Validators.minLength(3)]],
      autor: ['', Validators.required],
      paginas: [null, [Validators.required, Validators.min(1)]],
    });
  }

  it('debería ser inválido cuando está vacío', () => {
    const form = crearFormulario();
    expect(form.valid).toBeFalse();
  });

  it('debería ser válido con todos los campos correctos', () => {
    const form = crearFormulario();
    form.setValue({ titulo: 'Clean Code', autor: 'Robert C. Martin', paginas: 431 });
    expect(form.valid).toBeTrue();
  });

  it('debería fallar minLength en titulo con menos de 3 caracteres', () => {
    const form = crearFormulario();
    form.get('titulo')?.setValue('AB');
    expect(form.get('titulo')?.hasError('minlength')).toBeTrue();
  });

  it('debería fallar min en paginas con valor 0 o negativo', () => {
    const form = crearFormulario();
    form.get('paginas')?.setValue(0);
    expect(form.get('paginas')?.hasError('min')).toBeTrue();
  });
});
`,
    solutionCode: '',
    previewHtml: `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Inter', sans-serif; background: #0D1117; color: #E6EDF3; min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 1.5rem; }
    .layout { width: 100%; max-width: 520px; display: flex; flex-direction: column; gap: 1rem; }
    .box { background: #161B22; border: 1px solid #30363D; border-radius: 10px; overflow: hidden; }
    .box-header { display: flex; align-items: center; justify-content: space-between; padding: 0.6rem 1rem; background: #0D1117; border-bottom: 1px solid #30363D; font-size: 0.72rem; font-family: 'JetBrains Mono', monospace; color: #8B949E; }
    .run-btn { background: #7C3AED; color: white; border: none; border-radius: 5px; padding: 0.25rem 0.75rem; font-size: 0.7rem; font-weight: 600; cursor: pointer; font-family: 'Inter', sans-serif; transition: opacity 150ms; }
    .run-btn:hover { opacity: 0.85; }
    .run-btn:disabled { opacity: 0.4; cursor: not-allowed; }
    .flow { padding: 0.875rem 1rem; display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap; }
    .step { display: flex; flex-direction: column; align-items: center; gap: 0.25rem; min-width: 72px; }
    .step-box { background: #21262D; border: 1px solid #30363D; border-radius: 6px; padding: 0.35rem 0.6rem; font-size: 0.7rem; font-family: 'JetBrains Mono', monospace; color: #8B949E; text-align: center; white-space: nowrap; transition: all 400ms; }
    .step-box.active { border-color: #7C3AED; color: #c4b5fd; background: rgba(124,58,237,0.1); }
    .step-box.done { border-color: rgba(34,197,94,0.4); color: #4ade80; background: rgba(34,197,94,0.06); }
    .step-label { font-size: 0.62rem; color: #8B949E; }
    .arrow { color: #30363D; font-size: 0.9rem; flex-shrink: 0; }
    .tests { padding: 0 0.875rem 0.875rem; display: flex; flex-direction: column; gap: 0.25rem; margin-top: 0.5rem; }
    .test { display: flex; align-items: center; gap: 0.5rem; padding: 0.45rem 0.75rem; border-radius: 5px; border: 1px solid #21262D; background: #0D1117; font-size: 0.75rem; opacity: 0.4; transition: all 300ms; }
    .test.pass { opacity: 1; border-color: rgba(34,197,94,0.3); background: rgba(34,197,94,0.05); }
    .test.running { opacity: 1; border-color: rgba(124,58,237,0.35); animation: pulse 700ms ease-in-out infinite; }
    @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.6; } }
    .icon { font-size: 0.8rem; flex-shrink: 0; }
    .desc { color: #8B949E; }
    .test.pass .desc { color: #E6EDF3; }
    .section-label { padding: 0.5rem 0.875rem 0.25rem; font-size: 0.7rem; color: #8B949E; font-family: 'JetBrains Mono', monospace; border-top: 1px solid #21262D; }
    .section-name { color: #c4b5fd; font-weight: 600; }
    .summary { display: flex; align-items: center; gap: 0.75rem; padding: 0.65rem 1rem; border-top: 1px solid #21262D; font-size: 0.75rem; }
    .pill { padding: 0.2em 0.6em; border-radius: 20px; font-weight: 600; font-size: 0.7rem; }
    .pill.pass { background: rgba(34,197,94,0.15); color: #4ade80; border: 1px solid rgba(34,197,94,0.25); }
    .pill.pending { background: rgba(124,58,237,0.12); color: #a78bfa; border: 1px solid rgba(124,58,237,0.2); }
    .time-label { margin-left: auto; font-family: 'JetBrains Mono', monospace; color: #8B949E; font-size: 0.7rem; }
  </style>
</head>
<body>
  <div class="layout">
    <div class="box">
      <div class="box-header"><span>HTTP Test Flow — HttpTestingController</span><button class="run-btn" id="flowBtn" onclick="runFlow()">Simular</button></div>
      <div class="flow">
        <div class="step"><div class="step-box" id="s0">service.getLibros()</div><div class="step-label">observable</div></div>
        <div class="arrow">→</div>
        <div class="step"><div class="step-box" id="s1">expectOne(url)</div><div class="step-label">interceptar</div></div>
        <div class="arrow">→</div>
        <div class="step"><div class="step-box" id="s2">req.flush([...])</div><div class="step-label">responder</div></div>
        <div class="arrow">→</div>
        <div class="step"><div class="step-box" id="s3">expect(resultado)</div><div class="step-label">verificar</div></div>
        <div class="arrow">→</div>
        <div class="step"><div class="step-box" id="s4">httpMock.verify()</div><div class="step-label">cerrar</div></div>
      </div>
    </div>
    <div class="box">
      <div class="box-header" style="justify-content:space-between;">
        <span>Tests — HTTP + Formulario</span>
        <button class="run-btn" id="runBtn" onclick="runTests()">Run All Tests</button>
      </div>
      <div class="section-label">describe(<span class="section-name">'LibrosApiService'</span>)</div>
      <div class="tests" id="httpTests">
        <div class="test" id="h0"><span class="icon">○</span><span class="desc">debería obtener la lista de libros</span></div>
        <div class="test" id="h1"><span class="icon">○</span><span class="desc">debería crear un libro con POST</span></div>
      </div>
      <div class="section-label" style="border-top:1px solid #21262D;">describe(<span class="section-name">'Formulario Añadir Libro'</span>)</div>
      <div class="tests" id="formTests">
        <div class="test" id="f0"><span class="icon">○</span><span class="desc">debería ser inválido cuando está vacío</span></div>
        <div class="test" id="f1"><span class="icon">○</span><span class="desc">debería ser válido con todos los campos correctos</span></div>
        <div class="test" id="f2"><span class="icon">○</span><span class="desc">debería fallar minLength en titulo con menos de 3 caracteres</span></div>
        <div class="test" id="f3"><span class="icon">○</span><span class="desc">debería fallar min en paginas con valor 0 o negativo</span></div>
      </div>
      <div class="summary" id="summary"><span class="pill pending">6 pending</span></div>
    </div>
  </div>
  <script>
    let flowRunning = false, testRunning = false;
    function runFlow() {
      if (flowRunning) return;
      flowRunning = true;
      document.getElementById('flowBtn').disabled = true;
      const steps = ['s0','s1','s2','s3','s4'];
      steps.forEach(id => { document.getElementById(id).className = 'step-box'; });
      let i = 0;
      function next() {
        if (i >= steps.length) { document.getElementById('flowBtn').disabled = false; flowRunning = false; return; }
        const el = document.getElementById(steps[i]);
        if (i > 0) document.getElementById(steps[i-1]).className = 'step-box done';
        el.className = 'step-box active';
        i++;
        setTimeout(next, 500);
      }
      next();
    }
    function runTests() {
      if (testRunning) return;
      testRunning = true;
      document.getElementById('runBtn').disabled = true;
      const ids = ['h0','h1','f0','f1','f2','f3'];
      ids.forEach(id => { const el = document.getElementById(id); el.className = 'test'; el.querySelector('.icon').textContent = '○'; });
      document.getElementById('summary').innerHTML = '<span class="pill pending">running...</span>';
      const start = Date.now();
      let i = 0;
      function next() {
        if (i >= ids.length) {
          document.getElementById('summary').innerHTML = '<span class="pill pass">6 passed</span><span class="time-label">' + (Date.now() - start) + 'ms</span>';
          document.getElementById('runBtn').disabled = false;
          testRunning = false;
          return;
        }
        const el = document.getElementById(ids[i]);
        el.className = 'test running';
        el.querySelector('.icon').textContent = '…';
        setTimeout(() => {
          el.className = 'test pass';
          el.querySelector('.icon').textContent = '✓';
          i++; setTimeout(next, 150);
        }, 390);
      }
      next();
    }
  </script>
</body>
</html>`,
    aiContext:
      'El usuario está terminando el módulo de Testing en Angular 19. Ha visto HttpTestingController, provideHttpClientTesting, flush() para simular respuestas HTTP, y testing de formularios reactivos sin DOM. Puede preguntar sobre cómo testear errores HTTP, sobre el flujo async de HttpClient, sobre e2e testing con Playwright, o sobre cobertura de tests.',
    introMessage:
      'Esta lección cierra el módulo de Testing con dos técnicas avanzadas: testing HTTP con `HttpTestingController` y testing de formularios reactivos.\n\nEl patrón HTTP es: subscribirse → interceptar con `expectOne()` → responder con `flush()` → verificar resultado → `httpMock.verify()`. Para formularios, testeas directamente el objeto sin DOM — `form.get("campo")?.errors` te dice exactamente qué falla.\n\nPregúntame sobre errores HTTP en tests, testing de observables, o cómo pasar al testing E2E con Playwright.',
    suggestedQuestions: [
      '¿Cómo simulo un error 404 en un test HTTP?',
      '¿Puedo testear observables con async/await en lugar de subscribe?',
      '¿Qué diferencia hay entre testing unitario y E2E con Playwright?',
    ],
  },
];
