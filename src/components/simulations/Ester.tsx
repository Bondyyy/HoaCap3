import EsterScene from "./scenes/EsterScene";
import { useState } from "react";
import { useAnimation } from "../../hooks/useAnimation";
import { Canvas, Controls, Equation, Stage } from "./Shared";
export default function Ester() {
  const [mode, setMode] = useState("hcl");
  const a = useAnimation(mode);
  const product = mode === "hcl" ? "[H₃NCH₂COOC₂H₅]⁺Cl⁻" : "H₂NCH₂COOC₂H₅";
  return (
    <div>
      <div className="field-row">
        <label>
          Cách biểu diễn
          <select value={mode} onChange={(e) => setMode(e.target.value)}>
            <option value="hcl">Muối trong HCl</option>
            <option value="school">Quy ước THPT (H₂SO₄, t°)</option>
          </select>
        </label>
        <span className="pill">Glycine + ethanol · acid · đun nóng</span>
      </div>
      <Canvas label="Ester hóa: bình phản ứng, gia nhiệt và tách nước">
        <EsterScene p={a.progress} mode={mode} />
      </Canvas>
      <Controls a={a} />
      <Stage
        a={a}
        steps={[
          "Chất tham gia",
          "Acid, đun nóng",
          "Ester hóa COOH",
          "Ester và nước",
        ]}
      />
      <Equation>
        {mode === "hcl"
          ? `H₂NCH₂COOH + C₂H₅OH + HCl ⇌ ${product} + H₂O`
          : `H₂NCH₂COOH + C₂H₅OH ⇌ ${product} + H₂O`}
      </Equation>
      <p className="note">
        {mode === "school"
          ? "Ester trung hòa là biểu diễn giản lược của THPT. Trong dung dịch acid, amino có thể bị proton hóa."
          : "Sản phẩm biểu diễn dưới dạng hydrochloride; NH₃⁺ có ion Cl⁻ đi kèm. HCl còn cung cấp môi trường acid."}{" "}
        Animation biểu diễn chuyển hóa ròng thuận nghịch, không mô tả đường cơ
        chế hay hiệu suất.
      </p>
    </div>
  );
}
