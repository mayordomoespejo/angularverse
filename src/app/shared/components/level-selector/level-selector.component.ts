import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import type { UserLevel } from '../../../core/models/user-profile.model';

export const LEVELS: Array<{ id: UserLevel; name: string; icon: string; description: string }> = [
  { id: 'beginner', name: 'Principiante', icon: '🌱', description: 'Nuevo en Angular y frameworks' },
  { id: 'intermediate', name: 'Con experiencia', icon: '⚡', description: 'Manejo JavaScript moderno y algo de frameworks' },
  { id: 'developer', name: 'Desarrollador', icon: '🚀', description: 'Web dev, aprendo Angular' },
];

@Component({
  selector: 'app-level-selector',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="level-cards">
      @for (level of levels; track level.id) {
        <button
          class="level-card"
          [class.selected]="selected() === level.id"
          (click)="levelChange.emit(level.id)"
          type="button"
        >
          <span class="level-icon">{{ level.icon }}</span>
          <span class="level-name">{{ level.name }}</span>
          <span class="level-desc">{{ level.description }}</span>
        </button>
      }
    </div>
  `,
  styles: [`
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
  `],
})
export class LevelSelectorComponent {
  readonly selected = input.required<UserLevel>();
  readonly levelChange = output<UserLevel>();

  readonly levels = LEVELS;
}
