<?php

namespace App\Imports;

use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Maatwebsite\Excel\Concerns\ToCollection;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Concerns\WithChunkReading;

class Cie11Import implements ToCollection, WithHeadingRow, WithChunkReading
{
    // DO NOT declare $connection (Laravel-Excel uses that for queues)
    protected string $table;
    protected string $dbConnection;

    public function __construct(string $table = 'cie11', string $dbConnection = 'sqlsrv')
    {
        $this->table = $table;
        $this->dbConnection = $dbConnection;
    }

    public function headingRow(): int { return 1; }
    public function chunkSize(): int { return 500; }

    public function collection(Collection $rows)
    {
        $batch = [];
        foreach ($rows as $row) {
            $batch[] = [
                'class_kind10'            => (string)($row['10classkind'] ?? null),
                'depth10'                 => isset($row['depth']) && is_numeric($row['depth']) ? (int)$row['depth'] : null,
                'codigo_cie10'            => (string)($row['codigo_cie10'] ?? null),
                'capitulo_cie10'          => (string)($row['capitulo_cie10'] ?? null),
                'icd10_title'             => (string)($row['icd10title'] ?? null),
                'class_kind11'            => (string)($row['11classkind'] ?? null),
                'depth11'                 => isset($row['depth_1']) && is_numeric($row['depth_1']) ? (int)$row['depth_1'] : null,
                'icd11_foundation_uri'    => (string)($row['icd_11_foundation_uri'] ?? null),
                'icd11_linearization_uri' => (string)($row['linearization_release_uri'] ?? null),
                'codigo_cie11'            => (string)($row['codigo_cie11'] ?? null),
                'titulo_cie11'            => (string)($row['titulo_cie11'] ?? null),
                'capitulo_cie11'          => (string)($row['capitulo_cie11'] ?? null),
                'icd11_title'             => (string)($row['icd11title'] ?? null),
            ];
        }

        foreach (array_chunk($batch, 500) as $chunk) {
            DB::connection($this->dbConnection)->table($this->table)->insert($chunk);
        }
    }
}
