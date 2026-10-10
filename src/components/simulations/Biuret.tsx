import BiuretScene from "./scenes/BiuretScene";
import { useState } from "react";
import { biuret } from "../../utils/chemistry";
import { useAnimation } from "../../hooks/useAnimation";
import { Canvas, Controls, Equation, Stage } from "./Shared";
export default function Biuret() {
  const [n, setN] = useState(3);
  const a = useAnimation(String(n), 10000),
    positive = biuret(n);
  const final = Math.max(0, (a.progress - 0.55) / 0.45);
  const color =
    a.progress < 0.3
      ? "#ddecf4"
      : a.progress < 0.55
        ? "#70b8e8"
        : positive
          ? `rgb(${112 + final * 31},${184 - final * 105},${232 - final * 44})`
          : "#70b8e8";
  return (
    <div>
      <div className="field-row">
        <label>
          Mẫu thử
          <select value={n} onChange={(e) => setN(+e.target.value)}>
            <option value={1}>Amino acid đơn lẻ</option>
            <option value={2}>Dipeptide</option>
            <option value={3}>Tripeptide</option>
            <option value={4}>Tetrapeptide</option>
          </select>
        </label>
        <span className="pill">{n - 1} liên kết peptide</span>
        <span className="muted">Bấm Chạy để lần lượt thêm NaOH và CuSO₄</span>
      </div>
      <Canvas label="Biuret: thêm thuốc thử, kết tủa xanh và phức tím">
        <BiuretScene p={a.progress} n={n} />
      </Canvas>
      <Controls a={a} />
      <Stage
        a={a}
        steps={[
          "Mẫu ban đầu",
          "Thêm kiềm và Cu(II)",
          "Cu(OH)₂ xanh",
          "Quan sát phức màu",
        ]}
      />
      <Equation>CuSO₄ + 2NaOH → Cu(OH)₂↓ + Na₂SO₄</Equation>
      <p className="note">
        {n - 1} liên kết peptide:{" "}
        {positive
          ? "đủ ít nhất 2 liên kết, có thể tạo phức màu tím."
          : "không cho màu tím Biuret đặc trưng."}{" "}
        Không dùng màu mô phỏng để định lượng. Mẫu âm tính vẫn có thể tương tác
        khác với Cu(II); hình xanh là minh họa thuốc thử.
      </p>
    </div>
  );
}
