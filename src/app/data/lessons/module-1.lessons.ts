import type { Lesson } from '../../core/models/lesson.model';

export const MODULE_1_LESSONS: Lesson[] = [
  {
    id: 'L1.1',
    module: 1,
    moduleTitle: 'Fundamentos',
    title: '¿Qué es Angular?',
    subtitle: 'Historia, filosofía y por qué existe este framework',
    estimatedMinutes: 12,
    narrative: [
      {
        type: 'text',
        content:
          'Angular nació en 2009 como AngularJS, un proyecto interno de Google creado por Miško Hevery para simplificar el desarrollo de aplicaciones web dinámicas. En aquella época, jQuery reinaba supremo y construir interfaces complejas requería malabarismos con el DOM manual.',
      },
      {
        type: 'text',
        content:
          'En 2016, Google reescribió Angular desde cero con TypeScript y lo llamó simplemente "Angular" (o Angular 2+). No fue una actualización — fue un framework completamente diferente. Esta decisión radical, aunque polémica, dio a Angular una base sólida que ha evolucionado consistentemente hasta hoy.',
      },
      {
        type: 'text',
        content:
          'Lo que distingue a Angular de otros frameworks es su naturaleza "opinionated" — tiene una opinión sobre cómo se deben hacer las cosas. Viene con un router oficial, un sistema de formularios oficial, un cliente HTTP oficial y un sistema de inyección de dependencias oficial. No tienes que elegir entre 50 librerías de estado — Angular ya tomó esas decisiones por ti.',
      },
      {
        type: 'tip',
        variant: 'angular',
        content:
          'Angular es el único framework mainstream que viene con TODO incluido: router, HTTP client, forms, DI container, testing utilities, CLI, y ahora Signals para el estado. No necesitas npm install para las funcionalidades core.',
      },
      {
        type: 'comparison',
        leftLabel: 'Angular',
        left:
          'Framework completo. Todo viene incluido. TypeScript es obligatorio. Estructura de proyecto definida. Curva de aprendizaje más empinada, pero código más predecible en equipos grandes. Mantenido por Google con ciclos de release predecibles (cada 6 meses).',
        rightLabel: 'React / Vue',
        right:
          'Librería (React) o framework progresivo (Vue). Tienes que elegir tus propias librerías para routing, estado, HTTP, etc. Más flexibilidad, pero también más decisiones. React especialmente requiere armar tu propio stack.',
      },
      {
        type: 'text',
        content:
          'Hoy (2025), Angular está en la versión 20. Las grandes adiciones recientes han sido: Signals (v17, estables en v19), Server-Side Rendering mejorado, el nuevo Control Flow (@if, @for), componentes deferidos con @defer, y la resource API para datos asíncronos. Angular moderno es significativamente diferente al Angular de 2016.',
      },
      {
        type: 'tip',
        variant: 'info',
        content:
          'Si vienes de React: la mayor diferencia conceptual es que Angular usa TypeScript de verdad (con todo el tipado), inyección de dependencias como patrón central, y módulos/componentes más estructurados. El template HTML de Angular es más potente que JSX para casos complejos.',
      },
      {
        type: 'text',
        content:
          'Angular es especialmente popular en empresas grandes y aplicaciones enterprise: bancos, aseguradoras, plataformas de gestión interna, ERPs. La razón es que su estructura rígida escala bien en equipos de 10-100 desarrolladores — todo el mundo escribe código de la misma manera.',
      },
    ],
    starterCode: `import { Component } from '@angular/core';

// La evolución de Angular — de AngularJS a la era de los Signals
// Observa cómo cada versión marcó un punto de inflexión

interface Hito {
  anio: number;
  version: string;
  descripcion: string;
  destacado?: boolean;
}

@Component({
  selector: 'app-angular-timeline',
  standalone: true,
  template: \`
    <div class="timeline-container">
      <h2>La evolución de Angular</h2>
      <div class="timeline">
        @for (hito of hitos; track hito.anio) {
          <div class="hito" [class.destacado]="hito.destacado">
            <div class="hito-anio">{{ hito.anio }}</div>
            <div class="hito-content">
              <strong>{{ hito.version }}</strong>
              <span>{{ hito.descripcion }}</span>
            </div>
          </div>
        }
      </div>
    </div>
  \`,
})
export class AngularTimelineComponent {
  readonly hitos: Hito[] = [
    { anio: 2010, version: 'AngularJS (1.x)', descripcion: 'El framework original — two-way binding revolucionario' },
    { anio: 2016, version: 'Angular 2', descripcion: 'Reescritura completa en TypeScript — componentes y DI' },
    { anio: 2022, version: 'Angular 14', descripcion: 'Standalone components — adiós a NgModules obligatorios' },
    { anio: 2023, version: 'Angular 16', descripcion: 'Signals — nueva primitiva reactiva nativa', destacado: true },
    { anio: 2024, version: 'Angular 19', descripcion: 'Zoneless, signal inputs/outputs, incremental hydration', destacado: true },
    { anio: 2025, version: 'Angular 20', descripcion: 'Signals estables, linkedSignal, resource API', destacado: true },
  ];
}`,
    solutionCode: '',
    previewHtml: `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Inter', sans-serif;
      background: #0D1117;
      color: #E6EDF3;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 2rem;
    }
    .component-label {
      position: fixed;
      top: 12px;
      right: 12px;
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.625rem;
      color: #8B949E;
      background: #161B22;
      border: 1px solid #30363D;
      padding: 0.2em 0.5em;
      border-radius: 4px;
    }
    .timeline-container {
      width: 100%;
      max-width: 560px;
    }
    h2 {
      font-size: 1.125rem;
      font-weight: 700;
      color: #E6EDF3;
      margin-bottom: 1.5rem;
      text-align: center;
      letter-spacing: -0.01em;
    }
    .timeline {
      display: flex;
      flex-direction: column;
      gap: 0;
      position: relative;
    }
    .timeline::before {
      content: '';
      position: absolute;
      left: 3.25rem;
      top: 0;
      bottom: 0;
      width: 2px;
      background: #21262D;
    }
    .hito {
      display: flex;
      align-items: flex-start;
      gap: 1rem;
      padding: 0.75rem 0;
      position: relative;
    }
    .hito::before {
      content: '';
      position: absolute;
      left: calc(3.25rem - 3px);
      top: 1.1rem;
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #30363D;
      border: 2px solid #21262D;
      z-index: 1;
    }
    .hito.destacado::before {
      background: #8B5CF6;
      border-color: #8B5CF6;
      box-shadow: 0 0 8px rgba(139,92,246,0.5);
    }
    .hito-anio {
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.75rem;
      font-weight: 500;
      color: #8B949E;
      min-width: 2.75rem;
      padding-top: 0.1rem;
      text-align: right;
    }
    .hito.destacado .hito-anio {
      color: #A78BFA;
    }
    .hito-content {
      padding-left: 0.75rem;
      display: flex;
      flex-direction: column;
      gap: 0.15rem;
    }
    .hito-content strong {
      font-size: 0.875rem;
      font-weight: 600;
      color: #E6EDF3;
    }
    .hito.destacado .hito-content strong {
      color: #C4B5FD;
    }
    .hito.destacado {
      background: rgba(139,92,246,0.04);
      border-radius: 8px;
      box-shadow: -2px 0 0 rgba(139,92,246,0.3);
    }
    .hito-content span {
      font-size: 0.8125rem;
      color: #8B949E;
      line-height: 1.4;
    }
  </style>
</head>
<body>
  <span class="component-label">app-angular-timeline</span>
  <div class="timeline-container">
    <h2>La evolución de Angular</h2>
    <div class="timeline">
      <div class="hito">
        <div class="hito-anio">2010</div>
        <div class="hito-content">
          <strong>AngularJS (1.x)</strong>
          <span>El framework original — two-way binding revolucionario</span>
        </div>
      </div>
      <div class="hito">
        <div class="hito-anio">2016</div>
        <div class="hito-content">
          <strong>Angular 2</strong>
          <span>Reescritura completa en TypeScript — componentes y DI</span>
        </div>
      </div>
      <div class="hito">
        <div class="hito-anio">2022</div>
        <div class="hito-content">
          <strong>Angular 14</strong>
          <span>Standalone components — adiós a NgModules obligatorios</span>
        </div>
      </div>
      <div class="hito destacado">
        <div class="hito-anio">2023</div>
        <div class="hito-content">
          <strong>Angular 16</strong>
          <span>Signals — nueva primitiva reactiva nativa</span>
        </div>
      </div>
      <div class="hito destacado">
        <div class="hito-anio">2024</div>
        <div class="hito-content">
          <strong>Angular 19</strong>
          <span>Zoneless, signal inputs/outputs, incremental hydration</span>
        </div>
      </div>
      <div class="hito destacado">
        <div class="hito-anio">2025</div>
        <div class="hito-content">
          <strong>Angular 20</strong>
          <span>Signals estables, linkedSignal, resource API</span>
        </div>
      </div>
    </div>
  </div>
</body>
</html>`,
    language: 'typescript',
    aiContext:
      'El usuario está aprendiendo qué es Angular conceptualmente. Explica la filosofía del framework de forma accesible. Usa analogías: Angular es como comprar una cocina completamente equipada vs React que es comprar una cocina vacía y elegir cada electrodoméstico. Si preguntan sobre comparativas con otros frameworks, sé equilibrado y honesto. La versión actual es v19/v20.',
    introMessage: `Bienvenido al **Módulo 1: Fundamentos**. Esta primera lección es conceptual — el objetivo es entender qué es Angular y por qué existe antes de analizar su código.

**La narrativa de Teoría:**
La historia de Angular desde 2009 hasta hoy (v19/v20), qué lo distingue de React y Vue, y por qué es tan popular en proyectos enterprise.

**El código del panel Código:**
Muestra una timeline de la evolución de Angular — el patrón @for y los class bindings en acción. Obsérvalo, no te preocupes si no lo entiendes todo aún; lo diseccionaremos en las próximas lecciones.

**Lo que aprenderás:**
- La filosofía "opinionated" de Angular y qué significa en la práctica
- Qué incluye Angular de serie (router, HTTP client, forms, DI, CLI)
- La diferencia entre Angular, React y Vue en términos prácticos
- El estado actual del framework en 2025 (Signals, Control Flow, @defer)

Lee la narrativa a tu ritmo. Si tienes preguntas sobre Angular vs otros frameworks, o sobre qué esperar del módulo, pregúntame aquí.`,
    suggestedQuestions: [
      '¿Por qué Angular usa TypeScript obligatoriamente?',
      '¿Angular vs React: cuál debo aprender?',
      '¿Qué son los Angular Signals?',
      '¿Angular es complicado de aprender?',
    ],
    prerequisites: ['L0.3'],
    nextLesson: 'L1.2',
    xpReward: 75,
  },

  {
    id: 'L1.2',
    module: 1,
    moduleTitle: 'Fundamentos',
    title: 'Setup del entorno',
    subtitle: 'Todo lo que necesitas para desarrollar con Angular',
    estimatedMinutes: 15,
    narrative: [
      {
        type: 'text',
        content:
          'Para poder analizar Angular en tu propio entorno, necesitas configurarlo primero. El proceso es sencillo pero requiere algunos pasos concretos.',
      },
      {
        type: 'tip',
        variant: 'warning',
        content:
          'Requisito previo: necesitas Node.js versión 20 o superior instalado. Verifica con `node --version` en tu terminal. Si tienes una versión anterior, descarga la LTS desde nodejs.org.',
      },
      {
        type: 'text',
        content: 'Con Node.js instalado, instala el Angular CLI globalmente:',
      },
      {
        type: 'code',
        language: 'bash',
        content: 'npm install -g @angular/cli@latest',
      },
      {
        type: 'text',
        content:
          'El Angular CLI (Command Line Interface) es la herramienta oficial para crear proyectos, generar componentes, ejecutar el servidor de desarrollo, compilar para producción y más. Verifica que se instaló correctamente:',
      },
      {
        type: 'code',
        language: 'bash',
        content: 'ng version',
      },
      {
        type: 'text',
        content: 'Ahora crea tu primer proyecto. Usaremos las flags modernas:',
      },
      {
        type: 'code',
        language: 'bash',
        filename: 'terminal',
        content: `ng new mi-biblioteca \\
  --standalone \\
  --routing \\
  --style=scss`,
      },
      {
        type: 'text',
        content:
          'Las flags que usamos: `--standalone` genera componentes standalone (sin NgModules, el patrón moderno), `--routing` añade el router desde el inicio, `--style=scss` usa SCSS para los estilos.',
      },
      {
        type: 'code',
        language: 'bash',
        filename: 'terminal',
        content: `cd mi-biblioteca
npm start`,
      },
      {
        type: 'tip',
        variant: 'success',
        content:
          'Si ves "Application bundle generation complete" en la terminal y http://localhost:4200 muestra la pantalla de bienvenida de Angular, ¡tu entorno está perfecto!',
      },
      {
        type: 'text',
        content:
          'Para el editor, recomendamos VS Code con la extensión oficial "Angular Language Service". Instálala desde el marketplace de VS Code — añade autocompletado inteligente, navegación a definiciones y diagnósticos en tiempo real en los templates HTML.',
      },
      {
        type: 'tip',
        variant: 'info',
        content:
          'El servidor de desarrollo usa Hot Module Replacement (HMR) — los cambios en el código se reflejan en el navegador instantáneamente sin recargar la página completa.',
      },
    ],
    starterCode: `import { Component, signal } from '@angular/core';

// Los comandos que necesitas para crear tu primer proyecto Angular
// Observa la secuencia: instalar CLI → crear proyecto → servir

interface ComandoCLI {
  id: number;
  comando: string;
  descripcion: string;
  output: string;
}

@Component({
  selector: 'app-cli-setup',
  standalone: true,
  template: \`
    <div class="terminal">
      <div class="terminal-titlebar">
        <span class="dot red"></span>
        <span class="dot yellow"></span>
        <span class="dot green"></span>
        <span class="terminal-name">Terminal</span>
      </div>
      <div class="terminal-body">
        @for (cmd of comandos; track cmd.id) {
          <div class="linea-grupo">
            <div class="linea-comando">
              <span class="prompt">❯</span>
              <span class="comando">{{ cmd.comando }}</span>
            </div>
            <div class="linea-output">{{ cmd.output }}</div>
          </div>
        }
      </div>
    </div>
  \`,
})
export class CliSetupComponent {
  readonly comandos: ComandoCLI[] = [
    { id: 1, comando: 'node --version', descripcion: 'Verificar Node.js', output: 'v22.11.0' },
    { id: 2, comando: 'npm install -g @angular/cli', descripcion: 'Instalar Angular CLI globalmente', output: '+ @angular/cli@19.0.0  added 257 packages in 12s' },
    { id: 3, comando: 'ng new mi-biblioteca --standalone --routing --style=scss', descripcion: 'Crear nuevo proyecto', output: '✔ Packages installed successfully.\\n  Directory is already under version control.' },
    { id: 4, comando: 'cd mi-biblioteca && ng serve', descripcion: 'Iniciar servidor de desarrollo', output: '➜  Local:   http://localhost:4200/\\n  ➜  Watch mode enabled.' },
  ];
}`,
    solutionCode: '',
    previewHtml: `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Inter', sans-serif;
      background: #0D1117;
      color: #E6EDF3;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 2rem;
    }
    .component-label {
      position: fixed;
      top: 12px;
      right: 12px;
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.625rem;
      color: #8B949E;
      background: #161B22;
      border: 1px solid #30363D;
      padding: 0.2em 0.5em;
      border-radius: 4px;
    }
    .terminal {
      width: 100%;
      max-width: 580px;
      background: #161B22;
      border: 1px solid #30363D;
      border-radius: 10px;
      overflow: hidden;
      box-shadow: 0 8px 32px rgba(0,0,0,0.4);
    }
    .terminal-titlebar {
      background: #21262D;
      padding: 0.625rem 1rem;
      display: flex;
      align-items: center;
      gap: 0.4rem;
      border-bottom: 1px solid #30363D;
    }
    .dot {
      width: 12px;
      height: 12px;
      border-radius: 50%;
    }
    .dot.red { background: #DD0031; }
    .dot.yellow { background: #F59E0B; }
    .dot.green { background: #22C55E; }
    .terminal-name {
      margin-left: auto;
      margin-right: auto;
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.75rem;
      color: #8B949E;
      transform: translateX(-1.5rem);
    }
    .terminal-body {
      padding: 1.25rem;
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
    .linea-grupo {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }
    .linea-comando {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    .prompt {
      color: #22C55E;
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.875rem;
    }
    .comando {
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.8125rem;
      color: #E6EDF3;
    }
    .linea-output {
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.75rem;
      color: #8B949E;
      padding-left: 1.25rem;
      white-space: pre-wrap;
      line-height: 1.5;
    }
  </style>
</head>
<body>
  <span class="component-label">app-cli-setup</span>
  <div class="terminal">
    <div class="terminal-titlebar">
      <span class="dot red"></span>
      <span class="dot yellow"></span>
      <span class="dot green"></span>
      <span class="terminal-name">Terminal</span>
    </div>
    <div class="terminal-body">
      <div class="linea-grupo">
        <div class="linea-comando">
          <span class="prompt">❯</span>
          <span class="comando">node --version</span>
        </div>
        <div class="linea-output">v22.11.0</div>
      </div>
      <div class="linea-grupo">
        <div class="linea-comando">
          <span class="prompt">❯</span>
          <span class="comando">npm install -g @angular/cli</span>
        </div>
        <div class="linea-output">+ @angular/cli@19.0.0  added 257 packages in 12s</div>
      </div>
      <div class="linea-grupo">
        <div class="linea-comando">
          <span class="prompt">❯</span>
          <span class="comando">ng new mi-biblioteca --standalone --routing --style=scss</span>
        </div>
        <div class="linea-output">✔ Packages installed successfully.
  Directory is already under version control.</div>
      </div>
      <div class="linea-grupo">
        <div class="linea-comando">
          <span class="prompt">❯</span>
          <span class="comando">cd mi-biblioteca &amp;&amp; ng serve</span>
        </div>
        <div class="linea-output">➜  Local:   http://localhost:4200/
  ➜  Watch mode enabled.</div>
      </div>
    </div>
  </div>
</body>
</html>`,
    language: 'typescript',
    aiContext:
      'El usuario está configurando su entorno de desarrollo. Los problemas más comunes son: versión de Node.js incorrecta (necesita v20+), permisos de npm en macOS/Linux, y puertos ocupados. Si el usuario tiene un error, pide que comparta el mensaje exacto de error para ayudarle.',
    introMessage: `Esta lección es práctica: configurarás el entorno de desarrollo Angular en tu máquina.

**Lo que necesitas (prerequisitos):**
- Node.js v20 o superior (verifica con \`node --version\` en tu terminal)
- npm (viene incluido con Node.js)
- VS Code recomendado con la extensión "Angular Language Service"

**Lo que harás:**
1. Instalar el Angular CLI globalmente con \`npm install -g @angular/cli@latest\`
2. Crear tu primer proyecto con \`ng new\` usando las flags modernas (standalone, routing, scss)
3. Levantar el servidor de desarrollo y ver la app en \`http://localhost:4200\`

**El código del panel Código:**
Muestra los comandos exactos que usarás, en orden. Sirve como referencia rápida.

**Importante:**
AngularVerse no ejecuta comandos de terminal — para esta lección, el trabajo ocurre en tu propia terminal. Si encuentras errores al instalar o crear el proyecto, cuéntame el mensaje de error exacto y te ayudo a resolverlo.`,
    suggestedQuestions: [
      '¿Qué es el Angular CLI exactamente?',
      '¿Por qué usar --standalone?',
      '¿Qué diferencia hay entre ng serve y npm start?',
      'Tengo un error al ejecutar ng new, ¿qué hago?',
    ],
    prerequisites: ['L1.1'],
    nextLesson: 'L1.3',
    xpReward: 75,
  },

  {
    id: 'L1.3',
    module: 1,
    moduleTitle: 'Fundamentos',
    title: 'Anatomía de un proyecto Angular',
    subtitle: 'Entendiendo cada carpeta y archivo generado',
    estimatedMinutes: 15,
    narrative: [
      {
        type: 'text',
        content:
          'Cuando `ng new` termina, genera una estructura de carpetas que puede intimidar al principio. Vamos a explicar cada parte.',
      },
      {
        type: 'code',
        language: 'text',
        filename: 'Estructura de proyecto',
        content: `mi-biblioteca/
├── src/                    ← Tu código vive aquí
│   ├── app/               ← Componentes, servicios, rutas
│   │   ├── app.component.ts   ← Componente raíz
│   │   ├── app.config.ts      ← Configuración de la app
│   │   └── app.routes.ts      ← Definición de rutas
│   ├── index.html         ← HTML principal (solo un archivo)
│   ├── main.ts            ← Punto de entrada de la app
│   └── styles.scss        ← Estilos globales
├── angular.json           ← Config del CLI y del build
├── tsconfig.json          ← Config de TypeScript
└── package.json           ← Dependencias npm`,
      },
      {
        type: 'text',
        content:
          'El archivo más importante para entender es `main.ts`. Es el punto de entrada — el primer archivo que se ejecuta:',
      },
      {
        type: 'code',
        language: 'typescript',
        filename: 'src/main.ts',
        content: `import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent, appConfig)
  .catch(err => console.error(err));`,
      },
      {
        type: 'text',
        content:
          '`bootstrapApplication` lanza la aplicación con el componente raíz (`AppComponent`) y la configuración (`appConfig`). Todo lo demás es un árbol de componentes que cuelga de aquí.',
      },
      {
        type: 'text',
        content:
          'El archivo `app.config.ts` es donde configuramos los proveedores globales — el router, el cliente HTTP, las animaciones:',
      },
      {
        type: 'code',
        language: 'typescript',
        filename: 'src/app/app.config.ts',
        content: `import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
  ]
};`,
      },
      {
        type: 'tip',
        variant: 'info',
        content:
          '`angular.json` controla cómo el CLI compila tu proyecto: qué archivos de estilos incluir, qué assets copiar, cómo optimizar para producción. Raramente lo editarás manualmente, pero es bueno saber que existe.',
      },
      {
        type: 'text',
        content:
          'En la carpeta `src/app/` es donde pasarás el 95% del tiempo. Conforme el proyecto crezca, organizarás tu código en subcarpetas: `features/` para las funcionalidades, `core/` para servicios singleton, `shared/` para componentes reutilizables.',
      },
      {
        type: 'tip',
        variant: 'angular',
        content:
          '`tsconfig.json` tiene la configuración de TypeScript. Asegúrate de tener `"strict": true` — habilita todas las verificaciones de tipos. Al principio puede dar más errores, pero te protege de bugs silenciosos.',
      },
    ],
    starterCode: `import { Component, signal } from '@angular/core';

// La estructura de un proyecto Angular moderno (standalone)
// Haz clic en cualquier archivo para ver su propósito

interface ArchivoProyecto {
  nombre: string;
  tipo: 'folder' | 'ts' | 'html' | 'scss' | 'json' | 'config';
  descripcion: string;
  nivel: number;
  clave?: boolean;
}

@Component({
  selector: 'app-proyecto-anatomia',
  standalone: true,
  template: \`
    <div class="explorador">
      <div class="explorador-titulo">📁 mi-biblioteca</div>
      <div class="archivo-lista">
        @for (archivo of archivos; track archivo.nombre) {
          <div
            class="archivo"
            [class.clave]="archivo.clave"
            [class.seleccionado]="seleccionado()?.nombre === archivo.nombre"
            [style.paddingLeft]="(archivo.nivel * 16 + 12) + 'px'"
            (click)="seleccionado.set(archivo)"
          >
            <span class="archivo-icono">{{ getIcono(archivo) }}</span>
            <span class="archivo-nombre">{{ archivo.nombre }}</span>
          </div>
        }
      </div>
      @if (seleccionado()) {
        <div class="descripcion-panel">
          <strong>{{ seleccionado()!.nombre }}</strong>
          <p>{{ seleccionado()!.descripcion }}</p>
        </div>
      }
    </div>
  \`,
})
export class ProyectoAnatomiaComponent {
  readonly seleccionado = signal<ArchivoProyecto | null>(null);

  readonly archivos: ArchivoProyecto[] = [
    { nombre: 'src/', tipo: 'folder', descripcion: 'Todo tu código fuente vive aquí', nivel: 0, clave: true },
    { nombre: 'app/', tipo: 'folder', descripcion: 'La aplicación Angular: componentes, servicios, rutas', nivel: 1 },
    { nombre: 'app.component.ts', tipo: 'ts', descripcion: 'Componente raíz — el punto de entrada visual de la app', nivel: 2, clave: true },
    { nombre: 'app.config.ts', tipo: 'config', descripcion: 'Configuración global: providers, HTTP, routing, zoneless', nivel: 2, clave: true },
    { nombre: 'app.routes.ts', tipo: 'ts', descripcion: 'Definición de todas las rutas de la aplicación', nivel: 2 },
    { nombre: 'main.ts', tipo: 'ts', descripcion: 'Punto de entrada — llama a bootstrapApplication(AppComponent, appConfig)', nivel: 1, clave: true },
    { nombre: 'index.html', tipo: 'html', descripcion: 'HTML raíz — solo contiene <app-root> y los meta tags', nivel: 1 },
    { nombre: 'styles.scss', tipo: 'scss', descripcion: 'Estilos globales aplicados a toda la aplicación', nivel: 1 },
    { nombre: 'angular.json', tipo: 'json', descripcion: 'Configuración del CLI: build, serve, test, assets', nivel: 0 },
    { nombre: 'tsconfig.json', tipo: 'json', descripcion: 'Configuración de TypeScript — strict mode activado por defecto', nivel: 0 },
    { nombre: 'package.json', tipo: 'json', descripcion: 'Dependencias del proyecto y scripts de npm', nivel: 0 },
  ];

  getIcono(archivo: ArchivoProyecto): string {
    const map: Record<string, string> = {
      folder: '📁', ts: '🔷', html: '🟠', scss: '💜', json: '📋', config: '⚙️',
    };
    return map[archivo.tipo] ?? '📄';
  }
}`,
    solutionCode: '',
    previewHtml: `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Inter', sans-serif;
      background: #0D1117;
      color: #E6EDF3;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 2rem;
    }
    .component-label {
      position: fixed;
      top: 12px;
      right: 12px;
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.625rem;
      color: #8B949E;
      background: #161B22;
      border: 1px solid #30363D;
      padding: 0.2em 0.5em;
      border-radius: 4px;
    }
    .explorador {
      width: 100%;
      max-width: 480px;
      background: #161B22;
      border: 1px solid #30363D;
      border-radius: 10px;
      overflow: hidden;
    }
    .explorador-titulo {
      padding: 0.75rem 1rem;
      font-size: 0.8125rem;
      font-weight: 600;
      color: #8B949E;
      background: #21262D;
      border-bottom: 1px solid #30363D;
      font-family: 'JetBrains Mono', monospace;
    }
    .archivo-lista {
      padding: 0.5rem 0;
    }
    .archivo {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.35rem 0.75rem;
      cursor: pointer;
      transition: background 150ms;
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.8rem;
      color: #C9D1D9;
      border-left: 2px solid transparent;
    }
    .archivo:hover {
      background: rgba(139,92,246,0.06);
    }
    .archivo.seleccionado {
      background: rgba(139,92,246,0.1);
      color: #E6EDF3;
    }
    .archivo.clave {
      border-left-color: rgba(139,92,246,0.4);
    }
    .archivo.clave.seleccionado {
      border-left-color: #8B5CF6;
    }
    .archivo-icono {
      font-size: 0.875rem;
      flex-shrink: 0;
    }
    .descripcion-panel {
      padding: 0.875rem 1rem;
      border-top: 1px solid #30363D;
      background: #0D1117;
    }
    .descripcion-panel strong {
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.8125rem;
      color: #A78BFA;
      display: block;
      margin-bottom: 0.3rem;
    }
    .descripcion-panel p {
      font-size: 0.8125rem;
      color: #8B949E;
      line-height: 1.5;
    }
    .hint {
      text-align: center;
      font-size: 0.7rem;
      color: #484F58;
      padding: 0.5rem;
      border-top: 1px solid #21262D;
    }
  </style>
</head>
<body>
  <span class="component-label">app-proyecto-anatomia</span>
  <div class="explorador">
    <div class="explorador-titulo">📁 mi-biblioteca</div>
    <div class="archivo-lista" id="lista"></div>
    <div id="desc-panel"></div>
    <div class="hint">Haz clic en cualquier archivo para ver su propósito</div>
  </div>
  <script>
    const archivos = [
      { nombre: 'src/', icono: '📁', nivel: 0, clave: true, descripcion: 'Todo tu código fuente vive aquí' },
      { nombre: 'app/', icono: '📁', nivel: 1, clave: false, descripcion: 'La aplicación Angular: componentes, servicios, rutas' },
      { nombre: 'app.component.ts', icono: '🔷', nivel: 2, clave: true, descripcion: 'Componente raíz — el punto de entrada visual de la app' },
      { nombre: 'app.config.ts', icono: '⚙️', nivel: 2, clave: true, descripcion: 'Configuración global: providers, HTTP, routing, zoneless' },
      { nombre: 'app.routes.ts', icono: '🔷', nivel: 2, clave: false, descripcion: 'Definición de todas las rutas de la aplicación' },
      { nombre: 'main.ts', icono: '🔷', nivel: 1, clave: true, descripcion: 'Punto de entrada — llama a bootstrapApplication(AppComponent, appConfig)' },
      { nombre: 'index.html', icono: '🟠', nivel: 1, clave: false, descripcion: 'HTML raíz — solo contiene <app-root> y los meta tags' },
      { nombre: 'styles.scss', icono: '💜', nivel: 1, clave: false, descripcion: 'Estilos globales aplicados a toda la aplicación' },
      { nombre: 'angular.json', icono: '📋', nivel: 0, clave: false, descripcion: 'Configuración del CLI: build, serve, test, assets' },
      { nombre: 'tsconfig.json', icono: '📋', nivel: 0, clave: false, descripcion: 'Configuración de TypeScript — strict mode activado por defecto' },
      { nombre: 'package.json', icono: '📋', nivel: 0, clave: false, descripcion: 'Dependencias del proyecto y scripts de npm' },
    ];
    let seleccionado = null;
    const lista = document.getElementById('lista');
    archivos.forEach((a, i) => {
      const el = document.createElement('div');
      el.className = 'archivo' + (a.clave ? ' clave' : '');
      el.style.paddingLeft = (a.nivel * 16 + 12) + 'px';
      el.innerHTML = '<span class="archivo-icono">' + a.icono + '</span><span>' + a.nombre + '</span>';
      el.addEventListener('click', () => {
        document.querySelectorAll('.archivo').forEach(x => x.classList.remove('seleccionado'));
        el.classList.add('seleccionado');
        const panel = document.getElementById('desc-panel');
        panel.innerHTML = '<div class="descripcion-panel"><strong>' + a.nombre + '</strong><p>' + a.descripcion + '</p></div>';
      });
      lista.appendChild(el);
    });
  </script>
</body>
</html>`,
    language: 'typescript',
    aiContext:
      'El usuario está entendiendo la estructura de carpetas de Angular. Puedes explicar en detalle cualquier archivo. Si preguntan sobre NgModules vs Standalone, explica que en Angular moderno usamos Standalone y NgModules son el patrón antiguo que todavía funciona pero no se recomienda para proyectos nuevos.',
    introMessage: `Esta lección explora la estructura de archivos que genera \`ng new\`. Entender qué hace cada archivo te ahorra mucha confusión más adelante.

**El código del panel Código:**
Muestra un explorador de archivos interactivo — haz clic en cualquier archivo para ver su descripción. Los archivos con borde morado son los más importantes.

**Los archivos clave que verás:**
- \`src/main.ts\` — punto de entrada: aquí arranca Angular con \`bootstrapApplication\`
- \`src/app/app.config.ts\` — proveedores globales: router, HTTP client, etc.
- \`src/app/app.routes.ts\` — definición de rutas
- \`angular.json\` — configuración del CLI (build, assets, estilos globales)
- \`tsconfig.json\` — configuración de TypeScript (asegúrate de tener \`"strict": true\`)

**Lo que aprenderás:**
Por qué los proyectos modernos Angular no usan \`NgModules\` (son el patrón antiguo), y cómo los componentes standalone se autogestionan sus dependencias.

Lee la narrativa para entender cada archivo en detalle. Si algo no queda claro, pregúntame.`,
    suggestedQuestions: [
      '¿Qué es RouterOutlet?',
      '¿Para qué sirve app.config.ts?',
      '¿Qué es un componente standalone?',
      '¿Qué pone en angular.json?',
    ],
    prerequisites: ['L1.2'],
    nextLesson: 'L1.4',
    xpReward: 75,
  },

  {
    id: 'L1.4',
    module: 1,
    moduleTitle: 'Fundamentos',
    title: 'Tu primer componente',
    subtitle: 'Creando y entendiendo el bloque fundamental de Angular',
    estimatedMinutes: 20,
    narrative: [
      {
        type: 'text',
        content:
          'Un componente Angular es la unidad básica de construcción de la UI. Cada botón, cada tarjeta, cada página es un componente. Un componente tiene tres partes: la lógica (TypeScript), el template (HTML) y los estilos (SCSS/CSS).',
      },
      {
        type: 'text',
        content:
          'Para crear un componente, usas el decorador `@Component`. Los decoradores son una característica de TypeScript (similar a las anotaciones de Java) que añaden metadatos a una clase:',
      },
      {
        type: 'code',
        language: 'typescript',
        filename: 'src/app/features/tarjeta/tarjeta.ts',
        content: `import { Component } from '@angular/core';

@Component({
  selector: 'app-tarjeta',         // Nombre del elemento HTML
  template: \`
    <div class="tarjeta">
      <h2>Mi primera tarjeta</h2>
      <p>Contenido aquí</p>
    </div>
  \`,
  styles: [\`
    .tarjeta {
      background: white;
      padding: 1rem;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
  \`]
})
export class TarjetaComponent {
  // La lógica del componente va aquí
}`,
      },
      {
        type: 'text',
        content:
          'El `selector` define cómo usas el componente en otros templates. Con `selector: "app-tarjeta"`, puedes usarlo así en cualquier template:',
      },
      {
        type: 'code',
        language: 'html',
        content: `<!-- En cualquier otro template -->
<app-tarjeta />`,
      },
      {
        type: 'tip',
        variant: 'info',
        content:
          'En Angular moderno, los componentes son "standalone" por defecto. Eso significa que declaran sus propias dependencias en el array `imports` del decorador, sin necesitar un NgModule.',
      },
      {
        type: 'text',
        content:
          'Esta lección marca el inicio de la **Biblioteca Angular** — el mini-app que construiremos progresivamente a lo largo del curso. Cada lección añade una pieza nueva. Empezamos con `LibroCard`: la tarjeta que representa un libro.',
      },
      {
        type: 'text',
        content:
          'Para añadir datos al componente, declaras propiedades en la clase. En Angular moderno usamos `signal()` para el estado reactivo e `input()` para recibir datos del componente padre:',
      },
      {
        type: 'code',
        language: 'typescript',
        content: `import { Component, input, signal } from '@angular/core';

@Component({
  selector: 'app-libro-card',
  standalone: true,
  template: \`
    <div>
      <h3>{{ libro().titulo }}</h3>
      <p>{{ libro().autor }}</p>
      <span>{{ leido() ? '✓ Leído' : 'Por leer' }}</span>
      <button (click)="toggleLeido()">Marcar</button>
    </div>
  \`
})
export class LibroCardComponent {
  readonly libro = input.required<Libro>();  // dato del padre
  readonly leido = signal(false);            // estado interno

  toggleLeido(): void {
    this.leido.update(v => !v);
  }
}`,
      },
      {
        type: 'tip',
        variant: 'angular',
        content:
          'La sintaxis `{{ valor() }}` con paréntesis es porque los signals son funciones. Para leer el valor de un signal o un input, lo "llamas". Esto es diferente a las propiedades normales que no llevan paréntesis.',
      },
    ],
    starterCode: `import { Component, input, signal } from '@angular/core';

// 📚 Biblioteca Angular — Componente 1: LibroCard
// Un componente encapsula template (HTML), lógica (TypeScript) y estilos.
// Este es el bloque fundamental de cualquier app Angular.

interface Libro {
  titulo: string;
  autor: string;
  anio: number;
  categoria: string;
  paginas: number;
}

@Component({
  selector: 'app-libro-card',
  standalone: true,
  template: \`
    <article class="libro-card">
      <div class="libro-categoria">{{ libro().categoria }}</div>
      <h3 class="libro-titulo">{{ libro().titulo }}</h3>
      <p class="libro-autor">{{ libro().autor }} · {{ libro().anio }}</p>
      <p class="libro-paginas">{{ libro().paginas }} páginas</p>

      <div class="libro-footer">
        <span class="estado" [class.leido]="leido()">
          {{ leido() ? '✓ Leído' : 'Por leer' }}
        </span>
        <button class="btn-toggle" (click)="toggleLeido()">
          {{ leido() ? 'Desmarcar' : 'Marcar como leído' }}
        </button>
      </div>
    </article>
  \`,
})
export class LibroCardComponent {
  // input() — datos que provienen del componente padre (solo lectura)
  readonly libro = input.required<Libro>();

  // signal() — estado interno y mutable del componente
  readonly leido = signal(false);

  toggleLeido(): void {
    this.leido.update(v => !v);
  }
}

// Componente demo que instancia LibroCard con datos reales
@Component({
  selector: 'app-biblioteca-demo',
  standalone: true,
  imports: [LibroCardComponent],
  template: \`
    <app-libro-card [libro]="libroEjemplo" />
  \`,
})
export class BibliotecaDemoComponent {
  readonly libroEjemplo: Libro = {
    titulo: 'Clean Code',
    autor: 'Robert C. Martin',
    anio: 2008,
    categoria: 'Programación',
    paginas: 431,
  };
}`,
    solutionCode: '',
    previewHtml: `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Inter', sans-serif;
      background: #0D1117;
      color: #E6EDF3;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 2rem;
    }
    .component-label {
      position: fixed;
      top: 12px;
      right: 12px;
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.625rem;
      color: #8B949E;
      background: #161B22;
      border: 1px solid #30363D;
      padding: 0.2em 0.5em;
      border-radius: 4px;
    }
    .libro-card {
      background: #161B22;
      border: 1px solid #30363D;
      border-radius: 12px;
      padding: 1.5rem;
      width: 100%;
      max-width: 320px;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      transition: border-color 200ms;
    }
    .libro-card.leido {
      border-color: #22C55E;
    }
    .libro-categoria {
      display: inline-block;
      font-size: 0.6875rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      color: #A78BFA;
      background: rgba(139,92,246,0.12);
      border: 1px solid rgba(139,92,246,0.25);
      border-radius: 4px;
      padding: 0.2em 0.6em;
      align-self: flex-start;
    }
    .libro-titulo {
      font-size: 1.125rem;
      font-weight: 700;
      color: #E6EDF3;
      line-height: 1.3;
      margin-top: 0.25rem;
    }
    .libro-autor {
      font-size: 0.8125rem;
      color: #8B949E;
    }
    .libro-paginas {
      font-size: 0.75rem;
      color: #484F58;
      font-family: 'JetBrains Mono', monospace;
    }
    .libro-footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-top: 0.75rem;
      padding-top: 0.75rem;
      border-top: 1px solid #21262D;
      gap: 0.75rem;
    }
    .estado {
      font-size: 0.8125rem;
      font-weight: 500;
      color: #8B949E;
      transition: color 200ms;
    }
    .estado.leido-badge {
      color: #22C55E;
    }
    .btn-toggle {
      font-family: 'Inter', sans-serif;
      font-size: 0.8125rem;
      font-weight: 500;
      padding: 0.4rem 0.875rem;
      background: rgba(139,92,246,0.12);
      border: 1px solid rgba(139,92,246,0.3);
      border-radius: 6px;
      color: #A78BFA;
      cursor: pointer;
      transition: all 180ms;
      white-space: nowrap;
    }
    .btn-toggle:hover {
      background: rgba(139,92,246,0.2);
      border-color: #8B5CF6;
    }
    .btn-toggle.leido-btn {
      background: rgba(34,197,94,0.1);
      border-color: rgba(34,197,94,0.3);
      color: #22C55E;
    }
    .btn-toggle.leido-btn:hover {
      background: rgba(34,197,94,0.18);
    }
  </style>
</head>
<body>
  <span class="component-label">app-libro-card</span>
  <article class="libro-card" id="card">
    <div class="libro-categoria">Programación</div>
    <h3 class="libro-titulo">Clean Code</h3>
    <p class="libro-autor">Robert C. Martin · 2008</p>
    <p class="libro-paginas">431 páginas</p>
    <div class="libro-footer">
      <span class="estado" id="estado">Por leer</span>
      <button class="btn-toggle" id="btn" onclick="toggle()">Marcar como leído</button>
    </div>
  </article>
  <script>
    let leido = false;
    function toggle() {
      leido = !leido;
      const card = document.getElementById('card');
      const estado = document.getElementById('estado');
      const btn = document.getElementById('btn');
      card.classList.toggle('leido', leido);
      estado.classList.toggle('leido-badge', leido);
      estado.textContent = leido ? '✓ Leído' : 'Por leer';
      btn.classList.toggle('leido-btn', leido);
      btn.textContent = leido ? 'Desmarcar' : 'Marcar como leído';
    }
  </script>
</body>
</html>`,
    language: 'typescript',
    aiContext:
      'El usuario está creando su primer componente Angular real — LibroCard, el primer componente de la Biblioteca Angular que construirá a lo largo del curso. Los errores más comunes son: olvidar importar signal/input, usar this.variable en el template sin paréntesis para signals e inputs, o no declarar el componente como standalone.',
    introMessage: `Esta lección presenta **LibroCard** — el primer componente de la Biblioteca Angular, el mini-app que analizaremos progresivamente a lo largo del curso.

**El código del panel Código:**
Muestra \`LibroCardComponent\` completo con:
- \`input.required<Libro>()\` para recibir datos del padre
- \`signal(false)\` para el estado interno (¿está leído?)
- \`toggleLeido()\` que muta el signal con \`.update()\`

**Lo que aprenderás:**
- El decorador \`@Component\` y sus propiedades esenciales: \`selector\`, \`template\`, \`standalone\`
- La diferencia entre \`input()\` (datos del padre, inmutables) y \`signal()\` (estado propio, mutable)
- Por qué los signals e inputs usan paréntesis en el template: \`{{ libro().titulo }}\`
- Cómo un componente padre pasa datos a un hijo con \`[libro]="libroEjemplo"\`

Observa el Preview: el botón "Marcar como leído" cambia el estado visualmente. Así es como los signals actualizan la UI automáticamente.

Si algo no tiene sentido, pregúntame sobre la parte concreta y te explico.`,
    suggestedQuestions: [
      '¿Qué diferencia hay entre input() y signal()?',
      '¿Cómo importo este componente en otro componente?',
      '¿Para qué sirve input.required()?',
      '¿Puedo tener el template en un archivo HTML separado?',
    ],
    prerequisites: ['L1.3'],
    nextLesson: 'L1.5',
    xpReward: 100,
    achievements: [
      {
        id: 'first-component',
        name: 'Primer componente',
        description: 'Creaste tu primer componente Angular',
        icon: '⚡',
      },
    ],
  },

  {
    id: 'L1.5',
    module: 1,
    moduleTitle: 'Fundamentos',
    title: 'Data Binding',
    subtitle: 'Los cuatro tipos de binding que conectan lógica y template',
    estimatedMinutes: 25,
    narrative: [
      {
        type: 'text',
        content:
          'Data binding es el mecanismo que conecta el código TypeScript de tu componente con el template HTML. Angular tiene cuatro tipos, cada uno con una sintaxis diferente y un propósito específico.',
      },
      {
        type: 'text',
        content:
          '**1. Interpolación {{ }}** — muestra un valor en el HTML. Es de TypeScript hacia el template (one-way, unidireccional hacia la vista):',
      },
      {
        type: 'code',
        language: 'typescript',
        content: `// TypeScript
readonly nombre = signal('Angular');
readonly version = signal(20);
readonly ahora = computed(() => new Date().toLocaleString());

// Template
// <h1>Hola, {{ nombre() }}!</h1>
// <p>Versión {{ version() }}</p>
// <small>{{ ahora() }}</small>`,
      },
      {
        type: 'text',
        content:
          '**2. Property Binding [ ]** — enlaza una propiedad del DOM o de un componente hijo con un valor de TypeScript. Los corchetes indican que estás asignando una expresión TypeScript (no una cadena de texto):',
      },
      {
        type: 'code',
        language: 'html',
        content: `<!-- Sin binding: siempre el string "isDisabled" -->
<button disabled="isDisabled">Sin binding</button>

<!-- Con property binding: usa el valor real de la variable -->
<button [disabled]="isDisabled()">Con binding</button>
<img [src]="imagenUrl()" [alt]="imagenAlt()" />

<!-- Binding a un componente hijo -->
<app-libro-card [libro]="libroSeleccionado()" />`,
      },
      {
        type: 'text',
        content:
          '**3. Event Binding ( )** — escucha eventos del DOM y ejecuta métodos de tu componente. Los paréntesis envuelven el nombre del evento:',
      },
      {
        type: 'code',
        language: 'html',
        content: `<!-- Click -->
<button (click)="guardar()">Guardar</button>

<!-- Con el objeto evento -->
<input (input)="manejarInput($event)" />

<!-- Teclado -->
<input (keydown.enter)="buscar()" (keydown.escape)="limpiar()" />

<!-- Formulario -->
<form (submit)="enviar($event)">...</form>`,
      },
      {
        type: 'text',
        content:
          '**4. Two-way Binding [( )]** — sincronización bidireccional. En Angular moderno, el patrón preferido es usar `model()` para crear signals con two-way binding nativo. El clásico `[(ngModel)]` sigue funcionando para formularios template-driven:',
      },
      {
        type: 'code',
        language: 'typescript',
        content: `import { Component, model } from '@angular/core';

@Component({
  template: \`
    <!-- model() — two-way binding nativo con signals (Angular 17+) -->
    <input [value]="nombre()" (input)="nombre.set($any($event.target).value)" />

    <!-- O con ngModel para formularios tradicionales -->
    <input [(ngModel)]="nombreTexto" />

    <p>Hola, {{ nombre() || 'lector' }} 👋</p>
  \`
})
export class FormComponent {
  // model() crea un signal con two-way binding
  readonly nombre = model('');
  nombreTexto = '';
}`,
      },
      {
        type: 'tip',
        variant: 'info',
        content:
          'Con Angular Signals moderno, `model()` es el patrón preferido para two-way binding. Crea un signal que puede ser leído y escrito tanto desde el componente como desde el padre. `[(ngModel)]` sigue siendo válido y útil para formularios template-driven.',
      },
      {
        type: 'checkpoint',
        question: '¿Qué sintaxis usarías para pasar la variable `libro` a un componente hijo llamado `app-libro-card`?',
        options: [
          '<app-libro-card libro="libro()" />',
          '<app-libro-card [libro]="libro()" />',
          '<app-libro-card (libro)="libro()" />',
          '<app-libro-card {{libro()}} />',
        ],
        correct: 1,
        explanation:
          'Correcto. Los corchetes `[libro]` indican property binding — estás pasando el valor de la expresión TypeScript `libro()` al input del componente hijo. Sin corchetes, Angular trataría "libro()" como un string literal, no como una expresión.',
      },
      {
        type: 'tip',
        variant: 'success',
        content:
          'Regla mnemotécnica: [] pasan datos HACIA el hijo (como una propiedad), () escuchan eventos DEL hijo (como un callback), [()] es los dos a la vez (sync bidireccional).',
      },
    ],
    starterCode: `import { Component, signal, model } from '@angular/core';
import { FormsModule } from '@angular/forms';

// 📚 Biblioteca Angular — Los 4 tipos de binding
// Estos 4 patrones son los pilares de la comunicación en templates Angular

@Component({
  selector: 'app-binding-demo',
  standalone: true,
  imports: [FormsModule],
  template: \`
    <div class="demo">

      <!-- ① Interpolación {{ }} — muestra el valor de una expresión -->
      <section class="binding-section">
        <label class="binding-label">① Interpolación <code>{{ '{{' }} valor {{ '}}' }}</code></label>
        <div class="resultado">{{ tituloApp() }}</div>
      </section>

      <!-- ② Property binding [ ] — pasa datos a propiedades -->
      <section class="binding-section">
        <label class="binding-label">② Property binding <code>[propiedad]="valor"</code></label>
        <input
          [placeholder]="placeholderTexto"
          [disabled]="buscando()"
          type="text"
          class="input-demo"
        />
      </section>

      <!-- ③ Event binding ( ) — escucha eventos -->
      <section class="binding-section">
        <label class="binding-label">③ Event binding <code>(evento)="handler()"</code></label>
        <button (click)="activarBusqueda()" class="btn">
          {{ buscando() ? '⏳ Buscando...' : '🔍 Buscar libro' }}
        </button>
      </section>

      <!-- ④ Two-way binding [( )] — sincronización bidireccional -->
      <section class="binding-section">
        <label class="binding-label">④ Two-way binding <code>[(ngModel)]="signal"</code></label>
        <input [(ngModel)]="nombreLector" placeholder="Tu nombre..." class="input-demo" />
        <div class="resultado">Hola, {{ nombreLector() || 'lector' }} 👋</div>
      </section>

    </div>
  \`,
})
export class BindingDemoComponent {
  readonly tituloApp = signal('📚 Biblioteca Angular');
  readonly buscando = signal(false);
  readonly placeholderTexto = 'Busca por título o autor...';

  // model() — signal con two-way binding nativo (Angular 17+)
  readonly nombreLector = model('');

  activarBusqueda(): void {
    this.buscando.set(true);
    setTimeout(() => this.buscando.set(false), 1500);
  }
}`,
    solutionCode: '',
    previewHtml: `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Inter', sans-serif;
      background: #0D1117;
      color: #E6EDF3;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 2rem;
    }
    .component-label {
      position: fixed;
      top: 12px;
      right: 12px;
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.625rem;
      color: #8B949E;
      background: #161B22;
      border: 1px solid #30363D;
      padding: 0.2em 0.5em;
      border-radius: 4px;
    }
    .demo {
      width: 100%;
      max-width: 480px;
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
    .binding-section {
      background: #161B22;
      border: 1px solid #30363D;
      border-radius: 10px;
      padding: 1rem;
      display: flex;
      flex-direction: column;
      gap: 0.625rem;
    }
    .binding-label {
      font-size: 0.75rem;
      font-weight: 600;
      color: #8B949E;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      display: flex;
      align-items: center;
      gap: 0.4rem;
      flex-wrap: wrap;
    }
    code {
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.7rem;
      color: #A78BFA;
      background: rgba(139,92,246,0.1);
      border: 1px solid rgba(139,92,246,0.2);
      border-radius: 4px;
      padding: 0.1em 0.4em;
      text-transform: none;
      letter-spacing: 0;
      font-weight: 400;
    }
    .resultado {
      font-size: 1rem;
      font-weight: 600;
      color: #E6EDF3;
      padding: 0.5rem 0.75rem;
      background: #21262D;
      border-radius: 6px;
    }
    .input-demo {
      width: 100%;
      padding: 0.625rem 0.875rem;
      background: #21262D;
      border: 1px solid #30363D;
      border-radius: 6px;
      color: #E6EDF3;
      font-family: 'Inter', sans-serif;
      font-size: 0.875rem;
      outline: none;
      transition: border-color 200ms;
    }
    .input-demo:focus { border-color: #8B5CF6; }
    .input-demo::placeholder { color: #484F58; }
    .input-demo:disabled {
      opacity: 0.4;
      cursor: not-allowed;
    }
    .btn {
      font-family: 'Inter', sans-serif;
      font-size: 0.875rem;
      font-weight: 500;
      padding: 0.5rem 1rem;
      background: rgba(139,92,246,0.12);
      border: 1px solid rgba(139,92,246,0.3);
      border-radius: 6px;
      color: #A78BFA;
      cursor: pointer;
      transition: all 180ms;
      align-self: flex-start;
    }
    .btn:hover { background: rgba(139,92,246,0.2); }
    .btn.buscando {
      color: #F59E0B;
      background: rgba(245,158,11,0.1);
      border-color: rgba(245,158,11,0.3);
      cursor: not-allowed;
    }
  </style>
</head>
<body>
  <span class="component-label">app-binding-demo</span>
  <div class="demo">
    <div class="binding-section">
      <span class="binding-label">① Interpolación <code>{{ valor }}</code></span>
      <div class="resultado">📚 Biblioteca Angular</div>
    </div>
    <div class="binding-section">
      <span class="binding-label">② Property binding <code>[propiedad]="valor"</code></span>
      <input class="input-demo" id="input-prop" placeholder="Busca por título o autor..." type="text" />
    </div>
    <div class="binding-section">
      <span class="binding-label">③ Event binding <code>(evento)="handler()"</code></span>
      <button class="btn" id="btn-buscar" onclick="activarBusqueda()">🔍 Buscar libro</button>
    </div>
    <div class="binding-section">
      <span class="binding-label">④ Two-way binding <code>[(ngModel)]</code></span>
      <input class="input-demo" id="input-nombre" placeholder="Tu nombre..." oninput="actualizarNombre(this.value)" type="text" />
      <div class="resultado" id="saludo">Hola, lector 👋</div>
    </div>
  </div>
  <script>
    let buscando = false;
    function activarBusqueda() {
      if (buscando) return;
      buscando = true;
      const btn = document.getElementById('btn-buscar');
      const input = document.getElementById('input-prop');
      btn.textContent = '⏳ Buscando...';
      btn.classList.add('buscando');
      input.disabled = true;
      setTimeout(() => {
        buscando = false;
        btn.textContent = '🔍 Buscar libro';
        btn.classList.remove('buscando');
        input.disabled = false;
      }, 1500);
    }
    function actualizarNombre(valor) {
      document.getElementById('saludo').textContent = 'Hola, ' + (valor || 'lector') + ' 👋';
    }
  </script>
</body>
</html>`,
    language: 'typescript',
    aiContext:
      'El usuario está aprendiendo los tipos de data binding en Angular, aplicados a la Biblioteca Angular. El error más común es confundir cuándo usar corchetes vs paréntesis. Si el usuario comete este error, explica con una analogía: [] = datos que entran al elemento (como parámetros), () = eventos que salen del elemento (como callbacks). También es común olvidar el () para leer signals en el template. model() es el nuevo patrón de two-way binding nativo en Angular 17+.',
    introMessage: `Esta lección cubre los **cuatro tipos de data binding** — el mecanismo que conecta tu código TypeScript con el template HTML.

**El código del panel Código:**
Muestra \`BindingDemoComponent\` con los 4 tipos de binding aplicados al contexto de la Biblioteca Angular.

**Los cuatro tipos que aprenderás:**
- **Interpolación \`{{ }}\`** — muestra un valor en el HTML (TypeScript → template)
- **Property binding \`[ ]\`** — enlaza una propiedad del DOM con un valor TypeScript, ej: \`[disabled]="condición"\`
- **Event binding \`( )\`** — escucha eventos del DOM, ej: \`(click)="buscar()"\`
- **Two-way binding \`[( )]\`** — sincronización bidireccional con \`model()\` (patrón moderno) o \`[(ngModel)]\`

**Regla mnemotécnica:**
\`[]\` = datos que ENTRAN al elemento · \`()\` = eventos que SALEN del elemento · \`[()]\` = los dos a la vez

Observa el Preview: el botón de búsqueda desactiva el input durante 1.5s, y el input del nombre actualiza el saludo en tiempo real. Así funciona el binding en la práctica.

Si algo del código del panel no queda claro, pregúntame sobre el binding específico que quieras entender.`,
    suggestedQuestions: [
      '¿Cuándo uso [attr] vs attr="..."?',
      '¿Qué es $event en los event bindings?',
      '¿Qué diferencia hay entre model() y signal()?',
      '¿El two-way binding es mala práctica?',
    ],
    prerequisites: ['L1.4'],
    nextLesson: 'L2.1',
    xpReward: 100,
    achievements: [
      {
        id: 'binding-master',
        name: 'Maestro del Binding',
        description: 'Dominaste los 4 tipos de data binding',
        icon: '🔗',
      },
    ],
  },
];
