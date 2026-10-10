import ElectrophoresisScene from "./scenes/ElectrophoresisScene";
import { useState } from "react";
import { aminoAcids } from "../../data/aminoAcids";
import { charge, displacement } from "../../utils/chemistry";
import { useAnimation } from "../../hooks/useAnimation";
import { Canvas, Controls, Equation, Stage } from "./Shared";
export default function Electrophoresis() {
  const [ph, setPh] = useState(6),
    [selected, setSelected] = useState("all");
  const a = useAnimation(`${ph}-${selected}`);
  const acids = aminoAcids.filter(
    (x) => x.pi !== undefined && (selected === "all" || x.id === selected),
  );
  return (
    <div>
      <div className="field-row">
        <label className="range-label">
          pH môi trường <strong>{ph.toFixed(2)}</strong>
          <input
            aria-label="pH môi trường"
            type="range"
            min="2"
            max="12"
            step="0.01"
            value={ph}
            onChange={(e) => setPh(+e.target.value)}
          />
        </label>
        <label>
          Mẫu
          <select
            value={selected}
            onChange={(e) => setSelected(e.target.value)}
          >
            <option value="all">Hỗn hợp Gly + Lys + Glu</option>
            {["Gly", "Lys", "Glu"].map((x) => (
              <option key={x}>{x}</option>
            ))}
          </select>
        </label>
        <button
          className="btn"
          onClick={() => {
            setPh(6);
            a.reset();
          }}
        >
          Ví dụ pH = 6
        </button>
      </div>
      <Canvas label="Bể điện di: anode dương bên trái, cathode âm bên phải">
        <ElectrophoresisScene p={a.progress} ph={ph} selected={selected} />
      </Canvas>
      <Controls a={a} />
      <Stage
        a={a}
        steps={["Mẫu tại gốc", "Đặt pH", "Bật điện trường", "Vị trí cuối"]}
      />
      <div className="mini-grid">
        {acids.map((x) => (
          <div className="mini-card" key={x.id}>
            <strong>
              {x.name} · pI {x.pi}
            </strong>
            <p>
              {charge(ph, x.pi!) === 0
                ? "Gần pI → gần như đứng yên"
                : charge(ph, x.pi!) > 0
                  ? "Điện tích TB dương → cathode (−)"
                  : "Điện tích TB âm → anode (+)"}
            </p>
          </div>
        ))}
      </div>
      <Equation>
        pH &lt; pI: (+) → cathode (−) · pH &gt; pI: (−) → anode (+)
      </Equation>
      <p className="note">
        Quy ước trực quan: |pH − pI| ≤ 0,05 coi như gần đứng yên. Không tính
        điện tích phân số hay vận tốc thực; tại pI, điện tích trung bình bằng 0.
      </p>
    </div>
  );
}
