import AcidBaseScene from "./scenes/AcidBaseScene";
import { useState } from "react";
import { acidBase, amino } from "../../data/aminoAcids";
import { useAnimation } from "../../hooks/useAnimation";
import { Canvas, Controls, Equation, Stage } from "./Shared";
export default function AcidBase() {
  const [id, setId] = useState("Gly"),
    [reagent, setReagent] = useState<"HCl" | "NaOH">("HCl");
  const a = useAnimation(id + reagent),
    acid = amino(id);
  const eq = acidBase[id][reagent],
    count = reagent === "HCl" ? acid.amino : acid.carboxyl;
  return (
    <div>
      <div className="field-row">
        <label>
          Amino acid
          <select value={id} onChange={(e) => setId(e.target.value)}>
            {Object.keys(acidBase).map((x) => (
              <option key={x}>{x}</option>
            ))}
          </select>
        </label>
        <label>
          Thuốc thử
          <select
            value={reagent}
            onChange={(e) => setReagent(e.target.value as "HCl" | "NaOH")}
          >
            <option>HCl</option>
            <option>NaOH</option>
          </select>
        </label>
        <span className="pill">
          {count} mol {reagent} / mol {id}
        </span>
      </div>
      <Canvas label="Thêm thuốc thử và biến đổi nhóm chức">
        <AcidBaseScene id={id} reagent={reagent} p={a.progress} />
      </Canvas>
      <Controls a={a} />
      <Stage
        a={a}
        steps={[
          "Amino acid",
          "Thêm thuốc thử",
          "Biến đổi nhóm chức",
          "Muối tương ứng",
        ]}
      />
      <Equation>{eq}</Equation>
      <p className="note">
        {id === "Lys"
          ? "Lys có 2 NH₂ và 1 COOH."
          : id === "Glu"
            ? "Glu có 1 NH₂ và 2 COOH."
            : "Một NH₂ và một COOH."}{" "}
        Đây là sơ đồ phản ứng tổng, không mô phỏng cơ chế. Quỳ tím theo THPT:{" "}
        {id === "Lys" ? "xanh" : id === "Glu" ? "đỏ" : "không đổi màu rõ"}; phụ
        thuộc điều kiện dung dịch.
      </p>
    </div>
  );
}
