<?php

namespace App\Exports;

use App\Licencias;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;


class LicenciasExport implements FromCollection, WithHeadings, ShouldAutoSize
{
    /**
    * @return \Illuminate\Support\Collection
    */

    protected $licencias;

    public function __construct($licencias= null)
    {
        $this->licencias = $licencias;
    }

    /**
    * @return \Illuminate\Support\Collection
    */
    public function collection()
    {
        return $this->licencias ?: Licencias::all();
        //return Inscripcion::all();
    }

    public function headings(): array
    {
        return [
            'id',
            'tipo_documento_afiliado',
            'num_documento_afiliado',
            'nombre_afiliado',
            'estado_afiliado',
            'tipo_cotizante',
            'programa_afiliado',
            'fecha_atencion',
            'fecha_inicio_licencia',
            'fecha_fin_licencia',
            'dias_solicitados',
            'tipo_licencia',
            'descripcion_tipo_licencia',
            'contingencia_origen',
            'descripcion_contingencia_origen',
            'codigo_diagnostico',
            'codigo_diagnostico1',
            'codigo_diagnostico2',
            'codigo_diagnostico3',
            'causa_externa',
            'causae.causa_externa as descripcion_causa_externa',
            'tipo_prestador',
            'ips',
            'ips.nit as NIT_IPS',
            'ips.nombre_sede as NOMBRE_IPS',
            'medico_id',
            'medicos.nombre as medico',
            'especialidad_medico',
            'tipo_atencion',
            'edad_gestacional_semanas',
            'edad_gestacional_dias',
            'dias_gestacion',
            'recien_nacido_viable',
            'estado_id',
            'estados_incapacidad.estado as descripcion_estado',
            'observacion',
            'aportantes',
            'created_at',
            'updated_at',
            'deleted_at',
        ];
    }
}
