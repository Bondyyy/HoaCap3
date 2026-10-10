import AssemblyScene from "./scenes/AssemblyScene";
import { useState } from "react";
import { bonds, peptideFormula, permutations } from "../../utils/chemistry";
import { useAnimation } from "../../hooks/useAnimation";
import { Canvas, Controls, Equation, Stage } from "./Shared";
export default function Peptide() {
  const [chain, setChain] = useState(["Gly", "Ala", "Val"]);
  const a = useAnimation(chain.join("-")),
    joined = Math.min(
      bonds(chain.length),
      Math.floor(a.progress * chain.length),
    );
  return (
    <div>
      <div className="field-row">
        <label>
          Độ dài
          <select
            value={chain.length}
            onChange={(e) =>
              setChain(
                Array.from(
                  { length: +e.target.value },
                  (_, i) => chain[i] ?? "Gly",
                ),
              )
            }
          >
            {[2, 3, 4].map((x) => (
              <option key={x}>{x}</option>
            ))}
          </select>
        </label>
        {chain.map((x, i) => (
          <label key={i}>
            Gốc {i + 1}
            <select
              value={x}
              onChange={(e) =>
                setChain(chain.map((c, j) => (i === j ? e.target.value : c)))
              }
            >
              {["Gly", "Ala", "Val"].map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </label>
        ))}
        <button className="btn" onClick={() => setChain([...chain].reverse())}>
          Đảo thứ tự
        </button>
      </div>
      <Canvas label="Ghép liên kết peptide từ đầu N đến đầu C">
        <AssemblyScene p={a.progress} chain={chain} />
      </Canvas>
      <Controls a={a} />
      <Stage
        a={a}
        steps={[
          "Chọn thứ tự",
          "Định hướng N → C",
          "Ghép CO–NH",
          "Chuỗi peptide",
        ]}
      />
      <Equation>
        {chain.join(" + ")} → {chain.join("–")} + {bonds(chain.length)}H₂O
        <br />
        {peptideFormula(chain)}
      </Equation>
      <p className="note">
        Chuỗi mạch hở: {bonds(chain.length)} liên kết peptide. Với thành phần
        này có {permutations(chain)} thứ tự phân biệt (đã tính gốc lặp). Sơ đồ
        ghép hình thức, không phải quy trình chỉ trộn các amino acid trong nước.
      </p>
    </div>
  );
}
