<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create("documentations", function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table
                ->foreignId("eventId")
                ->nullable()
                ->constrained("events")
                ->onDelete("cascade");
            $table->string("type");
            $table->string("doc");
            $table
                ->foreignId("userId")
                ->nullable()
                ->constrained("users")
                ->onDelete("cascade");
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists("documentation");
    }
};
