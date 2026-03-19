export type NarrativeBlockType = 'text' | 'diagram' | 'tip' | 'comparison' | 'checkpoint' | 'code';

export interface TextBlock {
  type: 'text';
  content: string;
}

export interface DiagramBlock {
  type: 'diagram';
  svgId: string;
  animated: boolean;
  caption?: string;
}

export interface TipBlock {
  type: 'tip';
  variant: 'info' | 'warning' | 'success' | 'angular';
  content: string;
}

export interface ComparisonBlock {
  type: 'comparison';
  left: string;
  right: string;
  leftLabel: string;
  rightLabel: string;
}

export interface CheckpointBlock {
  type: 'checkpoint';
  question: string;
  options: string[];
  correct: number;
  explanation: string;
}

export interface CodeBlock {
  type: 'code';
  content: string;
  language: string;
  filename?: string;
}

export type NarrativeBlock =
  | TextBlock
  | DiagramBlock
  | TipBlock
  | ComparisonBlock
  | CheckpointBlock
  | CodeBlock;

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
}

export interface Lesson {
  id: string;
  module: number;
  moduleTitle: string;
  title: string;
  subtitle: string;
  estimatedMinutes: number;
  narrative: NarrativeBlock[];
  starterCode: string;
  solutionCode: string;
  language: 'typescript' | 'html' | 'scss';
  aiContext: string;
  introMessage: string; // Texto fijo de introducción mostrado al cargar la lección (no generado por IA)
  suggestedQuestions: string[];
  prerequisites: string[];
  nextLesson: string | null;
  xpReward: number;
  achievements?: Achievement[];
  previewHtml?: string;
}
