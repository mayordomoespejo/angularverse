import { Injectable, effect, signal } from '@angular/core';

type Theme = 'dark' | 'light';
const STORAGE_KEY = 'angularverse_theme';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  readonly theme = signal<Theme>(this.loadTheme());

  constructor() {
    effect(() => {
      const t = this.theme();
      localStorage.setItem(STORAGE_KEY, t);
      document.documentElement.setAttribute('data-theme', t);
    });
  }

  private loadTheme(): Theme {
    const stored = localStorage.getItem(STORAGE_KEY) as Theme | null;
    return stored ?? 'dark';
  }

  toggle(): void {
    this.theme.update(t => (t === 'dark' ? 'light' : 'dark'));
  }

  setTheme(theme: Theme): void {
    this.theme.set(theme);
  }
}
