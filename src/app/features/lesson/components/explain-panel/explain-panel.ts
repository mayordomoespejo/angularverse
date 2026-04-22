import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  SecurityContext,
  computed,
  effect,
  inject,
  input,
  signal,
} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import type { Lesson } from '../../../../core/models/lesson.model';
import { LessonProgressService } from '../../../../core/services/lesson-progress.service';

@Component({
  selector: 'app-explain-panel',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <aside class="explain-panel custom-scroll">
      @if (lesson()) {
        <div class="panel-header">
          <div class="lesson-meta">
            <span class="module-tag">M{{ lesson()!.module }} · {{ lesson()!.moduleTitle }}</span>
            <span class="time-tag">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <circle cx="6" cy="6" r="5" stroke="currentColor" stroke-width="1.5"/>
                <path d="M6 3v3l2 1.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
              </svg>
              {{ lesson()!.estimatedMinutes }} min
            </span>
          </div>
          <h1 class="lesson-title">{{ lesson()!.title }}</h1>
          <p class="lesson-subtitle">{{ lesson()!.subtitle }}</p>
          <div class="xp-badge">+{{ lesson()!.xpReward }} XP al completar</div>
        </div>

        <div class="narrative-content">
          @for (block of renderedNarrative(); track block.type + $index) {
            @switch (block.type) {
              @case ('text') {
                <p class="narrative-text" [innerHTML]="block.rendered"></p>
              }
              @case ('tip') {
                <div class="tip-block" [attr.data-variant]="block.variant">
                  <div class="tip-icon">
                    @switch (block.variant) {
                      @case ('info') { <span>ℹ️</span> }
                      @case ('warning') { <span>⚠️</span> }
                      @case ('success') { <span>✅</span> }
                      @case ('angular') { <span>🅰️</span> }
                    }
                  </div>
                  <p class="tip-text">{{ block.content }}</p>
                </div>
              }
              @case ('comparison') {
                <div class="comparison-block">
                  <div class="comparison-side left">
                    <div class="comparison-label">{{ block.leftLabel }}</div>
                    <p>{{ block.left }}</p>
                  </div>
                  <div class="comparison-divider"></div>
                  <div class="comparison-side right">
                    <div class="comparison-label">{{ block.rightLabel }}</div>
                    <p>{{ block.right }}</p>
                  </div>
                </div>
              }
              @case ('code') {
                <div class="code-block">
                  @if (block.filename) {
                    <div class="code-filename">{{ block.filename }}</div>
                  }
                  <pre class="code-pre"><code [class]="'language-' + block.language">{{ block.content }}</code></pre>
                </div>
              }
              @case ('checkpoint') {
                <div class="checkpoint-block">
                  <div class="checkpoint-header">
                    <span class="checkpoint-icon">🎯</span>
                    <span class="checkpoint-label">Checkpoint</span>
                  </div>
                  <p class="checkpoint-question">{{ block.question }}</p>
                  <div class="checkpoint-options">
                    @for (option of block.options; track option) {
                      <button
                        class="checkpoint-option"
                        [class.correct]="checkpointSelected() === $index && $index === block.correct"
                        [class.wrong]="checkpointSelected() === $index && $index !== block.correct"
                        [class.disabled]="checkpointSelected() !== null"
                        (click)="selectCheckpoint($index)"
                      >
                        <span class="option-letter">{{ optionLetters[$index] }}</span>
                        <span>{{ option }}</span>
                      </button>
                    }
                  </div>
                  @if (checkpointSelected() !== null) {
                    <div class="checkpoint-explanation">
                      <strong>{{ checkpointSelected() === block.correct ? '¡Correcto!' : 'Casi — la respuesta correcta es la ' + optionLetters[block.correct] }}</strong>
                      <p>{{ block.explanation }}</p>
                    </div>
                  }
                </div>
              }
              @case ('diagram') {
                <div class="diagram-block">
                  <div class="diagram-placeholder">
                    <svg width="100%" height="120" viewBox="0 0 400 120">
                      <rect x="10" y="10" width="380" height="100" rx="8" fill="none" stroke="var(--border-subtle)" stroke-width="1.5" stroke-dasharray="8,4"/>
                      <text x="200" y="65" text-anchor="middle" fill="var(--text-muted)" font-family="var(--font-mono)" font-size="14">
                        {{ block.svgId }}
                      </text>
                    </svg>
                  </div>
                  @if (block.caption) {
                    <p class="diagram-caption">{{ block.caption }}</p>
                  }
                </div>
              }
            }
          }

          <div class="complete-section">
            @if (!isCompleted()) {
              <button class="btn-complete" (click)="completeLesson()">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M3 8l4 4 6-6" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                Marcar lección como completada
              </button>
            } @else {
              <div class="completed-badge">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M3 8l4 4 6-6" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                Lección completada · +{{ lesson()!.xpReward }} XP
              </div>
              @if (lesson()!.nextLesson) {
                <button class="btn-next" (click)="navigateNext()">
                  Siguiente lección →
                </button>
              }
            }
          </div>
        </div>
      } @else {
        <div class="loading-state">
          <div class="loading-spinner"></div>
          <p>Cargando lección...</p>
        </div>
      }
    </aside>
  `,
  styles: [`
    .explain-panel {
      height: 100%;
      overflow: hidden;
      background: var(--bg-surface);
      border-right: 1px solid var(--border);
      display: flex;
      flex-direction: column;
    }

    .panel-header {
      padding: 1.5rem;
      border-bottom: 1px solid var(--border);
      background: var(--bg-elevated);
    }

    .lesson-meta {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      margin-bottom: 0.75rem;
    }

    .module-tag {
      font-family: var(--font-mono);
      font-size: 0.6875rem;
      font-weight: 700;
      color: var(--accent-primary);
      text-transform: uppercase;
      letter-spacing: var(--letter-wide);
    }

    .time-tag {
      display: flex;
      align-items: center;
      gap: 0.25rem;
      font-size: 0.6875rem;
      color: var(--text-muted);
    }

    .lesson-title {
      font-size: 1.375rem;
      font-weight: 700;
      color: var(--text-primary);
      margin-bottom: 0.375rem;
      line-height: 1.25;
      letter-spacing: -0.02em;
    }

    .lesson-subtitle {
      color: var(--text-secondary);
      font-size: 0.9375rem;
      margin-bottom: 0.75rem;
    }

    .xp-badge {
      display: inline-flex;
      align-items: center;
      font-size: 0.75rem;
      font-weight: 600;
      color: var(--accent-xp);
      background: rgba(251, 191, 36, 0.1);
      border: 1px solid rgba(251, 191, 36, 0.2);
      padding: 0.25rem 0.625rem;
      border-radius: var(--radius-full);
    }

    .narrative-content {
      padding: 1.5rem;
      padding-bottom: 2rem;
      flex: 1;
      min-height: 0;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
    }

    .narrative-text {
      color: var(--text-secondary);
      line-height: 1.75;
      font-size: 0.9375rem;

      strong { color: var(--text-primary); font-weight: 600; }
      code { font-family: var(--font-mono); background: var(--bg-elevated); padding: 0.1em 0.35em; border-radius: 3px; font-size: 0.875em; color: var(--accent-code); }
    }

    // Tip blocks
    .tip-block {
      display: flex;
      align-items: flex-start;
      gap: 0.875rem;
      padding: 0.875rem 1rem;
      border-radius: var(--radius-md);
      border-left: 3px solid;

      &[data-variant="info"] {
        background: var(--color-info-bg);
        border-color: var(--color-info-border);
      }
      &[data-variant="warning"] {
        background: var(--color-warning-bg);
        border-color: var(--color-warning-border);
      }
      &[data-variant="success"] {
        background: var(--color-success-bg);
        border-color: var(--color-success-border);
      }
      &[data-variant="angular"] {
        background: var(--color-angular-bg);
        border-color: var(--color-angular-border);
      }
    }

    .tip-icon { font-size: 1rem; flex-shrink: 0; line-height: 1.5; }
    .tip-text { flex: 1; color: var(--text-secondary); font-size: 0.875rem; line-height: 1.6; margin: 0; }

    // Comparison
    .comparison-block {
      display: grid;
      grid-template-columns: 1fr auto 1fr;
      gap: 0;
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-lg);
      overflow: hidden;
    }

    .comparison-side {
      padding: 1rem;
      background: var(--bg-elevated);
      font-size: 0.875rem;
      color: var(--text-secondary);
      line-height: 1.5;

      &.left { border-right: none; }

      p { margin: 0; }
    }

    .comparison-label {
      font-size: 0.6875rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: var(--letter-normal);
      color: var(--accent-primary);
      margin-bottom: 0.5rem;
    }

    .comparison-divider {
      width: 1px;
      background: var(--border-subtle);
    }

    @media (max-width: 768px) {
      .comparison-block {
        grid-template-columns: 1fr;

        .comparison-side + .comparison-side {
          border-top: 1px solid var(--border-subtle);
          border-left: none;
        }
      }

      .comparison-divider {
        display: none;
      }
    }

    // Code blocks
    .code-block {
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-md);
      overflow: hidden;
    }

    .code-filename {
      background: var(--bg-elevated);
      border-bottom: 1px solid var(--border-subtle);
      padding: 0.5rem 1rem;
      font-family: var(--font-mono);
      font-size: 0.75rem;
      color: var(--text-muted);
    }

    .code-pre {
      margin: 0;
      padding: 1rem;
      background: var(--bg-base);
      border-radius: 0;
      overflow-x: auto;
      font-size: 0.8125rem;
      line-height: 1.6;

      code {
        background: none;
        padding: 0;
        color: var(--text-primary);
        font-family: var(--font-mono);
      }
    }

    // Checkpoint
    .checkpoint-block {
      background: var(--bg-elevated);
      border: 1px solid rgba(124, 58, 237, 0.2);
      border-radius: var(--radius-lg);
      padding: 1.25rem;
    }

    .checkpoint-header {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-bottom: 0.75rem;
    }

    .checkpoint-label {
      font-size: 0.6875rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: var(--letter-wide);
      color: var(--accent-primary);
    }

    .checkpoint-question {
      font-weight: 600;
      color: var(--text-primary);
      margin-bottom: 1rem;
      font-size: 0.9375rem;
    }

    .checkpoint-options {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .checkpoint-option {
      display: flex;
      align-items: flex-start;
      gap: 0.625rem;
      padding: 0.625rem 0.875rem;
      background: var(--bg-surface);
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-md);
      cursor: pointer;
      text-align: left;
      color: var(--text-secondary);
      font-size: 0.875rem;
      transition: all 150ms ease;

      &:hover:not(.disabled) {
        border-color: var(--accent-primary);
        color: var(--text-primary);
      }

      &.correct {
        background: rgba(16, 185, 129, 0.1);
        border-color: var(--accent-code);
        color: #6ee7b7;
      }

      &.wrong {
        background: rgba(239, 68, 68, 0.1);
        border-color: #ef4444;
        color: #fca5a5;
      }

      &.disabled { cursor: default; }
    }

    .option-letter {
      font-family: var(--font-mono);
      font-weight: 700;
      color: var(--accent-primary);
      flex-shrink: 0;
      font-size: 0.8125rem;
    }

    .checkpoint-explanation {
      margin-top: 1rem;
      padding: 0.75rem;
      background: rgba(16, 185, 129, 0.08);
      border-radius: var(--radius-md);
      font-size: 0.875rem;

      strong { color: var(--accent-code); display: block; margin-bottom: 0.375rem; }
      p { color: var(--text-secondary); margin: 0; line-height: 1.5; }
    }

    // Diagram
    .diagram-placeholder {
      border: 1px dashed var(--border-subtle);
      border-radius: var(--radius-md);
      overflow: hidden;
      background: var(--bg-elevated);
    }
    .diagram-caption {
      text-align: center;
      font-size: 0.8125rem;
      color: var(--text-muted);
      margin-top: 0.5rem;
    }

    // Complete section
    .complete-section {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      margin-top: 0.5rem;
    }

    .btn-complete {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      width: 100%;
      padding: 0.875rem;
      background: var(--accent-primary);
      color: white;
      border: none;
      border-radius: var(--radius-md);
      font-size: 0.9375rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 200ms ease;

      &:hover {
        background: #6d28d9;
        transform: translateY(-1px);
        box-shadow: var(--shadow-glow);
      }
    }

    .completed-badge {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      padding: 0.75rem;
      background: rgba(16, 185, 129, 0.1);
      border: 1px solid rgba(16, 185, 129, 0.3);
      border-radius: var(--radius-md);
      color: #6ee7b7;
      font-weight: 600;
      font-size: 0.9375rem;
    }

    .btn-next {
      width: 100%;
      padding: 0.75rem;
      background: var(--bg-elevated);
      border: 1px solid var(--border-subtle);
      color: var(--text-secondary);
      border-radius: var(--radius-md);
      font-size: 0.9375rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 200ms ease;

      &:hover {
        border-color: var(--accent-primary);
        color: var(--text-primary);
      }
    }

    .loading-state {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 1rem;
      color: var(--text-muted);

      .loading-spinner {
        width: 24px;
        height: 24px;
        border: 2px solid var(--border-subtle);
        border-top-color: var(--accent-primary);
        border-radius: 50%;
        animation: spin 1s linear infinite;
      }
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }
  `],
})
export class ExplainPanelComponent {
  private readonly router = inject(Router);
  private readonly progressService = inject(LessonProgressService);
  private readonly host = inject(ElementRef<HTMLElement>);
  private readonly sanitizer = inject(DomSanitizer);

  readonly lesson = input<Lesson | null>(null);

  constructor() {
    effect(() => {
      if (this.lesson()) {
        queueMicrotask(() => {
          const content = this.host.nativeElement.querySelector('.narrative-content') as HTMLElement | null;
          if (content) content.scrollTop = 0;
        });
      }
    });
  }

  readonly checkpointSelected = signal<number | null>(null);

  readonly optionLetters = ['A', 'B', 'C', 'D'];

  readonly isCompleted = computed(() => {
    const l = this.lesson();
    return l ? this.progressService.isLessonCompleted(l.id) : false;
  });

  readonly renderedNarrative = computed(() => {
    const narrative = this.lesson()?.narrative ?? [];
    return narrative.map(block => {
      if (block.type === 'text') {
        const html = block.content
          .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
          .replace(/`(.+?)`/g, '<code>$1</code>');
        return { ...block, rendered: this.sanitizer.sanitize(SecurityContext.HTML, html) ?? '' };
      }
      return { ...block, rendered: '' };
    });
  });

  selectCheckpoint(index: number): void {
    if (this.checkpointSelected() !== null) return;
    this.checkpointSelected.set(index);
  }

  completeLesson(): void {
    const l = this.lesson();
    if (!l) return;
    this.progressService.completeLesson(l.id);
  }

  navigateNext(): void {
    const nextId = this.lesson()?.nextLesson;
    if (nextId) {
      void this.router.navigate(['/lesson', nextId]);
    }
  }
}
