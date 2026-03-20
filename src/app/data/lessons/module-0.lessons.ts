import type { Lesson } from '../../core/models/lesson.model';

export const MODULE_0_LESSONS: Lesson[] = [
  {
    id: 'L0.1',
    module: 0,
    moduleTitle: 'Bienvenida',
    title: 'Bienvenido a AngularVerse',
    subtitle: 'Tu viaje para dominar Angular comienza aquí',
    estimatedMinutes: 5,
    narrative: [
      {
        type: 'text',
        content:
          'AngularVerse es una plataforma de aprendizaje interactivo diseñada para llevarte desde cero hasta desarrollador Angular competente. No es otro tutorial con ejemplos de contador — aquí estudiarás los patrones que se usan en producción, con código real que puedes leer y analizar, y un tutor AI disponible en cada paso.',
      },
      {
        type: 'tip',
        variant: 'info',
        content:
          'Esta plataforma fue construida con las mismas APIs que vas a aprender: Angular Signals, Standalone Components, el nuevo Control Flow. El código que impulsa AngularVerse ES la lección.',
      },
      {
        type: 'text',
        content:
          'El programa está dividido en módulos progresivos. Cada lección tiene teoría narrativa (lo que estás leyendo ahora), código de ejemplo que puedes analizar en el panel Código, y Ngbot — el tutor AI que responde tus preguntas sobre esa lección específicamente.',
      },
      {
        type: 'text',
        content:
          'Ganarás XP al completar lecciones y desbloquearás insignias por hitos. Tu progreso se sincroniza automáticamente — puedes continuar desde cualquier dispositivo sin perder nada. Pero el verdadero objetivo no es el gamification — es que, al final del programa, puedas leer, entender y contribuir a proyectos Angular reales.',
      },
      {
        type: 'tip',
        variant: 'success',
        content:
          '¿Tienes dudas sobre cómo funciona la plataforma? Abre Ngbot — el tutor AI — y pregúntale cualquier cosa sobre Angular o sobre la lección actual.',
      },
    ],
    starterCode: `import { Component, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-bienvenida',
  standalone: true,
  imports: [FormsModule],
  template: \`
    <div class="welcome">
      <p class="saludo">{{ saludo() }},</p>
      <h1 class="nombre">{{ nombre() || 'Angular Developer' }}</h1>
      <p class="mensaje">Bienvenido a tu primer componente Angular.</p>

      <div class="input-wrapper">
        <label>¿Cómo te llamas?</label>
        <input
          type="text"
          [(ngModel)]="nombre"
          placeholder="Escribe tu nombre..."
          maxlength="30"
        />
      </div>
    </div>
  \`,
})
export class BienvenidaComponent {
  readonly nombre = signal('');

  readonly saludo = computed(() => {
    const h = new Date().getHours();
    if (h < 12) return 'Buenos días';
    if (h < 20) return 'Buenas tardes';
    return 'Buenas noches';
  });
}`,
    solutionCode: '',
    previewHtml: `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet">
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
      letter-spacing: 0.05em;
    }
    .welcome {
      text-align: center;
      max-width: 400px;
      width: 100%;
    }
    .saludo {
      font-size: 1rem;
      color: #8B5CF6;
      font-weight: 600;
      letter-spacing: 0.05em;
      text-transform: uppercase;
      margin-bottom: 0.5rem;
    }
    h1 {
      font-size: 2rem;
      font-weight: 700;
      color: #E6EDF3;
      margin-bottom: 1rem;
      min-height: 2.5rem;
    }
    .mensaje {
      color: #8B949E;
      font-size: 0.9375rem;
      margin-bottom: 2rem;
      line-height: 1.6;
    }
    .input-wrapper {
      text-align: left;
    }
    label {
      display: block;
      font-size: 0.75rem;
      font-weight: 600;
      color: #8B949E;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      margin-bottom: 0.5rem;
    }
    input {
      width: 100%;
      padding: 0.75rem 1rem;
      background: #161B22;
      border: 1px solid #30363D;
      border-radius: 8px;
      color: #E6EDF3;
      font-family: 'Inter', sans-serif;
      font-size: 1rem;
      outline: none;
      transition: border-color 200ms;
    }
    input:focus { border-color: #8B5CF6; }
    input::placeholder { color: #484F58; }
  </style>
</head>
<body>
  <span class="component-label">app-bienvenida</span>
  <div class="welcome">
    <p class="saludo" id="saludo"></p>
    <h1 id="nombre">Angular Developer</h1>
    <p class="mensaje">Bienvenido a tu primer componente Angular.</p>
    <div class="input-wrapper">
      <label>¿Cómo te llamas?</label>
      <input type="text" id="input" placeholder="Escribe tu nombre..." maxlength="30" oninput="actualizar(this.value)">
    </div>
  </div>
  <script>
    function saludo() {
      const h = new Date().getHours();
      if (h < 12) return 'Buenos días';
      if (h < 20) return 'Buenas tardes';
      return 'Buenas noches';
    }
    function actualizar(valor) {
      document.getElementById('nombre').textContent = valor || 'Angular Developer';
    }
    document.getElementById('saludo').textContent = saludo();
  </script>
</body>
</html>`,
    language: 'typescript',
    aiContext:
      'El usuario acaba de llegar a la plataforma. Está en la lección de bienvenida. Explica qué aprenderá, cómo funciona la plataforma y cuál es el camino de aprendizaje. Sé entusiasta y motivador.',
    introMessage: `¡Bienvenido a AngularVerse! 🚀

En cada lección encontrarás tres paneles:

- **Teoría** — el texto narrativo que explica los conceptos
- **Código** — el ejemplo de la lección, ya escrito: léelo y analízalo
- **Preview** — el resultado visual de ese código en acción

Tu rol es **leer, observar y entender**. El código ya está preparado para que veas cómo funciona Angular en la práctica. Si algo no queda claro, pregúntame aquí.`,
    suggestedQuestions: [
      '¿Qué aprenderé en AngularVerse?',
      '¿Necesito saber TypeScript para empezar?',
      '¿Cuánto tiempo lleva completar el programa?',
      '¿En qué se diferencia Angular de React?',
    ],
    prerequisites: [],
    nextLesson: 'L0.2',
    xpReward: 25,
  },

  {
    id: 'L0.2',
    module: 0,
    moduleTitle: 'Bienvenida',
    title: 'Tour de la plataforma',
    subtitle: 'Conoce las herramientas que usarás cada día',
    estimatedMinutes: 5,
    narrative: [
      {
        type: 'text',
        content:
          'La interfaz de AngularVerse está diseñada para el aprendizaje activo. Cada lección tiene tres zonas de trabajo que verás en el Preview de esta lección:',
      },
      {
        type: 'comparison',
        leftLabel: 'Panel de Teoría',
        left:
          'Es donde estás ahora. Contiene la narrativa de la lección, diagramas, tips y checkpoints de comprensión. Léelo con calma, pero no te quedes solo aquí — el aprendizaje real ocurre viendo el código.',
        rightLabel: 'Panel de Código',
        right:
          'Muestra el código de ejemplo de cada lección con resaltado de sintaxis. Está ahí para que lo leas, entiendas su estructura y hagas preguntas a Ngbot sobre él.',
      },
      {
        type: 'text',
        content:
          'El panel Preview muestra el resultado visual de ese código — una representación interactiva de lo que el componente Angular produce. No es ejecución en tiempo real, sino una demo cuidadosamente construida para que veas el resultado final.',
      },
      {
        type: 'tip',
        variant: 'info',
        content:
          'Ngbot — el tutor AI que aparece en la parte inferior — conoce el contenido de ESTA lección. Sus respuestas están contextualizadas. No es un chatbot genérico: sabe exactamente en qué punto del aprendizaje estás.',
      },
      {
        type: 'text',
        content:
          'El sistema de XP y la barra de progreso superior te muestran dónde estás en el camino. Las lecciones se desbloquean en orden, pero puedes saltar módulos si ya tienes experiencia.',
      },
      {
        type: 'tip',
        variant: 'angular',
        content:
          'Consejo: si quieres profundizar en un fragmento de código que ves en el panel Código, selecciónalo y pregúntale a Ngbot directamente. Ngbot conoce el contexto exacto de la lección.',
      },
    ],
    starterCode: `import { Component, signal, computed } from '@angular/core';

// Este componente ES la plataforma que estás usando ahora mismo.
// Observa cómo tres paneles forman una sola experiencia de aprendizaje.

@Component({
  selector: 'app-lesson-shell',
  standalone: true,
  template: \`
    <div class="shell">
      <div
        class="panel"
        [class.active]="panelActivo() === 'teoria'"
        (click)="panelActivo.set('teoria')"
      >
        <span class="panel-icon">📖</span>
        <span class="panel-nombre">Teoría</span>
        <span class="panel-desc">Conceptos y narrativa</span>
      </div>
      <div
        class="panel"
        [class.active]="panelActivo() === 'codigo'"
        (click)="panelActivo.set('codigo')"
      >
        <span class="panel-icon">💻</span>
        <span class="panel-nombre">Código</span>
        <span class="panel-desc">Ejemplo Angular real</span>
      </div>
      <div
        class="panel"
        [class.active]="panelActivo() === 'preview'"
        (click)="panelActivo.set('preview')"
      >
        <span class="panel-icon">👁</span>
        <span class="panel-nombre">Preview</span>
        <span class="panel-desc">Resultado visual</span>
      </div>
    </div>
    <p class="descripcion">{{ descripcion() }}</p>
  \`,
})
export class LessonShellComponent {
  readonly panelActivo = signal<'teoria' | 'codigo' | 'preview'>('teoria');

  readonly descripcion = computed(() => {
    const desc: Record<string, string> = {
      teoria: 'Lee los conceptos, tips y checkpoints. Es tu punto de partida.',
      codigo: 'Observa el código Angular real de cada lección. Léelo, analízalo.',
      preview: 'Resultado visual del código. Lo que verías en un navegador real.',
    };
    return desc[this.panelActivo()];
  });
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
    .container {
      width: 100%;
      max-width: 640px;
    }
    .shell {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      gap: 0.75rem;
      margin-bottom: 1rem;
    }
    .panel {
      background: #161B22;
      border: 1px solid #30363D;
      border-radius: 10px;
      padding: 1.25rem 1rem;
      cursor: pointer;
      transition: all 200ms ease;
      text-align: center;
      user-select: none;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.25rem;
    }
    .panel:hover {
      border-color: #8B5CF6;
      background: #1C1830;
    }
    .panel.active {
      border-color: #8B5CF6;
      background: #1C1830;
      box-shadow: 0 0 0 1px #8B5CF6, 0 0 20px rgba(139,92,246,0.15);
    }
    .panel-icon {
      font-size: 1.5rem;
      margin-bottom: 0.25rem;
    }
    .panel-nombre {
      font-size: 0.875rem;
      font-weight: 600;
      color: #E6EDF3;
    }
    .panel.active .panel-nombre {
      color: #A78BFA;
    }
    .panel-desc {
      font-size: 0.7rem;
      color: #8B949E;
      line-height: 1.4;
    }
    .descripcion {
      background: #161B22;
      border: 1px solid #30363D;
      border-left: 3px solid #8B5CF6;
      border-radius: 8px;
      padding: 0.875rem 1rem;
      font-size: 0.875rem;
      color: #C9D1D9;
      line-height: 1.6;
      min-height: 3rem;
      transition: all 200ms ease;
    }
  </style>
</head>
<body>
  <span class="component-label">app-lesson-shell</span>
  <div class="container">
    <div class="shell">
      <div class="panel active" id="panel-teoria" onclick="activar('teoria', 'Lee los conceptos, tips y checkpoints. Es tu punto de partida.')">
        <span class="panel-icon">📖</span>
        <span class="panel-nombre">Teoría</span>
        <span class="panel-desc">Conceptos y narrativa</span>
      </div>
      <div class="panel" id="panel-codigo" onclick="activar('codigo', 'Observa el código Angular real de cada lección. Léelo, analízalo.')">
        <span class="panel-icon">💻</span>
        <span class="panel-nombre">Código</span>
        <span class="panel-desc">Ejemplo Angular real</span>
      </div>
      <div class="panel" id="panel-preview" onclick="activar('preview', 'Resultado visual del código. Lo que verías en un navegador real.')">
        <span class="panel-icon">👁</span>
        <span class="panel-nombre">Preview</span>
        <span class="panel-desc">Resultado visual</span>
      </div>
    </div>
    <p class="descripcion" id="descripcion">Lee los conceptos, tips y checkpoints. Es tu punto de partida.</p>
  </div>
  <script>
    function activar(id, desc) {
      ['teoria', 'codigo', 'preview'].forEach(p => {
        document.getElementById('panel-' + p).classList.toggle('active', p === id);
      });
      document.getElementById('descripcion').textContent = desc;
    }
  </script>
</body>
</html>`,
    language: 'typescript',
    aiContext:
      'El usuario está haciendo el tour de la plataforma. Si pregunta sobre funcionalidades específicas de la UI, explica cómo funcionan. La plataforma es de solo lectura — el código ya está escrito y el Preview se muestra automáticamente. No hay botón Ejecutar.',
    introMessage: `En esta lección conocerás en detalle cómo está organizada la plataforma.

**Las tres zonas:**
- **Teoría** — texto narrativo, diagramas, tips y checkpoints de comprensión
- **Código** — el código de la lección, ya escrito para que lo leas y analices
- **Preview** — la representación visual de lo que produce ese código

**Sobre mí (Ngbot):**
Conozco el contenido específico de cada lección. No soy un chatbot genérico — mis respuestas están contextualizadas para exactamente lo que estás estudiando ahora.

Lee la narrativa e interactúa con el Preview para explorar los tres paneles.`,
    suggestedQuestions: [
      '¿Cómo funciona el sistema de XP?',
      '¿Qué diferencia hay entre el panel Código y el Preview?',
      '¿Puedo copiar el código de las lecciones?',
    ],
    prerequisites: ['L0.1'],
    nextLesson: 'L0.3',
    xpReward: 25,
  },

  {
    id: 'L0.3',
    module: 0,
    moduleTitle: 'Bienvenida',
    title: 'Tu perfil de aprendizaje',
    subtitle: 'Personaliza tu experiencia en AngularVerse',
    estimatedMinutes: 3,
    narrative: [
      {
        type: 'text',
        content:
          'Tu perfil de aprendizaje define cómo Ngbot responde tus preguntas y el ritmo de las explicaciones. Elegiste un nivel de entrada, pero puedes ajustarlo en cualquier momento.',
      },
      {
        type: 'tip',
        variant: 'info',
        content:
          'Nivel "Principiante": las explicaciones incluirán analogías del mundo real y no asumirán conocimiento previo de TypeScript ni de otros frameworks. Si algo no queda claro, pregunta sin miedo.',
      },
      {
        type: 'tip',
        variant: 'info',
        content:
          'Nivel "Con experiencia": se asume que conoces JavaScript moderno (ES6+) y tienes idea de qué es un componente. Las explicaciones serán más directas y técnicas.',
      },
      {
        type: 'tip',
        variant: 'info',
        content:
          'Nivel "Desarrollador web": se asume que has trabajado con otro framework (React, Vue, etc.) y buscas aprender los patrones específicos de Angular. Ngbot usará comparativas con otros frameworks.',
      },
      {
        type: 'text',
        content:
          'Tu progreso se sincroniza automáticamente — puedes cambiar de dispositivo o navegador sin perder tu avance.',
      },
      {
        type: 'tip',
        variant: 'success',
        content:
          '¡El módulo de bienvenida está completo! La siguiente parada es el Módulo 1: Fundamentos de Angular. Pulsa "Lección completada" para continuar.',
      },
    ],
    starterCode: `import { Component, signal, computed } from '@angular/core';

type NivelAprendizaje = 'principiante' | 'intermedio' | 'avanzado';

@Component({
  selector: 'app-perfil-aprendizaje',
  standalone: true,
  template: \`
    <div class="perfil">
      <h2>¿Cuál es tu nivel?</h2>
      <div class="niveles">
        @for (nivel of niveles; track nivel.id) {
          <button
            class="nivel-btn"
            [class.selected]="nivelSeleccionado() === nivel.id"
            (click)="nivelSeleccionado.set(nivel.id)"
          >
            <span class="nivel-icon">{{ nivel.icon }}</span>
            <strong>{{ nivel.nombre }}</strong>
            <span>{{ nivel.descripcion }}</span>
          </button>
        }
      </div>
      <p class="mensaje-personalizado">{{ mensajePersonalizado() }}</p>
    </div>
  \`,
})
export class PerfilAprendizajeComponent {
  readonly nivelSeleccionado = signal<NivelAprendizaje>('principiante');

  readonly niveles = [
    { id: 'principiante' as NivelAprendizaje, icon: '🌱', nombre: 'Principiante', descripcion: 'Sin experiencia previa con Angular' },
    { id: 'intermedio' as NivelAprendizaje, icon: '⚡', nombre: 'Con experiencia', descripcion: 'Conoces JavaScript moderno (ES6+)' },
    { id: 'avanzado' as NivelAprendizaje, icon: '🚀', nombre: 'Desarrollador web', descripcion: 'Vienes de React, Vue u otro framework' },
  ];

  readonly mensajePersonalizado = computed(() => {
    const mensajes: Record<NivelAprendizaje, string> = {
      principiante: 'Las explicaciones incluirán analogías del mundo real y partirán desde cero.',
      intermedio: 'Iremos directo al grano asumiendo conocimiento de JavaScript moderno.',
      avanzado: 'Compararemos patrones de Angular con React y Vue para que el contexto sea inmediato.',
    };
    return mensajes[this.nivelSeleccionado()];
  });
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
    .perfil {
      width: 100%;
      max-width: 480px;
    }
    h2 {
      font-size: 1.25rem;
      font-weight: 700;
      margin-bottom: 1.25rem;
      color: #E6EDF3;
    }
    .niveles {
      display: flex;
      flex-direction: column;
      gap: 0.625rem;
      margin-bottom: 1.25rem;
    }
    .nivel-btn {
      display: grid;
      grid-template-columns: 2rem 1fr;
      grid-template-rows: auto auto;
      column-gap: 0.75rem;
      align-items: center;
      background: #161B22;
      border: 1px solid #30363D;
      border-radius: 10px;
      padding: 1rem;
      cursor: pointer;
      transition: all 180ms ease;
      text-align: left;
      color: #E6EDF3;
    }
    .nivel-btn:hover {
      border-color: #8B5CF6;
      background: #1C1830;
    }
    .nivel-btn.selected {
      border-color: #8B5CF6;
      background: #1C1830;
      box-shadow: 0 0 0 1px #8B5CF6, 0 0 16px rgba(139,92,246,0.12);
    }
    .nivel-icon {
      font-size: 1.5rem;
      grid-row: 1 / 3;
      display: flex;
      align-items: center;
    }
    .nivel-nombre {
      font-size: 0.9375rem;
      font-weight: 600;
      color: #E6EDF3;
    }
    .nivel-btn.selected .nivel-nombre {
      color: #A78BFA;
    }
    .nivel-desc {
      font-size: 0.75rem;
      color: #8B949E;
    }
    .mensaje {
      background: #161B22;
      border: 1px solid #30363D;
      border-left: 3px solid #8B5CF6;
      border-radius: 8px;
      padding: 0.875rem 1rem;
      font-size: 0.875rem;
      color: #C9D1D9;
      line-height: 1.6;
      min-height: 3.5rem;
      transition: all 200ms ease;
    }
  </style>
</head>
<body>
  <span class="component-label">app-perfil-aprendizaje</span>
  <div class="perfil">
    <h2>¿Cuál es tu nivel?</h2>
    <div class="niveles">
      <button class="nivel-btn selected" onclick="seleccionar(this, 'Las explicaciones incluirán analogías del mundo real y partirán desde cero.')">
        <span class="nivel-icon">🌱</span>
        <span class="nivel-nombre">Principiante</span>
        <span class="nivel-desc">Sin experiencia previa con Angular</span>
      </button>
      <button class="nivel-btn" onclick="seleccionar(this, 'Iremos directo al grano asumiendo conocimiento de JavaScript moderno.')">
        <span class="nivel-icon">⚡</span>
        <span class="nivel-nombre">Con experiencia</span>
        <span class="nivel-desc">Conoces JavaScript moderno (ES6+)</span>
      </button>
      <button class="nivel-btn" onclick="seleccionar(this, 'Compararemos patrones de Angular con React y Vue para que el contexto sea inmediato.')">
        <span class="nivel-icon">🚀</span>
        <span class="nivel-nombre">Desarrollador web</span>
        <span class="nivel-desc">Vienes de React, Vue u otro framework</span>
      </button>
    </div>
    <p class="mensaje" id="mensaje">Las explicaciones incluirán analogías del mundo real y partirán desde cero.</p>
  </div>
  <script>
    function seleccionar(btn, msg) {
      document.querySelectorAll('.nivel-btn').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      document.getElementById('mensaje').textContent = msg;
    }
  </script>
</body>
</html>`,
    language: 'typescript',
    aiContext:
      'El usuario está configurando su perfil de aprendizaje. Puede preguntar sobre los niveles o qué esperar del programa. Explica las diferencias entre niveles y sugiere el módulo 1 cuando esté listo. El progreso se sincroniza automáticamente — no hace falta mencionar localStorage ni exportar datos.',
    introMessage: `Esta lección es sobre ti: tu punto de partida y cómo AngularVerse adapta la experiencia a tu nivel.

**Los tres niveles disponibles:**
- **Principiante** — sin experiencia previa en TypeScript ni frameworks. Las explicaciones incluirán analogías del mundo real y no asumirán conocimiento previo.
- **Con experiencia** — conoces JavaScript moderno (ES6+) y tienes idea de qué es un componente. Las explicaciones serán más directas.
- **Desarrollador web** — vienes de React, Vue u otro framework y buscas aprender los patrones específicos de Angular. Ngbot usará comparativas con otros frameworks.

**Sobre el progreso:**
Tu avance se sincroniza automáticamente — puedes continuar desde cualquier dispositivo.

Cuando termines esta lección, comienza el **Módulo 1: Fundamentos** — ahí entra Angular en escena.`,
    suggestedQuestions: [
      '¿Puedo cambiar mi nivel más adelante?',
      '¿Dónde se guarda mi progreso?',
      '¿Cuál es el primer tema que aprenderé?',
    ],
    prerequisites: ['L0.2'],
    nextLesson: 'L1.1',
    xpReward: 50,
    achievements: [
      {
        id: 'onboarding-complete',
        name: 'Primera base',
        description: 'Completaste el onboarding de AngularVerse',
        icon: '🚀',
      },
    ],
  },
];
