import { ChangeDetectionStrategy, Component, computed, effect, inject, input, signal } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-preview-panel',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="preview-panel">
      <div class="preview-toolbar">
        <span class="toolbar-label">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <rect x="1" y="1" width="10" height="8" rx="1.5" stroke="currentColor" stroke-width="1.2"/>
            <path d="M4 11h4M6 9v2" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/>
          </svg>
          Preview
        </span>
        <div class="traffic-lights" aria-hidden="true">
          <span class="light red"></span>
          <span class="light yellow"></span>
          <span class="light green"></span>
        </div>
      </div>

      <div class="preview-content" [class.has-preview]="previewHtml()">
        @if (previewHtml()) {
          @if (iframeLoading()) {
            <div class="preview-skeleton">
              <div class="skeleton-shimmer"></div>
            </div>
          }
          <iframe
            [srcdoc]="safeHtml()"
            class="preview-iframe"
            width="100%"
            height="100%"
            frameborder="0"
            (load)="onIframeLoad()"
            (error)="onIframeError()"
          ></iframe>
        } @else {
          <div class="idle-state">
            <div class="rocket-wrapper" aria-hidden="true">
              <svg width="64" height="64" viewBox="0 0 64 64" fill="none" class="rocket-svg">
                <path d="M32 4C32 4 20 14 20 30v2l-6 8h36l-6-8v-2c0-16-12-26-12-26z" fill="rgba(124,58,237,0.15)" stroke="#7C3AED" stroke-width="1.5" stroke-linejoin="round"/>
                <path d="M26 40v6a6 6 0 0012 0v-6H26z" fill="rgba(221,0,49,0.2)" stroke="#DD0031" stroke-width="1.5"/>
                <circle cx="32" cy="26" r="5" fill="rgba(124,58,237,0.2)" stroke="#7C3AED" stroke-width="1.5"/>
                <path d="M14 34L8 38M50 34l6 4" stroke="#7C3AED" stroke-width="1.5" stroke-linecap="round"/>
              </svg>
            </div>
            <p class="idle-title">Live Preview</p>
            <p class="idle-subtitle">Escribe código en el editor y pulsa<br><span class="key">▶ Ejecutar</span> para ver el resultado</p>
          </div>
        }
      </div>

      @if (code() && code().trim().length > 0) {
        <div class="preview-footer">
          <span class="char-count">{{ code().length }} caracteres</span>
        </div>
      }
    </div>
  `,
  styles: [`
    .preview-panel {
      height: 100%;
      display: flex;
      flex-direction: column;
      background: var(--bg-surface);
      overflow: hidden;
    }

    .preview-toolbar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 44px;
      padding: 0 0.75rem;
      background: var(--bg-elevated);
      border-bottom: 1px solid var(--border);
      flex-shrink: 0;
    }

    .toolbar-label {
      display: flex;
      align-items: center;
      gap: 0.375rem;
      font-size: 0.75rem;
      font-weight: 600;
      color: var(--text-muted);
      text-transform: uppercase;
      letter-spacing: 0.06em;
    }

    .traffic-lights {
      display: flex;
      gap: 0.375rem;
    }

    .light {
      width: 10px;
      height: 10px;
      border-radius: 50%;

      &.red    { background: var(--accent-error);   opacity: 0.6; }
      &.yellow { background: var(--accent-warning); opacity: 0.6; }
      &.green  { background: var(--accent-success); opacity: 0.6; }
    }

    .preview-content {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 1.5rem;
      overflow: hidden;
      position: relative;

      &.has-preview {
        padding: 0;
      }
    }

    // Idle state
    .idle-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1rem;
      text-align: center;
    }

    .rocket-wrapper {
      animation: breathing 3s ease-in-out infinite;
    }

    .rocket-svg {
      opacity: 0.7;
    }

    @keyframes breathing {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.05) translateY(-4px); }
    }

    .idle-title {
      font-family: var(--font-display);
      font-size: 1.25rem;
      font-weight: 700;
      color: var(--text-secondary);
      margin: 0;
    }

    .idle-subtitle {
      font-size: 0.875rem;
      color: var(--text-muted);
      line-height: 1.6;
      margin: 0;
    }

    .key {
      display: inline-block;
      background: var(--bg-elevated);
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-sm);
      padding: 0.1em 0.4em;
      font-family: var(--font-mono);
      font-size: 0.875em;
      color: var(--accent-code);
    }

    .preview-iframe {
      border: none;
      display: block;
    }

    // Footer
    .preview-footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0.375rem 0.875rem;
      border-top: 1px solid var(--border);
      background: var(--bg-elevated);
      flex-shrink: 0;
    }

    .char-count {
      font-family: var(--font-mono);
      font-size: 0.6875rem;
      color: var(--text-muted);
    }

    .preview-skeleton {
      position: absolute;
      inset: 0;
      background: var(--bg-secondary, #1e1e2e);
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: var(--radius-md, 8px);
      z-index: 1;
    }

    .skeleton-shimmer {
      width: 60%;
      height: 4px;
      background: linear-gradient(90deg, var(--bg-surface, #2a2a3e) 25%, var(--accent-primary, #7c3aed) 50%, var(--bg-surface, #2a2a3e) 75%);
      background-size: 200% 100%;
      animation: shimmer 1.5s infinite;
      border-radius: 2px;
    }
  `],
})
export class PreviewPanelComponent {
  private readonly sanitizer = inject(DomSanitizer);

  readonly code = input('');
  readonly previewHtml = input('');

  readonly safeHtml = computed(() =>
    this.sanitizer.bypassSecurityTrustHtml(this.previewHtml())
  );

  readonly #iframeLoading = signal(true);
  readonly iframeLoading = this.#iframeLoading.asReadonly();

  constructor() {
    effect(() => {
      if (this.previewHtml()) {
        this.#iframeLoading.set(true);
      }
    });
  }

  onIframeLoad(): void {
    this.#iframeLoading.set(false);
  }

  onIframeError(): void {
    this.#iframeLoading.set(false);
  }
}
