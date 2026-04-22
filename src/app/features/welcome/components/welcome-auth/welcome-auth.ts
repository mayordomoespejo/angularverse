import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  computed,
  inject,
  output,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { take, timer } from 'rxjs';
import { AuthService } from '../../../../core/services/auth.service';

const RESEND_COOLDOWN_TICK_MS = 1000;
const RESEND_SUCCESS_DISPLAY_MS = 3000;

type AuthStep = 'email' | 'otp';

@Component({
  selector: 'app-welcome-auth',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule],
  template: `
    <div class="act-form">

      <!-- STEP: EMAIL -->
      @if (authStep() === 'email') {
        <div class="form-header">
          <h2 class="form-title">Tu viaje comienza aquí</h2>
          <p class="form-subtitle">Introduce tu email para recibir un código de acceso</p>
        </div>

        <form class="auth-form" (ngSubmit)="submitEmail()">
          <div class="form-group">
            <label for="email">Email</label>
            <input
              id="email"
              type="email"
              class="form-input"
              placeholder="tu@email.com"
              [value]="email()"
              (input)="email.set(getInputValue($event))"
              name="email"
              required
              autocomplete="email"
            />
          </div>
          <button type="submit" class="btn-start ready" [disabled]="authLoading()">
            {{ authLoading() ? 'Enviando...' : 'Enviar código' }}
          </button>
        </form>

        <div class="auth-divider"><span>o</span></div>

        <div class="auth-bottom">
          <button class="btn-google" (click)="loginWithGoogle()" [disabled]="authLoading()">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
              <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853"/>
              <path d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
              <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 6.29C4.672 4.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
            </svg>
            Continuar con Google
          </button>

          @if (authError()) {
            <p class="auth-feedback auth-feedback--error" role="alert">{{ authError() }}</p>
          }
        </div>
      }

      <!-- STEP: OTP -->
      @if (authStep() === 'otp') {
        <div class="form-header">
          <h2 class="form-title">Revisa tu email</h2>
          <p class="form-subtitle">Enviamos un código de 6 dígitos a <strong>{{ email() }}</strong></p>
        </div>

        <form class="auth-form" (ngSubmit)="submitOtp()">
          <div class="form-group">
            <label>Código de verificación</label>
            <div class="otp-boxes">
              @for (i of otpIndices; track i) {
                <input
                  class="otp-box"
                  [class.filled]="otpDigits()[i] !== ''"
                  type="text"
                  inputmode="numeric"
                  maxlength="1"
                  pattern="[0-9]*"
                  [value]="otpDigits()[i]"
                  (input)="onOtpInput($event, i)"
                  (keydown)="onOtpKeydown($event, i)"
                  (paste)="onOtpPaste($event, i)"
                  [attr.autocomplete]="i === 0 ? 'one-time-code' : null"
                  [attr.autofocus]="i === 0 ? true : null"
                />
              }
            </div>
          </div>
          <button type="submit" class="btn-start ready" [disabled]="authLoading() || otpCode().length < 6">
            {{ authLoading() ? 'Verificando...' : 'Verificar código' }}
          </button>
        </form>

        <div class="auth-bottom">
          <button class="btn-resend" (click)="resendOtp()" [disabled]="resendLoading() || resendCooldown() > 0">
            {{ resendLoading() ? 'Enviando...' : resendSuccess() ? '¡Código reenviado!' : resendCooldown() > 0 ? 'Reenviar en ' + resendCooldown() + 's' : '¿No lo recibiste? Reenviar' }}
          </button>
          <button class="btn-back-email" (click)="authStep.set('email'); otpDigits.set(['','','','','',''])">← Cambiar email</button>

          @if (authError()) {
            <p class="auth-feedback auth-feedback--error" role="alert">{{ authError() }}</p>
          }
        </div>
      }

    </div>
  `,
  styles: [`
    .act-form {
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
    }

    .form-header { text-align: center; }

    .form-title {
      font-family: var(--font-display);
      font-size: 2rem;
      font-weight: 700;
      color: var(--text-primary);
      margin-bottom: 0.5rem;
    }

    .form-subtitle {
      color: var(--text-secondary);
      font-size: 0.9375rem;
    }

    .auth-bottom {
      position: relative;
    }

    .auth-feedback {
      position: absolute;
      top: 100%;
      left: 0;
      right: 0;
      margin-top: 0.5rem;
      font-size: 0.8125rem;
      text-align: center;
      animation: fadeInUp 0.2s ease;
      pointer-events: none;

      &--error { color: #f87171; }
      &--success { color: #4ade80; }
    }

    .auth-form {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .auth-divider {
      display: flex;
      align-items: center;
      gap: 1rem;
      color: var(--text-muted);
      font-size: 0.8125rem;

      &::before, &::after {
        content: '';
        flex: 1;
        height: 1px;
        background: var(--border-subtle);
      }
    }

    .btn-google {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.75rem;
      background: transparent;
      border: 1px solid var(--border-subtle);
      color: var(--text-primary);
      padding: 0.875rem;
      border-radius: 8px;
      font-size: 0.9375rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 200ms ease;

      &:hover:not(:disabled) {
        background: rgba(124,58,237,0.05);
        border-color: var(--accent-primary);
      }

      &:disabled { opacity: 0.6; cursor: not-allowed; }
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 0.375rem;

      label {
        font-size: 0.8125rem;
        font-weight: 600;
        color: var(--text-secondary);
        letter-spacing: 0.03em;
        text-transform: uppercase;
      }
    }

    .form-input {
      width: 100%;
      background: var(--bg-surface);
      border: 1px solid var(--border-subtle);
      color: var(--text-primary);
      padding: 0.75rem 1rem;
      border-radius: 8px;
      font-size: 1rem;
      font-family: var(--font-body);
      transition: border-color 200ms ease, box-shadow 200ms ease;

      &::placeholder { color: var(--text-muted); }

      &:focus {
        outline: none;
        border-color: var(--accent-primary);
        box-shadow: 0 0 0 3px rgba(124, 58, 237, 0.15);
      }
    }

    .btn-start {
      width: 100%;
      background: var(--accent-primary);
      color: white;
      border: none;
      padding: 1rem;
      border-radius: 10px;
      font-size: 1.0625rem;
      font-weight: 700;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      transition: all 200ms ease;
      opacity: 0.5;

      &.ready {
        opacity: 1;
        animation: glow 3s ease-in-out infinite;

        &:hover { transform: translateY(-2px); }
      }

      &:disabled { cursor: not-allowed; }
    }

    @keyframes glow {
      0%, 100% { box-shadow: 0 0 10px var(--glow); }
      50% { box-shadow: 0 0 30px var(--glow), 0 0 60px var(--glow); }
    }

    .otp-boxes {
      display: flex;
      gap: 0.5rem;
      justify-content: center;
    }

    .otp-box {
      width: 48px;
      height: 56px;
      background: var(--bg-surface);
      border: 1px solid var(--border-subtle);
      border-radius: 8px;
      color: var(--text-primary);
      font-size: 1.5rem;
      font-weight: 700;
      font-family: var(--font-mono);
      text-align: center;
      caret-color: var(--accent-primary);
      transition: border-color 200ms, box-shadow 200ms;

      &:focus {
        outline: none;
        border-color: var(--accent-primary);
        box-shadow: 0 0 0 3px rgba(124, 58, 237, 0.15);
      }

      &.filled {
        border-color: rgba(124, 58, 237, 0.4);
      }
    }

    .btn-resend {
      width: 100%;
      background: none;
      border: none;
      color: var(--text-muted);
      font-size: 0.8125rem;
      cursor: pointer;
      padding: 0.25rem;
      transition: color 150ms;
      &:hover:not(:disabled) { color: var(--text-secondary); }
      &:disabled { opacity: 0.6; cursor: default; }
    }

    .btn-back-email {
      width: 100%;
      background: none;
      border: none;
      color: var(--text-muted);
      font-size: 0.75rem;
      cursor: pointer;
      padding: 0.25rem;
      margin-top: 0.25rem;
      transition: color 150ms;
      &:hover { color: var(--text-secondary); }
    }

    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(24px); }
      to { opacity: 1; transform: translateY(0); }
    }

    @media (prefers-reduced-motion: reduce) {
      .btn-start.ready { animation: none; }
    }
  `],
})
export class WelcomeAuthComponent {
  private readonly authService = inject(AuthService);
  private readonly destroyRef = inject(DestroyRef);

  readonly authDone = output<{ isNewUser: boolean; prefillName: string }>();

  readonly authStep = signal<AuthStep>('email');
  readonly authLoading = signal(false);
  readonly authError = signal('');

  readonly email = signal('');
  readonly otpDigits = signal<string[]>(['', '', '', '', '', '']);
  readonly otpCode = computed(() => this.otpDigits().join(''));
  readonly otpIndices = [0, 1, 2, 3, 4, 5];
  readonly resendLoading = signal(false);
  readonly resendSuccess = signal(false);
  readonly resendCooldown = signal(0);

  private cooldownInterval?: ReturnType<typeof setInterval>;

  constructor() {
    this.destroyRef.onDestroy(() => {
      clearInterval(this.cooldownInterval);
    });
  }

  submitEmail(): void {
    this.authError.set('');
    this.authLoading.set(true);
    this.authService.sendOtp(this.email()).pipe(take(1)).subscribe({
      next: () => {
        this.authLoading.set(false);
        this.authStep.set('otp');
        this.startResendCooldown();
      },
      error: (err: { message?: string; status?: number }) => {
        const msg = err.message ?? '';
        this.authError.set(
          msg.includes('429') || msg.toLowerCase().includes('rate')
            ? 'Demasiados intentos. Espera unos minutos antes de volver a intentarlo.'
            : msg || 'Error al enviar el código.'
        );
        this.authLoading.set(false);
      },
    });
  }

  submitOtp(): void {
    if (this.otpCode().length < 6 || this.otpDigits().includes('')) {
      this.authError.set('Ingresa los 6 dígitos del código.');
      return;
    }
    this.authError.set('');
    this.authLoading.set(true);
    this.authService.verifyOtp(this.email(), this.otpCode()).pipe(take(1)).subscribe({
      next: ({ isNewUser }) => {
        this.authLoading.set(false);
        const prefillName = this.resolvePrefillName();
        this.authDone.emit({ isNewUser, prefillName });
      },
      error: (err: { message?: string }) => {
        this.authError.set(err.message?.includes('expired') || err.message?.includes('invalid')
          ? 'Código incorrecto o expirado.'
          : (err.message ?? 'Error al verificar el código.'));
        this.authLoading.set(false);
      },
    });
  }

  onOtpInput(event: Event, index: number): void {
    const input = event.target as HTMLInputElement;
    const digit = input.value.replace(/\D/g, '').slice(-1);
    const digits = [...this.otpDigits()];
    digits[index] = digit;
    this.otpDigits.set(digits);
    if (digit && index < 5) {
      const next = input.parentElement?.children.item(index + 1) as HTMLInputElement | null;
      if (!next) return;
      next.focus();
    }
  }

  onOtpKeydown(event: KeyboardEvent, index: number): void {
    const input = event.target as HTMLInputElement;
    if (event.key === 'Backspace' && !input.value && index > 0) {
      const digits = [...this.otpDigits()];
      digits[index - 1] = '';
      this.otpDigits.set(digits);
      const prev = input.parentElement?.children[index - 1] as HTMLInputElement;
      prev?.focus();
    }
  }

  onOtpPaste(event: ClipboardEvent, index: number): void {
    event.preventDefault();
    const text = (event.clipboardData?.getData('text') ?? '').replace(/\D/g, '').slice(0, 6);
    const digits = [...this.otpDigits()];
    text.split('').forEach((d, i) => { if (index + i < 6) digits[index + i] = d; });
    this.otpDigits.set(digits);
    const focusIndex = Math.min(index + text.length, 5);
    const boxes = (event.target as HTMLElement).parentElement?.children;
    (boxes?.[focusIndex] as HTMLInputElement)?.focus();
  }

  resendOtp(): void {
    this.resendLoading.set(true);
    this.resendSuccess.set(false);
    this.authService.sendOtp(this.email()).pipe(take(1)).subscribe({
      next: () => {
        this.resendLoading.set(false);
        this.resendSuccess.set(true);
        this.startResendCooldown();
        timer(RESEND_SUCCESS_DISPLAY_MS).pipe(take(1), takeUntilDestroyed(this.destroyRef)).subscribe(() => this.resendSuccess.set(false));
      },
      error: () => { this.resendLoading.set(false); },
    });
  }

  loginWithGoogle(): void {
    this.authError.set('');
    this.authLoading.set(true);
    this.authService.loginWithGoogle().pipe(take(1)).subscribe({
      error: (err: { message?: string }) => {
        this.authError.set(err.message ?? 'Error con Google.');
        this.authLoading.set(false);
      },
    });
  }

  getInputValue(event: Event): string {
    return (event.target as HTMLInputElement).value;
  }

  private startResendCooldown(seconds = 60): void {
    clearInterval(this.cooldownInterval);
    this.resendCooldown.set(seconds);
    this.cooldownInterval = setInterval(() => {
      const remaining = this.resendCooldown() - 1;
      if (remaining <= 0) {
        clearInterval(this.cooldownInterval);
        this.resendCooldown.set(0);
      } else {
        this.resendCooldown.set(remaining);
      }
    }, RESEND_COOLDOWN_TICK_MS);
  }

  private resolvePrefillName(): string {
    const user = this.authService.currentUser;
    if (!user) return '';
    const meta = user.user_metadata as Record<string, string> | undefined;
    const name = meta?.['display_name'] ?? meta?.['full_name'] ?? meta?.['name'] ?? '';
    if (name) return name;
    return (user.email ?? '').split('@')[0]
      .replace(/[._\-+]/g, ' ')
      .replace(/\b\w/g, (c: string) => c.toUpperCase()).trim();
  }
}
