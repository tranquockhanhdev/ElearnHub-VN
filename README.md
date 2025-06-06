# eLearning Platform

## Giới thiệu

eLearning Platform là một hệ thống học trực tuyến được xây dựng bằng Laravel và React. Dự án cung cấp các tính năng như quản lý khóa học, bài giảng, bài kiểm tra, và theo dõi tiến độ học tập.

## Tính năng chính

- Quản lý khóa học và bài giảng.
- Hệ thống bài kiểm tra và đánh giá.
- Theo dõi tiến độ học tập của học viên.
- Tích hợp giao diện người dùng hiện đại với React.
- Hỗ trợ đa ngôn ngữ.

## Công nghệ sử dụng

- **Backend**: Laravel Framework
- **Frontend**: ReactJS
- **Cơ sở dữ liệu**: SQLite (hoặc MySQL/PostgreSQL)
- **Build tool**: Vite
- **Authentication**: Laravel Sanctum

## Cài đặt

### Yêu cầu hệ thống

- PHP >= 8.2
- Composer
- Node.js >= 16
- SQLite (hoặc MySQL/PostgreSQL)

### Hướng dẫn cài đặt

1. Clone dự án:
   git clone https://github.com/your-repo/elearning-platform.git
   cd elearning-platform
   
2. Cài đặt các package PHP:
composer install

3.Cài đặt các package JavaScript:
npm install

4.Tạo file .env từ .env.example và cấu hình:
cp .env.example .env

5.Tạo khóa ứng dụng:
php artisan key:generate

6.Chạy migration để tạo bảng cơ sở dữ liệu:
php artisan migrate

7.Khởi động server:
php artisan serve
npm run dev

Cấu trúc thư mục
app/: Chứa các file backend của Laravel.
resources/js/: Chứa các file ReactJS.
resources/views/: Chứa các file Blade template.
database/migrations/: Chứa các file migration.
public/: Chứa các file tĩnh như hình ảnh, CSS, JS.
Đóng góp
Nếu bạn muốn đóng góp cho dự án, vui lòng tạo một pull request hoặc mở một issue trên GitHub.

resources/js/
├── Pages/
│   ├── Auth/                      // Login, Register, ForgotPassword...
│   ├── Admin/                    // Quản trị viên
│   │   ├── Dashboard.jsx
│   │   ├── Users/Index.jsx
│   │   ├── Payments/Index.jsx
│   ├── Instructor/               // Giảng viên
│   │   ├── Dashboard.jsx
│   │   ├── Courses/Index.jsx
│   │   ├── Courses/Edit.jsx
│   │   ├── Lessons/Edit.jsx
│   │   ├── Quizzes/Edit.jsx
│   ├── Student/                  // Học viên
│   │   ├── Dashboard.jsx
│   │   ├── Courses/MyCourses.jsx
│   │   ├── Lessons/Watch.jsx
│   │   ├── Quizzes/Attempt.jsx
│   ├── Public/                   // Giao diện bên ngoài
│   │   ├── Home.jsx
│   │   ├── Course/Details.jsx
│   │   ├── Category/Index.jsx
│   └── Errors/
│       └── 404.jsx
├── Components/                  // Các component tái sử dụng
│   ├── Layouts/
│   │   ├── AdminLayout.jsx
│   │   ├── InstructorLayout.jsx
│   │   ├── StudentLayout.jsx
│   │   └── GuestLayout.jsx
│   ├── CourseCard.jsx
│   ├── LessonVideo.jsx
│   ├── QuizQuestion.jsx
├── Hooks/
│   └── useAuth.js
├── Utils/
│   └── formatDate.js
├── App.jsx
└── main.jsx                     // Entry file (vite)
