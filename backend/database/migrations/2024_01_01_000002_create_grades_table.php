<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('grades', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('student_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('teacher_id')->nullable()->constrained('users')->nullOnDelete();
            $table->string('module_name');
            $table->decimal('controle_1', 4, 2)->nullable();
            $table->decimal('controle_2', 4, 2)->nullable();
            $table->decimal('controle_3', 4, 2)->nullable();
            $table->decimal('efm', 4, 2)->nullable();
            $table->decimal('regional', 4, 2)->nullable();
            $table->timestamps();
            $table->unique(['student_id', 'module_name']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('grades');
    }
};
