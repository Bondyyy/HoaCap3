import type { Question } from "../types";
export const applications: Question[] = [
  {
    id: "application-1",
    chapter: "amino",
    lessonId: "applications",
    type: "choice",
    difficulty: "easy",
    question: "Các đơn vị nào kiến tạo nên chuỗi polypeptide?",
    options: ["Các amino acid", "Các phân tử ethanol", "Các ion sodium"],
    correctAnswer: "Các amino acid",
    explanation: "Các gốc amino acid liên kết với nhau qua liên kết peptide.",
    points: 1,
    sourceReference: "PDF trang 4",
  },
  {
    id: "application-2",
    chapter: "amino",
    lessonId: "applications",
    type: "choice",
    difficulty: "easy",
    question: "Muối monosodium glutamate được dùng làm gì?",
    options: ["Thành phần bột ngọt", "Điện cực âm", "Thuốc thử Biuret"],
    correctAnswer: "Thành phần bột ngọt",
    explanation:
      "MSG là muối monosodium của glutamic acid, được dùng làm bột ngọt.",
    points: 1,
    sourceReference: "PDF trang 4",
  },
  {
    id: "application-3",
    chapter: "amino",
    lessonId: "applications",
    type: "choice",
    difficulty: "easy",
    question:
      "Số 6 trong polyamide-6 tương ứng với điều gì ở monomer 6-aminohexanoic acid?",
    options: ["6 nguyên tử carbon", "6 nhóm amino", "6 nhóm carboxyl"],
    correctAnswer: "6 nguyên tử carbon",
    explanation:
      "Monomer có 5 nhóm CH₂ và một carbon trong COOH, tổng cộng 6 carbon.",
    points: 1,
    sourceReference: "PDF trang 4",
  },
];

export const sectionQuestionIds: Record<string, string[]> = {
  concept: ["amino-1", "amino-9", "amino-10"],
  physical: ["amino-14", "amino-17"],
  reactions: ["amino-19", "amino-21", "amino-25"],
  electrophoresis: ["amino-31", "amino-26", "amino-29"],
  structure: ["peptide-2", "peptide-7", "peptide-10"],
  hydrolysis: ["peptide-15", "peptide-18", "peptide-22"],
  biuret: ["peptide-28", "peptide-26"],
};
