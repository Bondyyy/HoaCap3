import LabArtwork from "../components/chemistry/LabArtwork";
import EditorialPhoto from "../components/chemistry/EditorialPhoto";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ArrowUpRight, FlaskConical } from "lucide-react";
import { reactions } from "../data/reactions";
import { lessons } from "../data/lessons";
import Simulation from "../components/simulations/Simulation";
export function Labs() {
  return (
    <div className="page">
      <div className="page-heading illustrated-heading">
        <EditorialPhoto photo="solutions" className="heading-photo" />
        <span className="eyebrow">THỬ NGHIỆM ĐỂ HIỂU</span>
        <h1>Phòng thí nghiệm tương tác</h1>
        <p>
          Thay đổi điều kiện, theo dõi diễn biến và giải thích điều bạn quan
          sát.
        </p>
      </div>
      <div className="labs-grid">
        {reactions.map((r, i) => (
          <Link to={"/labs/" + r.id} className="lab-card" key={r.id}>
            <div className={`lab-preview preview-${i % 4}`}>
              <span>THÍ NGHIỆM 0{i + 1}</span>
              <LabArtwork kind={r.id} />
            </div>
            <div className="lab-card-body">
              <h3>{r.name}</h3>
              <p>{r.goal}</p>
              <div className="card-bottom">
                <span>Mở mô phỏng</span>
                <ArrowUpRight size={20} />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
export function LabDetail() {
  const { id } = useParams(),
    r = reactions.find((x) => x.id === id);
  if (!r)
    return (
      <div className="page">
        <h1>Không tìm thấy mô phỏng</h1>
        <Link to="/labs">Phòng thí nghiệm</Link>
      </div>
    );
  return (
    <div className="page">
      <Link to="/labs" className="text-link">
        <ArrowLeft size={16} /> Tất cả thí nghiệm
      </Link>
      <div className="page-heading compact">
        <span className="eyebrow">PHÒNG THÍ NGHIỆM · {r.sourceReference}</span>
        <h1>{r.name}</h1>
        <p>{r.goal}</p>
      </div>
      <Simulation id={r.id} />
      <div className="three-grid lab-explanation">
        <div className="card">
          <h3>Điều kiện & phạm vi</h3>
          <p>{r.conditions}</p>
          <p>{r.variations.join(" · ")}</p>
        </div>
        <div className="card">
          <h3>Quan sát</h3>
          <p>{r.observations}</p>
        </div>
        <div className="card">
          <h3>Kết luận</h3>
          <p>{r.explanation}</p>
        </div>
      </div>
      <div className="related">
        <h3>Kiến thức liên quan</h3>
        {lessons
          .filter((l) => l.labs.includes(r.id))
          .map((l) => (
            <Link
              key={l.id}
              className="btn"
              to={`/lessons/${l.chapter}/${l.id}`}
            >
              {l.title} <ArrowUpRight size={16} />
            </Link>
          ))}
      </div>
    </div>
  );
}
