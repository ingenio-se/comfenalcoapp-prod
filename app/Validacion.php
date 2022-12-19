<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use OwenIt\Auditing\Contracts\Auditable;

class Validacion extends Model implements Auditable

{
    //
    use \OwenIt\Auditing\Auditable;
    //
    protected $table = 'validacion_derechos';
    protected $fillable = [
        'url','username','password'
    ];
}
