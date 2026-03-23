import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import type { ChatMessage } from '../models/chat-message.model';
import type { UserLevel } from '../models/user-profile.model';

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

const MODELS = [
  'llama-3.3-70b-versatile',
  'llama-3.1-8b-instant',
  'gemma2-9b-it',
];

export interface LessonContext {
  lessonId: string;
  lessonTitle: string;
  moduleTitle: string;
  currentCode: string;
  userLevel: UserLevel;
  userName: string;
  chatHistory: ChatMessage[];
  aiContext: string;
}

interface ChatApiMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

@Injectable({ providedIn: 'root' })
export class AiTutorService {
  private currentModelIndex = 0;

  buildSystemPrompt(context: LessonContext): string {
    const levelDesc = {
      beginner: 'principiante absoluto en programación y Angular',
      intermediate: 'desarrollador con algo de experiencia en JavaScript/TypeScript',
      developer: 'desarrollador web con experiencia que está aprendiendo Angular',
    }[context.userLevel];

    return `Eres Ngbot, el asistente de aprendizaje de AngularVerse.

CONTEXTO: El usuario está en ${context.moduleTitle}: "${context.lessonTitle}".
La introducción de la lección ya fue mostrada automáticamente.
Nivel del usuario: ${levelDesc}. Nombre: ${context.userName}.

TU ROL: Responder ÚNICAMENTE preguntas del usuario sobre esta lección y Angular en general.
NO vuelvas a explicar la lección desde cero — ya está explicada.
NO des bienvenidas ni introducciones — ve directo a responder.

REGLAS:
1. Solo respondes sobre Angular, TypeScript, RxJS, HTML/CSS en contexto Angular.
2. Incluye ejemplos de código cuando sean útiles. Usa bloques \`\`\`typescript.
3. Adapta la profundidad al nivel del usuario.
4. Si hay un error en el código del editor, explica el POR QUÉ y cómo corregirlo.
5. Máximo 350 palabras. Sé denso y útil.
6. Si preguntan sobre lecciones futuras: preview breve + "lo veremos en Módulo X".
7. Tono: directo, amigable, sin condescendencia.

Código actual en el editor:
\`\`\`
${context.currentCode || '(sin código en el editor)'}
\`\`\`

Contexto adicional de la lección:
${context.aiContext}`;
  }

  streamResponse(userMessage: string, context: LessonContext): Observable<string> {
    return new Observable<string>(subscriber => {
      const history = context.chatHistory.slice(-10);
      const messages: ChatApiMessage[] = [
        { role: 'system', content: this.buildSystemPrompt(context) },
        ...history.map(m => ({ role: m.role as 'user' | 'assistant', content: m.content })),
        { role: 'user', content: userMessage },
      ];

      this.fetchStream(messages, subscriber, 0);
    });
  }

  private fetchStream(
    messages: ChatApiMessage[],
    subscriber: { next: (v: string) => void; error: (e: unknown) => void; complete: () => void },
    attempt: number
  ): void {
    if (attempt >= MODELS.length) {
      subscriber.error(new Error('Todos los modelos están temporalmente no disponibles. Inténtalo de nuevo.'));
      return;
    }

    const model = MODELS[(this.currentModelIndex + attempt) % MODELS.length];

    fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${environment.groqApiKey}`,
      },
      body: JSON.stringify({
        model,
        messages,
        stream: true,
        max_tokens: 1024,
        temperature: 0.7,
      }),
    })
      .then(async response => {
        if (!response.ok || !response.body) {
          // 401 = bad key, no point retrying other models
          if (response.status === 401) {
            subscriber.error(new Error('API key inválida.'));
            return;
          }
          this.fetchStream(messages, subscriber, attempt + 1);
          return;
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';

        const read = async (): Promise<void> => {
          const { done, value } = await reader.read();
          if (done) {
            subscriber.complete();
            return;
          }

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          buffer = lines.pop() ?? '';

          for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed || trimmed === 'data: [DONE]') continue;
            if (!trimmed.startsWith('data: ')) continue;

            try {
              const json = JSON.parse(trimmed.slice(6)) as {
                choices?: Array<{ delta?: { content?: string } }>;
              };
              const token = json.choices?.[0]?.delta?.content;
              if (token) {
                subscriber.next(token);
              }
            } catch {
              // Skip malformed SSE lines
            }
          }

          return read();
        };

        await read();
      })
      .catch(() => {
        this.fetchStream(messages, subscriber, attempt + 1);
      });
  }

  rotateModel(): void {
    this.currentModelIndex = (this.currentModelIndex + 1) % MODELS.length;
  }
}
