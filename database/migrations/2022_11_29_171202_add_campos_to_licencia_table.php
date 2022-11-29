<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddCamposToLicenciaTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('licencias', function (Blueprint $table) {
            //
            $table->date('fecha_probable_parto')->nullable();
            $table->string('certificados')->nullable();
           
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('licencias', function (Blueprint $table) {
            //
            $table->dropColumn(['fecha_probable_parto','certificados']);
        });
    }
}
