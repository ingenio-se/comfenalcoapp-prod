<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Licencia extends Model
{
    //
    protected $table = 'licencias';
               
    protected $fillable = [
        'id',             
        'tipo_documento_afiliado',
        'num_documento_afiliado',
        'nombre_afiliado',
        'estado_afiliado',
        'tipo_cotizante',
        'programa_afiliado',

        'tipo_prestador',
        'ips',
        'medico_id',
       

        'contingencia_origen',
        'fecha_atencion',
        'fecha_inicio_licencia',
        'causa_externa',
        'tipo_atencion',
        'edad_gestacional_semanas',
        'edad_gestacional_dias',
        'dias_gestacion',
        'recien_nacido_viable',
        'tipo_licencia',

        'codigo_diagnostico',
        'codigo_diagnostico1',
        'codigo_diagnostico2',
        'codigo_diagnostico3',
        
        'dias_solicitados',
        'fecha_fin_licencia',
       
        'observacion',
        'estado_id',
        'observacion_estado',
        'aportantes',
        'validacion',
        'fecha_probable_parto',
        'certificados'
    ];
    public function estado()
    {
        return $this->belongsTo('App\Estadosi');
    }
    public function diagnostico()
    {
        return $this->belongsTo('App\Cie10','codigo_diagnostico','codigo');
    }
}
