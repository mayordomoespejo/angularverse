import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-logo-icon',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <svg viewBox="0 0 60 60" fill="none" aria-hidden="true">
      <polygon points="30,2 54,16 54,44 30,58 6,44 6,16" fill="#1F2937" stroke="#7C3AED" stroke-width="2"/>
      <path d="M30 14 L44 20 L44 32 Q44 42 30 48 Q16 42 16 32 L16 20 Z" fill="none" stroke="#DD0031" stroke-width="2.5"/>
      <path d="M24 28 L28 20 L32 28 M25.5 26 L34.5 26" stroke="#DD0031" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
      <circle cx="24" cy="34" r="2" fill="#7C3AED" class="eye"/>
      <circle cx="36" cy="34" r="2" fill="#7C3AED" class="eye"/>
    </svg>
  `,
  styles: [`
    :host {
      display: block;
      width: 100%;
      height: 100%;
    }

    svg {
      display: block;
      width: 100%;
      height: 100%;
    }

    .eye {
      animation: eyeMove 6s ease-in-out infinite, eyeGlow 2s ease-in-out infinite;
      transform-box: fill-box;
      transform-origin: center;
    }

    .eye:last-of-type {
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
  `],
})
export class LogoIconComponent {}
