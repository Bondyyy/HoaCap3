import React from "react";
import ReactDOM from "react-dom/client";
import {
  BrowserRouter,
  HashRouter,
  Routes,
  Route,
  Link,
} from "react-router-dom";
import Layout from "./components/layout/Layout";
import Home from "./pages/Home";
import { Lessons, LessonDetail } from "./pages/Lessons";
import { Labs, LabDetail } from "./pages/Labs";
import Auth from "./pages/Auth";
import { Practice, Quiz, Results } from "./pages/Practice";
import Progress from "./pages/Progress";
import { UserProvider } from "./hooks/useUser";
import "./styles.css";
import "./visual-upgrade.css";
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { error: boolean }
> {
  state = { error: false };
  static getDerivedStateFromError() {
    return { error: true };
  }
  render() {
    return this.state.error ? (
      <div className="page">
        <h1>Không thể mở nội dung này</h1>
        <p>
          Dữ liệu vẫn được giữ. Bạn có thể tải lại ứng dụng để khôi phục giao
          diện.
        </p>
        <button
          className="btn primary"
          onClick={() => location.assign(import.meta.env.BASE_URL)}
        >
          Về trang chủ
        </button>
      </div>
    ) : (
      this.props.children
    );
  }
}
const Router =
  import.meta.env.VITE_ROUTER_MODE === "hash" ? HashRouter : BrowserRouter;
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <Router>
        <UserProvider>
          <Routes>
            <Route element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="lessons" element={<Lessons />} />
              <Route
                path="lessons/:chapter/:lesson"
                element={<LessonDetail />}
              />
              <Route path="labs" element={<Labs />} />
              <Route path="labs/:id" element={<LabDetail />} />
              <Route path="register" element={<Auth key="register" signup />} />
              <Route path="login" element={<Auth key="login" />} />
              <Route path="practice" element={<Practice />} />
              <Route path="practice/:quizId" element={<Quiz />} />
              <Route path="results/:attemptId" element={<Results />} />
              <Route path="progress" element={<Progress />} />
              <Route
                path="*"
                element={
                  <div className="page">
                    <h1>Trang này không tồn tại</h1>
                    <Link to="/">Về trang chủ</Link>
                  </div>
                }
              />
            </Route>
          </Routes>
        </UserProvider>
      </Router>
    </ErrorBoundary>
  </React.StrictMode>,
);
