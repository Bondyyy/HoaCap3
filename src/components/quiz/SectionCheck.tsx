import { applications, sectionQuestionIds } from "../../data/sectionChecks";
import { useState } from "react";
import { questions } from "../../data/questions";
import { correct } from "../../utils/quiz";
import type { Lesson } from "../../types";
export default function SectionCheck({
  lesson,
  index,
}: {
  lesson: Lesson;
  index: number;
}) {
  const available =
    lesson.id === "applications"
      ? applications
      : questions.filter(
          (q) =>
            q.chapter === lesson.chapter &&
            q.lessonId === lesson.id &&
            q.type !== "order",
        );
  const q =
    questions.find((q) => q.id === sectionQuestionIds[lesson.id]?.[index]) ??
    available[Math.min(index, available.length - 1)];
  const [value, setValue] = useState(""),
    [submitted, setSubmitted] = useState(false);
  if (!q) return null;
  return (
    <div className="section-check">
      <span className="eyebrow">DỪNG LẠI MỘT CHÚT</span>
      <h4>{q.question}</h4>
      {q.type === "fill" ? (
        <label>
          Đáp án
          <input
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
              setSubmitted(false);
            }}
          />
        </label>
      ) : (
        <div className="field-row">
          {q.options!.map((o) => (
            <button
              className={`btn ${value === o ? "primary" : ""}`}
              key={o}
              onClick={() => {
                setValue(o);
                setSubmitted(false);
              }}
            >
              {o}
            </button>
          ))}
        </div>
      )}
      <button
        className="text-link"
        disabled={!value}
        onClick={() => setSubmitted(true)}
      >
        Kiểm tra đáp án →
      </button>
      {submitted && (
        <p className={correct(q, value) ? "success" : "error"}>
          {correct(q, value) ? "Chính xác. " : "Chưa đúng. "}
          {q.explanation}
        </p>
      )}
    </div>
  );
}
