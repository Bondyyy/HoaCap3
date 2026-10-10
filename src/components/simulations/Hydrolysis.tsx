import HydrolysisScene from "./scenes/HydrolysisScene";
import { useState } from "react";
import { cutChain, hydrolysis, peptideFormula } from "../../utils/chemistry";
import { useAnimation } from "../../hooks/useAnimation";
import { Canvas, Controls, Equation, Stage } from "./Shared";
export default function Hydrolysis() {
  const [mode, setMode] = useState("enzyme"),
    [cuts, setCuts] = useState([1]);
  const a = useAnimation(mode + cuts.join(",")),
    partial = mode === "partial",
    chain = partial ? ["Ala", "Gly", "Glu", "Val"] : ["Gly", "Gly"];
  const ordered = partial ? [...cuts].sort() : [0];
  const applied = ordered.slice(
    0,
    Math.floor(a.progress * (ordered.length + 1)),
  );
  const fragments = cutChain(chain, applied);
  return (
    <div>
      <div className="field-row">
        <label>
          Trường hợp
          <select value={mode} onChange={(e) => setMode(e.target.value)}>
            <option value="enzyme">Gly–Gly · enzyme phù hợp</option>
            <option value="acid">Gly–Gly · HCl dư, đun nóng</option>
            <option value="base">Gly–Gly · NaOH dư, đun nóng</option>
            <option value="partial">Ala–Gly–Glu–Val · cắt chọn lọc</option>
          </select>
        </label>
        {partial &&
          [0, 1, 2].map((i) => (
            <label className="check" key={i}>
              <input
                type="checkbox"
                checked={cuts.includes(i)}
                onChange={() =>
                  setCuts(
                    cuts.includes(i)
                      ? cuts.filter((c) => c !== i)
                      : [...cuts, i],
                  )
                }
              />
              Cắt {chain[i]} | {chain[i + 1]}
            </label>
          ))}
      </div>
      <Canvas label="Nước tham gia cắt liên kết peptide">
        <HydrolysisScene
          p={a.progress}
          chain={chain}
          cuts={ordered}
          mode={mode}
        />
      </Canvas>
      <Controls a={a} />
      <Stage
        a={a}
        steps={[
          "Peptide ban đầu",
          "Nước và điều kiện",
          "Cắt liên kết đã chọn",
          "Sản phẩm",
        ]}
      />
      <Equation>
        {partial
          ? `${chain.join("–")} + ${cuts.length}H₂O → ${cutChain(chain, cuts)
              .map((f) => f.join("–"))
              .join(" + ")}`
          : hydrolysis[mode as keyof typeof hydrolysis]}
      </Equation>
      {partial && (
        <div className="equation small">
          {cutChain(chain, cuts)
            .map((f) => peptideFormula(f))
            .join(" + ")}
        </div>
      )}
      <p className="note">
        {partial
          ? "Các vị trí cắt là lựa chọn giáo dục, không khẳng định một enzyme cụ thể cắt mọi vị trí. Sản phẩm trung hòa trong phương trình ròng. Nếu không chọn liên kết, không có thủy phân."
          : mode === "acid"
            ? "Sản phẩm: 2 muối [H₃NCH₂COOH]⁺Cl⁻; tổng cộng 1 H₂O và 2 HCl tham gia."
            : mode === "base"
              ? "Phương trình tổng dùng 2 NaOH và tạo 1 H₂O. Ký hiệu OH | H trên hình chỉ minh họa cách tách mạch theo sơ đồ trung hòa."
              : "Enzyme phải phù hợp với cơ chất và điều kiện; sản phẩm vẽ ở dạng phân tử quy ước."}
      </p>
    </div>
  );
}
