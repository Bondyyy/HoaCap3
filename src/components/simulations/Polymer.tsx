import AssemblyScene from "./scenes/AssemblyScene";
import { useState } from "react";
import { polymer } from "../../utils/chemistry";
import { useAnimation } from "../../hooks/useAnimation";
import { Canvas, Controls, Equation, Stage } from "./Shared";
export default function Polymer() {
  const [m, setM] = useState<5 | 6>(5),
    [n, setN] = useState(3);
  const a = useAnimation(`${m}-${n}`),
    p = polymer(m, n),
    joined = Math.min(n - 1, Math.floor(a.progress * n));
  return (
    <div>
      <div className="field-row">
        <label>
          Monomer
          <select value={m} onChange={(e) => setM(+e.target.value as 5 | 6)}>
            <option value={5}>6-Aminohexanoic acid</option>
            <option value={6}>7-Aminoheptanoic acid</option>
          </select>
        </label>
        <label>
          Số monomer
          <select value={n} onChange={(e) => setN(+e.target.value)}>
            {[2, 3, 4].map((x) => (
              <option key={x}>{x}</option>
            ))}
          </select>
        </label>
        <span className="pill">Điều kiện: đun nóng</span>
      </div>
      <Canvas label="Trùng ngưng: nối từng mắt xích và tách nước">
        <AssemblyScene
          p={a.progress}
          chain={Array.from({ length: n }, () => "Gly")}
          polymer
          m={m}
        />
      </Canvas>
      <Controls a={a} />
      <Stage
        a={a}
        steps={["Monomer", "Đun nóng", "Ghép và tách nước", "Mạch polyamide"]}
      />
      <Equation>
        {n} {p.monomer} → H₂N–(CH₂){m === 5 ? "₅" : "₆"}–CO–[NH–(CH₂)
        {m === 5 ? "₅" : "₆"}–CO]₍{n - 1}₎–OH + {n - 1}H₂O
        <br />
        Mắt xích: {p.repeat}
      </Equation>
      <p className="note">
        Các khối trên là đơn vị mạch giản lược; công thức phía dưới giữ đầy đủ
        hai đầu mạch. {n} monomer tạo {n - 1} lần ghép, không phải {n} phân tử
        nước.
      </p>
    </div>
  );
}
