<?php

// app/Services/CourseService.php
namespace App\Services;

use App\Repositories\PaymentRepository;
use App\Models\Course;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Exception;

class PaymentService
{
    protected $PaymentRepository;

    public function __construct(PaymentRepository $PaymentRepository)
    {
        $this->PaymentRepository = $PaymentRepository;
    }
}
