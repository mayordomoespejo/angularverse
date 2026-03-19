import type { Lesson } from '../../core/models/lesson.model';

export const MODULE_3_LESSONS: Lesson[] = [
  {
    id: 'L3.1',
    module: 3,
    moduleTitle: 'Templates y Directivas',
    title: 'Control Flow: @if, @for, @switch',
    subtitle: 'La nueva sintaxis de templates de Angular 17+',
    estimatedMinutes: 12,
    xpReward: 100,
    prerequisites: ['L2.6'],
    nextLesson: 'L3.2',
    language: 'typescript',
    narrative: [
      {
        type: 'text',
        content:
          'Angular 17 introdujo una sintaxis de control flow nativa: `@if`, `@for`, `@switch`. Estas reemplazan las antiguas directivas estructurales `*ngIf`, `*ngFor`, `*ngSwitch`. Están integradas directamente en el compilador de Angular — no necesitas importar nada.',
      },
      {
        type: 'tip',
        variant: 'info',
        content:
          '`@for` requiere una expresión `track` obligatoria. Esto ayuda a Angular a identificar qué elementos cambiaron, se movieron, o fueron añadidos/eliminados. Usa `track item.id` para objetos con IDs, o `track $index` para arrays simples.',
      },
      {
        type: 'text',
        content:
          'La nueva sintaxis también introduce `@empty` como bloque compañero de `@for` — se renderiza cuando el array está vacío. Y `@if` soporta cadenas `@else if` para condiciones complejas, sin necesidad de `ng-template` adicionales.',
      },
      {
        type: 'tip',
        variant: 'angular',
        content:
          'AngularVerse usa `@if`, `@for` y `@switch` en toda la plataforma — cada lista de lecciones, cada panel condicional, cada mensaje del chat usa esta sintaxis. El código que has estado leyendo ya muestra estos patrones en acción.',
      },
      {
        type: 'checkpoint',
        question: '¿Qué es obligatorio en el bloque @for?',
        options: ['@empty', 'track', 'let i = $index', 'un @else'],
        correct: 1,
        explanation:
          '`track` es obligatorio en `@for`. Le indica a Angular cómo identificar de forma única cada elemento de la lista para optimizar las actualizaciones del DOM. Sin `track`, Angular no puede hacer actualizaciones eficientes cuando el array cambia.',
      },
    ],
    starterCode: `import { Component, signal, computed, ChangeDetectionStrategy } from '@angular/core';

// 📚 Biblioteca Angular — Control Flow moderno
// @if, @for y @switch son la nueva forma de controlar el template

interface Libro {
  id: number;
  titulo: string;
  autor: string;
  categoria: 'ficcion' | 'tecnico' | 'historia';
  disponible: boolean;
}

@Component({
  selector: 'app-catalogo',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: \`
    <div class="catalogo">
      <div class="filtros">
        <button
          [class.activo]="filtroActivo() === 'todos'"
          (click)="filtroActivo.set('todos')"
        >Todos ({{ libros().length }})</button>
        <button
          [class.activo]="filtroActivo() === 'disponible'"
          (click)="filtroActivo.set('disponible')"
        >Disponibles ({{ librosDisponibles() }})</button>
      </div>

      <!-- @if — condicional con @else -->
      @if (librosFiltrados().length > 0) {
        <div class="lista">
          <!-- @for con track obligatorio -->
          @for (libro of librosFiltrados(); track libro.id) {
            <div class="libro-fila">
              <div class="libro-info">
                <strong>{{ libro.titulo }}</strong>
                <span class="autor">{{ libro.autor }}</span>
              </div>

              <!-- @switch — múltiples casos -->
              @switch (libro.categoria) {
                @case ('ficcion')  { <span class="badge ficcion">Ficción</span> }
                @case ('tecnico')  { <span class="badge tecnico">Técnico</span> }
                @case ('historia') { <span class="badge historia">Historia</span> }
              }

              <span class="disponibilidad" [class.no]="!libro.disponible">
                {{ libro.disponible ? '✓' : '✗' }}
              </span>
            </div>
          } @empty {
            <p class="empty">No hay libros en esta categoría.</p>
          }
        </div>
      } @else {
        <div class="empty-state">
          <p>Sin resultados para el filtro actual.</p>
        </div>
      }
    </div>
  \`,
})
export class CatalogoComponent {
  readonly filtroActivo = signal<'todos' | 'disponible'>('todos');

  readonly libros = signal<Libro[]>([
    { id: 1, titulo: 'Clean Code', autor: 'Martin', categoria: 'tecnico', disponible: true },
    { id: 2, titulo: '1984', autor: 'Orwell', categoria: 'ficcion', disponible: false },
    { id: 3, titulo: 'Sapiens', autor: 'Harari', categoria: 'historia', disponible: true },
    { id: 4, titulo: 'The Pragmatic Programmer', autor: 'Hunt & Thomas', categoria: 'tecnico', disponible: true },
  ]);

  readonly librosDisponibles = computed(() => this.libros().filter(l => l.disponible).length);
  readonly librosFiltrados = computed(() =>
    this.filtroActivo() === 'disponible'
      ? this.libros().filter(l => l.disponible)
      : this.libros()
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
    .catalogo { background: #161B22; border: 1px solid #30363D; border-radius: 12px; overflow: hidden; width: 100%; max-width: 460px; }
    .filtros { display: flex; gap: 0.5rem; padding: 1rem 1.25rem; border-bottom: 1px solid #30363D; }
    .filtros button { background: transparent; border: 1px solid #30363D; color: #8B949E; border-radius: 6px; padding: 0.4rem 0.875rem; font-size: 0.8rem; transition: all 150ms; }
    .filtros button.activo { background: #8B5CF6; border-color: #8B5CF6; color: white; }
    .filtros button:hover:not(.activo) { border-color: #8B5CF6; color: #8B5CF6; }
    .libro-fila { display: flex; align-items: center; justify-content: space-between; padding: 0.875rem 1.25rem; border-bottom: 1px solid #21262D; gap: 0.75rem; }
    .libro-fila:last-child { border-bottom: none; }
    .libro-info { flex: 1; min-width: 0; }
    .libro-info strong { display: block; font-size: 0.875rem; font-weight: 600; color: #E6EDF3; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .autor { font-size: 0.775rem; color: #8B949E; }
    .badge { font-size: 0.7rem; font-weight: 600; padding: 0.2em 0.5em; border-radius: 4px; white-space: nowrap; }
    .badge.tecnico { background: rgba(139,92,246,0.15); color: #a78bfa; border: 1px solid rgba(139,92,246,0.3); }
    .badge.ficcion { background: rgba(59,130,246,0.15); color: #60a5fa; border: 1px solid rgba(59,130,246,0.3); }
    .badge.historia { background: rgba(249,115,22,0.15); color: #fb923c; border: 1px solid rgba(249,115,22,0.3); }
    .disponibilidad { font-size: 0.875rem; font-weight: 700; color: #22c55e; width: 20px; text-align: center; flex-shrink: 0; }
    .disponibilidad.no { color: #DD0031; }
  </style>
</head>
<body>
  <span class="component-label">app-catalogo</span>
  <div class="catalogo">
    <div class="filtros">
      <button id="btn-todos" class="activo">Todos (4)</button>
      <button id="btn-disp">Disponibles (3)</button>
    </div>
    <div id="lista"></div>
  </div>
  <script>
    const libros = [
      { id: 1, titulo: 'Clean Code', autor: 'Martin', categoria: 'tecnico', disponible: true },
      { id: 2, titulo: '1984', autor: 'Orwell', categoria: 'ficcion', disponible: false },
      { id: 3, titulo: 'Sapiens', autor: 'Harari', categoria: 'historia', disponible: true },
      { id: 4, titulo: 'The Pragmatic Programmer', autor: 'Hunt & Thomas', categoria: 'tecnico', disponible: true },
    ];
    let filtro = 'todos';
    function render() {
      const filtered = filtro === 'disponible' ? libros.filter(l => l.disponible) : libros;
      document.getElementById('btn-todos').className = filtro === 'todos' ? 'activo' : '';
      document.getElementById('btn-disp').className = filtro === 'disponible' ? 'activo' : '';
      document.getElementById('lista').innerHTML = filtered.map(l =>
        '<div class="libro-fila">' +
          '<div class="libro-info"><strong>' + l.titulo + '</strong><span class="autor">' + l.autor + '</span></div>' +
          '<span class="badge ' + l.categoria + '">' + ({ tecnico: 'Técnico', ficcion: 'Ficción', historia: 'Historia' }[l.categoria]) + '</span>' +
          '<span class="disponibilidad' + (l.disponible ? '' : ' no') + '">' + (l.disponible ? '✓' : '✗') + '</span>' +
        '</div>'
      ).join('');
    }
    document.getElementById('btn-todos').addEventListener('click', () => { filtro = 'todos'; render(); });
    document.getElementById('btn-disp').addEventListener('click', () => { filtro = 'disponible'; render(); });
    render();
  </script>
</body>
</html>`,
    aiContext:
      'El usuario está aprendiendo el control flow moderno de Angular 17+ (@if, @for, @switch). Ha visto un catálogo de libros con filtrado. Puede preguntar sobre track, @empty, @else if, migración de directivas estructurales antiguas, o diferencias de rendimiento.',
    introMessage:
      'Esta lección muestra el control flow moderno de Angular 17+: `@if`, `@for` y `@switch`.\n\nEl catálogo filtra libros con `@if` para mostrar/ocultar estados, itera con `@for` (observa el `track` obligatorio), y clasifica categorías con `@switch`.\n\nPregúntame sobre track, @empty, migración desde *ngIf/*ngFor, o cualquier aspecto del control flow.',
    suggestedQuestions: [
      '¿Por qué track es obligatorio en @for?',
      '¿Puedo anidar @for dentro de @for?',
      '¿Cómo migro *ngIf y *ngFor al nuevo control flow?',
    ],
  },

  {
    id: 'L3.2',
    module: 3,
    moduleTitle: 'Templates y Directivas',
    title: 'Pipes: transformación de datos en templates',
    subtitle: 'DatePipe, CurrencyPipe, pipes personalizados y más',
    estimatedMinutes: 12,
    xpReward: 100,
    prerequisites: ['L3.1'],
    nextLesson: 'L3.3',
    language: 'typescript',
    narrative: [
      {
        type: 'text',
        content:
          'Los pipes transforman valores directamente en los templates usando el operador `|`. Son funciones puras — el mismo input siempre produce el mismo output. Los pipes integrados cubren las transformaciones más comunes: fechas, números, moneda, texto en mayúsculas/minúsculas.',
      },
      {
        type: 'tip',
        variant: 'info',
        content:
          'Los pipes puros están altamente optimizados — Angular solo los ejecuta cuando el valor de entrada cambia. Los pipes impuros se ejecutan en cada ciclo de detección de cambios (evítalos a menos que sea necesario).',
      },
      {
        type: 'text',
        content:
          'Puedes crear pipes personalizados con `@Pipe({ name: \'miPipe\', standalone: true })` e implementar `PipeTransform`. Pueden aceptar parámetros: `{{ valor | miPipe:param1:param2 }}`.',
      },
      {
        type: 'tip',
        variant: 'angular',
        content:
          'Los pipes son perfectos para transformaciones de presentación que no deben afectar al modelo de datos subyacente. Formatea fechas para mostrarlas, pero almacénalas como strings ISO. Formatea moneda para mostrarla, pero almacénala como números.',
      },
      {
        type: 'checkpoint',
        question: '¿Qué característica hace que un pipe sea \'puro\'?',
        options: [
          'Que no tenga estado interno mutable',
          'Que siempre retorne el mismo output para el mismo input (referencialmente)',
          'Que use OnPush en su componente',
          'Que no inyecte servicios',
        ],
        correct: 1,
        explanation:
          'Un pipe puro siempre devuelve el mismo resultado para los mismos argumentos de entrada. Angular aprovecha esto para memorizar el resultado y no re-ejecutar el pipe si el input no ha cambiado por referencia. Un pipe impuro se ejecuta en cada ciclo de detección de cambios, independientemente de si el input cambió.',
      },
    ],
    starterCode: `import { Component } from '@angular/core';
import { DatePipe, CurrencyPipe, TitleCasePipe, UpperCasePipe, DecimalPipe, SlicePipe } from '@angular/common';
import { Pipe, PipeTransform, ChangeDetectionStrategy } from '@angular/core';

// 📚 Biblioteca Angular — Pipes
// Transforman valores en el template: {{ valor | pipe:parámetro }}

// ── Pipe personalizado ───────────────────────────────────────
@Pipe({ name: 'tiempoLectura', standalone: true, pure: true })
export class TiempoLecturaPipe implements PipeTransform {
  transform(paginas: number): string {
    const minutos = Math.round(paginas * 1.5); // ~1.5 min por página
    if (minutos < 60) return \`\${minutos} min\`;
    const horas = Math.floor(minutos / 60);
    const resto = minutos % 60;
    return resto > 0 ? \`\${horas}h \${resto}min\` : \`\${horas}h\`;
  }
}

@Component({
  selector: 'app-libro-pipes',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DatePipe, CurrencyPipe, TitleCasePipe, UpperCasePipe, DecimalPipe, SlicePipe, TiempoLecturaPipe],
  template: \`
    <div class="ficha">
      <h2>{{ titulo | titlecase }}</h2>
      <p class="subtitulo">Ficha técnica del libro</p>

      <dl class="datos">
        <dt>Autor</dt>
        <dd>{{ autor | uppercase }}</dd>

        <dt>Publicación</dt>
        <dd>{{ fechaPublicacion | date:'MMMM yyyy':'':'es-ES' }}</dd>

        <dt>Precio</dt>
        <dd>{{ precio | currency:'EUR':'symbol':'1.2-2' }}</dd>

        <dt>Páginas</dt>
        <dd>{{ paginas | number:'1.0-0' }}</dd>

        <dt>Tiempo estimado</dt>
        <dd>{{ paginas | tiempoLectura }}</dd>

        <dt>Resumen</dt>
        <dd>{{ resumen | slice:0:100 }}...</dd>
      </dl>
    </div>
  \`,
})
export class LibroPipesComponent {
  readonly titulo = 'the pragmatic programmer';
  readonly autor = 'andrew hunt';
  readonly fechaPublicacion = new Date(1999, 9, 20);
  readonly precio = 34.95;
  readonly paginas = 352;
  readonly resumen = 'From journeymen to masters, this book helps programmers become more adaptable, more effective, and ultimately more successful in their careers.';
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
    .ficha { background: #161B22; border: 1px solid #30363D; border-radius: 12px; padding: 1.5rem; width: 100%; max-width: 400px; }
    h2 { font-size: 1.1rem; font-weight: 700; margin-bottom: 0.25rem; }
    .subtitulo { font-size: 0.78rem; color: #8B949E; margin-bottom: 1.25rem; }
    dl { display: flex; flex-direction: column; gap: 0; }
    .row { display: flex; align-items: baseline; gap: 1rem; padding: 0.6rem 0.75rem; border-radius: 6px; }
    .row:nth-child(odd) { background: rgba(255,255,255,0.03); }
    dt { font-size: 0.72rem; font-weight: 600; color: #8B949E; text-transform: uppercase; letter-spacing: 0.05em; min-width: 110px; flex-shrink: 0; }
    dd { font-size: 0.875rem; color: #E6EDF3; font-family: 'JetBrains Mono', monospace; }
    .pipe-tag { display: inline-block; font-size: 0.65rem; color: #8B5CF6; background: rgba(139,92,246,0.1); border: 1px solid rgba(139,92,246,0.2); padding: 0.05em 0.35em; border-radius: 3px; margin-left: 0.4rem; font-family: 'JetBrains Mono', monospace; vertical-align: middle; }
  </style>
</head>
<body>
  <span class="component-label">app-libro-pipes</span>
  <div class="ficha">
    <h2>The Pragmatic Programmer</h2>
    <p class="subtitulo">Ficha técnica del libro</p>
    <dl>
      <div class="row"><dt>Autor<span class="pipe-tag">uppercase</span></dt><dd>ANDREW HUNT</dd></div>
      <div class="row"><dt>Publicación<span class="pipe-tag">date</span></dt><dd>octubre 1999</dd></div>
      <div class="row"><dt>Precio<span class="pipe-tag">currency</span></dt><dd>34,95 €</dd></div>
      <div class="row"><dt>Páginas<span class="pipe-tag">number</span></dt><dd>352</dd></div>
      <div class="row"><dt>Tiempo<span class="pipe-tag">custom</span></dt><dd>8h 48min</dd></div>
      <div class="row"><dt>Resumen<span class="pipe-tag">slice:0:100</span></dt><dd style="font-family:'Inter',sans-serif;font-size:0.8rem;color:#8B949E">From journeymen to masters, this book helps programmers become more adaptable, more effective...</dd></div>
    </dl>
  </div>
</body>
</html>`,
    aiContext:
      'El usuario está aprendiendo pipes de Angular 19. Ha visto pipes built-in (date, currency, titlecase, uppercase, number, slice) y un pipe personalizado tiempoLectura. Puede preguntar sobre pipes puros vs impuros, el pipe async, cómo encadenar pipes, o cómo crear pipes con parámetros.',
    introMessage:
      'Esta lección muestra cómo los pipes transforman datos directamente en el template sin modificar el modelo subyacente.\n\nObserva: el título se almacena en minúsculas pero `titlecase` lo muestra capitalizado. La fecha es un objeto Date pero `date` la formatea. El pipe `tiempoLectura` es personalizado.\n\nPregúntame sobre pipes puros vs impuros, cómo crear pipes propios, o el pipe `async`.',
    suggestedQuestions: [
      '¿Cuándo debo crear un pipe personalizado vs una función en el componente?',
      '¿Qué es el pipe async y para qué sirve?',
      '¿Puedo combinar múltiples pipes en cadena?',
    ],
  },

  {
    id: 'L3.3',
    module: 3,
    moduleTitle: 'Templates y Directivas',
    title: 'Directivas: ngClass, ngStyle y directivas personalizadas',
    subtitle: 'Modifica el comportamiento de elementos existentes',
    estimatedMinutes: 12,
    xpReward: 100,
    prerequisites: ['L3.2'],
    nextLesson: 'L3.4',
    language: 'typescript',
    narrative: [
      {
        type: 'text',
        content:
          'Las directivas de atributo extienden el comportamiento de elementos HTML sin cambiar su estructura. Angular proporciona `ngClass` para clases CSS dinámicas y `ngStyle` para estilos en línea. Pero el verdadero poder está en crear las tuyas propias.',
      },
      {
        type: 'tip',
        variant: 'info',
        content:
          'Prefiere `[class.nombre]="bool"` sobre `ngClass` para clases individuales — es más simple y legible. Usa `ngClass` solo cuando necesites aplicar múltiples clases condicionalmente basándote en un objeto o array.',
      },
      {
        type: 'text',
        content:
          'Las directivas de atributo personalizadas usan `@Directive({ selector: \'[appMiDirectiva]\' })`. Pueden inyectar `ElementRef` para acceder al elemento DOM, `Renderer2` para manipularlo de forma segura, y usar `@HostListener` para responder a eventos.',
      },
      {
        type: 'tip',
        variant: 'angular',
        content:
          'En Angular moderno, usa `inject()` dentro de las directivas igual que en los componentes. Las directivas también pueden tener signals `input()`, lo que las hace configurables desde el exterior.',
      },
      {
        type: 'checkpoint',
        question: '¿Cuál es la diferencia principal entre un componente y una directiva de atributo?',
        options: [
          'Los componentes tienen template, las directivas no',
          'Las directivas son más rápidas',
          'Las directivas no pueden inyectar servicios',
          'No hay diferencia real',
        ],
        correct: 0,
        explanation:
          'La diferencia fundamental es que los componentes tienen su propio template HTML (definen su propia vista), mientras que las directivas de atributo no tienen template — se "adjuntan" a elementos existentes para modificar su comportamiento, apariencia o lógica.',
      },
    ],
    starterCode: `import {
  Component, Directive, ElementRef, HostListener,
  inject, input, signal, ChangeDetectionStrategy
} from '@angular/core';

// 📚 Biblioteca Angular — Directivas de atributo
// Las directivas modifican el comportamiento de elementos existentes

// ── Directiva personalizada: efecto hover configurable ──────
@Directive({
  selector: '[appResaltar]',
  standalone: true,
})
export class ResaltarDirective {
  readonly color = input('rgba(139, 92, 246, 0.12)', { alias: 'appResaltar' });
  private readonly el = inject(ElementRef<HTMLElement>);

  @HostListener('mouseenter')
  onEnter(): void {
    this.el.nativeElement.style.backgroundColor = this.color();
    this.el.nativeElement.style.transition = 'background-color 200ms ease';
  }

  @HostListener('mouseleave')
  onLeave(): void {
    this.el.nativeElement.style.backgroundColor = '';
  }
}

// ── Directiva personalizada: marca libros urgentes ──────────
@Directive({
  selector: '[appUrgente]',
  standalone: true,
})
export class UrgenteDirective {
  readonly diasLimite = input.required<number>({ alias: 'appUrgente' });
  private readonly el = inject(ElementRef<HTMLElement>);

  ngOnInit(): void {
    if (this.diasLimite() <= 3) {
      this.el.nativeElement.style.borderLeft = '3px solid #ef4444';
    }
  }
}

@Component({
  selector: 'app-lista-directivas',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ResaltarDirective, UrgenteDirective],
  template: \`
    <div class="lista">
      <h3>Préstamos activos</h3>
      @for (prestamo of prestamos(); track prestamo.id) {
        <div
          class="prestamo-fila"
          appResaltar
          [appUrgente]="prestamo.diasRestantes"
          [class.vencido]="prestamo.diasRestantes <= 0"
          [class.urgente]="prestamo.diasRestantes > 0 && prestamo.diasRestantes <= 3"
        >
          <span class="titulo">{{ prestamo.titulo }}</span>
          <span
            class="dias"
            [style.color]="prestamo.diasRestantes <= 3 ? '#ef4444' : '#8B949E'"
          >
            @if (prestamo.diasRestantes > 0) {
              {{ prestamo.diasRestantes }}d restantes
            } @else {
              ¡Vencido!
            }
          </span>
        </div>
      }
    </div>
  \`,
})
export class ListaDirectivasComponent {
  readonly prestamos = signal([
    { id: 1, titulo: 'Clean Code', diasRestantes: 12 },
    { id: 2, titulo: 'Design Patterns', diasRestantes: 3 },
    { id: 3, titulo: 'Refactoring', diasRestantes: 0 },
    { id: 4, titulo: 'The Pragmatic Programmer', diasRestantes: 7 },
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
    .lista { background: #161B22; border: 1px solid #30363D; border-radius: 12px; overflow: hidden; width: 100%; max-width: 400px; }
    h3 { font-size: 0.9rem; font-weight: 600; padding: 1rem 1.25rem; border-bottom: 1px solid #30363D; color: #E6EDF3; }
    .prestamo-fila { display: flex; align-items: center; justify-content: space-between; padding: 0.875rem 1.25rem; border-bottom: 1px solid #21262D; border-left: 3px solid transparent; transition: background-color 200ms ease; cursor: default; }
    .prestamo-fila:last-child { border-bottom: none; }
    .prestamo-fila:hover { background-color: rgba(139,92,246,0.08); }
    .prestamo-fila.urgente { border-left-color: #ef4444; }
    .prestamo-fila.vencido { border-left-color: #ef4444; background: rgba(239,68,68,0.05); }
    .titulo { font-size: 0.875rem; font-weight: 500; color: #E6EDF3; }
    .dias { font-size: 0.8rem; font-weight: 500; color: #8B949E; }
    .dias.urgente { color: #ef4444; }
    .hint { font-size: 0.73rem; color: #8B949E; padding: 0.75rem 1.25rem; border-top: 1px solid #21262D; background: rgba(255,255,255,0.02); }
  </style>
</head>
<body>
  <span class="component-label">app-lista-directivas</span>
  <div class="lista">
    <h3>Préstamos activos</h3>
    <div class="prestamo-fila" id="p1"><span class="titulo">Clean Code</span><span class="dias">12d restantes</span></div>
    <div class="prestamo-fila urgente" id="p2"><span class="titulo">Design Patterns</span><span class="dias urgente">3d restantes</span></div>
    <div class="prestamo-fila vencido" id="p3"><span class="titulo">Refactoring</span><span class="dias urgente">¡Vencido!</span></div>
    <div class="prestamo-fila" id="p4"><span class="titulo">The Pragmatic Programmer</span><span class="dias">7d restantes</span></div>
    <div class="hint">Pasa el cursor sobre las filas para ver el efecto hover de <code style="font-family:'JetBrains Mono',monospace">appResaltar</code></div>
  </div>
</body>
</html>`,
    aiContext:
      'El usuario está aprendiendo directivas de atributo en Angular 19. Ha visto directivas personalizadas con input(), HostListener e inject(ElementRef). Puede preguntar sobre Renderer2, HostBinding, diferencia entre directivas de atributo y estructurales, o cuándo es apropiado manipular el DOM directamente.',
    introMessage:
      'Esta lección muestra cómo las directivas de atributo modifican el comportamiento de elementos sin cambiar su estructura.\n\nEl código define dos directivas personalizadas: `appResaltar` (efecto hover) y `appUrgente` (borde rojo cuando quedan ≤3 días). Observa que aceptan `input()` igual que los componentes.\n\nPregúntame sobre Renderer2, HostBinding, HostListener, o cuándo crear una directiva vs un componente.',
    suggestedQuestions: [
      '¿Cuándo usar una directiva vs extraer la lógica a un componente?',
      '¿Qué es Renderer2 y por qué usarlo en lugar de manipular el DOM directamente?',
      '¿Las directivas pueden tener su propio template?',
    ],
  },

  {
    id: 'L3.4',
    module: 3,
    moduleTitle: 'Templates y Directivas',
    title: '@defer: carga diferida inteligente',
    subtitle: 'Carga componentes solo cuando se necesitan',
    estimatedMinutes: 12,
    xpReward: 150,
    prerequisites: ['L3.3'],
    nextLesson: 'L4.1',
    language: 'typescript',
    achievements: [
      {
        id: 'template-wizard',
        name: 'Template Wizard',
        description: 'Dominaste templates, directivas y control flow de Angular',
        icon: '🧙',
      },
    ],
    narrative: [
      {
        type: 'text',
        content:
          '`@defer` es la carga diferida nativa de Angular para componentes. En lugar de cargar todo de una vez, puedes diferir componentes pesados hasta que sean realmente necesarios — reduciendo el tamaño del bundle inicial y mejorando el tiempo de carga.',
      },
      {
        type: 'tip',
        variant: 'info',
        content:
          '`@defer` tiene bloques compañeros opcionales: `@loading` (mostrado mientras carga), `@placeholder` (mostrado antes de que comience la carga), `@error` (mostrado si falla la carga). Todos son opcionales.',
      },
      {
        type: 'text',
        content:
          'Los triggers disponibles: `@defer (on idle)` espera al tiempo libre del browser, `@defer (on viewport)` espera hasta que el elemento entra en el viewport, `@defer (on interaction)` espera a la interacción del usuario, `@defer (when condicion)` espera a que un signal sea verdadero.',
      },
      {
        type: 'tip',
        variant: 'angular',
        content:
          'AngularVerse usa `@defer` para cargar el panel del chat solo cuando se abre — el código del tutor IA no se descarga hasta que realmente haces clic para abrirlo. Esto es `@defer (when isOpen())` en acción.',
      },
      {
        type: 'checkpoint',
        question: '¿Qué trigger de @defer espera hasta que el elemento entra en el viewport?',
        options: ['on idle', 'on viewport', 'on interaction', 'when visible'],
        correct: 1,
        explanation:
          '`on viewport` es el trigger que espera hasta que el bloque defer entra en el área visible del navegador. Es ideal para componentes below-the-fold: comentarios, secciones de página que el usuario puede que no llegue a ver, estadísticas secundarias, etc.',
      },
    ],
    starterCode: `import { Component, signal, ChangeDetectionStrategy } from '@angular/core';

// 📚 Biblioteca Angular — @defer
// Carga componentes de forma diferida para reducir el bundle inicial

// Simulamos un componente de estadísticas "pesado"
@Component({
  selector: 'app-estadisticas-biblioteca',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: \`
    <div class="stats-panel">
      <h3>📊 Estadísticas detalladas</h3>
      <div class="stats-grid">
        <div class="stat-item">
          <span class="stat-val">247</span>
          <span class="stat-name">Libros totales</span>
        </div>
        <div class="stat-item">
          <span class="stat-val">89</span>
          <span class="stat-name">Leídos este año</span>
        </div>
        <div class="stat-item">
          <span class="stat-val">34</span>
          <span class="stat-name">Géneros</span>
        </div>
        <div class="stat-item">
          <span class="stat-val">12h</span>
          <span class="stat-name">Tiempo medio</span>
        </div>
      </div>
    </div>
  \`,
})
export class EstadisticasBibliotecaComponent {}

// Componente principal con @defer
@Component({
  selector: 'app-biblioteca-defer',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [EstadisticasBibliotecaComponent],
  template: \`
    <div class="app">
      <header>
        <h2>📚 Mi Biblioteca</h2>
        <span class="badge">12 libros</span>
      </header>

      <p class="descripcion">
        El contenido principal carga inmediatamente.
        Las estadísticas detalladas se cargan solo cuando las necesitas.
      </p>

      <button (click)="mostrarStats.set(!mostrarStats())">
        {{ mostrarStats() ? '▼ Ocultar estadísticas' : '▶ Ver estadísticas detalladas' }}
      </button>

      <!-- @defer — EstadisticasBibliotecaComponent se carga solo cuando mostrarStats() es true -->
      @defer (when mostrarStats()) {
        <app-estadisticas-biblioteca />
      } @loading (minimum 400ms) {
        <div class="loading-state">
          <div class="spinner"></div>
          <span>Cargando estadísticas...</span>
        </div>
      } @placeholder {
        <div class="placeholder-state">
          Las estadísticas se cargarán al hacer clic en el botón.
        </div>
      }
    </div>
  \`,
})
export class BibliotecaDeferComponent {
  readonly mostrarStats = signal(false);
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
    .app { background: #161B22; border: 1px solid #30363D; border-radius: 12px; padding: 1.5rem; width: 100%; max-width: 420px; }
    header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 1rem; }
    header h2 { font-size: 1rem; font-weight: 600; }
    .badge { background: #21262D; border: 1px solid #30363D; color: #8B949E; font-size: 0.75rem; padding: 0.2em 0.6em; border-radius: 20px; }
    .descripcion { font-size: 0.82rem; color: #8B949E; margin-bottom: 1rem; line-height: 1.5; }
    .toggle-btn { width: 100%; background: #8B5CF6; color: white; border: none; border-radius: 6px; padding: 0.6rem 1rem; font-size: 0.875rem; font-weight: 500; transition: opacity 150ms; margin-bottom: 1rem; text-align: left; }
    .toggle-btn:hover { opacity: 0.85; }
    .placeholder-state { background: #21262D; border: 1px dashed #30363D; border-radius: 8px; padding: 1rem 1.25rem; font-size: 0.82rem; color: #8B949E; text-align: center; }
    .loading-state { display: flex; align-items: center; gap: 0.75rem; background: #21262D; border: 1px solid #30363D; border-radius: 8px; padding: 1rem 1.25rem; font-size: 0.82rem; color: #8B949E; }
    .spinner { width: 18px; height: 18px; border: 2px solid #30363D; border-top-color: #8B5CF6; border-radius: 50%; animation: spin 0.7s linear infinite; flex-shrink: 0; }
    @keyframes spin { to { transform: rotate(360deg); } }
    .stats-panel { background: #21262D; border: 1px solid #30363D; border-radius: 8px; padding: 1.25rem; }
    .stats-panel h3 { font-size: 0.875rem; font-weight: 600; margin-bottom: 1rem; }
    .stats-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; }
    .stat-item { background: #161B22; border: 1px solid #30363D; border-radius: 6px; padding: 0.75rem; text-align: center; }
    .stat-val { display: block; font-size: 1.5rem; font-weight: 700; color: #8B5CF6; line-height: 1; }
    .stat-name { display: block; font-size: 0.7rem; color: #8B949E; margin-top: 0.25rem; }
  </style>
</head>
<body>
  <span class="component-label">app-biblioteca-defer</span>
  <div class="app">
    <header>
      <h2>📚 Mi Biblioteca</h2>
      <span class="badge">12 libros</span>
    </header>
    <p class="descripcion">El contenido principal carga inmediatamente. Las estadísticas detalladas se cargan solo cuando las necesitas.</p>
    <button class="toggle-btn" id="toggle">▶ Ver estadísticas detalladas</button>
    <div id="defer-content">
      <div class="placeholder-state">Las estadísticas se cargarán al hacer clic en el botón.</div>
    </div>
  </div>
  <script>
    let visible = false, loading = false;
    const btn = document.getElementById('toggle');
    const content = document.getElementById('defer-content');
    const statsHtml = '<div class="stats-panel"><h3>📊 Estadísticas detalladas</h3><div class="stats-grid"><div class="stat-item"><span class="stat-val">247</span><span class="stat-name">Libros totales</span></div><div class="stat-item"><span class="stat-val">89</span><span class="stat-name">Leídos este año</span></div><div class="stat-item"><span class="stat-val">34</span><span class="stat-name">Géneros</span></div><div class="stat-item"><span class="stat-val">12h</span><span class="stat-name">Tiempo medio</span></div></div></div>';
    btn.addEventListener('click', () => {
      if (loading) return;
      if (visible) {
        visible = false;
        btn.textContent = '▶ Ver estadísticas detalladas';
        content.innerHTML = '<div class="placeholder-state">Las estadísticas se cargarán al hacer clic en el botón.</div>';
      } else {
        loading = true;
        btn.textContent = '▼ Ocultar estadísticas';
        content.innerHTML = '<div class="loading-state"><div class="spinner"></div><span>Cargando estadísticas...</span></div>';
        setTimeout(() => { loading = false; visible = true; content.innerHTML = statsHtml; }, 420);
      }
    });
  </script>
</body>
</html>`,
    aiContext:
      'El usuario está terminando el módulo 3 sobre templates y directivas. Está aprendiendo @defer para carga diferida de componentes. AngularVerse usa @defer en el panel de chat. Puede preguntar sobre triggers (on idle, on viewport, on interaction), sobre code splitting, sobre @loading/@placeholder/@error, o sobre la diferencia con lazy loading de rutas.',
    introMessage:
      'Esta lección cierra el módulo de Templates y Directivas con `@defer` — la carga diferida nativa de Angular.\n\nEl componente de estadísticas solo se \'carga\' cuando pulsas el botón. En una app real, esto significa que su código JS no se descarga hasta que se necesita, reduciendo el bundle inicial.\n\nPregúntame sobre los triggers de @defer, sobre cómo funciona el bundle splitting, o sobre el uso de @defer en AngularVerse.',
    suggestedQuestions: [
      '¿@defer hace automáticamente code splitting?',
      '¿Puedo usar @defer con \'on viewport\' para imágenes y contenido below-the-fold?',
      '¿Cómo se diferencia @defer de lazy loading de rutas?',
    ],
  },
];
