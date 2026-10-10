import { Pause, Play, RotateCcw, Repeat } from "lucide-react";
import type { ReactNode } from "react";
import { useAnimation } from "../../hooks/useAnimation";
export type Animation = ReturnType<typeof useAnimation>;
export function Controls({ a }: { a: Animation }) {
  return (
    <div className="sim-controls">
      <button className="btn primary" onClick={a.playing ? a.pause : a.play}>
        {a.playing ? <Pause size={16} /> : <Play size={16} />}{" "}
        {a.playing ? "Tạm dừng" : "Chạy mô phỏng"}
      </button>
      <button className="btn" onClick={a.reset}>
        <RotateCcw size={16} />
        Đặt lại
      </button>
      <button
        className="icon-btn"
        title="Chạy lại"
        aria-label="Chạy lại"
        onClick={a.replay}
      >
        <Repeat size={18} />
      </button>
      <label>
        Tốc độ{" "}
        <select value={a.speed} onChange={(e) => a.setSpeed(+e.target.value)}>
          <option value={1}>1×</option>
          <option value={2}>2×</option>
        </select>
      </label>
      <progress max={1} value={a.progress} aria-label="Tiến trình mô phỏng" />
      <span>{Math.round(a.progress * 100)}%</span>
    </div>
  );
}
export function Stage({ a, steps }: { a: Animation; steps: string[] }) {
  const index = Math.min(
    steps.length - 1,
    Math.floor(a.progress * steps.length),
  );
  return (
    <div className="steps">
      {steps.map((s, i) => (
        <div
          key={s}
          className={i === index ? "current" : i < index ? "done" : ""}
        >
          <span>{i + 1}</span>
          {s}
        </div>
      ))}
    </div>
  );
}
export function Equation({ children }: { children: ReactNode }) {
  return <div className="equation">{children}</div>;
}
export function Canvas({
  children,
  label,
}: {
  children: ReactNode;
  label: string;
}) {
  return (
    <div className="canvas-scroll">
      <svg
        className="sim-svg"
        viewBox="0 0 720 360"
        role="img"
        aria-label={label}
      >
        <ellipse
          cx="360"
          cy="165"
          rx="310"
          ry="145"
          fill="#326489"
          opacity=".09"
        />
        <path d="M25 330 H695" stroke="#8cb5d1" strokeOpacity=".1" />
        {children}
      </svg>
      <span className="canvas-tag">AMINOLAB / KHÔNG GIAN MÔ PHỎNG</span>
    </div>
  );
}
export function Molecule({
  r = "H",
  zwitter = false,
  highlight = "all",
  transferring = false,
  x = 360,
  y = 135,
}: {
  r?: string;
  zwitter?: boolean;
  highlight?: string;
  transferring?: boolean;
  x?: number;
  y?: number;
}) {
  const color = (group: string) =>
    highlight === "all" || highlight === group
      ? { amino: "#1671df", carboxyl: "#e56d56", r: "#8b63c7" }[group]
      : "#798da2";
  return (
    <g transform={`translate(${x},${y})`} fontSize="25" textAnchor="middle">
      <g stroke="#9aafc3" strokeWidth="2.5">
        <path d="M-110 0 H-25 M25 0 H115 M0 -15 V-55 M0 15 V55" />
      </g>
      <text x="-163" y="9" fill={color("amino")}>
        {zwitter ? "⁺H₃N" : "H₂N"}
      </text>
      <text y="9" fill="#244361">
        C
      </text>
      <text x="176" y="9" fill={color("carboxyl")}>
        {zwitter || transferring ? "COO⁻" : "COOH"}
      </text>
      <text y="-70" fill="#244361">
        H
      </text>
      <text y="88" fill={color("r")} fontSize="21">
        {r.includes("NH₂") ? (
          <>
            <tspan>{r.replace("NH₂", "")}</tspan>
            <tspan fill={highlight === "r" ? color("r") : color("amino")}>
              NH₂
            </tspan>
          </>
        ) : r.includes("COOH") ? (
          <>
            <tspan>{r.replace("COOH", "")}</tspan>
            <tspan fill={highlight === "r" ? color("r") : color("carboxyl")}>
              COOH
            </tspan>
          </>
        ) : (
          r
        )}
      </text>
    </g>
  );
}
