<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

class UpdateIncapacidadTableForCieVersionAndCodigoDiagnostico extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        // Use raw SQL to update column lengths for SQL Server
        DB::statement("ALTER TABLE incapacidad ALTER COLUMN codigo_diagnostico NVARCHAR(30) NOT NULL");
        DB::statement("ALTER TABLE incapacidad ALTER COLUMN codigo_diagnostico1 NVARCHAR(30) NULL");
        DB::statement("ALTER TABLE incapacidad ALTER COLUMN codigo_diagnostico2 NVARCHAR(30) NULL");
        DB::statement("ALTER TABLE incapacidad ALTER COLUMN codigo_diagnostico3 NVARCHAR(30) NULL");

        // Add the new column using Schema (this works fine)
        Schema::table('incapacidad', function ($table) {
            $table->string('cie_version', 10)->default('CIE10');
        });
        
        // Update existing rows
        DB::table('incapacidad')->update(['cie_version' => 'CIE10']);
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        // Remove the cie_version column
        Schema::table('incapacidad', function ($table) {
            $table->dropColumn('cie_version');
        });
        
        // Revert the column lengths back to the original (assuming NVARCHAR(5))
        DB::statement("ALTER TABLE incapacidad ALTER COLUMN codigo_diagnostico NVARCHAR(5) NOT NULL");
        DB::statement("ALTER TABLE incapacidad ALTER COLUMN codigo_diagnostico1 NVARCHAR(5) NULL");
        DB::statement("ALTER TABLE incapacidad ALTER COLUMN codigo_diagnostico2 NVARCHAR(5) NULL");
        DB::statement("ALTER TABLE incapacidad ALTER COLUMN codigo_diagnostico3 NVARCHAR(5) NULL");
    }
}