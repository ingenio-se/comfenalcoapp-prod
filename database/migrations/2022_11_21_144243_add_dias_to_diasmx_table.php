<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddDiasToDiasmxTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('dias_max_especialidad', function (Blueprint $table) {
            //
            $table->integer('dias_maximos_retroactivo')->nullable();
            $table->integer('dias_maximos_prospectivo')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('dias_max_especialidad', function (Blueprint $table) {
            //
            $table->dropColumn(['dias_maximos_retroactivo']);
            $table->dropColumn(['dias_maximos_prospectivo']);
        });
    }
}
