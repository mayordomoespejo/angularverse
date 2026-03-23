import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { LessonProgressService } from '../../core/services/lesson-progress.service';
import { LevelSelectorComponent } from '../../shared/components/level-selector/level-selector.component';
import type { UserLevel } from '../../core/models/user-profile.model';

@Component({
  selector: 'app-profile',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, LevelSelectorComponent],
  template: `
    <div class="profile-shell">
      <div class="particles" aria-hidden="true">
        @for (p of particles; track p) {
          <div class="particle" [style]="p"></div>
        }
      </div>
      <div class="nebula nebula-1" aria-hidden="true"></div>
      <div class="nebula nebula-2" aria-hidden="true"></div>

      <div class="profile-card">
        <!-- Back button -->
        <div class="profile-nav">
          <button class="back-btn" (click)="goBack()">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M10 3L5 8l5 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            Volver
          </button>
        </div>

        <!-- Avatar + title -->
        <div class="avatar-section">
          <div class="avatar-wrapper">
            @if (photoUrl()) {
              <img class="avatar-img" [src]="photoUrl()" alt="Foto de perfil" />
            } @else {
              <div class="avatar-placeholder">{{ initial() }}</div>
            }
            <label class="avatar-upload-btn" title="Cambiar foto">
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <path d="M8 3v10M3 8h10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
              </svg>
              <input
                type="file"
                accept="image/*"
                class="file-input"
                (change)="onPhotoSelected($event)"
                [disabled]="photoLoading()"
              />
            </label>
          </div>

          <div class="avatar-meta">
            <h1 class="profile-title">{{ currentName() || 'Mi perfil' }}</h1>
            <p class="profile-email">{{ userEmail() }}</p>
            @if (photoLoading()) {
              <p class="upload-status">Subiendo foto...</p>
            } @else if (photoError()) {
              <p class="upload-error">{{ photoError() }}</p>
            }
          </div>

        </div>

        <!-- Stats -->
        <div class="section stats-section">
          <h2 class="section-title">Tu progreso</h2>
          <div class="stats-grid">
            <div class="stat">
              <span class="stat-emoji">⚡</span>
              <span class="stat-value xp-value">{{ xp() }}</span>
              <span class="stat-label">XP total</span>
            </div>
            <div class="stat">
              <span class="stat-emoji">📚</span>
              <span class="stat-value">{{ completed() }}</span>
              <span class="stat-label">Lecciones</span>
            </div>
            <div class="stat">
              <span class="stat-emoji">🔥</span>
              <span class="stat-value">{{ streak() }}</span>
              <span class="stat-label">Días seguidos</span>
            </div>
          </div>
        </div>

        <!-- Username -->
        <div class="section">
          <h2 class="section-title">Nombre de usuario</h2>
          <div class="input-row-wrapper">
            <div class="input-row">
              <input
                type="text"
                class="form-input"
                [(ngModel)]="newName"
                placeholder="Tu nombre o alias"
                maxlength="30"
                name="username"
              />
              <button
                class="btn-save"
                (click)="saveName()"
                [disabled]="nameSaving() || !newName.trim() || newName.trim() === currentName()"
              >
                {{ nameSaving() ? 'Guardando...' : 'Guardar' }}
              </button>
            </div>
            @if (nameSuccess()) {
              <p class="field-success">Nombre actualizado</p>
            }
          </div>
        </div>

        <!-- Level -->
        <div class="section">
          <h2 class="section-title">Nivel de experiencia</h2>
          <div class="level-cards-wrapper">
            <app-level-selector
              [selected]="selectedLevel()"
              (levelChange)="selectLevel($event)"
            />
            @if (levelSuccess()) {
              <p class="field-success">Nivel actualizado</p>
            }
          </div>
        </div>

        <!-- Logout -->
        <div class="section">
          <button class="btn-logout" (click)="logout()">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M6 2H3a1 1 0 00-1 1v10a1 1 0 001 1h3M11 11l3-3-3-3M14 8H6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            Cerrar sesión
          </button>
        </div>

        <!-- Delete account -->
        <div class="section danger-section">
          <h2 class="section-title danger-title">Zona de peligro</h2>
          <button class="btn-danger" (click)="showDeleteModal.set(true)">
            Eliminar cuenta
          </button>
        </div>
      </div>

      <!-- Delete confirmation modal -->
      @if (showDeleteModal()) {
        <div class="modal-overlay" (click)="showDeleteModal.set(false)">
          <div class="modal" (click)="$event.stopPropagation()">
            <h2 class="modal-title">¿Eliminar tu cuenta?</h2>
            <p class="modal-desc">
              Esta acción es <strong>permanente e irreversible</strong>. Se eliminarán
              tu cuenta, todo tu progreso y el historial de chat. Si quieres volver,
              tendrás que registrarte de nuevo.
            </p>
            <div class="modal-actions">
              <button class="btn-cancel" (click)="showDeleteModal.set(false)">
                Cancelar
              </button>
              <button class="btn-confirm-delete" (click)="deleteAccount()" [disabled]="deleteLoading()">
                {{ deleteLoading() ? 'Eliminando...' : 'Sí, eliminar todo' }}
              </button>
            </div>
            @if (deleteError()) {
              <p class="modal-error">{{ deleteError() }}</p>
            }
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .profile-shell {
      position: fixed;
      inset: 0;
      background: var(--bg-base);
      display: flex;
      align-items: center;
      justify-content: center;
      overflow-y: auto;
      padding: 2rem 1rem;
    }

    .particles {
      position: fixed;
      inset: 0;
      pointer-events: none;
    }

    .particle {
      position: absolute;
      width: 2px;
      height: 2px;
      background: var(--accent-primary);
      border-radius: 50%;
      animation: particleFloat var(--duration, 8s) ease-in-out infinite;
      animation-delay: var(--delay, 0s);
      left: var(--x, 50%);
    }

    @keyframes particleFloat {
      0% { transform: translateY(110vh) scale(0); opacity: 0; }
      10% { opacity: 1; transform: translateY(90vh) scale(1); }
      90% { opacity: 0.6; }
      100% { transform: translateY(-10vh) scale(0.5) translateX(var(--drift, 0px)); opacity: 0; }
    }

    .nebula {
      position: fixed;
      border-radius: 50%;
      filter: blur(80px);
      pointer-events: none;
      animation: nebula 8s ease-in-out infinite;
    }

    .nebula-1 {
      width: 500px; height: 500px;
      background: radial-gradient(circle, rgba(124,58,237,0.08) 0%, transparent 70%);
      top: -150px; left: -100px;
    }

    .nebula-2 {
      width: 400px; height: 400px;
      background: radial-gradient(circle, rgba(221,0,49,0.06) 0%, transparent 70%);
      bottom: -100px; right: -100px;
      animation-delay: -4s;
    }

    @keyframes nebula {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.15); }
    }

    .profile-card {
      position: relative;
      z-index: 10;
      background: var(--bg-surface);
      border: 1px solid var(--border-subtle);
      border-radius: 16px;
      padding: 1.5rem 2rem 2rem;
      width: 100%;
      max-width: 480px;
      display: flex;
      flex-direction: column;
      gap: 1.75rem;
    }

    /* Nav */
    .profile-nav {
      display: flex;
      align-items: center;
    }

    .back-btn {
      display: flex;
      align-items: center;
      gap: 0.375rem;
      background: none;
      border: none;
      color: var(--text-muted);
      font-size: 0.875rem;
      cursor: pointer;
      padding: 0.25rem 0;
      transition: color 150ms;

      &:hover { color: var(--text-primary); }
    }

    /* Avatar + identity */
    .avatar-section {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.75rem;
      position: relative;
    }

    .avatar-wrapper {
      position: relative;
      width: 88px;
      height: 88px;
    }

    .avatar-img {
      width: 88px;
      height: 88px;
      border-radius: 50%;
      object-fit: cover;
      border: 2px solid var(--accent-primary);
    }

    .avatar-placeholder {
      width: 88px;
      height: 88px;
      border-radius: 50%;
      background: rgba(124, 58, 237, 0.15);
      border: 2px solid var(--accent-primary);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 2.25rem;
      font-weight: 700;
      color: var(--accent-primary);
    }

    .avatar-upload-btn {
      position: absolute;
      bottom: 0;
      right: 0;
      width: 26px;
      height: 26px;
      border-radius: 50%;
      background: var(--accent-primary);
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: filter 150ms;

      &:hover { filter: brightness(1.15); }
    }

    .file-input { display: none; }

    .avatar-meta {
      position: relative;
      text-align: center;
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }

    .profile-title {
      font-size: 1.375rem;
      font-weight: 700;
      color: var(--text-primary);
      line-height: 1.2;
    }

    .profile-email {
      font-size: 0.8125rem;
      color: var(--text-muted);
      margin-bottom: 0;
    }

    .upload-status,
    .upload-error {
      position: absolute;
      bottom: -1.25rem;
      left: 0;
      right: 0;
      font-size: 0.75rem;
      text-align: center;
      pointer-events: none;
      animation: fadeInUp 0.2s ease;
    }

    .upload-status { color: var(--text-muted); }
    .upload-error  { color: #f87171; }

    /* Sections */
    .section {
      position: relative;
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .section-title {
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      color: var(--text-muted);
    }

    /* Stats */
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 0.75rem;
    }

    .stat {
      background: var(--bg-base);
      border: 1px solid var(--border-subtle);
      border-radius: 10px;
      padding: 1rem 0.75rem;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.25rem;
    }

    .stat-emoji {
      font-size: 1.25rem;
      line-height: 1;
    }

    .stat-value {
      font-size: 1.375rem;
      font-weight: 700;
      color: var(--text-primary);
      line-height: 1.2;
    }

    .stat-value.xp-value { color: #fbbf24; }

    .stat-label {
      font-size: 0.6875rem;
      color: var(--text-muted);
      text-align: center;
    }

    /* Input */
    .input-row {
      display: flex;
      gap: 0.75rem;
    }

    .input-row-wrapper {
      position: relative;
    }

    .level-cards-wrapper {
      position: relative;
    }

    .form-input {
      flex: 1;
      background: var(--bg-base);
      border: 1px solid var(--border-subtle);
      color: var(--text-primary);
      padding: 0.75rem 1rem;
      border-radius: 8px;
      font-size: 1rem;
      font-family: var(--font-body);
      transition: border-color 200ms, box-shadow 200ms;

      &:focus {
        outline: none;
        border-color: var(--accent-primary);
        box-shadow: 0 0 0 3px rgba(124, 58, 237, 0.15);
      }
    }

    .btn-save {
      background: var(--accent-primary);
      color: white;
      border: none;
      padding: 0.75rem 1.25rem;
      border-radius: 8px;
      font-size: 0.9375rem;
      font-weight: 600;
      cursor: pointer;
      white-space: nowrap;
      transition: filter 150ms;

      &:hover:not(:disabled) { filter: brightness(1.1); }
      &:disabled { opacity: 0.5; cursor: not-allowed; }
    }

    .field-success {
      position: absolute;
      top: calc(100% + 0.25rem);
      left: 0;
      font-size: 0.75rem;
      line-height: 1;
      color: #4ade80;
      white-space: nowrap;
      animation: fadeInUp 0.2s ease;
      pointer-events: none;
    }

    /* Logout */
    .btn-logout {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      background: transparent;
      border: 1px solid var(--border-subtle);
      color: var(--text-secondary);
      padding: 0.75rem 1rem;
      border-radius: 8px;
      font-size: 0.9375rem;
      cursor: pointer;
      transition: all 150ms;
      width: 100%;
      justify-content: center;

      &:hover {
        border-color: var(--text-muted);
        color: var(--text-primary);
      }
    }

    /* Danger zone */
    .danger-section {
      border-top: 1px solid rgba(239, 68, 68, 0.15);
      padding-top: 1.5rem;
    }

    .danger-title { color: #f87171; }

    .btn-danger {
      background: transparent;
      border: 1px solid rgba(239, 68, 68, 0.3);
      color: #f87171;
      padding: 0.75rem 1rem;
      border-radius: 8px;
      font-size: 0.9375rem;
      cursor: pointer;
      width: 100%;
      transition: all 150ms;

      &:hover {
        background: rgba(239, 68, 68, 0.08);
        border-color: #f87171;
      }
    }

    /* Modal */
    .modal-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,0.6);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 100;
      padding: 1rem;
      backdrop-filter: blur(4px);
    }

    .modal {
      background: var(--bg-surface);
      border: 1px solid rgba(239, 68, 68, 0.3);
      border-radius: 12px;
      padding: 2rem;
      padding-bottom: 3rem;
      max-width: 400px;
      width: 100%;
      display: flex;
      flex-direction: column;
      gap: 1rem;
      position: relative;
    }

    .modal-title {
      font-size: 1.25rem;
      font-weight: 700;
      color: var(--text-primary);
    }

    .modal-desc {
      color: var(--text-secondary);
      font-size: 0.9375rem;
      line-height: 1.6;

      strong { color: #f87171; }
    }

    .modal-error {
      position: absolute;
      bottom: 0.75rem;
      left: 2rem;
      right: 2rem;
      font-size: 0.8125rem;
      color: #f87171;
      text-align: center;
      pointer-events: none;
      animation: fadeInUp 0.2s ease;
    }

    .modal-actions {
      display: flex;
      gap: 0.75rem;
      margin-top: 0.5rem;
    }

    .btn-cancel {
      flex: 1;
      background: transparent;
      border: 1px solid var(--border-subtle);
      color: var(--text-secondary);
      padding: 0.75rem;
      border-radius: 8px;
      font-size: 0.9375rem;
      cursor: pointer;
      transition: all 150ms;

      &:hover { border-color: var(--text-muted); color: var(--text-primary); }
    }

    .btn-confirm-delete {
      flex: 1;
      background: #ef4444;
      border: none;
      color: white;
      padding: 0.75rem;
      border-radius: 8px;
      font-size: 0.9375rem;
      font-weight: 600;
      cursor: pointer;
      transition: filter 150ms;

      &:hover:not(:disabled) { filter: brightness(1.1); }
      &:disabled { opacity: 0.6; cursor: not-allowed; }
    }

    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(8px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `],
})
export class ProfileComponent {
  private readonly authService = inject(AuthService);
  private readonly progressService = inject(LessonProgressService);
  private readonly router = inject(Router);

  readonly photoUrl = this.progressService.photoUrl;
  readonly currentName = this.progressService.userName;
  readonly xp = this.progressService.xpTotal;
  readonly completed = computed(() => this.progressService.completedLessons().length);
  readonly streak = computed(() => this.progressService.streak().count);
  readonly initial = computed(() => this.currentName().charAt(0).toUpperCase() || 'U');
  readonly userEmail = computed(() => this.authService.currentUser?.email ?? '');

  readonly showDeleteModal = signal(false);
  readonly photoLoading = signal(false);
  readonly photoError = signal('');
  readonly nameSaving = signal(false);
  readonly nameSuccess = signal(false);
  readonly levelSuccess = signal(false);
  readonly deleteLoading = signal(false);
  readonly deleteError = signal('');
  readonly selectedLevel = signal(this.progressService.userLevel());

  readonly particles = this.generateParticles();

  newName = this.currentName();

  private generateParticles(): string[] {
    return Array.from({ length: 30 }, () => {
      const x = Math.random() * 100;
      const duration = 6 + Math.random() * 8;
      const delay = Math.random() * -10;
      const drift = (Math.random() - 0.5) * 100;
      const size = 1 + Math.random() * 2;
      const opacity = 0.3 + Math.random() * 0.6;
      return `--x:${x}%;--duration:${duration}s;--delay:${delay}s;--drift:${drift}px;width:${size}px;height:${size}px;opacity:${opacity};animation-delay:${delay}s`;
    });
  }

  goBack(): void {
    void this.router.navigate(['/lesson', this.progressService.currentLessonId()]);
  }

  // ── Photo ─────────────────────────────────────────────────────────────

  async onPhotoSelected(event: Event): Promise<void> {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      this.photoError.set('La imagen no puede superar 5 MB.');
      return;
    }

    this.photoError.set('');
    this.photoLoading.set(true);

    try {
      const url = await this.authService.uploadPhoto(file);
      this.progressService.updatePhotoUrl(url);
    } catch {
      this.photoError.set('Error al subir la foto. Inténtalo de nuevo.');
    } finally {
      this.photoLoading.set(false);
    }
  }

  // ── Level ─────────────────────────────────────────────────────────────

  selectLevel(level: UserLevel): void {
    if (level === this.progressService.userLevel()) return;
    this.selectedLevel.set(level);
    this.progressService.updateLevel(level);
    this.levelSuccess.set(true);
    setTimeout(() => this.levelSuccess.set(false), 2500);
  }

  // ── Username ──────────────────────────────────────────────────────────

  saveName(): void {
    const name = this.newName.trim();
    if (!name || name === this.currentName()) return;

    this.nameSaving.set(true);
    this.authService.updateDisplayName(name).subscribe({
      next: () => {
        this.progressService.updateUserName(name);
        this.nameSuccess.set(true);
        this.nameSaving.set(false);
        setTimeout(() => this.nameSuccess.set(false), 2500);
      },
      error: () => this.nameSaving.set(false),
    });
  }

  // ── Logout ────────────────────────────────────────────────────────────

  logout(): void {
    this.authService.logout().subscribe({
      next: () => {
        this.progressService.resetProfile();
        void this.router.navigate(['/welcome']);
      },
    });
  }

  // ── Delete account ────────────────────────────────────────────────────

  deleteAccount(): void {
    this.deleteLoading.set(true);
    this.deleteError.set('');

    this.authService.deleteAccount().subscribe({
      next: () => {
        this.progressService.resetProfile();
        void this.router.navigate(['/welcome']);
      },
      error: () => {
        this.deleteLoading.set(false);
        this.deleteError.set('Error al eliminar la cuenta. Inténtalo de nuevo.');
      },
    });
  }
}
