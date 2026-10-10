import { amino } from "../../../data/aminoAcids";
import AminoModel from "../../chemistry/AminoModel";
import {
  Beaker,
  Pipette,
  Orb,
  Water,
  SceneLabel,
  palette,
  phase,
} from "../../chemistry/Graphics";
export default function AcidBaseScene({
  id,
  reagent,
  p,
}: {
  id: string;
  reagent: "HCl" | "NaOH";
  p: number;
}) {
  const item = amino(id),
    add = phase(p, 0.15, 0.36),
    fly = phase(p, 0.38, 0.66),
    done = p >= 0.66,
    out = phase(p, 0.67, 0.9);
  const r = done
    ? id === "Lys" && reagent === "HCl"
      ? "(CH₂)₄–NH₃⁺"
      : id === "Glu" && reagent === "NaOH"
        ? "CH₂–CH₂–COO⁻"
        : item.r
    : item.r;
  return (
    <>
      <path
        d="M250 173 H300"
        stroke="#78abc7"
        strokeOpacity=".4"
        strokeDasharray="4 5"
      />
      <SceneLabel
        x={139}
        y={45}
        title="THÊM THUỐC THỬ"
        subtitle="Dung dịch amino acid"
      />
      <Beaker
        x={74}
        y={125}
        width={133}
        height={154}
        color="#92bed8"
        level={0.48 + add * 0.09}
      >
        <Orb x={68} y={103} label={id} r={18} color={palette.blue} />
      </Beaker>
      <Pipette
        x={139}
        y={94}
        amount={p > 0.15 && p < 0.36 ? (p - 0.15) / 0.21 : 0}
        label={reagent}
        color={reagent === "HCl" ? palette.coral : palette.cyan}
      />
      <SceneLabel
        x={492}
        y={56}
        title={done ? "DẠNG MUỐI" : "PHÓNG TO NHÓM CHỨC"}
        subtitle={reagent === "HCl" ? "NH₂ nhận H⁺" : "COOH chuyển thành COO⁻"}
      />
      <AminoModel
        x={447}
        y={172}
        scale={0.71}
        r={r}
        acid={done && reagent === "HCl"}
        base={done && reagent === "NaOH"}
        highlight={reagent === "HCl" ? "amino" : "carboxyl"}
      />
      {p > 0.38 && p < 0.66 && (
        <>
          <Orb
            x={210 + fly * (reagent === "HCl" ? 145 : 380)}
            y={105 + fly * 67 - Math.sin(fly * Math.PI) * 40}
            label={reagent === "HCl" ? "H⁺" : "OH⁻"}
            r={16}
            color={reagent === "HCl" ? palette.coral : palette.cyan}
          />
          {(reagent === "HCl" ? item.amino : item.carboxyl) === 2 && (
            <Orb
              x={210 + fly * 237}
              y={245 - Math.sin(fly * Math.PI) * 25}
              label={reagent === "HCl" ? "H⁺" : "OH⁻"}
              r={14}
              color={palette.coral}
            />
          )}
        </>
      )}
      {done && (
        <>
          <SceneLabel
            x={470}
            y={297}
            title={
              reagent === "HCl"
                ? `${item.amino} Cl⁻ đi kèm`
                : `${item.carboxyl} Na⁺ đi kèm`
            }
          />
          {reagent === "NaOH" &&
            Array.from({ length: item.carboxyl }, (_, i) => (
              <Water
                key={i}
                x={580 + i * 66}
                y={233 + out * 55}
                scale={0.58}
                opacity={out}
              />
            ))}
        </>
      )}
      <text x="360" y="340" textAnchor="middle" fill="#819fb7" fontSize="10">
        Cốc và hạt là ký hiệu đại diện; màu kính không phải hiện tượng đổi màu
        dung dịch.
      </text>
    </>
  );
}
