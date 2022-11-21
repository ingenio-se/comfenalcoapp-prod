<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddLocalizationToIpsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('ips', function (Blueprint $table) {
            //
            $table->string('departamento')->nullable();
            $table->string('municipio')->nullable();
            $table->integer('cod_municipio')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('ips', function (Blueprint $table) {
            //
            $table->dropColumn(['departamento']);
            $table->dropColumn(['municipio']);
            $table->dropColumn(['lateralidad3']);
        });
    }
}
