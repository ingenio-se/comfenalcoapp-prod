<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use OwenIt\Auditing\Contracts\Auditable;

class Incapcidadr extends Model implements Auditable
{
    //
    use \OwenIt\Auditing\Auditable;

    protected $table = 'incapacidad_retroactiva';
    protected $fillable = [
       'codigo', 'incapacidad_retroactiva','estado'
    ];
    protected $auditTimestamps = true;
}

{
    //
}
