import LabArtwork from "../components/chemistry/LabArtwork";
import { Link, Navigate } from "react-router-dom";
import { ArrowRight, BookOpen, Trophy, Clock } from "lucide-react";
import { useUser } from "../hooks/useUser";
import { attempts, progress } from "../services/storage";
import { lessons } from "../data/lessons";
export default function Progress() {
  const { user } = useUser();
  if (!user)
    return <Navigate to="/login" replace state={{ from: "/progress" }} />;
  const ps = progress(user.id),
    history = attempts(user.id).sort((a, b) =>
      b.submittedAt.localeCompare(a.submittedAt),
    ),
    done = ps.filter((x) => x.completed).length;
  const avg = history.length
    ? history.reduce((s, a) => s + a.score, 0) / history.length
    : 0;
  return (
    <div className="page">
      <div className="page-heading progress-heading">
        <LabArtwork kind="achievement" />
        <span className="eyebrow">HÀNH TRÌNH CÁ NHÂN</span>
        <h1>Tiến bộ từng ngày, {user.fullName}.</h1>
        <p>Dữ liệu của tài khoản @{user.username} trên trình duyệt này.</p>
      </div>
      <div className="three-grid">
        <div className="metric card">
          <BookOpen />
          <strong>{done}/8</strong>
          <span>Bài học hoàn thành</span>
        </div>
        <div className="metric card">
          <Trophy />
          <strong>{history.length ? avg.toFixed(1) : "—"}</strong>
          <span>Điểm trung bình / 10</span>
        </div>
        <div className="metric card">
          <Clock />
          <strong>{history.length}</strong>
          <span>Lượt luyện tập đã lưu</span>
        </div>
      </div>
      <section className="card progress-chapters">
        <h2>Tiến độ theo chương</h2>
        {(["amino", "peptide"] as const).map((c) => {
          const total = lessons.filter((l) => l.chapter === c).length;
          const complete = ps.filter(
            (p) => p.completed && p.lessonId.startsWith(c + "/"),
          ).length;
          return (
            <div className="chapter-progress" key={c}>
              <div>
                <strong>{c === "amino" ? "Amino Acid" : "Peptide"}</strong>
                <span>
                  {complete}/{total} bài ·{" "}
                  {Math.round((complete / total) * 100)}%
                </span>
              </div>
              <progress max={total} value={complete} />
            </div>
          );
        })}
        <Link className="text-link" to="/lessons">
          Tiếp tục học <ArrowRight size={16} />
        </Link>
      </section>
      <section className="card">
        <h2>Lịch sử luyện tập</h2>
        {!history.length ? (
          <div className="empty-state">
            <Trophy size={34} />
            <h3>Bài luyện tập đầu tiên đang chờ bạn</h3>
            <p>Kết quả sẽ xuất hiện tại đây sau khi bạn nộp bài.</p>
            <Link className="btn primary" to="/practice">
              Bắt đầu luyện tập
            </Link>
          </div>
        ) : (
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th>Ngày làm</th>
                  <th>Chương</th>
                  <th>Số câu đúng</th>
                  <th>Điểm</th>
                  <th>Đồng bộ</th>
                  <th>Chi tiết</th>
                </tr>
              </thead>
              <tbody>
                {history.map((a) => (
                  <tr key={a.attemptId}>
                    <td>{new Date(a.submittedAt).toLocaleString("vi-VN")}</td>
                    <td>
                      {a.chapter === "amino"
                        ? "Amino Acid"
                        : a.chapter === "peptide"
                          ? "Peptide"
                          : "Tổng hợp"}
                    </td>
                    <td>
                      {a.correctCount}/{a.totalQuestions}
                    </td>
                    <td>
                      <strong>{a.score}/10</strong>
                    </td>
                    <td>
                      {a.syncStatus === "synced"
                        ? "Đã xác nhận"
                        : "Chờ đồng bộ"}
                    </td>
                    <td>
                      <Link
                        className="text-link"
                        to={"/results/" + a.attemptId}
                      >
                        Xem <ArrowRight size={14} />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
