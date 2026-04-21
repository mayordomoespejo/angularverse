import { Injectable, isDevMode } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class LoggerService {
  error(context: string, error: unknown, metadata?: Record<string, unknown>): void {
    if (isDevMode()) {
      console.error(`[${context}]`, error, metadata ?? '');
    }
  }

  warn(context: string, message: string, metadata?: Record<string, unknown>): void {
    if (isDevMode()) {
      console.warn(`[${context}] ${message}`, metadata ?? '');
    }
  }

  log(context: string, message: string, metadata?: Record<string, unknown>): void {
    if (isDevMode()) {
      console.log(`[${context}] ${message}`, metadata ?? '');
    }
  }
}
