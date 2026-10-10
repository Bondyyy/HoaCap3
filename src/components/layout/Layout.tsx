import { useEffect, useState } from "react";
import {
  Link,
  NavLink,
  Outlet,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { Menu, X, LogOut, ArrowUpRight } from "lucide-react";
import { useUser } from "../../hooks/useUser";
import { logout } from "../../services/auth";
import { attempts, storageWarning } from "../../services/storage";
import { endpoint, syncAttempt } from "../../services/sheets";
export default function Layout() {
  const { user, revision } = useUser(),
    [open, setOpen] = useState(false),
    location = useLocation(),
    navigate = useNavigate();
  useEffect(() => {
    setOpen(false);
    window.scrollTo(0, 0);
  }, [location.pathname]);
  useEffect(() => {
    if (!user || !endpoint) return;
    const run = () => {
      for (const a of attempts(user.id).filter(
        (a) => a.syncStatus === "pending",
      ))
        void syncAttempt(a, user);
    };
    run();
    window.addEventListener("online", run);
    return () => window.removeEventListener("online", run);
  }, [user?.id]);
  return (
    <>
      <header className="site-header">
        <div className="header-inner">
          <Link to="/" className="brand">
            <span className="brand-icon">
              <img className="web-logo" src={`${import.meta.env.BASE_URL}logoweb.jpg`} alt="" />
            </span>
            Amino<span>Lab</span>
            <i>HÓA HỌC TƯƠNG TÁC</i>
          </Link>
          <button
            className="mobile-menu icon-btn"
            aria-label="Mở menu"
            aria-expanded={open}
            onClick={() => setOpen(!open)}
          >
            {open ? <X /> : <Menu />}
          </button>
          <nav className={open ? "open" : ""} aria-label="Điều hướng chính">
            {[
              ["/", "Trang chủ"],
              ["/lessons", "Bài học"],
              ["/labs", "Phòng thí nghiệm"],
              ["/practice", "Ôn tập"],
              ["/progress", "Tiến độ"],
            ].map(([to, label]) => (
              <NavLink key={to} to={to} end={to === "/"}>
                {label}
              </NavLink>
            ))}
          </nav>
          <div className="account">
            {user ? (
              <>
                <Link
                  to="/progress"
                  className="user-name"
                  title={user.fullName}
                >
                  {user.fullName}
                </Link>
                <button
                  className="icon-btn"
                  aria-label="Đăng xuất"
                  onClick={() => {
                    logout();
                    navigate("/");
                  }}
                >
                  <LogOut size={18} />
                </button>
              </>
            ) : (
              <Link className="btn primary small" to="/login">
                Đăng nhập <ArrowUpRight size={16} />
              </Link>
            )}
          </div>
        </div>
      </header>
      {storageWarning() && (
        <div className="storage-warning" role="status" key={revision}>
          {storageWarning()}
        </div>
      )}
      <main>
        <Outlet />
      </main>
      <footer>
        <Link to="/" className="brand">
          <img className="web-logo" src={`${import.meta.env.BASE_URL}logoweb.jpg`} alt="" /> AminoLab
        </Link>
        <p>Hiểu bản chất. Khám phá bằng tương tác.</p>
        <span>Hóa học THPT · Amino Acid & Peptide</span>
      </footer>
    </>
  );
}
