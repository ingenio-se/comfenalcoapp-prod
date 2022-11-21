<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use OwenIt\Auditing\Contracts\Auditable;

class Modop extends Model implements Auditable
{
    //
    use \OwenIt\Auditing\Auditable;

    protected $table = 'modo_prestacion';
    protected $fillable = [
       'codigo','modo_prestacion','estado'
    ];
    protected $auditTimestamps = true;
}
