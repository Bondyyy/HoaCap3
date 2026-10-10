import AminoModel from "../chemistry/AminoModel";
import { Orb, palette } from "../chemistry/Graphics";
import { useState } from "react";
import { amino, aminoAcids } from "../../data/aminoAcids";
import { useAnimation } from "../../hooks/useAnimation";
import { Canvas, Controls, Equation, Stage } from "./Shared";
export default function Structure() {
  const [id, setId] = useState("Gly"),
    [highlight, setHighlight] = useState("all"),
    [mode, setMode] = useState("structure"),
    [compare, setCompare] = useState(false),
    [direction, setDirection] = useState("forward");
  const acid = amino(id),
    a = useAnimation(id + mode + direction);
  const chemP = direction === "forward" ? a.progress : 1 - a.progress;
  const zw = mode === "ion" && chemP >= 0.65;
  return (
    <div>
      <div className="field-row">
        <label>
          Amino acid
          <select
            value={id}
            onChange={(e) => {
              setId(e.target.value);
              setMode("structure");
            }}
          >
            {aminoAcids.map((x) => (
              <option key={x.id} value={x.id}>
                {x.name}
              </option>
            ))}
          </select>
        </label>
        <label>
          Tô sáng
          <select
            value={highlight}
            onChange={(e) => setHighlight(e.target.value)}
          >
            <option value="all">Tất cả nhóm</option>
            <option value="amino">Nhóm NH₂ (xanh)</option>
            <option value="carboxyl">Nhóm COOH (cam)</option>
            <option value="r">Gốc R (tím)</option>
          </select>
        </label>
        <label>
          Chế độ
          <select value={mode} onChange={(e) => setMode(e.target.value)}>
            <option value="structure">Khám phá cấu trúc</option>
            <option value="ion" disabled={id !== "Gly"}>
              Ion lưỡng cực (Gly)
            </option>
          </select>
        </label>
        {mode === "ion" && (
          <label>
            Chiều chuyển dạng
            <select
              value={direction}
              onChange={(e) => setDirection(e.target.value)}
            >
              <option value="forward">Phân tử → ion lưỡng cực</option>
              <option value="reverse">Ion lưỡng cực → phân tử</option>
            </select>
          </label>
        )}
        <label className="check">
          <input
            type="checkbox"
            checked={compare}
            onChange={(e) => setCompare(e.target.checked)}
          />
          So sánh 5 chất
        </label>
      </div>
      <Canvas label={`${acid.name}: ${zw ? "ion lưỡng cực" : acid.formula}`}>
        <AminoModel
          r={acid.r}
          zwitter={zw}
          highlight={highlight}
          transferring={mode === "ion" && chemP > 0.2 && chemP < 0.65}
        />
        {mode === "ion" && chemP > 0.2 && chemP < 0.65 && (
          <Orb
            x={545 - ((chemP - 0.2) / 0.45) * 322}
            y={
              230 -
              ((chemP - 0.2) / 0.45) * 67 -
              Math.sin(((chemP - 0.2) / 0.45) * Math.PI) * 110
            }
            label="H⁺"
            r={16}
            color={palette.gold}
          />
        )}
        <text x="360" y="330" textAnchor="middle" fill="#92b1c8" fontSize="13">
          {mode === "ion"
            ? "Chuyển proton: sơ đồ trạng thái đầu/cuối, không phải đường đi thực trong nước."
            : `${acid.amino} nhóm amino · ${acid.carboxyl} nhóm carboxyl`}
        </text>
      </Canvas>
      <Equation>
        {acid.name} · {acid.molecular} · M = {acid.mass}
        <br />
        {acid.systematic} · {acid.semi}
      </Equation>
      {mode === "ion" ? (
        <>
          <Controls a={a} />
          <Stage
            a={a}
            steps={
              direction === "reverse"
                ? [
                    "Ion lưỡng cực",
                    "NH₃⁺ nhường proton",
                    "COO⁻ nhận proton",
                    "Dạng phân tử",
                  ]
                : [
                    "Dạng phân tử",
                    "COOH nhường H⁺",
                    "NH₂ nhận H⁺",
                    "⁺H₃N–CH₂–COO⁻",
                  ]
            }
          />
          <p className="note">
            Dạng cuối giữ nguyên C₂H₅NO₂, tổng điện tích 0. Chỉ mô phỏng chuyển
            proton cho Gly; cấu trúc ion của các chất khác chưa được hỗ trợ.
          </p>
        </>
      ) : (
        <p className="note">
          Chọn nhóm để tô sáng. Với Lys/Glu, gốc R chứa thêm NH₂/COOH; bảng bên
          dưới ghi đủ số nhóm. Đổi sang Gly → Ion lưỡng cực để chạy chuyển
          proton.
        </p>
      )}
      {compare && (
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>Tên</th>
                <th>Cấu trúc</th>
                <th>NH₂ / COOH</th>
                <th>M</th>
              </tr>
            </thead>
            <tbody>
              {aminoAcids.map((x) => (
                <tr key={x.id}>
                  <td>{x.name}</td>
                  <td className="chem">{x.formula}</td>
                  <td>
                    {x.amino} / {x.carboxyl}
                  </td>
                  <td>{x.mass}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
