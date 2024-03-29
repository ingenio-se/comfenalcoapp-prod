<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Incapacidad;
use App\Licencia;
use DB;

class ReportesController extends Controller
{
    //
    public function index(){
        return view('reportes.reportes');
    }
    public function reportesips(){
        return view('reportes.reportesips');
    }
    public function reportIncapacidades(Request $request){
        $datos = $request->datos;
        $desde = $datos['desde'];
        $hasta = $datos['hasta'];


        $i = Incapacidad::select(
            'incapacidad.id',
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
            DB::raw("CASE contingencia_origen
                    WHEN 1 THEN 'Enfermedad general'
                    WHEN 2 THEN 'Enfermedad laboral'
                    WHEN 3 THEN 'Accidente de trabajo'
                ELSE '' END AS descripcion_contingencia"),
            'codigo_diagnostico',
            'codigo_diagnostico1',
            'codigo_diagnostico2',
            'codigo_diagnostico3',
            'lateralidad',
            'tipo_prestador',
            DB::raw("CASE tipo_prestador
                    WHEN 1 THEN 'IPS'
                    WHEN 2 THEN 'Consultorio'
                ELSE '' END AS descripcion_tipo_prestador"),
            'incapacidad.ips',
            'ips.nit as NIT_IPS',
            'ips.nombre_sede as NOMBRE_IPS',
            'medicos.nombre as medico',
            DB::raw("CASE medicos.especialidad
                    WHEN 1 THEN 'Médico general'
                    WHEN 2 THEN 'Médico especialista'
                    WHEN 3 THEN 'Odontólogo general'
                    WHEN 4 THEN 'Odontólogo especialista'
                ELSE '' END AS especialidad_medico"),
            'incapacidad.causa_externa',
            'causae.causa_externa as descripcion_causa_externa',
            'estado_afiliado',
            'tipo_cotizante',
            'programa_afiliado',
            'aportantes',
            'validacion as NombreEmpresa',
            'observacion',
            'estado_id',
            'estados_incapacidad.estado as estados_incapacidad',
            'observacion_estado',
            'incapacidad.created_at',
            'incapacidad.updated_at',
            'programa_afiliado as descripcion_programa_afiliado',
            'grupo_servicio',
            'modo_prestacion',
            'incapacidad_retroactiva'
        )->leftJoin('ips','ips.id','=','incapacidad.ips')
        ->leftJoin('causae','causae.id','=','incapacidad.causa_externa')
        ->leftJoin('estados_incapacidad','estados_incapacidad.id','=','incapacidad.estado_id')
        ->leftJoin('medicos','medicos.id','=','incapacidad.medico_id')
        ->where('incapacidad.id','>',0);
        if ($datos['ips']!=""){
            $i->where('incapacidad.ips',$datos['ips']);
        }
        if ($datos['medico']!=""){
            $i->where('incapacidad.medico_id',$datos['medico']);
        }
        if ($datos['paciente']!=""){
            $i->where('incapacidad.num_documento_afiliado',$datos['paciente']);
        }
        if ($datos['empresa']!=""){
            $i->where('incapacidad.aportantes','like', '%'.$datos['empresa'].'%');
        }
        if ($datos['tipoCotizante']!=""){
            $i->where('incapacidad.programa_afiliado','like', '%'.$datos['tipoCotizante'].'%');
        }
        if ($datos['codigoDiagnostico']!=""){
            $i->where('incapacidad.codigo_diagnostico',$datos['codigoDiagnostico']);
        }
        if ($datos['contingencia']!=""){
            $i->where('incapacidad.contingencia_origen',$datos['contingencia']);
        }
        if ($datos['estado']!=""){
            $i->where('incapacidad.estado_id',$datos['estado']);
        }
        if ($datos['soat']=="si"){
            $i->where('incapacidad.causa_externa',2);
        }
        if (($datos['desde']!="")&&($datos['hasta'])){
            $desde = $desde." 00:00:00";
            $hasta = $hasta." 11:59:59";
            $i->whereBetween('incapacidad.created_at', [$desde, $hasta]);
        }
        $totales=array();
        $totales["total"]=$i->count();
        $totales["dias"] = $i->sum('dias_solicitados');
        $i = $i->get();
        foreach ($i as $key=>$incapacidad) {
            if (isset($incapacidad->NombreEmpresa)){
                try {
                    $afiliado = json_decode($incapacidad->NombreEmpresa);
                    $afiliado = isset($afiliado->responseMessageOut->body->response->validadorResponse->DsAfiliado->Afiliado)?
                    $afiliado->responseMessageOut->body->response->validadorResponse->DsAfiliado->Afiliado:null;
                    if(is_object($afiliado)){
                        $i[$key]->NombreEmpresa=isset($afiliado->NombreEmpresa)?$afiliado->NombreEmpresa:null;
                        $i[$key]->descripcion_programa_afiliado=isset($afiliado->DescripcionPrograma)?$afiliado->DescripcionPrograma:null;
                    }elseif (is_array($afiliado)) {
                        $NE=[];$DPA=[];
                        foreach ($afiliado as $value) {
                            if(isset($value->NombreEmpresa)){
                                $NE[] = $value->NombreEmpresa;
                            }
                            if(isset($value->DescripcionPrograma)){
                                $DPA[] = $value->DescripcionPrograma;
                            }
                        }
                        $i[$key]->NombreEmpresa=implode(', ',$NE);
                        $i[$key]->descripcion_programa_afiliado=implode(', ',$DPA);
                    }else{
                        $i[$key]->NombreEmpresa= null;
                    }
                } catch (\Throwable $th) {
                    $i[$key]->NombreEmpresa=null;
                }
            }
        }

       //$i = Incapacidad::first();
        return response()->json([
            'data' => $i,
            'totales'=>$totales

        ]);
    }
    public function reportLicencias(Request $request){
        $datos = $request->datos;
        $desde = $datos['desde'];
        $hasta = $datos['hasta'];


        $i = Licencia::select(
            'licencias.id',
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
            DB::raw("CASE tipo_licencia
                    WHEN 1 THEN 'Maternidad Normal'
                    WHEN 2 THEN 'Parto no viable'
                    WHEN 3 THEN 'Paternidad'
                    WHEN 4 THEN 'Parto prematuro'
                    WHEN 5 THEN 'Parto normal múltiple'
                    WHEN 6 THEN 'Parto prematuro múltiple'
                    WHEN 10 THEN 'Fallecimiento de la madre'
                    WHEN 12 THEN 'Fallo de tutela'
                    WHEN 13 THEN 'Enfermedad materna grave'
                    WHEN 14 THEN 'Adopción'
                    WHEN 15 THEN 'Prelicencia en época de parto (anticipo)'
                ELSE '' END AS descripcion_tipo_licencia"),
            'contingencia_origen',
            DB::raw("CASE contingencia_origen
                    WHEN 1 THEN 'Licencia'
                ELSE '' END AS descripcion_contingencia_origen"),
            'codigo_diagnostico',
            'codigo_diagnostico1',
            'codigo_diagnostico2',
            'codigo_diagnostico3',
            'licencias.causa_externa',
            'causae.causa_externa as descripcion_causa_externa',
            'tipo_prestador',
            'licencias.ips',
            'ips.nit as NIT_IPS',
            'ips.nombre_sede as NOMBRE_IPS',
            'licencias.medico_id',
            'medicos.nombre as medico',
            DB::raw("CASE medicos.especialidad
                    WHEN 1 THEN 'Médico general'
                    WHEN 2 THEN 'Médico especialista'
                    WHEN 3 THEN 'Odontólogo general'
                    WHEN 4 THEN 'Odontólogo especialista'
                ELSE '' END AS especialidad_medico"),
            'tipo_atencion',
            'edad_gestacional_semanas',
            'edad_gestacional_dias',
            'dias_gestacion',
            'recien_nacido_viable',
            'licencias.estado_id',
            'estados_incapacidad.estado as descripcion_estado',
            'observacion',
            'aportantes',
            'licencias.created_at',
            'licencias.updated_at',
            'licencias.deleted_at',
            'fecha_probable_parto',
            'certificados'
        )->leftJoin('causae','causae.id','=','licencias.causa_externa')
        ->leftJoin('ips','ips.id','=','licencias.ips')
        ->leftJoin('medicos','medicos.id','=','licencias.medico_id')
        ->leftJoin('estados_incapacidad','estados_incapacidad.id','=','licencias.estado_id')
        ->where('licencias.id','>',0);
        if ($datos['ips']!=""){
            $i->where('licencias.ips',$datos['ips']);
        }
        if ($datos['medico']!=""){
            $i->where('licencias.medico_id',$datos['medico']);
        }
        if ($datos['paciente']!=""){
            $i->where('licencias.num_documento_afiliado',$datos['paciente']);
        }
        if ($datos['tipoLicencia']!=""){
            $i->where('licencias.tipo_licencia',$datos['tipoLicencia']);
        }
        /*
        if ($datos['codigoDiagnostico']!=""){
            $i->where('codigo_diagnostico',$datos['codigoDiagnostico']);
        }
        if ($datos['contingencia']!=""){
            $i->where('contingencia_origen',$datos['contingencia']);
        }
        if ($datos['soat']=="si"){
            $i->where('causa_externa',2);
        }*/
        if (($datos['desde']!="")&&($datos['hasta'])){
            $i->whereBetween('licencias.created_at', [$desde, $hasta]);
        }
        $totales=array();
        $totales["total"]=$i->count();
        $totales["dias"] = $i->sum('dias_solicitados');
        $i = $i->get();
       //$i = Incapacidad::first();
        return response()->json([
            'data' => $i,
            'totales'=>$totales

        ]);
    }
}
