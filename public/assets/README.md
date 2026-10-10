# Nguồn hình ảnh

Ảnh được chọn thủ công; URL, tác giả, trang nguồn và giấy phép nằm trong `src/data/assets.ts`.

- Nathan Rimoux / Unsplash: https://unsplash.com/photos/laboratory-glassware-is-seen-in-a-scientific-experiment-H_w_0xZwZ0w — https://unsplash.com/license .
- Ivan S / Pexels: https://www.pexels.com/photo/laboratory-glasswares-on-the-table-9628811/ và https://www.pexels.com/photo/flask-with-blue-liquid-and-test-tubes-with-red-liquid-9629714/ — https://www.pexels.com/license/ .

Ảnh chỉ minh họa không gian/dụng cụ, không chứng minh cấu trúc hoặc màu phản ứng. Không ngụ ý nhiếp ảnh gia bảo trợ sản phẩm. Ảnh được tải từ URL cố định vào laboratory.jpg, glassware.jpg và solutions.jpg ngày 10/10/2026; chạy website không cần mạng để tải ảnh. Khi ảnh không tải được, hiện SVG cục bộ với chú thích tương ứng. Cấu trúc và mô phỏng dùng SVG dựng từ công thức, không dùng ảnh stock/ảnh AI.

SVG nằm ở `src/components/chemistry/`. Các ảnh JPEG cục bộ được Vite sao chép vào bản build; SVG dự phòng vẫn hoạt động nếu file ảnh bị thiếu.
