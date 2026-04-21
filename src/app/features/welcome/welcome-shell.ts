import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  signal,
} from '@angular/core';
import { Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter, from, take, timer } from 'rxjs';
import { LessonProgressService } from '../../core/services/lesson-progress.service';
import { AuthService } from '../../core/services/auth.service';
import { LogoIconComponent } from '../../shared/components/logo-icon/logo-icon';
import { WelcomeAuthComponent } from './components/welcome-auth/welcome-auth';
import { WelcomeProfileComponent } from './components/welcome-profile/welcome-profile';

const TYPEWRITER_INTERVAL_MS = 60;
const CINEMATIC_TRANSITION_DELAY_MS = 800;

type Act = 0 | 1 | 2 | 3;
type Act3Step = 'auth' | 'profile';

@Component({
  selector: 'app-welcome-shell',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LogoIconComponent, WelcomeAuthComponent, WelcomeProfileComponent],
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
              <app-logo-icon class="logo-svg" />
            </div>
            <p class="typewriter-text">{{ typedText() }}<span class="cursor">|</span></p>
          </div>
        }

        <!-- ACT 2: Brand reveal -->
        @if (currentAct() === 2) {
          <div class="act act-reveal">
            <div class="brand-lockup">
              <div class="brand-ngbot-icon" aria-hidden="true">
                <app-logo-icon class="brand-ngbot-svg" />
              </div>
              <h1 class="brand-title">
                <span class="brand-word">AngularVerse</span>
              </h1>
              <p class="brand-subtitle">Aprende Angular de verdad.<br>Con código en contexto. Con un tutor que te entiende.</p>
              <div class="feature-pills">
                <span class="pill"><span aria-hidden="true">🤖</span> AI Tutor Ngbot</span>
                <span class="pill"><span aria-hidden="true">🚀</span> De cero a producción</span>
                <span class="pill"><span aria-hidden="true">🏆</span> Sistema de XP</span>
              </div>
            </div>
            <button class="btn-skip" (click)="goToAct3()">Comenzar →</button>
          </div>
        }

        <!-- ACT 3: Auth + Profile -->
        @if (currentAct() === 3) {
          @switch (act3Step()) {
            @case ('auth') {
              <app-welcome-auth (authDone)="onAuthDone($event)" />
            }
            @case ('profile') {
              <app-welcome-profile [initialName]="prefillName()" />
            }
          }
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

    .brand-ngbot-svg {
      width: 48px;
      height: 48px;
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

    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(24px); }
      to { opacity: 1; transform: translateY(0); }
    }

    @media (prefers-reduced-motion: reduce) {
      .particle { animation: none; opacity: 0; }
      .nebula { animation: none; }
      .angular-logo-nebula { animation: none; }
      .brand-ngbot-icon { animation: none; }
      .logo-svg .hex-path { animation: none; stroke-dashoffset: 0; }
      .cursor { animation: none; opacity: 1; }
      .btn-skip { animation: none; }
      .act { animation: none; opacity: 1; }
    }
  `],
})
export class WelcomeShellComponent {
  private readonly router = inject(Router);
  private readonly lessonProgress = inject(LessonProgressService);
  private readonly authService = inject(AuthService);
  private readonly destroyRef = inject(DestroyRef);

  readonly currentAct = signal<Act>(0);
  readonly act3Step = signal<Act3Step>('auth');
  readonly typedText = signal('');
  readonly prefillName = signal('');

  readonly reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  readonly particles = this.reducedMotion ? [] : this.generateParticles();

  private typewriterInterval?: ReturnType<typeof setInterval>;

  constructor() {
    from(this.authService.authReady())
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        const currentUser = this.authService.currentUser;

        if (!currentUser) {
          this.startCinematic();
          return;
        }

        // Logged in + profile hydrated → go straight to lessons
        if (this.lessonProgress.isInitialized()) {
          void this.router.navigate(['/lesson', this.lessonProgress.currentLessonId()]);
          return;
        }

        // Logged in but Supabase not hydrated yet — watch profile$ and redirect
        // as soon as it arrives. Show profile step as fallback in case there's no row.
        this.lessonProgress.profile$.pipe(
          filter(p => p !== null && p.userName !== ''),
          take(1),
          takeUntilDestroyed(this.destroyRef),
        ).subscribe(() => {
          void this.router.navigate(['/lesson', this.lessonProgress.currentLessonId()]);
        });

        this.prefillName.set(this.resolvePrefillName());
        this.currentAct.set(3);
        this.act3Step.set('profile');
      });

    this.destroyRef.onDestroy(() => {
      clearInterval(this.typewriterInterval);
    });
  }

  onAuthDone(event: { isNewUser: boolean; prefillName: string }): void {
    if (!event.isNewUser) {
      const currentId = this.lessonProgress.currentLessonId();
      void this.router.navigate(['/lesson', currentId ?? 'L0.1']);
      return;
    }
    this.prefillName.set(event.prefillName);
    this.act3Step.set('profile');
  }

  goToAct3(): void {
    this.currentAct.set(3);
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
        timer(CINEMATIC_TRANSITION_DELAY_MS).pipe(take(1), takeUntilDestroyed(this.destroyRef)).subscribe(() => this.currentAct.set(2));
      }
    }, TYPEWRITER_INTERVAL_MS);
  }

  private resolvePrefillName(): string {
    const user = this.authService.currentUser;
    if (!user) return '';
    const meta = user.user_metadata as Record<string, string> | undefined;
    const name = meta?.['display_name'] ?? meta?.['full_name'] ?? meta?.['name'] ?? '';
    if (name) return name;
    return (user.email ?? '').split('@')[0]
      .replace(/[._\-+]/g, ' ')
      .replace(/\b\w/g, (c: string) => c.toUpperCase()).trim();
  }

  private generateParticles(): string[] {
    return Array.from({ length: 30 }, () => {
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
