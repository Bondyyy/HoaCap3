import {
  Flask,
  Hotplate,
  Pipette,
  Orb,
  Bond,
  Water,
  SceneLabel,
  palette,
  phase,
} from "../../chemistry/Graphics";
export default function EsterScene({ p, mode }: { p: number; mode: string }) {
  const heat = phase(p, 0.18, 0.35),
    join = phase(p, 0.42, 0.67),
    out = phase(p, 0.68, 0.89),
    done = p >= 0.67;
  return (
    <>
      <Flask x={150} y={67} color="#95c6dc" fill={0.5}>
        <Orb x={-25} y={151} r={14} label="Gly" color={palette.blue} />
        <Orb x={25} y={163} r={14} label="EtOH" color={palette.mint} />
      </Flask>
      <Pipette
        x={150}
        y={53}
        label="Acid"
        amount={p > 0.12 && p < 0.3 ? (p - 0.12) / 0.18 : 0}
        color={palette.gold}
      />
      <Hotplate x={150} y={283} on={heat > 0} progress={p} />
      <path
        d="M245 157 H286"
        stroke="#87adc7"
        strokeDasharray="4 4"
        opacity=".5"
      />
      <SceneLabel
        x={490}
        y={52}
        title="ESTER HÓA NHÓM CARBOXYL"
        subtitle={
          mode === "hcl"
            ? "HCl · nhóm amino ở dạng amoni"
            : "H₂SO₄, t° · quy ước THPT"
        }
      />
      <Bond x1={357} y1={150} x2={440} y2={150} />
      <Bond x1={440} y1={150} x2={440} y2={94} double />
      <Orb
        x={351}
        y={150}
        label={mode === "hcl" && done ? "⁺H₃NCH₂" : "H₂NCH₂"}
        r={35}
        color={palette.blue}
      />
      <Orb x={440} y={150} label="C" color="#a6c7e3" r={25} />
      <Orb x={440} y={87} label="O" color={palette.coral} r={22} />
      <Bond
        x1={465}
        y1={150}
        x2={492 + join * 15}
        y2={150}
        color={palette.gold}
        progress={done ? 1 : 0.7}
      />
      {!done && <Orb x={510} y={150} label="OH" color={palette.coral} r={24} />}
      <g
        opacity={1 - phase(p, 0.59, 0.67)}
        transform={`translate(${-join * 35} ${-join * 12})`}
      >
        <Orb x={613} y={150} label="HO–C₂H₅" color={palette.mint} r={39} />
        <text x="613" y="211" fill="#8fc2ac" textAnchor="middle" fontSize="11">
          Ethanol
        </text>
      </g>
      {done && (
        <>
          <Bond
            x1={510}
            y1={150}
            x2={590}
            y2={150}
            color={palette.mint}
            progress={phase(p, 0.67, 0.75)}
          />
          <Orb x={513} y={150} label="O" color={palette.coral} r={24} />
          <Orb x={606} y={150} label="C₂H₅" color={palette.mint} r={34} />
          <Water
            x={527 + out * 45}
            y={184 + out * 77}
            scale={0.85}
            opacity={out}
          />
          <SceneLabel x={572} y={315} title="H₂O" subtitle="NƯỚC TẠO THÀNH" />
        </>
      )}
      <text x="463" y="254" textAnchor="middle" fill="#f0c17f" fontSize="12">
        {done
          ? mode === "hcl"
            ? "Ester dạng muối · Cl⁻"
            : "Nhóm ester –COO–C₂H₅"
          : "COOH + HO–C₂H₅"}
      </text>
      <text x="360" y="353" textAnchor="middle" fontSize="9" fill="#88a9be">
        Sơ đồ biến đổi tổng; không mô tả cơ chế đứt/tạo liên kết hay hiệu suất
        cân bằng.
      </text>
    </>
  );
}
