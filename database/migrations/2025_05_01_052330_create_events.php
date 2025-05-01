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
        Schema::create("events", function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->unsignedBigInteger("ormawaId")->nullable();
            $table
                ->foreignId("createdBy")
                ->nullable()
                ->constrained("users")
                ->onDelete("cascade");
            $table->string("title");
            $table->string("description");
            $table->string("location");
            $table->string("poster");
            $table->dateTime("registrationStart");
            $table->dateTime("registrationEnd");
            $table->dateTime("eventStart");
            $table->dateTime("eventEnd");
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists("events");
    }
};
