import type { Routes } from '@angular/router';
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
    path: 'lesson/:id',
    loadComponent: () =>
      import('./features/lesson/lesson-shell').then(m => m.LessonShellComponent),
    canActivate: [lessonUnlockGuard],
  },
  {
    path: '**',
    redirectTo: 'welcome',
  },
];
