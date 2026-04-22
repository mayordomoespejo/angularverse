import type { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { lessonUnlockGuard } from './core/guards/lesson-unlock.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'welcome',
    pathMatch: 'full',
  },
  {
    path: 'welcome',
    loadComponent: () =>
      import('./features/welcome/welcome-shell').then(m => m.WelcomeShellComponent),
  },
  {
    path: 'profile',
    loadComponent: () =>
      import('./features/profile/profile').then(m => m.ProfileComponent),
    canActivate: [authGuard],
  },
  {
    path: 'lesson/:id',
    loadComponent: () =>
      import('./features/lesson/lesson-shell').then(m => m.LessonShellComponent),
    canActivate: [authGuard, lessonUnlockGuard],
  },
  {
    path: 'auth/callback',
    loadComponent: () =>
      import('./features/auth-callback/auth-callback').then(m => m.AuthCallbackComponent),
  },
  {
    path: '**',
    redirectTo: 'welcome',
  },
];
