import type { Lesson } from '../../core/models/lesson.model';

export const MODULE_5_LESSONS: Lesson[] = [
  {
    id: 'L5.1',
    module: 5,
    moduleTitle: 'Routing y Navegación',
    title: 'El Router de Angular: Tu app con varias páginas',
    subtitle: 'provideRouter(), RouterOutlet y RouterLink en acción',
    estimatedMinutes: 12,
    xpReward: 120,
    prerequisites: ['L4.6'],
    nextLesson: 'L5.2',
    language: 'typescript',
    narrative: [
      {
        type: 'text',
        content:
          'Hasta ahora la Biblioteca Angular era una sola pantalla. Con el Router de Angular, cada sección tiene su propia URL: `/catalogo`, `/favoritos`, `/perfil`. El navegador puede guardar el historial, el usuario puede compartir un enlace directo, y la app se comporta como una aplicación real de múltiples páginas.',
      },
      {
        type: 'tip',
        variant: 'info',
        content:
          '`provideRouter(routes)` va en `app.config.ts` — no necesitas `RouterModule`. Es la forma standalone de Angular 17+ para configurar el router. Cada ruta mapea un `path` a un `component`.',
      },
      {
        type: 'text',
        content:
          '`RouterOutlet` es el marcador de posición donde Angular renderiza el componente de la ruta activa. Lo colocas en tu layout principal. `RouterLink` reemplaza al `href` de HTML — genera URLs correctas y evita recargas de página completa. `RouterLinkActive` añade una clase CSS automáticamente cuando la ruta está activa.',
      },
      {
        type: 'tip',
        variant: 'angular',
        content:
          'En Angular standalone, importas `RouterOutlet`, `RouterLink` y `RouterLinkActive` directamente en el array `imports` de tu componente. No hay ningún módulo de enrutamiento que importar por separado.',
      },
      {
        type: 'checkpoint',
        question: '¿Qué directiva renderiza el componente de la ruta activa en el template?',
        options: ['RouterLink', 'RouterLinkActive', 'RouterOutlet', 'provideRouter'],
        correct: 2,
        explanation:
          '`RouterOutlet` es el "slot" donde Angular inyecta el componente que corresponde a la URL actual. `RouterLink` es para crear enlaces, `RouterLinkActive` añade clases CSS al enlace activo, y `provideRouter` configura el router en app.config.ts.',
      },
    ],
    starterCode: `import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { provideRouter } from '@angular/router';
import { bootstrapApplication } from '@angular/platform-browser';

// 📚 Biblioteca Angular — Routing básico
// Cada sección de la biblioteca tiene su propia URL

// ── Componentes de página ─────────────────────────────────────
@Component({
  selector: 'app-catalogo',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: \`
    <div class="pagina">
      <h2>📖 Catálogo</h2>
      <p>Lista de todos los libros disponibles.</p>
    </div>
  \`,
})
export class CatalogoComponent {}

@Component({
  selector: 'app-favoritos',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: \`
    <div class="pagina">
      <h2>❤️ Favoritos</h2>
      <p>Tus libros favoritos.</p>
    </div>
  \`,
})
export class FavoritosComponent {}

@Component({
  selector: 'app-perfil',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: \`
    <div class="pagina">
      <h2>👤 Perfil</h2>
      <p>Tu información de lector.</p>
    </div>
  \`,
})
export class PerfilComponent {}

// ── Layout principal con RouterOutlet ────────────────────────
@Component({
  selector: 'app-root',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: \`
    <div class="biblioteca-app">
      <nav class="navbar">
        <span class="logo">📚 Biblioteca</span>
        <div class="nav-links">
          <a routerLink="/catalogo" routerLinkActive="activo">Catálogo</a>
          <a routerLink="/favoritos" routerLinkActive="activo">Favoritos</a>
          <a routerLink="/perfil" routerLinkActive="activo">Perfil</a>
        </div>
      </nav>

      <!-- RouterOutlet: aquí se renderiza el componente activo -->
      <main class="contenido">
        <router-outlet />
      </main>
    </div>
  \`,
})
export class AppComponent {}

// ── Configuración de rutas ────────────────────────────────────
const routes = [
  { path: '', redirectTo: 'catalogo', pathMatch: 'full' as const },
  { path: 'catalogo', component: CatalogoComponent },
  { path: 'favoritos', component: FavoritosComponent },
  { path: 'perfil', component: PerfilComponent },
];

// app.config.ts usaría: provideRouter(routes)
bootstrapApplication(AppComponent, {
  providers: [provideRouter(routes)],
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
    .component-label { position: fixed; top: 12px; right: 12px; font-family: 'JetBrains Mono', monospace; font-size: 0.625rem; color: #8B949E; background: #161B22; border: 1px solid #30363D; padding: 0.2em 0.5em; border-radius: 4px; }
    .biblioteca-app { background: #161B22; border: 1px solid #30363D; border-radius: 12px; overflow: hidden; width: 100%; max-width: 480px; }
    .navbar { display: flex; align-items: center; justify-content: space-between; padding: 0.875rem 1.25rem; background: #0D1117; border-bottom: 1px solid #30363D; }
    .logo { font-weight: 700; font-size: 0.95rem; color: #E6EDF3; }
    .nav-links { display: flex; gap: 0.25rem; }
    .nav-links a { padding: 0.375rem 0.75rem; border-radius: 6px; font-size: 0.825rem; font-weight: 500; color: #8B949E; text-decoration: none; cursor: pointer; transition: all 150ms; border: 1px solid transparent; }
    .nav-links a:hover { color: #E6EDF3; background: #21262D; }
    .nav-links a.activo { color: #A78BFA; background: rgba(139,92,246,0.12); border-color: rgba(139,92,246,0.3); }
    .contenido { padding: 1.5rem; min-height: 180px; }
    .pagina h2 { font-size: 1.1rem; font-weight: 700; margin-bottom: 0.75rem; color: #E6EDF3; }
    .pagina p { font-size: 0.875rem; color: #8B949E; line-height: 1.6; }
    .url-bar { display: flex; align-items: center; gap: 0.5rem; padding: 0.6rem 1.25rem; background: #0D1117; border-top: 1px solid #21262D; }
    .url-badge { font-family: 'JetBrains Mono', monospace; font-size: 0.72rem; color: #8B5CF6; background: rgba(139,92,246,0.1); border: 1px solid rgba(139,92,246,0.25); padding: 0.15em 0.5em; border-radius: 4px; }
    .url-text { font-family: 'JetBrains Mono', monospace; font-size: 0.72rem; color: #8B949E; }
    .libro-lista { display: flex; flex-direction: column; gap: 0.5rem; margin-top: 1rem; }
    .libro-item { display: flex; align-items: center; gap: 0.75rem; padding: 0.6rem 0.875rem; background: #21262D; border: 1px solid #30363D; border-radius: 8px; font-size: 0.83rem; }
    .libro-cover { width: 32px; height: 40px; border-radius: 3px; display: flex; align-items: center; justify-content: center; font-size: 1rem; flex-shrink: 0; }
    .libro-info strong { display: block; font-size: 0.83rem; color: #E6EDF3; }
    .libro-info span { font-size: 0.75rem; color: #8B949E; }
    .fav-heart { margin-left: auto; color: #F87171; font-size: 1rem; }
    .perfil-avatar { width: 56px; height: 56px; border-radius: 50%; background: linear-gradient(135deg,#7C3AED,#4F46E5); display: flex; align-items: center; justify-content: center; font-size: 1.5rem; margin-bottom: 0.875rem; }
    .perfil-stat { display: flex; gap: 1.5rem; margin-top: 0.75rem; }
    .stat-item { text-align: center; }
    .stat-num { display: block; font-size: 1.25rem; font-weight: 700; color: #A78BFA; }
    .stat-lbl { font-size: 0.7rem; color: #8B949E; margin-top: 0.15rem; }
    .transition-flash { animation: flash 0.25s ease; }
    @keyframes flash { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
  </style>
</head>
<body>
  <span class="component-label">app-root + router-outlet</span>
  <div class="biblioteca-app">
    <nav class="navbar">
      <span class="logo">📚 Biblioteca</span>
      <div class="nav-links">
        <a id="link-catalogo" class="activo" onclick="navigate('catalogo')">Catálogo</a>
        <a id="link-favoritos" onclick="navigate('favoritos')">Favoritos</a>
        <a id="link-perfil" onclick="navigate('perfil')">Perfil</a>
      </div>
    </nav>
    <main class="contenido" id="outlet"></main>
    <div class="url-bar">
      <span class="url-badge">router-outlet</span>
      <span class="url-text" id="url-display">/catalogo</span>
    </div>
  </div>
  <script>
    const pages = {
      catalogo: function() {
        return '<div class="pagina transition-flash"><h2>Catálogo</h2><div class="libro-lista">' +
          [['#7C3AED','Clean Code','Robert C. Martin'],['#2563EB','Refactoring','Martin Fowler'],['#059669','Design Patterns','Gang of Four']].map(function(b) {
            return '<div class="libro-item"><div class="libro-cover" style="background:' + b[0] + '20;border:1px solid ' + b[0] + '40">📘</div><div class="libro-info"><strong>' + b[1] + '</strong><span>' + b[2] + '</span></div></div>';
          }).join('') + '</div></div>';
      },
      favoritos: function() {
        return '<div class="pagina transition-flash"><h2>Favoritos</h2><div class="libro-lista">' +
          [['Clean Code','Robert C. Martin'],['Pragmatic Programmer','Hunt & Thomas']].map(function(b) {
            return '<div class="libro-item"><div class="libro-cover" style="background:#7C3AED20;border:1px solid #7C3AED40">📗</div><div class="libro-info"><strong>' + b[0] + '</strong><span>' + b[1] + '</span></div><span class="fav-heart">❤️</span></div>';
          }).join('') + '</div></div>';
      },
      perfil: function() {
        return '<div class="pagina transition-flash"><div class="perfil-avatar">👤</div><strong style="font-size:1rem">Miguel</strong><span style="font-size:0.8rem;color:#8B949E;display:block;margin-top:0.25rem">Lector ávido</span><div class="perfil-stat"><div class="stat-item"><span class="stat-num">24</span><span class="stat-lbl">Leídos</span></div><div class="stat-item"><span class="stat-num">8</span><span class="stat-lbl">Favoritos</span></div><div class="stat-item"><span class="stat-num">3</span><span class="stat-lbl">Listas</span></div></div></div>';
      }
    };
    function navigate(page) {
      document.querySelectorAll('.nav-links a').forEach(function(a) { a.classList.remove('activo'); });
      document.getElementById('link-' + page).classList.add('activo');
      document.getElementById('outlet').innerHTML = pages[page]();
      document.getElementById('url-display').textContent = '/' + page;
    }
    navigate('catalogo');
  </script>
</body>
</html>`,
    aiContext:
      'El usuario está aprendiendo el sistema de routing de Angular 19/20. Ha visto provideRouter(), RouterOutlet, RouterLink y RouterLinkActive en el contexto de una biblioteca con varias páginas. Puede preguntar sobre cómo configurar rutas, qué hace pathMatch full, cómo funciona la navegación sin recargar, o diferencias con href.',
    introMessage:
      'Esta lección introduce el Router de Angular — la herramienta que convierte tu app de una sola pantalla en una aplicación con múltiples páginas y URLs.\n\nEl código muestra el layout completo: `provideRouter(routes)` en la configuración, `RouterOutlet` en el template para renderizar la página activa, y `RouterLink`/`RouterLinkActive` para la navegación.\n\nHaz clic en los enlaces del preview para ver cómo cambia la vista sin recargar la página.',
    suggestedQuestions: [
      '¿Qué diferencia hay entre routerLink y href?',
      '¿Para qué sirve pathMatch: "full" en la ruta de redirección?',
      '¿Puedo tener múltiples router-outlet en la misma página?',
    ],
  },

  {
    id: 'L5.2',
    module: 5,
    moduleTitle: 'Routing y Navegación',
    title: 'Parámetros de ruta: :id como input de componente',
    subtitle: 'withComponentInputBinding() y input() para params de URL',
    estimatedMinutes: 14,
    xpReward: 130,
    prerequisites: ['L5.1'],
    nextLesson: 'L5.3',
    language: 'typescript',
    narrative: [
      {
        type: 'text',
        content:
          'Las rutas dinámicas como `/libro/:id` permiten que la misma pantalla muestre contenido diferente según el identificador en la URL. El `:id` es un segmento variable — Angular captura su valor y lo pone a tu disposición en el componente.',
      },
      {
        type: 'tip',
        variant: 'info',
        content:
          'La forma moderna (Angular 17+) de recibir parámetros de ruta es activando `withComponentInputBinding()` en `provideRouter()`. Esto hace que el componente reciba el parámetro directamente como un `input()` — sin necesidad de inyectar `ActivatedRoute`.',
      },
      {
        type: 'text',
        content:
          'Con `withComponentInputBinding()`, el parámetro `:id` de la ruta `/libro/:id` llega al componente como `readonly id = input<string>()`. El nombre del input debe coincidir exactamente con el nombre del parámetro de ruta. Si prefieres el modo clásico, puedes inyectar `ActivatedRoute` y leer `route.snapshot.paramMap.get("id")`.',
      },
      {
        type: 'tip',
        variant: 'angular',
        content:
          'Usa `Router.navigate(["/libro", libro.id])` para navegar programáticamente desde TypeScript. También puedes usar `[routerLink]="[\'/libro\', libro.id]"` para enlazar en el template. Ambos construyen la URL `/libro/1`, `/libro/2`, etc.',
      },
      {
        type: 'checkpoint',
        question: '¿Qué debes añadir a provideRouter() para recibir params de ruta como input()?',
        options: [
          'withRouteParams()',
          'withComponentInputBinding()',
          'withInputBinding()',
          'withParamSignals()',
        ],
        correct: 1,
        explanation:
          '`withComponentInputBinding()` es la feature que activa la vinculación automática de parámetros de ruta a inputs del componente. Sin ella, Angular no sabe que debe mapear `:id` de la URL al `input("id")` del componente.',
      },
    ],
    starterCode: `import { Component, input, computed, signal, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink, provideRouter, withComponentInputBinding } from '@angular/router';
import { bootstrapApplication } from '@angular/platform-browser';

// 📚 Biblioteca Angular — Parámetros de ruta como inputs
// withComponentInputBinding() convierte :id en input() automáticamente

interface Libro {
  id: number;
  titulo: string;
  autor: string;
  año: number;
  paginas: number;
  descripcion: string;
  color: string;
}

const LIBROS: Libro[] = [
  { id: 1, titulo: 'Clean Code', autor: 'Robert C. Martin', año: 2008, paginas: 431, descripcion: 'Principios para escribir código limpio y mantenible.', color: '#7C3AED' },
  { id: 2, titulo: 'Refactoring', autor: 'Martin Fowler', año: 2018, paginas: 448, descripcion: 'Técnicas para mejorar el diseño del código existente.', color: '#2563EB' },
  { id: 3, titulo: 'Design Patterns', autor: 'Gang of Four', año: 1994, paginas: 395, descripcion: 'Los 23 patrones de diseño clásicos de software.', color: '#059669' },
];

// ── Página de detalle — recibe :id como input ────────────────
@Component({
  selector: 'app-libro-detalle',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
  template: \`
    @if (libro()) {
      <div class="detalle">
        <a routerLink="/catalogo" class="back-link">← Volver al catálogo</a>
        <div class="libro-hero" [style.background]="libro()!.color + '20'">
          <div class="libro-portada" [style.background]="libro()!.color">📘</div>
          <div>
            <h1>{{ libro()!.titulo }}</h1>
            <p class="autor">{{ libro()!.autor }} · {{ libro()!.año }}</p>
            <p class="paginas">{{ libro()!.paginas }} páginas</p>
          </div>
        </div>
        <p class="descripcion">{{ libro()!.descripcion }}</p>
      </div>
    } @else {
      <p class="no-encontrado">Libro no encontrado (id: {{ id() }})</p>
    }
  \`,
})
export class LibroDetalleComponent {
  // ✅ El parámetro :id de la ruta llega aquí gracias a withComponentInputBinding()
  readonly id = input<string>();

  // computed() — busca el libro cuando id cambia
  readonly libro = computed(() =>
    LIBROS.find(l => l.id === Number(this.id()))
  );
}

// ── Página de catálogo ───────────────────────────────────────
@Component({
  selector: 'app-catalogo',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
  template: \`
    <div class="catalogo">
      <h2>Catálogo</h2>
      @for (libro of libros; track libro.id) {
        <a [routerLink]="['/libro', libro.id]" class="libro-item">
          <strong>{{ libro.titulo }}</strong>
          <span>{{ libro.autor }}</span>
        </a>
      }
    </div>
  \`,
})
export class CatalogoComponent {
  readonly libros = LIBROS;
}

const routes = [
  { path: '', redirectTo: 'catalogo', pathMatch: 'full' as const },
  { path: 'catalogo', component: CatalogoComponent },
  // :id se convierte en input() gracias a withComponentInputBinding()
  { path: 'libro/:id', component: LibroDetalleComponent },
];

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes, withComponentInputBinding()),
  ],
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
    .component-label { position: fixed; top: 12px; right: 12px; font-family: 'JetBrains Mono', monospace; font-size: 0.625rem; color: #8B949E; background: #161B22; border: 1px solid #30363D; padding: 0.2em 0.5em; border-radius: 4px; }
    .app { background: #161B22; border: 1px solid #30363D; border-radius: 12px; overflow: hidden; width: 100%; max-width: 460px; }
    .navbar { display: flex; align-items: center; justify-content: space-between; padding: 0.75rem 1.25rem; background: #0D1117; border-bottom: 1px solid #30363D; }
    .logo { font-weight: 700; font-size: 0.875rem; }
    .url-bar { font-family: 'JetBrains Mono', monospace; font-size: 0.72rem; color: #8B5CF6; background: rgba(139,92,246,0.08); border: 1px solid rgba(139,92,246,0.2); padding: 0.2em 0.6em; border-radius: 4px; }
    .outlet { padding: 1.25rem; min-height: 200px; }
    .slide { animation: slide-in 0.2s ease; }
    @keyframes slide-in { from { opacity: 0; transform: translateX(8px); } to { opacity: 1; transform: translateX(0); } }
    .catalogo h2 { font-size: 1rem; font-weight: 700; margin-bottom: 1rem; }
    .libro-row { display: flex; align-items: center; justify-content: space-between; padding: 0.7rem 0.875rem; background: #21262D; border: 1px solid #30363D; border-radius: 8px; margin-bottom: 0.5rem; cursor: pointer; transition: border-color 150ms; }
    .libro-row:hover { border-color: #7C3AED; }
    .libro-row strong { font-size: 0.875rem; display: block; }
    .libro-row span { font-size: 0.75rem; color: #8B949E; }
    .arrow { color: #8B949E; font-size: 0.75rem; }
    .back-btn { display: inline-flex; align-items: center; gap: 0.35rem; font-size: 0.8rem; color: #8B5CF6; cursor: pointer; margin-bottom: 1rem; background: none; border: none; padding: 0; font-family: inherit; }
    .back-btn:hover { text-decoration: underline; }
    .libro-hero { border-radius: 10px; padding: 1.25rem; display: flex; gap: 1rem; align-items: flex-start; margin-bottom: 1rem; }
    .portada { width: 52px; height: 68px; border-radius: 6px; display: flex; align-items: center; justify-content: center; font-size: 1.5rem; flex-shrink: 0; }
    .hero-info h1 { font-size: 1.05rem; font-weight: 700; margin-bottom: 0.3rem; }
    .hero-info .autor { font-size: 0.8rem; color: #8B949E; margin-bottom: 0.2rem; }
    .hero-info .paginas { font-size: 0.75rem; color: #8B949E; }
    .descripcion { font-size: 0.83rem; color: #8B949E; line-height: 1.6; }
    .param-badge { display: inline-block; font-family: 'JetBrains Mono', monospace; font-size: 0.7rem; background: rgba(139,92,246,0.1); border: 1px solid rgba(139,92,246,0.3); color: #A78BFA; padding: 0.1em 0.4em; border-radius: 3px; margin-left: 0.4rem; }
  </style>
</head>
<body>
  <span class="component-label">libro/:id + withComponentInputBinding()</span>
  <div class="app">
    <div class="navbar">
      <span class="logo">📚 Biblioteca</span>
      <span class="url-bar" id="url-bar">/catalogo</span>
    </div>
    <div class="outlet" id="outlet"></div>
  </div>
  <script>
    var libros = [
      { id: 1, titulo: 'Clean Code', autor: 'Robert C. Martin', año: 2008, paginas: 431, descripcion: 'Principios para escribir código limpio y mantenible.', color: '#7C3AED' },
      { id: 2, titulo: 'Refactoring', autor: 'Martin Fowler', año: 2018, paginas: 448, descripcion: 'Técnicas para mejorar el diseño del código existente.', color: '#2563EB' },
      { id: 3, titulo: 'Design Patterns', autor: 'Gang of Four', año: 1994, paginas: 395, descripcion: 'Los 23 patrones de diseño clásicos de software.', color: '#059669' },
    ];
    function showCatalogo() {
      document.getElementById('url-bar').textContent = '/catalogo';
      document.getElementById('outlet').innerHTML = '<div class="catalogo slide"><h2>Catálogo</h2>' +
        libros.map(function(l) {
          return '<div class="libro-row" onclick="showDetalle(' + l.id + ')"><div><strong>' + l.titulo + '</strong><span>' + l.autor + '</span></div><span class="arrow">→</span></div>';
        }).join('') + '</div>';
    }
    function showDetalle(id) {
      var l = libros.find(function(x) { return x.id === id; });
      if (!l) return;
      document.getElementById('url-bar').textContent = '/libro/' + id;
      document.getElementById('outlet').innerHTML = '<div class="slide">' +
        '<button class="back-btn" onclick="showCatalogo()">← Volver al catálogo</button>' +
        '<div class="libro-hero" style="background:' + l.color + '18;border:1px solid ' + l.color + '30">' +
          '<div class="portada" style="background:' + l.color + '">\uD83D\uDCD8</div>' +
          '<div class="hero-info"><h1>' + l.titulo + '<span class="param-badge">id=' + id + '</span></h1><p class="autor">' + l.autor + ' \u00B7 ' + l.año + '</p><p class="paginas">' + l.paginas + ' p\u00E1ginas</p></div>' +
        '</div>' +
        '<p class="descripcion">' + l.descripcion + '</p></div>';
    }
    showCatalogo();
  </script>
</body>
</html>`,
    aiContext:
      'El usuario está aprendiendo rutas dinámicas con parámetros en Angular 19/20. Ha visto cómo :id en la ruta se convierte en input() del componente usando withComponentInputBinding(). Puede preguntar sobre ActivatedRoute, queryParams, paramMap, snapshot vs observable, o cómo navegar programáticamente.',
    introMessage:
      'En esta lección ves cómo Angular 17+ transforma los parámetros de ruta en inputs de componente con `withComponentInputBinding()`.\n\nHaz clic en un libro del catálogo — la URL cambia a `/libro/1` y el componente `LibroDetalleComponent` recibe ese `id` directamente como `input()`, sin necesidad de `ActivatedRoute`.\n\nSi quieres entender el modo clásico con `ActivatedRoute` o cómo manejar `queryParams`, pregúntame.',
    suggestedQuestions: [
      '¿Cuándo necesito ActivatedRoute en lugar de input()?',
      '¿Cómo accedo a queryParams (?buscar=angular) en el componente?',
      '¿Cómo navego programáticamente con parámetros desde TypeScript?',
    ],
  },

  {
    id: 'L5.3',
    module: 5,
    moduleTitle: 'Routing y Navegación',
    title: 'Lazy Loading: Carga solo lo que necesitas',
    subtitle: 'loadComponent y loadChildren con imports dinámicos',
    estimatedMinutes: 15,
    xpReward: 150,
    prerequisites: ['L5.2'],
    nextLesson: 'L5.4',
    language: 'typescript',
    narrative: [
      {
        type: 'text',
        content:
          'Por defecto, Angular incluye todos los componentes en un solo bundle JavaScript. Con lazy loading, los componentes de una ruta se cargan solo cuando el usuario navega a esa URL. La ruta principal carga rápido; el resto llega bajo demanda. Para apps grandes, esto puede reducir el tiempo de carga inicial a la mitad.',
      },
      {
        type: 'tip',
        variant: 'info',
        content:
          '`loadComponent: () => import("./ruta").then(m => m.ComponenteClass)` carga un componente standalone de forma lazy. `loadChildren: () => import("./feature.routes").then(m => m.routes)` carga un array de rutas completo — ideal para agrupar una feature entera.',
      },
      {
        type: 'text',
        content:
          'El import dinámico `import()` devuelve una Promise que el router resuelve automáticamente. Mientras el módulo se descarga, Angular puede mostrar un estado de carga si configuras un `loadingComponent` o un `resolver`. Los chunks se nombran automáticamente y el browser los cachea según las cabeceras HTTP.',
      },
      {
        type: 'tip',
        variant: 'angular',
        content:
          '`withPreloading(PreloadAllModules)` hace que Angular descargue en background todos los módulos lazy justo después de que la app principal cargó. El usuario percibe la app como cargada al instante porque los chunks ya están en caché cuando los necesita.',
      },
      {
        type: 'checkpoint',
        question: '¿Cuál es la sintaxis correcta para cargar un componente standalone de forma lazy?',
        options: [
          'component: lazy(() => import("./comp"))',
          'loadComponent: () => import("./comp").then(m => m.Comp)',
          'lazyLoad: "./comp#Comp"',
          'defer: () => import("./comp")',
        ],
        correct: 1,
        explanation:
          '`loadComponent` acepta una función que devuelve una Promise del componente. El `.then(m => m.NombreClase)` extrae la clase exportada del módulo ES dinámico. Angular se encarga de resolver la Promise y crear el componente cuando la ruta se activa.',
      },
    ],
    starterCode: `import { provideRouter, withPreloading, PreloadAllModules } from '@angular/router';
import { bootstrapApplication } from '@angular/platform-browser';
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';

// 📚 Biblioteca Angular — Lazy Loading
// Cada ruta carga su componente SOLO cuando el usuario navega a ella

// ── Layout ───────────────────────────────────────────────────
@Component({
  selector: 'app-root',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: \`
    <nav>
      <a routerLink="/catalogo" routerLinkActive="activo">Catálogo</a>
      <a routerLink="/favoritos" routerLinkActive="activo">Favoritos</a>
      <a routerLink="/perfil" routerLinkActive="activo">Perfil</a>
    </nav>
    <router-outlet />
  \`,
})
export class AppComponent {}

// ── Rutas con lazy loading ───────────────────────────────────
const routes = [
  { path: '', redirectTo: 'catalogo', pathMatch: 'full' as const },

  // loadComponent — componente standalone lazy
  {
    path: 'catalogo',
    loadComponent: () =>
      import('./pages/catalogo.component').then(m => m.CatalogoComponent),
  },

  // loadComponent — otro componente lazy
  {
    path: 'favoritos',
    loadComponent: () =>
      import('./pages/favoritos.component').then(m => m.FavoritosComponent),
  },

  // loadChildren — todas las rutas de "perfil" en un archivo aparte
  // Carga feature/perfil.routes.ts solo cuando el usuario entra a /perfil
  {
    path: 'perfil',
    loadChildren: () =>
      import('./features/perfil/perfil.routes').then(m => m.routes),
  },
];

// withPreloading — descarga los lazy chunks en background después del boot
bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes, withPreloading(PreloadAllModules)),
  ],
});

// ── perfil.routes.ts (en features/perfil/) ──────────────────
// export const routes = [
//   { path: '', component: PerfilComponent },
//   { path: 'editar', component: EditarPerfilComponent },
// ];
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
    .app { background: #161B22; border: 1px solid #30363D; border-radius: 12px; overflow: hidden; width: 100%; max-width: 480px; }
    .navbar { display: flex; align-items: center; justify-content: space-between; padding: 0.75rem 1.25rem; background: #0D1117; border-bottom: 1px solid #30363D; gap: 0.5rem; flex-wrap: wrap; }
    .logo { font-weight: 700; font-size: 0.875rem; }
    .nav-links { display: flex; gap: 0.25rem; }
    .nav-links a { padding: 0.35rem 0.7rem; border-radius: 6px; font-size: 0.8rem; font-weight: 500; color: #8B949E; text-decoration: none; cursor: pointer; transition: all 150ms; border: 1px solid transparent; }
    .nav-links a:hover { color: #E6EDF3; background: #21262D; }
    .nav-links a.activo { color: #A78BFA; background: rgba(139,92,246,0.12); border-color: rgba(139,92,246,0.3); }
    .outlet { padding: 1.25rem; min-height: 220px; }
    .network-panel { border-top: 1px solid #21262D; padding: 0.875rem 1.25rem; background: #0D1117; }
    .network-title { font-family: 'JetBrains Mono', monospace; font-size: 0.7rem; color: #8B949E; margin-bottom: 0.6rem; }
    .network-row { display: flex; align-items: center; gap: 0.6rem; padding: 0.3rem 0; border-bottom: 1px solid #21262D; }
    .network-row:last-child { border-bottom: none; }
    .net-name { font-family: 'JetBrains Mono', monospace; font-size: 0.72rem; color: #E6EDF3; flex: 1; }
    .net-size { font-family: 'JetBrains Mono', monospace; font-size: 0.7rem; color: #8B949E; width: 50px; text-align: right; }
    .net-bar-wrap { flex: 2; height: 6px; background: #21262D; border-radius: 3px; overflow: hidden; }
    .net-bar { height: 100%; border-radius: 3px; transition: width 0.4s ease; }
    .net-status { font-size: 0.68rem; width: 56px; text-align: right; }
    .status-loaded { color: #22c55e; }
    .status-cached { color: #8B949E; }
    .status-pending { color: #F59E0B; }
    .slide { animation: slide-in 0.2s ease; }
    @keyframes slide-in { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
    .page-title { font-size: 1rem; font-weight: 700; margin-bottom: 0.75rem; }
    .page-desc { font-size: 0.83rem; color: #8B949E; line-height: 1.6; }
    .chunk-badge { display: inline-block; font-family: 'JetBrains Mono', monospace; font-size: 0.68rem; background: rgba(34,197,94,0.1); border: 1px solid rgba(34,197,94,0.3); color: #4ADE80; padding: 0.1em 0.4em; border-radius: 3px; margin-left: 0.4rem; }
    .loading-dots { display: inline-flex; gap: 3px; align-items: center; }
    .loading-dots span { width: 5px; height: 5px; border-radius: 50%; background: #8B5CF6; animation: dot-bounce 0.8s infinite; }
    .loading-dots span:nth-child(2) { animation-delay: 0.15s; }
    .loading-dots span:nth-child(3) { animation-delay: 0.3s; }
    @keyframes dot-bounce { 0%,80%,100% { transform: scale(0.6); opacity: 0.4; } 40% { transform: scale(1); opacity: 1; } }
  </style>
</head>
<body>
  <span class="component-label">loadComponent / loadChildren</span>
  <div class="app">
    <div class="navbar">
      <span class="logo">📚 Biblioteca</span>
      <div class="nav-links">
        <a id="link-catalogo" onclick="navigate('catalogo')">Catálogo</a>
        <a id="link-favoritos" onclick="navigate('favoritos')">Favoritos</a>
        <a id="link-perfil" onclick="navigate('perfil')">Perfil</a>
      </div>
    </div>
    <div class="outlet" id="outlet"></div>
    <div class="network-panel">
      <div class="network-title">Network — chunks JS</div>
      <div id="net-rows"></div>
    </div>
  </div>
  <script>
    var chunks = {
      'main.js':        { size: '142 KB', width: 100, color: '#7C3AED', status: 'loaded', loaded: true },
      'catalogo.js':    { size: '18 KB',  width: 13,  color: '#2563EB', status: 'pending', loaded: false },
      'favoritos.js':   { size: '12 KB',  width: 8,   color: '#059669', status: 'pending', loaded: false },
      'perfil.js':      { size: '22 KB',  width: 15,  color: '#D97706', status: 'pending', loaded: false },
    };
    var pages = {
      catalogo: '<div class="slide"><p class="page-title">Catálogo<span class="chunk-badge">catalogo.js cargado</span></p><p class="page-desc">Los libros del catálogo aparecen aquí. Este componente se descargó solo cuando navegaste a /catalogo.</p></div>',
      favoritos: '<div class="slide"><p class="page-title">Favoritos<span class="chunk-badge">favoritos.js cargado</span></p><p class="page-desc">Tus libros favoritos. Este chunk no existía en el bundle inicial.</p></div>',
      perfil: '<div class="slide"><p class="page-title">Perfil<span class="chunk-badge">perfil.js cargado</span></p><p class="page-desc">Las rutas de perfil se cargaron con loadChildren. Incluye /perfil y /perfil/editar.</p></div>',
    };
    var chunkMap = { catalogo: 'catalogo.js', favoritos: 'favoritos.js', perfil: 'perfil.js' };
    function renderNetRows() {
      document.getElementById('net-rows').innerHTML = Object.keys(chunks).map(function(name) {
        var c = chunks[name];
        var statusClass = c.status === 'loaded' ? 'status-loaded' : (c.status === 'cached' ? 'status-cached' : 'status-pending');
        var statusText = c.status === 'loaded' ? '✓ loaded' : (c.status === 'cached' ? '◎ cached' : '○ not loaded');
        return '<div class="network-row"><span class="net-name">' + name + '</span><span class="net-size">' + c.size + '</span><div class="net-bar-wrap"><div class="net-bar" style="width:' + (c.loaded ? c.width : 0) + '%;background:' + c.color + '"></div></div><span class="net-status ' + statusClass + '">' + statusText + '</span></div>';
      }).join('');
    }
    function navigate(page) {
      document.querySelectorAll('.nav-links a').forEach(function(a) { a.classList.remove('activo'); });
      document.getElementById('link-' + page).classList.add('activo');
      var chunkName = chunkMap[page];
      if (!chunks[chunkName].loaded) {
        document.getElementById('outlet').innerHTML = '<div style="display:flex;align-items:center;gap:0.5rem;color:#8B949E;font-size:0.83rem;padding:2rem 0"><div class="loading-dots"><span></span><span></span><span></span></div> Cargando ' + chunkName + '...</div>';
        setTimeout(function() {
          chunks[chunkName].loaded = true;
          chunks[chunkName].status = 'loaded';
          document.getElementById('outlet').innerHTML = pages[page];
          renderNetRows();
        }, 700);
      } else {
        chunks[chunkName].status = 'cached';
        document.getElementById('outlet').innerHTML = pages[page];
        renderNetRows();
      }
    }
    chunks['main.js'].loaded = true;
    renderNetRows();
    document.getElementById('link-catalogo').classList.add('activo');
    setTimeout(function() { navigate('catalogo'); }, 200);
  </script>
</body>
</html>`,
    aiContext:
      'El usuario está aprendiendo lazy loading en Angular 19/20 con loadComponent y loadChildren. Ha visto visualmente cómo los chunks JS se cargan bajo demanda y se cachean en visitas posteriores. Puede preguntar sobre preloading, withPreloading, code splitting, bundle analysis, o cuándo usar loadComponent vs loadChildren.',
    introMessage:
      'Esta lección muestra cómo el lazy loading divide tu app en chunks JS que se cargan solo cuando el usuario los necesita.\n\nObs el panel "Network" del preview: `main.js` se carga al inicio, pero `catalogo.js`, `favoritos.js` y `perfil.js` solo cuando navegas a esas rutas. En la segunda visita ya están en caché.\n\nPregúntame sobre `withPreloading`, cómo analizar el bundle, o cuándo usar `loadChildren` vs `loadComponent`.',
    suggestedQuestions: [
      '¿Cuál es la diferencia entre loadComponent y loadChildren?',
      '¿Qué hace withPreloading(PreloadAllModules) exactamente?',
      '¿Cómo veo el tamaño de cada chunk generado por Angular CLI?',
    ],
  },

  {
    id: 'L5.4',
    module: 5,
    moduleTitle: 'Routing y Navegación',
    title: 'Guards funcionales: Protege tus rutas',
    subtitle: 'canActivate, canDeactivate y UrlTree para redirecciones',
    estimatedMinutes: 15,
    xpReward: 140,
    prerequisites: ['L5.3'],
    nextLesson: 'L5.5',
    language: 'typescript',
    narrative: [
      {
        type: 'text',
        content:
          'Los guards son funciones que Angular ejecuta antes de activar una ruta. Devuelven `true` para permitir el acceso, `false` para bloquearlo, o un `UrlTree` para redirigir a otra URL. Son la forma de implementar autenticación, autorización, y proteger formularios con cambios sin guardar.',
      },
      {
        type: 'tip',
        variant: 'info',
        content:
          'En Angular moderno, los guards son simples funciones — no clases que implementan una interfaz. Un `canActivate` es `(route, state) => boolean | UrlTree | Observable<...> | Promise<...>`. Puedes usar `inject()` dentro de la función para acceder a servicios.',
      },
      {
        type: 'text',
        content:
          '`canDeactivate` protege la salida de una ruta — útil cuando el usuario tiene un formulario con cambios sin guardar. Recibe el componente actual como primer argumento, por lo que puedes consultarle si tiene cambios pendientes. Devuelve `true` para permitir la navegación o `false` para cancelarla.',
      },
      {
        type: 'tip',
        variant: 'angular',
        content:
          'Para redirigir desde un guard, devuelve un `UrlTree` con `inject(Router).parseUrl("/login")`. Esto es mejor que devolver `false` porque Angular registra la redirección correctamente en el historial y los efectos de navegación.',
      },
      {
        type: 'checkpoint',
        question: '¿Qué debe devolver un guard para redirigir al usuario a /login en lugar de bloquear?',
        options: [
          'false',
          'null',
          'inject(Router).parseUrl("/login")',
          'Router.navigate(["/login"])',
        ],
        correct: 2,
        explanation:
          'Devolver un `UrlTree` (creado con `router.parseUrl()` o `router.createUrlTree()`) hace que Angular redirija al usuario a esa URL como parte del proceso de navegación. Es preferible a llamar `router.navigate()` dentro del guard porque integra la redirección correctamente en el sistema de navegación.',
      },
    ],
    starterCode: `import {
  CanActivateFn, CanDeactivateFn, Router,
  provideRouter
} from '@angular/router';
import { inject } from '@angular/core';
import { Component, signal, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { bootstrapApplication } from '@angular/platform-browser';

// 📚 Biblioteca Angular — Guards funcionales
// canActivate protege la ruta, canDeactivate protege la salida

// ── Estado de autenticación (signal global simulado) ─────────
export const estaLogueado = signal(false);

// ── Guard canActivate: bloquea /perfil si no estás logueado ─
export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);

  if (estaLogueado()) {
    return true; // ✅ acceso permitido
  }

  // Redirige a /login con la URL original como queryParam
  return router.parseUrl('/login?returnUrl=' + state.url);
};

// ── Guard canDeactivate: avisa si hay cambios sin guardar ────
export interface TienesCambiosPendientes {
  hayCambiosSinGuardar(): boolean;
}

export const unsavedChangesGuard: CanDeactivateFn<TienesCambiosPendientes> =
  (component) => {
    if (component.hayCambiosSinGuardar()) {
      return confirm('¿Salir sin guardar los cambios?');
    }
    return true;
  };

// ── Página de perfil (ruta protegida) ────────────────────────
@Component({
  selector: 'app-perfil',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
  template: \`
    <div class="pagina">
      <h2>👤 Perfil</h2>
      <p>Página protegida — solo visible si estás logueado.</p>
      <button (click)="estaLogueado.set(false)">Cerrar sesión</button>
    </div>
  \`,
})
export class PerfilComponent {
  readonly estaLogueado = estaLogueado;
}

// ── Página de login ───────────────────────────────────────────
@Component({
  selector: 'app-login',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: \`
    <div class="login-form">
      <h2>Iniciar sesión</h2>
      <button (click)="login()">Entrar como invitado</button>
    </div>
  \`,
})
export class LoginComponent {
  private router = inject(Router);

  login(): void {
    estaLogueado.set(true);
    this.router.navigateByUrl('/perfil');
  }
}

const routes = [
  { path: 'perfil',
    component: PerfilComponent,
    canActivate: [authGuard],       // 🔒 protegida
  },
  { path: 'login', component: LoginComponent },
  { path: '', redirectTo: 'perfil', pathMatch: 'full' as const },
];

bootstrapApplication(AppComponent, {
  providers: [provideRouter(routes)],
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
    .component-label { position: fixed; top: 12px; right: 12px; font-family: 'JetBrains Mono', monospace; font-size: 0.625rem; color: #8B949E; background: #161B22; border: 1px solid #30363D; padding: 0.2em 0.5em; border-radius: 4px; }
    .app { background: #161B22; border: 1px solid #30363D; border-radius: 12px; overflow: hidden; width: 100%; max-width: 440px; }
    .navbar { display: flex; align-items: center; justify-content: space-between; padding: 0.75rem 1.25rem; background: #0D1117; border-bottom: 1px solid #30363D; }
    .logo { font-weight: 700; font-size: 0.875rem; }
    .nav-links { display: flex; gap: 0.25rem; align-items: center; }
    .nav-links a { padding: 0.35rem 0.7rem; border-radius: 6px; font-size: 0.8rem; font-weight: 500; color: #8B949E; text-decoration: none; cursor: pointer; transition: all 150ms; border: 1px solid transparent; }
    .nav-links a:hover { color: #E6EDF3; background: #21262D; }
    .nav-links a.activo { color: #A78BFA; background: rgba(139,92,246,0.12); border-color: rgba(139,92,246,0.3); }
    .auth-badge { font-size: 0.7rem; padding: 0.2em 0.5em; border-radius: 10px; font-weight: 600; }
    .auth-badge.on { background: rgba(34,197,94,0.15); color: #4ADE80; border: 1px solid rgba(34,197,94,0.3); }
    .auth-badge.off { background: rgba(249,115,22,0.1); color: #FB923C; border: 1px solid rgba(249,115,22,0.25); }
    .outlet { padding: 1.5rem; min-height: 200px; }
    .guard-log { border-top: 1px solid #21262D; padding: 0.75rem 1.25rem; background: #0D1117; }
    .guard-log-title { font-family: 'JetBrains Mono', monospace; font-size: 0.68rem; color: #8B949E; margin-bottom: 0.5rem; }
    .log-entry { font-family: 'JetBrains Mono', monospace; font-size: 0.7rem; padding: 0.2rem 0; border-bottom: 1px solid #21262D18; }
    .log-entry:last-child { border-bottom: none; }
    .log-ok { color: #4ADE80; }
    .log-block { color: #F87171; }
    .log-redirect { color: #FBBF24; }
    .slide { animation: slide-in 0.2s ease; }
    @keyframes slide-in { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }
    .pagina-title { font-size: 1.05rem; font-weight: 700; margin-bottom: 0.75rem; }
    .pagina-desc { font-size: 0.83rem; color: #8B949E; line-height: 1.6; margin-bottom: 1rem; }
    .btn { background: #8B5CF6; color: white; border: none; border-radius: 6px; padding: 0.5rem 1.1rem; font-size: 0.83rem; font-weight: 500; cursor: pointer; font-family: inherit; transition: opacity 150ms; }
    .btn:hover { opacity: 0.85; }
    .btn-danger { background: #DC2626; }
    .btn-success { background: #16A34A; }
    .login-icon { font-size: 2.5rem; text-align: center; margin-bottom: 0.75rem; }
    .guard-chip { display: inline-flex; align-items: center; gap: 0.3rem; font-family: 'JetBrains Mono', monospace; font-size: 0.68rem; border: 1px solid; border-radius: 4px; padding: 0.1em 0.45em; margin-right: 0.35rem; }
    .chip-block { background: rgba(248,113,113,0.1); border-color: rgba(248,113,113,0.35); color: #F87171; }
    .chip-allow { background: rgba(74,222,128,0.1); border-color: rgba(74,222,128,0.35); color: #4ADE80; }
  </style>
</head>
<body>
  <span class="component-label">canActivate guard</span>
  <div class="app">
    <div class="navbar">
      <span class="logo">📚 Biblioteca</span>
      <div class="nav-links">
        <a id="link-catalogo" onclick="navigate('catalogo')">Catálogo</a>
        <a id="link-perfil" onclick="navigate('perfil')">Perfil 🔒</a>
        <span class="auth-badge off" id="auth-badge">● no auth</span>
      </div>
    </div>
    <div class="outlet" id="outlet"></div>
    <div class="guard-log">
      <div class="guard-log-title">Guard log</div>
      <div id="guard-log-entries"></div>
    </div>
  </div>
  <script>
    var loggedIn = false;
    var logEntries = [];
    function addLog(type, msg) {
      logEntries.unshift({ type: type, msg: msg });
      if (logEntries.length > 4) logEntries.pop();
      document.getElementById('guard-log-entries').innerHTML = logEntries.map(function(e) {
        return '<div class="log-entry log-' + e.type + '">' + e.msg + '</div>';
      }).join('');
    }
    function updateAuthBadge() {
      var badge = document.getElementById('auth-badge');
      if (loggedIn) {
        badge.textContent = '● autenticado';
        badge.className = 'auth-badge on';
      } else {
        badge.textContent = '● no auth';
        badge.className = 'auth-badge off';
      }
    }
    function navigate(page) {
      document.querySelectorAll('.nav-links a').forEach(function(a) { a.classList.remove('activo'); });
      if (page === 'perfil') {
        if (!loggedIn) {
          addLog('redirect', 'canActivate → false → redirect /login?returnUrl=/perfil');
          showLogin();
          return;
        }
        addLog('ok', 'canActivate → true → /perfil activado');
        document.getElementById('link-perfil').classList.add('activo');
        showPerfil();
      } else if (page === 'catalogo') {
        document.getElementById('link-catalogo').classList.add('activo');
        addLog('ok', 'canActivate → true (ruta pública)');
        showCatalogo();
      } else if (page === 'login') {
        showLogin();
      }
    }
    function showCatalogo() {
      document.getElementById('outlet').innerHTML = '<div class="slide"><p class="pagina-title">Catálogo</p><p class="pagina-desc">Ruta pública — sin guard. Cualquier usuario puede acceder.</p></div>';
    }
    function showLogin() {
      document.getElementById('outlet').innerHTML = '<div class="slide"><div class="login-icon">🔐</div><p class="pagina-title" style="text-align:center">Iniciar sesión</p><p class="pagina-desc" style="text-align:center">El guard <code style="color:#A78BFA">canActivate</code> redirigió aquí porque no estás autenticado.</p><div style="text-align:center"><button class="btn btn-success" onclick="doLogin()">Entrar como invitado</button></div></div>';
    }
    function showPerfil() {
      document.getElementById('outlet').innerHTML = '<div class="slide"><p class="pagina-title">Perfil <span class="guard-chip chip-allow">✓ authGuard pasó</span></p><p class="pagina-desc">Ruta protegida — solo visible para usuarios autenticados.</p><button class="btn btn-danger" onclick="doLogout()">Cerrar sesión</button></div>';
    }
    function doLogin() {
      loggedIn = true;
      updateAuthBadge();
      addLog('ok', 'estaLogueado.set(true) → navigateByUrl(/perfil)');
      document.querySelectorAll('.nav-links a').forEach(function(a) { a.classList.remove('activo'); });
      document.getElementById('link-perfil').classList.add('activo');
      showPerfil();
    }
    function doLogout() {
      loggedIn = false;
      updateAuthBadge();
      addLog('block', 'estaLogueado.set(false) → vuelves al catálogo');
      navigate('catalogo');
    }
    addLog('ok', 'Router inicializado — rutas configuradas');
    navigate('catalogo');
  </script>
</body>
</html>`,
    aiContext:
      'El usuario está aprendiendo guards funcionales en Angular 19/20. Ha visto canActivate con autenticación y la diferencia entre devolver false vs UrlTree. Puede preguntar sobre canDeactivate, canMatch, canActivateChild, o cómo pasar datos al guard con route.data.',
    introMessage:
      'Esta lección muestra los guards funcionales de Angular — funciones que deciden si una ruta puede activarse.\n\nEl preview simula un `canActivate`: intenta navegar a "Perfil 🔒" sin estar logueado y observa cómo el guard intercepta la navegación y redirige al login. Luego entra y vuelve a intentarlo.\n\nSi quieres aprender sobre `canDeactivate` para proteger formularios, o sobre `canMatch` para rutas condicionales, pregúntame.',
    suggestedQuestions: [
      '¿Cuándo usar canDeactivate en lugar de canActivate?',
      '¿Puedo hacer una llamada HTTP async dentro de un guard?',
      '¿Cuál es la diferencia entre canActivate y canMatch?',
    ],
  },

  {
    id: 'L5.5',
    module: 5,
    moduleTitle: 'Routing y Navegación',
    title: 'Resolvers: Datos antes de renderizar',
    subtitle: 'ResolveFn<T> para pre-cargar datos en la ruta',
    estimatedMinutes: 14,
    xpReward: 140,
    prerequisites: ['L5.4'],
    nextLesson: 'L5.6',
    language: 'typescript',
    narrative: [
      {
        type: 'text',
        content:
          'Sin resolvers, el componente se monta primero y luego carga los datos — hay un flash de estado vacío. Con un resolver, Angular espera a que los datos estén listos antes de renderizar el componente. El usuario ve directamente la página con contenido, no un esqueleto en blanco.',
      },
      {
        type: 'tip',
        variant: 'info',
        content:
          '`ResolveFn<T>` es el tipo de un resolver funcional. Recibe el `ActivatedRouteSnapshot` y el `RouterStateSnapshot`, puede usar `inject()` para acceder a servicios, y devuelve un valor, una Promise, o un Observable. Angular espera a que se resuelva antes de activar la ruta.',
      },
      {
        type: 'text',
        content:
          'El resolver se configura en la ruta con `resolve: { libro: libroResolver }`. El componente accede a los datos de dos formas: con `input()` si tienes `withComponentInputBinding()` activado (el input se llama igual que la clave del resolver), o con `inject(ActivatedRoute).snapshot.data["libro"]`.',
      },
      {
        type: 'tip',
        variant: 'angular',
        content:
          'Los resolvers son perfectos para pre-cargar datos críticos de SEO (Angular Universal / SSR) o cuando quieres evitar que el componente maneje el estado de carga. Para datos secundarios o actualizaciones en background, considera cargarlos dentro del componente con un signal.',
      },
      {
        type: 'checkpoint',
        question: '¿Cuándo renderiza Angular el componente cuando hay un resolver activo?',
        options: [
          'Inmediatamente — el resolver carga los datos en paralelo',
          'Solo después de que el resolver devuelva (o resuelva) su valor',
          'Después de ngOnInit',
          'Solo en producción',
        ],
        correct: 1,
        explanation:
          'Angular espera a que todos los resolvers de una ruta completen antes de activar el componente. El componente se monta con los datos ya disponibles. Esto elimina el estado de carga vacío, pero añade latencia perceptible en la navegación si el resolver es lento.',
      },
    ],
    starterCode: `import {
  ResolveFn, ActivatedRouteSnapshot, RouterStateSnapshot,
  provideRouter, withComponentInputBinding, Router
} from '@angular/router';
import { inject } from '@angular/core';
import { Component, input, ChangeDetectionStrategy } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';

// 📚 Biblioteca Angular — Resolvers
// El componente recibe el libro ya cargado — sin estado de carga en el template

interface Libro {
  id: number;
  titulo: string;
  autor: string;
  descripcion: string;
  paginas: number;
}

const LIBROS: Libro[] = [
  { id: 1, titulo: 'Clean Code', autor: 'Robert C. Martin', descripcion: 'Principios para código limpio y mantenible.', paginas: 431 },
  { id: 2, titulo: 'Refactoring', autor: 'Martin Fowler', descripcion: 'Técnicas para mejorar el diseño del código existente.', paginas: 448 },
];

// ── Servicio simulado ────────────────────────────────────────
function cargarLibro(id: number): Promise<Libro | null> {
  return new Promise(resolve =>
    setTimeout(() => resolve(LIBROS.find(l => l.id === id) ?? null), 600)
  );
}

// ── Resolver funcional ────────────────────────────────────────
export const libroResolver: ResolveFn<Libro | null> = (
  route: ActivatedRouteSnapshot,
  _state: RouterStateSnapshot
) => {
  const router = inject(Router);
  const id = Number(route.paramMap.get('id'));

  return cargarLibro(id).then(libro => {
    if (!libro) {
      // Si el libro no existe, redirigimos al catálogo
      router.navigate(['/catalogo']);
      return null;
    }
    return libro;
  });
};

// ── Componente de detalle ────────────────────────────────────
@Component({
  selector: 'app-libro-detalle',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: \`
    <div class="detalle">
      @if (libro()) {
        <!-- El resolver garantiza que libro() ya tiene valor al montar -->
        <h1>{{ libro()!.titulo }}</h1>
        <p class="autor">{{ libro()!.autor }}</p>
        <p class="desc">{{ libro()!.descripcion }}</p>
        <span class="paginas">{{ libro()!.paginas }} páginas</span>
      }
    </div>
  \`,
})
export class LibroDetalleComponent {
  // El input "libro" coincide con la clave del resolve
  // withComponentInputBinding() lo rellena automáticamente
  readonly libro = input<Libro | null>();
}

const routes = [
  {
    path: 'libro/:id',
    component: LibroDetalleComponent,
    resolve: { libro: libroResolver }, // 🔑 clave "libro" → input "libro"
  },
];

bootstrapApplication(AppComponent, {
  providers: [provideRouter(routes, withComponentInputBinding())],
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
    .component-label { position: fixed; top: 12px; right: 12px; font-family: 'JetBrains Mono', monospace; font-size: 0.625rem; color: #8B949E; background: #161B22; border: 1px solid #30363D; padding: 0.2em 0.5em; border-radius: 4px; }
    .app { background: #161B22; border: 1px solid #30363D; border-radius: 12px; overflow: hidden; width: 100%; max-width: 460px; }
    .navbar { display: flex; align-items: center; justify-content: space-between; padding: 0.75rem 1.25rem; background: #0D1117; border-bottom: 1px solid #30363D; }
    .logo { font-weight: 700; font-size: 0.875rem; }
    .url-bar { font-family: 'JetBrains Mono', monospace; font-size: 0.72rem; color: #8B5CF6; background: rgba(139,92,246,0.08); border: 1px solid rgba(139,92,246,0.2); padding: 0.2em 0.6em; border-radius: 4px; }
    .outlet { padding: 1.25rem; min-height: 220px; position: relative; }
    .timeline { border-top: 1px solid #21262D; padding: 0.875rem 1.25rem; background: #0D1117; }
    .tl-title { font-family: 'JetBrains Mono', monospace; font-size: 0.68rem; color: #8B949E; margin-bottom: 0.6rem; }
    .tl-steps { display: flex; gap: 0; align-items: center; }
    .tl-step { display: flex; flex-direction: column; align-items: center; gap: 0.3rem; flex: 1; position: relative; }
    .tl-step:not(:last-child)::after { content: ''; position: absolute; top: 10px; left: 50%; width: 100%; height: 2px; background: #30363D; z-index: 0; }
    .tl-dot { width: 20px; height: 20px; border-radius: 50%; border: 2px solid #30363D; background: #161B22; display: flex; align-items: center; justify-content: center; font-size: 0.6rem; z-index: 1; transition: all 0.3s ease; }
    .tl-dot.done { border-color: #22c55e; background: rgba(34,197,94,0.15); color: #4ADE80; }
    .tl-dot.active { border-color: #8B5CF6; background: rgba(139,92,246,0.15); animation: pulse-dot 1s infinite; }
    @keyframes pulse-dot { 0%,100% { box-shadow: 0 0 0 0 rgba(139,92,246,0.4); } 50% { box-shadow: 0 0 0 4px rgba(139,92,246,0); } }
    .tl-label { font-size: 0.62rem; color: #8B949E; text-align: center; white-space: nowrap; }
    .slide { animation: slide-in 0.25s ease; }
    @keyframes slide-in { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
    .catalogo-title { font-size: 1rem; font-weight: 700; margin-bottom: 1rem; }
    .libro-btn { display: flex; align-items: center; justify-content: space-between; width: 100%; padding: 0.7rem 0.875rem; background: #21262D; border: 1px solid #30363D; border-radius: 8px; margin-bottom: 0.5rem; cursor: pointer; font-family: inherit; font-size: 0.83rem; color: #E6EDF3; text-align: left; transition: border-color 150ms; }
    .libro-btn:hover { border-color: #7C3AED; }
    .libro-btn strong { display: block; font-size: 0.85rem; }
    .libro-btn span { font-size: 0.75rem; color: #8B949E; }
    .detalle-title { font-size: 1.1rem; font-weight: 700; margin-bottom: 0.4rem; }
    .detalle-autor { font-size: 0.83rem; color: #8B949E; margin-bottom: 0.75rem; }
    .detalle-desc { font-size: 0.83rem; color: #8B949E; line-height: 1.6; margin-bottom: 0.75rem; }
    .detalle-footer { display: flex; align-items: center; justify-content: space-between; }
    .paginas-badge { font-size: 0.75rem; background: #21262D; border: 1px solid #30363D; border-radius: 6px; padding: 0.2em 0.6em; color: #8B949E; }
    .resolver-badge { font-family: 'JetBrains Mono', monospace; font-size: 0.68rem; background: rgba(34,197,94,0.1); border: 1px solid rgba(34,197,94,0.3); color: #4ADE80; padding: 0.15em 0.5em; border-radius: 4px; }
    .back-btn { background: none; border: none; color: #8B5CF6; cursor: pointer; font-family: inherit; font-size: 0.8rem; margin-bottom: 1rem; padding: 0; }
    .back-btn:hover { text-decoration: underline; }
    .resolving { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 0.75rem; height: 100px; }
    .resolving-text { font-size: 0.83rem; color: #8B949E; }
    .spinner { width: 28px; height: 28px; border: 3px solid #30363D; border-top-color: #8B5CF6; border-radius: 50%; animation: spin 0.7s linear infinite; }
    @keyframes spin { to { transform: rotate(360deg); } }
  </style>
</head>
<body>
  <span class="component-label">ResolveFn + withComponentInputBinding()</span>
  <div class="app">
    <div class="navbar">
      <span class="logo">📚 Biblioteca</span>
      <span class="url-bar" id="url-bar">/catalogo</span>
    </div>
    <div class="outlet" id="outlet"></div>
    <div class="timeline">
      <div class="tl-title">Ciclo de navegación con resolver</div>
      <div class="tl-steps">
        <div class="tl-step"><div class="tl-dot" id="step1"></div><span class="tl-label">Click enlace</span></div>
        <div class="tl-step"><div class="tl-dot" id="step2"></div><span class="tl-label">Guard check</span></div>
        <div class="tl-step"><div class="tl-dot" id="step3"></div><span class="tl-label">Resolver</span></div>
        <div class="tl-step"><div class="tl-dot" id="step4"></div><span class="tl-label">Componente</span></div>
      </div>
    </div>
  </div>
  <script>
    var libros = [
      { id: 1, titulo: 'Clean Code', autor: 'Robert C. Martin', descripcion: 'Principios para escribir código limpio y mantenible.', paginas: 431 },
      { id: 2, titulo: 'Refactoring', autor: 'Martin Fowler', descripcion: 'Técnicas para mejorar el diseño del código existente.', paginas: 448 },
    ];
    function resetSteps() {
      [1,2,3,4].forEach(function(i) {
        document.getElementById('step' + i).className = 'tl-dot';
        document.getElementById('step' + i).textContent = '';
      });
    }
    function setStep(i, state) {
      var el = document.getElementById('step' + i);
      el.className = 'tl-dot ' + state;
      el.textContent = state === 'done' ? '✓' : '';
    }
    function showCatalogo() {
      document.getElementById('url-bar').textContent = '/catalogo';
      resetSteps();
      document.getElementById('outlet').innerHTML = '<div class="slide"><p class="catalogo-title">Catálogo</p>' +
        libros.map(function(l) {
          return '<button class="libro-btn" onclick="navigateToLibro(' + l.id + ')"><div><strong>' + l.titulo + '</strong><span>' + l.autor + '</span></div><span style="color:#8B949E;font-size:0.75rem">→</span></button>';
        }).join('') + '</div>';
    }
    function navigateToLibro(id) {
      resetSteps();
      setStep(1, 'done');
      setTimeout(function() { setStep(2, 'done'); }, 80);
      document.getElementById('url-bar').textContent = '/libro/' + id + ' (resolviendo...)';
      document.getElementById('outlet').innerHTML = '<div class="resolving"><div class="spinner"></div><p class="resolving-text">libroResolver ejecutándose...</p></div>';
      setStep(3, 'active');
      setTimeout(function() {
        setStep(3, 'done');
        setStep(4, 'active');
        var l = libros.find(function(x) { return x.id === id; });
        setTimeout(function() {
          setStep(4, 'done');
          document.getElementById('url-bar').textContent = '/libro/' + id;
          document.getElementById('outlet').innerHTML = '<div class="slide">' +
            '<button class="back-btn" onclick="showCatalogo()">← Volver al catálogo</button>' +
            '<p class="detalle-title">' + l.titulo + '</p>' +
            '<p class="detalle-autor">' + l.autor + '</p>' +
            '<p class="detalle-desc">' + l.descripcion + '</p>' +
            '<div class="detalle-footer"><span class="paginas-badge">' + l.paginas + ' páginas</span><span class="resolver-badge">✓ resolver completó</span></div></div>';
        }, 100);
      }, 700);
    }
    showCatalogo();
  </script>
</body>
</html>`,
    aiContext:
      'El usuario está aprendiendo ResolveFn en Angular 19/20. Ha visto cómo el resolver pre-carga el libro antes de renderizar el componente, y cómo recibir los datos resueltos como input() con withComponentInputBinding(). Puede preguntar sobre route.data vs input(), cómo manejar errores en el resolver, o cuándo usar resolver vs cargar datos en ngOnInit.',
    introMessage:
      'Esta lección muestra los resolvers de Angular — la forma de pre-cargar datos antes de que el componente se renderice.\n\nEl preview visualiza las fases de navegación: click → guard check → resolver → componente. El componente solo se monta cuando `libroResolver` ha completado. Observa que la URL muestra "(resolviendo...)" mientras espera.\n\nSi quieres saber cuándo usar resolvers vs cargar datos en el componente, pregúntame.',
    suggestedQuestions: [
      '¿Cuándo es mejor cargar datos en el componente en vez de un resolver?',
      '¿Cómo manejo un error dentro de un resolver?',
      '¿Cuál es la diferencia entre route.data y route.snapshot.data?',
    ],
  },

  {
    id: 'L5.6',
    module: 5,
    moduleTitle: 'Routing y Navegación',
    title: 'Router avanzado: Rutas anidadas y layouts',
    subtitle: 'Child routes, RouterOutlet anidado y wildcard **',
    estimatedMinutes: 18,
    xpReward: 160,
    prerequisites: ['L5.5'],
    nextLesson: 'L6.1',
    language: 'typescript',
    achievements: [
      {
        id: 'navigator',
        name: 'Navigator 🗺️',
        description: 'Dominaste el sistema de routing de Angular',
        icon: '🗺️',
      },
    ],
    narrative: [
      {
        type: 'text',
        content:
          'Las rutas anidadas permiten que un componente de layout tenga su propio `<router-outlet>`. La URL `/biblioteca/catalogo` activa el layout `BibliotecaComponent` (con su sidebar y nav) y dentro de él renderiza `CatalogoComponent`. Todas las rutas hijas comparten el mismo layout sin repetir código.',
      },
      {
        type: 'tip',
        variant: 'info',
        content:
          'Las rutas hijas se definen con la propiedad `children` en la ruta padre. El componente padre debe tener un `<router-outlet>` en su template — ese es el slot donde se renderizan los hijos. El padre sigue visible mientras el hijo cambia.',
      },
      {
        type: 'text',
        content:
          'Tres patrones esenciales que completan la configuración: `pathMatch: "full"` en las redirecciones (solo redirige cuando el path coincide exactamente), `redirectTo` para aliases y rutas por defecto, y la ruta wildcard `{ path: "**", component: NotFoundComponent }` que captura cualquier URL no reconocida — siempre debe ir al final del array.',
      },
      {
        type: 'tip',
        variant: 'angular',
        content:
          'Los layouts anidados son el patrón estándar para apps con dashboard. El layout exterior gestiona nav, sidebar, header — los hijos solo se preocupan de su contenido. Puedes anidar múltiples niveles, aunque más de dos niveles suele indicar que la arquitectura se está complicando innecesariamente.',
      },
      {
        type: 'checkpoint',
        question: '¿Dónde debe ir la ruta wildcard ** en el array de rutas?',
        options: [
          'Al principio, para capturar todas las rutas no definidas antes',
          'Justo antes de las rutas con parámetros (:id)',
          'Al final del array, después de todas las demás rutas',
          'Su posición no importa',
        ],
        correct: 2,
        explanation:
          'El router de Angular evalúa las rutas en orden. Si ** está al principio, capturará todas las URLs antes de que las rutas reales tengan oportunidad de coincidir. Siempre debe ser la última ruta del array para que solo se active cuando ninguna otra ruta coincide.',
      },
    ],
    starterCode: `import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, provideRouter } from '@angular/router';
import { bootstrapApplication } from '@angular/platform-browser';

// 📚 Biblioteca Angular — Rutas anidadas
// El layout de la biblioteca se comparte entre todas las rutas hijas

// ── Componentes hijos (solo contenido) ───────────────────────
@Component({
  selector: 'app-catalogo',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: \`<div class="contenido-hijo"><h3>📖 Catálogo</h3><p>Lista de libros disponibles.</p></div>\`,
})
export class CatalogoComponent {}

@Component({
  selector: 'app-favoritos',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: \`<div class="contenido-hijo"><h3>❤️ Favoritos</h3><p>Tus libros guardados.</p></div>\`,
})
export class FavoritosComponent {}

@Component({
  selector: 'app-perfil',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: \`<div class="contenido-hijo"><h3>👤 Perfil</h3><p>Tu información de lector.</p></div>\`,
})
export class PerfilComponent {}

@Component({
  selector: 'app-not-found',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
  template: \`
    <div class="not-found">
      <h2>404</h2>
      <p>Página no encontrada</p>
      <a routerLink="/biblioteca/catalogo">Volver al catálogo</a>
    </div>
  \`,
})
export class NotFoundComponent {}

// ── Layout de biblioteca (componente padre con subnav) ────────
@Component({
  selector: 'app-biblioteca-layout',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: \`
    <div class="biblioteca-layout">
      <aside class="sidebar">
        <h2>📚 Biblioteca</h2>
        <nav>
          <!-- routerLink relativo — dentro del contexto /biblioteca -->
          <a routerLink="catalogo" routerLinkActive="activo">Catálogo</a>
          <a routerLink="favoritos" routerLinkActive="activo">Favoritos</a>
          <a routerLink="perfil" routerLinkActive="activo">Perfil</a>
        </nav>
      </aside>

      <main class="area-contenido">
        <!-- router-outlet ANIDADO — renderiza las rutas hijas -->
        <router-outlet />
      </main>
    </div>
  \`,
})
export class BibliotecaLayoutComponent {}

// ── Configuración de rutas ────────────────────────────────────
const routes = [
  // Redirección raíz
  { path: '', redirectTo: '/biblioteca/catalogo', pathMatch: 'full' as const },

  // Ruta padre con children — comparte layout
  {
    path: 'biblioteca',
    component: BibliotecaLayoutComponent,
    children: [
      { path: '', redirectTo: 'catalogo', pathMatch: 'full' as const },
      { path: 'catalogo',  component: CatalogoComponent },
      { path: 'favoritos', component: FavoritosComponent },
      { path: 'perfil',    component: PerfilComponent },
    ],
  },

  // Wildcard — SIEMPRE al final
  { path: '**', component: NotFoundComponent },
];

bootstrapApplication(AppComponent, {
  providers: [provideRouter(routes)],
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
    .component-label { position: fixed; top: 12px; right: 12px; font-family: 'JetBrains Mono', monospace; font-size: 0.625rem; color: #8B949E; background: #161B22; border: 1px solid #30363D; padding: 0.2em 0.5em; border-radius: 4px; }
    .wrapper { width: 100%; max-width: 520px; display: flex; flex-direction: column; gap: 0.75rem; }
    .top-nav { background: #161B22; border: 1px solid #30363D; border-radius: 10px; padding: 0.75rem 1.25rem; display: flex; align-items: center; justify-content: space-between; }
    .top-logo { font-weight: 700; font-size: 0.875rem; }
    .url-pill { font-family: 'JetBrains Mono', monospace; font-size: 0.7rem; background: rgba(139,92,246,0.08); border: 1px solid rgba(139,92,246,0.25); color: #A78BFA; padding: 0.2em 0.7em; border-radius: 20px; }
    .app-shell { background: #161B22; border: 1px solid #30363D; border-radius: 10px; overflow: hidden; display: flex; min-height: 240px; }
    .sidebar { width: 160px; flex-shrink: 0; background: #0D1117; border-right: 1px solid #30363D; padding: 1.25rem 0.75rem; display: flex; flex-direction: column; gap: 0.25rem; }
    .sidebar-title { font-size: 0.875rem; font-weight: 700; margin-bottom: 0.75rem; padding-left: 0.5rem; }
    .sidebar a { display: block; padding: 0.45rem 0.6rem; border-radius: 6px; font-size: 0.83rem; font-weight: 500; color: #8B949E; text-decoration: none; cursor: pointer; transition: all 150ms; border: 1px solid transparent; }
    .sidebar a:hover { color: #E6EDF3; background: #21262D; }
    .sidebar a.activo { color: #A78BFA; background: rgba(139,92,246,0.12); border-color: rgba(139,92,246,0.25); }
    .layout-badge { font-family: 'JetBrains Mono', monospace; font-size: 0.58rem; color: #8B949E; background: #21262D; border: 1px solid #30363D; padding: 0.1em 0.4em; border-radius: 3px; margin-top: auto; text-align: center; }
    .content-area { flex: 1; padding: 1.5rem; position: relative; }
    .outlet-label { position: absolute; top: 8px; right: 10px; font-family: 'JetBrains Mono', monospace; font-size: 0.58rem; color: #8B949E; opacity: 0.6; }
    .slide { animation: slide-in 0.2s ease; }
    @keyframes slide-in { from { opacity: 0; transform: translateX(8px); } to { opacity: 1; transform: translateX(0); } }
    .child-title { font-size: 1.05rem; font-weight: 700; margin-bottom: 0.5rem; }
    .child-desc { font-size: 0.83rem; color: #8B949E; line-height: 1.6; margin-bottom: 1rem; }
    .items-list { display: flex; flex-direction: column; gap: 0.4rem; }
    .item-row { background: #21262D; border: 1px solid #30363D; border-radius: 6px; padding: 0.5rem 0.75rem; font-size: 0.8rem; color: #E6EDF3; }
    .not-found-area { display: flex; flex-direction: column; align-items: center; justify-content: center; height: 140px; gap: 0.4rem; }
    .not-found-code { font-size: 2.5rem; font-weight: 800; color: #F87171; line-height: 1; }
    .not-found-msg { font-size: 0.83rem; color: #8B949E; }
    .not-found-link { font-size: 0.8rem; color: #8B5CF6; cursor: pointer; background: none; border: none; font-family: inherit; }
    .not-found-link:hover { text-decoration: underline; }
    .routes-panel { background: #161B22; border: 1px solid #30363D; border-radius: 10px; padding: 0.875rem 1.25rem; }
    .routes-title { font-family: 'JetBrains Mono', monospace; font-size: 0.68rem; color: #8B949E; margin-bottom: 0.6rem; }
    .route-row { display: flex; align-items: center; gap: 0.5rem; padding: 0.3rem 0; font-family: 'JetBrains Mono', monospace; font-size: 0.72rem; border-bottom: 1px solid #21262D18; }
    .route-row:last-child { border-bottom: none; }
    .route-path { color: #E6EDF3; flex: 1; }
    .route-path.active-route { color: #A78BFA; font-weight: 600; }
    .route-type { font-size: 0.65rem; padding: 0.1em 0.4em; border-radius: 3px; border: 1px solid; }
    .type-layout { background: rgba(139,92,246,0.1); border-color: rgba(139,92,246,0.3); color: #A78BFA; }
    .type-child { background: rgba(34,197,94,0.08); border-color: rgba(34,197,94,0.25); color: #4ADE80; }
    .type-wildcard { background: rgba(249,115,22,0.08); border-color: rgba(249,115,22,0.25); color: #FB923C; }
    .type-redirect { background: rgba(96,165,250,0.08); border-color: rgba(96,165,250,0.25); color: #60A5FA; }
    .btn-404 { background: #21262D; border: 1px solid #30363D; color: #8B949E; border-radius: 6px; padding: 0.35rem 0.7rem; font-size: 0.75rem; cursor: pointer; font-family: inherit; transition: all 150ms; }
    .btn-404:hover { border-color: #F87171; color: #F87171; }
  </style>
</head>
<body>
  <span class="component-label">child routes + nested router-outlet</span>
  <div class="wrapper">
    <div class="top-nav">
      <span class="top-logo">📚 Biblioteca App</span>
      <span class="url-pill" id="url-bar">/biblioteca/catalogo</span>
      <button class="btn-404" onclick="navigate404()">Test 404</button>
    </div>
    <div class="app-shell" id="app-shell">
      <aside class="sidebar">
        <div class="sidebar-title">📚 Biblioteca</div>
        <a id="link-catalogo" class="activo" onclick="navigateChild('catalogo')">Catálogo</a>
        <a id="link-favoritos" onclick="navigateChild('favoritos')">Favoritos</a>
        <a id="link-perfil" onclick="navigateChild('perfil')">Perfil</a>
        <div class="layout-badge">BibliotecaLayout</div>
      </aside>
      <div class="content-area">
        <span class="outlet-label">router-outlet (hijo)</span>
        <div id="child-outlet"></div>
      </div>
    </div>
    <div class="routes-panel">
      <div class="routes-title">Árbol de rutas activo</div>
      <div class="route-row"><span class="route-path" id="rt-root">/biblioteca</span><span class="route-type type-layout">layout</span></div>
      <div class="route-row" style="padding-left:1rem"><span class="route-path" id="rt-child">&nbsp;&nbsp;/catalogo</span><span class="route-type type-child">child</span></div>
      <div class="route-row"><span class="route-path">/biblioteca/favoritos</span><span class="route-type type-child">child</span></div>
      <div class="route-row"><span class="route-path">/biblioteca/perfil</span><span class="route-type type-child">child</span></div>
      <div class="route-row"><span class="route-path">/**</span><span class="route-type type-wildcard">wildcard</span></div>
    </div>
  </div>
  <script>
    var pages = {
      catalogo: {
        html: function() {
          return '<div class="slide"><p class="child-title">Catálogo</p><p class="child-desc">Ruta hija activa dentro del layout.</p><div class="items-list"><div class="item-row">Clean Code — R. C. Martin</div><div class="item-row">Refactoring — M. Fowler</div><div class="item-row">Design Patterns — GoF</div></div></div>';
        }
      },
      favoritos: {
        html: function() {
          return '<div class="slide"><p class="child-title">Favoritos</p><p class="child-desc">El sidebar sigue visible — solo cambió la ruta hija.</p><div class="items-list"><div class="item-row">❤️ Clean Code</div><div class="item-row">❤️ Pragmatic Programmer</div></div></div>';
        }
      },
      perfil: {
        html: function() {
          return '<div class="slide"><p class="child-title">Perfil</p><p class="child-desc">Misma vista, mismo layout. La ruta hija es /biblioteca/perfil.</p><div class="items-list"><div class="item-row">👤 Miguel · Lector ávido</div><div class="item-row">📚 24 libros leídos</div></div></div>';
        }
      }
    };
    function navigateChild(page) {
      document.querySelectorAll('.sidebar a').forEach(function(a) { a.classList.remove('activo'); });
      document.getElementById('link-' + page).classList.add('activo');
      document.getElementById('url-bar').textContent = '/biblioteca/' + page;
      document.getElementById('child-outlet').innerHTML = pages[page].html();
      document.getElementById('app-shell').style.display = 'flex';
    }
    function navigate404() {
      document.querySelectorAll('.sidebar a').forEach(function(a) { a.classList.remove('activo'); });
      document.getElementById('url-bar').textContent = '/ruta-inexistente';
      document.getElementById('app-shell').innerHTML = '<div class="not-found-area" style="width:100%;margin:auto"><div class="not-found-code">404</div><p class="not-found-msg">Ruta no encontrada — capturada por **</p><button class="not-found-link" onclick="resetToApp()">← Volver al catálogo</button></div>';
    }
    function resetToApp() {
      document.getElementById('app-shell').innerHTML = '<aside class="sidebar"><div class="sidebar-title">📚 Biblioteca</div><a id="link-catalogo" onclick="navigateChild(\'catalogo\')">Catálogo</a><a id="link-favoritos" onclick="navigateChild(\'favoritos\')">Favoritos</a><a id="link-perfil" onclick="navigateChild(\'perfil\')">Perfil</a><div class="layout-badge">BibliotecaLayout</div></aside><div class="content-area"><span class="outlet-label">router-outlet (hijo)</span><div id="child-outlet"></div></div>';
      navigateChild('catalogo');
    }
    navigateChild('catalogo');
  </script>
</body>
</html>`,
    aiContext:
      'El usuario está terminando el módulo 5 sobre routing. Ha visto rutas anidadas con children, el RouterOutlet en el componente de layout, pathMatch full, redirecciones, y la ruta wildcard **. Puede preguntar sobre rutas anidadas profundas, outlet con nombre, router-outlet secundario, o cómo funciona la jerarquía de rutas.',
    introMessage:
      'Esta lección cierra el módulo de Routing con el patrón más completo: rutas anidadas con layouts compartidos.\n\nEl layout de la biblioteca (sidebar + área de contenido) solo se define una vez. Las rutas hijas (`/catalogo`, `/favoritos`, `/perfil`) se renderizan en el `<router-outlet>` del layout sin repetir el sidebar. Prueba el botón "Test 404" para ver la ruta wildcard en acción.\n\nSi tienes dudas sobre outlets con nombre, rutas anidadas profundas, o la jerarquía de rutas, pregúntame.',
    suggestedQuestions: [
      '¿Puedo tener más de un router-outlet en la misma página?',
      '¿Cómo funciona el routerLink relativo dentro de un componente hijo?',
      '¿Qué diferencia hay entre pathMatch "full" y "prefix"?',
    ],
  },
];
