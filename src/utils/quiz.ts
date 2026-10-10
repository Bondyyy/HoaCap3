import type { Question } from "../types";
export const normalize = (s: string) =>
  s
    .trim()
    .normalize("NFC")
    .toLocaleLowerCase("vi")
    .replace(/[–—−]/g, "-")
    .replace(/\s+/g, " ");
export function correct(q: Question, answer: string) {
  const a = normalize(answer);
  const b = normalize(q.correctAnswer);
  if (q.type === "order") return a.replace(/\s*-\s*/g, "-") === b.toLowerCase();
  if (q.type === "fill" && /^\d+$/.test(b))
    return (
      /^\d+(?:[.,]0+)?$/.test(a) && Number(a.replace(",", ".")) === Number(b)
    );
  return a === b;
}
export function grade(qs: Question[], answers: Record<string, string>) {
  const count = qs.filter((q) => correct(q, answers[q.id] ?? "")).length;
  const total = qs.reduce((n, q) => n + q.points, 0);
  const earned = qs.reduce(
    (n, q) => n + (correct(q, answers[q.id] ?? "") ? q.points : 0),
    0,
  );
  return {
    correctCount: count,
    totalQuestions: qs.length,
    score: total ? Math.round((earned / total) * 100) / 10 : 0,
  };
}
export function shuffle<T>(items: T[]) {
  const a = [...items];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function selectQuestions(
  bank: Question[],
  chapter: string,
  difficulty: string,
  count: number,
  mode: string,
) {
  const pool = bank.filter(
    (q) =>
      (chapter === "all" || q.chapter === chapter) &&
      (difficulty === "all" || q.difficulty === difficulty),
  );
  return (mode === "random" ? shuffle(pool) : pool).slice(
    0,
    Math.max(0, Number.isFinite(count) ? Math.floor(count) : 0),
  );
}
