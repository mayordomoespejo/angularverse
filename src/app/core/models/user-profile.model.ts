import type { ChatMessage } from './chat-message.model';

export type UserLevel = 'beginner' | 'intermediate' | 'developer';

export interface UserStreak {
  lastActiveDate: string;
  count: number;
}

export interface UserProfile {
  userId: string;
  userName: string;
  level: UserLevel;
  completedLessons: string[];
  xpTotal: number;
  currentLessonId: string;
  chatHistoryByLesson: Record<string, ChatMessage[]>;
  streak: UserStreak;
  badges: string[];
  createdAt: string;
  photoUrl?: string;
}

export type PersistedState = UserProfile;

export function createDefaultUserProfile(): UserProfile {
  return {
    userId: '',
    userName: '',
    level: 'beginner',
    completedLessons: [],
    xpTotal: 0,
    currentLessonId: 'L0.1',
    chatHistoryByLesson: {},
    streak: { lastActiveDate: new Date().toISOString().split('T')[0], count: 0 },
    badges: [],
    createdAt: new Date().toISOString(),
    photoUrl: undefined,
  };
}
