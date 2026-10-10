import { useId } from "react";
import { Pipette, SceneLabel, palette, phase } from "../../chemistry/Graphics";
import { biuret } from "../../../utils/chemistry";
export default function BiuretScene({ p, n }: { p: number; n: number }) {
  const id = useId().replace(/:/g, ""),
    positive = biuret(n),
    add = phase(p, 0.15, 0.36),
    blue = phase(p, 0.3, 0.48),
    violet = positive ? phase(p, 0.55, 0.88) : 0;
  const color = `rgb(${80 + violet * 67},${174 - violet * 87},${226 - violet * 35})`;
  return (
    <>
      <defs>
        <clipPath id={id}>
          <path d="M301 69 H399 V241 Q399 287 350 287 Q301 287 301 241Z" />
        </clipPath>
        <linearGradient id={id + "g"}>
          <stop stopColor="#ceeaf7" stopOpacity=".25" />
          <stop offset=".4" stopColor="#e4f7ff" stopOpacity=".02" />
          <stop offset="1" stopColor="#a4d5ea" stopOpacity=".28" />
        </linearGradient>
      </defs>
      <ellipse cx="350" cy="293" rx="67" ry="12" fill="#001627" opacity=".4" />
      <path
        d="M296 67 V242 Q296 293 350 293 Q404 293 404 242 V67"
        fill={`url(#${id}g)`}
        stroke="#b0d5e6"
        strokeWidth="2"
      />
      <g clipPath={`url(#${id})`}>
        <rect
          x="300"
          y={160 - add * 35}
          width="100"
          height="170"
          fill={p < 0.3 ? "#bbd6e6" : color}
          opacity={0.15 + blue * 0.45}
        />
        <ellipse
          cx="350"
          cy={160 - add * 35}
          rx="50"
          ry="5"
          fill={color}
          opacity={0.1 + blue * 0.35}
        />
        {Array.from({ length: 16 }, (_, i) => (
          <circle
            key={i}
            cx={313 + ((i * 37) % 76)}
            cy={266 + (i % 3) * 5 - violet * (i % 4) * 17}
            r={3 + (i % 3)}
            fill="#429ce0"
            opacity={blue * (1 - violet)}
          />
        ))}
        {positive &&
          Array.from({ length: 9 }, (_, i) => (
            <circle
              key={i}
              cx={316 + ((i * 29) % 69)}
              cy={150 + ((i * 17) % 93)}
              r="2"
              fill="#d4b7ff"
              opacity={violet * 0.5}
            />
          ))}
      </g>
      <path
        d="M307 84 V237"
        stroke="white"
        opacity=".3"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <path
        d="M292 67 H408"
        stroke="#bddfec"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <Pipette
        x={350}
        y={41}
        label="NaOH + CuSO₄"
        amount={p > 0.15 && p < 0.36 ? (p - 0.15) / 0.21 : 0}
        color={palette.cyan}
      />
      <g>
        <SceneLabel
          x={149}
          y={124}
          title={
            n === 1
              ? "AMINO ACID"
              : n === 2
                ? "DIPEPTIDE"
                : n === 3
                  ? "TRIPEPTIDE"
                  : "TETRAPEPTIDE"
          }
          subtitle={`${n - 1} liên kết peptide`}
        />
        <path d="M220 147 H273" stroke="#7da6bf" strokeDasharray="3 5" />
        <SceneLabel
          x={554}
          y={157}
          title={
            p < 0.3
              ? "MẪU BAN ĐẦU"
              : p < 0.55
                ? "Cu(OH)₂ XANH LAM"
                : positive
                  ? "PHỨC MÀU TÍM"
                  : "KHÔNG TÍM BIURET"
          }
          subtitle={
            p > 0.55
              ? positive
                ? "Kết tủa tan dần khi tạo phức"
                : "Không đủ hai liên kết peptide"
              : "Quan sát từng giai đoạn"
          }
        />
        <path d="M426 182 H474" stroke="#7da6bf" strokeDasharray="3 5" />
      </g>
      <rect
        x="244"
        y="303"
        width="213"
        height="27"
        rx="13"
        fill={positive ? "#a77bd4" : "#4aa9d6"}
        fillOpacity=".1"
        stroke={positive ? "#a77bd4" : "#4aa9d6"}
        strokeOpacity=".3"
      />
      <text x="350" y="321" textAnchor="middle" fill="#c6deed" fontSize="11">
        {p < 0.85
          ? "Đang quan sát mẫu"
          : positive
            ? "Biuret dương tính"
            : "Biuret âm tính"}
      </text>
    </>
  );
}
