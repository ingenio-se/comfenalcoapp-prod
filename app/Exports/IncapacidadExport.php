<?php

namespace App\Exports;

use App\Incapacidad;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;

class IncapacidadExport implements FromCollection, WithHeadings, ShouldAutoSize
{
    /**
    * @return \Illuminate\Support\Collection
    */



    protected $incapacidades;

    public function __construct($incapacidades= null)
    {
        $this->incapacidades = $incapacidades;
    }

    /**
    * @return \Illuminate\Support\Collection
    */
    public function collection()
    {
        return $this->incapacidades ?: Incapacidad::all();
        //return Inscripcion::all();
    }

    public function headings(): array
    {
        return [
            'id',
            'prorrogaid',
            'fecha_atencion',
            'tipo_documento_afiliado',
            'num_documento_afiliado',
            'nombre_afiliado',
            'fecha_inicio_incapacidad',
            'fecha_fin_incapacidad',
            'dias_solicitados',
            'dias_reconocidos',
            'prorroga',
            'dias_acumulados_previos',
            'dias_acumulados_ultima_incapacidad',
            'contingencia_origen',
            'descripcion_contingencia',
            'codigo_diagnostico',
            'codigo_diagnostico1',
            'codigo_diagnostico2',
            'codigo_diagnostico3',
            'lateralidad',
            'tipo_prestador',
            'descripcion_tipo_prestador',
            'IPS',
            'NIT_IPS',
            'NOMBRE_IPS',
            'medico',
            'especialidad_medico',
            'causa_externa',
            'descripcion_causa_externa',
            'estado_afiliado',
            'tipo_cotizante',
            'programa_afiliado',
            'aportantes',
            'NombreEmpresa',
            'observacion',
            'estado_id',
            'estados_incapacidad',
            'observacion_estado',
            'created_at',
            'updated_at',
            'descripcion_programa_afiliado',
            'grupo_servicio',
            'modo_prestacion',
            'incapacidad_retroactiva'
        ];
    }
}
