import EditorialPhoto from "../components/chemistry/EditorialPhoto";
import LabArtwork from "../components/chemistry/LabArtwork";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  FlaskConical,
  CheckCircle2,
  MousePointer2,
  Layers,
  MoveRight,
} from "lucide-react";
import { useUser } from "../hooks/useUser";
import { progress } from "../services/storage";
import { lessons } from "../data/lessons";
import { questions } from "../data/questions";
function HeroMolecule() {
  return (
    <svg
      viewBox="0 0 600 390"
      aria-label="Công thức cấu tạo glycine H₂N–CH₂–COOH"
      role="img"
    >
      <defs>
        <radialGradient id="orb">
          <stop stopColor="#fff" />
          <stop offset="1" stopColor="#d9ebff" />
        </radialGradient>
      </defs>
      <g stroke="#c0d4e6" strokeWidth="2" fill="none">
        <circle cx="300" cy="184" r="128" strokeDasharray="4 7" />
        <ellipse
          cx="300"
          cy="184"
          rx="230"
          ry="75"
          transform="rotate(-23 300 184)"
        />
      </g>
      <g stroke="#abc4de" strokeWidth="7" fill="none">
        <path d="M150 205 L280 147 L410 200 M280 147 L275 60 M280 147 L270 264 M410 200 L480 126 M416 206 L488 132 M410 200 L485 282" />
      </g>
      <g textAnchor="middle" fontFamily="Arial" fontWeight="600">
        <circle cx="150" cy="205" r="40" fill="#3e87dd" />
        <text x="150" y="213" fill="white" fontSize="23">
          H₂N
        </text>
        <circle cx="280" cy="147" r="38" fill="url(#orb)" stroke="#abcbed" />
        <text x="280" y="157" fill="#29557c" fontSize="29">
          C
        </text>
        <circle cx="410" cy="200" r="36" fill="url(#orb)" stroke="#abcbed" />
        <text x="410" y="210" fill="#29557c" fontSize="27">
          C
        </text>
        <circle cx="275" cy="60" r="23" fill="white" stroke="#c3d8e9" />
        <text x="275" y="67" fill="#7794ad" fontSize="20">
          H
        </text>
        <circle cx="270" cy="264" r="23" fill="white" stroke="#c3d8e9" />
        <text x="270" y="271" fill="#7794ad" fontSize="20">
          H
        </text>
        <circle cx="489" cy="123" r="30" fill="#ed9a86" />
        <text x="489" y="131" fill="white" fontSize="24">
          O
        </text>
        <circle cx="489" cy="287" r="32" fill="#ed9a86" />
        <text x="489" y="295" fill="white" fontSize="21">
          OH
        </text>
      </g>
      <g fontSize="12" letterSpacing="2">
        <text x="77" y="273" fill="#4181c8">
          NHÓM AMINO
        </text>
        <text x="386" y="349" fill="#c47864">
          NHÓM CARBOXYL
        </text>
      </g>
    </svg>
  );
}
export default function Home() {
  const { user } = useUser(),
    done = user ? progress(user.id).filter((x) => x.completed).length : 0;
  return (
    <>
      <section className="hero">
        <div className="hero-copy">
          <div className="eyebrow">
            <span /> PHÒNG HỌC HÓA HỌC SỐ
          </div>
          <h1>
            Nhìn thấy phản ứng.
            <br />
            Hiểu sâu <em>hóa học.</em>
          </h1>
          <p>
            Khám phá thế giới Amino Acid và Peptide qua mô phỏng tương tác. Từ
            cấu trúc phân tử đến từng liên kết — kiến thức trở nên thật gần.
          </p>
          <div className="hero-actions">
            <Link className="btn primary large" to="/lessons">
              Bắt đầu học <ArrowRight size={18} />
            </Link>
            <Link className="btn large" to="/labs">
              <FlaskConical size={18} /> Vào phòng thí nghiệm
            </Link>
          </div>
          <div className="hero-note">
            <CheckCircle2 size={16} /> Bám sát kiến thức THPT <span>·</span> Học
            theo nhịp của bạn
          </div>
        </div>
        <div className="hero-visual">
          <EditorialPhoto photo="laboratory" className="hero-photo" priority />
          <div className="hero-visual-label">
            <span className="live-dot" /> KHOA HỌC BẮT ĐẦU TỪ TÒ MÒ
          </div>
          <Link to="/labs/structure" className="hero-molecule-inset">
            <HeroMolecule />
            <div>
              <span>NHÌN SÂU HƠN</span>
              <strong>Một phân tử, hai nhóm chức</strong>
              <small>Khám phá glycine ↗</small>
            </div>
          </Link>
          <div className="hero-lab-badge">
            <span>08</span>
            <div>
              THÍ NGHIỆM
              <br />
              <strong>Tự tay khám phá</strong>
            </div>
          </div>
        </div>
      </section>
      <div className="stats-strip">
        <div>
          <strong>02</strong>
          <span>Chương kiến thức</span>
        </div>
        <div>
          <strong>08</strong>
          <span>Bài học trực quan</span>
        </div>
        <div>
          <strong>08</strong>
          <span>Mô phỏng tương tác</span>
        </div>
        <div>
          <strong>{questions.length}</strong>
          <span>Câu hỏi luyện tập</span>
        </div>
      </div>
      {user && (
        <section className="welcome card">
          <div>
            <span className="eyebrow">HÀNH TRÌNH CỦA BẠN</span>
            <h3>Chào {user.fullName}, tiếp tục khám phá nhé!</h3>
            <p>
              Bạn đã hoàn thành {done}/{lessons.length} bài học.
            </p>
          </div>
          <Link to="/progress" className="btn">
            Xem tiến độ <ArrowRight size={16} />
          </Link>
        </section>
      )}
      <section className="section">
        <div className="section-heading">
          <div>
            <span className="eyebrow">LỘ TRÌNH HỌC TẬP</span>
            <h2>Từ phân tử nhỏ đến chuỗi liên kết</h2>
            <p>Hai chương kiến thức, một hành trình khám phá liền mạch.</p>
          </div>
          <Link className="text-link" to="/lessons">
            Tất cả bài học <ArrowRight size={17} />
          </Link>
        </div>
        <div className="chapter-grid">
          <Link className="chapter-card blue" to="/lessons/amino/concept">
            <div className="chapter-top">
              <span>CHƯƠNG 01</span>
              <span>
                <BookOpen size={15} /> 5 bài học
              </span>
            </div>
            <div className="chapter-cover">
              <EditorialPhoto photo="glassware" />
              <div className="chapter-cover-model">
                <LabArtwork kind="structure" />
              </div>
              <span className="cover-label">TỪ MỘT PHÂN TỬ</span>
            </div>
            <h3>Amino Acid</h3>
            <p>
              Khám phá cấu tạo, tính lưỡng tính và chuyển động của amino acid
              trong điện trường.
            </p>
            <div className="card-bottom">
              <span>Cấu trúc · Phản ứng · Điện di</span>
              <span className="round-arrow">
                <ArrowUpRight size={19} />
              </span>
            </div>
          </Link>
          <Link className="chapter-card teal" to="/lessons/peptide/structure">
            <div className="chapter-top">
              <span>CHƯƠNG 02</span>
              <span>
                <BookOpen size={15} /> 3 bài học
              </span>
            </div>
            <div className="chapter-cover">
              <EditorialPhoto photo="solutions" />
              <div className="chapter-cover-model">
                <LabArtwork kind="peptide" />
              </div>
              <span className="cover-label">ĐẾN MỘT CHUỖI LIÊN KẾT</span>
            </div>
            <h3>Peptide</h3>
            <p>
              Tự tay xây dựng chuỗi peptide, cắt liên kết và tìm hiểu phản ứng
              màu Biuret.
            </p>
            <div className="card-bottom">
              <span>Liên kết · Thủy phân · Biuret</span>
              <span className="round-arrow">
                <ArrowUpRight size={19} />
              </span>
            </div>
          </Link>
        </div>
      </section>
      <section className="featured">
        <div>
          <span className="eyebrow">THÍ NGHIỆM NỔI BẬT</span>
          <h2>
            Một thay đổi pH.
            <br />
            Ba hướng khám phá.
          </h2>
          <p>
            Glycine, lysine và glutamic acid sẽ đi về đâu trong điện trường?
            Điều chỉnh pH và tự tìm câu trả lời.
          </p>
          <Link to="/labs/electrophoresis" className="btn primary">
            Thử mô phỏng điện di <ArrowRight size={17} />
          </Link>
        </div>
        <div className="feature-lab-visual">
          <LabArtwork kind="electrophoresis" />
          <div>
            <span>pH = 6</span>
            <strong>Ba chất. Ba hành vi khác nhau.</strong>
          </div>
        </div>
      </section>
      <section className="section">
        <div className="section-heading">
          <div>
            <span className="eyebrow">HỌC ĐỂ THẬT SỰ HIỂU</span>
            <h2>Kiến thức không chỉ nằm trên trang giấy</h2>
          </div>
        </div>
        <div className="three-grid">
          {[
            {
              icon: BookOpen,
              title: "Nắm vững bản chất",
              text: "Bài học ngắn gọn, công thức rõ ràng và câu hỏi kiểm tra ngay sau mỗi mục.",
              to: "/lessons",
            },
            {
              icon: Layers,
              title: "Tự mình thử nghiệm",
              text: "Thay đổi điều kiện, quan sát từng giai đoạn và lý giải điều vừa xảy ra.",
              to: "/labs",
            },
            {
              icon: CheckCircle2,
              title: "Biết mình tiến bộ",
              text: "Luyện tập có lời giải, lưu lịch sử và theo dõi tiến độ của riêng bạn.",
              to: "/practice",
            },
          ].map((x) => (
            <Link className="method-card" to={x.to} key={x.to}>
              <x.icon size={25} />
              <h3>{x.title}</h3>
              <p>{x.text}</p>
              <MoveRight size={21} />
            </Link>
          ))}
        </div>
      </section>
      <section className="bottom-cta">
        <LabArtwork kind="achievement" className="cta-art" />
        <h2>Sẵn sàng cho một cách học mới?</h2>
        <p>Bắt đầu từ một phân tử. Hiểu thêm cả một thế giới.</p>
        <Link className="btn primary" to="/practice">
          Luyện tập ngay <ArrowRight size={18} />
        </Link>
      </section>
    </>
  );
}
