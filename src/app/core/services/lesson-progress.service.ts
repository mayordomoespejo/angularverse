import { Injectable, computed, effect, inject, signal } from '@angular/core';
import type { UserLevel, UserProfile } from '../models/user-profile.model';
import type { ChatMessage } from '../models/chat-message.model';
import { ALL_LESSONS } from '../../data/lessons';
import type { Lesson } from '../models/lesson.model';
import { SupabaseService } from './supabase.service';

const STORAGE_KEY = 'angularverse_state';
const DEVICE_ID_KEY = 'angularverse_device_id';

// ── anonymous device ID (persists forever in localStorage) ───
function getOrCreateDeviceId(): string {
  let id = localStorage.getItem(DEVICE_ID_KEY);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(DEVICE_ID_KEY, id);
  }
  return id;
}

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
  private readonly deviceId = getOrCreateDeviceId();

  private readonly _profile = signal<UserProfile | null>(this.loadFromStorage());

  readonly profile = this._profile.asReadonly();
  readonly isInitialized = computed(() => this._profile() !== null && this._profile()!.userName !== '');

  readonly xpTotal = computed(() => this._profile()?.xpTotal ?? 0);
  readonly completedLessons = computed(() => this._profile()?.completedLessons ?? []);
  readonly currentLessonId = computed(() => this._profile()?.currentLessonId ?? 'L0.1');
  readonly streak = computed(() => this._profile()?.streak ?? { lastActiveDate: '', count: 0 });
  readonly userName = computed(() => this._profile()?.userName ?? '');
  readonly userLevel = computed(() => this._profile()?.level ?? 'beginner');

  readonly allLessons = computed((): Lesson[] => ALL_LESSONS);

  constructor() {
    // Keep localStorage in sync on every profile change
    effect(() => {
      const profile = this._profile();
      if (profile) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
        // Non-blocking Supabase sync — fire-and-forget
        this.syncProfileToSupabase(profile);
      }
    });

    // On startup: try to hydrate from Supabase and merge
    this.hydrateFromSupabase();
  }

  // ── Storage helpers ─────────────────────────────────────────

  private loadFromStorage(): UserProfile | null {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) return null;
      return JSON.parse(stored) as UserProfile;
    } catch {
      return null;
    }
  }

  // ── Supabase sync ────────────────────────────────────────────

  /** On startup: fetch remote row and merge into local state (Supabase wins). */
  private async hydrateFromSupabase(): Promise<void> {
    try {
      const { data, error } = await this.supabase.client
        .from('user_progress')
        .select('*')
        .eq('device_id', this.deviceId)
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
      };

      // Update signal — will trigger the effect which saves to localStorage
      this._profile.set(merged);

      // Also hydrate chat history from Supabase
      await this.hydrateChatHistoryFromSupabase(merged);
    } catch (err) {
      console.warn('[Supabase] hydrateFromSupabase failed:', err);
    }
  }

  private async hydrateChatHistoryFromSupabase(profile: UserProfile): Promise<void> {
    try {
      const { data, error } = await this.supabase.client
        .from('chat_history')
        .select('lesson_id, messages')
        .eq('device_id', this.deviceId);

      if (error || !data || data.length === 0) return;

      const chatHistoryByLesson: Record<string, ChatMessage[]> = { ...profile.chatHistoryByLesson };
      for (const row of data) {
        chatHistoryByLesson[row['lesson_id']] = row['messages'] as ChatMessage[];
      }

      this._profile.set({ ...profile, chatHistoryByLesson });
    } catch (err) {
      console.warn('[Supabase] hydrateChatHistoryFromSupabase failed:', err);
    }
  }

  /** Upsert progress row — fire-and-forget, never breaks UX. */
  private syncProfileToSupabase(profile: UserProfile): void {
    this.supabase.client
      .from('user_progress')
      .upsert(
        {
          device_id: this.deviceId,
          name: profile.userName,
          level: profile.level,
          xp_total: profile.xpTotal,
          completed_lessons: profile.completedLessons,
          streak_count: profile.streak.count,
          streak_last_date: profile.streak.lastActiveDate,
        },
        { onConflict: 'device_id' },
      )
      .then(({ error }) => {
        if (error) console.warn('[Supabase] syncProfileToSupabase failed:', error.message);
      });
  }

  /** Upsert a single lesson's chat history — fire-and-forget. */
  private syncChatHistoryToSupabase(lessonId: string, messages: ChatMessage[]): void {
    this.supabase.client
      .from('chat_history')
      .upsert(
        {
          device_id: this.deviceId,
          lesson_id: lessonId,
          messages,
        },
        { onConflict: 'device_id,lesson_id' },
      )
      .then(({ error }) => {
        if (error) console.warn('[Supabase] syncChatHistoryToSupabase failed:', error.message);
      });
  }

  // ── Public API (unchanged surface) ──────────────────────────

  initUser(name: string, level: UserLevel): void {
    const profile = createDefaultProfile();
    profile.userName = name;
    profile.level = level;
    this._profile.set(profile);
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

    this._profile.set({
      ...profile,
      completedLessons: completed,
      xpTotal: profile.completedLessons.includes(lessonId)
        ? profile.xpTotal
        : profile.xpTotal + xpGained,
      currentLessonId: nextLessonId ?? profile.currentLessonId,
      streak: newStreak,
    });
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
    localStorage.removeItem(STORAGE_KEY);
    this._profile.set(null);
  }
}
