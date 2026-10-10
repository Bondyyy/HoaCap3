import { aminoAcids } from "../../../data/aminoAcids";
import { charge, displacement } from "../../../utils/chemistry";
import { Orb, SceneLabel, palette, phase } from "../../chemistry/Graphics";
export default function ElectrophoresisScene({
  p,
  ph,
  selected,
}: {
  p: number;
  ph: number;
  selected: string;
}) {
  const acids = aminoAcids.filter(
      (x) => x.pi !== undefined && (selected === "all" || x.id === selected),
    ),
    move = phase(p, 0.36, 0.84);
  return (
    <>
      <path
        d="M102 80 V40 H306 M618 80 V40 H412"
        fill="none"
        stroke="#497b9f"
        strokeWidth="3"
      />
      <rect
        x="306"
        y="23"
        width="106"
        height="36"
        rx="8"
        fill="#244c6d"
        stroke="#538cae"
      />
      <circle
        cx="324"
        cy="41"
        r="4"
        fill={p > 0.3 ? palette.mint : "#61788b"}
      />
      <text x="366" y="45" textAnchor="middle" fill="#bde1f5" fontSize="10">
        {p > 0.3 ? "FIELD ON" : "STANDBY"}
      </text>
      <rect
        x="63"
        y="77"
        width="594"
        height="220"
        rx="22"
        fill="#70c4e6"
        fillOpacity=".065"
        stroke="#92c9e4"
        strokeWidth="1.5"
        strokeOpacity=".55"
      />
      <path
        d="M77 91 H641 V283"
        fill="none"
        stroke="#cfedff"
        opacity=".13"
        strokeWidth="4"
      />
      <path
        d="M102 92 V279"
        stroke={palette.coral}
        strokeWidth="10"
        strokeLinecap="round"
      />
      <path
        d="M618 92 V279"
        stroke={palette.blue}
        strokeWidth="10"
        strokeLinecap="round"
      />
      <path
        d="M360 92 V279"
        stroke="#8eb8d1"
        strokeDasharray="4 5"
        opacity=".45"
      />
      {p > 0.3 &&
        [118, 167, 217, 264].map((y, i) => (
          <g key={y} opacity=".13">
            <path
              d={`M140 ${y} H580`}
              stroke={palette.cyan}
              strokeDasharray="8 14"
              strokeDashoffset={-p * 100}
            />
            <path
              d={`M575 ${y - 4} L582 ${y} L575 ${y + 4}`}
              stroke={palette.cyan}
              fill="none"
            />
          </g>
        ))}
      {acids.map((x, i) => {
        const y = selected === "all" ? 125 + i * 61 : 183,
          position = 360 + displacement(ph, x.pi!) * move,
          c = charge(ph, x.pi!);
        return (
          <g key={x.id}>
            <path
              d={`M360 ${y} H${position}`}
              stroke={
                x.id === "Gly"
                  ? palette.cyan
                  : x.id === "Lys"
                    ? palette.purple
                    : palette.gold
              }
              strokeOpacity=".35"
              strokeWidth="2"
              strokeDasharray="3 5"
            />
            <circle cx="360" cy={y} r="6" fill="none" stroke="#7299b4" />
            <Orb
              x={position}
              y={y}
              label={`${x.id} ${c === 0 ? "±" : c > 0 ? "+" : "−"}`}
              color={
                x.id === "Gly"
                  ? palette.cyan
                  : x.id === "Lys"
                    ? palette.purple
                    : palette.gold
              }
              r={24}
            />
          </g>
        );
      })}
      <SceneLabel x={102} y={319} title="ANODE (+)" />
      <SceneLabel x={618} y={319} title="CATHODE (−)" />
      <SceneLabel
        x={360}
        y={319}
        title={`pH ${ph.toFixed(2)}`}
        subtitle="Vạch giữa: vị trí xuất phát"
      />
    </>
  );
}
