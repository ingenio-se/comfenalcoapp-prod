s<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateCie11Table extends Migration
{
    public function up()
    {
        Schema::create('cie11', function (Blueprint $table) {
            $table->bigIncrements('id');

            // CIE-10 side
            $table->string('class_kind10', 16);
            $table->unsignedTinyInteger('depth10');
            $table->string('codigo_cie10', 10);
            $table->string('capitulo_cie10', 5);
            $table->string('icd10_title', 255);

            // CIE-11 side
            $table->string('class_kind11', 16)->nullable();
            $table->unsignedTinyInteger('depth11')->nullable();
            $table->string('icd11_foundation_uri', 100);
            $table->string('icd11_linearization_uri', 200)->nullable();
            $table->string('codigo_cie11', 30)->nullable();
            $table->string('titulo_cie11', 255)->nullable();
            $table->string('capitulo_cie11', 5)->nullable();
            $table->text('icd11_title')->nullable(); // nvarchar(max) on SQL Server

            // indexes
            $table->index('codigo_cie10');
            $table->index('codigo_cie11');
        });

        
    }

    public function down()
    {
        Schema::dropIfExists('cie11');
    }
}
