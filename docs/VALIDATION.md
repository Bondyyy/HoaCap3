# Biên bản kiểm chứng — 10/10/2026

## Kết quả hiện tại

- `npm run test`: **127/127 đạt**, 5 tập kiểm thử.
- `npm run build`: TypeScript và Vite production build thành công.
- Ưu tiên logic hóa học, dữ liệu, chọn đề/chấm điểm, tài khoản/lưu trữ và giao thức đồng bộ. Chỉ giữ hai kiểm thử tích hợp nhỏ cho timeline và thay đổi điều kiện điện di; không dùng snapshot/pixel test toàn bộ giao diện.

## Phạm vi tự động

- Công thức/cân bằng nguyên tử acid–base, ester, polyamide; khối lượng, liên kết peptide, các cách cắt chuỗi, sản phẩm thủy phân; hướng điện di và điều kiện Biuret.
- 64 câu hỏi, đáp án, lời giải, thang điểm; chọn theo chương/độ khó, thứ tự cố định, ngẫu nhiên không trùng và không sửa ngân hàng.
- Đăng ký/đăng nhập, mật khẩu sai, trùng tên, phân tách dữ liệu người dùng, dữ liệu hỏng và lỗi ghi localStorage.
- Client Sheets: payload, acknowledgement đúng ID, lỗi mạng/phản hồi, giữ pending và retry cùng ID không nhân bản lịch sử.
- Apps Script chạy trong môi trường VM giả lập: kiểm tra đầu vào, ghi hàng, chống trùng Submission ID và nội dung bắt đầu bằng ký hiệu công thức.
- Timeline: tốc độ, giới hạn kết thúc, thứ tự các đoạn, pause/reset/replay và đổi điều kiện.

## Smoke test trình duyệt

Trước đợt nâng cấp hình ảnh: đã kiểm tra trang chủ desktop/mobile, đăng ký/đăng nhập tài khoản thử, làm đề 5 câu, reload giữ bản nháp, nộp bài 2/5 đúng = 4/10, lưu kết quả pending khi thiếu endpoint và hoàn thành một bài học trong trang tiến độ.

Sau nâng cấp: kiểm tra trực quan trang chủ với ảnh cục bộ và cảnh Biuret; thao tác chạy mô phỏng. Không chạy lại toàn bộ luồng UI theo chiến lược tiết kiệm kiểm thử của người dùng.

## Giới hạn bàn giao

- Chưa có URL Apps Script do người dùng cung cấp: **chưa xác minh đồng bộ Google Sheets/CORS thực tế**. Test client/server giả lập không thay thế kiểm chứng triển khai thật.
- Tài khoản và lịch sử thuộc trình duyệt hiện tại. Đây là cơ chế demo localStorage, không phải hệ thống xác thực server hay chống gian lận.
- Chuyển động, màu và dụng cụ là minh họa định tính, không phải mô phỏng động lực học hoặc hướng dẫn thực hành thí nghiệm thật. Xem SOURCE-REVIEW.md về phạm vi diễn giải PDF.
- Ảnh stock được lưu trong public/assets; nguồn và giấy phép ghi trong README tại đó. Công thức và hình hóa học do SVG cục bộ dựng, không suy ra từ ảnh stock.

Bàn giao source và localhost; chưa xuất bản hosting.
