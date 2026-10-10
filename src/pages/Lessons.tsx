import LabArtwork from "../components/chemistry/LabArtwork";
import EditorialPhoto from "../components/chemistry/EditorialPhoto";
import SectionCheck from "../components/quiz/SectionCheck";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowRight,
  ArrowLeft,
  Search,
  CheckCircle2,
  Clock,
  BookOpen,
} from "lucide-react";
import { lessons } from "../data/lessons";
import { reactions } from "../data/reactions";
import { progress, visit } from "../services/storage";
import { useUser } from "../hooks/useUser";
import Simulation from "../components/simulations/Simulation";
export function Lessons() {
  const [search, setSearch] = useState("");
  const { user } = useUser(),
    state = user ? progress(user.id) : [];
  return (
    <div className="page">
      <div className="page-heading illustrated-heading">
        <EditorialPhoto photo="glassware" className="heading-photo" />
        <span className="eyebrow">THƯ VIỆN KIẾN THỨC</span>
        <h1>Mỗi bài học, một khám phá.</h1>
        <p>8 bài học · 2 chương · Học và thực hành ngay trong một trang.</p>
      </div>
      <label className="search">
        <Search size={20} />
        <input
          placeholder="Tìm bài học, phản ứng, kiến thức…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </label>
      {(["amino", "peptide"] as const).map((chapter, i) => (
        <section className="lesson-section" key={chapter}>
          <div className="section-heading">
            <h2>
              <span className="chapter-number">0{i + 1}</span>
              {chapter === "amino" ? "Amino Acid" : "Peptide"}
            </h2>
            <span className="muted">
              {
                state.filter(
                  (p) => p.completed && p.lessonId.startsWith(chapter + "/"),
                ).length
              }
              /{chapter === "amino" ? 5 : 3} đã hoàn thành
            </span>
          </div>
          <div className="lesson-list">
            {lessons
              .filter(
                (l) =>
                  l.chapter === chapter &&
                  `${l.title} ${l.sections.map((s) => s.text).join(" ")}`
                    .toLocaleLowerCase("vi")
                    .includes(search.toLocaleLowerCase("vi")),
              )
              .map((l, index) => {
                const p = state.find(
                  (x) => x.lessonId === chapter + "/" + l.id,
                );
                return (
                  <Link
                    className="lesson-row"
                    key={l.id}
                    to={`/lessons/${chapter}/${l.id}`}
                  >
                    <div className="lesson-thumbnail">
                      <LabArtwork kind={l.labs[0] || "achievement"} />
                    </div>
                    <span className="lesson-index">
                      {p?.completed ? (
                        <CheckCircle2 size={23} />
                      ) : (
                        String(index + 1).padStart(2, "0")
                      )}
                    </span>
                    <div>
                      <h3>{l.title}</h3>
                      <span>
                        <Clock size={13} /> {l.minutes} phút <b>·</b>{" "}
                        {l.labs.length} mô phỏng
                      </span>
                    </div>
                    <div className="lesson-status">
                      <span>
                        {p?.completed
                          ? "Đã hoàn thành"
                          : p
                            ? "Đang học"
                            : "Chưa học"}
                      </span>
                      <progress value={p?.progressPercentage ?? 0} max={100} />
                    </div>
                    <ArrowRight size={20} />
                  </Link>
                );
              })}
          </div>
        </section>
      ))}
    </div>
  );
}
export function LessonDetail() {
  const { chapter, lesson } = useParams(),
    { user } = useUser();
  const index = lessons.findIndex(
      (l) => l.chapter === chapter && l.id === lesson,
    ),
    l = lessons[index];
  const [answer, setAnswer] = useState<number | null>(null),
    [error, setError] = useState("");
  useEffect(() => {
    setAnswer(null);
    setError("");
    if (user && l)
      try {
        visit(user.id, `${l.chapter}/${l.id}`);
      } catch (e) {
        setError((e as Error).message);
      }
  }, [chapter, lesson, user?.id]);
  if (!l)
    return (
      <div className="page">
        <h1>Không tìm thấy bài học</h1>
        <Link to="/lessons">Quay lại bài học</Link>
      </div>
    );
  const done =
    user &&
    progress(user.id).find((p) => p.lessonId === `${chapter}/${lesson}`)
      ?.completed;
  return (
    <div className="page lesson-layout">
      <aside className="lesson-sidebar">
        <Link to="/lessons" className="text-link">
          <ArrowLeft size={16} /> Tất cả bài học
        </Link>
        {(["amino", "peptide"] as const).map((c) => (
          <div key={c}>
            <h4>{c === "amino" ? "01 · AMINO ACID" : "02 · PEPTIDE"}</h4>
            {lessons
              .filter((x) => x.chapter === c)
              .map((x) => (
                <Link
                  key={x.id}
                  className={x === l ? "active" : ""}
                  to={`/lessons/${c}/${x.id}`}
                >
                  <BookOpen size={15} />
                  {x.title}
                </Link>
              ))}
          </div>
        ))}
      </aside>
      <article className="lesson-body">
        <span className="eyebrow">
          {chapter === "amino"
            ? "CHƯƠNG 01 · AMINO ACID"
            : "CHƯƠNG 02 · PEPTIDE"}
        </span>
        <h1>{l.title}</h1>
        <p className="muted">
          {l.minutes} phút · {l.source}
        </p>
        {l.sections.map((s, i) => (
          <section className="theory" key={s.title}>
            <h2>{s.title}</h2>
            <p>{s.text}</p>
            {s.formula && <div className="equation">{s.formula}</div>}
            {s.note && <p className="note">{s.note}</p>}
            <SectionCheck key={l.chapter + l.id + i} lesson={l} index={i} />
            {l.id === "reactions" && l.labs[i] && (
              <div className="embedded">
                <h3>
                  <FlaskLabel />{" "}
                  {reactions.find((r) => r.id === l.labs[i])?.name}
                </h3>
                <Simulation id={l.labs[i]} />
              </div>
            )}
          </section>
        ))}
        {l.id !== "reactions" &&
          l.labs.map((id) => (
            <div className="embedded" key={id}>
              <h3>
                <FlaskLabel /> Tự mình khám phá
              </h3>
              <Simulation id={id} />
            </div>
          ))}
        <section className="quick-check card">
          <span className="eyebrow">KIỂM TRA NHANH</span>
          <h3>{l.check.question}</h3>
          {l.check.options.map((o, i) => (
            <button
              key={o}
              onClick={() => setAnswer(i)}
              className={`answer ${answer === i ? "selected" : ""}`}
            >
              {o}
            </button>
          ))}
          {answer !== null && (
            <p className={answer === l.check.answer ? "success" : "error"}>
              {answer === l.check.answer ? "Chính xác! " : "Chưa đúng. "}
              {l.check.explanation}
            </p>
          )}
        </section>
        {error && (
          <p role="alert" className="error">
            {error}
          </p>
        )}
        <div className="lesson-navigation">
          {index > 0 ? (
            <Link
              className="btn"
              to={`/lessons/${lessons[index - 1].chapter}/${lessons[index - 1].id}`}
            >
              <ArrowLeft size={16} /> Bài trước
            </Link>
          ) : (
            <span />
          )}
          {user ? (
            <button
              className="btn primary"
              disabled={!!done}
              onClick={() => {
                try {
                  visit(user.id, `${chapter}/${lesson}`, true);
                } catch (e) {
                  setError((e as Error).message);
                }
              }}
            >
              <CheckCircle2 size={17} />
              {done ? "Đã hoàn thành" : "Đánh dấu hoàn thành"}
            </button>
          ) : (
            <Link
              className="btn primary"
              to="/login"
              state={{ from: `/lessons/${chapter}/${lesson}` }}
            >
              Đăng nhập để lưu tiến độ
            </Link>
          )}
          {index < lessons.length - 1 && (
            <Link
              className="btn"
              to={`/lessons/${lessons[index + 1].chapter}/${lessons[index + 1].id}`}
            >
              Bài sau <ArrowRight size={16} />
            </Link>
          )}
        </div>
      </article>
    </div>
  );
}
function FlaskLabel() {
  return <span aria-hidden="true">◈</span>;
}
