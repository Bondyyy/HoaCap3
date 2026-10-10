import Structure from "./Structure";
import AcidBase from "./AcidBase";
import Ester from "./Ester";
import Polymer from "./Polymer";
import Electrophoresis from "./Electrophoresis";
import Peptide from "./Peptide";
import Hydrolysis from "./Hydrolysis";
import Biuret from "./Biuret";
const simulations: Record<string, React.ComponentType> = {
  structure: Structure,
  "acid-base": AcidBase,
  ester: Ester,
  polymer: Polymer,
  electrophoresis: Electrophoresis,
  peptide: Peptide,
  hydrolysis: Hydrolysis,
  biuret: Biuret,
};
export default function Simulation({ id }: { id: string }) {
  const Component = simulations[id];
  return Component ? (
    <div className="simulation">
      <Component />
    </div>
  ) : (
    <p>Trường hợp này chưa được hỗ trợ mô phỏng.</p>
  );
}
