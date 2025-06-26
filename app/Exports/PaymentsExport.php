<?php

namespace App\Exports;

use App\Models\Payment;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Carbon\Carbon;

class PaymentsExport implements FromCollection, WithHeadings, WithMapping
{
    public function __construct(
        protected $filters = []
    ) {}

    public function collection()
    {
        $query = Payment::with(['student', 'course', 'method']);

        if (!empty($this->filters['status'])) {
            $query->where('status', $this->filters['status']);
        }

        if (!empty($this->filters['student_id'])) {
            $query->where('student_id', $this->filters['student_id']);
        }

        if (!empty($this->filters['course_id'])) {
            $query->where('course_id', $this->filters['course_id']);
        }

        return $query->get();
    }

    public function headings(): array
    {
        return [
            'ID',
            'Học viên',
            'Khóa học',
            'Phương thức',
            'Số tiền',
            'Trạng thái',
            'Thời gian thanh toán',
        ];
    }

    public function map($payment): array
    {
        return [
            $payment->id,
            $payment->student?->name,
            $payment->course?->title,
            $payment->method?->name,
            $payment->amount,
            ucfirst($payment->status),
            $payment->payment_time
                ? Carbon::parse($payment->payment_time)->format('d/m/Y H:i')
                : '---',
        ];
    }
}