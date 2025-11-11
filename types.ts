export interface Question {
  question: string;
  options: { key: string; text: string }[];
  correct: string;
}

export interface WrongAnswer extends Question {
  userAnswer: string;
}

export type QuizStatus = 'PARSING' | 'READY' | 'ACTIVE' | 'FINISHED';

export interface Score {
  correct: number;
  wrong: number;
}
