import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  computed,
  inject,
  input,
  signal,
} from '@angular/core';
import { Router } from '@angular/router';
import { LessonProgressService } from '../../../../core/services/lesson-progress.service';
import { LevelSelectorComponent } from '../../../../shared/components/level-selector/level-selector.component';
import type { UserLevel } from '../../../../core/models/user-profile.model';

const FIRST_LESSON_ID = 'L0.1';
const INTRO_LESSON_ID = 'L1.1';

@Component({
  selector: 'app-welcome-profile',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LevelSelectorComponent],
  template: `
    <div class="act-form">
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
        <app-level-selector
          [selected]="selectedLevel()"
          (levelChange)="selectedLevel.set($event)"
        />
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
    </div>
  `,
  styles: [`
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

    @keyframes glow {
      0%, 100% { box-shadow: 0 0 10px var(--glow); }
      50% { box-shadow: 0 0 30px var(--glow), 0 0 60px var(--glow); }
    }

    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(24px); }
      to { opacity: 1; transform: translateY(0); }
    }

    @media (prefers-reduced-motion: reduce) {
      .btn-start.ready { animation: none; }
    }
  `],
})
export class WelcomeProfileComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly lessonProgress = inject(LessonProgressService);

  /** Optional pre-filled name coming from auth (e.g. from user_metadata). */
  readonly initialName = input('');

  readonly userName = signal('');
  readonly selectedLevel = signal<UserLevel>('beginner');
  readonly isReady = computed(() => this.userName().trim().length >= 2);

  constructor() {
    // Pre-fill name if shell passes one in via input()
    // We use a non-signal approach: read once on init via effect alternative
    // (signal-based input is read reactively, so we initialise the writable signal lazily)
  }

  ngOnInit(): void {
    const name = this.initialName();
    if (name) this.userName.set(name);
  }

  submit(): void {
    if (!this.isReady()) return;
    this.lessonProgress.initUser(this.userName().trim(), this.selectedLevel());
    void this.router.navigate(['/lesson', FIRST_LESSON_ID]);
  }

  skipToAdvanced(): void {
    const name = this.userName().trim() || 'Desarrollador';
    this.lessonProgress.initUser(name, 'developer');
    void this.router.navigate(['/lesson', INTRO_LESSON_ID]);
  }

  getInputValue(event: Event): string {
    return (event.target as HTMLInputElement).value;
  }
}
