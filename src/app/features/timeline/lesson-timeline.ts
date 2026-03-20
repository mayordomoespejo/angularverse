import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  signal,
} from '@angular/core';
import { Router } from '@angular/router';
import { LessonProgressService } from '../../core/services/lesson-progress.service';
import { ProgressNodeComponent } from '../../shared/components/progress-node/progress-node';
import type { NodeStatus } from '../../shared/components/progress-node/progress-node';
import type { Lesson } from '../../core/models/lesson.model';

interface LessonWithStatus {
  lesson: Lesson;
  status: NodeStatus;
}

interface ModuleGroup {
  module: number;
  title: string;
  lessons: LessonWithStatus[];
}

@Component({
  selector: 'app-lesson-timeline',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ProgressNodeComponent],
  template: `
    <nav class="timeline-bar custom-scroll" aria-label="Progreso de lecciones">
      <div class="timeline-scroll">
        <div class="timeline-track">
          @for (group of moduleGroups(); track group.module) {
            <div class="module-group">
              <span
                class="module-label"
                (mouseenter)="showModuleTooltip($event, group.title)"
                (mouseleave)="hideModuleTooltip()"
              >M{{ group.module }}</span>
              <div class="module-nodes">
                @for (item of group.lessons; track item.lesson.id) {
                  <div
                    class="node-wrapper"
                    [class.current]="item.status === 'current'"
                    (click)="navigateToLesson(item.lesson.id, item.status)"
                  >
                    <app-progress-node
                      [status]="item.status"
                      [lesson]="item.lesson"
                    />
                  </div>
                }
              </div>
            </div>
            <div class="module-connector" aria-hidden="true"></div>
          }
        </div>
      </div>
      <div class="timeline-stats">
        <span class="stat xp">
          <span class="stat-icon">⚡</span>
          <span class="stat-value" [class.animating]="showDelta()">{{ displayXp() }} XP</span>
          @if (showDelta()) {
            <span class="xp-delta">+{{ xpDelta() }}</span>
          }
        </span>
        <span class="stat streak">
          <span class="stat-icon">🔥</span>
          <span class="stat-value">{{ streak() }}</span>
        </span>
      </div>
      @if (tooltipVisible()) {
        <div class="module-tooltip" [style.left.px]="tooltipX()" [style.top.px]="tooltipY()">
          {{ tooltipText() }}
        </div>
      }
    </nav>
  `,
  styles: [`
    .timeline-bar {
      width: 100%;
      display: flex;
      align-items: center;
      gap: 1.5rem;
      overflow: hidden;
      background: var(--bg-surface);
      border-bottom: 1px solid var(--border);
      padding: 0.625rem 1.5rem;
    }

    .timeline-scroll {
      flex: 1;
      overflow-x: auto;
      scrollbar-width: thin;
      scrollbar-color: var(--border-subtle) transparent;
    }

    .timeline-track {
      display: flex;
      align-items: center;
      gap: 0;
      min-width: max-content;
    }

    .module-group {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .module-label {
      font-family: var(--font-mono);
      font-size: 0.625rem;
      font-weight: 700;
      color: var(--text-muted);
      text-transform: uppercase;
      letter-spacing: var(--letter-wider);
      padding: 0.25rem 0.5rem;
      background: var(--bg-elevated);
      border-radius: 4px;
      border: 1px solid var(--border-subtle);
      cursor: default;
    }

    .module-nodes {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .node-wrapper {
      cursor: pointer;

      &.current app-progress-node {
        position: relative;
        z-index: 1;
      }
    }

    .module-connector {
      width: 32px;
      height: 2px;
      background: var(--border-subtle);
      flex-shrink: 0;

      &:last-child {
        display: none;
      }
    }

    .timeline-stats {
      display: flex;
      align-items: center;
      gap: 1rem;
      flex-shrink: 0;
    }

    .stat {
      display: flex;
      align-items: center;
      gap: 0.25rem;
      font-size: 0.8125rem;
      font-weight: 600;
    }

    .stat.xp {
      position: relative;
    }

    .stat.xp .stat-value { color: #fbbf24; }
    .stat.streak .stat-value { color: var(--text-secondary); }

    .stat-icon { font-size: 0.875rem; }

    .stat-value.animating {
      color: #fbbf24;
      transition: color 300ms ease;
    }

    .xp-delta {
      position: absolute;
      top: -4px;
      right: -8px;
      font-size: 0.6875rem;
      font-weight: 700;
      color: #fbbf24;
      pointer-events: none;
      animation: floatUp 900ms ease-out forwards;
    }

    .module-tooltip {
      position: fixed;
      transform: translateY(-50%);
      background: var(--bg-elevated);
      border: 1px solid var(--border);
      color: var(--text-primary);
      font-size: 0.75rem;
      font-weight: 500;
      white-space: nowrap;
      padding: 0.35rem 0.625rem;
      border-radius: 6px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
      pointer-events: none;
      z-index: var(--z-modal);
      animation: fadeIn 120ms ease;
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(-50%) translateX(-4px); }
      to   { opacity: 1; transform: translateY(-50%) translateX(0); }
    }

    @keyframes floatUp {
      0%   { opacity: 1; transform: translateY(0) scale(1); }
      20%  { opacity: 1; transform: translateY(-4px) scale(1.15); }
      100% { opacity: 0; transform: translateY(-20px) scale(0.9); }
    }

    @media (max-width: 768px) {
      .timeline-stats {
        display: none;
      }

      .timeline-bar {
        padding: 0.375rem 0.75rem;
        gap: 0.75rem;
      }

      .module-label {
        font-size: 0.5rem;
        padding: 0.125rem 0.375rem;
        letter-spacing: var(--letter-wide);
      }

      .module-nodes {
        gap: 0.5rem;
      }

      .module-connector {
        width: 16px;
      }
    }

    @media (max-width: 480px) {
      .module-label {
        display: none;
      }

      .module-nodes {
        gap: 0.375rem;
      }

      .module-connector {
        width: 10px;
      }
    }
  `],
})
export class LessonTimelineComponent {
  private readonly router = inject(Router);
  private readonly progress = inject(LessonProgressService);

  readonly currentLessonId = input<string>('');

  readonly totalXp = computed(() => this.progress.xpTotal());
  readonly streak = computed(() => this.progress.streak().count);

  readonly displayXp = signal(0);
  readonly xpDelta = signal<number | null>(null);
  readonly showDelta = signal(false);

  readonly tooltipVisible = signal(false);
  readonly tooltipText = signal('');
  readonly tooltipX = signal(0);
  readonly tooltipY = signal(0);

  constructor() {
    let prev = this.progress.xpTotal();
    this.displayXp.set(prev);
    effect(() => {
      const next = this.totalXp();
      const current = prev;
      prev = next;
      if (next !== current) {
        this.animateXp(current, next);
      }
    });
  }

  private animateXp(from: number, to: number): void {
    const diff = to - from;
    if (diff <= 0) {
      this.displayXp.set(to);
      return;
    }
    // Show floating delta
    this.xpDelta.set(diff);
    this.showDelta.set(true);
    setTimeout(() => this.showDelta.set(false), 900);

    // Count up animation
    const duration = 700;
    const start = performance.now();
    const tick = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      this.displayXp.set(Math.round(from + diff * eased));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }

  showModuleTooltip(event: MouseEvent, title: string): void {
    const rect = (event.target as HTMLElement).getBoundingClientRect();
    const estimatedWidth = 180;
    const spaceOnRight = window.innerWidth - rect.right - 8;
    const x = spaceOnRight >= estimatedWidth
      ? rect.right + 8
      : rect.left - estimatedWidth - 8;
    this.tooltipX.set(x);
    this.tooltipY.set(rect.top + rect.height / 2);
    this.tooltipText.set(title);
    this.tooltipVisible.set(true);
  }

  hideModuleTooltip(): void {
    this.tooltipVisible.set(false);
  }

  readonly moduleGroups = computed((): ModuleGroup[] => {
    const lessons = this.progress.allLessons();
    const currentId = this.currentLessonId();

    const grouped = new Map<number, Lesson[]>();
    for (const lesson of lessons) {
      const group = grouped.get(lesson.module) ?? [];
      group.push(lesson);
      grouped.set(lesson.module, group);
    }

    return Array.from(grouped.entries())
      .sort(([a], [b]) => a - b)
      .map(([module, moduleLessons]) => ({
        module,
        title: moduleLessons[0]?.moduleTitle ?? `Módulo ${module}`,
        lessons: moduleLessons.map(lesson => ({
          lesson,
          status: this.getStatus(lesson.id, currentId),
        })),
      }));
  });

  private getStatus(lessonId: string, currentId: string): NodeStatus {
    if (this.progress.isLessonCompleted(lessonId)) return 'completed';
    if (lessonId === currentId) return 'current';
    if (this.progress.isLessonUnlocked(lessonId)) return 'current';
    return 'locked';
  }

  navigateToLesson(lessonId: string, status: NodeStatus): void {
    if (status === 'locked') return;
    void this.router.navigate(['/lesson', lessonId]);
  }
}
