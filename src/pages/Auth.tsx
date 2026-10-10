import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Atom, ArrowRight } from "lucide-react";
import { login, register } from "../services/auth";
export default function Auth({ signup = false }: { signup?: boolean }) {
  const navigate = useNavigate(),
    location = useLocation();
  const [error, setError] = useState(""),
    [busy, setBusy] = useState(false);
  const from =
    typeof location.state?.from === "string" &&
    location.state.from.startsWith("/") &&
    !location.state.from.startsWith("//")
      ? location.state.from
      : "/progress";
  return (
    <div className="auth-page">
      <div className="auth-intro">
        <Atom size={64} />
        <span className="eyebrow">HỌC TẬP THEO CÁCH CỦA BẠN</span>
        <h1>
          Mỗi khám phá nhỏ,
          <br />
          một bước tiến lớn.
        </h1>
        <p>
          Lưu bài học, theo dõi kết quả và tiếp nối hành trình khám phá hóa học.
        </p>
        <div className="auth-formula">H₂N—CH(R)—COOH</div>
      </div>
      <form
        className="auth-card"
        onSubmit={async (e) => {
          e.preventDefault();
          setError("");
          setBusy(true);
          const data = new FormData(e.currentTarget);
          try {
            if (signup) {
              await register(
                String(data.get("name")),
                String(data.get("username")),
                String(data.get("password")),
                String(data.get("confirm")),
              );
              navigate("/login", { state: { registered: true, from } });
            } else {
              await login(
                String(data.get("username")),
                String(data.get("password")),
              );
              navigate(from);
            }
          } catch (e) {
            setError((e as Error).message);
          } finally {
            setBusy(false);
          }
        }}
      >
        <h2>{signup ? "Tạo tài khoản" : "Chào mừng trở lại"}</h2>
        <p>
          {signup
            ? "Bắt đầu hành trình học tập của riêng bạn."
            : "Đăng nhập để tiếp tục bài học."}
        </p>
        {location.state?.registered && (
          <p className="success" role="status">
            Đã tạo tài khoản. Hãy đăng nhập.
          </p>
        )}
        {signup && (
          <label>
            Họ và tên
            <input
              name="name"
              autoComplete="name"
              required
              minLength={2}
              maxLength={80}
            />
          </label>
        )}
        <label>
          Tên đăng nhập
          <input
            name="username"
            autoComplete="username"
            required
            minLength={3}
            maxLength={24}
          />
        </label>
        <label>
          Mật khẩu
          <input
            name="password"
            type="password"
            autoComplete={signup ? "new-password" : "current-password"}
            required
            minLength={signup ? 8 : 1}
            maxLength={128}
          />
        </label>
        {signup && (
          <label>
            Xác nhận mật khẩu
            <input
              name="confirm"
              type="password"
              autoComplete="new-password"
              required
            />
          </label>
        )}
        {error && (
          <p className="error" role="alert">
            {error}
          </p>
        )}
        <button disabled={busy} className="btn primary large" type="submit">
          {busy ? "Đang xử lý…" : signup ? "Tạo tài khoản" : "Đăng nhập"}
          <ArrowRight size={17} />
        </button>
        <p>
          {signup ? "Đã có tài khoản?" : "Chưa có tài khoản?"}{" "}
          <Link
            className="text-link"
            to={signup ? "/login" : "/register"}
            state={{ from }}
          >
            {signup ? "Đăng nhập" : "Đăng ký"}
          </Link>
        </p>
        <div className="note">
          Tài khoản demo chỉ lưu trên trình duyệt này, không đồng bộ giữa các
          máy. Không dùng mật khẩu thật hoặc dữ liệu nhạy cảm. Xóa dữ liệu trình
          duyệt có thể làm mất tài khoản và lịch sử; đây không phải hệ thống xác
          thực an toàn.
        </div>
      </form>
    </div>
  );
}
