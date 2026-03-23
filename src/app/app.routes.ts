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
      import('./features/welcome/welcome').then(m => m.WelcomeComponent),
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
    path: '**',
    redirectTo: 'welcome',
  },
];
