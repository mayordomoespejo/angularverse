import { Injectable, inject } from '@angular/core';
import {
  Auth,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  deleteUser,
  sendEmailVerification,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
  user,
} from '@angular/fire/auth';
import { Storage, getDownloadURL, ref, uploadBytes } from '@angular/fire/storage';
import { Observable, from, catchError } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly auth = inject(Auth);
  private readonly storage = inject(Storage);

  readonly user$ = user(this.auth);

  // ── Smart auth: register → fallback login ─────────────────────────────

  smartAuth(email: string, password: string): Observable<unknown> {
    return from(
      createUserWithEmailAndPassword(this.auth, email, password).then((cred) =>
        sendEmailVerification(cred.user),
      ),
    ).pipe(
      catchError((err: { code?: string }) => {
        if (err.code === 'auth/email-already-in-use') {
          return from(signInWithEmailAndPassword(this.auth, email, password));
        }
        throw err;
      }),
    );
  }

  // ── Google OAuth ──────────────────────────────────────────────────────

  loginWithGoogle() {
    return from(signInWithPopup(this.auth, new GoogleAuthProvider()));
  }

  // ── Profile updates ───────────────────────────────────────────────────

  updateDisplayName(name: string) {
    const u = this.auth.currentUser;
    if (!u) return from(Promise.resolve());
    return from(updateProfile(u, { displayName: name }));
  }

  async uploadPhoto(file: File): Promise<string> {
    const u = this.auth.currentUser;
    if (!u) throw new Error('No authenticated user');

    const storageRef = ref(this.storage, `profile-photos/${u.uid}`);
    await uploadBytes(storageRef, file);
    const url = await getDownloadURL(storageRef);
    await updateProfile(u, { photoURL: url });
    return url;
  }

  // ── Account deletion ──────────────────────────────────────────────────

  deleteAccount() {
    const u = this.auth.currentUser;
    if (!u) return from(Promise.resolve());
    return from(deleteUser(u));
  }

  // ── Session ───────────────────────────────────────────────────────────

  logout() {
    return from(signOut(this.auth));
  }

  get currentUser() {
    return this.auth.currentUser;
  }
}
