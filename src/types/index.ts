export type Chapter = "amino" | "peptide";
export interface AminoAcid {
  id: string;
  name: string;
  formula: string;
  molecular: string;
  r: string;
  mass: number;
  amino: number;
  carboxyl: number;
  pi?: number;
  systematic: string;
  semi: string;
}
export interface Section {
  title: string;
  text: string;
  formula?: string;
  note?: string;
}
export interface Lesson {
  id: string;
  chapter: Chapter;
  title: string;
  minutes: number;
  sections: Section[];
  labs: string[];
  source: string;
  check: {
    question: string;
    options: string[];
    answer: number;
    explanation: string;
  };
}
export interface Reaction {
  id: string;
  name: string;
  goal: string;
  reactants: string[];
  products: string[];
  conditions: string;
  equation: string;
  steps: string[];
  observations: string;
  explanation: string;
  variations: string[];
  sourceReference: string;
  validationStatus: "reviewed";
}
export interface Question {
  id: string;
  chapter: Chapter;
  lessonId: string;
  type: "choice" | "boolean" | "fill" | "order";
  difficulty: "easy" | "medium" | "hard";
  question: string;
  options?: string[];
  correctAnswer: string;
  explanation: string;
  points: number;
  sourceReference: string;
}
export interface User {
  id: string;
  fullName: string;
  username: string;
  passwordSalt: string;
  passwordVerifier: string;
  createdAt: string;
}
export interface Attempt {
  attemptId: string;
  userId: string;
  quizId: string;
  chapter: string;
  questionIds: string[];
  answers: Record<string, string>;
  correctCount: number;
  totalQuestions: number;
  score: number;
  durationSeconds: number;
  submittedAt: string;
  syncStatus: "pending" | "synced";
  syncError?: string;
}
export interface Progress {
  userId: string;
  lessonId: string;
  completed: boolean;
  lastVisitedAt: string;
  progressPercentage: number;
}
