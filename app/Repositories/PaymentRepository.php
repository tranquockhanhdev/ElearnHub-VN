<?php

namespace App\Repositories;

use App\Models\Category;
use App\Models\Course;
use App\Models\Payment;
use App\Models\PaymentMethod;
use Exception;

class PaymentRepository
{
    protected $course;
    protected $payment;

    public function __construct(Course $course, Payment $payment)
    {
        $this->course = $course;
        $this->payment = $payment;
    }
}
