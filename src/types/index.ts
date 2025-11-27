export interface Card {
  id: string;
  question: string;
  correctAnswer: string;
}

export interface CardState extends Card {
  attemptsNeeded: number; // 0 = completed, 1-3 = needs correct answers
  correctStreak: number; // current streak of correct answers
}

export interface GameState {
  cards: CardState[];
  currentCardIndex: number;
  isComplete: boolean;
}

export interface AnswerValidationRequest {
  userAnswer: string;
  correctAnswer: string;
}

export interface AnswerValidationResponse {
  isCorrect: boolean;
  explanation?: string;
}

export interface VoiceTranscriptionRequest {
  audioBlob: Blob;
}

export interface VoiceTranscriptionResponse {
  text: string;
}

export type FeedbackType = 'correct' | 'incorrect' | null;
