import { useId } from "react";
export const palette = {
  blue: "#4198f1",
  cyan: "#48d5e7",
  coral: "#f29580",
  purple: "#ac8cf5",
  gold: "#f5c575",
  mint: "#70d9b5",
  ink: "#173b62",
};
export const clamp = (x: number) => Math.max(0, Math.min(1, x));
export const ease = (x: number) => {
  const t = clamp(x);
  return t * t * (3 - 2 * t);
};
export const phase = (p: number, start: number, end: number) =>
  ease((p - start) / (end - start));
export function Orb({
  x,
  y,
  label,
  color = palette.blue,
  r = 25,
  active = true,
  opacity = 1,
}: {
  x: number;
  y: number;
  label: string;
  color?: string;
  r?: number;
  active?: boolean;
  opacity?: number;
}) {
  const id = useId().replace(/:/g, "");
  return (
    <g transform={`translate(${x} ${y})`} opacity={opacity}>
      <defs>
        <radialGradient id={id} cx="30%" cy="25%" r="85%">
          <stop stopColor="white" stopOpacity=".75" />
          <stop offset=".3" stopColor={color} />
          <stop offset="1" stopColor={color} stopOpacity=".75" />
        </radialGradient>
      </defs>
      {active && <circle r={r + 7} fill={color} opacity=".08" />}
      <circle cy="4" r={r} fill="#001b36" opacity=".18" />
      <circle
        r={r}
        fill={active ? `url(#${id})` : "#637b93"}
        stroke="white"
        strokeOpacity=".42"
        strokeWidth="1.2"
      />
      <ellipse
        cx={-r * 0.2}
        cy={-r * 0.48}
        rx={r * 0.5}
        ry={r * 0.18}
        fill="white"
        opacity=".25"
      />
      <text
        textAnchor="middle"
        y="5"
        fontSize={label.length > 8 ? 11 : label.length > 4 ? 13 : 16}
        fontWeight="650"
        fill={color === "#e7f3ff" ? "#35617f" : "#fff"}
      >
        {label}
      </text>
    </g>
  );
}
export function Bond({
  x1,
  y1,
  x2,
  y2,
  color = "#83b4d6",
  double = false,
  progress = 1,
  width = 5,
  opacity = 1,
}: {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  color?: string;
  double?: boolean;
  progress?: number;
  width?: number;
  opacity?: number;
}) {
  return (
    <g fill="none" strokeLinecap="round" opacity={opacity}>
      <path
        d={`M${x1} ${y1} L${x1 + (x2 - x1) * progress} ${y1 + (y2 - y1) * progress}`}
        stroke="#001a31"
        strokeWidth={width + 3}
        transform="translate(0 2)"
        opacity=".25"
      />
      <path
        d={`M${x1} ${y1} L${x1 + (x2 - x1) * progress} ${y1 + (y2 - y1) * progress}`}
        stroke={color}
        strokeWidth={width}
      />
      {double && (
        <path
          d={`M${x1 - 7} ${y1 - 5} L${x1 + (x2 - x1) * progress - 7} ${y1 + (y2 - y1) * progress - 5}`}
          stroke={color}
          strokeWidth={width * 0.65}
        />
      )}
    </g>
  );
}
export function Water({
  x,
  y,
  scale = 1,
  opacity = 1,
}: {
  x: number;
  y: number;
  scale?: number;
  opacity?: number;
}) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`} opacity={opacity}>
      <Bond x1={0} y1={0} x2={-21} y2={17} width={3} />
      <Bond x1={0} y1={0} x2={21} y2={17} width={3} />
      <Orb x={0} y={0} r={15} label="O" color={palette.coral} />
      <Orb x={-23} y={19} r={11} label="H" color="#e7f3ff" />
      <Orb x={23} y={19} r={11} label="H" color="#e7f3ff" />
    </g>
  );
}
export function Bench() {
  return (
    <>
      <ellipse cx="360" cy="308" rx="305" ry="18" fill="#001a32" opacity=".4" />
      <path d="M45 302 H675 L692 316 H28 Z" fill="#315572" />
      <path d="M28 316 H692 V321 H28 Z" fill="#1a354d" />
    </>
  );
}
export function Beaker({
  x,
  y,
  color = palette.cyan,
  level = 0.55,
  width = 118,
  height = 160,
  children,
}: {
  x: number;
  y: number;
  color?: string;
  level?: number;
  width?: number;
  height?: number;
  children?: React.ReactNode;
}) {
  const id = useId().replace(/:/g, "");
  const liquidY = height * (1 - level);
  return (
    <g transform={`translate(${x} ${y})`}>
      <defs>
        <linearGradient id={id + "glass"}>
          <stop stopColor="#9cdcf4" stopOpacity=".16" />
          <stop offset=".4" stopColor="#fff" stopOpacity=".035" />
          <stop offset="1" stopColor="#a5e4fc" stopOpacity=".22" />
        </linearGradient>
        <linearGradient id={id + "liquid"} x2="0" y2="1">
          <stop stopColor={color} stopOpacity=".3" />
          <stop offset="1" stopColor={color} stopOpacity=".65" />
        </linearGradient>
        <clipPath id={id + "clip"}>
          <path
            d={`M5 4 H${width - 5} V${height - 14} Q${width - 5} ${height} ${width - 20} ${height} H20 Q5 ${height} 5 ${height - 14}Z`}
          />
        </clipPath>
      </defs>
      <path
        d={`M0 0 H${width + 9} L${width} 9 V${height - 13} Q${width} ${height + 5} ${width - 18} ${height + 5} H18 Q0 ${height + 5} 0 ${height - 13}Z`}
        fill={`url(#${id}glass)`}
        stroke="#b1d6e6"
        strokeWidth="2"
      />
      <g clipPath={`url(#${id}clip)`}>
        <rect
          x="4"
          y={liquidY}
          width={width - 8}
          height={height}
          fill={`url(#${id}liquid)`}
        />
        <ellipse
          cx={width / 2}
          cy={liquidY}
          rx={width / 2 - 5}
          ry="5"
          fill={color}
          opacity=".32"
        />
        {children}
      </g>
      <path
        d={`M11 15 V${height - 23}`}
        stroke="white"
        opacity=".35"
        strokeWidth="4"
        strokeLinecap="round"
      />
      {[0.25, 0.4, 0.55, 0.7].map((f, i) => (
        <path
          key={i}
          d={`M${width - 22} ${height * f} h15`}
          stroke="#bfdeec"
          strokeWidth="1.5"
          opacity=".6"
        />
      ))}
      <path
        d={`M8 0 H${width - 4}`}
        stroke="white"
        opacity=".7"
        strokeWidth="2"
      />
    </g>
  );
}
export function Flask({
  x,
  y,
  color = palette.cyan,
  fill = 0.45,
  children,
}: {
  x: number;
  y: number;
  color?: string;
  fill?: number;
  children?: React.ReactNode;
}) {
  const id = useId().replace(/:/g, "");
  const d =
    "M-22 0 H22 V67 L84 184 Q92 204 66 207 H-66 Q-92 204 -84 184 L-22 67 Z";
  return (
    <g transform={`translate(${x} ${y})`}>
      <defs>
        <clipPath id={id}>
          <path d={d} />
        </clipPath>
        <linearGradient id={id + "g"}>
          <stop stopColor="#8fd8ed" stopOpacity=".18" />
          <stop offset=".6" stopColor="#d3f8ff" stopOpacity=".025" />
          <stop offset="1" stopColor="#8fd8ed" stopOpacity=".23" />
        </linearGradient>
      </defs>
      <path d={d} fill={`url(#${id}g)`} stroke="#a3cedd" strokeWidth="2" />
      <g clipPath={`url(#${id})`}>
        <rect
          x="-90"
          y={207 * (1 - fill)}
          width="180"
          height="210"
          fill={color}
          opacity=".23"
        />
        <ellipse
          cx="0"
          cy={207 * (1 - fill)}
          rx="64"
          ry="5"
          fill={color}
          opacity=".22"
        />
        {children}
      </g>
      <path
        d="M-12 12 V69 L-66 175"
        fill="none"
        stroke="white"
        strokeWidth="5"
        opacity=".32"
        strokeLinecap="round"
      />
      <path
        d="M-28 0 H28"
        stroke="#cff1f7"
        strokeWidth="4"
        strokeLinecap="round"
      />
    </g>
  );
}
export function Pipette({
  x,
  y,
  color = palette.cyan,
  amount = 0,
  label = "",
}: {
  x: number;
  y: number;
  color?: string;
  amount?: number;
  label?: string;
}) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect x="-8" y="-58" width="16" height="55" rx="4" fill="#b9d1de" />
      <rect x="-6" y="-49" width="12" height="37" fill={color} opacity=".8" />
      <path d="M-5 -3 H5 L2 15 H-2 Z" fill="#d1e7ef" />
      <rect x="-14" y="-71" width="28" height="20" rx="7" fill="#5486a6" />
      {amount > 0 && amount < 1 && (
        <path
          d="M0 -9 C-13 8 -7 16 0 16 C9 16 12 7 0 -9"
          transform={`translate(0 ${20 + amount * 65}) scale(.6)`}
          fill={color}
        />
      )}
      <text x="28" y="-24" fill="#bbd4e5" fontSize="12">
        {label}
      </text>
    </g>
  );
}
export function Hotplate({
  x,
  y,
  on = false,
  progress = 0,
}: {
  x: number;
  y: number;
  on?: boolean;
  progress?: number;
}) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect
        x="-91"
        y="-7"
        width="182"
        height="9"
        rx="4"
        fill={on ? "#e9a47c" : "#7593aa"}
      />
      <rect x="-84" y="3" width="168" height="26" rx="6" fill="#42647e" />
      <rect x="-75" y="9" width="47" height="13" rx="3" fill="#142e45" />
      <text
        x="-51"
        y="19"
        textAnchor="middle"
        fontSize="8"
        fill={on ? "#ffbf91" : "#89a8be"}
      >
        {on ? "HEATING" : "STANDBY"}
      </text>
      <circle cx="55" cy="15" r="7" fill="#bed0db" />
      {on &&
        [0, 1, 2].map((i) => (
          <path
            key={i}
            d={`M${-30 + i * 30} -17 q-8 -10 0 -20 q8 -10 0 -20`}
            transform={`translate(0 ${Math.sin(progress * 20 + i) * 3})`}
            fill="none"
            stroke="#ffc18c"
            opacity={0.3 + 0.25 * Math.sin(progress * 30 + i)}
            strokeWidth="2"
          />
        ))}
      <text x="0" y="47" textAnchor="middle" fontSize="10" fill="#9bb6c9">
        BẾP GIA NHIỆT
      </text>
    </g>
  );
}
export function SceneLabel({
  x,
  y,
  title,
  subtitle,
  align = "middle",
}: {
  x: number;
  y: number;
  title: string;
  subtitle?: string;
  align?: "middle" | "start" | "end";
}) {
  return (
    <g textAnchor={align}>
      <text
        x={x}
        y={y}
        fontSize="12"
        letterSpacing="1.2"
        fontWeight="650"
        fill="#d1e8f7"
      >
        {title}
      </text>
      {subtitle && (
        <text x={x} y={y + 19} fontSize="10" fill="#83a8c1">
          {subtitle}
        </text>
      )}
    </g>
  );
}
export function Residue({
  x,
  y,
  name,
  r,
  scale = 1,
  color = palette.blue,
}: {
  x: number;
  y: number;
  name: string;
  r: string;
  scale?: number;
  color?: string;
}) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <rect
        x="-55"
        y="-59"
        width="110"
        height="130"
        rx="21"
        fill={color}
        fillOpacity=".065"
        stroke={color}
        strokeOpacity=".22"
      />
      <Bond x1={-29} y1={0} x2={0} y2={0} width={3} />
      <Bond x1={0} y1={0} x2={32} y2={0} width={3} />
      <Bond x1={0} y1={0} x2={0} y2={33} width={3} />
      <Orb x={-35} y={0} label="N" r={13} color={palette.blue} />
      <Orb x={0} y={0} label="Cα" r={17} color={color} />
      <Orb x={35} y={0} label="C" r={13} color="#a7c4dd" />
      <Bond x1={35} y1={-10} x2={35} y2={-28} double width={2} />
      <Orb x={35} y={-35} label="O" r={10} color={palette.coral} />
      <text x="0" y="54" textAnchor="middle" fontSize="10" fill="#d4dfef">
        R = {r}
      </text>
      <text
        x="-36"
        y="-34"
        textAnchor="middle"
        fill={color}
        fontWeight="700"
        fontSize="13"
      >
        {name}
      </text>
    </g>
  );
}
export function PolymerUnit({
  x,
  y,
  index,
  m,
}: {
  x: number;
  y: number;
  index: number;
  m: number;
}) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect
        x="-60"
        y="-58"
        width="120"
        height="125"
        rx="20"
        fill="#6c94c8"
        fillOpacity=".07"
        stroke="#73a4ca"
        strokeOpacity=".3"
      />
      <Bond x1={-43} y1={0} x2={43} y2={0} width={3} />
      <Orb x={-45} y={0} label="N" color={palette.blue} r={12} />
      <rect
        x="-25"
        y="-17"
        width="56"
        height="34"
        rx="11"
        fill="#5b769b"
        stroke="#97b9d4"
        strokeOpacity=".3"
      />
      <text y="4" textAnchor="middle" fontSize="11" fill="#e2efff">
        (CH₂){m === 5 ? "₅" : "₆"}
      </text>
      <Orb x={45} y={0} label="C" color="#a7c4dd" r={12} />
      <Bond x1={45} y1={-10} x2={45} y2={-28} double width={2} />
      <Orb x={45} y={-36} label="O" color={palette.coral} r={10} />
      <text
        x="-33"
        y="-36"
        fontSize="12"
        textAnchor="middle"
        fill={palette.gold}
      >
        M{index + 1}
      </text>
      <text x="0" y="49" textAnchor="middle" fontSize="10" fill="#94b6d0">
        {m + 1} carbon
      </text>
    </g>
  );
}
