import { inject } from '@angular/core';
import type { CanActivateFn } from '@angular/router';
import { Router } from '@angular/router';
import { LessonProgressService } from '../services/lesson-progress.service';

export const lessonUnlockGuard: CanActivateFn = (route) => {
  const router = inject(Router);
  const progressService = inject(LessonProgressService);

  const lessonId = route.paramMap.get('id');
  if (!lessonId) {
    return router.createUrlTree(['/welcome']);
  }

  if (!progressService.isLessonUnlocked(lessonId)) {
    const currentId = progressService.currentLessonId();
    return router.createUrlTree(['/lesson', currentId]);
  }

  return true;
};
