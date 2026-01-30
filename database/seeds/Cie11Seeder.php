<?php

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Maatwebsite\Excel\Facades\Excel;
use App\Imports\Cie11Import;

class Cie11Seeder extends Seeder
{
    public function run()
    {
        // Allow more memory / time when seeding
        @ini_set('memory_limit', '1024M');
        @set_time_limit(0);

        // Lower memory usage for Laravel-Excel/PhpSpreadsheet
        config([
            'excel.imports.read_only' => true,             // don't build full cell objects
            'excel.imports.ignore_empty' => true,          // skip empty cells/rows
            'excel.temporary_files.local_path' => storage_path('framework/laravel-excel'),
        ]);
        if (!is_dir(storage_path('framework/laravel-excel'))) {
            @mkdir(storage_path('framework/laravel-excel'), 0775, true);
        }

        $path = storage_path('app/imports/10To11MapMultiplesCategorias-cleaned.xlsx');
        if (!file_exists($path)) {
            throw new RuntimeException("Excel file not found at: {$path}");
        }

        // Clear table safely
        try {
            DB::connection('sqlsrv')->statement('TRUNCATE TABLE cie11');
        } catch (\Throwable $e) {
            DB::connection('sqlsrv')->table('cie11')->delete();
        }

        // Avoid Laravel query log accumulating in memory
        DB::connection('sqlsrv')->disableQueryLog();

        // IMPORTANT: our import class must NOT declare a $connection property
        Excel::import(new Cie11Import('cie11', 'sqlsrv'), $path);
    }
}
