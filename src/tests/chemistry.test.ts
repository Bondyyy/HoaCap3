import { describe, it, expect } from "vitest";
import { amino, aminoAcids, acidBase } from "../data/aminoAcids";
import {
  charge,
  displacement,
  bonds,
  biuret,
  cutChain,
  permutations,
  polymer,
  peptideFormula,
  hydrolysis,
} from "../utils/chemistry";
import { questions } from "../data/questions";
import { lessons } from "../data/lessons";
import { reactions } from "../data/reactions";
import { correct, grade } from "../utils/quiz";
// Independent atom-count parser for the explicitly supported condensed formulas.
function atoms(input: string): Record<string, number> {
  const sub = "₀₁₂₃₄₅₆₇₈₉";
  const s = input
    .replace(/[₀-₉]/g, (x) => String(sub.indexOf(x)))
    .replace(/[⁺⁻–−\s↓]/g, "")
    .replace(/\[/g, "(")
    .replace(/\]/g, ")");
  const sum: Record<string, number> = {};
  for (const piece of s.split("·")) {
    const coeff = +(piece.match(/^\d+/)?.[0] || 1);
    const tokens =
      piece.replace(/^\d+/, "").match(/[A-Z][a-z]?|\d+|[()]/g) || [];
    let i = 0;
    function parse(): Record<string, number> {
      const out: Record<string, number> = {};
      while (i < tokens.length) {
        const t = tokens[i++];
        if (t === ")") break;
        let group: Record<string, number>;
        if (t === "(") group = parse();
        else group = { [t]: 1 };
        const mult = /^\d+$/.test(tokens[i] || "") ? +tokens[i++] : 1;
        for (const [k, v] of Object.entries(group))
          out[k] = (out[k] || 0) + v * mult;
      }
      return out;
    }
    for (const [k, v] of Object.entries(parse()))
      sum[k] = (sum[k] || 0) + v * coeff;
  }
  return sum;
}
function side(s: string) {
  const total: Record<string, number> = {};
  for (const item of s.split(" + ")) {
    for (const [k, v] of Object.entries(atoms(item)))
      total[k] = (total[k] || 0) + v;
  }
  return total;
}
function balanced(eq: string) {
  const [left, right] = eq.split(/ → | ⇌ /);
  expect(side(left), eq).toEqual(side(right));
}
describe("structures and conservation", () => {
  it("contains exactly the five supported structures with correct group counts", () => {
    expect(amino("Gly").formula).toBe("H₂N–CH₂–COOH");
    expect(amino("Lys").amino).toBe(2);
    expect(amino("Glu").carboxyl).toBe(2);
    expect(aminoAcids).toHaveLength(5);
  });
  it.each(aminoAcids)(
    "$id structure equals molecular formula and independently computed mass",
    (a) => {
      expect(atoms(a.formula)).toEqual(atoms(a.molecular));
      const weight: Record<string, number> = { C: 12, H: 1, N: 14, O: 16 };
      expect(
        Object.entries(atoms(a.molecular)).reduce(
          (n, [k, v]) => n + weight[k] * v,
          0,
        ),
      ).toBe(a.mass);
    },
  );
  it("zwitterion conserves all atoms", () => {
    expect(atoms("H₂N–CH₂–COOH")).toEqual(atoms("⁺H₃N–CH₂–COO⁻"));
    expect(1 - 1).toBe(0);
  });
  it.each(Object.entries(acidBase))(
    "%s acid and base equations conserve atoms",
    (id, eq) => {
      balanced(eq.HCl);
      balanced(eq.NaOH);
      if (id === "Lys") expect(eq.HCl).toContain("2HCl");
      if (id === "Glu") expect(eq.NaOH).toContain("2NaOH");
    },
  );
  it("ester school and HCl equations conserve atoms", () => {
    balanced("H₂NCH₂COOH + C₂H₅OH ⇌ H₂NCH₂COOC₂H₅ + H₂O");
    balanced("H₂NCH₂COOH + C₂H₅OH + HCl ⇌ [H₃NCH₂COOC₂H₅]⁺Cl⁻ + H₂O");
  });
  it("both finite polymers retain terminals and n−1 waters", () => {
    for (const m of [5, 6] as const)
      for (const n of [2, 3, 4]) {
        const p = polymer(m, n);
        expect(atoms(p.monomer).C).toBe(m + 1);
        expect(atoms(p.repeat).C).toBe(m + 1);
        expect(p.water).toBe(n - 1);
        balanced(
          `${n}H2N(CH2)${m}COOH → H2N(CH2)${m}CO(NH(CH2)${m}CO)${n - 1}OH + ${n - 1}H2O`,
        );
      }
  });
});
describe("electrophoresis", () => {
  it.each([
    ["Gly", 0],
    ["Lys", 1],
    ["Glu", -1],
  ])("pH 6 %s correct average charge", (id, result) =>
    expect(charge(6, amino(String(id)).pi!)).toBe(result),
  );
  it("reverses across pI and always gives deterministic final positions", () => {
    for (const a of aminoAcids.filter((a) => a.pi)) {
      expect(displacement(2, a.pi!)).toBeGreaterThan(0);
      expect(displacement(12, a.pi!)).toBeLessThan(0);
      expect(displacement(a.pi!, a.pi!)).toBe(0);
      expect(displacement(6, a.pi!)).toBe(displacement(6, a.pi!));
    }
  });
});
describe("peptides", () => {
  it.each([
    [2, 1],
    [3, 2],
    [4, 3],
  ])("%i residues has %i bonds/waters", (n, expected) =>
    expect(bonds(n)).toBe(expected),
  );
  it("sequence order affects the full structure", () => {
    expect(peptideFormula(["Gly", "Ala"])).not.toBe(
      peptideFormula(["Ala", "Gly"]),
    );
    expect(peptideFormula(["Gly", "Ala", "Val"]).match(/–NH–/g)).toHaveLength(
      2,
    );
  });
  it("assembly conserves atoms and water for repeated and distinct residues", () => {
    for (const seq of [
      ["Gly", "Ala"],
      ["Ala", "Gly"],
      ["Gly", "Ala", "Val"],
      ["Val", "Val", "Gly", "Ala"],
    ])
      balanced(
        seq.map((x) => amino(x).formula).join(" + ") +
          " → " +
          peptideFormula(seq) +
          " + " +
          bonds(seq.length) +
          "H₂O",
      );
  });
  it("partial hydrolysis gives contiguous fragments in all 8 cut combinations", () => {
    const chain = ["Ala", "Gly", "Glu", "Val"];
    for (let mask = 0; mask < 8; mask++) {
      const cuts = [0, 1, 2].filter((i) => mask & (1 << i));
      const fragments = cutChain(chain, cuts);
      expect(fragments.flat()).toEqual(chain);
      expect(fragments.length).toBe(cuts.length + 1);
      if (cuts.length)
        balanced(
          peptideFormula(chain) +
            " + " +
            cuts.length +
            "H₂O → " +
            fragments.map(peptideFormula).join(" + "),
        );
    }
    expect(cutChain(chain, [1])).toEqual([
      ["Ala", "Gly"],
      ["Glu", "Val"],
    ]);
  });
  it.each(Object.entries(hydrolysis))("%s hydrolysis balances atoms", (_, eq) =>
    balanced(eq),
  );
  it.each([
    [1, false],
    [2, false],
    [3, true],
    [4, true],
  ])("Biuret for %i residues is %s", (n, result) =>
    expect(biuret(n as number)).toBe(result),
  );
  it("permutation count handles duplicate residues", () => {
    expect(permutations(["Gly", "Ala", "Val"])).toBe(6);
    expect(permutations(["Gly", "Gly", "Ala"])).toBe(3);
    expect(permutations(["Gly", "Gly"])).toBe(1);
  });
});
describe("source and question bank", () => {
  it("has 8 complete lessons, 8 simulations and 64 unique questions", () => {
    expect(lessons).toHaveLength(8);
    expect(reactions).toHaveLength(8);
    expect(questions).toHaveLength(64);
    expect(new Set(questions.map((q) => q.id)).size).toBe(64);
  });
  it.each(questions)(
    "$id has unambiguous answer, explanation and lesson reference",
    (q) => {
      expect(q.explanation.length).toBeGreaterThan(5);
      expect(q.sourceReference).toContain("PDF");
      expect(
        lessons.some((l) => l.chapter === q.chapter && l.id === q.lessonId),
      ).toBe(true);
      if (q.options && q.type !== "order") {
        expect(q.options.filter((x) => x === q.correctAnswer)).toHaveLength(1);
        expect(new Set(q.options).size).toBe(q.options.length);
      }
      expect(correct(q, q.correctAnswer)).toBe(true);
      expect(correct(q, "")).toBe(false);
    },
  );
  it("independently checks numeric answer rules", () => {
    const expected: Record<string, number> = {
      "amino-6": 2,
      "amino-7": 2,
      "amino-11": 2 * 12 + 5 + 14 + 2 * 16,
      "amino-12": 3 * 12 + 7 + 14 + 2 * 16,
      "amino-13": 5 * 12 + 11 + 14 + 2 * 16,
      "amino-18": 1,
      "amino-19": 2,
      "amino-20": 2,
      "amino-23": 6 - 1,
      "amino-24": 7 - 1,
      "amino-25": 6 - 1,
      "peptide-2": 2 - 1,
      "peptide-3": 3 - 1,
      "peptide-4": 4 - 1,
      "peptide-8": 3 - 1,
      "peptide-9": 3 * 2,
      "peptide-10": (3 * 2) / 2,
      "peptide-13": 75 + 89 - 18,
      "peptide-14": 75 + 89 + 117 - 2 * 18,
      "peptide-15": 3 - 1,
      "peptide-16": 4 - 1,
      "peptide-20": 2,
      "peptide-21": 2,
      "peptide-24": 2,
      "peptide-31": 2,
    };
    for (const q of questions.filter((q) => q.type === "fill")) {
      expect(expected[q.id], q.id).toBeDefined();
      expect(Number(q.correctAnswer), q.id).toBe(expected[q.id]);
    }
  });
  it("numeric normalization allows equivalent formatting but rejects chemical differences", () => {
    const q = questions.find((q) => q.id === "amino-6")!;
    expect(correct(q, " 2,0 ")).toBe(true);
    expect(correct(q, "2.00")).toBe(true);
    expect(correct(q, "20")).toBe(false);
    expect(correct(q, "2 mol")).toBe(false);
  });
  it("order normalization and grading are exact", () => {
    const q = questions.find((q) => q.type === "order")!;
    expect(correct(q, "Ala – Gly – Val")).toBe(true);
    expect(correct(q, "Gly–Ala–Val")).toBe(false);
    expect(grade(questions, {}).score).toBe(0);
    expect(
      grade(
        questions,
        Object.fromEntries(questions.map((q) => [q.id, q.correctAnswer])),
      ),
    ).toEqual({ score: 10, correctCount: 64, totalQuestions: 64 });
  });
});
