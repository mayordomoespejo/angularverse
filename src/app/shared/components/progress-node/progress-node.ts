import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  input,
  signal,
  viewChild,
} from '@angular/core';
import type { Lesson } from '../../../core/models/lesson.model';

export type NodeStatus = 'completed' | 'current' | 'locked';

@Component({
  selector: 'app-progress-node',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      #nodeEl
      class="progress-node"
      role="button"
      tabindex="0"
      [class.completed]="status() === 'completed'"
      [class.current]="status() === 'current'"
      [class.locked]="status() === 'locked'"
      [attr.aria-label]="'Lesson ' + lesson().title + ' - ' + status()"
      [attr.aria-disabled]="status() === 'locked'"
      [attr.aria-current]="status() === 'current' ? 'step' : null"
      (mouseenter)="showTooltip()"
      (mouseleave)="hideTooltip()"
      (keydown.enter)="showTooltip()"
      (keydown.space)="showTooltip()"
    >
      <div class="node-circle">
        @if (status() === 'completed') {
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M2 6l3 3 5-5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        } @else if (status() === 'locked') {
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path d="M3 4.5V3a2 2 0 014 0v1.5M2 4.5h6v4H2V4.5z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
          </svg>
        } @else {
          <div class="current-dot"></div>
        }
      </div>
      <span class="node-label">{{ lesson().id }}</span>
    </div>

    @if (tooltipVisible()) {
      <div
        class="tooltip"
        [style.left.px]="tooltipX()"
        [style.top.px]="tooltipY()"
      >{{ lesson().title }}</div>
    }
  `,
  styles: [`
    .progress-node {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 4px;
      cursor: pointer;
      transition: opacity 150ms ease;

      &:hover:not(.locked) .node-circle {
        border-color: var(--accent-primary);
        opacity: 0.85;
      }

      &.locked {
        cursor: not-allowed;
        opacity: 0.5;
      }
    }

    .tooltip {
      position: fixed;
      transform: translateY(-50%);
      background: var(--bg-elevated);
      border: 1px solid var(--border);
      color: var(--text-primary);
      font-size: 0.75rem;
      font-weight: 500;
      white-space: nowrap;
      padding: 0.35rem 0.625rem;
      border-radius: var(--radius-md);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
      pointer-events: none;
      z-index: var(--z-modal);
      animation: fadeIn 120ms ease;
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(-50%) translateX(-4px); }
      to   { opacity: 1; transform: translateY(-50%) translateX(0); }
    }

    .node-circle {
      width: 28px;
      height: 28px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 2px solid var(--border-subtle);
      background: var(--bg-surface);
      transition: all 200ms ease;
      color: var(--text-muted);

      .completed & {
        background: var(--accent-primary);
        border-color: var(--accent-primary);
        color: white;
        box-shadow: 0 0 10px rgba(124, 58, 237, 0.4);
      }

      .current & {
        border-color: var(--accent-primary);
        background: rgba(124, 58, 237, 0.1);
        color: var(--accent-primary);
        animation: pulseDot 2s ease-in-out infinite;
      }
    }

    .current-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: var(--accent-primary);
    }

    .node-label {
      font-size: 0.625rem;
      font-family: var(--font-mono);
      color: var(--text-muted);
      white-space: nowrap;

      .current & { color: var(--accent-primary); }
      .completed & { color: var(--text-secondary); }
    }

    @keyframes pulseDot {
      0%, 100% { box-shadow: 0 0 0 0 rgba(124, 58, 237, 0.4); }
      50% { box-shadow: 0 0 0 6px rgba(124, 58, 237, 0); }
    }
  `],
})
export class ProgressNodeComponent {
  readonly status = input.required<NodeStatus>();
  readonly lesson = input.required<Lesson>();

  readonly nodeEl = viewChild<ElementRef<HTMLElement>>('nodeEl');
  readonly tooltipVisible = signal(false);
  readonly tooltipX = signal(0);
  readonly tooltipY = signal(0);

  showTooltip(): void {
    const rect = this.nodeEl()?.nativeElement.getBoundingClientRect();
    if (!rect) return;
    const estimatedWidth = 180;
    const x = rect.right + 8 + estimatedWidth <= window.innerWidth
      ? rect.right + 8
      : rect.left - estimatedWidth - 8;
    this.tooltipX.set(x);
    this.tooltipY.set(rect.top + rect.height / 2);
    this.tooltipVisible.set(true);
  }

  hideTooltip(): void {
    this.tooltipVisible.set(false);
  }
}
