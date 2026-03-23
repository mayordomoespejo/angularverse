import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  computed,
  inject,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { LessonProgressService } from '../../core/services/lesson-progress.service';
import { AuthService } from '../../core/services/auth.service';
import type { UserLevel } from '../../core/models/user-profile.model';

type Act = 0 | 1 | 2 | 3;
type Act3Step = 'auth' | 'profile';

@Component({
  selector: 'app-welcome',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule],
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
                <path d="M30,2 L54,16 L54,44 L30,58 L6,44 L6,16 Z" fill="#1F2937" stroke="#7C3AED" stroke-width="2" class="hex-path"/>
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
                <span class="brand-word">AngularVerse</span>
              </h1>
              <p class="brand-subtitle">Aprende Angular de verdad.<br>Con código en contexto. Con un tutor que te entiende.</p>
              <div class="feature-pills">
                <span class="pill">🤖 AI Tutor Ngbot</span>
                <span class="pill">🚀 De cero a producción</span>
                <span class="pill">🏆 Sistema de XP</span>
              </div>
            </div>
            <button class="btn-skip" (click)="goToAct3()">Comenzar →</button>
          </div>
        }

        <!-- ACT 3: Auth + Profile -->
        @if (currentAct() === 3) {
          <div class="act act-form">

            <!-- STEP: AUTH -->
            @if (act3Step() === 'auth') {
              <div class="form-header">
                <h2 class="form-title">Tu viaje comienza aquí</h2>
                <p class="form-subtitle">Introduce tu email y contraseña para continuar</p>
              </div>

              <!-- Error / Success -->
              @if (authError()) {
                <div class="auth-error" role="alert">{{ authError() }}</div>
              }
              @if (authSuccess()) {
                <div class="auth-success" role="status">{{ authSuccess() }}</div>
              }

              <!-- Smart auth form -->
              <form class="auth-form" (ngSubmit)="submitEmailPassword()">
                <div class="form-group">
                  <label for="email">Email</label>
                  <input
                    id="email"
                    type="email"
                    class="form-input"
                    placeholder="tu@email.com"
                    [value]="email()"
                    (input)="email.set(getInputValue($event))"
                    name="email"
                    required
                    autocomplete="email"
                  />
                </div>
                <div class="form-group">
                  <label for="password">Contraseña</label>
                  <input
                    id="password"
                    type="password"
                    class="form-input"
                    placeholder="Mínimo 8 caracteres"
                    [value]="password()"
                    (input)="password.set(getInputValue($event))"
                    name="password"
                    required
                    minlength="8"
                    autocomplete="current-password"
                  />
                </div>
                <button type="submit" class="btn-start ready" [disabled]="authLoading()">
                  {{ authLoading() ? 'Cargando...' : 'Continuar' }}
                </button>
              </form>

              <!-- Divider -->
              <div class="auth-divider"><span>o</span></div>

              <!-- Google -->
              <button class="btn-google" (click)="loginWithGoogle()" [disabled]="authLoading()">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
                  <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853"/>
                  <path d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
                  <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 6.29C4.672 4.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
                </svg>
                Continuar con Google
              </button>
            }

            <!-- STEP: PROFILE -->
            @if (act3Step() === 'profile') {
              <div class="form-header">
                <h2 class="form-title">Personaliza tu experiencia</h2>
                <p class="form-subtitle">Ngbot adaptará sus explicaciones a tu nivel</p>
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
                <p class="level-hint">Tu elección determina cómo Ngbot adapta sus explicaciones.</p>
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
            }

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

    .welcome-content {
      position: relative;
      z-index: 10;
      width: 100%;
      max-width: 540px;
      padding: 2rem;
    }

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
        animation: draw 1.5s ease-in both 0.5s;
      }
    }

    @keyframes draw {
      0%   { stroke-dasharray: 168; stroke-dashoffset: 168; }
      99%  { stroke-dasharray: 168; stroke-dashoffset: 0; }
      100% { stroke-dasharray: none; stroke-dashoffset: 0; }
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

    .bot-eye {
      animation: eyeMove 6s ease-in-out infinite, eyeGlow 2s ease-in-out infinite;
      transform-origin: center;
      transform-box: fill-box;
    }

    .bot-eye:last-child {
      animation-delay: 0.07s, 0.5s;
    }

    @keyframes eyeMove {
      0%   { transform: translate(0, 0) scaleY(1); }
      10%  { transform: translate(1.5px, -0.7px) scaleY(1); }
      20%  { transform: translate(-1.2px, -0.4px) scaleY(1); }
      35%  { transform: translate(0, 0) scaleY(1); }
      48%  { transform: translate(0, 0) scaleY(0.15); }
      52%  { transform: translate(0, 0) scaleY(1); }
      65%  { transform: translate(-1.5px, 0.7px) scaleY(1); }
      80%  { transform: translate(1px, 0.5px) scaleY(1); }
      88%  { transform: translate(1px, 0.5px) scaleY(0.15); }
      92%  { transform: translate(1px, 0.5px) scaleY(1); }
      100% { transform: translate(0, 0) scaleY(1); }
    }

    @keyframes eyeGlow {
      0%, 100% { opacity: 0.9; }
      50% { opacity: 1; filter: drop-shadow(0 0 2px #7C3AED); }
    }

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

    // Act 3
    .act-form {
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
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

    .auth-error {
      background: rgba(239, 68, 68, 0.1);
      border: 1px solid rgba(239, 68, 68, 0.3);
      color: #f87171;
      padding: 0.75rem 1rem;
      border-radius: 8px;
      font-size: 0.875rem;
    }

    .auth-success {
      background: rgba(34, 197, 94, 0.1);
      border: 1px solid rgba(34, 197, 94, 0.3);
      color: #4ade80;
      padding: 0.75rem 1rem;
      border-radius: 8px;
      font-size: 0.875rem;
    }

    .auth-form {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .auth-divider {
      display: flex;
      align-items: center;
      gap: 1rem;
      color: var(--text-muted);
      font-size: 0.8125rem;

      &::before, &::after {
        content: '';
        flex: 1;
        height: 1px;
        background: var(--border-subtle);
      }
    }

    .btn-google {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.75rem;
      background: transparent;
      border: 1px solid var(--border-subtle);
      color: var(--text-primary);
      padding: 0.875rem;
      border-radius: 8px;
      font-size: 0.9375rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 200ms ease;

      &:hover:not(:disabled) {
        background: rgba(124,58,237,0.05);
        border-color: var(--accent-primary);
      }

      &:disabled { opacity: 0.6; cursor: not-allowed; }
    }

    // Profile step
    .form-label {
      display: block;
      font-size: 0.875rem;
      font-weight: 600;
      color: var(--text-secondary);
      margin-bottom: 0.5rem;
      letter-spacing: 0.03em;
      text-transform: uppercase;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 0.375rem;

      label {
        font-size: 0.8125rem;
        font-weight: 600;
        color: var(--text-secondary);
        letter-spacing: 0.03em;
        text-transform: uppercase;
      }
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

    .level-hint {
      margin-top: 0.5rem;
      font-size: 0.75rem;
      color: var(--text-muted);
      line-height: 1.5;
      text-align: center;
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

    .level-icon { font-size: 1.5rem; }

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
  private readonly authService = inject(AuthService);
  private readonly destroyRef = inject(DestroyRef);

  readonly currentAct = signal<Act>(0);
  readonly act3Step = signal<Act3Step>('auth');
  readonly authLoading = signal(false);
  readonly authError = signal('');
  readonly authSuccess = signal('');

  readonly email = signal('');
  readonly password = signal('');
  readonly userName = signal('');
  readonly selectedLevel = signal<UserLevel>('beginner');
  readonly typedText = signal('');
  readonly isReady = computed(() => this.userName().trim().length >= 2);

  readonly levels: Array<{ id: UserLevel; name: string; icon: string; description: string }> = [
    { id: 'beginner', name: 'Principiante', icon: '🌱', description: 'Nuevo en Angular y frameworks' },
    { id: 'intermediate', name: 'Con experiencia', icon: '⚡', description: 'Manejo JavaScript moderno y algo de frameworks' },
    { id: 'developer', name: 'Desarrollador', icon: '🚀', description: 'Web dev, aprendo Angular' },
  ];

  readonly particles = this.generateParticles();

  private typewriterInterval?: ReturnType<typeof setInterval>;

  constructor() {
    // Returning user — already auth + profile set up
    if (this.lessonProgress.isInitialized()) {
      const currentId = this.lessonProgress.currentLessonId();
      void this.router.navigate(['/lesson', currentId]);
      return;
    }

    // Returning user — auth but no profile yet
    if (this.authService.currentUser) {
      this.prefillName();
      this.currentAct.set(3);
      this.act3Step.set('profile');
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

  // ── Auth ────────────────────────────────────────────────────────────────

  submitEmailPassword(): void {
    this.authError.set('');
    this.authSuccess.set('');
    this.authLoading.set(true);

    this.authService.smartAuth(this.email(), this.password()).subscribe({
      next: () => {
        this.authLoading.set(false);
        this.prefillName();
        this.act3Step.set('profile');
      },
      error: (err: { code?: string; message?: string }) => {
        this.authError.set(this.mapFirebaseError(err.code ?? err.message ?? ''));
        this.authLoading.set(false);
      },
    });
  }

  loginWithGoogle(): void {
    this.authError.set('');
    this.authLoading.set(true);

    this.authService.loginWithGoogle().subscribe({
      next: () => {
        this.authLoading.set(false);
        this.prefillName();
        this.act3Step.set('profile');
      },
      error: (err: { message?: string }) => {
        this.authError.set(this.mapFirebaseError(err.message ?? ''));
        this.authLoading.set(false);
      },
    });
  }

  // ── Profile ─────────────────────────────────────────────────────────────

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

  // ── Utils ────────────────────────────────────────────────────────────────

  private prefillName(): void {
    const user = this.authService.currentUser;
    if (!user) return;

    // Google / social → use displayName directly
    if (user.displayName) {
      this.userName.set(user.displayName);
      return;
    }

    // Email/password → extract and capitalize the part before @
    const local = (user.email ?? '').split('@')[0];
    const name = local
      .replace(/[._\-+]/g, ' ')
      .replace(/\b\w/g, (c) => c.toUpperCase())
      .trim();

    this.userName.set(name);
  }

  getInputValue(event: Event): string {
    return (event.target as HTMLInputElement).value;
  }

  private mapFirebaseError(code: string): string {
    if (code.includes('invalid-credential') || code.includes('wrong-password')) return 'Contraseña incorrecta.';
    if (code.includes('weak-password')) return 'La contraseña debe tener al menos 8 caracteres.';
    if (code.includes('invalid-email')) return 'El email no tiene un formato válido.';
    if (code.includes('too-many-requests')) return 'Demasiados intentos. Espera unos minutos.';
    if (code.includes('popup-closed-by-user')) return 'Ventana de Google cerrada. Inténtalo de nuevo.';
    if (code.includes('network-request-failed')) return 'Sin conexión. Comprueba tu red.';
    return 'Ocurrió un error. Inténtalo de nuevo.';
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
