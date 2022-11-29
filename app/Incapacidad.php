<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Incapacidad extends Model
{
    //
    protected $table = 'incapacidad';
    protected $fillable = [
            'id',
            'prorrogaid',
            'tipo_documento_afiliado',
            'num_documento_afiliado',
            'tipo_prestador',
            'ips',
            'medico_id',
            'fecha_atencion',
            'causa_externa',
            'codigo_diagnostico',
            'codigo_diagnostico1',
            'codigo_diagnostico2',
            'codigo_diagnostico3',
            'lateralidad',
            'lateralidad1',
            'lateralidad2',
            'lateralidad3',
            'fecha_inicio_incapacidad',
            'dias_solicitados',
            'dias_reconocidos',
            'fecha_fin_incapacidad',
            'prorroga',
            'dias_acumulados_previos',
            'contingencia_origen',
            'dias_acumulados_ultima_incapacidad',
            'observacion',
            'observacion_estado',
            'estado_id',
            'nombre_afiliado',
            'estado_afiliado',
            'tipo_cotizante',
            'programa_afiliado',
            'aportantes',
            'validacion',
            'grupo_servicio',
            'modo_prestacion',
            'incapacidad_retroactiva'
          
    ];
    public function estado()
    {
        return $this->belongsTo('App\Estadosi');
    }
    public function medico()
    {
        return $this->belongsTo('App\Medico');
    }
    public function diagnostico()
    {
        return $this->belongsTo('App\Cie10','codigo_diagnostico','codigo');
    }
    
}
