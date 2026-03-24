import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
  computed,
  effect,
  inject,
  input,
  signal,
} from '@angular/core';
import { Router } from '@angular/router';
import { LessonProgressService } from '../../core/services/lesson-progress.service';
import { LessonTimelineComponent } from '../timeline/lesson-timeline';
import { ExplainPanelComponent } from './components/explain-panel/explain-panel';
import { CodePanelComponent } from './components/code-panel/code-panel';
import { PreviewPanelComponent } from './components/preview-panel/preview-panel';
import { ChatTutorComponent } from './components/chat-tutor/chat-tutor';
import { LogoIconComponent } from '../../shared/components/logo-icon/logo-icon';
import type { Lesson } from '../../core/models/lesson.model';

@Component({
  selector: 'app-lesson-shell',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    LessonTimelineComponent,
    ExplainPanelComponent,
    CodePanelComponent,
    PreviewPanelComponent,
    ChatTutorComponent,
    LogoIconComponent,
  ],
  template: `
    <div class="lesson-shell" [class.zen-mode]="isZenMode()" [class.lesson-fullscreen]="isLessonFullscreen()">
      <!-- Top bar -->
      <header class="lesson-topbar">
        <div class="topbar-left">
          <button class="logo-btn" (click)="navigateHome()" title="AngularVerse Home">
            <app-logo-icon class="logo-icon" />
            <span class="logo-text">AngularVerse</span>
          </button>
        </div>

        <div class="topbar-right">
          <button
            class="icon-btn"
            [class.active]="isLessonFullscreen()"
            (click)="toggleLessonFullscreen()"
            [title]="isLessonFullscreen() ? 'Salir de vista lectura' : 'Vista lectura completa'"
            [attr.aria-label]="isLessonFullscreen() ? 'Salir de vista lectura' : 'Vista lectura completa'"
          >
            <!-- Book/reading icon -->
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M2 3h5a1 1 0 011 1v9a1 1 0 01-1-1V4H2V3z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>
              <path d="M14 3H9a1 1 0 00-1 1v9a1 1 0 001-1V4h5V3z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>
            </svg>
          </button>
          <button
            class="icon-btn"
            [class.active]="isZenMode()"
            (click)="toggleZenMode()"
            [title]="isZenMode() ? 'Salir del modo Zen (Ctrl+Shift+Z)' : 'Modo Zen (Ctrl+Shift+Z)'"
            [attr.aria-label]="isZenMode() ? 'Salir del modo Zen' : 'Activar modo Zen'"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M2 2h4M2 2v4M14 2h-4M14 2v4M2 14h4M2 14v-4M14 14h-4M14 14v-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
            </svg>
          </button>
          <button
            class="icon-btn"
            [class.active]="isChatOpen()"
            (click)="toggleChat()"
            title="Toggle Ngbot"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M2 2h12v10H9l-3 2v-2H2V2z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>
              <circle cx="5.5" cy="7" r="1" fill="currentColor"/>
              <circle cx="8" cy="7" r="1" fill="currentColor"/>
              <circle cx="10.5" cy="7" r="1" fill="currentColor"/>
            </svg>
          </button>

          <button class="user-avatar-btn" (click)="navigateToProfile()" title="Mi perfil">
            @if (photoUrl()) {
              <img class="user-avatar-img" [src]="photoUrl()" alt="Perfil" />
            } @else {
              <span class="user-avatar-initial">{{ userInitial() }}</span>
            }
          </button>
        </div>
      </header>

      <!-- Timeline (hidden in zen mode) -->
      @if (!isZenMode()) {
        <app-lesson-timeline [currentLessonId]="id()" />
      }

      <!-- Mobile panel tabs (visible only on small screens) -->
      <div class="mobile-panel-tabs">
        <button
          class="tab-btn"
          [class.active]="activeMobilePanel() === 'explain'"
          (click)="activeMobilePanel.set('explain')"
        >Lección</button>
        <button
          class="tab-btn"
          [class.active]="activeMobilePanel() === 'code'"
          (click)="activeMobilePanel.set('code')"
        >Código</button>
        <button
          class="tab-btn"
          [class.active]="activeMobilePanel() === 'preview'"
          (click)="activeMobilePanel.set('preview')"
        >Preview</button>
      </div>

      <!-- Panels grid -->
      <div class="panels-grid" [class.chat-open]="isChatOpen()" [attr.data-mobile-panel]="activeMobilePanel()">
        <app-explain-panel
          [lesson]="lesson()"
        />
        <app-code-panel
          [lesson]="lesson()"
        />
        <app-preview-panel
          [code]="currentCode()"
          [previewHtml]="lesson()?.previewHtml ?? ''"
        />
      </div>

      <!-- Chat tutor (fixed bottom) -->
      <app-chat-tutor
        [lesson]="lesson()"
        [currentCode]="currentCode()"
        [isOpen]="isChatOpen()"
        (toggle)="toggleChat()"
      />
    </div>
  `,
  styles: [`
    .lesson-shell {
      display: flex;
      flex-direction: column;
      height: 100vh;
      overflow: hidden;
      background: var(--bg-base);
    }

    // Topbar
    .lesson-topbar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 1.25rem;
      height: 52px;
      background: var(--bg-elevated);
      border-bottom: 1px solid var(--border);
      flex-shrink: 0;
      z-index: 10;
    }

    .topbar-left {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .logo-btn {
      display: flex;
      align-items: center;
      gap: 0.375rem;
      background: none;
      border: none;
      cursor: pointer;
      padding: 0;
      transition: opacity 200ms ease;

      &:hover { opacity: 0.8; }
    }

    .logo-icon {
      flex-shrink: 0;
      width: 32px;
      height: 32px;
      filter: drop-shadow(0 0 4px rgba(124, 58, 237, 0.3));
    }

    .logo-text {
      font-family: var(--font-body);
      font-size: 1rem;
      font-weight: 800;
      color: var(--text-primary);
      letter-spacing: -0.03em;
    }

    .topbar-right {
      display: flex;
      align-items: center;
      gap: 0.375rem;
    }

    .user-avatar-btn {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      border: 1.5px solid var(--accent-primary);
      background: rgba(124, 58, 237, 0.15);
      color: var(--accent-primary);
      font-size: 0.8125rem;
      font-weight: 700;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
      transition: filter 150ms;
      padding: 0;

      &:hover { filter: brightness(1.2); }
    }

    .user-avatar-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .user-avatar-initial {
      line-height: 1;
      padding-top: 1px;
    }

    .icon-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 32px;
      height: 32px;
      background: var(--bg-surface);
      border: 1px solid var(--border-subtle);
      border-radius: 6px;
      color: var(--text-muted);
      cursor: pointer;
      transition: all 150ms ease;

      &:hover {
        color: var(--text-primary);
        border-color: var(--accent-primary);
      }

      &.active {
        background: rgba(124, 58, 237, 0.15);
        border-color: var(--accent-primary);
        color: var(--accent-primary-light);
      }
    }

    // Mobile panel tabs
    .mobile-panel-tabs {
      display: none; /* hidden on desktop */
      background: var(--bg-elevated);
      border-bottom: 1px solid var(--border);
      flex-shrink: 0;
    }

    .tab-btn {
      flex: 1;
      padding: 0.625rem;
      background: none;
      border: none;
      color: var(--text-muted);
      font-size: 0.8125rem;
      font-weight: 600;
      cursor: pointer;
      border-bottom: 2px solid transparent;
      transition: all 150ms ease;

      &.active {
        color: var(--accent-primary);
        border-bottom-color: var(--accent-primary);
      }
      &:hover:not(.active) { color: var(--text-secondary); }
    }

    // Panels grid — CSS Grid layout
    .panels-grid {
      flex: 1;
      min-height: 0;
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      grid-template-rows: minmax(0, 1fr);
      overflow: hidden;

      app-explain-panel,
      app-code-panel,
      app-preview-panel {
        min-height: 0;
        overflow: hidden;
      }
    }

    @media (min-width: 769px) {
      .mobile-panel-tabs { display: none !important; }

      .zen-mode {
        .lesson-topbar {
          background: rgba(13, 17, 23, 0.95);
          backdrop-filter: blur(8px);
        }

        .panels-grid {
          grid-template-columns: 1fr;

          app-explain-panel,
          app-preview-panel {
            display: none;
          }
        }
      }

      .lesson-fullscreen {
        .panels-grid {
          grid-template-columns: 1fr;

          app-code-panel,
          app-preview-panel {
            display: none;
          }
        }
      }
    }

    @media (max-width: 1024px) and (min-width: 769px) {
      .panels-grid {
        app-preview-panel {
          display: none;
        }
      }
    }

    @media (max-width: 768px) {
      .mobile-panel-tabs {
        display: flex;
      }

      .panels-grid {
        grid-template-columns: 1fr !important;

        app-explain-panel,
        app-code-panel,
        app-preview-panel {
          display: none;
        }
      }

      /* Show active panel based on data attribute */
      .panels-grid[data-mobile-panel="explain"] app-explain-panel { display: flex; flex-direction: column; }
      .panels-grid[data-mobile-panel="code"] app-code-panel { display: flex; flex-direction: column; }
      .panels-grid[data-mobile-panel="preview"] app-preview-panel { display: flex; flex-direction: column; }
    }

    @media (max-width: 480px) {
      .logo-text { display: none; }

      .lesson-topbar {
        padding: 0 1rem;
        height: 52px;
      }

      .logo-icon {
        width: 32px;
        height: 32px;
      }

      .icon-btn {
        display: none;
      }

      .user-avatar-btn {
        width: 32px;
        height: 32px;
      }
    }
  `],
})
export class LessonShellComponent {
  private readonly progressService = inject(LessonProgressService);
  private readonly router = inject(Router);

  readonly photoUrl = this.progressService.photoUrl;
  readonly userInitial = computed(() =>
    this.progressService.userName().charAt(0).toUpperCase() || 'U'
  );

  readonly id = input<string>(''); // debe coincidir con el param :id de la ruta

  readonly lesson = computed((): Lesson | null => {
    const lessonId = this.id();
    return lessonId ? this.progressService.getLessonById(lessonId) : null;
  });

  readonly currentCode = signal('');
  readonly isZenMode = signal(false);
  readonly isChatOpen = signal(true);
  readonly isLessonFullscreen = signal(false);
  readonly activeMobilePanel = signal<'explain' | 'code' | 'preview'>('explain');

  protected readonly _loadEffect = effect(() => {
    const lesson = this.lesson();
    if (lesson) {
      this.currentCode.set(lesson.starterCode);
    }
  });

  toggleLessonFullscreen(): void {
    const next = !this.isLessonFullscreen();
    this.isLessonFullscreen.set(next);
    if (next) this.isZenMode.set(false);
  }

  toggleZenMode(): void {
    const next = !this.isZenMode();
    this.isZenMode.set(next);
    if (next) this.isLessonFullscreen.set(false);
  }

  toggleChat(): void {
    this.isChatOpen.update(v => !v);
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent): void {
    if (event.ctrlKey && event.shiftKey && event.key === 'Z') {
      event.preventDefault();
      this.toggleZenMode();
    }
  }

  navigateHome(): void {
    void this.router.navigate(['/welcome']);
  }

  navigateToProfile(): void {
    void this.router.navigate(['/profile']);
  }
}
