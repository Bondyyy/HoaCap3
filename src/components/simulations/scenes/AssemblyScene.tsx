import {
  Residue,
  PolymerUnit,
  Water,
  Bond,
  Hotplate,
  SceneLabel,
  palette,
  ease,
  phase,
} from "../../chemistry/Graphics";
import { amino } from "../../../data/aminoAcids";
import { segmentProgress } from "../../../utils/animation";
export default function AssemblyScene({
  p,
  chain,
  polymer = false,
  m = 5,
}: {
  p: number;
  chain: string[];
  polymer?: boolean;
  m?: number;
}) {
  const count = chain.length,
    gaps = Array.from({ length: count - 1 }, (_, i) =>
      segmentProgress(p, i, count - 1),
    );
  const positions = chain.map(
    (_, i) =>
      360 -
      (count - 1) * 79 +
      i * 158 +
      (i - (count - 1) / 2) * 24 * (1 - phase(p, 0.12, 0.3)),
  );
  const joined = gaps.filter((x) => x >= 0.7).length;
  return (
    <>
      <SceneLabel
        x={360}
        y={48}
        title={
          polymer
            ? "TRÙNG NGƯNG · MẠCH POLYAMIDE"
            : "TỪ NHỮNG GỐC RIÊNG LẺ ĐẾN MỘT CHUỖI"
        }
        subtitle={
          polymer
            ? "Đun nóng · mỗi lần nối tạo một liên kết amide"
            : "Chọn trình tự · quan sát nối từ đầu N đến đầu C"
        }
      />
      {gaps.map((g, i) => {
        const t = ease(g / 0.7),
          water = phase(g, 0.7, 1);
        const mid = (positions[i] + positions[i + 1]) / 2;
        return (
          <g key={i}>
            <path
              d={`M${positions[i] + 40} 164 H${positions[i + 1] - 39}`}
              stroke="#97b7cf"
              opacity=".17"
              strokeDasharray="3 5"
            />
            <Bond
              x1={positions[i] + 40}
              y1={164}
              x2={positions[i + 1] - 40}
              y2={164}
              color={palette.gold}
              progress={t}
              width={5}
            />
            <text
              x={mid}
              y="140"
              textAnchor="middle"
              fill={palette.gold}
              fontSize="9"
              opacity={t}
            >
              CO–NH
            </text>
            {g >= 0.7 && (
              <>
                <Water
                  x={mid}
                  y={191 + water * 64}
                  scale={0.57}
                  opacity={Math.min(1, water * 4)}
                />
                <text
                  x={mid}
                  y="294"
                  textAnchor="middle"
                  fill="#9bcedc"
                  fontSize="10"
                  opacity={water}
                >
                  H₂O #{i + 1}
                </text>
              </>
            )}
          </g>
        );
      })}
      {chain.map((id, i) =>
        polymer ? (
          <PolymerUnit key={i} x={positions[i]} y={164} index={i} m={m} />
        ) : (
          <Residue
            key={i}
            x={positions[i]}
            y={164}
            name={id}
            r={amino(id).r}
            color={
              [palette.blue, palette.purple, palette.mint, palette.coral][i]
            }
          />
        ),
      )}
      <SceneLabel x={positions[0]} y={89} title="ĐẦU N" subtitle="H₂N–" />
      <SceneLabel
        x={positions[count - 1]}
        y={89}
        title="ĐẦU C"
        subtitle="–COOH"
      />
      {polymer ? (
        <g transform="translate(0 25)">
          <Hotplate x={360} y={274} on={p > 0.18} progress={p} />
        </g>
      ) : (
        <text x="360" y="336" fill="#b2d1e5" fontSize="13" textAnchor="middle">
          {joined} liên kết peptide đã ghép · {joined} phân tử nước tạo thành
        </text>
      )}
      <text
        x="360"
        y={polymer ? 357 : 355}
        fill="#7196ae"
        fontSize="8"
        textAnchor="middle"
      >
        Khối gốc là sơ đồ nhóm nguyên tử, các H được lược bớt; công thức đầy đủ
        ở phương trình bên dưới.
      </text>
    </>
  );
}
