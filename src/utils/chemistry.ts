export function charge(ph: number, pi: number) {
  return Math.abs(ph - pi) <= 0.0500001 ? 0 : ph < pi ? 1 : -1;
}
export function displacement(ph: number, pi: number) {
  return charge(ph, pi) * Math.min(210, 80 + Math.abs(ph - pi) * 24);
}
export function bonds(n: number) {
  if (!Number.isInteger(n) || n < 1) throw Error("Số gốc không hợp lệ");
  return n - 1;
}
export const biuret = (n: number) => bonds(n) >= 2;
export function cutChain(chain: string[], cuts: number[]) {
  const out: string[][] = [];
  let start = 0;
  for (let i = 0; i < chain.length - 1; i++)
    if (cuts.includes(i)) {
      out.push(chain.slice(start, i + 1));
      start = i + 1;
    }
  out.push(chain.slice(start));
  return out;
}
export function permutations(chain: string[]) {
  const fact = (n: number): number => (n < 2 ? 1 : n * fact(n - 1));
  const counts: Record<string, number> = {};
  chain.forEach((x) => (counts[x] = (counts[x] || 0) + 1));
  return (
    fact(chain.length) / Object.values(counts).reduce((p, n) => p * fact(n), 1)
  );
}
export function polymer(m: 5 | 6, n: number) {
  return {
    monomer: `H₂N–(CH₂)${m === 5 ? "₅" : "₆"}–COOH`,
    repeat: `[–NH–(CH₂)${m === 5 ? "₅" : "₆"}–CO–]`,
    water: bonds(n),
  };
}
export function peptideFormula(chain: string[]) {
  const backbone: Record<string, string> = {
    Gly: "CH₂",
    Ala: "CH(CH₃)",
    Val: "CH[CH(CH₃)₂]",
    Glu: "CH(CH₂CH₂COOH)",
  };
  return (
    "H₂N–" +
    chain
      .map((x) => {
        if (!backbone[x]) throw Error("Gốc chưa hỗ trợ");
        return backbone[x] + "–CO";
      })
      .join("–NH–") +
    "OH"
  );
}
export const hydrolysis = {
  enzyme: "H₂NCH₂CONHCH₂COOH + H₂O → 2H₂NCH₂COOH",
  acid: "H₂NCH₂CONHCH₂COOH + H₂O + 2HCl → 2[H₃NCH₂COOH]⁺Cl⁻",
  base: "H₂NCH₂CONHCH₂COOH + 2NaOH → 2H₂NCH₂COONa + H₂O",
};
