<?php

use App\Enums\CURRENCY;
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
        Schema::create('wallets', function (Blueprint $table) {
            $table->id();
            $table->foreignIdFor(User::class)->unique()->constrained()->cascadeOnDelete();
            $table->decimal('balance', 10, 2)->default(0);
            $table->string('currency')->default(CURRENCY::VND->toString());
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('wallets');
    }
};