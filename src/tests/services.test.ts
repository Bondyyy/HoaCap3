// @vitest-environment jsdom
import { beforeEach, afterEach, describe, it, expect, vi } from "vitest";
import { webcrypto } from "node:crypto";
import {
  users,
  currentUser,
  progress,
  visit,
  attempts,
  saveAttempt,
  read,
  write,
} from "../services/storage";
import { register, login, logout } from "../services/auth";
import { syncAttempt } from "../services/sheets";
import type { Attempt } from "../types";
beforeEach(() => {
  localStorage.clear();
  vi.stubGlobal("crypto", webcrypto);
});
afterEach(() => vi.unstubAllGlobals());
const make = (userId: string, id = "attempt1"): Attempt => ({
  attemptId: id,
  userId,
  quizId: "quiz",
  chapter: "all",
  questionIds: ["amino-1"],
  answers: { "amino-1": "NH₂ và COOH" },
  correctCount: 1,
  totalQuestions: 1,
  score: 10,
  durationSeconds: 12,
  submittedAt: new Date().toISOString(),
  syncStatus: "pending",
});
describe("accounts and storage", () => {
  it("register/login persist verifier only, duplicate and wrong password fail", async () => {
    await register("Người thử", "tester", "test-only-123", "test-only-123");
    const u = users()[0];
    expect(u.passwordSalt).toHaveLength(32);
    expect(u.passwordVerifier).toHaveLength(64);
    expect(JSON.stringify(u)).not.toContain("test-only-123");
    await expect(
      register("Khác", "TESTER", "test-only-123", "test-only-123"),
    ).rejects.toThrow("tồn tại");
    await expect(login("tester", "incorrect")).rejects.toThrow("không đúng");
    await login("TESTER", "test-only-123");
    expect(currentUser()?.id).toBe(u.id);
    logout();
    expect(currentUser()).toBeNull();
  });
  it("rejects malformed registration input and mismatching passwords", async () => {
    await expect(
      register("A", "okname", "test-only-123", "test-only-123"),
    ).rejects.toThrow();
    await expect(
      register("Name", "x!", "test-only-123", "test-only-123"),
    ).rejects.toThrow();
    await expect(
      register("Name", "okname", "short", "short"),
    ).rejects.toThrow();
    await expect(
      register("Name", "okname", "password1", "password2"),
    ).rejects.toThrow();
  });
  it("isolates progress and attempts, preserves history", () => {
    visit("u1", "amino/concept");
    visit("u1", "amino/concept", true);
    visit("u1", "amino/concept");
    expect(progress("u1")[0].completed).toBe(true);
    expect(progress("u2")).toEqual([]);
    saveAttempt(make("u1", "a1"));
    saveAttempt(make("u1", "a2"));
    saveAttempt(make("u2", "a3"));
    expect(attempts("u1").map((a) => a.attemptId)).toEqual(["a1", "a2"]);
    expect(attempts("u2")).toHaveLength(1);
    saveAttempt({ ...make("u1", "a1"), syncStatus: "synced" });
    expect(attempts("u1")).toHaveLength(2);
  });
  it("survives missing, deleted, malformed and invalid-schema localStorage", () => {
    localStorage.setItem("aminolab.v1.users", "{bad");
    expect(users()).toEqual([]);
    write("users", [{ id: "bad" }]);
    expect(users()).toEqual([]);
    write("session", { currentUserId: "missing" });
    expect(currentUser()).toBeNull();
    write("progress.u1", [{ userId: "u2" }]);
    expect(progress("u1")).toEqual([]);
    write("attempts.u1", [{ ...make("u1"), answers: null }]);
    expect(attempts("u1")).toEqual([]);
    localStorage.clear();
    expect(currentUser()).toBeNull();
    expect(attempts("u1")).toEqual([]);
    expect(read("missing", [])).toEqual([]);
  });
  it("reports write failures instead of claiming saved", () => {
    const spy = vi
      .spyOn(Storage.prototype, "setItem")
      .mockImplementation(() => {
        throw Error("quota");
      });
    expect(() => write("test", {})).toThrow("Không thể lưu");
    spy.mockRestore();
  });
});
describe("Sheets acknowledgements (mock network, not live CORS verification)", () => {
  const user = {
      id: "u1",
      fullName: "Test",
      username: "test",
      passwordSalt: "",
      passwordVerifier: "",
      createdAt: "",
    },
    url = "https://script.google.com/macros/s/test/exec";
  it("marks synced only after matching success acknowledgement", async () => {
    const a = make("u1");
    saveAttempt(a);
    const fetcher = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ ok: true, submissionId: a.attemptId }),
    });
    vi.stubGlobal("fetch", fetcher);
    await syncAttempt(a, user, url);
    expect(attempts("u1")[0].syncStatus).toBe("synced");
    expect(fetcher.mock.calls[0][1].headers["Content-Type"]).toBe(
      "text/plain;charset=utf-8",
    );
    expect(fetcher.mock.calls[0][1].body).not.toContain("passwordVerifier");
  });
  it.each(["network", "wrong-id", "server-rejected", "opaque"])(
    "keeps local result pending for %s",
    async (mode) => {
      const a = make("u1");
      saveAttempt(a);
      vi.stubGlobal(
        "fetch",
        mode === "network"
          ? vi.fn().mockRejectedValue(new TypeError("Failed to fetch"))
          : vi.fn().mockResolvedValue({
              ok: mode !== "opaque",
              json: async () =>
                mode === "wrong-id"
                  ? { ok: true, submissionId: "other" }
                  : { ok: false },
            }),
      );
      await syncAttempt(a, user, url);
      expect(attempts("u1")[0].syncStatus).toBe("pending");
      expect(attempts("u1")[0].score).toBe(10);
      expect(attempts("u1")[0].syncError).toBeTruthy();
    },
  );
  it("missing endpoint queues locally, confirmed result is not resent", async () => {
    const a = make("u1");
    saveAttempt(a);
    const fetcher = vi.fn();
    vi.stubGlobal("fetch", fetcher);
    await syncAttempt(a, user, "");
    expect(attempts("u1")[0].syncStatus).toBe("pending");
    await syncAttempt({ ...a, syncStatus: "synced" }, user, url);
    expect(fetcher).not.toHaveBeenCalled();
  });
  it("explains a Google sign-in HTML response while retaining the attempt", async () => {
    const a = make("u1"); saveAttempt(a);
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ok:true,url:"https://accounts.google.com/signin",headers:new Headers({"content-type":"text/html"})}));
    await syncAttempt(a,user,url);
    expect(attempts("u1")[0].syncStatus).toBe("pending");
    expect(attempts("u1")[0].syncError).toContain("Who has access Anyone");
  });
  it("surfaces a server configuration error", async () => {
    const a=make("u1"); saveAttempt(a);
    vi.stubGlobal("fetch",vi.fn().mockResolvedValue({ok:true,json:async()=>({ok:false,error:"Missing SPREADSHEET_ID"})}));
    await syncAttempt(a,user,url);
    expect(attempts("u1")[0].syncError).toContain("Missing SPREADSHEET_ID");
    expect(attempts("u1")[0].syncStatus).toBe("pending");
  });
  it("retries the same submission after failure without duplicating local history", async () => {
    const a = make("u1");
    saveAttempt(a);
    const fetcher = vi
      .fn()
      .mockRejectedValueOnce(new TypeError("offline"))
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ ok: true, submissionId: a.attemptId }),
      });
    vi.stubGlobal("fetch", fetcher);
    await syncAttempt(a, user, url);
    await syncAttempt(attempts("u1")[0], user, url);
    expect(attempts("u1")).toHaveLength(1);
    expect(attempts("u1")[0].syncStatus).toBe("synced");
    const payloads = fetcher.mock.calls.map((call) => JSON.parse(call[1].body));
    expect(payloads[0]).toEqual(payloads[1]);
    expect(payloads[0]).toMatchObject({
      submissionId: a.attemptId,
      userId: "u1",
      score: 10,
      correctCount: 1,
      totalQuestions: 1,
      durationSeconds: 12,
    });
  });
});
