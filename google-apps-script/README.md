# Lưu điểm vào Google Sheets

1. Tạo một Google Sheet mới trong tài khoản của bạn.
2. Chọn **Extensions → Apps Script** để tạo script liên kết với Sheet.
3. Dán nội dung `Code.gs` vào editor, lưu. Trong **Project Settings → Script properties → Add script property**, thêm tên `SPREADSHEET_ID` với giá trị là phần ID nằm giữa `/d/` và `/edit` trong URL Google Sheet. Lưu thuộc tính. Web App mở Sheet bằng ID; không phụ thuộc `getActiveSpreadsheet()`.
4. Chọn **Deploy → New deployment → Web app**. Chạy dưới danh tính chủ script; quyền truy cập phải cho phép học sinh gửi (thường là **Anyone**). Tùy tổ chức, lựa chọn công khai có thể bị quản trị viên chặn.
5. Cấp quyền Spreadsheet cho script. Copy URL kết thúc `/exec`, không dùng `/dev`.
6. Tạo `.env` từ `.env.example`, đặt `VITE_APPS_SCRIPT_URL=https://script.google.com/macros/s/…/exec`, khởi động lại Vite hoặc build lại.
7. Làm và nộp một bài test. Chỉ khi trang kết quả hiện **Google Sheets đã xác nhận lưu bài** và hàng xuất hiện trong tab `Results`, mới coi tích hợp đã kiểm chứng. Kiểm tra cả localhost và origin hosting sau khi deploy.
8. Bấm gửi lại cùng bài: không được thêm hàng thứ hai cùng Submission ID. Tắt mạng, nộp bài rồi bật mạng: bài cục bộ vẫn phải còn và được gửi lại khi online hoặc bấm thử lại.

## CORS và kết quả xác nhận

Client POST JSON dưới Content-Type `text/plain;charset=utf-8` để tránh preflight do `application/json`. ContentService trả JSON qua URL redirect; client theo redirect và đòi `ok:true` cùng đúng `submissionId`. Không dùng `no-cors`, JSONP hoặc suy thành công từ response opaque.

Google Apps Script không cho thêm header CORS tùy ý bằng `TextOutput`. Không thêm `.setHeader()` giả. Nếu trình duyệt/origin/quyền deployment chặn đọc phản hồi, giao diện giữ trạng thái **Chưa xác nhận** dù hàng có thể đã ghi; retry an toàn nhờ Submission ID + ScriptLock. Kiểm tra `/exec`, quyền truy cập anonymous, tab Network và Google execution log. Chưa có URL của bạn nên chưa kiểm tra mạng/CORS thật; unit tests dùng phản hồi giả lập.

Mã xác minh kiểu dữ liệu, giới hạn độ dài, khoảng điểm, tính nhất quán số câu; dùng lock cho dedup và escape chuỗi bắt đầu bằng dấu công thức. Không ghi salt/verifier/mật khẩu. Điểm vẫn do frontend gửi; validation không chứng minh đáp án đúng. Muốn chấm lại trên server phải triển khai thêm ngân hàng đáp án kiểm soát riêng. Username localStorage không chứng minh danh tính, endpoint public có thể bị giả mạo/spam; phù hợp luyện tập demo, không phải hệ thống thi chính thức.

Tài liệu Google: https://developers.google.com/apps-script/guides/web và https://developers.google.com/apps-script/guides/content .
