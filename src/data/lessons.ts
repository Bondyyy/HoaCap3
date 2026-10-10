import type { Lesson } from "../types";
export const lessons: Lesson[] = [
  {
    id: "concept",
    chapter: "amino",
    title: "Khái niệm, cấu tạo và danh pháp",
    minutes: 12,
    source: "PDF trang 1–2 · số in 4–5/10",
    labs: ["structure"],
    sections: [
      {
        title: "01 · Hai nhóm chức, một phân tử",
        text: "Amino acid là hợp chất hữu cơ tạp chức chứa đồng thời nhóm amino (–NH₂) và carboxyl (–COOH). Trong α-amino acid, nhóm amino gắn với carbon liền kề nhóm carboxyl.",
        formula: "(H₂N)ₐ–R–(COOH)ᵦ ; α-amino acid: H₂N–CH(R)–COOH",
      },
      {
        title: "02 · Amino acid trong tự nhiên",
        text: "Có 20 amino acid tiêu chuẩn cấu thành phần lớn protein. Amino acid thiết yếu là những chất cơ thể không tự tổng hợp đủ cho nhu cầu, phải nhận từ thức ăn. Lysine và valine là hai ví dụ; glycine, alanine và glutamic acid không thuộc nhóm thiết yếu ở người trưởng thành khỏe mạnh.",
      },
      {
        title: "03 · Đọc tên và công thức",
        text: "Tên thay thế: chọn mạch chính chứa COOH, đánh số carbon carboxyl là 1, ghi vị trí amino. Tên bán hệ thống dùng α, β, γ… tính từ carbon bên cạnh COOH. Alanine là 2-aminopropanoic acid hay α-aminopropionic acid. Tra tên và phân tử khối của đủ 5 chất trong mô phỏng bên dưới.",
        note: "Gly có R=H; Lys có hai nhóm NH₂; Glu có hai nhóm COOH. Phân tử khối dùng C=12, H=1, N=14, O=16 theo THPT.",
      },
    ],
    check: {
      question: "Lysine có bao nhiêu nhóm amino?",
      options: ["1", "2", "3"],
      answer: 1,
      explanation: "Một nhóm α-NH₂ và một nhóm NH₂ ở cuối mạch nhánh.",
    },
  },
  {
    id: "physical",
    chapter: "amino",
    title: "Ion lưỡng cực và tính chất vật lí",
    minutes: 9,
    source: "PDF trang 2 · số in 5/10",
    labs: ["structure"],
    sections: [
      {
        title: "01 · Hai cách biểu diễn",
        text: "Nhóm carboxyl có thể nhường proton và nhóm amino nhận proton. Dạng ion lưỡng cực mang cả điện tích dương và âm. Với glycine, tổng điện tích của dạng này là 0.",
        formula: "H₂N–CH₂–COOH ⇌ ⁺H₃N–CH₂–COO⁻",
        note: "Sơ đồ chuyển proton giúp kiểm kê nguyên tử; trong nước sự chuyển proton có thể qua dung môi. Không xem đường animation là cơ chế phân tử.",
      },
      {
        title: "02 · Từ cấu tạo đến tính chất",
        text: "Ở điều kiện thường, amino acid thường là chất rắn kết tinh không màu, có nhiệt độ nóng chảy cao (thường kèm phân hủy), nhiều chất tan trong nước. Cấu trúc ion giải thích tương tác mạnh giữa các hạt và với nước. Độ tan khác nhau giữa các amino acid.",
        note: "Dạng phân tử thường được dùng trong phương trình THPT; dạng tồn tại thực tế phụ thuộc pH và môi trường.",
      },
    ],
    check: {
      question: "Tổng điện tích của ⁺H₃N–CH₂–COO⁻ là?",
      options: ["+1", "0", "−1"],
      answer: 1,
      explanation:
        "+1 và −1 cộng lại bằng 0; phân tử vẫn có hai nhóm tích điện.",
    },
  },
  {
    id: "reactions",
    chapter: "amino",
    title: "Tính chất hóa học",
    minutes: 20,
    source: "PDF trang 3 · số in 6/10",
    labs: ["acid-base", "ester", "polymer"],
    sections: [
      {
        title: "01 · Tính lưỡng tính",
        text: "Nhóm amino có tính base, nhận proton từ acid; nhóm carboxyl có tính acid, phản ứng với base. Vì thế amino acid tác dụng được với cả HCl và NaOH. Khi dùng đủ thuốc thử, Lys tiêu thụ 2 HCl/mol; Glu tiêu thụ 2 NaOH/mol.",
        formula: "H₂NCH₂COOH + NaOH → H₂NCH₂COONa + H₂O",
        note: "Quy ước quỳ tím THPT: Gly/Ala không đổi màu rõ; Lys làm xanh; Glu làm đỏ. Đây không phải dự đoán chính xác mọi nồng độ.",
      },
      {
        title: "02 · Ester hóa",
        text: "Nhóm COOH phản ứng với alcohol trong môi trường acid, đun nóng tạo ester và nước. Phương trình THPT có thể viết ester trung hòa. Trong môi trường HCl phải xét amino ở dạng NH₃⁺ và ion Cl⁻ đi kèm.",
        formula: "H₂NCH₂COOH + C₂H₅OH ⇌ H₂NCH₂COOC₂H₅ + H₂O",
      },
      {
        title: "03 · Trùng ngưng",
        text: "Khi đun nóng, 6-aminohexanoic acid H₂N(CH₂)₅COOH và 7-aminoheptanoic acid H₂N(CH₂)₆COOH có thể tạo polyamide. COOH của một phân tử và NH₂ của phân tử khác tạo liên kết amide.",
        formula: "Mắt xích: –NH–(CH₂)₅–CO– hoặc –NH–(CH₂)₆–CO–",
        note: "Chuỗi mạch hở hữu hạn từ n monomer giải phóng n−1 H₂O. Cách viết polymer vô hạn bỏ qua nhóm cuối không dùng để đếm nước trong chuỗi hữu hạn.",
      },
    ],
    check: {
      question:
        "Một mol glutamic acid phản ứng hết các nhóm COOH cần bao nhiêu mol NaOH?",
      options: ["1", "2", "3"],
      answer: 1,
      explanation: "Glu có hai nhóm carboxyl nên cần 2 mol NaOH.",
    },
  },
  {
    id: "electrophoresis",
    chapter: "amino",
    title: "Điện di và điểm đẳng điện",
    minutes: 15,
    source: "PDF trang 3–4 · số in 6–7/10",
    labs: ["electrophoresis"],
    sections: [
      {
        title: "01 · Điện tích thay đổi theo pH",
        text: "Điện di là chuyển động có hướng của các hạt tích điện trong điện trường. pI là pH tại đó điện tích trung bình của amino acid bằng 0. Dưới pI, điện tích trung bình dương; trên pI, điện tích trung bình âm.",
        formula: "pH < pI → cathode (−) ; pH > pI → anode (+)",
        note: "Không suy ra một cấu trúc proton hóa duy nhất chỉ từ pH < pI hay pH > pI, đặc biệt với Lys/Glu có nhiều nhóm ion hóa.",
      },
      {
        title: "02 · Ba chất tại pH = 6",
        text: "Glycine pI=5,97: gần đứng yên. Lysine pI=9,74: về cathode âm. Glutamic acid pI=3,22: về anode dương. Nhóm amino bổ sung làm pI Lys cao; nhóm carboxyl bổ sung làm pI Glu thấp.",
      },
      {
        title: "03 · Ba dạng của alanine",
        text: "Ở pH đủ thấp: CH₃CH(NH₃⁺)COOH. Gần điểm đẳng điện: CH₃CH(NH₃⁺)COO⁻. Ở pH đủ cao: CH₃CH(NH₂)COO⁻. Đây là các dạng điển hình khi thay đổi pH, không phải ranh giới chuyển dạng đột ngột ở pI.",
      },
    ],
    check: {
      question: "Lysine đi về điện cực nào ở pH 6?",
      options: ["Anode (+)", "Cathode (−)", "Đứng yên"],
      answer: 1,
      explanation:
        "6 < 9,74 nên điện tích trung bình dương, bị hút về điện cực âm.",
    },
  },
  {
    id: "applications",
    chapter: "amino",
    title: "Amino acid trong đời sống",
    minutes: 7,
    source: "PDF trang 4 · số in 7/10",
    labs: [],
    sections: [
      {
        title: "01 · Đơn vị kiến tạo protein",
        text: "Các amino acid liên kết theo trật tự xác định tạo chuỗi polypeptide. Protein tham gia cấu trúc và nhiều chức năng sinh học. Chủ đề này chỉ dùng làm ứng dụng, không mở rộng thành chương Protein.",
      },
      {
        title: "02 · Dinh dưỡng và thực phẩm",
        text: "Lysine là amino acid thiết yếu, được bổ sung vào thực phẩm và thức ăn chăn nuôi. Monosodium glutamate (MSG) là muối monosodium của glutamic acid, thành phần của bột ngọt.",
        formula: "MSG: HOOC–CH(NH₂)–CH₂–CH₂–COONa (dạng quy ước)",
      },
      {
        title: "03 · Vật liệu polyamide",
        text: "6-Aminohexanoic acid dùng tạo polyamide-6; 7-aminoheptanoic acid tạo polyamide-7. Liên kết amide xuất hiện lặp lại trong mạch polymer. Số 6 và 7 biểu thị số carbon trong monomer.",
      },
    ],
    check: {
      question: "Bột ngọt chứa muối monosodium của chất nào?",
      options: ["Lysine", "Glutamic acid", "Valine"],
      answer: 1,
      explanation: "Monosodium glutamate là muối monosodium của glutamic acid.",
    },
  },
  {
    id: "structure",
    chapter: "peptide",
    title: "Cấu tạo và liên kết peptide",
    minutes: 15,
    source: "PDF trang 4–5 · số in 7–8/10",
    labs: ["peptide"],
    sections: [
      {
        title: "01 · Từ amino acid đến peptide",
        text: "Trong phạm vi THPT, peptide được tạo từ các đơn vị α-amino acid liên kết bằng nhóm –CO–NH–. Hai, ba, bốn gốc lần lượt tạo dipeptide, tripeptide, tetrapeptide; nhiều gốc tạo polypeptide.",
        formula: "n gốc trong chuỗi mạch hở → n−1 liên kết peptide",
      },
      {
        title: "02 · Đọc từ đầu N đến đầu C",
        text: "Đầu N còn nhóm amino tự do, đầu C còn carboxyl tự do. Đọc chuỗi từ N sang C. Gly–Ala và Ala–Gly khác cấu tạo vì vị trí hai gốc bị đảo. Mô phỏng hỗ trợ Gly, Ala, Val trong chuỗi 2–4 gốc.",
      },
      {
        title: "03 · Thứ tự và đồng phân",
        text: "Nếu n gốc đều khác nhau và mỗi gốc xuất hiện đúng một lần, có n! thứ tự. Gly/Ala/Val tạo 6 thứ tự: Gly–Ala–Val, Gly–Val–Ala, Ala–Gly–Val, Ala–Val–Gly, Val–Gly–Ala, Val–Ala–Gly.",
        note: "Nếu lặp gốc, chia cho giai thừa số lần xuất hiện: Gly/Gly/Ala có 3!/2!=3 thứ tự. Đếm chỉ các đồng phân thứ tự của chuỗi mạch hở.",
      },
    ],
    check: {
      question: "Tripeptide mạch hở có bao nhiêu liên kết peptide?",
      options: ["1", "2", "3"],
      answer: 1,
      explanation: "n−1 = 3−1 = 2.",
    },
  },
  {
    id: "hydrolysis",
    chapter: "peptide",
    title: "Phản ứng thủy phân",
    minutes: 16,
    source: "PDF trang 5 · số in 8/10",
    labs: ["hydrolysis"],
    sections: [
      {
        title: "01 · Cắt liên kết peptide",
        text: "Peptide có thể bị thủy phân nhờ acid, base hoặc enzyme phù hợp. Thủy phân hoàn toàn cắt mọi liên kết; không hoàn toàn tạo các đoạn ngắn hơn, đôi khi kèm amino acid tự do.",
        formula: "Gly–Gly + H₂O → 2Gly",
      },
      {
        title: "02 · Môi trường quyết định sản phẩm",
        text: "Trong HCl dư, sản phẩm là muối amoni. Trong NaOH dư, sản phẩm là muối carboxylate. Với n gốc trung tính: phương trình acid dùng n−1 H₂O và n HCl; phương trình base dùng n NaOH, tạo 1 H₂O.",
        note: "Nếu có Lys/Glu, phải tính thêm các nhóm chức ở mạch nhánh. Không dùng các hệ số trên cho mọi peptide.",
      },
      {
        title: "03 · Bảo toàn thứ tự",
        text: "Ala–Gly–Glu–Val có thể cho Ala–Gly, Gly–Glu, Glu–Val, Ala–Gly–Glu, Gly–Glu–Val khi cắt phù hợp. Không sinh Ala–Val bằng cách bỏ gốc ở giữa rồi nối lại. Mỗi sản phẩm là một đoạn liên tiếp của chuỗi gốc.",
      },
    ],
    check: {
      question:
        "Đoạn nào không thể thu được bằng thủy phân thông thường Ala–Gly–Glu–Val?",
      options: ["Ala–Gly", "Gly–Glu", "Ala–Val"],
      answer: 2,
      explanation: "Ala và Val không liền nhau trong chuỗi gốc.",
    },
  },
  {
    id: "biuret",
    chapter: "peptide",
    title: "Phản ứng màu Biuret",
    minutes: 10,
    source: "PDF đầu trang 6 · số in 9/10",
    labs: ["biuret"],
    sections: [
      {
        title: "01 · Thuốc thử và điều kiện",
        text: "Cu(II) trong môi trường kiềm tạo phức màu tím với peptide có ít nhất hai liên kết peptide. Khi pha CuSO₄ với NaOH, có thể quan sát kết tủa Cu(OH)₂ xanh lam trước khi hình thành phức.",
        formula: "CuSO₄ + 2NaOH → Cu(OH)₂↓ + Na₂SO₄",
      },
      {
        title: "02 · So sánh bốn mẫu",
        text: "Amino acid: 0 liên kết peptide, âm tính. Dipeptide: 1 liên kết, âm tính. Tripeptide: 2 liên kết, dương tính. Tetrapeptide: 3 liên kết, dương tính với màu tím đặc trưng.",
        note: "Âm tính Biuret không có nghĩa mẫu không tương tác với Cu(II). Màu trong mô phỏng là định tính, không dùng để suy nồng độ.",
      },
    ],
    check: {
      question: "Mẫu nào cho phản ứng Biuret đặc trưng?",
      options: ["Glycine", "Gly–Gly", "Gly–Ala–Val"],
      answer: 2,
      explanation: "Gly–Ala–Val có hai liên kết peptide.",
    },
  },
];
