<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('media', function (Blueprint $table) {
            // Đổi cột mediable_type thành nullable
            $table->string('mediable_type')->nullable()->change();
            
            // Đổi cột mediable_id thành nullable
            $table->unsignedBigInteger('mediable_id')->nullable()->change();
        });
    }

    public function down(): void
    {
        Schema::table('media', function (Blueprint $table) {
            // Quay lại trạng thái not null nếu cần rollback
            $table->string('mediable_type')->nullable(false)->change();
            $table->unsignedBigInteger('mediable_id')->nullable(false)->change();
        });
    }
};