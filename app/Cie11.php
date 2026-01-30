<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Cie11 extends Model
{
    protected $table = 'cie11';
    protected $connection = 'sqlsrv';   // use your SQL Server connection
    public $timestamps = false;         // table has no created_at/updated_at

    protected $fillable = [
        'class_kind10','depth10','codigo_cie10','capitulo_cie10','icd10_title',
        'class_kind11','depth11','icd11_foundation_uri','icd11_linearization_uri',
        'codigo_cie11','titulo_cie11','capitulo_cie11','icd11_title',
    ];

    protected $casts = [
        'depth10' => 'integer',
        'depth11' => 'integer',
    ];

    /* Handy scopes */
    public function scopeByCie10($query, string $code)
    {
        return $query->where('codigo_cie10', $code);
    }

    public function scopeByCie11($query, string $code)
    {
        return $query->where('codigo_cie11', $code);
    }
}
