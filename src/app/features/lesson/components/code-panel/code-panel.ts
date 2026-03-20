import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';
import type { Lesson } from '../../../../core/models/lesson.model';

@Component({
  selector: 'app-code-panel',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="code-panel">
      <div class="panel-toolbar">
        <div class="file-tab">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M2 1h5l3 3v7H2V1z" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M7 1v3h3" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/>
          </svg>
          <span>{{ filename() }}</span>
        </div>
      </div>

      <div class="editor-wrapper">
        <textarea
          class="code-editor custom-scroll"
          [value]="displayCode()"
          readonly
          spellcheck="false"
          autocomplete="off"
          autocorrect="off"
          autocapitalize="off"
        ></textarea>
      </div>
    </div>
  `,
  styles: [`
    .code-panel {
      height: 100%;
      display: flex;
      flex-direction: column;
      background: var(--bg-base);
      border-right: 1px solid var(--border);
      overflow: hidden;
    }

    .panel-toolbar {
      display: flex;
      align-items: center;
      height: 44px;
      padding: 0 0.75rem;
      background: var(--bg-elevated);
      border-bottom: 1px solid var(--border);
      flex-shrink: 0;
    }

    .file-tab {
      display: flex;
      align-items: center;
      gap: 0.375rem;
      height: 26px;
      padding: 0 0.625rem;
      background: transparent;
      border: 1px solid transparent;
      border-radius: var(--radius-sm);
      font-family: var(--font-mono);
      font-size: 0.75rem;
      line-height: 1;
      color: var(--text-muted);
    }

    .editor-wrapper {
      flex: 1;
      overflow: hidden;
    }

    .code-editor {
      width: 100%;
      height: 100%;
      background: var(--bg-base);
      color: var(--text-primary);
      font-family: var(--font-mono);
      font-size: 0.875rem;
      line-height: 1.7;
      border: none;
      outline: none;
      resize: none;
      padding: 1.25rem 1.5rem;
      tab-size: 2;
      white-space: pre;
      overflow-wrap: normal;
      overflow-x: auto;

      &::selection {
        background: rgba(124, 58, 237, 0.3);
      }

      &[readonly] {
        opacity: 0.8;
        cursor: default;
      }
    }
  `],
})
export class CodePanelComponent {
  readonly lesson = input<Lesson | null>(null);

  readonly filename = computed(() => {
    const lang = this.lesson()?.language ?? 'typescript';
    const ext = { typescript: 'ts', html: 'html', scss: 'scss' }[lang];
    return `componente.${ext}`;
  });

  readonly displayCode = computed(() => this.lesson()?.starterCode ?? '');
}
