import {
  Beaker,
  Flask,
  Hotplate,
  Orb,
  Bond,
  Water,
  Residue,
  PolymerUnit,
  Pipette,
  SceneLabel,
  palette,
} from "./Graphics";
import AminoModel from "./AminoModel";
export default function LabArtwork({
  kind,
  className = "",
}: {
  kind: string;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 720 360"
      className={`lab-artwork ${className}`}
      role="img"
      aria-label={`Minh họa ${kind === "achievement" ? "hành trình học tập" : kind}`}
    >
      <ellipse
        cx="360"
        cy="306"
        rx="295"
        ry="18"
        fill="#001c35"
        opacity=".22"
      />
      {kind === "structure" ? (
        <AminoModel scale={0.9} />
      ) : kind === "acid-base" ? (
        <>
          <Beaker
            x={170}
            y={118}
            width={145}
            height={170}
            color={palette.blue}
          />
          <Beaker
            x={405}
            y={118}
            width={145}
            height={170}
            color={palette.cyan}
          />
          <Pipette
            x={240}
            y={100}
            amount={0.5}
            color={palette.coral}
            label="HCl"
          />
          <Pipette x={478} y={100} amount={0.5} label="NaOH" />
          <Orb x={240} y={235} label="H⁺" color={palette.coral} />
          <Orb x={477} y={235} label="OH⁻" color={palette.cyan} />
        </>
      ) : kind === "ester" ? (
        <>
          <Flask x={360} y={62} color={palette.gold} />
          <Hotplate x={360} y={278} on progress={0.5} />
          <Water x={545} y={140} />
          <SceneLabel x={190} y={133} title="C₂H₅OH" subtitle="ETHANOL" />
          <SceneLabel x={545} y={220} title="ACID + t°" />
        </>
      ) : kind === "electrophoresis" ? (
        <>
          <rect
            x="94"
            y="98"
            width="532"
            height="192"
            rx="22"
            fill="#72bbdc"
            fillOpacity=".1"
            stroke="#94c9e7"
            strokeOpacity=".5"
          />
          <path d="M122 100 V287" stroke={palette.coral} strokeWidth="10" />
          <path d="M600 100 V287" stroke={palette.blue} strokeWidth="10" />
          <path d="M360 100 V287" stroke="#8faec3" strokeDasharray="4 5" />
          <Orb x={215} y={233} label="Glu −" color={palette.gold} />
          <Orb x={360} y={143} label="Gly ±" color={palette.cyan} />
          <Orb x={503} y={187} label="Lys +" color={palette.purple} />
          <SceneLabel x={122} y={73} title="+" />
          <SceneLabel x={600} y={73} title="−" />
        </>
      ) : kind === "biuret" ? (
        <>
          <Beaker
            x={210}
            y={80}
            width={110}
            height={208}
            color={palette.blue}
          />
          <Beaker
            x={404}
            y={80}
            width={110}
            height={208}
            color={palette.purple}
          />
          <Pipette x={455} y={54} amount={0.5} label="Cu(II)" />
          <SceneLabel x={265} y={326} title="DIPEPTIDE" />
          <SceneLabel x={459} y={326} title="TRIPEPTIDE" />
        </>
      ) : kind === "achievement" ? (
        <>
          <path
            d="M118 280 Q206 270 246 223 T390 165 T580 64"
            stroke="#63bde5"
            strokeOpacity=".24"
            strokeWidth="30"
            fill="none"
            strokeLinecap="round"
          />
          <path
            d="M118 280 Q206 270 246 223 T390 165 T580 64"
            stroke={palette.cyan}
            strokeWidth="3"
            strokeDasharray="4 8"
            fill="none"
          />
          {[
            [140, 273, "01"],
            [295, 210, "02"],
            [436, 147, "03"],
          ].map(([x, y, label]) => (
            <Orb
              key={label}
              x={+x}
              y={+y}
              label={String(label)}
              r={25}
              color={palette.blue}
            />
          ))}
          <g transform="translate(558 91)">
            <path
              d="M-32 -42 H32 V-10 Q32 30 0 33 Q-32 30 -32 -10 Z"
              fill={palette.gold}
            />
            <path
              d="M-32 -29 H-48 Q-49 7 -25 7 M32 -29 H48 Q49 7 25 7"
              fill="none"
              stroke={palette.gold}
              strokeWidth="7"
            />
            <path
              d="M0 32 V61 M-25 64 H25"
              stroke={palette.gold}
              strokeWidth="8"
              strokeLinecap="round"
            />
            <path
              d="M0 -26 L5 -14 L18 -13 L8 -4 L11 10 L0 3 L-11 10 L-8 -4 L-18 -13 L-5 -14 Z"
              fill="#fff6c6"
            />
          </g>
        </>
      ) : (
        <>
          {["Gly", "Ala", "Val"].map((x, i) =>
            kind === "polymer" ? (
              <PolymerUnit key={x} x={190 + i * 170} y={178} index={i} m={5} />
            ) : (
              <Residue
                key={x}
                x={190 + i * 170}
                y={178}
                name={kind === "polymer" ? "M" + (i + 1) : x}
                r={kind === "polymer" ? "(CH₂)₅" : ["H", "CH₃", "CH(CH₃)₂"][i]}
                color={[palette.blue, palette.purple, palette.mint][i]}
              />
            ),
          )}
          {[0, 1].map((i) => (
            <g key={i}>
              <Bond
                x1={230 + i * 170}
                y1={178}
                x2={320 + i * 170}
                y2={178}
                color={kind === "hydrolysis" ? palette.coral : palette.gold}
                progress={kind === "hydrolysis" ? 0.35 : 1}
              />
              <Water
                x={275 + i * 170}
                y={kind === "hydrolysis" ? 86 : 284}
                scale={0.7}
              />
            </g>
          ))}
        </>
      )}
    </svg>
  );
}
