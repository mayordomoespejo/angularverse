import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { LessonProgressService } from '../../core/services/lesson-progress.service';
import { SupabaseService } from '../../core/services/supabase.service';

@Component({
  selector: 'app-auth-callback',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="callback-shell">
      <div class="nebula nebula-1" aria-hidden="true"></div>
      <div class="nebula nebula-2" aria-hidden="true"></div>

      <div class="callback-content">
        <div class="logo-wrapper" aria-hidden="true">
          <svg viewBox="0 0 60 60" fill="none" class="logo-svg">
            <path d="M30,2 L54,16 L54,44 L30,58 L6,44 L6,16 Z" fill="#1F2937" stroke="#7C3AED" stroke-width="2"/>
            <path d="M30 14 L44 20 L44 32 Q44 42 30 48 Q16 42 16 32 L16 20 Z" fill="none" stroke="#DD0031" stroke-width="2.5"/>
            <path d="M24 28 L28 20 L32 28 M25.5 26 L34.5 26" stroke="#DD0031" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
            <circle cx="24" cy="34" r="2" fill="#7C3AED" class="bot-eye"/>
            <circle cx="36" cy="34" r="2" fill="#7C3AED" class="bot-eye"/>
          </svg>
        </div>

        <p class="callback-text">Iniciando sesión...</p>

        <div class="dots" aria-hidden="true">
          <span></span><span></span><span></span>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .callback-shell {
      position: fixed;
      inset: 0;
      background: var(--bg-base);
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
    }

    .nebula {
      position: absolute;
      border-radius: 50%;
      filter: blur(80px);
      pointer-events: none;
      animation: nebula 8s ease-in-out infinite;
    }

    .nebula-1 {
      width: 600px; height: 600px;
      background: radial-gradient(circle, rgba(124,58,237,0.12) 0%, transparent 70%);
      top: -200px; left: -100px;
    }

    .nebula-2 {
      width: 500px; height: 500px;
      background: radial-gradient(circle, rgba(221,0,49,0.08) 0%, transparent 70%);
      bottom: -150px; right: -100px;
      animation-delay: -4s;
    }

    @keyframes nebula {
      0%, 100% { transform: scale(1); opacity: 0.8; }
      50% { transform: scale(1.2); opacity: 1; }
    }

    .callback-content {
      position: relative;
      z-index: 10;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1.5rem;
    }

    .logo-wrapper {
      animation: breathing 2s ease-in-out infinite;
    }

    .logo-svg {
      width: 72px;
      height: 72px;
    }

    .bot-eye {
      animation: eyeGlow 2s ease-in-out infinite;
    }

    .bot-eye:last-child { animation-delay: 0.5s; }

    @keyframes breathing {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.06); }
    }

    @keyframes eyeGlow {
      0%, 100% { opacity: 0.9; }
      50% { opacity: 1; filter: drop-shadow(0 0 3px #7C3AED); }
    }

    .callback-text {
      font-family: var(--font-body);
      font-size: 1rem;
      color: var(--text-secondary);
      letter-spacing: 0.02em;
    }

    .dots {
      display: flex;
      gap: 0.375rem;

      span {
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background: var(--accent-primary);
        animation: dot 1.2s ease-in-out infinite;
        opacity: 0.3;

        &:nth-child(2) { animation-delay: 0.2s; }
        &:nth-child(3) { animation-delay: 0.4s; }
      }
    }

    @keyframes dot {
      0%, 100% { opacity: 0.3; transform: scale(1); }
      50% { opacity: 1; transform: scale(1.3); }
    }
  `],
})
export class AuthCallbackComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly auth = inject(AuthService);
  private readonly progress = inject(LessonProgressService);
  private readonly supabase = inject(SupabaseService);

  ngOnInit(): void {
    // Give Supabase a moment to exchange the OAuth code for a session
    setTimeout(async () => {
      const session = await this.auth.authReady();
      if (!session) {
        void this.router.navigate(['/welcome']);
        return;
      }

      // Query user_progress directly — isInitialized() may be false during async hydration
      const { data: row } = await this.supabase.client
        .from('user_progress')
        .select('user_id')
        .eq('user_id', session.user.id)
        .maybeSingle();

      if (row) {
        void this.router.navigate(['/lesson', this.progress.currentLessonId() ?? 'L0.1']);
      } else {
        void this.router.navigate(['/welcome'], { queryParams: { step: 'profile' } });
      }
    }, 500);
  }
}
