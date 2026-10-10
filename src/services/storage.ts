import type { Attempt, Progress, User } from "../types";
const prefix = "aminolab.v1.";
let warning = "";
export const storageWarning = () => warning;
export function read<T>(
  key: string,
  fallback: T,
  valid?: (x: unknown) => boolean,
): T {
  try {
    const raw = localStorage.getItem(prefix + key);
    if (!raw) return fallback;
    const value: unknown = JSON.parse(raw);
    if (valid && !valid(value)) throw Error("schema");
    return value as T;
  } catch {
    warning =
      "Dữ liệu cục bộ không hợp lệ. Mục bị lỗi được bỏ qua; các dữ liệu khác vẫn được giữ.";
    return fallback;
  }
}
export function write(key: string, value: unknown) {
  try {
    localStorage.setItem(prefix + key, JSON.stringify(value));
    window.dispatchEvent(new Event("amino-data"));
  } catch {
    throw Error(
      "Không thể lưu trên trình duyệt. Hãy kiểm tra dung lượng hoặc quyền lưu trữ.",
    );
  }
}
const record = (x: unknown): x is Record<string, unknown> =>
  !!x && typeof x === "object" && !Array.isArray(x);
const strings = (x: Record<string, unknown>, keys: string[]) =>
  keys.every((k) => typeof x[k] === "string");
export function users() {
  return read<User[]>(
    "users",
    [],
    (x) =>
      Array.isArray(x) &&
      x.every(
        (u) =>
          record(u) &&
          strings(u, [
            "id",
            "username",
            "fullName",
            "passwordSalt",
            "passwordVerifier",
            "createdAt",
          ]) &&
          /^[a-f0-9]{32}$/.test(u.passwordSalt as string) &&
          /^[a-f0-9]{64}$/.test(u.passwordVerifier as string),
      ),
  );
}
export function currentUser() {
  const s = read<{ currentUserId: string }>(
    "session",
    { currentUserId: "" },
    (x) => record(x) && typeof x.currentUserId === "string",
  );
  return users().find((u) => u.id === s.currentUserId) ?? null;
}
export function attempts(userId: string) {
  return read<Attempt[]>(
    `attempts.${userId}`,
    [],
    (x) =>
      Array.isArray(x) &&
      x.every(
        (a) =>
          record(a) &&
          a.userId === userId &&
          strings(a, ["attemptId", "quizId", "chapter", "submittedAt"]) &&
          Array.isArray(a.questionIds) &&
          a.questionIds.every((q) => typeof q === "string") &&
          record(a.answers) &&
          Object.values(a.answers).every((v) => typeof v === "string") &&
          ["correctCount", "totalQuestions", "score", "durationSeconds"].every(
            (k) => typeof a[k] === "number" && Number.isFinite(a[k]),
          ) &&
          ["pending", "synced"].includes(a.syncStatus as string),
      ),
  );
}
export function saveAttempt(a: Attempt) {
  const all = attempts(a.userId);
  write(`attempts.${a.userId}`, [
    ...all.filter((x) => x.attemptId !== a.attemptId),
    a,
  ]);
}
export function progress(userId: string) {
  return read<Progress[]>(
    `progress.${userId}`,
    [],
    (x) =>
      Array.isArray(x) &&
      x.every(
        (p) =>
          record(p) &&
          p.userId === userId &&
          strings(p, ["lessonId", "lastVisitedAt"]) &&
          typeof p.completed === "boolean" &&
          typeof p.progressPercentage === "number" &&
          p.progressPercentage >= 0 &&
          p.progressPercentage <= 100,
      ),
  );
}
export function visit(userId: string, lessonId: string, complete = false) {
  const all = progress(userId);
  const previous = all.find((x) => x.lessonId === lessonId);
  const done = complete || previous?.completed || false;
  write(`progress.${userId}`, [
    ...all.filter((x) => x.lessonId !== lessonId),
    {
      userId,
      lessonId,
      completed: done,
      lastVisitedAt: new Date().toISOString(),
      progressPercentage: done ? 100 : 50,
    },
  ]);
}
