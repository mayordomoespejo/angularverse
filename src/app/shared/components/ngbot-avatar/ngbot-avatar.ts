import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-ngbot-avatar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="ngbot-avatar" [class.large]="size() === 'lg'" [class.small]="size() === 'sm'">
      <svg viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg" class="avatar-svg">
        <!-- Hexagon background -->
        <polygon
          points="30,2 54,16 54,44 30,58 6,44 6,16"
          fill="#1F2937"
          stroke="#7C3AED"
          stroke-width="2"
          class="hex-bg"
        />
        <!-- Angular-inspired logo: simplified shield -->
        <path
          d="M30 14 L44 20 L44 32 Q44 42 30 48 Q16 42 16 32 L16 20 Z"
          fill="none"
          stroke="#DD0031"
          stroke-width="2.5"
          class="shield"
        />
        <path
          d="M24 28 L28 20 L32 28 M25.5 26 L34.5 26"
          stroke="#DD0031"
          stroke-width="2.5"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="letter-a"
        />
        <!-- Eye dots -->
        <circle cx="24" cy="34" r="2" fill="#7C3AED" class="eye" />
        <circle cx="36" cy="34" r="2" fill="#7C3AED" class="eye" />
      </svg>
      @if (showStatus()) {
        <span class="status-dot"></span>
      }
    </div>
  `,
  styles: [`
    .ngbot-avatar {
      position: relative;
      display: inline-flex;
      width: 48px;
      height: 48px;
      animation: breathing 3s ease-in-out infinite;

      &.large {
        width: 64px;
        height: 64px;
      }

      &.small {
        width: 32px;
        height: 32px;
      }
    }

    .avatar-svg {
      width: 100%;
      height: 100%;

      .hex-bg {
        filter: drop-shadow(0 0 8px rgba(124, 58, 237, 0.4));
      }

      .shield, .letter-a {
        filter: drop-shadow(0 0 4px rgba(221, 0, 49, 0.5));
      }

      .eye {
        animation: blink 4s ease-in-out infinite;
      }

      .eye:last-of-type {
        animation-delay: 0.1s;
      }
    }

    .status-dot {
      position: absolute;
      bottom: 2px;
      right: 2px;
      width: 10px;
      height: 10px;
      background: #10B981;
      border-radius: 50%;
      border: 2px solid var(--bg-base);
      animation: pulseDot 2s ease-in-out infinite;
    }

    @keyframes breathing {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.04); }
    }

    @keyframes blink {
      0%, 90%, 100% { opacity: 1; }
      95% { opacity: 0; }
    }

    @keyframes pulseDot {
      0%, 100% {
        box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.6);
      }
      50% {
        box-shadow: 0 0 0 4px rgba(16, 185, 129, 0);
      }
    }
  `],
})
export class NgbotAvatarComponent {
  readonly size = input<'sm' | 'md' | 'lg'>('md');
  readonly showStatus = input(true);
}
