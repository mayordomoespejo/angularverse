import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable, from, map } from 'rxjs';
import type { Session, User } from '@supabase/supabase-js';
import { SupabaseService } from './supabase.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly supabase = inject(SupabaseService);
  private readonly _session$ = new BehaviorSubject<Session | null>(null);

  readonly session$ = this._session$.asObservable();
  readonly user$ = this._session$.pipe(map(s => s?.user ?? null));

  constructor() {
    // Hydrate from persisted session immediately
    this.supabase.client.auth.getSession().then(({ data }) => {
      this._session$.next(data.session);
    });
    // Listen to future auth state changes
    this.supabase.client.auth.onAuthStateChange((_event, session) => {
      this._session$.next(session);
    });
  }

  /** Step 1 of OTP flow: send 6-digit code to email */
  sendOtp(email: string): Observable<void> {
    return from(
      this.supabase.client.auth.signInWithOtp({
        email,
        options: { shouldCreateUser: true },
      }).then(({ error }) => { if (error) throw error; })
    );
  }

  /** Step 2: verify the 6-digit code. Returns isNewUser flag. */
  verifyOtp(email: string, token: string): Observable<{ isNewUser: boolean }> {
    return from(
      // Try 'email' first (returning user), fallback to 'signup' (new user confirmation)
      this.supabase.client.auth.verifyOtp({ email, token, type: 'email' })
        .then(async (result) => {
          if (result.error) {
            return this.supabase.client.auth.verifyOtp({ email, token, type: 'signup' });
          }
          return result;
        })
        .then(async ({ data, error }) => {
          if (error) throw error;
          const user = data.user!;
          const { data: row } = await this.supabase.client
            .from('user_progress')
            .select('user_id')
            .eq('user_id', user.id)
            .maybeSingle();
          return { isNewUser: !row };
        })
    );
  }

  /** Google OAuth — redirect flow (not popup) */
  loginWithGoogle(): Observable<void> {
    const redirectTo = `${window.location.origin}/auth/callback`;
    return from(
      this.supabase.client.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo },
      }).then(({ error }) => { if (error) throw error; })
    );
  }

  /** Update display name in user_metadata */
  updateDisplayName(name: string): Observable<void> {
    return from(
      this.supabase.client.auth.updateUser({ data: { display_name: name } })
        .then(({ error }) => { if (error) throw error; })
    );
  }

  /** Upload profile photo to Supabase Storage. Returns public URL. */
  async uploadPhoto(file: File): Promise<string> {
    const user = this.currentUser;
    if (!user) throw new Error('Not authenticated');
    const ext = file.name.split('.').pop();
    const path = `${user.id}/avatar.${ext}`;
    const { error: uploadError } = await this.supabase.client.storage
      .from('profile-photos')
      .upload(path, file, { upsert: true });
    if (uploadError) throw uploadError;
    const { data } = this.supabase.client.storage
      .from('profile-photos')
      .getPublicUrl(path);
    return data.publicUrl;
  }

  /** Delete account via Supabase Edge Function, then clear local session */
  deleteAccount(): Observable<void> {
    return from(
      this.supabase.client.functions.invoke('delete-account')
        .then(({ error }) => { if (error) throw error; })
        .then(() => {
          localStorage.removeItem('sb-hkikabkcrdyeqrkhcxbu-auth-token');
          localStorage.removeItem('angularverse_state');
          this._session$.next(null);
        })
    );
  }

  /** Sign out */
  logout(): Observable<void> {
    return from(
      this.supabase.client.auth.signOut()
        .then(({ error }) => { if (error) throw error; })
    );
  }

  get currentUser(): User | null {
    return this._session$.value?.user ?? null;
  }

  /** Equivalent of Firebase authStateReady() — resolves when session is known */
  authReady(): Promise<Session | null> {
    return this.supabase.client.auth.getSession().then(({ data }) => data.session);
  }
}
