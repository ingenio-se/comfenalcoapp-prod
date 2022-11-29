<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddFieldsIncapacidadTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        //
        Schema::table('incapacidad', function (Blueprint $table) {
            //
            $table->integer('grupo_servicio')->nullable();
            $table->integer('modo_prestacion')->nullable();
            $table->integer('incapacidad_retroactiva')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        //
        $table->dropColumn(['grupo_servicio','modo_prestacion','incapacidad_retroactiva']);
    }
}
