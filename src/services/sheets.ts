import type { Attempt, User } from "../types";
import { saveAttempt } from "./storage";
export const endpoint = import.meta.env.VITE_APPS_SCRIPT_URL?.trim() || "";
const active = new Set<string>();
export async function syncAttempt(a: Attempt, user: User, url = endpoint) {
  if (a.syncStatus === "synced" || active.has(a.attemptId)) return;
  if (!url) {
    saveAttempt({ ...a, syncError: "Chưa cấu hình URL Apps Script." });
    return;
  }
  if (!/^https:\/\/script\.google\.com\/macros\/s\/[\w-]+\/exec$/.test(url)) {
    saveAttempt({ ...a, syncError: "URL Apps Script không hợp lệ." });
    return;
  }
  active.add(a.attemptId);
  try {
    const response = await fetch(url, {
      method: "POST",
      redirect: "follow",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify({
        submissionId: a.attemptId,
        userId: user.id,
        fullName: user.fullName,
        username: user.username,
        quizId: a.quizId,
        chapter: a.chapter,
        correctCount: a.correctCount,
        totalQuestions: a.totalQuestions,
        score: a.score,
        durationSeconds: a.durationSeconds,
        submittedAt: a.submittedAt,
      }),
      signal: AbortSignal.timeout(15000),
    });
    if (!response.ok) throw Error("Máy chủ chưa xác nhận.");
    if (response.url?.includes("accounts.google.com") || response.headers?.get("content-type")?.includes("text/html"))
      throw Error("Apps Script trả trang đăng nhập/HTML. Kiểm tra quyền Web App: Execute as Me, Who has access Anyone và URL /exec.");
    const body = await response.json();
    if (body.ok === false && typeof body.error === "string")
      throw Error(`Apps Script: ${body.error.slice(0, 240)}`);
    if (body.ok !== true || body.submissionId !== a.attemptId)
      throw Error("Phản hồi không xác nhận đúng bài làm.");
    saveAttempt({ ...a, syncStatus: "synced", syncError: undefined });
  } catch (e) {
    saveAttempt({
      ...a,
      syncStatus: "pending",
      syncError: `Chưa xác nhận đồng bộ: ${e instanceof Error ? e.message : "lỗi mạng/CORS"}. Có thể thử lại; không xóa bài làm.`,
    });
  } finally {
    active.delete(a.attemptId);
  }
}
