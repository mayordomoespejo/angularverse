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
}

export type PersistedState = UserProfile;
