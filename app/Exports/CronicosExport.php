<?php

namespace App\Exports;

use App\Cronicos;
use Maatwebsite\Excel\Events\AfterSheet;
use Maatwebsite\Excel\Concerns\WithEvents;
use Maatwebsite\Excel\Concerns\WithStyles;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

ini_set('max_execution_time', 3600);
class CronicosExport implements FromCollection, WithHeadings, ShouldAutoSize, WithEvents, WithStyles, WithMapping
{
    /**
    * @return \Illuminate\Support\Collection
    */
    protected $cronicos;
    protected $crepetidos;

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
        // $this->cronicos = Cronicos::where('id','<',20)->get();
        $this->cronicos = Cronicos::all();
        $tmp = [];
        foreach ($this->cronicos as $key => $value) {
            $tmp[$key]= $value->toArray();
        }
        $this->crepetidos = array_count_values(
            array_replace(array_column($tmp,'id_usuario'),
            array_fill_keys(
                array_keys(array_column($tmp,'id_usuario'),null),
                ''
            ))
        );
        // return $this->cronicos ?: Cronicos::where('id','<',20)->get();
        return $this->cronicos ?: Cronicos::all();
        //return Inscripcion::all();
    }

    public function styles(Worksheet $sheet)
    {
        return [
            // Style the first row as bold text.
            1    => ['font' => ['bold' => true], 'alignment'=>['horizontal' => 'center']],
        ];
    }

    public function map($invoice): array
    {
        $mel = "nombre_medico_laboral_(mel)";
        $daic = "dias_acumulado_a_hoy_desde_fech _inic _ciclo";
        $fec180 = "fecha_emision_crh1_(antes_del_180)";
        $fec540 = "fecha_emision_crh2_(antes_del_540)";
        $cod1o = "contingencia_origen_dictamen_1_oport ";
        $fe1o = "fecha_estructuracion_1_oport ";

        $cronico = $invoice;
        $cronico->ano_notificacion = (strtotime($cronico->fecha_notificacion))?(
            (date('Y',strtotime($cronico->fecha_notificacion))=='1900')?
            '2019':(
                (date('Y',strtotime($cronico->fecha_notificacion))<='2015')?'Años Anteriores':(
                    date('Y',strtotime($cronico->fecha_notificacion))))):
            '';

        $cronico->cant_ciclos = $this->crepetidos["$cronico->id_usuario"];

        $cronico->cc_repetidos = ($cronico->cant_ciclos > 1)? 'true' : 'false';

        $rdf = $cronico->dias_acumulados_a_fecha_ultima_it;
        $cronico->rango_dias_a_fecha_ultima_it = ($rdf<60)?"01. No Aplica":(
            ($rdf>=60 && $rdf<=90)?"02. Entre 60 a 90":(
                ($rdf>=91 && $rdf<=120)?"03. Entre 91 a 120":(
                    ($rdf>=121 && $rdf<=150)?"04. Entre 121 a 150":(
                        ($rdf>=151 && $rdf<=180)?"05. Entre 151 a 180":(
                            ($rdf>=181 && $rdf<=360)?"06. Entre 181 a 360":(
                                ($rdf>=361 && $rdf<=540)?"07. Entre 361 a 540":(
                                    ($rdf>=541 && $rdf<=720)?"08. Entre 541 a 720":(
                                        ($rdf>=721 && $rdf<=1000)?"09. Entre 721 a 1000":(
                                            ($rdf>=1001)?"10. Entre Mayor a 1000":""
                                        )))))))));

        $tmp = "dias_acumulado_a_hoy_desde_fech _inic _ciclo";
        $cronico->$tmp = (strtoupper($cronico->estado_seguimiento) == "CERRADO")?$rdf:(
            (strtoupper($cronico->estado_seguimiento) == "SEGUIMIENTO")?"".intval((getdate()[0]-strtotime($cronico->fecha_it_inicio_ciclo))/86400):""
        );

        $cronico->perdidos = (strtoupper($cronico->estado_seguimiento) == "CERRADO")?"0":(
            (strtoupper($cronico->estado_seguimiento) == "SEGUIMIENTO")?"".intval((getdate()[0]-strtotime($cronico->fecha_fin_ultima_it))/86400):""
        );

        $cronico->fecha_dia_120 = date('d/m/Y',86400*((strtotime($cronico->fecha_it_inicio_ciclo)/86400)+120-1));
        $cronico->fecha_dia_150 = date('d/m/Y',86400*((strtotime($cronico->fecha_it_inicio_ciclo)/86400)+150-1));
        $cronico->fecha_dia_180 = date('d/m/Y',86400*((strtotime($cronico->fecha_it_inicio_ciclo)/86400)+180-1));
        $cronico->fecha_dia_480 = date('d/m/Y',86400*((strtotime($cronico->fecha_it_inicio_ciclo)/86400)+480-1));
        $cronico->fecha_dia_540 = date('d/m/Y',86400*((strtotime($cronico->fecha_it_inicio_ciclo)/86400)+540-1));

        $tmp = "fecha_emision_crh1_(antes_del_180)";
        $cronico->ano_emision_crh1 = ($cronico->$tmp>=2018 && strtotime($cronico->$tmp))?date('Y',strtotime($cronico->$tmp)):(($cronico->$tmp && strtotime($cronico->$tmp) && $cronico->$tmp<2018)?"Años Anteriores":'');
        $cronico->mes_emision_crh1 = ($cronico->$tmp>=2018 && strtotime($cronico->$tmp))?date('m',strtotime($cronico->$tmp)):(($cronico->$tmp && strtotime($cronico->$tmp) && $cronico->$tmp<2018)?"Años Anteriores":'');

        $cronico->oportunidad_a_crh1=($cronico->dias_acumulados_a_crh1<=0)?"No Aplica":(
            ($cronico->dias_acumulados_a_crh1>1 && $cronico->dias_acumulados_a_crh1<=150)?"1. Oportuno":(
                ($cronico->dias_acumulados_a_crh1>150)?"2. No Oportuno":""
            )
        );

        $cpcloc = $cronico->cpclo_cierre ;
        $cronico->rango_cpclo_cierre = ($cpcloc<25 && trim ($cpcloc))?"01. Menor 25%":(
            ($cpcloc>=25 && $cpcloc<36)?"02. Entre 25% a 35%":(
                ($cpcloc>=36 && $cpcloc<46)?"03. Entre 36% a 45%":(
                    ($cpcloc>=46 && $cpcloc<50)?"04. Entre 46% a 49%":(
                        ($cpcloc>=50)?"05. Entre Mayor 50%":""))));

        $invoice = $cronico;

        $campos = [
            'numero_notificacion',
            'fecha_notificacion',
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

        $rows = [];
        foreach ($campos as $key => $value) {
            $rows[] = $invoice->$value;
        }

        return $rows;
    }

    public function headings(): array
    {
        return [
                'N° NOTIFICACION',
                'FECHA NOTIFICACIÓN',
                'TIPO ID USUARIO',
                'N° ID USUARIO',
                'UNICO ID USUARIO',
                'CANTIDAD CICLOS',
                'PRIMER NOMBRE',
                'SEGUNDO NOMBRE',
                'PRIMER APELLIDO',
                'SEGUNDO APELLIDO',
                'TIPO AFILIACION',
                'ESTADO AFILIADO ',
                'Tipo Afiliado Ultima Poblacion',
                'Estado Afiliado Ultima Poblacion',
                'N° TELEFONO FIJO',
                'N° CELULAR',
                'E.MAIL',
                'ACUDIENTE - NOMBRE Y APELLIDO',
                'ACUDIENTE - N° TELEFONO FIJO',
                'ACUDIENTE - N° CELULAR',
                'ACUDIENTE - E.MAIL ',
                'TIPO ID APORTANTE',
                'N° ID APORTANTE',
                'NOMBRE APORTANTE',
                'COD_ARL',
                'NOMBRE ARL',
                'COD_AFP',
                'NOMBRE AFP',
                'MUNICIPIO',
                'CODIGO MUNICIPÍO',
                'CODIGO IPS PRIMARIA',
                'NOMBRE IPS',
                'NOMBRE MEDICO LABORAL (MEL)',
                'N° LICENCIA MEDICO LABORAL',
                'FECHA PRIMERA CITA ASISTIO',
                'FECHA ULTIMA CITA ',
                'FECHA PROXIMA',
                'FECHA PRIMERA CITA ASISTIO',
                'FECHA ULTIMA CITA ',
                'FECHA PROXIMA',
                'DIAS ACUMULADOS A IDENTIFICACIÓN CASO',
                'FECHA FIN IT - DIAS ACUMULADOS A IDENTIFICACIÓN',
                'TIPO SEGUIMIENTO',
                'ESTADO SEGUIMIENTO',
                'MOTIVO ESTADO SEGUIMIENTO',
                'CIE-10 EVENTO',
                'DESCRIPCIÓN CIE-10',
                'CONTINGENCIA ORIGEN INICIAL',
                'FECHA CIERRE',
                'FECHA IT INICIO CICLO',
                'FECHA INICIO ULTIMA IT',
                'FECHA FIN ULTIMA IT',
                'DIAS ACUMULADOS A FECHA ULTIMA IT',
                'RANGO DIAS A FECHA ULTIMA IT',
                'DIAS ACUMULADO A HOY DESDE FECH. INIC. CICLO',
                'PERDIDOS ',
                'FECHA DIA 180',
                'FECHA DIA 540',
                'FECHA DIA 120',
                'FECHA DIA 150',
                'FECHA CARTA RADICACIÓN MASIVA',
                'FECHA EMISIÓN CRH1 (Antes de dia 180)',
                'Año Emision CRH1',
                'Mes Emision CRH1',
                'DECISIÓN CRH1',
                'DIAS ACUMULADOS A CRH1',
                'Oportunidad a CRH1',
                'FECHA REMISION AFP - ARL CRH1',
                'FECHA NOTIF. CRH1 A AFP',
                'FECHA DIA 480',
                'FECHA EMISIÓN CRH2 (Antes de dia 540)',
                'DECISIÓN CRH2 FAVORABLE',
                'DIAS ACUM. A CRH2',
                'FECHA REMISION AFP - ARL CRH2',
                'FECHA NOTIF. CRH2 A AFP',
                'FECHA EMISIÓN CRH3',
                'DECISIÓN CRH3 FAVORABLE',
                'DIAS ACUM. A CRH3',
                'FECHA REMISION AFP - ARL CRH3',
                'FECHA NOTIF. CRH3 A AFP',
                'FECHA CPCLO 1° OPORTUNIDAD.',
                'ENTIDAD CALIFICA 1° OPORTUNIDAD',
                '%CPCLO',
                'CONTINGENCIA ORIGEN  DICTAMEN 1° OPORT.',
                'FECHA ESTRUCTURACIÓN 1° OPORT.',
                'QUIEN MANIFIESTA DESACUERDO',
                'FECHA MANIFESTACIÓN DESACUERDO',
                'FECHA ENTREGA A JRCI',
                'FECHA CPCLO JRCI',
                '%CPCLO',
                'CONTINGENCIA ORIGEN DICTAMEN JRCI',
                'FECHA ESTRUCTURACIÓN JRCI',
                'QUIEN MANIFIESTA CONTROVERSIA',
                'FECHA MANIFESTACIÓN CONTROVERSIA',
                'FECHA ENTREGA A JNCI',
                'FECHA CPCLO JNCI',
                '%CPCLO',
                'CONTINGENCIA ORIGEN DICTAMEN JNCI',
                'FECHA ESTRUCTURACIÓN JNCI',
                'FECHA DEMANDA LBORAL',
                '%CPCLO',
                'CONTINGENCIA ORIGEN DICTAMEN DEMANDA',
                'FECHA ESTRUCTURACIÓN DEMANDA',
                'FIRME (SI)',
                '%CPCLO CIERRE',
                'RANGO CPCLO CIERRE',
                'CATEGORIA DISCAPACIDAD',
                'CONTINGENCIA ORIGEN DE CIERRE',
                'FECHA ESTRUCTURACION CIERRE',
                'INSTANCIA AL CIERRE',
                'CLASIFICACIÓN TIPO INCPACIDAD',
                'FECHA CERTIFICADO INVALIDEZ',
                'FECHA CARTA - CITA PEMEL',
                'FECHA CARTA EXPLICACIONES ABUSO',
                'FECHA CARTA_CITA_ACUERDO_ ABUSO',
                'FECHA_ACTA_ACUERDO_DE_CUMPLIMIENTO',
                'Fecha_CARTA_SUSPENSION_ABUSO_DEL_DERECHO',
                'FECHA RESTITUCIÓN DERECHO IT',
                'FECHA REINTEGRO POR MMM ',
                'FECHA CONTROL REINTEGRO',
                'RESULTADO REINTEGRO POR MMM',
                'FECHA REFUERZO REINTEGRO',
                'FECHA CONTROL REINT. FALLIDO',
                'RESULTADO REFUERZO REINTEGRO',
                'FECHA COMUNICADO A USUARIO',
                'TIPO COMUNICADO EMITIDO',
                'FECHA COMUNICADO BUSQUEDA EMPRESA',
                'DEUDA',
                'PROCEDIMIENTO PENDIENTE',
                'FECHA DE SOLICITUD',
                'AREA DE CONTACTO',
                'FECHA DE RESPUESTA',
                'RESPUESTA',
                'FECHA CIERRE NOTIFICACIÓN EVENTO',
                'OBSERVACIÓN',
                'TUTELA PE (SI/NO)',
                'OBSERVACION TUTELA',
            ];
    }

    public function registerEvents(): array
    {
        return [
            AfterSheet::class => function(AfterSheet $event) {
                $event->sheet->insertNewRowBefore(1, 1);
                $event->sheet->getStyle('1')->getAlignment()->applyFromArray(
                    array('horizontal' => 'center')
                );

                $event->sheet->mergeCells('A1:B1');
                $event->sheet->setCellValue('A1','NOTIFICACIÓN (SIR)');

                $event->sheet->mergeCells('C1:AH1');
                $event->sheet->setCellValue('C1','INFORMACION DEMOGRAFICA USUARIO Y EMPRESA (REGISTRO CLIENTE)');

                $event->sheet->mergeCells('AI1:AK1');
                $event->sheet->setCellValue('AI1','MEL CITAS AGENDA');

                $event->sheet->mergeCells('AL1:AN1');
                $event->sheet->setCellValue('AL1','SICOLOGIA CITAS AGENDA');

                $event->sheet->mergeCells('AO1:AW1');
                $event->sheet->setCellValue('AO1','GESTION DEL CASO MEL (SIR)');

                $event->sheet->mergeCells('AX1:BD1');
                $event->sheet->setCellValue('AX1','INFORMACIÓN INCAPACIDADES (SISPOS)');

                $event->sheet->mergeCells('BE1:BH1');
                $event->sheet->setCellValue('BE1','FECHAS PROYECTADAS');

                $event->sheet->mergeCells('BI1:CB1');
                $event->sheet->setCellValue('BI1','GESTION CRHs (SIR)');

                $event->sheet->mergeCells('CC1:CJ1');
                $event->sheet->setCellValue('CC1','1 INSTANCIA DE CPCLO ');

                $event->sheet->mergeCells('CK1:CQ1');
                $event->sheet->setCellValue('CK1','2 INSTANCIA DE CPCLO ');

                $event->sheet->mergeCells('CR1:CU1');
                $event->sheet->setCellValue('CR1','3 INSTANCIA DE CPCLO ');

                $event->sheet->mergeCells('CV1:CY1');
                $event->sheet->setCellValue('CV1','DEMANDA DICTAMEN CPCLO');

                $event->sheet->mergeCells('CZ1:DH1');
                $event->sheet->setCellValue('CZ1','DICTAMEN CPCLO AL CIERRE');

                $event->sheet->mergeCells('DI1:DN1');
                $event->sheet->setCellValue('DI1','ABUSO DEL DERECHO');

                $event->sheet->mergeCells('DO1:DT1');
                $event->sheet->setCellValue('DO1','CIERRE REINTEGRO');

                $event->sheet->mergeCells('DU1:DW1');
                $event->sheet->setCellValue('DU1','GESTION PERDIDOS');

                $event->sheet->mergeCells('DX1:EC1');
                $event->sheet->setCellValue('DX1','GESTIÓN DEUDA');
            }
        ];
    }

}
