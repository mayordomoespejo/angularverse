import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { Auth, user } from '@angular/fire/auth';
import { map, take } from 'rxjs';

export const authGuard: CanActivateFn = () => {
  const router = inject(Router);
  const auth = inject(Auth);

  return user(auth).pipe(
    take(1),
    map((u) => {
      if (u) return true;
      return router.createUrlTree(['/auth/login']);
    }),
  );
};
