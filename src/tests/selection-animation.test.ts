import { expect, it, vi } from "vitest";
import { questions } from "../data/questions";
import { selectQuestions } from "../utils/quiz";
import { advanceProgress, segmentProgress } from "../utils/animation";

it.each(["amino", "peptide"])(
  "filters chapter %s and difficulty before limiting",
  (chapter) => {
    for (const difficulty of ["easy", "medium", "hard"]) {
      const selected = selectQuestions(
        questions,
        chapter,
        difficulty,
        5,
        "fixed",
      );
      expect(selected.length).toBeGreaterThan(0);
      expect(selected.length).toBeLessThanOrEqual(5);
      expect(
        selected.every(
          (q) => q.chapter === chapter && q.difficulty === difficulty,
        ),
      ).toBe(true);
    }
  },
);
it("fixed order, empty pools and oversized requests are deterministic", () => {
  expect(selectQuestions(questions, "all", "all", 5, "fixed")).toEqual(
    questions.slice(0, 5),
  );
  expect(selectQuestions(questions, "all", "all", 100, "fixed")).toHaveLength(
    64,
  );
  expect(selectQuestions(questions, "missing", "all", 10, "fixed")).toEqual([]);
  expect(selectQuestions(questions, "all", "all", NaN, "fixed")).toEqual([]);
});
it("random selection has no duplicates and never mutates the bank", () => {
  const before = questions.map((q) => q.id);
  const random = vi.spyOn(Math, "random").mockReturnValue(0.17);
  try {
    const selected = selectQuestions(questions, "all", "all", 20, "random");
    expect(selected).toHaveLength(20);
    expect(new Set(selected.map((q) => q.id)).size).toBe(20);
    expect(selected.map((q) => q.id)).not.toEqual(before.slice(0, 20));
    expect(questions.map((q) => q.id)).toEqual(before);
  } finally {
    random.mockRestore();
  }
});
it("animation speed, end clamp and segment order remain deterministic", () => {
  expect(advanceProgress(0.2, 1000, 10000, 2)).toBeCloseTo(0.4);
  expect(advanceProgress(0.9, 5000, 10000, 1)).toBe(1);
  expect(advanceProgress(0.2, -100, 10000, 1)).toBe(0.2);
  expect(() => advanceProgress(0, 100, 0, 1)).toThrow();
  expect(segmentProgress(0.1, 0, 3)).toBe(0);
  expect(segmentProgress(0.5, 0, 3)).toBe(1);
  expect(segmentProgress(0.5, 2, 3)).toBe(0);
  expect(segmentProgress(1, 2, 3)).toBe(1);
});
