import {
  AfterViewChecked,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  ViewChild,
  computed,
  effect,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { AiTutorService } from '../../../../core/services/ai-tutor.service';
import { LessonProgressService } from '../../../../core/services/lesson-progress.service';
import type { ChatMessage } from '../../../../core/models/chat-message.model';
import type { Lesson } from '../../../../core/models/lesson.model';
import { NgbotAvatarComponent } from '../../../../shared/components/ngbot-avatar/ngbot-avatar';

@Component({
  selector: 'app-chat-tutor',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgbotAvatarComponent],
  template: `
    <div class="chat-tutor" [class.open]="isOpen()">
      <!-- Chat bar (always visible) -->
      <div class="chat-bar" (click)="toggle.emit()">
        <div class="chat-bar-left">
          <app-ngbot-avatar size="sm" [showStatus]="true" />
          <div class="ngbot-info">
            <span class="ngbot-name">Ngbot</span>
            <span class="ngbot-status">
              @if (isStreaming()) {
                <span class="streaming-indicator">escribiendo...</span>
              } @else {
                <span class="online-indicator">● en línea</span>
              }
            </span>
          </div>
        </div>

        <div class="chat-bar-chips" (click)="$event.stopPropagation()">
          @for (q of suggestedQuestions(); track q) {
            <button
              class="chip"
              (click)="prefillInput(q)"
              [disabled]="isStreaming()"
            >
              {{ q }}
            </button>
          }
        </div>

        <button class="toggle-btn" aria-label="Toggle chat" (click)="toggle.emit(); $event.stopPropagation()">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" [class.rotated]="isOpen()">
            <path d="M3 5l4 4 4-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
      </div>

      <!-- Messages panel -->
      @if (isOpen()) {
        <div class="messages-panel custom-scroll" #messagesContainer>
          @if (messages().length === 0) {
            <div class="empty-chat">
              <app-ngbot-avatar size="lg" [showStatus]="false" />
              <p class="empty-title">¡Hola{{ userName() ? ', ' + userName() : '' }}!</p>
              <p class="empty-subtitle">Soy Ngbot, tu tutor AI para esta lección. Pregúntame sobre <strong>{{ lessonTitle() }}</strong> o sobre cualquier concepto de Angular.</p>
            </div>
          }

          @for (msg of messages(); track msg.id) {
            <div class="message" [class.user]="msg.role === 'user'" [class.assistant]="msg.role === 'assistant'" [class.fixed-intro]="msg.isFixed">
              @if (msg.role === 'assistant' && !msg.isFixed) {
                <div class="msg-avatar">
                  <app-ngbot-avatar size="sm" [showStatus]="false" />
                </div>
              }
              @if (msg.isFixed) {
                <div class="fixed-intro-wrapper">
                  <div class="fixed-intro-label">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
                      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
                    </svg>
                    Intro de lección
                  </div>
                  <div class="msg-bubble fixed">
                    <div class="msg-content" [innerHTML]="renderMarkdown(msg.content)"></div>
                  </div>
                </div>
              } @else {
                <div class="msg-bubble">
                  <div class="msg-content" [innerHTML]="renderMarkdown(msg.content)"></div>
                  @if (msg.isStreaming) {
                    <span class="typing-cursor">▊</span>
                  }
                </div>
              }
              @if (msg.role === 'user') {
                <div class="msg-user-avatar">
                  <span>{{ userInitial() }}</span>
                </div>
              }
            </div>
          }

          @if (isStreaming() && streamingContent().length === 0) {
            <div class="message assistant">
              <div class="msg-avatar">
                <app-ngbot-avatar size="sm" [showStatus]="false" />
              </div>
              <div class="msg-bubble">
                <div class="typing-dots">
                  <span></span><span></span><span></span>
                </div>
              </div>
            </div>
          }
        </div>

        <div class="chat-input-area">
          <textarea
            class="chat-input"
            placeholder="Pregunta algo sobre esta lección..."
            [value]="inputValue()"
            (input)="inputValue.set(getInputValue($event))"
            (keydown.enter)="handleEnterKey($event)"
            [disabled]="isStreaming()"
            rows="2"
          ></textarea>
          <button
            class="send-btn"
            [disabled]="!canSend()"
            (click)="sendMessage()"
          >
            @if (isStreaming()) {
              <div class="mini-spinner"></div>
            } @else {
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M12 7L2 2l2 5-2 5 10-5z" fill="currentColor"/>
              </svg>
            }
          </button>
        </div>
      }
    </div>
  `,
  styles: [`
    .chat-tutor {
      width: 100%;
      flex-shrink: 0;
      background: var(--bg-surface);
      border-top: 1px solid var(--border);
      display: flex;
      flex-direction: column;
    }

    // Chat bar
    .chat-bar {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.625rem 1.25rem;
      cursor: pointer;
      background: var(--bg-elevated);
      min-height: 52px;
      flex-shrink: 0;
      user-select: none;

      &:hover { background: color-mix(in srgb, #1F2937 95%, white 5%); }
    }

    .chat-bar-left {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      flex-shrink: 0;
    }

    .ngbot-info {
      display: flex;
      flex-direction: column;
    }

    .ngbot-name {
      font-weight: 700;
      font-size: 0.875rem;
      color: var(--text-primary);
    }

    .ngbot-status {
      font-size: 0.6875rem;
    }

    .online-indicator { color: var(--accent-code); }
    .streaming-indicator {
      color: var(--accent-primary);
      animation: pulse 1.5s ease-in-out infinite;
    }

    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.5; }
    }

    // Chips
    .chat-bar-chips {
      display: flex;
      gap: 0.375rem;
      flex: 1;
      overflow-x: auto;
      scrollbar-width: none;

      &::-webkit-scrollbar { display: none; }
    }

    .chip {
      white-space: nowrap;
      padding: 0.25rem 0.625rem;
      background: rgba(124, 58, 237, 0.08);
      border: 1px solid rgba(124, 58, 237, 0.2);
      color: #a78bfa;
      border-radius: 999px;
      font-size: 0.75rem;
      cursor: pointer;
      transition: all 150ms ease;
      font-family: var(--font-body);

      &:hover:not(:disabled) {
        background: rgba(124, 58, 237, 0.15);
        border-color: rgba(124, 58, 237, 0.4);
      }

      &:disabled { opacity: 0.5; cursor: not-allowed; }
    }

    .toggle-btn {
      background: none;
      border: none;
      color: var(--text-muted);
      cursor: pointer;
      padding: 0.25rem;
      border-radius: 4px;
      transition: all 150ms ease;
      flex-shrink: 0;

      &:hover { color: var(--text-primary); }

      svg { transition: transform 300ms ease; }
      svg.rotated { transform: rotate(180deg); }
    }

    // Messages
    .messages-panel {
      height: 320px;
      overflow-y: auto;
      padding: 1rem;
      display: flex;
      flex-direction: column;
      gap: 0.875rem;
    }

    .empty-chat {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      gap: 0.75rem;
      padding: 1.5rem;
    }

    .empty-title {
      font-size: 1.125rem;
      font-weight: 600;
      color: var(--text-primary);
      letter-spacing: -0.01em;
      margin: 0;
    }

    .empty-subtitle {
      font-size: 0.875rem;
      color: var(--text-secondary);
      line-height: 1.6;
      max-width: 400px;
      margin: 0;

      strong { color: var(--accent-primary); }
    }

    // Message bubbles
    .message {
      display: flex;
      gap: 0.625rem;
      align-items: flex-start;

      &.user {
        flex-direction: row-reverse;

        .msg-bubble {
          background: rgba(124, 58, 237, 0.15);
          border: 1px solid rgba(124, 58, 237, 0.2);
          border-bottom-right-radius: 4px;
        }
      }

      &.assistant {
        .msg-bubble {
          background: var(--bg-surface);
          border: 1px solid var(--border-subtle);
          border-bottom-left-radius: 4px;
        }
      }
    }

    // Fixed intro message
    .fixed-intro-wrapper {
      display: flex;
      flex-direction: column;
      flex: 1;
    }

    .fixed-intro-label {
      display: flex;
      align-items: center;
      gap: 0.25rem;
      font-size: 0.6875rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      color: var(--accent-primary);
      margin-bottom: 0.375rem;
      opacity: 0.8;

      svg { flex-shrink: 0; }
    }

    .msg-bubble.fixed {
      background: rgba(139, 92, 246, 0.06);
      border: 1px solid rgba(139, 92, 246, 0.15);
      border-bottom-left-radius: 12px;
      max-width: 90%;
    }

    .msg-avatar {
      flex-shrink: 0;
    }

    .msg-user-avatar {
      width: 28px;
      height: 28px;
      border-radius: 50%;
      background: var(--accent-primary);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.75rem;
      font-weight: 700;
      color: white;
      flex-shrink: 0;
    }

    .msg-bubble {
      max-width: 70%;
      padding: 0.625rem 0.875rem;
      border-radius: 12px;
      font-size: 0.875rem;
      line-height: 1.6;
      color: var(--text-secondary);
    }

    .msg-content {
      // Markdown-rendered content styling
      :global(code) {
        font-family: var(--font-mono);
        background: rgba(0,0,0,0.3);
        padding: 0.1em 0.3em;
        border-radius: 3px;
        font-size: 0.875em;
        color: var(--accent-code);
      }

      :global(pre) {
        background: rgba(0,0,0,0.3);
        padding: 0.75rem;
        border-radius: 6px;
        overflow-x: auto;
        margin: 0.5rem 0;

        :global(code) { background: none; padding: 0; }
      }

      :global(strong) { color: var(--text-primary); font-weight: 600; }
      :global(p) { margin: 0 0 0.5rem; &:last-child { margin-bottom: 0; } }
    }

    .typing-cursor {
      animation: blink 1s step-end infinite;
      color: var(--accent-primary);
    }

    @keyframes blink {
      0%, 100% { opacity: 1; }
      50% { opacity: 0; }
    }

    .typing-dots {
      display: flex;
      gap: 4px;
      padding: 4px 0;

      span {
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background: var(--text-muted);
        animation: dotBounce 1.2s ease-in-out infinite;

        &:nth-child(2) { animation-delay: 0.2s; }
        &:nth-child(3) { animation-delay: 0.4s; }
      }
    }

    @keyframes dotBounce {
      0%, 80%, 100% { transform: translateY(0); opacity: 0.5; }
      40% { transform: translateY(-6px); opacity: 1; }
    }

    // Input area
    .chat-input-area {
      display: flex;
      align-items: stretch;
      gap: 0.5rem;
      padding: 0.625rem 1rem;
      border-top: 1px solid var(--border);
      background: var(--bg-elevated);
      flex-shrink: 0;
    }

    .chat-input {
      flex: 1;
      background: var(--bg-surface);
      border: 1px solid var(--border-subtle);
      color: var(--text-primary);
      border-radius: 8px;
      padding: 0.5rem 0.75rem;
      font-size: 0.875rem;
      font-family: var(--font-body);
      resize: none;
      line-height: 1.5;
      transition: border-color 200ms ease;

      &::placeholder { color: var(--text-muted); }

      &:focus {
        outline: none;
        border-color: var(--accent-primary);
      }

      &:disabled { opacity: 0.5; }
    }

    .send-btn {
      width: 38px;
      background: var(--accent-primary);
      border: none;
      border-radius: 8px;
      color: white;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      transition: all 150ms ease;
      align-self: stretch;

      &:hover:not(:disabled) {
        background: #6d28d9;
        transform: translateY(-1px);
      }

      &:disabled { opacity: 0.5; cursor: not-allowed; }
    }

    .mini-spinner {
      width: 14px;
      height: 14px;
      border: 2px solid rgba(255,255,255,0.3);
      border-top-color: white;
      border-radius: 50%;
      animation: spin 0.7s linear infinite;
    }

    @keyframes spin { to { transform: rotate(360deg); } }
  `],
})
export class ChatTutorComponent implements AfterViewChecked {
  @ViewChild('messagesContainer') private messagesContainer?: ElementRef<HTMLDivElement>;

  private readonly aiTutor = inject(AiTutorService);
  private readonly progressService = inject(LessonProgressService);
  private readonly destroyRef = inject(DestroyRef);

  readonly lesson = input<Lesson | null>(null);
  readonly currentCode = input('');
  readonly isOpen = input(true);
  readonly toggle = output();

  readonly messages = signal<ChatMessage[]>([]);
  readonly inputValue = signal('');
  readonly isStreaming = signal(false);
  readonly streamingContent = signal('');

  readonly userName = computed(() => this.progressService.userName());
  readonly userInitial = computed(() => this.userName().charAt(0).toUpperCase() || 'U');
  readonly lessonTitle = computed(() => this.lesson()?.title ?? 'Angular');
  readonly suggestedQuestions = computed(() => this.lesson()?.suggestedQuestions?.slice(0, 3) ?? []);
  readonly canSend = computed(() => this.inputValue().trim().length > 0 && !this.isStreaming());

  private shouldScrollToBottom = false;

  constructor() {
    // Cuando cambia la lección, cargar historial o mostrar intro fijo
    effect(() => {
      const lesson = this.lesson();
      if (!lesson) return;

      const savedHistory = this.progressService.getChatHistory(lesson.id);
      if (savedHistory && savedHistory.length > 0) {
        this.messages.set(savedHistory);
        return;
      }

      if (lesson.introMessage) {
        this.messages.set([{
          id: `intro-${lesson.id}`,
          role: 'assistant',
          content: lesson.introMessage,
          timestamp: new Date(),
          isFixed: true,
        }]);
      } else {
        this.messages.set([]);
      }
    });
  }

  ngAfterViewChecked(): void {
    if (this.shouldScrollToBottom) {
      this.scrollToBottom();
      this.shouldScrollToBottom = false;
    }
  }

  prefillInput(text: string): void {
    this.inputValue.set(text);
  }

  handleEnterKey(event: Event): void {
    const ke = event as KeyboardEvent;
    if (!ke.shiftKey) {
      ke.preventDefault();
      this.sendMessage();
    }
  }

  sendMessage(): void {
    if (!this.canSend()) return;

    const userContent = this.inputValue().trim();
    this.inputValue.set('');

    const userMsg: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content: userContent,
      timestamp: new Date(),
    };

    this.messages.update(msgs => [...msgs, userMsg]);
    this.isStreaming.set(true);
    this.streamingContent.set('');
    this.shouldScrollToBottom = true;

    const assistantId = crypto.randomUUID();
    let accumulatedContent = '';

    const lesson = this.lesson();
    const context = {
      lessonId: lesson?.id ?? '',
      lessonTitle: lesson?.title ?? 'Angular',
      moduleTitle: lesson?.moduleTitle ?? '',
      currentCode: this.currentCode(),
      userLevel: this.progressService.userLevel(),
      userName: this.userName(),
      chatHistory: this.messages().slice(-10),
      aiContext: lesson?.aiContext ?? '',
    };

    const sub = this.aiTutor.streamResponse(userContent, context).subscribe({
      next: (token: string) => {
        accumulatedContent += token;
        this.streamingContent.set(accumulatedContent);

        this.messages.update(msgs => {
          const existing = msgs.find(m => m.id === assistantId);
          if (existing) {
            return msgs.map(m =>
              m.id === assistantId
                ? { ...m, content: accumulatedContent, isStreaming: true }
                : m
            );
          } else {
            return [
              ...msgs,
              {
                id: assistantId,
                role: 'assistant' as const,
                content: accumulatedContent,
                timestamp: new Date(),
                isStreaming: true,
              },
            ];
          }
        });

        this.shouldScrollToBottom = true;
      },
      error: (err: unknown) => {
        const errorMsg = err instanceof Error ? err.message : 'Error de conexión con Ngbot';
        this.messages.update(msgs => [
          ...msgs,
          {
            id: assistantId,
            role: 'assistant' as const,
            content: `Lo siento, tuve un problema al conectarme: ${errorMsg}. Verifica tu API key en environment.ts.`,
            timestamp: new Date(),
            isStreaming: false,
          },
        ]);
        this.isStreaming.set(false);
        this.shouldScrollToBottom = true;
      },
      complete: () => {
        this.messages.update(msgs =>
          msgs.map(m =>
            m.id === assistantId ? { ...m, isStreaming: false } : m
          )
        );
        this.isStreaming.set(false);
        this.streamingContent.set('');
        this.shouldScrollToBottom = true;

        if (lesson) {
          this.progressService.saveChatHistory(lesson.id, this.messages());
        }
      },
    });

    this.destroyRef.onDestroy(() => sub.unsubscribe());
  }

  getInputValue(event: Event): string {
    return (event.target as HTMLTextAreaElement).value;
  }

  renderMarkdown(content: string): string {
    return content
      .replace(/```(\w+)?\n([\s\S]*?)```/g, '<pre><code>$2</code></pre>')
      .replace(/`([^`]+)`/g, '<code>$1</code>')
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.+?)\*/g, '<em>$1</em>')
      .replace(/\n\n/g, '</p><p>')
      .replace(/^/, '<p>')
      .replace(/$/, '</p>');
  }

  private scrollToBottom(): void {
    const el = this.messagesContainer?.nativeElement;
    if (el) {
      el.scrollTop = el.scrollHeight;
    }
  }
}
