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
        Schema::table("registrations", function (Blueprint $table) {
            $table->dropForeign(["userId"]);
            $table->dropColumn("userId");
            $table->string("name");
            $table->string("email");
            $table->string("phoneNumber");
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table("registrations", function (Blueprint $table) {
            //
        });
    }
};
