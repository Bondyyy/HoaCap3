import EditorialPhoto from "../components/chemistry/EditorialPhoto";
import LabArtwork from "../components/chemistry/LabArtwork";
import { useEffect, useState } from "react";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { ArrowRight, ArrowLeft, Check, Flag, Clock } from "lucide-react";
import { questions } from "../data/questions";
import { correct, grade, selectQuestions } from "../utils/quiz";
import { useUser } from "../hooks/useUser";
import { attempts, read, saveAttempt, write } from "../services/storage";
import { syncAttempt, endpoint } from "../services/sheets";
import type { Attempt, Question } from "../types";
export function Practice() {
  const [chapter, setChapter] = useState("all"),
    [difficulty, setDifficulty] = useState("all"),
    [count, setCount] = useState(10),
    [mode, setMode] = useState("random");
  const available = questions.filter(
    (q) =>
      (chapter === "all" || q.chapter === chapter) &&
      (difficulty === "all" || q.difficulty === difficulty),
  ).length;
  return (
    <div className="page practice-page">
      <div className="page-heading">
        <span className="eyebrow">CỦNG CỐ KIẾN THỨC</span>
        <h1>Hiểu đến đâu, luyện đến đó.</h1>
        <p>
          {questions.length} câu hỏi có giải thích · Lưu kết quả theo tài khoản
          · Không giới hạn số lần luyện.
        </p>
      </div>
      <div className="practice-layout">
        <section className="card practice-config">
          <h2>Thiết kế buổi luyện tập</h2>
          <label>
            Nội dung
            <select
              value={chapter}
              onChange={(e) => setChapter(e.target.value)}
            >
              <option value="all">Tổng hợp hai chương</option>
              <option value="amino">Amino Acid</option>
              <option value="peptide">Peptide</option>
            </select>
          </label>
          <label>
            Mức độ
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
            >
              <option value="all">Tất cả mức độ</option>
              <option value="easy">Dễ · Nhận biết</option>
              <option value="medium">Trung bình · Thông hiểu</option>
              <option value="hard">Khó · Vận dụng</option>
            </select>
          </label>
          <label>
            Hình thức
            <select value={mode} onChange={(e) => setMode(e.target.value)}>
              <option value="random">Luyện tập ngẫu nhiên</option>
              <option value="fixed">Bộ đề theo thứ tự ngân hàng</option>
            </select>
          </label>
          <label>
            Số câu
            <select value={count} onChange={(e) => setCount(+e.target.value)}>
              {[5, 10, 15, 20, 32, 64].map((n) => (
                <option key={n}>{n}</option>
              ))}
            </select>
          </label>
          <div className="quiz-summary">
            <span>{Math.min(count, available)} câu phù hợp</span>
            <span>
              <Clock size={15} /> Khoảng {Math.min(count, available) * 2} phút
            </span>
          </div>
          <Link
            className="btn primary large"
            to={`/practice/${chapter}_${difficulty}_${Math.min(count, available)}_${mode}_${crypto.randomUUID().slice(0, 8)}`}
          >
            Bắt đầu làm bài <ArrowRight size={17} />
          </Link>
          {count > available && (
            <p className="muted">
              Bộ lọc này có {available} câu; bài làm sẽ dùng toàn bộ số câu đó.
            </p>
          )}
        </section>
        <aside className="practice-aside">
          <div className="practice-image">
            <EditorialPhoto photo="laboratory" />
            <LabArtwork kind="achievement" />
          </div>
          <h2>
            Không chỉ biết đáp án.
            <br />
            Hiểu vì sao đúng.
          </h2>
          <p>Trắc nghiệm, đúng/sai, điền khuyết và sắp xếp gốc amino acid.</p>
          <ul>
            <li>Có thể chuyển qua lại giữa các câu.</li>
            <li>Câu chưa trả lời được đánh dấu rõ.</li>
            <li>Xem đáp án và lời giải sau khi nộp.</li>
            <li>Thời gian là bộ đếm luyện tập, không tự nộp.</li>
          </ul>
          <Link className="text-link" to="/progress">
            Xem lịch sử học tập <ArrowRight size={16} />
          </Link>
        </aside>
      </div>
    </div>
  );
}
interface Draft {
  ids: string[];
  answers: Record<string, string>;
  started: number;
  index: number;
  flags: string[];
}
function validDraft(x: unknown): boolean {
  if (!x || typeof x !== "object") return false;
  const d = x as Draft;
  return (
    Array.isArray(d.ids) &&
    d.ids.length > 0 &&
    new Set(d.ids).size === d.ids.length &&
    d.ids.every((id) => questions.some((q) => q.id === id)) &&
    !!d.answers &&
    typeof d.answers === "object" &&
    Object.values(d.answers).every((v) => typeof v === "string") &&
    Number.isFinite(d.started) &&
    Number.isInteger(d.index) &&
    d.index >= 0 &&
    d.index < d.ids.length &&
    Array.isArray(d.flags) &&
    d.flags.every((x) => typeof x === "string")
  );
}
export function Quiz() {
  const { user } = useUser(),
    { quizId = "" } = useParams();
  return user ? (
    <QuizSession key={user.id + quizId} userId={user.id} quizId={quizId} />
  ) : (
    <Navigate to="/login" replace state={{ from: "/practice/" + quizId }} />
  );
}
function QuizSession({ userId, quizId }: { userId: string; quizId: string }) {
  const navigate = useNavigate(),
    { user } = useUser();
  const [chapter, difficulty, countText, mode] = quizId.split("_");
  const valid =
    ["all", "amino", "peptide"].includes(chapter) &&
    ["all", "easy", "medium", "hard"].includes(difficulty) &&
    ["fixed", "random"].includes(mode) &&
    Number.isInteger(+countText) &&
    +countText > 0 &&
    +countText <= 64;
  const key = `draft.${userId}.${quizId}`;
  const [draft, setDraft] = useState<Draft>(() =>
    read(
      key,
      {
        ids: selectQuestions(
          questions,
          chapter,
          difficulty,
          +countText,
          mode,
        ).map((q) => q.id),
        answers: {},
        started: Date.now(),
        index: 0,
        flags: [],
      },
      validDraft,
    ),
  );
  const [elapsed, setElapsed] = useState(0),
    [error, setError] = useState(""),
    [confirm, setConfirm] = useState(false),
    [busy, setBusy] = useState(false);
  const qs = draft.ids
      .map((id) => questions.find((q) => q.id === id)!)
      .filter(Boolean),
    q = qs[draft.index];
  useEffect(() => {
    const id = setInterval(
      () =>
        setElapsed(
          Math.max(0, Math.floor((Date.now() - draft.started) / 1000)),
        ),
      1000,
    );
    return () => clearInterval(id);
  }, [draft.started]);
  useEffect(() => {
    if (valid)
      try {
        write(key, draft);
      } catch (e) {
        setError((e as Error).message);
      }
  }, [draft, key, valid]);
  if (!valid || !q)
    return (
      <div className="page">
        <h1>Bộ đề không hợp lệ</h1>
        <Link to="/practice">Chọn bộ đề khác</Link>
      </div>
    );
  const setAnswer = (answer: string) =>
    setDraft((d) => ({ ...d, answers: { ...d.answers, [q.id]: answer } }));
  const unanswered = qs.filter((q) => !draft.answers[q.id]?.trim()).length;
  async function submit() {
    setBusy(true);
    try {
      const a: Attempt = {
        attemptId: crypto.randomUUID(),
        userId,
        quizId,
        chapter,
        questionIds: draft.ids,
        answers: draft.answers,
        ...grade(qs, draft.answers),
        durationSeconds: Math.max(
          0,
          Math.floor((Date.now() - draft.started) / 1000),
        ),
        submittedAt: new Date().toISOString(),
        syncStatus: "pending",
      };
      saveAttempt(a);
      write(key, null);
      if (user && endpoint) void syncAttempt(a, user);
      navigate("/results/" + a.attemptId, { replace: true });
    } catch (e) {
      setError((e as Error).message);
      setBusy(false);
    }
  }
  return (
    <div className="page">
      <div className="quiz-top">
        <Link className="text-link" to="/practice">
          <ArrowLeft size={16} /> Đổi bộ đề (bản nháp được giữ)
        </Link>
        <span>
          <Clock size={17} /> {Math.floor(elapsed / 60)}:
          {String(elapsed % 60).padStart(2, "0")}
        </span>
      </div>
      <div className="quiz-layout">
        <section className="card question-card">
          <span className="eyebrow">
            CÂU {draft.index + 1} / {qs.length} ·{" "}
            {q.chapter === "amino" ? "AMINO ACID" : "PEPTIDE"}
          </span>
          <h2>{q.question}</h2>
          <QuestionInput
            key={q.id}
            q={q}
            value={draft.answers[q.id] ?? ""}
            onChange={setAnswer}
          />
          <div className="question-footer">
            <button
              className="btn"
              onClick={() =>
                setDraft((d) => ({
                  ...d,
                  flags: d.flags.includes(q.id)
                    ? d.flags.filter((x) => x !== q.id)
                    : [...d.flags, q.id],
                }))
              }
            >
              <Flag size={16} />
              {draft.flags.includes(q.id) ? "Bỏ đánh dấu" : "Đánh dấu xem lại"}
            </button>
            <span className="muted">Chưa hiện đáp án khi làm bài</span>
          </div>
          <div className="lesson-navigation">
            <button
              className="btn"
              disabled={draft.index === 0}
              onClick={() => setDraft((d) => ({ ...d, index: d.index - 1 }))}
            >
              <ArrowLeft size={16} /> Câu trước
            </button>
            <button
              className="btn primary"
              disabled={draft.index === qs.length - 1}
              onClick={() => setDraft((d) => ({ ...d, index: d.index + 1 }))}
            >
              Câu tiếp <ArrowRight size={16} />
            </button>
          </div>
        </section>
        <aside className="card quiz-nav">
          <h3>Phiếu trả lời</h3>
          <div className="question-grid">
            {qs.map((x, i) => (
              <button
                key={x.id}
                title={draft.answers[x.id] ? "Đã trả lời" : "Chưa trả lời"}
                onClick={() => setDraft((d) => ({ ...d, index: i }))}
                className={`${draft.answers[x.id] ? "answered" : ""} ${i === draft.index ? "current" : ""} ${draft.flags.includes(x.id) ? "flagged" : ""}`}
              >
                {i + 1}
              </button>
            ))}
          </div>
          <p>
            {qs.length - unanswered}/{qs.length} câu đã trả lời
          </p>
          <p className="muted">
            Nền trắng: chưa trả lời
            <br />
            Góc vàng: cần xem lại
          </p>
          <button className="btn primary" onClick={() => setConfirm(true)}>
            Nộp bài <Check size={16} />
          </button>
          {error && (
            <p role="alert" className="error">
              {error}
            </p>
          )}
        </aside>
      </div>
      {confirm && (
        <div className="modal-backdrop">
          <div
            className="modal card"
            role="dialog"
            aria-modal="true"
            aria-labelledby="submit-title"
          >
            <h2 id="submit-title">Nộp bài luyện tập?</h2>
            <p>
              {unanswered
                ? `Còn ${unanswered} câu chưa trả lời; các câu này được tính là sai.`
                : "Bạn đã trả lời tất cả các câu."}
            </p>
            <div className="field-row">
              <button
                autoFocus
                className="btn"
                disabled={busy}
                onClick={() => setConfirm(false)}
              >
                Tiếp tục làm
              </button>
              <button
                className="btn primary"
                disabled={busy}
                onClick={() => void submit()}
              >
                {busy ? "Đang lưu…" : "Xác nhận nộp bài"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
function QuestionInput({
  q,
  value,
  onChange,
}: {
  q: Question;
  value: string;
  onChange: (v: string) => void;
}) {
  if (q.type === "fill")
    return (
      <label>
        Đáp án của bạn
        <input
          className="fill-answer"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Nhập đáp án…"
          autoComplete="off"
        />
        <small>
          Chấp nhận số nguyên và dạng thập phân tương đương, ví dụ 2 hoặc 2,0.
        </small>
      </label>
    );
  if (q.type === "order") {
    const chosen = value ? value.split("-") : [];
    return (
      <div>
        <p>Chọn từng gốc theo thứ tự từ đầu N đến đầu C.</p>
        <div className="field-row">
          {q.options!.map((o) => (
            <button
              className="btn"
              key={o}
              disabled={chosen.includes(o)}
              onClick={() => onChange([...chosen, o].join("-"))}
            >
              {o}
            </button>
          ))}
          <button className="btn" onClick={() => onChange("")}>
            Xếp lại
          </button>
        </div>
        <div className="equation">N → {chosen.join("–") || "…"} → C</div>
      </div>
    );
  }
  return (
    <div className="answers">
      {q.options!.map((o, i) => (
        <button
          key={o}
          aria-pressed={value === o}
          className={`answer ${value === o ? "selected" : ""}`}
          onClick={() => onChange(o)}
        >
          <span>{String.fromCharCode(65 + i)}</span>
          {o}
        </button>
      ))}
    </div>
  );
}
export function Results() {
  const { user } = useUser(),
    { attemptId } = useParams(),
    [busy, setBusy] = useState(false);
  if (!user)
    return (
      <Navigate to="/login" replace state={{ from: "/results/" + attemptId }} />
    );
  const a = attempts(user.id).find((x) => x.attemptId === attemptId);
  if (!a)
    return (
      <div className="page">
        <h1>Không tìm thấy kết quả trong tài khoản này</h1>
        <Link to="/progress">Xem lịch sử</Link>
      </div>
    );
  const qs = a.questionIds
    .map((id) => questions.find((q) => q.id === id))
    .filter((q): q is Question => !!q);
  return (
    <div className="page">
      <div className="page-heading">
        <span className="eyebrow">MỘT BƯỚC TIẾN MỚI</span>
        <h1>Kết quả luyện tập</h1>
        <p>
          {new Date(a.submittedAt).toLocaleString("vi-VN")} · {user.fullName}
        </p>
      </div>
      <div className="result-banner">
        <LabArtwork kind="achievement" className="result-illustration" />
        <div className="score-ring">
          <strong>{a.score}</strong>
          <span>/ 10 điểm</span>
        </div>
        <div>
          <h2>
            {a.score >= 8
              ? "Bạn đã nắm khá vững kiến thức!"
              : "Tiếp tục khám phá, bạn nhé."}
          </h2>
          <p>
            {a.correctCount}/{a.totalQuestions} câu đúng ·{" "}
            {a.totalQuestions - a.correctCount} câu sai hoặc bỏ trống ·{" "}
            {a.durationSeconds} giây
          </p>
          <div className="field-row">
            <Link className="btn primary" to="/practice">
              Luyện bộ câu hỏi khác <ArrowRight size={16} />
            </Link>
            <Link className="btn" to="/progress">
              Lịch sử học tập
            </Link>
          </div>
        </div>
      </div>
      <div className="sync-box">
        <strong>
          {a.syncStatus === "synced"
            ? "Google Sheets đã xác nhận lưu bài."
            : "Đã lưu cục bộ · Chưa xác nhận Google Sheets"}
        </strong>
        <p>
          {a.syncError ||
            (!endpoint
              ? "Chưa cấu hình URL Apps Script; bài làm được giữ để đồng bộ sau."
              : "Kết quả đang chờ gửi.")}
        </p>
        {a.syncStatus !== "synced" && (
          <button
            disabled={busy || !endpoint}
            className="btn"
            onClick={async () => {
              setBusy(true);
              try {
                await syncAttempt(a, user);
              } finally {
                setBusy(false);
              }
            }}
          >
            {busy ? "Đang gửi…" : "Thử đồng bộ lại"}
          </button>
        )}
      </div>
      <h2 className="review-heading">Xem lại để hiểu sâu hơn</h2>
      {qs.map((q, i) => (
        <section className="card result-question" key={q.id}>
          <span
            className={correct(q, a.answers[q.id] ?? "") ? "success" : "error"}
          >
            Câu {i + 1} ·{" "}
            {correct(q, a.answers[q.id] ?? "") ? "Đúng" : "Sai / chưa trả lời"}
          </span>
          <h3>{q.question}</h3>
          <p>
            Bạn trả lời: <strong>{a.answers[q.id] || "Chưa trả lời"}</strong>
          </p>
          <p>
            Đáp án: <strong>{q.correctAnswer}</strong>
          </p>
          <div className="note">{q.explanation}</div>
          <small>{q.sourceReference}</small>
        </section>
      ))}
    </div>
  );
}
