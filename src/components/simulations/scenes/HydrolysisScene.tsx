import {
  Residue,
  Water,
  Bond,
  SceneLabel,
  palette,
  phase,
} from "../../chemistry/Graphics";
import { amino } from "../../../data/aminoAcids";
import { segmentProgress } from "../../../utils/animation";
import { cutChain } from "../../../utils/chemistry";
export default function HydrolysisScene({
  p,
  chain,
  cuts,
  mode,
}: {
  p: number;
  chain: string[];
  cuts: number[];
  mode: string;
}) {
  const ordered = [...cuts].sort((a, b) => a - b);
  const cutsProgress = chain
    .slice(0, -1)
    .map((_, i) =>
      ordered.includes(i)
        ? segmentProgress(p, ordered.indexOf(i), ordered.length)
        : 0,
    );
  const completed = ordered.filter((i) => cutsProgress[i] >= 0.62);
  const positions = chain.map(
    (_, i) =>
      360 -
      (chain.length - 1) * 77 +
      i * 154 +
      cutsProgress.reduce(
        (sum, g, j) => sum + (i > j ? 1 : -1) * phase(g, 0.6, 1) * 14,
        0,
      ),
  );
  return (
    <>
      <SceneLabel
        x={360}
        y={44}
        title="THỦY PHÂN LIÊN KẾT PEPTIDE"
        subtitle={
          mode === "acid"
            ? "HCl dư + H₂O · đun nóng"
            : mode === "base"
              ? "NaOH dư · đun nóng"
              : mode === "partial"
                ? "Chọn vị trí cắt · sơ đồ ròng trung hòa"
                : "H₂O · enzyme phù hợp"
        }
      />
      {cutsProgress.map((g, i) => {
        const x = (positions[i] + positions[i + 1]) / 2,
          approach = phase(g, 0, 0.5),
          split = phase(g, 0.55, 0.85);
        return (
          <g key={i}>
            <Bond
              x1={positions[i] + 40}
              y1={189}
              x2={positions[i + 1] - 40}
              y2={189}
              color={ordered.includes(i) ? palette.gold : "#7294ad"}
              opacity={1 - split}
              width={5}
            />
            {ordered.includes(i) && (
              <>
                <circle
                  cx={x}
                  cy="189"
                  r={17 + split * 14}
                  stroke={palette.coral}
                  strokeWidth="1.5"
                  strokeDasharray="3 4"
                  fill="none"
                  opacity={g > 0 && g < 1 ? 0.6 : 0}
                />
                {g < 0.62 && (
                  <Water
                    x={x}
                    y={85 + approach * 73}
                    scale={0.58}
                    opacity={p > 0.15 ? 1 : 0}
                  />
                )}
                <text
                  x={x - 15 - split * 11}
                  y="200"
                  textAnchor="end"
                  fontSize="10"
                  fill={palette.coral}
                  opacity={split}
                >
                  {mode === "base" ? "O⁻" : "OH"}
                </text>
                <text
                  x={x + 15 + split * 11}
                  y="200"
                  fontSize="10"
                  fill={palette.cyan}
                  opacity={split}
                >
                  H
                </text>
              </>
            )}
          </g>
        );
      })}
      {chain.map((id, i) => (
        <Residue
          key={i}
          x={positions[i]}
          y={189}
          name={id}
          r={amino(id).r}
          scale={0.88}
          color={[palette.blue, palette.purple, palette.mint, palette.coral][i]}
        />
      ))}
      <g opacity={phase(p, 0.83, 0.94)}>
        <rect
          x="100"
          y="292"
          width="520"
          height="38"
          rx="18"
          fill="#6bd5b0"
          fillOpacity=".08"
          stroke="#6bd5b0"
          strokeOpacity=".2"
        />
        <text x="360" y="316" textAnchor="middle" fill="#91dfc2" fontSize="15">
          {cutChain(chain, completed)
            .map((f) => f.join("–"))
            .join(" + ")}
          {mode === "acid"
            ? " · dạng muối amoni"
            : mode === "base"
              ? " · dạng muối natri"
              : ""}
        </text>
      </g>
      <text x="360" y="352" textAnchor="middle" fill="#809fb5" fontSize="9">
        Nước minh họa sự cắt mạch; trong NaOH dùng phương trình tổng bên dưới,
        không cộng thêm H₂O.
      </text>
    </>
  );
}
