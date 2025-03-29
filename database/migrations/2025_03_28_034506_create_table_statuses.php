<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('statuses', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->string('color')->nullable(); // Để lưu màu cho status
            $table->text('description')->nullable();
            $table->boolean('is_default')->default(false);
            $table->timestamps();
        });

        // Thêm column mới status_id cho bảng comics
        Schema::table('comics', function (Blueprint $table) {
            $table->foreignId('status_id')->nullable()->after('author_id')
                  ->constrained('statuses')->nullOnDelete();
        });
    }

    public function down()
    {
        Schema::table('comics', function (Blueprint $table) {
            $table->dropForeign(['status_id']);
            $table->dropColumn('status_id');
        });
        
        Schema::dropIfExists('statuses');
    }
};