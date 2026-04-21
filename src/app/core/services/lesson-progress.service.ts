import { DestroyRef, Injectable, computed, effect, inject, signal } from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import type { UserLevel, UserProfile } from '../models/user-profile.model';
import type { ChatMessage } from '../models/chat-message.model';
import { ALL_LESSONS } from '../../data/lessons';
import type { Lesson } from '../models/lesson.model';
import { SupabaseService } from './supabase.service';
import { AuthService } from './auth.service';

const STORAGE_KEY = 'angularverse_state';

function createDefaultProfile(): UserProfile {
  return {
    userId: crypto.randomUUID(),
    userName: '',
    level: 'beginner',
    completedLessons: [],
    xpTotal: 0,
    currentLessonId: 'L0.1',
    chatHistoryByLesson: {},
    streak: { lastActiveDate: new Date().toISOString().split('T')[0], count: 1 },
    badges: [],
    createdAt: new Date().toISOString(),
  };
}

@Injectable({ providedIn: 'root' })
export class LessonProgressService {
  private readonly supabase = inject(SupabaseService);
  private readonly auth = inject(AuthService);
  private readonly destroyRef = inject(DestroyRef);

  private get userId(): string {
    return this.auth.currentUser?.id ?? '';
  }

  private readonly _profile = signal<UserProfile | null>(this.loadFromStorage());

  readonly profile = this._profile.asReadonly();
  readonly profile$ = toObservable(this._profile);
  readonly isInitialized = computed(() => this._profile() !== null && this._profile()!.userName !== '');

  readonly xpTotal = computed(() => this._profile()?.xpTotal ?? 0);
  readonly completedLessons = computed(() => this._profile()?.completedLessons ?? []);
  readonly currentLessonId = computed(() => this._profile()?.currentLessonId ?? 'L0.1');
  readonly streak = computed(() => this._profile()?.streak ?? { lastActiveDate: '', count: 0 });
  readonly userName = computed(() => this._profile()?.userName ?? '');
  readonly userLevel = computed(() => this._profile()?.level ?? 'beginner');
  readonly photoUrl = computed(() => this._profile()?.photoUrl ?? '');

  readonly allLessons = computed((): Lesson[] => ALL_LESSONS);

  constructor() {
    // Keep localStorage in sync on every profile change
    effect(() => {
      const profile = this._profile();
      if (profile) {
        this.writeToStorage(STORAGE_KEY, profile);
      }
    });

    // React to Auth state — sync with Supabase once user is known
    this.auth.user$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((user) => {
      if (!user) return;
      // Ensure the row exists (ignoreDuplicates = no overwrite on returning users)
      this.ensureSupabaseRow(user.id);
      // Hydrate profile from Supabase (merges remote data into local state)
      this.hydrateFromSupabase(user.id);
    });
  }

  // ── Storage helpers ─────────────────────────────────────────

  private readFromStorage<T>(key: string, fallback: T): T {
    try {
      const raw = localStorage.getItem(key);
      return raw ? (JSON.parse(raw) as T) : fallback;
    } catch {
      return fallback;
    }
  }

  private writeToStorage(key: string, value: unknown): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // private browsing or storage full — fail silently
    }
  }

  private loadFromStorage(): UserProfile | null {
    return this.readFromStorage<UserProfile | null>(STORAGE_KEY, null);
  }

  // ── Supabase sync ────────────────────────────────────────────

  /** Creates the row immediately on login — ignoreDuplicates prevents overwriting returning users. */
  private ensureSupabaseRow(uid: string): void {
    this.supabase.client
      .from('user_progress')
      .upsert({ user_id: uid }, { onConflict: 'user_id', ignoreDuplicates: true })
      .then(({ error }) => {
        if (error) return;
      });
  }

  /** On auth: fetch remote row and merge into local state (Supabase wins). */
  private async hydrateFromSupabase(uid: string): Promise<void> {
    try {
      const { data, error } = await this.supabase.client
        .from('user_progress')
        .select('*')
        .eq('user_id', uid)
        .maybeSingle();

      if (error || !data) return;

      const local = this._profile();

      // Build merged profile — Supabase values win on conflicts
      const merged: UserProfile = {
        userId: local?.userId ?? crypto.randomUUID(),
        userName: data['name'] ?? local?.userName ?? '',
        level: (data['level'] as UserLevel) ?? local?.level ?? 'beginner',
        completedLessons: data['completed_lessons'] ?? local?.completedLessons ?? [],
        xpTotal: data['xp_total'] ?? local?.xpTotal ?? 0,
        currentLessonId: local?.currentLessonId ?? 'L0.1',
        chatHistoryByLesson: local?.chatHistoryByLesson ?? {},
        streak: {
          lastActiveDate: data['streak_last_date'] ?? local?.streak.lastActiveDate ?? '',
          count: data['streak_count'] ?? local?.streak.count ?? 0,
        },
        badges: local?.badges ?? [],
        createdAt: local?.createdAt ?? data['created_at'] ?? new Date().toISOString(),
        photoUrl: data['photo_url'] ?? local?.photoUrl ?? undefined,
      };

      // Update signal — will trigger the effect which saves to localStorage
      this._profile.set(merged);

      // Also hydrate chat history from Supabase
      await this.hydrateChatHistoryFromSupabase(uid, merged);
    } catch {
      return;
    }
  }

  private async hydrateChatHistoryFromSupabase(uid: string, profile: UserProfile): Promise<void> {
    try {
      const { data, error } = await this.supabase.client
        .from('chat_history')
        .select('lesson_id, messages')
        .eq('user_id', uid);

      if (error || !data || data.length === 0) return;

      const chatHistoryByLesson: Record<string, ChatMessage[]> = { ...profile.chatHistoryByLesson };
      for (const row of data) {
        chatHistoryByLesson[row['lesson_id']] = row['messages'] as ChatMessage[];
      }

      this._profile.set({ ...profile, chatHistoryByLesson });
    } catch {
      return;
    }
  }

  /** Upsert progress row — fire-and-forget, never breaks UX. */
  private syncProfileToSupabase(profile: UserProfile): void {
    const uid = this.userId;
    if (!uid) return;

    this.supabase.client
      .from('user_progress')
      .upsert(
        {
          user_id: uid,
          name: profile.userName,
          level: profile.level,
          xp_total: profile.xpTotal,
          completed_lessons: profile.completedLessons,
          streak_count: profile.streak.count,
          streak_last_date: profile.streak.lastActiveDate,
          photo_url: profile.photoUrl ?? null,
        },
        { onConflict: 'user_id' },
      )
      .then(({ error }) => {
        if (error) return;
      });
  }

  /** Upsert a single lesson's chat history — fire-and-forget. */
  private syncChatHistoryToSupabase(lessonId: string, messages: ChatMessage[]): void {
    this.supabase.client
      .from('chat_history')
      .upsert(
        {
          user_id: this.userId,
          lesson_id: lessonId,
          messages,
        },
        { onConflict: 'user_id,lesson_id' },
      )
      .then(({ error }) => {
        if (error) return;
      });
  }

  // ── Public API (unchanged surface) ──────────────────────────

  initUser(name: string, level: UserLevel): void {
    const profile = createDefaultProfile();
    profile.userName = name;
    profile.level = level;
    this._profile.set(profile);
    this.syncProfileToSupabase(profile);
  }

  updateLevel(level: UserLevel): void {
    const profile = this._profile();
    if (!profile) return;
    const updated = { ...profile, level };
    this._profile.set(updated);
    this.syncProfileToSupabase(updated);
  }

  updateUserName(name: string): void {
    const profile = this._profile();
    if (!profile) return;
    const updated = { ...profile, userName: name };
    this._profile.set(updated);
    this.syncProfileToSupabase(updated);
  }

  updatePhotoUrl(url: string): void {
    const profile = this._profile();
    if (!profile) return;
    const updated = { ...profile, photoUrl: url };
    this._profile.set(updated);
    this.syncProfileToSupabase(updated);
  }

  completeLesson(lessonId: string): void {
    const profile = this._profile();
    if (!profile) return;

    const lesson = ALL_LESSONS.find(l => l.id === lessonId);
    const xpGained = lesson?.xpReward ?? 50;

    const completed = profile.completedLessons.includes(lessonId)
      ? profile.completedLessons
      : [...profile.completedLessons, lessonId];

    const today = new Date().toISOString().split('T')[0];
    const lastActive = profile.streak.lastActiveDate;
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

    const newStreak =
      lastActive === today
        ? profile.streak
        : lastActive === yesterday
          ? { lastActiveDate: today, count: profile.streak.count + 1 }
          : { lastActiveDate: today, count: 1 };

    const nextLessonId = lesson?.nextLesson ?? profile.currentLessonId;

    const updated: UserProfile = {
      ...profile,
      completedLessons: completed,
      xpTotal: profile.completedLessons.includes(lessonId)
        ? profile.xpTotal
        : profile.xpTotal + xpGained,
      currentLessonId: nextLessonId ?? profile.currentLessonId,
      streak: newStreak,
    };
    this._profile.set(updated);
    this.syncProfileToSupabase(updated);
  }

  getCurrentLesson(): Lesson | null {
    const id = this.currentLessonId();
    return ALL_LESSONS.find(l => l.id === id) ?? null;
  }

  getLessonById(id: string): Lesson | null {
    return ALL_LESSONS.find(l => l.id === id) ?? null;
  }

  isLessonCompleted(lessonId: string): boolean {
    return this.completedLessons().includes(lessonId);
  }

  isLessonUnlocked(lessonId: string): boolean {
    const lesson = ALL_LESSONS.find(l => l.id === lessonId);
    if (!lesson) return false;
    if (lesson.prerequisites.length === 0) return true;
    return lesson.prerequisites.every(prereq => this.isLessonCompleted(prereq));
  }

  saveChatHistory(lessonId: string, messages: ChatMessage[]): void {
    const profile = this._profile();
    if (!profile) return;
    this._profile.set({
      ...profile,
      chatHistoryByLesson: {
        ...profile.chatHistoryByLesson,
        [lessonId]: messages,
      },
    });
    // Sync this lesson's chat history to Supabase (fire-and-forget)
    this.syncChatHistoryToSupabase(lessonId, messages);
  }

  getChatHistory(lessonId: string): ChatMessage[] {
    return this._profile()?.chatHistoryByLesson[lessonId] ?? [];
  }

  updateProgress(): void {
    const profile = this._profile();
    if (!profile) return;
    this._profile.set({ ...profile });
  }

  resetProfile(): void {
    try { localStorage.removeItem(STORAGE_KEY); } catch { /* ignore */ }
    this._profile.set(null);
  }
}
