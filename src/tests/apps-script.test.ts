import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import vm from "node:vm";
const source = readFileSync(
  new URL("../../google-apps-script/Code.gs", import.meta.url),
  "utf8",
);
const input = {
  submissionId: "12345678-1234-1234-1234-123456789012",
  userId: "12345678-1234-1234-1234-123456789013",
  fullName: '=IMPORTXML("bad")',
  username: "tester",
  quizId: "all_all_5_random_id",
  chapter: "all",
  correctCount: 4,
  totalQuestions: 5,
  score: 8,
  durationSeconds: 50,
  submittedAt: "2026-10-10T01:00:00.000Z",
};
function environment(spreadsheetId = "test-sheet-id") {
  const rows: unknown[][] = [];
  const sheet = {
    appendRow: (r: unknown[]) => rows.push(r),
    setFrozenRows: () => {},
    getLastRow: () => rows.length,
    getRange: () => ({
      createTextFinder: (id: string) => ({
        matchEntireCell: () => ({
          useRegularExpression: () => ({
            findNext: () => rows.find((r) => r[0] === id),
          }),
        }),
      }),
    }),
  };
  let exists = false;
  const ctx = vm.createContext({
    LockService: {
      getScriptLock: () => ({
        waitLock: () => {},
        hasLock: () => true,
        releaseLock: () => {},
      }),
    },
    SpreadsheetApp: {
      openById: (id: string) => {
        expect(id).toBe("test-sheet-id");
        return ({
        getSheetByName: () => (exists ? sheet : null),
        insertSheet: () => {
          exists = true;
          return sheet;
        },
      }); },
      flush: () => {},
    },
    PropertiesService: { getScriptProperties: () => ({ getProperty: (key: string) => key === "SPREADSHEET_ID" ? spreadsheetId : null }) },
    ContentService: {
      MimeType: { JSON: "json" },
      createTextOutput: (s: string) => ({ setMimeType: () => JSON.parse(s) }),
    },
  });
  vm.runInContext(source, ctx);
  return { ctx, rows };
}
describe("Apps Script validation and idempotency in a mocked Apps Script runtime", () => {
  it("returns an explicit configuration error when the Sheet ID is absent", () => {
    const {ctx, rows} = environment("");
    expect(ctx.doPost({postData:{contents:JSON.stringify(input)}})).toEqual({ok:false,error:"Missing SPREADSHEET_ID in Script Properties"});
    expect(rows).toHaveLength(0);
  });
  it("escapes formulas, stores once, acknowledges same ID on retry", () => {
    const { ctx, rows } = environment();
    const event = { postData: { contents: JSON.stringify(input) } };
    expect(ctx.doPost(event)).toEqual({
      ok: true,
      submissionId: input.submissionId,
    });
    expect(rows).toHaveLength(2);
    expect(rows[1][2]).toBe("'" + input.fullName);
    expect(ctx.doPost(event)).toEqual({
      ok: true,
      submissionId: input.submissionId,
      duplicate: true,
    });
    expect(rows).toHaveLength(2);
  });
  it.each([
    { score: 11 },
    { score: 9 },
    { totalQuestions: 65 },
    { correctCount: 6 },
    { username: "=bad" },
    { submissionId: "bad" },
    { submittedAt: "no-date" },
    { durationSeconds: -1 },
  ])("rejects invalid input %j", (changes) => {
    const { ctx, rows } = environment();
    expect(
      ctx.doPost({
        postData: { contents: JSON.stringify({ ...input, ...changes }) },
      }).ok,
    ).toBe(false);
    expect(rows).toHaveLength(0);
  });
});
