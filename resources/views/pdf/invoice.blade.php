<!-- filepath: h:\DATN\ehubvn\ehubvn\resources\views\pdf\invoice.blade.php -->
<!DOCTYPE html>
<html lang="vi">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Hóa đơn thanh toán</title>
    <style>
        body {
            font-family: 'DejaVu Sans', sans-serif;
            font-size: 12px;
            line-height: 1.4;
            color: #333;
            margin: 0;
            padding: 20px;
        }

        .header {
            text-align: center;
            margin-bottom: 30px;
            border-bottom: 2px solid #2563eb;
            padding-bottom: 20px;
        }

        .company-name {
            font-size: 24px;
            font-weight: bold;
            color: #2563eb;
            margin-bottom: 5px;
        }

        .company-info {
            font-size: 10px;
            color: #666;
        }

        .invoice-title {
            font-size: 20px;
            font-weight: bold;
            text-align: center;
            margin: 30px 0;
            color: #1f2937;
        }

        .invoice-info {
            display: flex;
            justify-content: space-between;
            margin-bottom: 30px;
        }

        .invoice-details,
        .customer-details {
            width: 48%;
        }

        .section-title {
            font-size: 14px;
            font-weight: bold;
            color: #374151;
            margin-bottom: 10px;
            border-bottom: 1px solid #e5e7eb;
            padding-bottom: 5px;
        }

        .detail-row {
            margin-bottom: 5px;
        }

        .detail-label {
            font-weight: bold;
            color: #4b5563;
            display: inline-block;
            width: 120px;
        }

        .course-table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
        }

        .course-table th,
        .course-table td {
            border: 1px solid #d1d5db;
            padding: 10px;
            text-align: left;
        }

        .course-table th {
            background-color: #f3f4f6;
            font-weight: bold;
            color: #374151;
        }

        .total-section {
            margin-top: 30px;
            text-align: right;
        }

        .total-row {
            margin-bottom: 10px;
        }

        .total-label {
            font-weight: bold;
            display: inline-block;
            width: 150px;
            text-align: right;
            margin-right: 20px;
        }

        .total-amount {
            font-size: 16px;
            font-weight: bold;
            color: #dc2626;
        }

        .footer {
            margin-top: 50px;
            text-align: center;
            font-size: 10px;
            color: #6b7280;
            border-top: 1px solid #e5e7eb;
            padding-top: 20px;
        }

        .status-badge {
            display: inline-block;
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 10px;
            font-weight: bold;
            background-color: #dcfce7;
            color: #166534;
        }
    </style>
</head>

<body>
    <!-- Header -->
    <div class="header">
        <div class="company-name">K - Edu</div>
        <div class="company-info">
            Khóa học trực tuyến K - Edu<br>
            Email: support@k-edu.vn | Hotline: +84 123 456 789<br>
            Website: https://k-edu.vn
        </div>
    </div>

    <!-- Invoice Title -->
    <div class="invoice-title">HÓA ĐƠN THANH TOÁN</div>

    <!-- Invoice & Customer Info -->
    <div class="invoice-info" style="overflow: hidden;">
        <div class="invoice-details" style="float: left; width: 48%;">
            <div class="section-title">Thông tin hóa đơn</div>
            <div class="detail-row">
                <span class="detail-label">Số hóa đơn:</span>
                {{ $invoiceNumber }}
            </div>
            <div class="detail-row">
                <span class="detail-label">Ngày xuất:</span>
                {{ $invoiceDate }}
            </div>
            <div class="detail-row">
                <span class="detail-label">Mã giao dịch:</span>
                {{ $payment->transaction_id ?? $payment->id }}
            </div>
            <div class="detail-row">
                <span class="detail-label">Trạng thái:</span>
                <span class="status-badge">Đã thanh toán</span>
            </div>
        </div>

        <div class="customer-details" style="float: right; width: 48%;">
            <div class="section-title">Thông tin khách hàng</div>
            <div class="detail-row">
                <span class="detail-label">Họ tên:</span>
                {{ $student->name }}
            </div>
            <div class="detail-row">
                <span class="detail-label">Email:</span>
                {{ $student->email }}
            </div>
            <div class="detail-row">
                <span class="detail-label">Điện thoại:</span>
                {{ $student->phone ?? 'Chưa cập nhật' }}
            </div>
            @if($enrollment)
            <div class="detail-row">
                <span class="detail-label">Ngày đăng ký:</span>
                {{ $enrollment->enrollment_date ? \Carbon\Carbon::parse($enrollment->enrollment_date)->format('d/m/Y H:i') : '' }}
            </div>
            @endif
        </div>
    </div>

    <!-- Course Details Table -->
    <table class="course-table">
        <thead>
            <tr>
                <th>Tên khóa học</th>
                <th>Mô tả</th>
                <th>Thời lượng</th>
                <th>Đơn giá</th>
                <th>Số lượng</th>
                <th>Thành tiền</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>{{ $course->title }}</td>
                <td>Khoá học trực tuyến K - Edu</td>
                <td>{{ $course->duration }} giờ</td>
                <td>{{ number_format($course->price, 0, ',', '.') }} VNĐ</td>
                <td>1</td>
                <td>{{ number_format($payment->amount, 0, ',', '.') }} VNĐ</td>
            </tr>
        </tbody>
    </table>

    <!-- Total Section -->
    <div class="total-section">
        <div class="total-row">
            <span class="total-label">Tạm tính:</span>
            <span>{{ number_format($payment->amount, 0, ',', '.') }} VNĐ</span>
        </div>
        <div class="total-row">
            <span class="total-label">Giảm giá:</span>
            <span>0 VNĐ</span>
        </div>
        <div class="total-row">
            <span class="total-label">VAT (0%):</span>
            <span>0 VNĐ</span>
        </div>
        <div class="total-row">
            <span class="total-label total-amount">Tổng cộng:</span>
            <span class="total-amount">{{ number_format($payment->amount, 0, ',', '.') }} VNĐ</span>
        </div>
    </div>

    <!-- Footer -->
    <div class="footer">
        <p><strong>Cảm ơn bạn đã tin tưởng và sử dụng dịch vụ của K - Edu!</strong></p>
        <p>Hóa đơn này được tạo tự động bởi hệ thống vào ngày {{ now()->format('d/m/Y H:i:s') }}</p>
        <p>Mọi thắc mắc xin liên hệ: support@k-edu.vn | +84 123 456 789</p>
    </div>
</body>

</html>