u - Hệ thống Học tập Trực tuyến

## 📖 Giới thiệu

K-Edu là một nền tảng học tập trực tuyến toàn diện được xây dựng bằng Laravel và React với Inertia.js. Hệ thống cung cấp một môi trường học tập tương tác với các tính năng hiện đại cho học viên, giảng viên và quản trị viên.

## ✨ Tính năng chính

### 🎓 Dành cho Học viên (Students)
- **Đăng ký và học khóa học**: Tham gia các khóa học đã phê duyệt
- **Theo dõi tiến độ**: Xem tiến độ học tập chi tiết cho từng khóa học
- **Làm bài kiểm tra**: Tham gia quiz với hệ thống chấm điểm tự động
- **Xem video bài giảng**: Phát video với Plyr player tích hợp
- **Đọc tài liệu**: Xem PDF và tài liệu học tập với PDF.js
- **Quản lý thanh toán**: Theo dõi lịch sử thanh toán và giao dịch
  
### 👨‍🏫 Dành cho Giảng viên (Instructors)
- **Tạo và quản lý khóa học**: Tạo khóa học với editor Quill rich text
- **Quản lý bài giảng**: Thêm/sửa/xóa bài giảng và sắp xếp thứ tự
- **Upload nội dung**: 
  - Video bài giảng với hỗ trợ nhiều định dạng
  - Tài liệu PDF với hệ thống upload chunk
- **Tạo bài kiểm tra**: Tạo quiz với nhiều loại câu hỏi trắc nghiệm
- **Theo dõi học viên**: Xem danh sách học viên và tiến độ học tập
- **Quản lý doanh thu**: Thống kê thu nhập từ các khóa học
- **Hệ thống phê duyệt**: Gửi yêu cầu chỉnh sửa để admin phê duyệt

### 👨‍💼 Dành cho Quản trị viên (Admins)
- **Quản lý khóa học**: Phê duyệt/từ chối khóa học và nội dung
- **Quản lý người dùng**: Quản lý học viên và giảng viên
- **Quản lý danh mục**: Tạo và quản lý danh mục khóa học
- **Hệ thống phê duyệt**: Phê duyệt các thay đổi nội dung từ giảng viên
- **Thống kê và báo cáo**: Dashboard với biểu đồ Chart.js
- **Xuất dữ liệu**: Xuất báo cáo Excel với Maatwebsite/Excel

## 🛠 Công nghệ sử dụng

### Backend
- **Laravel Framework 12.x**: Framework PHP hiện đại
- **Laravel Sanctum**: Authentication API
- **Inertia.js**: Kết nối Laravel với React SPA
- **SQLite**: Cơ sở dữ liệu mặc định (có thể thay đổi)
- **Laravel Excel**: Xuất/nhập dữ liệu Excel
- **DomPDF**: Tạo file PDF

### Frontend
- **React 19.x**: Library JavaScript để xây dựng UI
- **Inertia.js React**: Adapter React cho Inertia.js
- **TailwindCSS 4.x**: Framework CSS utility-first
- **Vite**: Build tool hiện đại và nhanh
- **Chart.js**: Thư viện biểu đồ tương tác
- **Plyr**: Video player hiện đại
- **PDF.js**: Đọc file PDF trong browser
- **Quill**: Rich text editor
- **Heroicons**: Bộ icon SVG

### Các thư viện khác
- **Ziggy**: Laravel route helper cho JavaScript
- **Axios**: HTTP client
- **Bootstrap Stepper**: Multi-step forms

## 📋 Yêu cầu hệ thống

- **PHP** >= 8.2
- **Composer** >= 2.0
- **Node.js** >= 16.x
- **NPM** hoặc **Yarn**
- **SQLite** (hoặc MySQL/PostgreSQL)

## 🚀 Hướng dẫn cài đặt

### 1. Clone dự án
```bash
git clone https://github.com/your-repo/K-Edu.git
cd K-Edu
```

### 2. Cài đặt dependencies Backend
```bash
composer install
```

### 3. Cài đặt dependencies Frontend
```bash
npm install
```

### 4. Cấu hình môi trường
```bash
cp .env.example .env
```

Chỉnh sửa file `.env` với thông tin cấu hình của bạn:
```env
APP_NAME="K-Edu"
APP_URL=http://localhost:8000
DB_CONNECTION=mysql
```

### 5. Tạo khóa ứng dụng và symbolic link
```bash
php artisan key:generate
php artisan storage:link
```

### 6. Chạy migration và seeder
```bash
php artisan migrate
php artisan db:seed
```

### 7. Khởi động development server
```bash
# Terminal 1: Laravel server
php artisan serve

# Terminal 2: Vite dev server
npm run dev
```

Truy cập ứng dụng tại: `http://localhost:8000`

## 📁 Cấu trúc dự án

```
K-Edu/
├── app/
│   ├── Http/Controllers/          # Controllers theo role
│   │   ├── Admin/                # Controllers cho admin
│   │   ├── Instructor/           # Controllers cho giảng viên
│   │   ├── Student/              # Controllers cho học viên
│   │   └── Public/               # Controllers công khai
│   ├── Models/                   # Eloquent models
│   ├── Services/                 # Business logic layer
│   ├── Repositories/             # Data access layer
│   ├── Jobs/                     # Background jobs
│   └── Mail/                     # Mail classes
├── database/
│   ├── migrations/               # Database migrations
│   └── seeders/                  # Database seeders
├── resources/
│   ├── js/                       # React components
│   │   ├── Components/           # Reusable components
│   │   ├── Pages/                # Page components
│   │   └── Layouts/              # Layout components
│   └── css/                      # Stylesheets
├── routes/
│   ├── web.php                   # Public routes
│   ├── admin.php                 # Admin routes
│   ├── instructor.php            # Instructor routes
│   └── student.php               # Student routes
└── public/                       # Static assets
```

## 🔐 Hệ thống phân quyền

### Roles trong hệ thống:
1. **Admin (role_id: 1)**: Quản trị viên hệ thống
2. **Instructor (role_id: 2)**: Giảng viên
3. **Student (role_id: 3)**: Học viên

### Middleware bảo mật:
- `auth`: Yêu cầu đăng nhập
- `verified`: Yêu cầu verify email
- `role:X`: Kiểm tra role cụ thể

## 🎯 Các tính năng nổi bật

### 📊 Dashboard tương tác
- Biểu đồ thống kê với Chart.js
- Real-time data updates
- Responsive design

### 🎬 Video Learning
- Hỗ trợ multiple video formats
- Custom video player với Plyr
- Video progress tracking
- Adaptive streaming ready

### 📝 Rich Content Editor
- Quill editor với toolbar đầy đủ
- Image upload và embed
- Code syntax highlighting
- Export to multiple formats

### 📊 Assessment System
- Flexible quiz creation
- Multiple choice questions
- Auto-grading system
- Attempt tracking và best scores
- Time-limited quizzes

### 💾 File Management
- Chunked file upload cho files lớn
- Multiple file type support
- Storage optimization
- Secure file access

## 🧪 Testing

```bash
# Chạy PHPUnit tests
php artisan test

# Chạy specific test suite
php artisan test --testsuite=Feature
```

## 📝 Scripts NPM

```bash
npm run dev          # Development server
npm run build        # Production build
npm run watch        # Watch mode
```

## 🔧 Troubleshooting

### Lỗi thường gặp:

1. **500 Error**: Kiểm tra APP_KEY trong .env
2. **File permission**: `chmod -R 775 storage bootstrap/cache`
3. **Node modules**: `rm -rf node_modules && npm install`
4. **Composer issues**: `composer clear-cache && composer install`

## 🤝 Đóng góp

1. Fork dự án
2. Tạo feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Tạo Pull Request

## 📄 License

Dự án này được phân phối dưới MIT License. Xem file `LICENSE` để biết thêm chi tiết.

## 👥 Team

- **Developer**: Synergy
- **Project Type**: Đồ án tốt nghiệp (DATN)
- **Institution**: Cao Thang Technical College

## 📞 Liên hệ

- **Email**: khanhtran19.dev@gmail.com
- **GitHub**: [github.com/your-repo]
- **Demo**: [https://your-demo-site.com]