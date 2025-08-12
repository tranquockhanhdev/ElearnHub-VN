<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('website_settings', function (Blueprint $table) {
            // Thêm khóa ngoại user_id nếu chưa có
            if (!Schema::hasColumn('website_settings', 'user_id')) {
                $table->unsignedBigInteger('user_id')->nullable()->after('id');
            }

            // Thêm foreign key constraint
            $table->foreign('user_id')->references('id')->on('users')->onDelete('set null');

            // Thêm index để tối ưu hóa query
            $table->index('user_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('website_settings', function (Blueprint $table) {
            // Xóa foreign key constraint
            $table->dropForeign(['user_id']);

            // Xóa index
            $table->dropIndex(['user_id']);

            // Xóa column nếu cần
            // $table->dropColumn('user_id');
        });
    }
};
