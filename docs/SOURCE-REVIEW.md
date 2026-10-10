# Bản đồ nguồn và chức năng

Nguồn chính: Amino acid - Peptide (2).pdf, 6 trang vật lý; số in trên tài liệu là 4–9/10. Các dòng điền khuyết là nội dung học tập, không phải chỉ dẫn thực thi.

| Bài                              | Mục PDF               | Mô phỏng                                                             |
| -------------------------------- | --------------------- | -------------------------------------------------------------------- |
| A1 Khái niệm, cấu tạo, danh pháp | cuối trang 1, trang 2 | Cấu trúc 5 amino acid                                                |
| A2 Cấu tạo, vật lí               | trang 2               | Ion lưỡng cực Gly                                                    |
| A3 Tính chất hóa học             | trang 3               | HCl/NaOH (Gly, Ala, Lys, Glu), ester Gly, trùng ngưng 6/7-amino acid |
| A4 Điện di                       | trang 3–4             | Gly/Lys/Glu, pH 2–12                                                 |
| A5 Ứng dụng                      | trang 4               | Thẻ ứng dụng                                                         |
| P1 Khái niệm, cấu tạo            | trang 4–5             | Ghép 2–4 gốc Gly/Ala/Val                                             |
| P2 Thủy phân                     | trang 5               | Gly-Gly với enzyme/HCl/NaOH; cắt Ala-Gly-Glu-Val                     |
| P3 Biuret                        | đầu trang 6           | Mẫu 1–4 gốc, kiềm + CuSO4                                            |

## Giới hạn và hiệu chỉnh được công khai

- Không triển khai Amine, Protein hay Enzyme thành chương riêng.
- Tài liệu là phiếu điền khuyết: phần giải thích/đáp án được biên soạn bổ sung theo quy tắc hóa học, không phải trích nguyên văn.
- pI: điện tích trung bình bằng 0, không khẳng định mọi phân tử đều ở cùng một trạng thái. Ngưỡng |pH-pI| ≤ 0,05 chỉ là quy ước trực quan cho mô phỏng.
- Chuyển proton: sơ đồ đầu/cuối bảo toàn nguyên tử; không mô tả đường đi phân tử hay cơ chế trong nước.
- Ester: tách phương trình quy ước THPT khỏi phương trình tạo muối hydrochloride khi có HCl. Không mô phỏng cơ chế electron.
- Trùng ngưng: chuỗi mạch hở hữu hạn có n−1 nước và giữ hai đầu mạch. Mắt xích [–NH–(CH2)m–CO–] với m=5 hoặc 6.
- Peptide: ghép là sơ đồ tổng hợp hình thức, không khẳng định chỉ trộn amino acid trong nước sẽ tạo peptide.
- Thủy phân acid/base định lượng chỉ dùng Gly-Gly; cắt tetrapeptide là sơ đồ ròng trung hòa. Không áp dụng hệ số n NaOH cho peptide có Glu một cách máy móc.
- Biuret âm tính có nghĩa không xuất hiện màu tím đặc trưng; không khẳng định amino acid hoàn toàn không tương tác với Cu(II).
- Màu quỳ và khoảng cách điện di là định tính, không phải số liệu thực nghiệm.

Đối chiếu bổ trợ: https://openstax.org/books/organic-chemistry/pages/26-2-amino-acids-and-the-henderson-hasselbalch-equation-isoelectric-points

Google Apps Script: https://developers.google.com/apps-script/guides/content và https://developers.google.com/apps-script/guides/web . Chưa có endpoint nên không thể chứng nhận CORS/đồng bộ ngoài môi trường thử giả lập.

## Kiến trúc

React Router: /, /register, /login, /lessons, /lessons/:chapter/:lesson, /labs, /labs/:id, /practice, /practice/:quizId, /results/:attemptId, /progress. HashRouter tùy chọn khi hosting không hỗ trợ fallback.
Data → quy tắc hóa học → các mô phỏng độc lập → bài học/phòng lab. Auth PBKDF2 → lưu trữ kiểm tra schema → lịch sử theo user → hàng đợi đồng bộ có xác nhận.
