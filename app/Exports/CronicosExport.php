<?php

namespace App\Exports;

use App\Cronicos;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithEvents;
use Maatwebsite\Excel\Concerns\WithStyles;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;
use Maatwebsite\Excel\Events\AfterSheet;

class CronicosExport implements FromCollection, WithHeadings, ShouldAutoSize, WithEvents, WithStyles
{
    /**
    * @return \Illuminate\Support\Collection
    */
    protected $cronicos;

    public function __construct($cronicos= null)
    {
        $this->cronicos = $cronicos;
    }

    /**
    * @return \Illuminate\Support\Collection
    */
    public function collection()
    {
        ini_set('memory_limit','512M');
        return $this->cronicos ?: Cronicos::where('id','<',10)->get();
        //return Inscripcion::all();
    }

    public function styles(Worksheet $sheet)
    {
        return [
            // Style the first row as bold text.
            1    => ['font' => ['bold' => true], 'alignment'=>['horizontal' => 'center']],
        ];
    }

    public function headings(): array
    {
        return [
            'id',
            'consecutivo',
            'numero_notificacion',
            'fecha_notificacion',
            'ano_notificacion',
            'tipo_id_usuario',
            'id_usuario',
            'cc_repetidos',
            'cant_ciclos',
            'nombre_1_usuario',
            'nombre_2_usuario',
            'apellido_1_usuario',
            'apellido_2_usuario',
            'tipo_afiliado',
            'estado_afiliado',
            'tipo_afiliado_poblacion_mayo2020',
            'estado_afiliado_poblacion_mayo2020',
            'telefono_fijo_usuario',
            'celular_usuario',
            'e mail_usuario',
            'apellidos_nombres_acudiente',
            'telefono_fijo_acudiente',
            'telefono_celular_acudiente',
            'e mail_acudiente',
            'tipo_id_aportante',
            'nit_aportante',
            'nombre_aportante',
            'cod_arl',
            'nombre_arl',
            'cod_afp',
            'nombre_afp',
            'municipio',
            'codigo_municipio',
            'nit_ips_primaria',
            'nombre_ips',
            'nombre_medico_laboral_(mel)',
            'no_licencia_medico_laboral',
            'fecha_primera_asistio_mel',
            'fecha_ultima_cita_mel',
            'fecha_proxima_mel',
            'fecha_primera_asistio_sic',
            'fecha_ultima_cita_sic',
            'fecha_proxima_sic',
            'dias_acumulados_a_identificacion_caso',
            'fecha_fin_it_dias_acumulados_a_indetificacion',
            'tipo_seguimiento',
            'estado_seguimiento',
            'motivo_estado_seguimiento',
            'cie10_evento_seguimiento',
            'descripcion_cie10',
            'contingencia_origen_inicial',
            'fecha_cierre',
            'fecha_it_inicio_ciclo',
            'fecha_inicio_ultima_it',
            'fecha_fin_ultima_it',
            'dias_acumulados_a_fecha_ultima_it',
            'rango_dias_a_fecha_ultima_it',
            'dias_acumulado_a_hoy_desde_fech _inic _ciclo',
            'perdidos',
            'fecha_dia_180',
            'fecha_dia_540',
            'fecha_dia_120',
            'fecha_dia_150',
            'radicacion_masiva_fecha_carta',
            'fecha_emision_crh1_(antes_del_180)',
            'ano_emision_crh1',
            'mes_emision_crh1',
            'decision_crh1',
            'dias_acumulados_a_crh1',
            'oportunidad_a_crh1',
            'fecha_remision_afp_arl_crh1',
            'fecha_notif_crh1_a_afp',
            'fecha_dia_480',
            'fecha_emision_crh2_(antes_del_540)',
            'decision_crh2_favorable',
            'dias_acum_a_crh2',
            'fecha_remision_afp_arl_crh2',
            'fecha_notif_crh2_a_afp',
            'fecha_emision_crh3_mod_pronostico',
            'decision_crh3_favorable',
            'dias_acum_a_crh3',
            'fecha_remision_afp_arl_crh3',
            'fecha_notif_crh3_a_afp',
            'cpclo_fecha_1a_oport',
            'entidad_califica_1a_oportunidad',
            'cpclo',
            'contingencia_origen_dictamen_1_oport ',
            'fecha_estructuracion_1_oport ',
            'quien_manifiesta_desacuerdo',
            'fecha_manifestacion_desacuerdo',
            'fecha_entrega_a_jrci',
            'cpclo_fecha_jrci',
            'cpclo2',
            'contingencia_origen_dictamen_jrci',
            'fecha_estructuracion_jrci',
            'quien_manifiesta_controversia',
            'fecha_manifestacion_controversia',
            'fecha_entrega_a_jnci',
            'cpclo_fecha_jnci',
            'cpclo3',
            'contingencia_origen_dictamen_jnci',
            'fecha_estructuracion_jnci',
            'fecha_demanda_lboral',
            'cpclo_demanda_dictamen',
            'contingencia_origen_dictamen_demanda',
            'fecha_estructuracion_demanda',
            'firme_si',
            'cpclo_cierre',
            'rango_cpclo_cierre',
            'categoria_discapacidad',
            'contingencia_origen_de_cierre',
            'fecha_estructuracion_cierre',
            'instancia_al_cierre',
            'clasificacion_tipo_incpacidad',
            'fecha_cert_inva',
            'fecha_carta_cita_pemel',
            'fecha_carta_explicaciones_abuso',
            'fecha_carta_cita_acuerdo__abuso',
            'fecha_acta_acuerdo_de_cumplimiento',
            'fecha_carta_suspension_abuso_del_derecho',
            'fecha_restitucion_derecho_it',
            'fecha_reintegro_por_mmm',
            'fecha_control_reintegro',
            'resultado_reintegro_por_mmm',
            'fecha_refuerzo_reintegro',
            'fecha_control_fallido',
            'resultado_refuerzo_reintegro',
            'fecha_comunicado_usuario',
            'tipo_comunicado_(llamado-email-carta)',
            'fecha_comunicado_busqueda_empresa',
            'deuda',
            'procedimiento_pendiente',
            'fecha_de_solicitud',
            'area_de_contacto',
            'fecha_de_respuesta',
            'respuesta',
            'fecha_cierre_notificacion_evento',
            'observacion',
            'tutela_pe',
            'observacion_cobertura_tutela',
            ];
    }

    public function registerEvents(): array
    {
        return [
            AfterSheet::class => function(AfterSheet $event) {
                // $event->sheet->insertNewRowBefore(1, 1);
                // $event->sheet->getStyle('1')->getAlignment()->applyFromArray(
                //     array('horizontal' => 'center')
                // );

                // $event->sheet->mergeCells('B1:D1');
                // $event->sheet->setCellValue('B1','Categoria 01');

            }
        ];
    }

}
