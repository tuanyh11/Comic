<?php

use App\Models\Chapter;
use App\Models\Comic;
use App\Models\User;
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
        Schema::create('read_histories', function (Blueprint $table) {
            $table->id();
            $table->foreignIdFor(User::class)->constrained()->onDelete('cascade');
            $table->foreignIdFor(Chapter::class)->constrained()->onDelete('cascade');
            $table->foreignIdFor(Comic::class)->constrained()->onDelete('cascade');
            $table->timestamp('last_read_at');
            $table->timestamps();
            
            // Ensure one record per user per chapter
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('read_histories');
    }
};