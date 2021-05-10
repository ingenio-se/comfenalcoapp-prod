<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Cronicos;
use DB;

class CronicosController extends Controller
{
    //
    public function index(){
        return view('cronicos.cronicos');
    }
    public function getCronicos(){
        $data = Cronicos::where('id','<',11)->get();
        foreach ($data as $key => $value) {
            $data->$key = $this->formulas($value);
        }
        return response()->json([
            'data' => $data
        ]);
    }
    public function buscarCronicos(Request $request){
        $datos = $request->datos;

        $identificacion = $datos['identificacion'];
        $desde = $datos['desde'];
        $hasta = $datos['hasta'];
       // return $datos;

        $estado = $datos['estado'];
        //$conducta = $datos['conducta'];
        $motivo = $datos['motivo'];

        $cronicos = Cronicos::where('id','>=',1);

        if ($identificacion != ""){
            $data = $cronicos->where('id_usuario',$identificacion);
        }
        if ($estado != ""){
            $data = $cronicos->where('estado_seguimiento',$estado);
        }
        if ($motivo != ""){
            $data = $cronicos->where('motivo_estado_seguimiento',$motivo);
        }

        if (($datos['desde']!="")&&($datos['hasta']!="")){
            $data = $cronicos->whereBetween('fecha_notificacion', [$desde, $hasta]);
        }
        $data = $data->get();
        foreach ($data as $key => $value) {
            $data->$key = $this->formulas($value);
        }
        return response()->json([
            'data' => $data
        ]);
    }
    public function buscarCronico(Request $request){
       // $id ="5333106";
        $id =$request['id'];
        $consec=0;
        $data = array();
        $alarmas = array();
        $data["consec"]=0;
        $data["visible"] = "visible";
        if (Cronicos::where('id_usuario',$id)->exists()){
            $cr = Cronicos::where('id_usuario',$id)->first();
            $cr = $this->formulas($cr);
            $consec = $cr->id;
            $motivo =$cr->motivo_estado_seguimiento;
            $crh1 = $cr->decision_crh1;
            $crh2 = $cr->decision_crh2_favorable;
            $estado = $cr->estado_seguimiento;
            $reintegro = $cr->fecha_reintegro_por_mmm;
           // dd($reintegro);
            $abuso = $cr->fecha_carta_suspension_abuso_del_derecho;
            if ($motivo == "TRAMITE DE PENSION"){
                array_push($alarmas,"Paciente con Incapacidad permanente total");
                $data["visible"] = "oculto";
            }
            if (($crh1 == "SI" && $crh2=="NO") || ($crh1 == "NO" && $crh2=="NO") || ($crh1 == "NO" && $crh2=="")){
                array_push($alarmas,"Paciente con concepto de rehabilitación no favorable ");
                $data["visible"] = "oculto";
            }

            if (($estado == "SEGUIMIENTO") && ($motivo=="IPP")){
                array_push($alarmas, "Paciente con Incapacidad permanente parcial (NOTA: REMITIR A MEDICINA LABORAL LA INCAPACIDAD LA GENERA EL MEDICO LABORAL)");
                $data["visible"] = "oculto";
            }

            if (($estado == "SEGUIMIENTO") && ($motivo!="IPP") &&  ($reintegro!="")){
                array_push($alarmas, "Paciente seguimiento Incapacidad continua prolongada - Reintegrado ".$reintegro);
            }
            if ($abuso !=""){
                array_push($alarmas, "Abuso del derecho - comunicado de abuso y suspensión en ".$abuso);
                $data["visible"] = "oculto";
            }

            $data["consec"]= $consec;
        }
        $data["alarmas"]=$alarmas;
        return response()->json([
            'data' => $data
        ]);
    }
    public function verCronico($id,$enable){
      //  $cronico = Cronicos::where('id',$id)->first();
        //dd($cronico);
        return view('cronicos.verCronico',[
            'id' => $id,
            'enable'=>$enable
        ]);
    }
    public function getCronico($id){
        $data = Cronicos::where('id',$id)->first();

        $data = $this->formulas($data);

        return response()->json([
            'data' => $data
        ]);
    }

    public function updateCronico(Request $request){
        $datos = $request->toArray()['datos'];
        $id = $datos['id'];
        $cronico = Cronicos::find($id);
        foreach ($datos as $key => $value) {
            $cronico->$key = $value;
        }

        $cronico = $this->formulas($cronico);

        $cronico->update();

        return  "Información actualizada";

    }

    public function deleteCronico(Request $request, $id){
        $cronico = Cronicos::find($id);

        $cronico->delete();

        return  "Registro eliminado exitosamente";

    }

    public function addCronico(Request $request){
        $datos = $request->toArray()['datos'];
        $cronico = new Cronicos;
        foreach ($datos as $key => $value) {
            $cronico->$key = $value;
        }

        $cronico->save();

        $cronico = $this->formulas($cronico);

        $cronico->update();

        return  "Cronico Agregado";

    }

    private function formulas($cronico)
    {
        $cronico->consecutivo = $cronico->id;

        $cronico->ano_notificacion = (strtotime($cronico->fecha_notificacion))?(
            (date('Y',strtotime($cronico->fecha_notificacion))=='1900')?
            '2019':(
                (date('Y',strtotime($cronico->fecha_notificacion))<='2015')?'Años Anteriores':(
                    date('Y',strtotime($cronico->fecha_notificacion))))):
            '';

        $cronico->cant_ciclos = DB::select("select count(id) as cant_ciclos from cronicos
        where id_usuario = ?", [$cronico->id_usuario])[0]->cant_ciclos;

        $cronico->cc_repetidos = ($cronico->cant_ciclos > 1)? true : false;

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
                        ($cpcloc>=50)?"05. nene Entre Mayor 50%":""))));

        return $cronico;
    }
}
