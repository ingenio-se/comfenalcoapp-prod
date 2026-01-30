<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateSystemConfigTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('system_config', function (Blueprint $table) {
            // Using config_key as primary key so each config setting is unique
            $table->string('config_key')->primary();
            $table->string('config_value');
            $table->timestamps();  // includes created_at and updated_at
        });
        
        // Optionally insert initial CIE version setting
        DB::table('system_config')->insert([
            'config_key'   => 'cie_version',
            'config_value' => 'CIE10',
            'created_at'   => now(),
            'updated_at'   => now()
        ]);
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('system_config');
    }
}   