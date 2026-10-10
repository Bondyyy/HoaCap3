import { Orb, Bond, palette } from "./Graphics";
export default function AminoModel({
  r = "H",
  highlight = "all",
  zwitter = false,
  transferring = false,
  acid = false,
  base = false,
  x = 350,
  y = 163,
  scale = 1,
}: {
  r?: string;
  highlight?: string;
  zwitter?: boolean;
  transferring?: boolean;
  acid?: boolean;
  base?: boolean;
  x?: number;
  y?: number;
  scale?: number;
}) {
  const active = (group: string) => highlight === "all" || highlight === group;
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <ellipse
        rx="241"
        ry="112"
        fill="none"
        stroke="#8bb3d2"
        strokeOpacity=".12"
        strokeDasharray="3 8"
      />
      <Bond x1={-115} y1={0} x2={0} y2={0} />
      <Bond x1={0} y1={0} x2={117} y2={0} />
      <Bond x1={0} y1={0} x2={0} y2={-80} />
      <Bond x1={0} y1={0} x2={0} y2={76} />
      <Bond
        x1={117}
        y1={0}
        x2={185}
        y2={-65}
        double
        color={active("carboxyl") ? palette.coral : "#658099"}
      />
      <Bond
        x1={117}
        y1={0}
        x2={190}
        y2={64}
        color={active("carboxyl") ? palette.coral : "#658099"}
      />
      <Orb
        x={-127}
        y={0}
        label={zwitter || acid ? "H₃N⁺" : "H₂N"}
        color={palette.blue}
        r={33}
        active={active("amino")}
      />
      <Orb x={0} y={0} label="Cα" color="#91b7d9" r={31} />
      <Orb x={0} y={-84} label="H" color="#e7f3ff" r={20} />
      <Orb
        x={119}
        y={0}
        label="C"
        color="#91b7d9"
        r={26}
        active={active("carboxyl")}
      />
      <Orb
        x={189}
        y={-70}
        label="O"
        color={palette.coral}
        r={24}
        active={active("carboxyl")}
      />
      <Orb
        x={195}
        y={67}
        label={zwitter || transferring || base ? "O⁻" : "OH"}
        color={palette.coral}
        r={27}
        active={active("carboxyl")}
      />
      <rect
        x={-Math.max(34, r.length * 4.2)}
        y="68"
        width={Math.max(68, r.length * 8.4)}
        height="38"
        rx="17"
        fill={active("r") ? "#685096" : "#344d64"}
        stroke={palette.purple}
        strokeOpacity=".4"
      />
      <text x="0" y="92" fill="#ece4ff" textAnchor="middle" fontSize="13">
        {r.includes("NH₂") ? (
          <>
            {r.replace("NH₂", "")}
            <tspan fill={active("amino") ? palette.cyan : undefined}>NH₂</tspan>
          </>
        ) : r.includes("COOH") ? (
          <>
            {r.replace("COOH", "")}
            <tspan fill={active("carboxyl") ? palette.coral : undefined}>
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
