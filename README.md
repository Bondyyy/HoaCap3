# AminoLab — Amino Acid & Peptide

Ứng dụng React + Vite + TypeScript, Tailwind CSS, React Router, Lucide; công thức Unicode/SVG dễ đọc, không dùng ảnh AI cho cấu trúc. Phạm vi: 8 bài học, 8 nhóm mô phỏng, 64 câu tự biên soạn từ hai chương trong PDF. Xem `docs/SOURCE-REVIEW.md` về bản đồ nguồn, giản lược THPT và giới hạn mô phỏng.

## Chạy trên máy

Node.js 22.12+ hoặc Node 24 (đã kiểm tra bằng Node 24). Trong thư mục dự án:

```powershell
npm install
npm run dev
```

Mở URL localhost do Vite in ra. Web Crypto cần HTTPS hoặc localhost. Các lệnh khác:

```powershell
npm run test
npm run build
npm run preview
```

## Cấu hình

Copy `.env.example` thành `.env`. Không cần cấu hình để học, mô phỏng, đăng ký và luyện tập. `VITE_APPS_SCRIPT_URL` chỉ dùng khi đã triển khai Apps Script theo `google-apps-script/README.md`. Không lưu bí mật vào VITE_*.

## Các chức năng

- Trang chủ, danh sách/tìm bài, mục lục, đánh dấu hoàn thành, mô phỏng nhúng, tự kiểm tra.
- Phòng lab: cấu trúc 5 chất, chuyển proton Gly, acid–base 4 chất, ester, 2 loại polyamide, điện di 3 chất, ghép peptide 2–4 gốc, thủy phân, Biuret. Cấu trúc + ion là một nhóm nên tổng 8 nhóm.
- Chọn chất/điều kiện đặt lại timeline; Play/Pause/Reset/Replay và tốc độ 1×/2×. Mô phỏng cấu trúc tĩnh có chọn/tô nhóm; chuyển sang Gly / Ion lưỡng cực để chạy.
- 64 câu ở hai chương, ba độ khó; bộ đề cố định hoặc ngẫu nhiên; trắc nghiệm, đúng/sai, nhập số, xếp thứ tự. Nội dung phủ đủ 12 nhóm kỹ năng của brief.
- Bản nháp bài làm lưu riêng theo tài khoản/bộ đề, giữ khi reload. Thời gian thực từ bắt đầu, không tự nộp. Điểm thang 10, 1 điểm thô/câu.
- PBKDF2 SHA-256 210.000 vòng + salt ngẫu nhiên; không lưu mật khẩu gốc. Đây chỉ là tài khoản demo cục bộ. Không dùng mật khẩu thật. Xóa dữ liệu trình duyệt có thể mất tài khoản/lịch sử.
- Tiến độ, lịch sử, kết quả riêng cho mỗi user. Kết quả sai schema bị bỏ qua; dữ liệu khác giữ nguyên. User bị xóa thì phiên không còn hiệu lực. Không có chống gian lận.
- Kết quả pending được giữ khi offline/lỗi CORS; thử lại khi online/đăng nhập hoặc bằng nút trên kết quả. Chỉ đánh dấu synced khi server xác nhận đúng Submission ID.

## Cấu trúc

```text
src/data/                 Nội dung bài học, amino acid, phản ứng, 64 câu
src/utils/                Quy tắc hóa học và chấm điểm
src/components/layout/    Header, footer, shell
src/components/simulations/ 8 component mô phỏng và controls dùng chung
src/pages/                Các trang và luồng người dùng
src/hooks/                Timeline và context tài khoản
src/services/             Auth, lưu trữ có validation, Sheets
src/types/                Giao diện TypeScript
src/tests/                Hóa học, dữ liệu, lưu trữ, auth, chấm điểm, đồng bộ
google-apps-script/       Server Google Sheets và hướng dẫn
docs/                     Phân tích nguồn và biên bản kiểm thử
```

## Hosting tĩnh miễn phí (tự triển khai sau)

Chạy `npm run build`, upload `dist/`. Netlify/Cloudflare Pages dùng build `npm run build`, output `dist`; cấu hình SPA fallback về `index.html` cho đường dẫn bài học. Để dùng GitHub Pages hoặc hosting không có fallback, đặt `VITE_ROUTER_MODE=hash` trong `.env`, build lại; URL dùng `/#/lessons` và tài nguyên dùng base tương đối trong chế độ hash (chế độ browser dùng base /). `.env.example` ghi sẵn tùy chọn này. Local mặc định giữ các route `/lessons`, `/labs` như brief.

## Hóa học và mô phỏng

Mô phỏng là sơ đồ giáo dục định tính, không là thí nghiệm thực hoặc cơ chế phân tử. Điện di dùng pI từ PDF, ngưỡng trực quan ±0,05; khoảng cách không đo bằng mm. Tài liệu nguồn là phiếu điền khuyết: lời giải, ví dụ và câu hỏi được biên soạn bổ sung, không gán là nguyên văn PDF. Không có chương Amine/Protein/Enzyme riêng. Không có API AI trả phí.

## Trạng thái kiểm chứng

Xem `docs/VALIDATION.md` cho kết quả kiểm tra thực tế. Đồng bộ Google Sheets chưa kiểm chứng end-to-end vì người dùng chưa có Web App URL; đã có mã cấu hình và kiểm thử client/server giả lập. Không coi test giả lập là xác nhận CORS thật.
