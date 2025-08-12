<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Payment;

class ExpirePendingPayments extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'payments:expire';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command description';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $expiredTime = now()->subMinutes(9);

        Payment::where('status', 'pending')
            ->where('created_at', '<=', $expiredTime)
            ->update([
                'status' => 'failed',
                'failed_at' => now(),
                'cancelled_at' => now(),
            ]);

        $this->info('Cập nhật giao dịch quá hạn thành failed và ghi lại thời gian');
    }
}
