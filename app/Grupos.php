<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use OwenIt\Auditing\Contracts\Auditable;

class Grupos extends Model implements Auditable
{
    //
    use \OwenIt\Auditing\Auditable;

    protected $table = 'grupo_servicio';
    protected $fillable = [
       'codigo', 'grupo_servicio','estado'
    ];
    protected $auditTimestamps = true;
}
