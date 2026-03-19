import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  computed,
  inject,
  signal,
} from '@angular/core';
import { Router } from '@angular/router';
import { LessonProgressService } from '../../core/services/lesson-progress.service';
import type { UserLevel } from '../../core/models/user-profile.model';

type Act = 0 | 1 | 2 | 3;

@Component({
  selector: 'app-welcome',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="welcome-shell" [attr.data-act]="currentAct()">
      <!-- Particle field -->
      <div class="particles" aria-hidden="true">
        @for (p of particles; track p) {
          <div class="particle" [style]="p"></div>
        }
      </div>

      <!-- Nebula blobs -->
      <div class="nebula nebula-1" aria-hidden="true"></div>
      <div class="nebula nebula-2" aria-hidden="true"></div>

      <div class="welcome-content">
        <!-- ACT 0-1: Intro cinematic -->
        @if (currentAct() <= 1) {
          <div class="act act-intro" [class.visible]="currentAct() === 0">
            <div class="angular-logo-nebula" aria-hidden="true">
              <svg viewBox="0 0 60 60" fill="none" class="logo-svg">
                <polygon points="30,2 54,16 54,44 30,58 6,44 6,16" fill="#1F2937" stroke="#7C3AED" stroke-width="2" class="hex-path"/>
                <path d="M30 14 L44 20 L44 32 Q44 42 30 48 Q16 42 16 32 L16 20 Z" fill="none" stroke="#DD0031" stroke-width="2.5"/>
                <path d="M24 28 L28 20 L32 28 M25.5 26 L34.5 26" stroke="#DD0031" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
                <circle cx="24" cy="34" r="2" fill="#7C3AED" class="bot-eye"/>
                <circle cx="36" cy="34" r="2" fill="#7C3AED" class="bot-eye"/>
              </svg>
            </div>
            <p class="typewriter-text">{{ typedText() }}<span class="cursor">|</span></p>
          </div>
        }

        <!-- ACT 2: Brand reveal -->
        @if (currentAct() === 2) {
          <div class="act act-reveal">
            <div class="brand-lockup">
              <div class="brand-ngbot-icon" aria-hidden="true">
                <svg width="48" height="48" viewBox="0 0 60 60" fill="none">
                  <polygon points="30,2 54,16 54,44 30,58 6,44 6,16" fill="#1F2937" stroke="#7C3AED" stroke-width="2"/>
                  <path d="M30 14 L44 20 L44 32 Q44 42 30 48 Q16 42 16 32 L16 20 Z" fill="none" stroke="#DD0031" stroke-width="2.5"/>
                  <path d="M24 28 L28 20 L32 28 M25.5 26 L34.5 26" stroke="#DD0031" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
                  <circle cx="24" cy="34" r="2" fill="#7C3AED" class="bot-eye"/>
                  <circle cx="36" cy="34" r="2" fill="#7C3AED" class="bot-eye"/>
                </svg>
              </div>
              <h1 class="brand-title">
                <span class="angular-badge">ng</span>
                <span class="brand-word">AngularVerse</span>
              </h1>
              <p class="brand-subtitle">Aprende Angular de verdad.<br>Con código en contexto. Con un tutor que te entiende.</p>
              <div class="feature-pills">
                <span class="pill">⚡ Angular 19 Signals</span>
                <span class="pill">🤖 AI Tutor Ngbot</span>
                <span class="pill">💻 Código en contexto</span>
                <span class="pill">🏆 Sistema de XP</span>
              </div>
            </div>
            <button class="btn-skip" (click)="goToAct3()">Comenzar →</button>
          </div>
        }

        <!-- ACT 3: Registration form -->
        @if (currentAct() === 3) {
          <div class="act act-form">
            <div class="form-header">
              <h2 class="form-title">Tu viaje comienza aquí</h2>
              <p class="form-subtitle">Personaliza tu experiencia de aprendizaje</p>
            </div>

            <div class="form-group">
              <label class="form-label" for="userName">¿Cómo te llamas?</label>
              <input
                id="userName"
                type="text"
                class="form-input"
                placeholder="Tu nombre o alias..."
                [value]="userName()"
                (input)="userName.set(getInputValue($event))"
                (keydown.enter)="submit()"
                maxlength="30"
              />
            </div>

            <div class="form-group">
              <label class="form-label">Tu nivel de experiencia</label>
              <div class="level-cards">
                @for (level of levels; track level.id) {
                  <button
                    class="level-card"
                    [class.selected]="selectedLevel() === level.id"
                    (click)="selectedLevel.set(level.id)"
                    type="button"
                  >
                    <span class="level-icon">{{ level.icon }}</span>
                    <span class="level-name">{{ level.name }}</span>
                    <span class="level-desc">{{ level.description }}</span>
                  </button>
                }
              </div>
            </div>

            <button
              class="btn-start"
              [class.ready]="isReady()"
              [disabled]="!isReady()"
              (click)="submit()"
            >
              Comenzar mi viaje
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M3 8h10m-4-4l4 4-4 4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>

            <button class="btn-skip-small" (click)="skipToAdvanced()">
              ¿Ya sabes Angular? Saltar al Módulo 2 →
            </button>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .welcome-shell {
      position: fixed;
      inset: 0;
      background: var(--bg-base);
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
    }

    // Particles
    .particles {
      position: absolute;
      inset: 0;
      pointer-events: none;
    }

    .particle {
      position: absolute;
      width: 2px;
      height: 2px;
      background: var(--accent-primary);
      border-radius: 50%;
      animation: particleFloat var(--duration, 8s) ease-in-out infinite;
      animation-delay: var(--delay, 0s);
      left: var(--x, 50%);
    }

    @keyframes particleFloat {
      0% { transform: translateY(110vh) scale(0); opacity: 0; }
      10% { opacity: 1; transform: translateY(90vh) scale(1); }
      90% { opacity: 0.6; }
      100% { transform: translateY(-10vh) scale(0.5) translateX(var(--drift, 0px)); opacity: 0; }
    }

    // Nebulas
    .nebula {
      position: absolute;
      border-radius: 50%;
      filter: blur(80px);
      animation: nebula 8s ease-in-out infinite;
      pointer-events: none;
    }

    .nebula-1 {
      width: 600px;
      height: 600px;
      background: radial-gradient(circle, rgba(124,58,237,0.12) 0%, transparent 70%);
      top: -200px;
      left: -100px;
    }

    .nebula-2 {
      width: 500px;
      height: 500px;
      background: radial-gradient(circle, rgba(221,0,49,0.08) 0%, transparent 70%);
      bottom: -150px;
      right: -100px;
      animation-delay: -4s;
    }

    @keyframes nebula {
      0%, 100% { transform: scale(1) rotate(0deg); opacity: 0.8; }
      50% { transform: scale(1.2) rotate(20deg); opacity: 1; }
    }

    // Content
    .welcome-content {
      position: relative;
      z-index: 10;
      width: 100%;
      max-width: 540px;
      padding: 2rem;
    }

    // Acts
    .act {
      animation: fadeInUp 0.8s ease forwards;
    }

    .act-intro {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 2rem;
    }

    .angular-logo-nebula {
      animation: breathing 3s ease-in-out infinite;
    }

    .logo-svg {
      width: 200px;
      height: 200px;

      .hex-path {
        stroke-dasharray: 200;
        stroke-dashoffset: 200;
        animation: draw 1.5s ease forwards 0.5s;
      }
    }

    @keyframes draw {
      to { stroke-dashoffset: 0; }
    }

    @keyframes breathing {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.04); }
    }

    .typewriter-text {
      font-family: var(--font-mono);
      font-size: 1.125rem;
      color: var(--text-secondary);
      text-align: center;
      max-width: 400px;
      min-height: 1.75em;
    }

    .cursor {
      animation: blink 1s step-end infinite;
      color: var(--accent-primary);
    }

    @keyframes blink {
      0%, 100% { opacity: 1; }
      50% { opacity: 0; }
    }

    @keyframes eyeBlink {
      0%, 88%, 100% { transform: scaleY(1); opacity: 1; }
      93% { transform: scaleY(0.15); opacity: 0.8; }
    }

    @keyframes eyeGlow {
      0%, 100% { opacity: 0.9; }
      50% { opacity: 1; filter: drop-shadow(0 0 2px #7C3AED); }
    }

    .bot-eye {
      animation: eyeBlink 4s ease-in-out infinite, eyeGlow 2s ease-in-out infinite;
      transform-origin: center;
      transform-box: fill-box;
    }

    .bot-eye:last-child {
      animation-delay: 0.07s, 0.5s;
    }

    // Act 2
    .act-reveal {
      text-align: center;
    }

    .brand-lockup {
      margin-bottom: 2rem;
    }

    .brand-ngbot-icon {
      display: flex;
      justify-content: center;
      margin-bottom: 1rem;
      animation: breathing 3s ease-in-out infinite;
    }

    .brand-title {
      font-family: var(--font-body);
      font-size: clamp(2.5rem, 6vw, 4rem);
      font-weight: 800;
      letter-spacing: -0.03em;
      color: var(--text-primary);
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      margin-bottom: 1rem;
      line-height: 1.1;
    }

    .angular-badge {
      background: var(--accent-angular);
      color: white;
      font-family: var(--font-mono);
      font-size: 0.5em;
      padding: 0.15em 0.4em;
      border-radius: 4px;
      font-weight: 700;
      letter-spacing: 0;
      vertical-align: middle;
    }

    .brand-subtitle {
      font-size: 1.125rem;
      color: var(--text-secondary);
      line-height: 1.6;
      margin-bottom: 1.5rem;
    }

    .feature-pills {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
      justify-content: center;
      margin-bottom: 2rem;
    }

    .pill {
      background: rgba(124, 58, 237, 0.1);
      border: 1px solid rgba(124, 58, 237, 0.2);
      color: var(--text-secondary);
      padding: 0.375rem 0.75rem;
      border-radius: 999px;
      font-size: 0.8125rem;
    }

    .btn-skip {
      background: var(--accent-primary);
      color: white;
      border: none;
      padding: 0.875rem 2rem;
      border-radius: 8px;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      animation: glow 2s ease-in-out infinite;
      transition: transform 200ms ease;

      &:hover { transform: translateY(-2px); }
    }

    @keyframes glow {
      0%, 100% { box-shadow: 0 0 10px var(--glow); }
      50% { box-shadow: 0 0 30px var(--glow), 0 0 60px var(--glow); }
    }

    // Act 3 Form
    .act-form {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .form-header { text-align: center; }

    .form-title {
      font-family: var(--font-display);
      font-size: 2rem;
      font-weight: 700;
      color: var(--text-primary);
      margin-bottom: 0.5rem;
    }

    .form-subtitle {
      color: var(--text-secondary);
      font-size: 0.9375rem;
    }

    .form-label {
      display: block;
      font-size: 0.875rem;
      font-weight: 600;
      color: var(--text-secondary);
      margin-bottom: 0.5rem;
      letter-spacing: 0.03em;
      text-transform: uppercase;
    }

    .form-input {
      width: 100%;
      background: var(--bg-surface);
      border: 1px solid var(--border-subtle);
      color: var(--text-primary);
      padding: 0.75rem 1rem;
      border-radius: 8px;
      font-size: 1rem;
      font-family: var(--font-body);
      transition: border-color 200ms ease, box-shadow 200ms ease;

      &::placeholder { color: var(--text-muted); }

      &:focus {
        outline: none;
        border-color: var(--accent-primary);
        box-shadow: 0 0 0 3px rgba(124, 58, 237, 0.15);
      }
    }

    .level-cards {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 0.75rem;
    }

    .level-card {
      background: var(--bg-surface);
      border: 1px solid var(--border-subtle);
      border-radius: 10px;
      padding: 1rem 0.75rem;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.375rem;
      cursor: pointer;
      transition: all 200ms ease;
      text-align: center;

      &:hover {
        border-color: var(--accent-primary);
        background: rgba(124, 58, 237, 0.05);
      }

      &.selected {
        border-color: var(--accent-primary);
        background: rgba(124, 58, 237, 0.1);
        box-shadow: 0 0 0 2px rgba(124, 58, 237, 0.3);
      }
    }

    .level-icon {
      font-size: 1.5rem;
    }

    .level-name {
      font-size: 0.8125rem;
      font-weight: 600;
      color: var(--text-primary);
    }

    .level-desc {
      font-size: 0.6875rem;
      color: var(--text-muted);
      line-height: 1.3;
    }

    .btn-start {
      width: 100%;
      background: var(--accent-primary);
      color: white;
      border: none;
      padding: 1rem;
      border-radius: 10px;
      font-size: 1.0625rem;
      font-weight: 700;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      transition: all 200ms ease;
      opacity: 0.5;

      &.ready {
        opacity: 1;
        animation: glow 3s ease-in-out infinite;

        &:hover { transform: translateY(-2px); }
      }

      &:disabled { cursor: not-allowed; }
    }

    .btn-skip-small {
      text-align: center;
      color: var(--text-muted);
      font-size: 0.8125rem;
      background: none;
      border: none;
      cursor: pointer;
      transition: color 200ms ease;

      &:hover { color: var(--accent-primary); }
    }

    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(24px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `],
})
export class WelcomeComponent {
  private readonly router = inject(Router);
  private readonly lessonProgress = inject(LessonProgressService);
  private readonly destroyRef = inject(DestroyRef);

  readonly currentAct = signal<Act>(0);
  readonly typedText = signal('');
  readonly userName = signal('');
  readonly selectedLevel = signal<UserLevel>('beginner');
  readonly isReady = computed(() => this.userName().trim().length >= 2);

  readonly levels: Array<{ id: UserLevel; name: string; icon: string; description: string }> = [
    { id: 'beginner', name: 'Principiante', icon: '🌱', description: 'Nuevo en Angular y frameworks' },
    { id: 'intermediate', name: 'Con bases', icon: '⚡', description: 'Conozco JS/TS, algo de frameworks' },
    { id: 'developer', name: 'Desarrollador', icon: '🚀', description: 'Web dev, aprendo Angular' },
  ];

  readonly particles = this.generateParticles();

  private typewriterInterval?: ReturnType<typeof setInterval>;

  constructor() {
    if (this.lessonProgress.isInitialized()) {
      const currentId = this.lessonProgress.currentLessonId();
      void this.router.navigate(['/lesson', currentId]);
      return;
    }

    this.startCinematic();

    this.destroyRef.onDestroy(() => {
      clearInterval(this.typewriterInterval);
    });
  }

  private startCinematic(): void {
    const text = 'En el principio era el componente...';
    let i = 0;

    this.typewriterInterval = setInterval(() => {
      if (i <= text.length) {
        this.typedText.set(text.slice(0, i));
        i++;
      } else {
        clearInterval(this.typewriterInterval);
        setTimeout(() => this.currentAct.set(2), 800);
      }
    }, 60);
  }

  goToAct3(): void {
    this.currentAct.set(3);
  }

  submit(): void {
    if (!this.isReady()) return;
    this.lessonProgress.initUser(this.userName().trim(), this.selectedLevel());
    void this.router.navigate(['/lesson', 'L0.1']);
  }

  skipToAdvanced(): void {
    const name = this.userName().trim() || 'Desarrollador';
    this.lessonProgress.initUser(name, 'developer');
    void this.router.navigate(['/lesson', 'L1.1']);
  }

  getInputValue(event: Event): string {
    return (event.target as HTMLInputElement).value;
  }

  private generateParticles(): string[] {
    return Array.from({ length: 30 }, (_, i) => {
      const x = Math.random() * 100;
      const duration = 6 + Math.random() * 8;
      const delay = Math.random() * -10;
      const drift = (Math.random() - 0.5) * 100;
      const size = 1 + Math.random() * 2;
      const opacity = 0.3 + Math.random() * 0.6;
      return `--x:${x}%;--duration:${duration}s;--delay:${delay}s;--drift:${drift}px;width:${size}px;height:${size}px;opacity:${opacity};animation-delay:${delay}s`;
    });
  }
}
