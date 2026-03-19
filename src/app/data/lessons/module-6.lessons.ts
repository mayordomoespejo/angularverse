import type { Lesson } from '../../core/models/lesson.model';

export const MODULE_6_LESSONS: Lesson[] = [
  {
    id: 'L6.1',
    module: 6,
    moduleTitle: 'Formularios',
    title: 'Formularios Template-Driven: El enfoque declarativo',
    subtitle: 'FormsModule, ngModel y validación con atributos HTML',
    estimatedMinutes: 12,
    xpReward: 120,
    prerequisites: ['L5.5'],
    nextLesson: 'L6.2',
    language: 'typescript',
    narrative: [
      {
        type: 'text',
        content:
          'Los formularios template-driven son el enfoque "HTML first" de Angular. La lógica del formulario vive en el template, no en la clase TypeScript. Angular lee los atributos del HTML (`required`, `minlength`, `email`) y construye automáticamente un árbol de validación. Son ideales para formularios simples donde no necesitas un control fino sobre el estado.',
      },
      {
        type: 'tip',
        variant: 'info',
        content:
          '`FormsModule` debe estar en el array `imports` del componente standalone. Sin él, `ngModel` y las directivas de validación no existen y Angular ignorará silenciosamente tu template.',
      },
      {
        type: 'text',
        content:
          'La directiva `[(ngModel)]` establece two-way binding entre el campo del formulario y la propiedad del componente. La sintaxis de "banana in a box" `[()]` combina property binding (`[]`) para leer el valor y event binding `()` para escribirlo. La variable de template `#form="ngForm"` te da acceso al estado completo del formulario: `form.valid`, `form.dirty`, `form.touched`.',
      },
      {
        type: 'tip',
        variant: 'angular',
        content:
          'En Angular moderno, para formularios simples de búsqueda o filtros, los template-driven forms son perfectos. Para formularios con validación compleja, datos dinámicos o tests unitarios, prefiere Reactive Forms (L6.2).',
      },
      {
        type: 'comparison',
        leftLabel: 'Template-Driven',
        rightLabel: 'Reactive Forms',
        left: 'Lógica en el template HTML\nSimple, menos código\nDifícil de testear unitariamente\nIdeal para formularios simples',
        right: 'Lógica en TypeScript\nMás verboso, más control\nFácil de testear y depurar\nIdeal para formularios complejos',
      },
      {
        type: 'checkpoint',
        question: '¿Qué módulo necesitas importar para usar [(ngModel)] en un componente standalone?',
        options: ['ReactiveFormsModule', 'FormsModule', 'CommonModule', 'NgModel'],
        correct: 1,
        explanation:
          '`FormsModule` (de `@angular/forms`) provee `NgModel`, `NgForm` y todas las directivas de validación para template-driven forms. `ReactiveFormsModule` es para Reactive Forms. Ambos son módulos distintos que puedes importar de forma independiente.',
      },
    ],
    starterCode: `import { Component, signal, ChangeDetectionStrategy } from '@angular/core';
import { FormsModule } from '@angular/forms';

// 📚 Biblioteca Angular — Búsqueda con Template-Driven Form
// ngModel hace two-way binding entre el campo y la propiedad del componente

interface Libro {
  id: number;
  titulo: string;
  autor: string;
  genero: string;
}

@Component({
  selector: 'app-buscador-td',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule],
  template: \`
    <div class="buscador-container">
      <h2>Buscar en la Biblioteca</h2>

      <!-- #searchForm="ngForm" da acceso al estado del formulario -->
      <form #searchForm="ngForm" (ngSubmit)="onSubmit(searchForm.value)" class="search-form">

        <div class="field-group">
          <label for="termino">Término de búsqueda</label>
          <input
            id="termino"
            name="termino"
            type="text"
            [(ngModel)]="terminoBusqueda"
            placeholder="Título o autor..."
            minlength="2"
            #terminoCtrl="ngModel"
            class="input"
            [class.input-error]="terminoCtrl.invalid && terminoCtrl.touched"
          />
          @if (terminoCtrl.invalid && terminoCtrl.touched) {
            <span class="error-msg">Mínimo 2 caracteres</span>
          }
        </div>

        <div class="field-group">
          <label for="genero">Género</label>
          <select id="genero" name="genero" [(ngModel)]="generoFiltro" class="select">
            <option value="">Todos los géneros</option>
            <option value="Programación">Programación</option>
            <option value="Arquitectura">Arquitectura</option>
            <option value="Agilidad">Agilidad</option>
          </select>
        </div>

        <button type="submit" [disabled]="searchForm.invalid" class="btn-buscar">
          Buscar
        </button>
      </form>

      <div class="resultados">
        <p class="resultado-count">{{ resultados().length }} resultado(s)</p>
        @for (libro of resultados(); track libro.id) {
          <div class="libro-item">
            <strong>{{ libro.titulo }}</strong>
            <span>{{ libro.autor }}</span>
            <span class="tag">{{ libro.genero }}</span>
          </div>
        }
        @empty {
          <p class="empty">No hay resultados para tu búsqueda.</p>
        }
      </div>
    </div>
  \`,
})
export class BuscadorTDComponent {
  terminoBusqueda = '';
  generoFiltro = '';

  private readonly todosLosLibros: Libro[] = [
    { id: 1, titulo: 'Clean Code', autor: 'Robert C. Martin', genero: 'Programación' },
    { id: 2, titulo: 'The Pragmatic Programmer', autor: 'Hunt & Thomas', genero: 'Programación' },
    { id: 3, titulo: 'Clean Architecture', autor: 'Robert C. Martin', genero: 'Arquitectura' },
    { id: 4, titulo: 'Scrum: The Art of Doing Twice', autor: 'Jeff Sutherland', genero: 'Agilidad' },
    { id: 5, titulo: 'Refactoring', autor: 'Martin Fowler', genero: 'Programación' },
  ];

  readonly resultados = signal<Libro[]>(this.todosLosLibros);

  onSubmit(value: { termino: string; genero: string }): void {
    const termino = value.termino.toLowerCase();
    const genero = value.genero;

    this.resultados.set(
      this.todosLosLibros.filter(libro => {
        const matchTermino = !termino || libro.titulo.toLowerCase().includes(termino) || libro.autor.toLowerCase().includes(termino);
        const matchGenero = !genero || libro.genero === genero;
        return matchTermino && matchGenero;
      })
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
    button, select, input { font-family: 'Inter', sans-serif; }
    .buscador-container { background: #161B22; border: 1px solid #30363D; border-radius: 12px; padding: 1.75rem; width: 100%; max-width: 460px; }
    h2 { font-size: 1rem; font-weight: 600; margin-bottom: 1.5rem; }
    .search-form { display: flex; flex-direction: column; gap: 1rem; margin-bottom: 1.5rem; }
    .field-group { display: flex; flex-direction: column; gap: 0.35rem; }
    label { font-size: 0.78rem; font-weight: 500; color: #8B949E; }
    .input, .select { background: #0D1117; border: 1px solid #30363D; border-radius: 6px; padding: 0.55rem 0.875rem; color: #E6EDF3; font-size: 0.875rem; outline: none; width: 100%; transition: border-color 150ms; }
    .input:focus, .select:focus { border-color: #7C3AED; box-shadow: 0 0 0 3px rgba(124,58,237,0.15); }
    .input.error { border-color: #f87171; }
    .error-msg { font-size: 0.73rem; color: #f87171; }
    .btn-buscar { background: #7C3AED; color: white; border: none; border-radius: 6px; padding: 0.625rem 1.25rem; font-size: 0.875rem; font-weight: 500; cursor: pointer; transition: opacity 150ms; }
    .btn-buscar:hover:not(:disabled) { opacity: 0.85; }
    .btn-buscar:disabled { opacity: 0.4; cursor: not-allowed; }
    .resultado-count { font-size: 0.78rem; color: #8B949E; margin-bottom: 0.875rem; }
    .libro-item { display: flex; align-items: center; gap: 0.75rem; padding: 0.75rem 1rem; background: #21262D; border: 1px solid #30363D; border-radius: 8px; margin-bottom: 0.5rem; }
    .libro-item strong { flex: 1; font-size: 0.875rem; font-weight: 600; }
    .libro-item span { font-size: 0.78rem; color: #8B949E; }
    .tag { background: rgba(124,58,237,0.12); border: 1px solid rgba(124,58,237,0.3); color: #a78bfa; padding: 0.15em 0.5em; border-radius: 4px; font-size: 0.7rem !important; white-space: nowrap; }
    .empty { font-size: 0.85rem; color: #8B949E; text-align: center; padding: 1rem; }
    select option { background: #161B22; }
  </style>
</head>
<body>
  <span class="component-label">app-buscador-td</span>
  <div class="buscador-container">
    <h2>Buscar en la Biblioteca</h2>
    <form class="search-form" id="searchForm">
      <div class="field-group">
        <label for="termino">Término de búsqueda</label>
        <input id="termino" type="text" class="input" placeholder="Título o autor..." autocomplete="off" />
        <span class="error-msg" id="errMinlen" style="display:none">Mínimo 2 caracteres</span>
      </div>
      <div class="field-group">
        <label for="genero">Género</label>
        <select id="genero" class="select">
          <option value="">Todos los géneros</option>
          <option value="Programación">Programación</option>
          <option value="Arquitectura">Arquitectura</option>
          <option value="Agilidad">Agilidad</option>
        </select>
      </div>
      <button type="submit" class="btn-buscar" id="btnBuscar">Buscar</button>
    </form>
    <p class="resultado-count" id="count">5 resultado(s)</p>
    <div id="resultados"></div>
  </div>
  <script>
    const libros = [
      { id: 1, titulo: 'Clean Code', autor: 'Robert C. Martin', genero: 'Programación' },
      { id: 2, titulo: 'The Pragmatic Programmer', autor: 'Hunt & Thomas', genero: 'Programación' },
      { id: 3, titulo: 'Clean Architecture', autor: 'Robert C. Martin', genero: 'Arquitectura' },
      { id: 4, titulo: 'Scrum: The Art of Doing Twice', autor: 'Jeff Sutherland', genero: 'Agilidad' },
      { id: 5, titulo: 'Refactoring', autor: 'Martin Fowler', genero: 'Programación' },
    ];
    const inputEl = document.getElementById('termino');
    const generoEl = document.getElementById('genero');
    const errMinlen = document.getElementById('errMinlen');
    const btnBuscar = document.getElementById('btnBuscar');
    const countEl = document.getElementById('count');
    const resultadosEl = document.getElementById('resultados');

    function renderLibros(lista) {
      countEl.textContent = lista.length + ' resultado(s)';
      if (lista.length === 0) {
        resultadosEl.innerHTML = '<p class="empty">No hay resultados para tu búsqueda.</p>';
        return;
      }
      resultadosEl.innerHTML = lista.map(l =>
        '<div class="libro-item"><strong>' + l.titulo + '</strong><span>' + l.autor + '</span><span class="tag">' + l.genero + '</span></div>'
      ).join('');
    }

    inputEl.addEventListener('blur', () => {
      const val = inputEl.value;
      if (val.length > 0 && val.length < 2) {
        inputEl.classList.add('error');
        errMinlen.style.display = 'block';
        btnBuscar.disabled = true;
      } else {
        inputEl.classList.remove('error');
        errMinlen.style.display = 'none';
        btnBuscar.disabled = false;
      }
    });

    inputEl.addEventListener('input', () => {
      if (inputEl.value.length >= 2 || inputEl.value.length === 0) {
        inputEl.classList.remove('error');
        errMinlen.style.display = 'none';
        btnBuscar.disabled = false;
      }
    });

    document.getElementById('searchForm').addEventListener('submit', e => {
      e.preventDefault();
      const termino = inputEl.value.toLowerCase();
      const genero = generoEl.value;
      if (termino.length > 0 && termino.length < 2) return;
      const filtrados = libros.filter(l => {
        const matchT = !termino || l.titulo.toLowerCase().includes(termino) || l.autor.toLowerCase().includes(termino);
        const matchG = !genero || l.genero === genero;
        return matchT && matchG;
      });
      renderLibros(filtrados);
    });

    renderLibros(libros);
  </script>
</body>
</html>`,
    aiContext:
      'El usuario está aprendiendo formularios template-driven en Angular 19. Ha visto un buscador de biblioteca que usa FormsModule, [(ngModel)], validación con atributos HTML y #form="ngForm". Puede preguntar sobre la diferencia con Reactive Forms, sobre ngModelGroup, sobre cómo funciona el two-way binding internamente, o sobre cuándo usar cada enfoque.',
    introMessage:
      'En esta lección explorarás los formularios Template-Driven de Angular — el enfoque declarativo donde la lógica vive en el HTML.\n\nEl código muestra un buscador de libros con `[(ngModel)]` para two-way binding, validación con `minlength`, y acceso al estado del formulario con `#searchForm="ngForm"`.\n\nPregúntame sobre `FormsModule`, `ngModel`, validación nativa, o cuándo usar este enfoque frente a Reactive Forms.',
    suggestedQuestions: [
      '¿Cuándo debo usar template-driven forms en lugar de reactive forms?',
      '¿Cómo funciona [(ngModel)] internamente?',
      '¿Puedo mezclar template-driven con validadores personalizados?',
    ],
  },

  {
    id: 'L6.2',
    module: 6,
    moduleTitle: 'Formularios',
    title: 'Reactive Forms: control total con FormBuilder',
    subtitle: 'ReactiveFormsModule, inject(NonNullableFormBuilder) y formControlName',
    estimatedMinutes: 15,
    xpReward: 140,
    prerequisites: ['L6.1'],
    nextLesson: 'L6.3',
    language: 'typescript',
    narrative: [
      {
        type: 'text',
        content:
          'Los Reactive Forms modelan el formulario completamente en TypeScript. El objeto `FormGroup` es la fuente de verdad — el template simplemente se conecta a él. Esto hace que los formularios sean predecibles, fáciles de testear, y totalmente tipados. La clase `FormBuilder` (inyectable) te da una API fluida para construir grupos y controles sin verbosidad.',
      },
      {
        type: 'tip',
        variant: 'info',
        content:
          '`inject(NonNullableFormBuilder)` (en lugar de `inject(FormBuilder)`) crea controles que nunca son `null` — en `reset()`, los controles vuelven a su valor inicial, no a `null`. Es la opción recomendada en Angular moderno para formularios tipados.',
      },
      {
        type: 'text',
        content:
          'La directiva `formControlName="campo"` en el template conecta un input HTML con el `FormControl` del mismo nombre dentro del `FormGroup`. La directiva `[formGroup]="form"` en el `<form>` establece el grupo de contexto. Nunca uses `[(ngModel)]` mezclado con Reactive Forms — son dos sistemas mutuamente excluyentes.',
      },
      {
        type: 'tip',
        variant: 'angular',
        content:
          '`form.get(\'campo\')?.errors` da acceso directo a los errores de un control. Combínalo con el estado `touched` o `dirty` para mostrar mensajes solo después de que el usuario haya interactuado con el campo: `form.get(\'campo\')?.invalid && form.get(\'campo\')?.touched`.',
      },
      {
        type: 'checkpoint',
        question: '¿Qué directiva conecta un <input> con un FormControl dentro de un FormGroup?',
        options: ['[formControl]', 'formControlName', '[(ngModel)]', '[formGroup]'],
        correct: 1,
        explanation:
          '`formControlName="nombreCampo"` (sin corchetes — es una string estática) conecta el input con el `FormControl` del mismo nombre dentro del `FormGroup` contexto establecido por `[formGroup]="miForm"`. `[formControl]` se usa para enlazar un `FormControl` directamente sin `FormGroup`.',
      },
    ],
    starterCode: `import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

// 📚 Biblioteca Angular — Añadir libro con Reactive Form
// FormBuilder construye el FormGroup tipado en TypeScript
// El template solo se conecta con formControlName

@Component({
  selector: 'app-anadir-libro',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule],
  template: \`
    <div class="form-container">
      <h2>Añadir Libro</h2>

      <form [formGroup]="form" (ngSubmit)="onSubmit()" class="libro-form">

        <div class="field-group">
          <label for="titulo">Título *</label>
          <input id="titulo" type="text" formControlName="titulo" class="input"
            [class.input-error]="isInvalid('titulo')" placeholder="Título del libro" />
          @if (isInvalid('titulo')) {
            <span class="error-msg">{{ getError('titulo') }}</span>
          }
        </div>

        <div class="field-group">
          <label for="autor">Autor *</label>
          <input id="autor" type="text" formControlName="autor" class="input"
            [class.input-error]="isInvalid('autor')" placeholder="Nombre del autor" />
          @if (isInvalid('autor')) {
            <span class="error-msg">{{ getError('autor') }}</span>
          }
        </div>

        <div class="row-2">
          <div class="field-group">
            <label for="anio">Año *</label>
            <input id="anio" type="number" formControlName="anio" class="input"
              [class.input-error]="isInvalid('anio')" placeholder="2024" />
            @if (isInvalid('anio')) {
              <span class="error-msg">Año inválido</span>
            }
          </div>

          <div class="field-group">
            <label for="genero">Género *</label>
            <select id="genero" formControlName="genero" class="select"
              [class.input-error]="isInvalid('genero')">
              <option value="">Selecciona...</option>
              <option value="Programación">Programación</option>
              <option value="Arquitectura">Arquitectura</option>
              <option value="Agilidad">Agilidad</option>
              <option value="Diseño">Diseño</option>
            </select>
          </div>
        </div>

        <div class="field-group">
          <label for="descripcion">Descripción</label>
          <textarea id="descripcion" formControlName="descripcion" class="textarea"
            placeholder="Breve descripción del libro..." rows="3"></textarea>
        </div>

        <div class="form-actions">
          <button type="button" (click)="onReset()" class="btn-reset">Limpiar</button>
          <button type="submit" [disabled]="form.invalid" class="btn-submit">
            Añadir libro
          </button>
        </div>

        @if (enviado()) {
          <div class="success-msg">
            ✓ Libro "{{ form.value.titulo }}" añadido correctamente.
          </div>
        }
      </form>
    </div>
  \`,
})
export class AnadirLibroComponent {
  private readonly fb = inject(NonNullableFormBuilder);

  // FormGroup tipado — la fuente de verdad del formulario
  readonly form = this.fb.group({
    titulo: ['', [Validators.required, Validators.minLength(3)]],
    autor: ['', [Validators.required, Validators.minLength(3)]],
    anio: [new Date().getFullYear(), [Validators.required, Validators.min(1900), Validators.max(2099)]],
    genero: ['', Validators.required],
    descripcion: [''],
  });

  enviado = () => false; // señal local simplificada
  private _enviado = false;

  isInvalid(campo: string): boolean {
    const ctrl = this.form.get(campo);
    return !!(ctrl?.invalid && ctrl?.touched);
  }

  getError(campo: string): string {
    const errors = this.form.get(campo)?.errors;
    if (!errors) return '';
    if (errors['required']) return 'Este campo es obligatorio';
    if (errors['minlength']) return \`Mínimo \${errors['minlength'].requiredLength} caracteres\`;
    return 'Campo inválido';
  }

  onSubmit(): void {
    if (this.form.valid) {
      console.log('Nuevo libro:', this.form.value);
      this._enviado = true;
      // en una app real: servicio.agregarLibro(this.form.getRawValue())
    }
  }

  onReset(): void {
    this.form.reset();
    this._enviado = false;
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
    button, select, input, textarea { font-family: 'Inter', sans-serif; }
    .form-container { background: #161B22; border: 1px solid #30363D; border-radius: 12px; padding: 1.75rem; width: 100%; max-width: 480px; }
    h2 { font-size: 1rem; font-weight: 600; margin-bottom: 1.5rem; }
    .libro-form { display: flex; flex-direction: column; gap: 1rem; }
    .field-group { display: flex; flex-direction: column; gap: 0.35rem; }
    .row-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
    label { font-size: 0.775rem; font-weight: 500; color: #8B949E; }
    .input, .select, .textarea { background: #0D1117; border: 1px solid #30363D; border-radius: 6px; padding: 0.55rem 0.875rem; color: #E6EDF3; font-size: 0.875rem; outline: none; width: 100%; transition: border-color 150ms, box-shadow 150ms; }
    .input:focus, .select:focus, .textarea:focus { border-color: #7C3AED; box-shadow: 0 0 0 3px rgba(124,58,237,0.15); }
    .input.error, .select.error { border-color: #f87171; }
    .input.valid, .select.valid { border-color: #34d399; }
    .textarea { resize: vertical; }
    .error-msg { font-size: 0.73rem; color: #f87171; }
    .form-actions { display: flex; gap: 0.75rem; margin-top: 0.5rem; }
    .btn-reset { flex: 0 0 auto; background: transparent; border: 1px solid #30363D; color: #8B949E; border-radius: 6px; padding: 0.6rem 1.25rem; font-size: 0.875rem; cursor: pointer; transition: border-color 150ms, color 150ms; }
    .btn-reset:hover { border-color: #8B949E; color: #E6EDF3; }
    .btn-submit { flex: 1; background: #7C3AED; color: white; border: none; border-radius: 6px; padding: 0.6rem 1.25rem; font-size: 0.875rem; font-weight: 500; cursor: pointer; transition: opacity 150ms; }
    .btn-submit:hover:not(:disabled) { opacity: 0.85; }
    .btn-submit:disabled { opacity: 0.4; cursor: not-allowed; }
    .success-msg { background: rgba(52,211,153,0.1); border: 1px solid rgba(52,211,153,0.3); color: #34d399; border-radius: 8px; padding: 0.75rem 1rem; font-size: 0.85rem; text-align: center; }
    select option { background: #161B22; }
  </style>
</head>
<body>
  <span class="component-label">app-anadir-libro</span>
  <div class="form-container">
    <h2>Añadir Libro</h2>
    <form class="libro-form" id="libroForm" novalidate>
      <div class="field-group">
        <label>Título *</label>
        <input id="titulo" type="text" class="input" placeholder="Título del libro" autocomplete="off" />
        <span class="error-msg" id="err-titulo" style="display:none"></span>
      </div>
      <div class="field-group">
        <label>Autor *</label>
        <input id="autor" type="text" class="input" placeholder="Nombre del autor" autocomplete="off" />
        <span class="error-msg" id="err-autor" style="display:none"></span>
      </div>
      <div class="row-2">
        <div class="field-group">
          <label>Año *</label>
          <input id="anio" type="number" class="input" value="2024" min="1900" max="2099" />
          <span class="error-msg" id="err-anio" style="display:none">Año inválido</span>
        </div>
        <div class="field-group">
          <label>Género *</label>
          <select id="genero" class="select">
            <option value="">Selecciona...</option>
            <option>Programación</option>
            <option>Arquitectura</option>
            <option>Agilidad</option>
            <option>Diseño</option>
          </select>
          <span class="error-msg" id="err-genero" style="display:none">Obligatorio</span>
        </div>
      </div>
      <div class="field-group">
        <label>Descripción</label>
        <textarea id="descripcion" class="textarea" placeholder="Breve descripción del libro..." rows="3"></textarea>
      </div>
      <div class="form-actions">
        <button type="button" class="btn-reset" id="btnReset">Limpiar</button>
        <button type="submit" class="btn-submit" id="btnSubmit" disabled>Añadir libro</button>
      </div>
      <div class="success-msg" id="successMsg" style="display:none"></div>
    </form>
  </div>
  <script>
    const fields = {
      titulo: { el: document.getElementById('titulo'), err: document.getElementById('err-titulo'), min: 3 },
      autor: { el: document.getElementById('autor'), err: document.getElementById('err-autor'), min: 3 },
      anio: { el: document.getElementById('anio'), err: document.getElementById('err-anio'), type: 'number' },
      genero: { el: document.getElementById('genero'), err: document.getElementById('err-genero'), type: 'select' },
    };
    const btnSubmit = document.getElementById('btnSubmit');
    const successMsg = document.getElementById('successMsg');

    function validateField(key) {
      const f = fields[key];
      const val = f.el.value;
      let valid = true;
      let msg = '';
      if (f.type === 'number') {
        const n = parseInt(val);
        valid = !isNaN(n) && n >= 1900 && n <= 2099;
      } else if (f.type === 'select') {
        valid = val !== '';
      } else {
        if (!val) { valid = false; msg = 'Este campo es obligatorio'; }
        else if (val.length < f.min) { valid = false; msg = 'Minimo ' + f.min + ' caracteres'; }
      }
      f.err.textContent = msg || (valid ? '' : 'Campo invalido');
      f.err.style.display = valid ? 'none' : 'block';
      f.el.className = 'input ' + (f.type === 'select' ? 'select ' : '') + (valid && val ? 'valid' : (val ? 'error' : ''));
      return valid;
    }

    function checkForm() {
      const allValid = Object.keys(fields).every(k => {
        const f = fields[k];
        const val = f.el.value;
        if (f.type === 'number') { const n = parseInt(val); return !isNaN(n) && n >= 1900 && n <= 2099; }
        if (f.type === 'select') return val !== '';
        return val.length >= (f.min || 1);
      });
      btnSubmit.disabled = !allValid;
    }

    Object.keys(fields).forEach(k => {
      fields[k].el.addEventListener('blur', () => validateField(k));
      fields[k].el.addEventListener('input', () => { validateField(k); checkForm(); successMsg.style.display = 'none'; });
    });

    document.getElementById('libroForm').addEventListener('submit', e => {
      e.preventDefault();
      Object.keys(fields).forEach(k => validateField(k));
      checkForm();
      if (!btnSubmit.disabled) {
        successMsg.textContent = 'Libro "' + fields.titulo.el.value + '" anadido correctamente.';
        successMsg.style.display = 'block';
      }
    });

    document.getElementById('btnReset').addEventListener('click', () => {
      Object.keys(fields).forEach(k => {
        fields[k].el.value = k === 'anio' ? '2024' : '';
        fields[k].err.style.display = 'none';
        fields[k].el.className = k === 'select' ? 'select' : 'input';
      });
      btnSubmit.disabled = true;
      successMsg.style.display = 'none';
    });
  </script>
</body>
</html>`,
    aiContext:
      'El usuario está aprendiendo Reactive Forms en Angular 19. Ha visto un formulario de añadir libros con NonNullableFormBuilder, Validators, formControlName, y manejo de errores con form.get().errors. Puede preguntar sobre la diferencia entre FormBuilder y NonNullableFormBuilder, sobre getRawValue vs value, sobre cómo estructurar validadores, o sobre FormControl<T> tipado.',
    introMessage:
      'Esta lección introduce los Reactive Forms — el enfoque donde el formulario se construye completamente en TypeScript.\n\nEl formulario de "Añadir libro" usa `inject(NonNullableFormBuilder)` para crear el `FormGroup`, `formControlName` para conectar los inputs, y `Validators` integrados para validación. Observa cómo los mensajes de error leen directamente `form.get(\'campo\')?.errors`.\n\nPregúntame sobre `FormBuilder`, `NonNullableFormBuilder`, `Validators`, o cómo tipado funciona en formularios reactivos.',
    suggestedQuestions: [
      '¿Cuál es la diferencia entre FormBuilder y NonNullableFormBuilder?',
      '¿Cómo accedo al valor tipado del formulario con getRawValue()?',
      '¿Puedo usar ReactiveFormsModule y FormsModule en el mismo componente?',
    ],
  },

  {
    id: 'L6.3',
    module: 6,
    moduleTitle: 'Formularios',
    title: 'Validación avanzada: Validators y errores personalizados',
    subtitle: 'ValidatorFn, validadores cross-field y async validators',
    estimatedMinutes: 18,
    xpReward: 150,
    prerequisites: ['L6.2'],
    nextLesson: 'L6.4',
    language: 'typescript',
    narrative: [
      {
        type: 'text',
        content:
          'Los validadores integrados (`required`, `email`, `minLength`) cubren los casos básicos, pero las reglas de negocio reales son más complejas: contraseñas que deben coincidir, ISBN únicos, usernames disponibles. Angular te permite crear cualquier validador con una función pura `ValidatorFn = (control: AbstractControl) => ValidationErrors | null`.',
      },
      {
        type: 'tip',
        variant: 'info',
        content:
          'Los validadores a nivel de `FormGroup` (cross-field) reciben el grupo entero como control. Desde ahí puedes acceder a `group.get(\'campo1\')` y `group.get(\'campo2\')` para comparar campos entre sí. El error se pone en el grupo, no en el control individual.',
      },
      {
        type: 'text',
        content:
          'Los validadores asíncronos (`AsyncValidatorFn`) son perfectos para verificar unicidad contra un servidor. Devuelven `Observable<ValidationErrors | null>` o `Promise<ValidationErrors | null>`. Mientras esperan, el control entra en estado `PENDING`. Angular ejecuta los async validators solo si los síncronos pasan — optimización inteligente para no disparar llamadas HTTP con datos inválidos.',
      },
      {
        type: 'tip',
        variant: 'angular',
        content:
          '`toSignal(form.statusChanges)` convierte el observable de estado del formulario en un signal. El estado puede ser `\'VALID\'`, `\'INVALID\'`, `\'PENDING\'` (validación async en curso) o `\'DISABLED\'`. Úsalo para mostrar spinners durante la validación asíncrona.',
      },
      {
        type: 'checkpoint',
        question: '¿Dónde debes colocar un validador cross-field que compara "password" y "confirmPassword"?',
        options: [
          'En el FormControl de "password"',
          'En el FormControl de "confirmPassword"',
          'En el FormGroup que contiene ambos campos',
          'En el constructor del componente',
        ],
        correct: 2,
        explanation:
          'Los validadores cross-field se colocan a nivel del `FormGroup` porque necesitan acceder a múltiples controles. El `FormGroup` pasa al validador como `AbstractControl`, y desde ahí accedes a los controles hijos con `.get(\'nombre\')`. El error resultante se almacena en `form.errors`, no en un control individual.',
      },
    ],
    starterCode: `import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import {
  NonNullableFormBuilder, ReactiveFormsModule, Validators,
  AbstractControl, ValidationErrors, ValidatorFn, AsyncValidatorFn,
} from '@angular/forms';
import { Observable, of, delay } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';

// 📚 Biblioteca Angular — Validación avanzada
// ValidatorFn, validadores cross-field y AsyncValidatorFn

// Validador personalizado: password segura (mayúscula + número)
const passwordSeguraValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const value = control.value as string;
  if (!value) return null;
  const tieneMayuscula = /[A-Z]/.test(value);
  const tieneNumero = /[0-9]/.test(value);
  return tieneMayuscula && tieneNumero ? null : { passwordDebil: true };
};

// Validador cross-field: las contraseñas deben coincidir
const passwordsCoincidentesValidator: ValidatorFn = (group: AbstractControl): ValidationErrors | null => {
  const pass = group.get('password')?.value;
  const confirm = group.get('confirmPassword')?.value;
  return pass === confirm ? null : { passwordsNoCoinciden: true };
};

// Validador asíncrono: simula verificación de email único en servidor
const emailUnicoValidator: AsyncValidatorFn = (control: AbstractControl): Observable<ValidationErrors | null> => {
  const emailsExistentes = ['usuario@ejemplo.com', 'admin@biblioteca.com'];
  const existe = emailsExistentes.includes(control.value);
  return of(existe ? { emailOcupado: true } : null).pipe(delay(800));
};

@Component({
  selector: 'app-registro-biblioteca',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule],
  template: \`
    <div class="form-container">
      <h2>Crear cuenta — Biblioteca</h2>
      <p class="estado-form">Estado: <span [class]="'badge-' + estadoForm()">{{ estadoForm() }}</span></p>

      <form [formGroup]="form" (ngSubmit)="onSubmit()" class="registro-form">

        <div class="field-group">
          <label>Email *</label>
          <input type="email" formControlName="email" class="input"
            [class.input-error]="isInvalid('email')"
            [class.input-pending]="isPending('email')"
            [class.input-valid]="isValid('email')"
            placeholder="tu@email.com" />
          @if (isPending('email')) { <span class="pending-msg">Verificando disponibilidad...</span> }
          @if (isInvalid('email')) {
            @if (getError('email', 'required')) { <span class="error-msg">Email obligatorio</span> }
            @if (getError('email', 'email')) { <span class="error-msg">Formato de email inválido</span> }
            @if (getError('email', 'emailOcupado')) { <span class="error-msg">Este email ya está en uso</span> }
          }
        </div>

        <div formGroupName="credenciales">
          <div class="field-group">
            <label>Contraseña *</label>
            <input type="password" formControlName="password" class="input"
              [class.input-error]="isInvalid('credenciales.password')"
              [class.input-valid]="isValid('credenciales.password')"
              placeholder="Mínimo 8 caracteres" />
            @if (isInvalid('credenciales.password')) {
              @if (getError('credenciales.password', 'required')) { <span class="error-msg">Contraseña obligatoria</span> }
              @if (getError('credenciales.password', 'minlength')) { <span class="error-msg">Mínimo 8 caracteres</span> }
              @if (getError('credenciales.password', 'passwordDebil')) { <span class="error-msg">Necesita mayúscula y número</span> }
            }
          </div>

          <div class="field-group" style="margin-top: 1rem">
            <label>Confirmar contraseña *</label>
            <input type="password" formControlName="confirmPassword" class="input"
              [class.input-error]="isInvalid('credenciales.confirmPassword') || hasGroupError('credenciales', 'passwordsNoCoinciden')"
              [class.input-valid]="isValid('credenciales.confirmPassword') && !hasGroupError('credenciales', 'passwordsNoCoinciden')"
              placeholder="Repite la contraseña" />
            @if (hasGroupError('credenciales', 'passwordsNoCoinciden')) {
              <span class="error-msg">Las contraseñas no coinciden</span>
            }
          </div>
        </div>

        <button type="submit" [disabled]="form.invalid || form.pending" class="btn-submit">
          {{ form.pending ? 'Verificando...' : 'Crear cuenta' }}
        </button>

        @if (registrado()) {
          <div class="success-msg">✓ Cuenta creada con éxito para {{ form.get('email')?.value }}</div>
        }
      </form>
    </div>
  \`,
})
export class RegistroBibliotecaComponent {
  private readonly fb = inject(NonNullableFormBuilder);

  readonly form = this.fb.group({
    email: ['', { validators: [Validators.required, Validators.email], asyncValidators: [emailUnicoValidator], updateOn: 'blur' }],
    credenciales: this.fb.group(
      {
        password: ['', [Validators.required, Validators.minLength(8), passwordSeguraValidator]],
        confirmPassword: ['', Validators.required],
      },
      { validators: [passwordsCoincidentesValidator] }
    ),
  });

  // Convierte el observable de estado en signal para usar en el template
  readonly estadoForm = toSignal(this.form.statusChanges, { initialValue: 'INVALID' });

  private _registrado = false;
  registrado = () => this._registrado;

  isInvalid(path: string): boolean {
    const ctrl = this.form.get(path);
    return !!(ctrl?.invalid && ctrl?.touched);
  }

  isValid(path: string): boolean {
    const ctrl = this.form.get(path);
    return !!(ctrl?.valid && ctrl?.touched);
  }

  isPending(path: string): boolean {
    return this.form.get(path)?.pending ?? false;
  }

  getError(path: string, error: string): boolean {
    return !!this.form.get(path)?.hasError(error);
  }

  hasGroupError(groupPath: string, error: string): boolean {
    const group = this.form.get(groupPath);
    return !!(group?.hasError(error) && group?.touched);
  }

  onSubmit(): void {
    if (this.form.valid) {
      this._registrado = true;
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
    button, input { font-family: 'Inter', sans-serif; }
    .form-container { background: #161B22; border: 1px solid #30363D; border-radius: 12px; padding: 1.75rem; width: 100%; max-width: 420px; }
    h2 { font-size: 1rem; font-weight: 600; margin-bottom: 0.5rem; }
    .estado-form { font-size: 0.775rem; color: #8B949E; margin-bottom: 1.5rem; display: flex; align-items: center; gap: 0.5rem; }
    .badge { font-size: 0.7rem; font-weight: 600; padding: 0.2em 0.6em; border-radius: 4px; font-family: 'JetBrains Mono', monospace; }
    .badge-VALID { background: rgba(52,211,153,0.15); color: #34d399; border: 1px solid rgba(52,211,153,0.3); }
    .badge-INVALID { background: rgba(248,113,113,0.1); color: #f87171; border: 1px solid rgba(248,113,113,0.25); }
    .badge-PENDING { background: rgba(251,191,36,0.1); color: #fbbf24; border: 1px solid rgba(251,191,36,0.25); }
    .registro-form { display: flex; flex-direction: column; gap: 1rem; }
    .field-group { display: flex; flex-direction: column; gap: 0.35rem; }
    label { font-size: 0.775rem; font-weight: 500; color: #8B949E; }
    .input { background: #0D1117; border: 1px solid #30363D; border-radius: 6px; padding: 0.55rem 0.875rem; color: #E6EDF3; font-size: 0.875rem; outline: none; width: 100%; transition: border-color 150ms, box-shadow 150ms; }
    .input:focus { border-color: #7C3AED; box-shadow: 0 0 0 3px rgba(124,58,237,0.15); }
    .input.error { border-color: #f87171; }
    .input.valid { border-color: #34d399; }
    .input.pending { border-color: #fbbf24; }
    .error-msg { font-size: 0.73rem; color: #f87171; }
    .pending-msg { font-size: 0.73rem; color: #fbbf24; }
    .separator { height: 1px; background: #21262D; margin: 0.5rem 0; }
    .nested-label { font-size: 0.7rem; font-weight: 600; color: #7C3AED; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.5rem; }
    .btn-submit { background: #7C3AED; color: white; border: none; border-radius: 6px; padding: 0.65rem 1.25rem; font-size: 0.875rem; font-weight: 500; cursor: pointer; transition: opacity 150ms; margin-top: 0.5rem; width: 100%; }
    .btn-submit:hover:not(:disabled) { opacity: 0.85; }
    .btn-submit:disabled { opacity: 0.4; cursor: not-allowed; }
    .success-msg { background: rgba(52,211,153,0.1); border: 1px solid rgba(52,211,153,0.3); color: #34d399; border-radius: 8px; padding: 0.75rem 1rem; font-size: 0.85rem; text-align: center; }
    .hint { font-size: 0.73rem; color: #8B949E; margin-top: 0.25rem; }
  </style>
</head>
<body>
  <span class="component-label">app-registro-biblioteca</span>
  <div class="form-container">
    <h2>Crear cuenta — Biblioteca</h2>
    <p class="estado-form">Estado: <span id="estadoBadge" class="badge badge-INVALID">INVALID</span></p>
    <form class="registro-form" id="regForm" novalidate>
      <div class="field-group">
        <label>Email *</label>
        <input id="email" type="email" class="input" placeholder="tu@email.com" autocomplete="off" />
        <span id="emailHint" class="hint">Prueba: usuario@ejemplo.com (ya existe)</span>
        <span id="emailPending" class="pending-msg" style="display:none">Verificando disponibilidad...</span>
        <span id="emailErr" class="error-msg" style="display:none"></span>
      </div>
      <div class="separator"></div>
      <p class="nested-label">formGroupName="credenciales"</p>
      <div class="field-group">
        <label>Contraseña *</label>
        <input id="password" type="password" class="input" placeholder="Min. 8 chars, mayuscula y numero" />
        <span id="passErr" class="error-msg" style="display:none"></span>
      </div>
      <div class="field-group">
        <label>Confirmar contraseña *</label>
        <input id="confirmPass" type="password" class="input" placeholder="Repite la contrasena" />
        <span id="confirmErr" class="error-msg" style="display:none"></span>
      </div>
      <button type="submit" class="btn-submit" id="btnReg" disabled>Crear cuenta</button>
      <div id="successMsg" class="success-msg" style="display:none"></div>
    </form>
  </div>
  <script>
    const emailsExistentes = ['usuario@ejemplo.com', 'admin@biblioteca.com'];
    let emailValid = false, passValid = false, confirmValid = false, emailPendingTimeout = null;
    const emailEl = document.getElementById('email');
    const passEl = document.getElementById('password');
    const confirmEl = document.getElementById('confirmPass');
    const btnReg = document.getElementById('btnReg');
    const badgeEl = document.getElementById('estadoBadge');

    function updateBadge() {
      const allValid = emailValid && passValid && confirmValid;
      const anyPending = emailPendingTimeout !== null;
      const state = anyPending ? 'PENDING' : (allValid ? 'VALID' : 'INVALID');
      badgeEl.textContent = state;
      badgeEl.className = 'badge badge-' + state;
      btnReg.disabled = !allValid || anyPending;
      btnReg.textContent = anyPending ? 'Verificando...' : 'Crear cuenta';
    }

    function setFieldState(el, state) {
      el.className = 'input ' + (state === 'valid' ? 'valid' : state === 'error' ? 'error' : state === 'pending' ? 'pending' : '');
    }

    emailEl.addEventListener('blur', () => {
      const val = emailEl.value;
      const errEl = document.getElementById('emailErr');
      const pendingEl = document.getElementById('emailPending');
      document.getElementById('emailHint').style.display = 'none';
      if (!val) { errEl.textContent = 'Email obligatorio'; errEl.style.display = 'block'; setFieldState(emailEl, 'error'); emailValid = false; updateBadge(); return; }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) { errEl.textContent = 'Formato invalido'; errEl.style.display = 'block'; setFieldState(emailEl, 'error'); emailValid = false; updateBadge(); return; }
      errEl.style.display = 'none';
      pendingEl.style.display = 'block';
      setFieldState(emailEl, 'pending');
      if (emailPendingTimeout) clearTimeout(emailPendingTimeout);
      emailPendingTimeout = setTimeout(() => {
        emailPendingTimeout = null;
        pendingEl.style.display = 'none';
        if (emailsExistentes.includes(val)) {
          errEl.textContent = 'Este email ya esta en uso';
          errEl.style.display = 'block';
          setFieldState(emailEl, 'error');
          emailValid = false;
        } else {
          setFieldState(emailEl, 'valid');
          emailValid = true;
        }
        updateBadge();
      }, 900);
      updateBadge();
    });

    passEl.addEventListener('input', () => {
      const val = passEl.value;
      const errEl = document.getElementById('passErr');
      if (!val) { errEl.style.display = 'none'; setFieldState(passEl, ''); passValid = false; }
      else if (val.length < 8) { errEl.textContent = 'Minimo 8 caracteres'; errEl.style.display = 'block'; setFieldState(passEl, 'error'); passValid = false; }
      else if (!/[A-Z]/.test(val) || !/[0-9]/.test(val)) { errEl.textContent = 'Necesita mayuscula y numero'; errEl.style.display = 'block'; setFieldState(passEl, 'error'); passValid = false; }
      else { errEl.style.display = 'none'; setFieldState(passEl, 'valid'); passValid = true; }
      validateConfirm();
      updateBadge();
    });

    function validateConfirm() {
      const val = confirmEl.value;
      const errEl = document.getElementById('confirmErr');
      if (!val) { errEl.style.display = 'none'; setFieldState(confirmEl, ''); confirmValid = false; }
      else if (val !== passEl.value) { errEl.textContent = 'Las contrasenas no coinciden'; errEl.style.display = 'block'; setFieldState(confirmEl, 'error'); confirmValid = false; }
      else { errEl.style.display = 'none'; setFieldState(confirmEl, 'valid'); confirmValid = true; }
      updateBadge();
    }
    confirmEl.addEventListener('input', validateConfirm);

    document.getElementById('regForm').addEventListener('submit', e => {
      e.preventDefault();
      if (emailValid && passValid && confirmValid) {
        document.getElementById('successMsg').textContent = 'Cuenta creada con exito para ' + emailEl.value;
        document.getElementById('successMsg').style.display = 'block';
        btnReg.disabled = true;
      }
    });
    updateBadge();
  </script>
</body>
</html>`,
    aiContext:
      'El usuario está aprendiendo validación avanzada en Angular 19: ValidatorFn, validadores cross-field en FormGroup, AsyncValidatorFn con Observable, y toSignal(form.statusChanges). Ha visto un formulario de registro con email único asíncrono y validación de coincidencia de contraseñas. Puede preguntar sobre cómo componer validadores, sobre el estado PENDING, sobre updateOn, o sobre cómo acceder a errores del grupo vs del control.',
    introMessage:
      'Esta lección lleva los Reactive Forms al siguiente nivel: validadores personalizados, validación cross-field, y validadores asíncronos.\n\nEl formulario de registro implementa tres patrones avanzados: un `ValidatorFn` para contraseñas seguras, un validador de grupo para confirmar que las contraseñas coinciden, y un `AsyncValidatorFn` que simula verificación de email contra un servidor.\n\nPregúntame sobre `ValidatorFn`, validadores cross-field, `AsyncValidatorFn`, o el estado `PENDING`.',
    suggestedQuestions: [
      '¿Cómo creo un validador que compara dos campos de un mismo formulario?',
      '¿Qué es el estado PENDING en un FormControl?',
      '¿Cómo evito que el validador asíncrono se dispare en cada tecla?',
    ],
  },

  {
    id: 'L6.4',
    module: 6,
    moduleTitle: 'Formularios',
    title: 'FormArray: formularios dinámicos',
    subtitle: 'fb.array(), push(), removeAt() e iteración con controls',
    estimatedMinutes: 15,
    xpReward: 150,
    prerequisites: ['L6.3'],
    nextLesson: 'L6.5',
    language: 'typescript',
    narrative: [
      {
        type: 'text',
        content:
          'Un `FormArray` es un contenedor ordenado de controles cuya longitud puede cambiar en tiempo de ejecución. Es la solución perfecta para listas dinámicas: géneros/tags de un libro, autores múltiples, líneas de factura, o cualquier colección donde el usuario puede añadir y eliminar filas. A diferencia de `FormGroup`, los controles se identifican por índice, no por nombre.',
      },
      {
        type: 'tip',
        variant: 'info',
        content:
          '`this.form.get(\'tags\') as FormArray` da acceso al array. Usa `.push(control)` para añadir, `.removeAt(index)` para eliminar, y `.controls` para iterar. En el template, `formArrayName="tags"` establece el contexto y `[formControlName]="i"` conecta cada control por su índice.',
      },
      {
        type: 'text',
        content:
          'Para leer todos los valores del array como un array tipado, usa `this.tagsArray.controls.map(c => c.value)` o simplemente `this.form.value.tags` si el FormArray contiene FormControls simples. Para validación de cada ítem, pasa los validators al `fb.control()` dentro del `.push()` — así cada campo tiene su propia validación independiente.',
      },
      {
        type: 'tip',
        variant: 'angular',
        content:
          'Siempre añade `track` en el `@for` sobre controles de un FormArray: `@for (ctrl of tagsArray.controls; track $index)`. El índice es el identificador estable porque los controles no tienen ids propios.',
      },
      {
        type: 'checkpoint',
        question: '¿Cómo iteras los controles de un FormArray en el template?',
        options: [
          '@for (item of form.value.tags; track item)',
          '@for (ctrl of tagsArray.controls; track $index)',
          '@for (ctrl of tagsArray; track $index)',
          'ngFor con formArrayName',
        ],
        correct: 1,
        explanation:
          'Accedes a los controles con `.controls` sobre el `FormArray` (que debes exponer desde el componente): `@for (ctrl of tagsArray.controls; track $index)`. Dentro del bucle, usas `[formControlName]="$index"` para conectar cada control con su índice. `form.value.tags` daría los valores primitivos, no los controles de Angular.',
      },
    ],
    starterCode: `import { Component, inject, signal, computed, ChangeDetectionStrategy } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators, FormArray, FormControl } from '@angular/forms';

// 📚 Biblioteca Angular — FormArray: géneros dinámicos
// FormArray permite añadir y eliminar campos en tiempo de ejecución

@Component({
  selector: 'app-libro-generos',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule],
  template: \`
    <div class="form-container">
      <h2>Añadir Libro con Géneros</h2>

      <form [formGroup]="form" (ngSubmit)="onSubmit()" class="libro-form">

        <div class="field-group">
          <label>Título *</label>
          <input type="text" formControlName="titulo" class="input" placeholder="Título del libro" />
        </div>

        <div class="field-group">
          <label>Autor *</label>
          <input type="text" formControlName="autor" class="input" placeholder="Nombre del autor" />
        </div>

        <!-- FormArray de géneros -->
        <div class="array-section">
          <div class="array-header">
            <label>Géneros</label>
            <button type="button" (click)="agregarGenero()" class="btn-add" [disabled]="generosArray.length >= 5">
              + Añadir género
            </button>
          </div>

          <div formArrayName="generos" class="tags-list">
            @for (ctrl of generosArray.controls; track $index) {
              <div class="tag-row">
                <input
                  [formControlName]="$index"
                  type="text"
                  class="input input-tag"
                  [class.input-error]="ctrl.invalid && ctrl.touched"
                  placeholder="Ej: Programación"
                />
                <button type="button" (click)="eliminarGenero($index)" class="btn-remove" [disabled]="generosArray.length <= 1">
                  ✕
                </button>
              </div>
            }
          </div>

          <p class="array-hint">{{ generosArray.length }}/5 géneros · Mínimo 1</p>
        </div>

        <!-- Preview en vivo de los tags -->
        @if (previewTags().length > 0) {
          <div class="preview-tags">
            @for (tag of previewTags(); track tag) {
              <span class="tag">{{ tag }}</span>
            }
          </div>
        }

        <button type="submit" [disabled]="form.invalid" class="btn-submit">
          Guardar libro
        </button>

        @if (guardado()) {
          <div class="success-msg">
            ✓ "{{ tituloGuardado() }}" con {{ generosGuardados() }} género(s) guardado.
          </div>
        }
      </form>
    </div>
  \`,
})
export class LibroGenerosComponent {
  private readonly fb = inject(NonNullableFormBuilder);

  readonly form = this.fb.group({
    titulo: ['', [Validators.required, Validators.minLength(3)]],
    autor: ['', [Validators.required]],
    generos: this.fb.array([
      this.fb.control('', [Validators.required, Validators.minLength(2)]),
    ]),
  });

  // Getter tipado para acceder al FormArray sin casting repetitivo
  get generosArray(): FormArray<FormControl<string>> {
    return this.form.get('generos') as FormArray<FormControl<string>>;
  }

  // Preview reactivo de los tags no vacíos
  readonly previewTags = computed(() =>
    this.generosArray.controls
      .map(c => c.value)
      .filter(v => v.trim().length > 0)
  );

  private readonly _guardado = signal(false);
  private readonly _tituloGuardado = signal('');
  private readonly _generosGuardados = signal(0);

  guardado = () => this._guardado();
  tituloGuardado = () => this._tituloGuardado();
  generosGuardados = () => this._generosGuardados();

  agregarGenero(): void {
    if (this.generosArray.length < 5) {
      this.generosArray.push(
        this.fb.control('', [Validators.required, Validators.minLength(2)])
      );
    }
  }

  eliminarGenero(index: number): void {
    if (this.generosArray.length > 1) {
      this.generosArray.removeAt(index);
    }
  }

  onSubmit(): void {
    if (this.form.valid) {
      const valores = this.form.getRawValue();
      this._tituloGuardado.set(valores.titulo);
      this._generosGuardados.set(valores.generos.length);
      this._guardado.set(true);
      console.log('Libro guardado:', valores);
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
    button, input { font-family: 'Inter', sans-serif; }
    .form-container { background: #161B22; border: 1px solid #30363D; border-radius: 12px; padding: 1.75rem; width: 100%; max-width: 440px; }
    h2 { font-size: 1rem; font-weight: 600; margin-bottom: 1.5rem; }
    .libro-form { display: flex; flex-direction: column; gap: 1rem; }
    .field-group { display: flex; flex-direction: column; gap: 0.35rem; }
    label { font-size: 0.775rem; font-weight: 500; color: #8B949E; }
    .input { background: #0D1117; border: 1px solid #30363D; border-radius: 6px; padding: 0.55rem 0.875rem; color: #E6EDF3; font-size: 0.875rem; outline: none; width: 100%; transition: border-color 150ms; }
    .input:focus { border-color: #7C3AED; box-shadow: 0 0 0 3px rgba(124,58,237,0.15); }
    .input.error { border-color: #f87171; }
    .array-section { background: #0D1117; border: 1px solid #30363D; border-radius: 8px; padding: 1rem; }
    .array-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.875rem; }
    .array-header label { font-size: 0.775rem; font-weight: 600; color: #8B5CF6; }
    .btn-add { background: rgba(124,58,237,0.15); border: 1px solid rgba(124,58,237,0.35); color: #a78bfa; border-radius: 6px; padding: 0.3rem 0.75rem; font-size: 0.775rem; cursor: pointer; transition: background 150ms; }
    .btn-add:hover:not(:disabled) { background: rgba(124,58,237,0.25); }
    .btn-add:disabled { opacity: 0.4; cursor: not-allowed; }
    .tags-list { display: flex; flex-direction: column; gap: 0.5rem; }
    .tag-row { display: flex; gap: 0.5rem; align-items: center; }
    .input-tag { flex: 1; }
    .btn-remove { background: rgba(248,113,113,0.1); border: 1px solid rgba(248,113,113,0.25); color: #f87171; border-radius: 6px; padding: 0.35rem 0.6rem; font-size: 0.8rem; cursor: pointer; flex-shrink: 0; transition: background 150ms; }
    .btn-remove:hover:not(:disabled) { background: rgba(248,113,113,0.2); }
    .btn-remove:disabled { opacity: 0.3; cursor: not-allowed; }
    .array-hint { font-size: 0.7rem; color: #8B949E; margin-top: 0.6rem; }
    .preview-tags { display: flex; flex-wrap: wrap; gap: 0.4rem; }
    .tag { background: rgba(124,58,237,0.15); border: 1px solid rgba(124,58,237,0.3); color: #a78bfa; padding: 0.25em 0.65em; border-radius: 20px; font-size: 0.78rem; }
    .btn-submit { background: #7C3AED; color: white; border: none; border-radius: 6px; padding: 0.65rem 1.25rem; font-size: 0.875rem; font-weight: 500; cursor: pointer; transition: opacity 150ms; width: 100%; margin-top: 0.25rem; }
    .btn-submit:hover:not(:disabled) { opacity: 0.85; }
    .btn-submit:disabled { opacity: 0.4; cursor: not-allowed; }
    .success-msg { background: rgba(52,211,153,0.1); border: 1px solid rgba(52,211,153,0.3); color: #34d399; border-radius: 8px; padding: 0.75rem 1rem; font-size: 0.85rem; text-align: center; }
  </style>
</head>
<body>
  <span class="component-label">app-libro-generos</span>
  <div class="form-container">
    <h2>Añadir Libro con Géneros</h2>
    <form class="libro-form" id="genForm" novalidate>
      <div class="field-group">
        <label>Título *</label>
        <input id="titulo" type="text" class="input" placeholder="Título del libro" autocomplete="off" />
      </div>
      <div class="field-group">
        <label>Autor *</label>
        <input id="autor" type="text" class="input" placeholder="Nombre del autor" autocomplete="off" />
      </div>
      <div class="array-section">
        <div class="array-header">
          <label>Géneros — formArrayName</label>
          <button type="button" class="btn-add" id="btnAdd">+ Añadir género</button>
        </div>
        <div class="tags-list" id="tagsList"></div>
        <p class="array-hint" id="arrayHint">1/5 géneros · Mínimo 1</p>
      </div>
      <div class="preview-tags" id="previewTags" style="display:none"></div>
      <button type="submit" class="btn-submit" id="btnGuardar" disabled>Guardar libro</button>
      <div id="successMsg" class="success-msg" style="display:none"></div>
    </form>
  </div>
  <script>
    let generos = [''];
    const MAX = 5;
    const tituloEl = document.getElementById('titulo');
    const autorEl = document.getElementById('autor');
    const tagsListEl = document.getElementById('tagsList');
    const arrayHintEl = document.getElementById('arrayHint');
    const previewEl = document.getElementById('previewTags');
    const btnGuardar = document.getElementById('btnGuardar');
    const btnAdd = document.getElementById('btnAdd');

    function renderTags() {
      tagsListEl.innerHTML = generos.map((g, i) =>
        '<div class="tag-row">' +
        '<input type="text" class="input input-tag" placeholder="Ej: Programacion" value="' + g.replace(/"/g, '&quot;') + '" data-idx="' + i + '" autocomplete="off" />' +
        '<button type="button" class="btn-remove" data-remove="' + i + '" ' + (generos.length <= 1 ? 'disabled' : '') + '>x</button>' +
        '</div>'
      ).join('');
      arrayHintEl.textContent = generos.length + '/5 generos · Minimo 1';
      btnAdd.disabled = generos.length >= MAX;

      tagsListEl.querySelectorAll('input').forEach(inp => {
        inp.addEventListener('input', e => {
          generos[parseInt(e.target.dataset.idx)] = e.target.value;
          updatePreview();
          checkForm();
        });
      });
      tagsListEl.querySelectorAll('[data-remove]').forEach(btn => {
        btn.addEventListener('click', e => {
          const idx = parseInt(e.target.dataset.remove);
          generos.splice(idx, 1);
          renderTags();
          updatePreview();
          checkForm();
        });
      });
    }

    function updatePreview() {
      const filled = generos.filter(g => g.trim().length > 0);
      if (filled.length > 0) {
        previewEl.style.display = 'flex';
        previewEl.innerHTML = filled.map(g => '<span class="tag">' + g + '</span>').join('');
      } else {
        previewEl.style.display = 'none';
      }
    }

    function checkForm() {
      const tituloOk = tituloEl.value.trim().length >= 3;
      const autorOk = autorEl.value.trim().length >= 1;
      const generosOk = generos.some(g => g.trim().length >= 2);
      btnGuardar.disabled = !(tituloOk && autorOk && generosOk);
    }

    btnAdd.addEventListener('click', () => {
      if (generos.length < MAX) { generos.push(''); renderTags(); checkForm(); }
    });
    tituloEl.addEventListener('input', checkForm);
    autorEl.addEventListener('input', checkForm);

    document.getElementById('genForm').addEventListener('submit', e => {
      e.preventDefault();
      const filled = generos.filter(g => g.trim().length >= 2);
      if (!btnGuardar.disabled && filled.length > 0) {
        const msg = document.getElementById('successMsg');
        msg.textContent = '"' + tituloEl.value + '" con ' + filled.length + ' genero(s) guardado.';
        msg.style.display = 'block';
        btnGuardar.disabled = true;
      }
    });

    renderTags();
    updatePreview();
  </script>
</body>
</html>`,
    aiContext:
      'El usuario está aprendiendo FormArray en Angular 19. Ha visto un formulario de libro con array de géneros dinámico: push(), removeAt(), iteración con .controls y track $index. Puede preguntar sobre FormArray tipado, cómo validar el array entero, sobre FormGroup dentro de FormArray, o cómo obtener todos los valores del array.',
    introMessage:
      'Esta lección introduce `FormArray` — la herramienta para formularios con listas dinámicas.\n\nEl componente de géneros de libro permite añadir hasta 5 géneros con el botón "+", eliminar cualquiera con "✕", y muestra un preview en vivo de los tags. Observa el getter `generosArray` que evita hacer casting en cada acceso y cómo `@for` itera sobre `.controls` con `track $index`.\n\nPregúntame sobre `FormArray`, `push()`, `removeAt()`, o cómo anidar `FormGroup` dentro de un `FormArray`.',
    suggestedQuestions: [
      '¿Cómo anido un FormGroup dentro de un FormArray?',
      '¿Puedo validar que el FormArray tenga al menos N elementos válidos?',
      '¿Cómo obtengo todos los valores del FormArray como array tipado?',
    ],
  },

  {
    id: 'L6.5',
    module: 6,
    moduleTitle: 'Formularios',
    title: 'Formularios y Signals: model() y reactividad moderna',
    subtitle: 'model(), toSignal(form.valueChanges) y enlace con estado del servicio',
    estimatedMinutes: 15,
    xpReward: 140,
    prerequisites: ['L6.4'],
    nextLesson: 'L7.1',
    language: 'typescript',
    achievements: [
      {
        id: 'forms-architect',
        name: 'Forms Architect',
        description: 'Dominaste Reactive Forms, FormArray y la integración con Signals',
        icon: '📋',
      },
    ],
    narrative: [
      {
        type: 'text',
        content:
          'Los formularios reactivos y los signals son dos sistemas de reactividad que trabajan juntos en Angular moderno. `toSignal(form.valueChanges)` convierte el observable del formulario en un signal, cerrando la brecha entre RxJS y signals. El signal se actualiza automáticamente con cada tecla, permitiéndote leer el valor del formulario desde cualquier `computed()` o `effect()`.',
      },
      {
        type: 'tip',
        variant: 'info',
        content:
          '`model()` es el signal de two-way binding de Angular para componentes. Combina un `input()` y un `output()` en uno: el padre puede leer y escribir el valor, y el componente hijo emite cambios automáticamente. Es perfecto para campos de formulario personalizados que quieren exponer un valor editable.',
      },
      {
        type: 'text',
        content:
          'El patrón de edición pre-poblada es un caso de uso común: recibes un objeto del estado (signal del servicio), lo cargas en el formulario con `form.patchValue()`, el usuario edita, y en submit actualizas el estado. `patchValue()` solo actualiza los campos que existen en el objeto — campos ausentes se quedan como están. `setValue()` requiere todos los campos y falla si falta alguno.',
      },
      {
        type: 'tip',
        variant: 'angular',
        content:
          '`form.patchValue(libro())` dentro de un `effect()` sincroniza el formulario con el signal automáticamente. Cada vez que el signal cambie (por ejemplo, el usuario selecciona otro libro), el formulario se repoblará sin código adicional.',
      },
      {
        type: 'checkpoint',
        question: '¿Cuál es la diferencia entre form.patchValue() y form.setValue()?',
        options: [
          'patchValue es asíncrono, setValue es síncrono',
          'patchValue actualiza solo los campos presentes en el objeto, setValue requiere todos los campos',
          'patchValue solo funciona con FormControl, setValue con FormGroup',
          'No hay diferencia — son alias del mismo método',
        ],
        correct: 1,
        explanation:
          '`patchValue()` acepta un objeto parcial y solo actualiza los campos que encuentra — los demás quedan intactos. Es ideal para cargar datos de edición cuando no tienes todos los campos. `setValue()` requiere que el objeto tenga exactamente los mismos campos que el `FormGroup` — si falta alguno, lanza un error en desarrollo.',
      },
    ],
    starterCode: `import { Component, inject, signal, computed, effect, ChangeDetectionStrategy } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';

// 📚 Biblioteca Angular — Editar libro con formulario pre-poblado
// toSignal() convierte form.valueChanges en signal
// patchValue() carga los datos del libro seleccionado

interface Libro {
  id: number;
  titulo: string;
  autor: string;
  anio: number;
  genero: string;
}

// Simulación del servicio de biblioteca
class BibliotecaService {
  private readonly _libros = signal<Libro[]>([
    { id: 1, titulo: 'Clean Code', autor: 'Robert C. Martin', anio: 2008, genero: 'Programación' },
    { id: 2, titulo: 'The Pragmatic Programmer', autor: 'Hunt & Thomas', anio: 1999, genero: 'Programación' },
    { id: 3, titulo: 'Clean Architecture', autor: 'Robert C. Martin', anio: 2017, genero: 'Arquitectura' },
  ]);
  readonly libros = this._libros.asReadonly();

  actualizarLibro(libro: Libro): void {
    this._libros.update(lista =>
      lista.map(l => l.id === libro.id ? libro : l)
    );
  }
}

@Component({
  selector: 'app-editar-libro',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule],
  template: \`
    <div class="editor-layout">
      <!-- Lista de libros (estado del servicio) -->
      <div class="lista-panel">
        <h3>Biblioteca</h3>
        @for (libro of servicio.libros(); track libro.id) {
          <div class="libro-item"
            [class.selected]="libroSeleccionado()?.id === libro.id"
            (click)="seleccionarLibro(libro)">
            <strong>{{ libro.titulo }}</strong>
            <span>{{ libro.autor }}</span>
            <span class="tag-genero">{{ libro.genero }}</span>
          </div>
        }
      </div>

      <!-- Formulario de edición -->
      <div class="form-panel">
        @if (libroSeleccionado()) {
          <h3>Editando: <em>{{ libroSeleccionado()?.titulo }}</em></h3>

          <form [formGroup]="form" (ngSubmit)="onSubmit()" class="edit-form">
            <div class="field-group">
              <label>Título</label>
              <input type="text" formControlName="titulo" class="input" />
            </div>
            <div class="field-group">
              <label>Autor</label>
              <input type="text" formControlName="autor" class="input" />
            </div>
            <div class="row-2">
              <div class="field-group">
                <label>Año</label>
                <input type="number" formControlName="anio" class="input" />
              </div>
              <div class="field-group">
                <label>Género</label>
                <select formControlName="genero" class="select">
                  <option value="Programación">Programación</option>
                  <option value="Arquitectura">Arquitectura</option>
                  <option value="Agilidad">Agilidad</option>
                  <option value="Diseño">Diseño</option>
                </select>
              </div>
            </div>

            <!-- Preview reactivo via toSignal -->
            <div class="preview-card">
              <p class="preview-label">Vista previa (live via toSignal)</p>
              <p class="preview-titulo">{{ formValor()?.titulo }}</p>
              <p class="preview-meta">{{ formValor()?.autor }} · {{ formValor()?.anio }}</p>
            </div>

            <div class="form-actions">
              <button type="button" (click)="cancelar()" class="btn-cancel">Cancelar</button>
              <button type="submit" [disabled]="form.invalid || !form.dirty" class="btn-submit">
                Guardar cambios
              </button>
            </div>
          </form>
        } @else {
          <div class="empty-state">
            <p>Selecciona un libro de la lista para editarlo.</p>
          </div>
        }
      </div>
    </div>
  \`,
})
export class EditarLibroComponent {
  readonly servicio = new BibliotecaService();
  private readonly fb = inject(NonNullableFormBuilder);

  readonly libroSeleccionado = signal<Libro | null>(null);

  readonly form = this.fb.group({
    titulo: ['', [Validators.required, Validators.minLength(3)]],
    autor: ['', Validators.required],
    anio: [2024, [Validators.required, Validators.min(1900)]],
    genero: ['Programación', Validators.required],
  });

  // Convierte form.valueChanges en signal para el preview en vivo
  readonly formValor = toSignal(this.form.valueChanges, {
    initialValue: this.form.value,
  });

  // Tiempo de inicialización: carga patchValue cuando cambia el libro seleccionado
  constructor() {
    effect(() => {
      const libro = this.libroSeleccionado();
      if (libro) {
        this.form.patchValue(libro);
        this.form.markAsPristine(); // el form empieza "limpio" con el libro cargado
      }
    });
  }

  seleccionarLibro(libro: Libro): void {
    this.libroSeleccionado.set(libro);
  }

  onSubmit(): void {
    const seleccionado = this.libroSeleccionado();
    if (this.form.valid && seleccionado) {
      const actualizado: Libro = { id: seleccionado.id, ...this.form.getRawValue() };
      this.servicio.actualizarLibro(actualizado);
      this.libroSeleccionado.set(actualizado); // actualiza la selección con los nuevos datos
      this.form.markAsPristine();
    }
  }

  cancelar(): void {
    this.libroSeleccionado.set(null);
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
    body { font-family: 'Inter', sans-serif; background: #0D1117; color: #E6EDF3; min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 1.5rem; }
    .component-label { position: fixed; top: 12px; right: 12px; font-family: 'JetBrains Mono', monospace; font-size: 0.625rem; color: #8B949E; background: #161B22; border: 1px solid #30363D; padding: 0.2em 0.5em; border-radius: 4px; }
    button, select, input { font-family: 'Inter', sans-serif; }
    .editor-layout { display: grid; grid-template-columns: 220px 1fr; gap: 1rem; width: 100%; max-width: 680px; }
    .lista-panel { background: #161B22; border: 1px solid #30363D; border-radius: 12px; padding: 1.25rem; }
    .lista-panel h3 { font-size: 0.85rem; font-weight: 600; margin-bottom: 1rem; color: #8B949E; text-transform: uppercase; letter-spacing: 0.05em; }
    .libro-item { padding: 0.75rem; border-radius: 8px; cursor: pointer; border: 1px solid transparent; margin-bottom: 0.4rem; transition: background 150ms, border-color 150ms; }
    .libro-item:hover { background: #21262D; }
    .libro-item.selected { background: rgba(124,58,237,0.12); border-color: rgba(124,58,237,0.35); }
    .libro-item strong { display: block; font-size: 0.825rem; font-weight: 600; margin-bottom: 0.2rem; }
    .libro-item span { display: block; font-size: 0.73rem; color: #8B949E; }
    .tag-genero { background: rgba(124,58,237,0.1); border: 1px solid rgba(124,58,237,0.25); color: #a78bfa !important; padding: 0.1em 0.45em; border-radius: 4px; font-size: 0.68rem !important; margin-top: 0.3rem; display: inline-block !important; }
    .form-panel { background: #161B22; border: 1px solid #30363D; border-radius: 12px; padding: 1.5rem; }
    .form-panel h3 { font-size: 0.875rem; font-weight: 600; margin-bottom: 1.25rem; }
    .form-panel h3 em { color: #a78bfa; font-style: normal; }
    .edit-form { display: flex; flex-direction: column; gap: 0.875rem; }
    .field-group { display: flex; flex-direction: column; gap: 0.3rem; }
    .row-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; }
    label { font-size: 0.73rem; font-weight: 500; color: #8B949E; }
    .input, .select { background: #0D1117; border: 1px solid #30363D; border-radius: 6px; padding: 0.5rem 0.75rem; color: #E6EDF3; font-size: 0.825rem; outline: none; width: 100%; transition: border-color 150ms; }
    .input:focus, .select:focus { border-color: #7C3AED; box-shadow: 0 0 0 2px rgba(124,58,237,0.15); }
    select option { background: #161B22; }
    .preview-card { background: #0D1117; border: 1px solid #30363D; border-radius: 8px; padding: 0.875rem; }
    .preview-label { font-size: 0.68rem; color: #7C3AED; font-family: 'JetBrains Mono', monospace; margin-bottom: 0.4rem; }
    .preview-titulo { font-size: 0.9rem; font-weight: 600; margin-bottom: 0.2rem; }
    .preview-meta { font-size: 0.78rem; color: #8B949E; }
    .form-actions { display: flex; gap: 0.6rem; }
    .btn-cancel { background: transparent; border: 1px solid #30363D; color: #8B949E; border-radius: 6px; padding: 0.5rem 1rem; font-size: 0.8rem; cursor: pointer; }
    .btn-cancel:hover { border-color: #8B949E; color: #E6EDF3; }
    .btn-submit { flex: 1; background: #7C3AED; color: white; border: none; border-radius: 6px; padding: 0.5rem 1rem; font-size: 0.8rem; font-weight: 500; cursor: pointer; transition: opacity 150ms; }
    .btn-submit:hover:not(:disabled) { opacity: 0.85; }
    .btn-submit:disabled { opacity: 0.4; cursor: not-allowed; }
    .empty-state { display: flex; align-items: center; justify-content: center; height: 200px; }
    .empty-state p { font-size: 0.85rem; color: #8B949E; text-align: center; }
    @media (max-width: 520px) { .editor-layout { grid-template-columns: 1fr; } }
  </style>
</head>
<body>
  <span class="component-label">app-editar-libro</span>
  <div class="editor-layout">
    <div class="lista-panel">
      <h3>Biblioteca</h3>
      <div id="listaLibros"></div>
    </div>
    <div class="form-panel" id="formPanel">
      <div class="empty-state"><p>Selecciona un libro de la lista para editarlo.</p></div>
    </div>
  </div>
  <script>
    let libros = [
      { id: 1, titulo: 'Clean Code', autor: 'Robert C. Martin', anio: 2008, genero: 'Programacion' },
      { id: 2, titulo: 'The Pragmatic Programmer', autor: 'Hunt & Thomas', anio: 1999, genero: 'Programacion' },
      { id: 3, titulo: 'Clean Architecture', autor: 'Robert C. Martin', anio: 2017, genero: 'Arquitectura' },
    ];
    let selectedId = null;

    function renderLista() {
      document.getElementById('listaLibros').innerHTML = libros.map(l =>
        '<div class="libro-item ' + (selectedId === l.id ? 'selected' : '') + '" data-id="' + l.id + '">' +
        '<strong>' + l.titulo + '</strong>' +
        '<span>' + l.autor + '</span>' +
        '<span class="tag-genero">' + l.genero + '</span>' +
        '</div>'
      ).join('');
      document.querySelectorAll('.libro-item').forEach(el => {
        el.addEventListener('click', () => selectLibro(parseInt(el.dataset.id)));
      });
    }

    function selectLibro(id) {
      selectedId = id;
      const libro = libros.find(l => l.id === id);
      renderLista();
      renderForm(libro);
    }

    function renderForm(libro) {
      const generos = ['Programacion', 'Arquitectura', 'Agilidad', 'Diseno'];
      const opts = generos.map(g => '<option value="' + g + '" ' + (g === libro.genero ? 'selected' : '') + '>' + g + '</option>').join('');
      document.getElementById('formPanel').innerHTML =
        '<h3>Editando: <em>' + libro.titulo + '</em></h3>' +
        '<form class="edit-form" id="editForm" novalidate>' +
        '<div class="field-group"><label>Titulo</label><input id="fTitulo" type="text" class="input" value="' + libro.titulo + '" autocomplete="off" /></div>' +
        '<div class="field-group"><label>Autor</label><input id="fAutor" type="text" class="input" value="' + libro.autor + '" autocomplete="off" /></div>' +
        '<div class="row-2">' +
        '<div class="field-group"><label>Anio</label><input id="fAnio" type="number" class="input" value="' + libro.anio + '" /></div>' +
        '<div class="field-group"><label>Genero</label><select id="fGenero" class="select">' + opts + '</select></div>' +
        '</div>' +
        '<div class="preview-card"><p class="preview-label">toSignal(form.valueChanges)</p><p class="preview-titulo" id="pvTitulo">' + libro.titulo + '</p><p class="preview-meta" id="pvMeta">' + libro.autor + ' · ' + libro.anio + '</p></div>' +
        '<div class="form-actions"><button type="button" class="btn-cancel" id="btnCancel">Cancelar</button><button type="submit" class="btn-submit" id="btnSave">Guardar cambios</button></div>' +
        '</form>';

      let dirty = false;
      function updatePreview() {
        dirty = true;
        document.getElementById('pvTitulo').textContent = document.getElementById('fTitulo').value;
        document.getElementById('pvMeta').textContent = document.getElementById('fAutor').value + ' · ' + document.getElementById('fAnio').value;
      }
      ['fTitulo', 'fAutor', 'fAnio', 'fGenero'].forEach(id => {
        document.getElementById(id).addEventListener('input', updatePreview);
        document.getElementById(id).addEventListener('change', updatePreview);
      });
      document.getElementById('btnCancel').addEventListener('click', () => {
        selectedId = null;
        renderLista();
        document.getElementById('formPanel').innerHTML = '<div class="empty-state"><p>Selecciona un libro de la lista para editarlo.</p></div>';
      });
      document.getElementById('editForm').addEventListener('submit', e => {
        e.preventDefault();
        const updated = {
          id: libro.id,
          titulo: document.getElementById('fTitulo').value,
          autor: document.getElementById('fAutor').value,
          anio: parseInt(document.getElementById('fAnio').value),
          genero: document.getElementById('fGenero').value,
        };
        libros = libros.map(l => l.id === updated.id ? updated : l);
        renderLista();
        selectLibro(updated.id);
      });
    }

    renderLista();
  </script>
</body>
</html>`,
    aiContext:
      'El usuario está cerrando el módulo de Formularios en Angular 19. Ha visto cómo integrar Reactive Forms con Signals: toSignal(form.valueChanges), form.patchValue() para pre-popular desde un signal, effect() para sincronizar formulario con estado, y getRawValue() para obtener el valor completo tipado. Puede preguntar sobre model() signal, cuándo usar toSignal vs valueChanges directamente, sobre form.markAsPristine(), o sobre patrones de edición/creación en servicios.',
    introMessage:
      'La lección final del módulo conecta Reactive Forms con el sistema de Signals de Angular moderno.\n\nEl formulario de edición se pre-puebla automáticamente al seleccionar un libro usando `form.patchValue()` dentro de un `effect()`. El preview en vivo usa `toSignal(form.valueChanges)` — un signal que refleja cada tecla del usuario. Al guardar, el formulario actualiza el signal del servicio, y la lista se refleja al instante.\n\nPregúntame sobre `toSignal()`, `patchValue()`, `model()`, o cómo conectar formularios con estado global.',
    suggestedQuestions: [
      '¿Cuál es la diferencia entre patchValue() y setValue()?',
      '¿Cuándo usaría model() en lugar de formControlName?',
      '¿Cómo sincronizo un formulario reactivo con un store de Signals?',
    ],
  },
];
