<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Ips;
use App\Cie10;
use App\Medico;
use App\Causae;
use App\Incapacidad;
use App\Licencia;
use App\User;
use App\Clasesa;
use App\Descripcionesp;
use App\Estadosi;
use App\Estadosa;
use App\Diasmax;
use App\Cronicos;
use App\Grupos;
use App\Modop;
use App\Incapcidadr;
use Illuminate\Support\Facades\Hash;
use Carbon\Carbon;
use App\Http\Controllers\IncapacidadController;
use PDF;

use Auth;



use Luecano\NumeroALetras\NumeroALetras;

class ApiController extends Controller
{
    protected $IncapacidadController;
    public function __construct(IncapacidadController $IncapacidadController)
    {
        $this->IncapacidadController = $IncapacidadController;
    }
    //lists
    public function list($tipo){
        if ($tipo== "ips"){ 
            $data=$this->loadIpsDB(); 
        }
        if ($tipo== "causas"){ 
            $data=$this->loadCausasDB(); 
        }
        if ($tipo== "medicos"){ 
            $data=$this->loadMedicosDB(); 
        }
        if ($tipo== "especialidades"){ 
            $data=$this->loadEspDB(); 
        }
        if ($tipo== "tiposCotizante"){ 
            $data=$this->loadTcDB(); 
        }
        if ($tipo== "estados"){ 
            $data=$this->loadEstadosDB(); 
        }
        if ($tipo== "grupos"){ 
            $data=$this->loadGruposDB(); 
        }
        if ($tipo== "modop"){ 
            $data=$this->loadModopDB(); 
        }
        if ($tipo== "incar"){ 
            $data=$this->loadIncarDB(); 
        }
        return response()->json([
            'data' => $data
        ]);
    }
    private function loadIpsDB(){
        $ips=Ips::orderBy('nombre_sede','asc')->get();
        return $ips;
    }
    private function loadMedicosDB(){
        $medicos=Medico::orderBy('nombre','asc')->get();
        return $medicos;
    }
    private function loadEspDB(){
        $esp=Diasmax::orderBy('especialidad','asc')->get();
        return $esp;
    }
    private function loadCausasDB(){
        $causas=Causae::all();
        return $causas;
    }
    private function loadGruposDB(){
        $grupos=Grupos::where('estado',1)->get();
        return $grupos;
    }
    private function loadModopDB(){
        $modop=Modop::where('estado',1)->get();
        return $modop;
    }
    private function loadIncarDB(){
        $incar=Incapcidadr::where('estado',1)->get();
        return $incar;
    }
    private function loadTcDB(){
        $tc=Descripcionesp::where('incapacidad',1)->orderBy('descripcion','asc')->get();
        return $tc;
    }
    private function loadEstadosDB(){
        $estados=Estadosi::where('activo',1)->orderBy('estado','asc')->get();
        return $estados;
    }
    public function search($tipo,$value){
        if ($tipo=="diagnostico"){
            $data=Cie10::where('descripcion_diagnostico','like','%'.$value.'%')
            ->orWhere('codigo',$value)
            ->where('num_dias_maximo_solicitud','>',0)->get();
        }
        if ($tipo=="diagnosticoLicencia"){
            $data=Cie10::where('tipo_licencia',$value)->get();
        }
        return response()->json([
            'data' => $data
        ]);
    }
    
    public function datosMedico(){
        $id = Auth::user()->id;
        $medico = Medico::where('user_id',$id)->get();
        //dd($medico);
        $dias = Diasmax::where('id',$medico[0]->especialidad)->get();
        
       return response()->json([
        'data' => $medico,
        'dias' =>$dias
        ]);

    }
    public function buscarHistorico($tipo,$numero){
        //return $numero;
        
        if (Incapacidad::where('tipo_documento_afiliado',$tipo)->where('num_documento_afiliado',$numero)->exists()){
            $datos= Incapacidad::where('tipo_documento_afiliado',$tipo)->where('num_documento_afiliado',$numero)->orderBy('created_at','desc')->get();
           
        }
        else{
            $datos="no";
        }
        /*dd($datos);
        return* response()->json([
            'dataos' => $datos,
        ]);
        */
      //  dd($datos);
        return view('incapacidades.historicoIncapacidad',[
            'datos' => $datos
        ]);
    }
    public function buscarHistoricoUltimaDias($tipo,$numero){
        //return $numero;
        
        if (Incapacidad::where('tipo_documento_afiliado',$tipo)->where('num_documento_afiliado',$numero)->exists()){
            $i= Incapacidad::where('tipo_documento_afiliado',$tipo)->where('num_documento_afiliado',$numero)->orderBy('created_at','desc')->first();
            $dias = $i->dias_solicitados;
            $codigo=$i->codigo_diagnostico;
            $cie10 = Cie10::where('codigo',$codigo)->first();
            $capitulo = $cie10->capitulo_grupo;
            $idant = $i->id;
            $prorrogaidant = $i->prorrogaid;
            $fechaFinUltima = $i->fecha_fin_incapacidad;

            return response()->json([
                'dias' => (int)$dias,
                'capitulo' => $capitulo,
                'idant' => $idant,
                'prorrogaidant' => (int)$prorrogaidant,
                'fechaFinUltima' => $fechaFinUltima
            ]);
        }
        else{
            $datos="no";
        }
        //dd($datos);
        return response()->json([
            'dias' => 0,
            'capitulo' => null,
            'idant' => null,
            'prorrogaidant' => null,
            'fechaFinUltima' => null
        ]);
    }
    public function historicoIncapacidades(){
        $datos= Incapacidad::orderBy('created_at','desc')->get();
       
        return view('incapacidades.historicoIncapacidad',[
            'datos' => $datos
        ]);
    }

    public function updateCie10(Request $request){
        $datos = $request->datos;
        $id = $datos['id'];
        $update = Cie10::find($id)->update($datos);

        return  "Código actualizado";
        
    }

    //saves

    public function saveIncapacidad(Request $request){
            $datos = $request->datos;
            
            /*if ($datos['prorroga']=="No"){
                if(Incapacidad::orderBy('id','desc')->first()->first() !== null){
                    $id = Incapacidad::latest()->where('prorrogaId',0)->first()->id;
                    $id+=1;
                }
                else{
                    $id=1;
                }   
            }
            else{
                $id =(int)$datos['id'];
            }*/
            $id =(int)$datos['id'];

            if (Incapacidad::where('id',$id)->where('prorrogaid',$datos['prorrogaId'])
                ->where('tipo_documento_afiliado',$datos['tipoDocAfiliado'])
                ->where('num_documento_afiliado',$datos['IDTrabajador'])
                ->exists()){
                return "La incapacidad ya se encuentra almacenada";
            }
            else{

           //return $datos;
            $i = Incapacidad::create([
                'id' => $id,
                'prorrogaid' => $datos['prorrogaId'],
                'tipo_prestador' => $datos['tipoPrestador'],
                'tipo_documento_afiliado' =>$datos['tipoDocAfiliado'],
                'num_documento_afiliado' => $datos['IDTrabajador'],
                'nombre_afiliado' =>$datos['nombreCompleto'],
                'estado_afiliado' =>$datos['estado'],
                'tipo_cotizante' =>$datos['tipoCotizante'],
                //'programa_afiliado'  =>$datos['descripcionPrograma'],
                'programa_afiliado'  =>$datos['programas'],
                'fecha_atencion' => $datos['fechaAtencion'],
                'fecha_inicio_incapacidad' => $datos['fechaInicioIncapacidad'],
                'dias_solicitados' => $datos['diasSolicitados'],
                'fecha_fin_incapacidad' => $datos['fechaFinIncapacidad'],
                'dias_reconocidos' => $datos['diasReconocidos'], 
                'causa_externa' => $datos['causae'],
                'contingencia_origen' =>$datos['contingencia'], 
                'observacion' => $datos['observacion'],
                
                'codigo_diagnostico' => $datos['codigoDiagnostico'],
                'codigo_diagnostico1' => $datos['codigoDiagnostico1'],
                'codigo_diagnostico2' =>$datos['codigoDiagnostico2'],
                'codigo_diagnostico3' => $datos['codigoDiagnostico3'],
                'ips' => $datos['ips_id'],
                'medico_id' => $datos['medico_id'],
                'lateralidad' => $datos['lateralidad_id'],
                'lateralidad1' => $datos['lateralidad_id1'],
                'lateralidad2' => $datos['lateralidad_id2'],
                'lateralidad3' => $datos['lateralidad_id3'],
                'prorroga' => $datos['prorroga'],
                'dias_acumulados_previos' => $datos['diasAcumuladosPrevios'],
                'dias_acumulados_ultima_incapacidad' => $datos['diasAcumuladosUltima'],
                'estado_id' => $datos['estado_id'],
                'observacion_estado' => $datos['observacion_estado'],

                'validacion' => $datos['validacion'],
                'aportantes' => $datos['aportantes'],
            ]);
                
            return  "Incapacidad almacenada";

            }
        
    }
    public function saveLicencia(Request $request){
        $datos = $request->datos;
        //return $datos;
        
        if (Licencia::where('id',$datos['id'])->exists()){
            return "La licencia ya se encuentra almacenada";
        }
        else{
        $i = Licencia::create([

            'id' => $datos['id'],
            
            'tipo_prestador' => $datos['tipoPrestador'],
            'tipo_documento_afiliado' =>$datos['tipoDocAfiliado'],
            'num_documento_afiliado' => $datos['IDTrabajador'],
            'nombre_afiliado' =>$datos['nombreCompleto'],
            'estado_afiliado' =>$datos['estado'],
            'tipo_cotizante' =>$datos['tipoCotizante'],
            'programa_afiliado'  =>$datos['descripcionPrograma'],

            'fecha_atencion' => $datos['fechaAtencion'],
            'fecha_inicio_licencia' => $datos['fechaInicioLicencia'],
            'dias_solicitados' => $datos['diasSolicitados'],
            'fecha_fin_licencia' => $datos['fechaFinLicencia'],

            'tipo_atencion' => $datos['tipoAtencion'],
            'edad_gestacional_semanas'=> $datos['semanasGestacion'],
            'edad_gestacional_dias'=> $datos['diasGestacion'],
            'dias_gestacion'=> $datos['diasGestacionC'],
            'recien_nacido_viable'=> $datos['nacidoViable'],
            'tipo_licencia'=> $datos['tipoLicencia'],
            
            'causa_externa' => $datos['causae'],
            'contingencia_origen' =>$datos['contingencia'], 
            'observacion' => $datos['observacion'],
            
            'codigo_diagnostico' => $datos['codigoDiagnostico'],
            'codigo_diagnostico1' => $datos['codigoDiagnostico1'],
            'codigo_diagnostico2' =>$datos['codigoDiagnostico2'],
            'codigo_diagnostico3' => $datos['codigoDiagnostico3'],
            'ips' => $datos['ips_id'],
            'medico_id' => $datos['medico_id'],
            
            'estado_id' => $datos['estado_id'],
            'observacion_estado' => $datos['observacion_estado'],
            'validacion' => $datos['validacion'],
            'aportantes' => $datos['aportantes'],
        ]);
            
        return  "Licencia almacenada";
        }
}
    public function saveUser(Request $request){
        $data = $request->datos;
        if(User::where('email',$data['correo'])->exists()){
           User::where('email',$data['correo'])
            ->update([
                'name' => $data['nombre'],
                'email' => $data['correo'],
                'password' => Hash::make($data['contraseña']),
                'tipo' => $data['tipo'],
            ]);
            $u=0;
        }
        else{
            $u = User::create([
                'name' => $data['nombre'],
                'email' => $data['correo'],
                'password' => Hash::make($data['contraseña']),
                'tipo' => $data['tipo'],
            
            ]);
        }
        $data=User::orderBy('name','asc')->get();

        return response()->json([
            'data' => $u
        ]);
            
        //return  "Usuario almacenado";
    
    }
    public function saveMedico(Request $request){
        $data = $request->datos;
        if(User::where('email',$data['correo'])->exists()){
            User::where('email',$data['correo'])
             ->update([
                 'name' => $data['nombre'],
                 'email' => $data['correo'],
                 'password' => Hash::make($data['contraseña']),
             ]);
             
        }
        else{
             $u = User::create([
                 'name' => $data['nombre'],
                 'email' => $data['correo'],
                 'password' => Hash::make($data['contraseña']),
                 'tipo' =>1,
             
             ]);
        }
        if(Medico::where('num_documento',$data['numeroDocumento'])->exists()){
            Medico::where('num_documento',$data['numeroDocumento'])
            ->update([
                'cod_medico' => $data['codigoMedico'],
                'nombre' => $data['nombre'],
                'tipo_documento'  => $data['tipoDocumento'],
                'num_documento' => $data['numeroDocumento'],
                'reg_medico' => $data['registroMedico'],
                'especialidad' => $data['especialidad'],
            ]);
            $m=0;
        }
        else{
            $m = Medico::create([
                'user_id' => User::where('email',$data['correo'])->first()->id,
                'cod_medico' => $data['codigoMedico'],
                'nombre' => $data['nombre'],
                'tipo_documento'  => $data['tipoDocumento'],
                'num_documento' => $data['numeroDocumento'],
                'reg_medico' => $data['registroMedico'],
                'especialidad' => $data['especialidad'],
            ]);
           
        }
        return response()->json([
            'data' => $m
        ]);
    }
    public function deleteUser(Request $request){
        if(User::where('id', $request->userId)->exists()){
            User::where('id', $request->userId)->delete();     
        } 
        return  "Usuario eliminado";
    }

    //gets
    public function getNumeroIncapacidad(){
        /*if(Incapacidad::latest()->first() !== null){
         $id = Incapacidad::latest()->where('prorrogaId',0)->first()->id;
         $id+=1;
        }
        else{
            $id=1;
        }        
        return response()->json([
            'data' => $id
        ]);**/
        if(Incapacidad::orderBy('id','desc')->first() !== null){
            $id = Incapacidad::orderBy('id','desc')->first()->id;
            $id+=1;
           }
           else{
               $id=1;
           }        
           return response()->json([
               'data' => $id
           ]);

    }
    public function getNumeroLicencia(){
        if(Licencia::latest()->first() !== null){
         $id = Licencia::latest()->first()->id;
         $id+=1;
        }
        else{
            $id=1;
        }  
             
        return response()->json([
            'data' => $id
        ]);

    }
    public function getSystemUsers(Request $request){
        $data=User::orderBy('name','asc')->get();
        return response()->json([
            'data' => $data
        ]);
    }
    public function getUser(Request $request){
        //return $request;
        $data=User::where('id', $request->userId)->get();
        return response()->json([
            'data' => $data
        ]);
    }
    public function getMedico(Request $request){
        //return $request;
        $userId = Medico::where('id', $request->medicoId)->first()->user_id;
        $u = User::where('id', $userId)->first();

        $data=Medico::where('id', $request->medicoId)->get();
        $data[0]['correo'] = $u->email;
        
        return response()->json([
            'data' => $data
        ]);
    }
    public function getMedicosUsers(Request $request){
        
        $data=Medico::orderBy('nombre','asc')->get();

        return response()->json([
            'data' => $data
        ]);
    }
    public function getSystemCausas(Request $request){
        
        $data=Causae::orderBy('id','asc')->get();

        return response()->json([
            'data' => $data
        ]);
    }
    public function getSystemCie10(Request $request){
        
        $data=Cie10::where('id','<',10)->orderBy('id','asc')->get();

        return response()->json([
            'data' => $data
        ]);
    }
    public function getCie10($id){
        
        $data=Cie10::where('id',$id)->orderBy('id','asc')->first();

        return response()->json([
            'data' => $data
        ]);
    }
    public function buscarCie10($campo,$texto){
        $data=Cie10::where($campo,'like','%'.$texto.'%')->get();

        return response()->json([
            'data' => $data
        ]);
    }
    

    public function getSystemEstados(Request $request){
        
        $data=Estadosi::orderBy('id','asc')->get();

        return response()->json([
            'data' => $data
        ]);
    }
    public function getSystemIps(Request $request){
        
        $data=Ips::orderBy('id','asc')->get();

        return response()->json([
            'data' => $data
        ]);
    }
    public function getSystemClasesa(Request $request){
        
        $data=Clasesa::orderBy('id','asc')->get();

        return response()->json([
            'data' => $data
        ]);
    }
    public function getSystemDescripciones(Request $request){
        
        $data=Descripcionesp::orderBy('id','asc')->get();

        return response()->json([
            'data' => $data
        ]);
    }
    public function getSystemEstadosa(Request $request){
        $data=Estadosa::orderBy('id','asc')->get();
        return response()->json([
            'data' => $data
        ]);
    }
    public function getSystemDiasmax(Request $request){
        $data=Diasmax::orderBy('id','asc')->get();
        return response()->json([
            'data' => $data
        ]);
    }
    //certificados

    public function certificadoIncapacidad($id,$pid,$a,$tipodoc,$idtr){
        
       // dd( $formatter->toWords(126, 0));

        if (!Incapacidad::where('id',$id)->where('prorrogaid',$pid)->where('tipo_documento_afiliado',$tipodoc)
        ->where('num_documento_afiliado',$idtr)->exists()){
            dd("La incapacidad no se encuentra almacenada");
        }

        $formatter = new NumeroALetras;
        $fechahora= Carbon::now();
        $d =Incapacidad::where('id',$id)->where('prorrogaid',$pid)->where('tipo_documento_afiliado',$tipodoc)
        ->where('num_documento_afiliado',$idtr)->first();
        
        $tipoDoc = $d->tipo_documento_afiliado;
        $numDoc = $d->num_documento_afiliado;
        $response =json_decode($d->validacion);
        $afiliado = $response->responseMessageOut->body->response->validadorResponse->DsAfiliado->Afiliado;
        
        if (is_array($afiliado) == false) {
            $nombre = $afiliado->Nombre;
            $primerApellido = $afiliado->PrimerApellido; 
            $segundoApellido="";
            if (gettype($afiliado->SegundoApellido) == "string") {
                $segundoApellido = $afiliado->SegundoApellido;
            }
            $nombreCompleto = $nombre." ".$primerApellido." ".$segundoApellido;
            $numDoc = $afiliado->IdAfiliado;
            $tipoAfiliado = $afiliado->ClaseAfiliacion;
            $tipoCotizante = $afiliado->DescripcionPrograma;
            $tipoAportante="";
            
            if (isset($afiliado->NombreEmpresa)){
                if (gettype($afiliado->NombreEmpresa) == "string") {
                    $nombreEmpresa =$afiliado->NombreEmpresa;
                }
                else{
                    $nombreEmpresa= $nombreCompleto;
                }
            }
            else{
                $nombreEmpresa= $nombreCompleto;
            }
            
        }
        else{
           
            $nombre = $afiliado[0]->Nombre;
            $primerApellido = $afiliado[0]->PrimerApellido; 
            $segundoApellido="";
            if (gettype($afiliado[0]->SegundoApellido) == "string") {
                $segundoApellido = $afiliado[0]->SegundoApellido;
            }
            
            $nombreCompleto = $nombre." ".$primerApellido." ".$segundoApellido;
            $numDoc = $afiliado[0]->IdAfiliado;
            $tipoAfiliado = $afiliado[0]->ClaseAfiliacion;
            $tipoCotizante = $afiliado[0]->DescripcionPrograma;
            $tipoAportante="";
            
            if (isset($afiliado[$a]->NombreEmpresa)){
                if (gettype($afiliado[$a]->NombreEmpresa) == "string") {
                    $nombreEmpresa =$afiliado[$a]->NombreEmpresa;
                }
                else{
                    $nombreEmpresa= $nombreCompleto;
                }
            }
            else{
                $nombreEmpresa= $nombreCompleto;
            }
           
        }

        //dd($validacion);

        $i = collect([]);
        $i->put('titulo','CERTIFICADO MÉDICO INCAPACIDAD TEMPORAL');
        $i->put('No',$d->id."-".$d->prorrogaid);

        if ($d->prorrogaid == 0){
            $prorroga = "NO";
        }
        else{
            $prorroga = "SI";
        }

        if ($d->tipo_prestador== 1){
            $ips=Ips::where('id',$d->ips)->first();
            $prestador = $ips->nombre_sede;
            $nitprestador = $ips->nit;
            $direccionprestador = $ips->direccion;
            $lugar = $ips->cod_municipio. " - ".$ips->municipio." - ".$ips->departamento; 
            $codigo_habilitacion=$ips->cod_habilitacion;
        }
        if ($d->tipo_prestador== 2){
           $prestador="Consultorio";
           $nitprestador = Medico::where('id',$d->medico_id)->first()->num_documento;
           $direccionprestador ="";
           $lugar="";
           $codigo_habilitacion="";
        }
        $contingencias=["","Enfermedad general","Enfermedad laboral","Accidente de trabajo"];
       
        if ($d->causa_externa=="2"){
            $soat="SI";
        }
        else{
            $soat="NO";
        }

        $nombrePrestador=Medico::where('id',$d->medico_id)->first()->nombre;
        $especialidad=Medico::where('id',$d->medico_id)->first()->especialidad;
        $tipoDocProf=Medico::where('id',$d->medico_id)->first()->tipo_documento;
        $numDocProf=Medico::where('id',$d->medico_id)->first()->num_documento;
        $registroMedico=Medico::where('id',$d->medico_id)->first()->reg_medico;

        $i->put('Nombre del prestador',$prestador);
        $i->put('Nit del prestador',$nitprestador);
        $i->put('Dirección del prestador',$direccionprestador);
        $i->put('Ciudad',"");
        $i->put('NombreEPS',"Comfenalco Valle de la gente EPS");
        $i->put('Fecha de impresion', $fechahora ->toDateTimeString());
        $i->put('Fecha de consulta médica',$d->fecha_atencion);
        $i->put('Fecha y hora de generacion',$d->created_at);
        $i->put('Nombre del paciente',$nombreCompleto);
        $i->put('Tipo de identificacion del paciente',$tipoDoc);
        $i->put('Numero de documento del paciente',$numDoc);
        $i->put('Tipo afiliado',$tipoAfiliado);

        $i->put('Tipo de cotizante',$tipoCotizante);
        $i->put('Tipo de aportante',$tipoAportante);
        $i->put('Nombre aportante',$nombreEmpresa);
        $i->put('Numero historia clinica',$numDoc);

        $i->put('Tipo de certificado','Incapacidad temporal');
        $i->put('Fecha de inicio de la incapacidad',$d->fecha_inicio_incapacidad);
        $i->put('Fecha fin de la incapacidad',$d->fecha_fin_incapacidad);

        $i->put('Días solicitados en letra',$formatter->toWords($d->dias_solicitados, 0));
        $i->put('Días solicitados',$d->dias_solicitados);
        $i->put('Prorroga',$prorroga);

        $i->put('Días acumulados',$d->dias_acumulados_previos);
        $i->put('Diagnostico principal',$d->codigo_diagnostico);
        $i->put('Diagnostico relacionado 1',$d->codigo_diagnostico1);
        $i->put('Diagnostico relacionado 2',$d->codigo_diagnostico2);      
        $i->put('Contingencia origen',$contingencias[$d->contingencia_origen]);

        $i->put('SOAT',$soat);
       
        $i->put('Nombre del profesional que genera',$nombrePrestador);      
        $i->put('Profesión profesional que genera',$especialidad);          
        $i->put('Firma profesional que genera',''); 
        $i->put('Tipo doc profesional que genera',$tipoDocProf); 
        $i->put('Numero doc profesional que genera',$numDocProf); 
        $especialidades=["","Médico general","Médico especialista","Odontólogo general","Odontólogo especialista","Médico Laboral"];
        
        $i->put('Especialidad',$especialidades[$especialidad]); 
        $i->put('Registro Médico',$registroMedico); 
        $i->put('Observacion EPS',''); 

        //nuevos campos 2022
        $i->put('Lugar de expedición',$lugar);
        $i->put('codigo habilitacion',$codigo_habilitacion);
        $i->put('Grupo de servicio','01-Consulta externa');
        $i->put('modo prestacion','01-Intramural');
        $i->put('incapacidad retroactiva','01-Urgencia xxxx');

        $pdf = PDF::loadView('incapacidades.certificado',[
            'i' => $i

        ])->setPaper('US Legal', 'landscape');
        
        return $pdf->stream('certificado.pdf');

        return view('incapacidades.certificado',[
            'i' => $i
        ]);
    }
    public function certificadoLicencia($id,$a){

        if (!Licencia::where('id',$id)->exists()){
            dd("La licencia no se encuentra almacenada");
        }

        $formatter = new NumeroALetras;
        $fechahora= Carbon::now();
        
        $d =Licencia::where('id',$id)->first();
        
        $tipoDoc = $d->tipo_documento_afiliado;
        $numDoc = $d->num_documento_afiliado;
        $nombreCompleto = $d->nombre_afiliado;
        $response =json_decode($d->validacion);
        //$response = json_decode($this->validacion($tipoDoc,$numDoc));
        //dd($response);
        //dd($response->responseMessageOut->body->response->validadorResponse->DsAfiliado->Afiliado);
        $afiliado = $response->responseMessageOut->body->response->validadorResponse->DsAfiliado->Afiliado;
        
        
        if (is_array($afiliado) == false) {
            /*nombreCompleto = $nombre." ".$primerApellido." ".$segundoApellido;*/
            $numDoc = $afiliado->IdAfiliado;
            $tipoAfiliado = $afiliado->ClaseAfiliacion;
            $tipoCotizante = $afiliado->DescripcionPrograma;
            $tipoAportante="";
            
            if (isset($afiliado->NombreEmpresa)){
                if (gettype($afiliado->NombreEmpresa) == "string") {
                    $nombreEmpresa =$afiliado->NombreEmpresa;
                }
                else{
                    $nombreEmpresa= $nombreCompleto;
                }
            }
            else{
                $nombreEmpresa= $nombreCompleto;
            }
        }
        else{
           
            /*$nombre = $afiliado[0]->Nombre;
            $primerApellido = $afiliado[0]->PrimerApellido; 
            $segundoApellido = $afiliado[0]->SegundoApellido;
            $nombreCompleto = $nombre." ".$primerApellido." ".$segundoApellido;*/
            $numDoc = $afiliado[0]->IdAfiliado;
            $tipoAfiliado = $afiliado[0]->ClaseAfiliacion;
            $tipoCotizante = $afiliado[0]->DescripcionPrograma;
            $tipoAportante="";
            if (isset($afiliado[$a]->NombreEmpresa)){
                if (gettype($afiliado[$a]->NombreEmpresa) == "string") {
                    $nombreEmpresa =$afiliado[$a]->NombreEmpresa;
                }
                else{
                    $nombreEmpresa= $nombreCompleto;
                }
            }
            else{
                $nombreEmpresa= $nombreCompleto;
            }
        }

        //dd($validacion);

        $i = collect([]);
        $i->put('titulo','CERTIFICADO MÉDICO LICENCIA DE MATERNIDAD');
        $i->put('No',$d->id);

       

        if ($d->tipo_prestador== 1){
            $ips=Ips::where('id',$d->ips)->first();
            $prestador = $ips->nombre_sede;
            $nitprestador = $ips->nit;
            $direccionprestador = $ips->direccion;
        }
        if ($d->tipo_prestador== 2){
           $prestador="Consultorio";
           $nitprestador = Medico::where('id',$d->medico_id)->first()->num_documento;
           $direccionprestador ="";
        }

       

        $nombrePrestador=Medico::where('id',$d->medico_id)->first()->nombre;
        $especialidad=Medico::where('id',$d->medico_id)->first()->especialidad;
        $tipoDocProf=Medico::where('id',$d->medico_id)->first()->tipo_documento;
        $numDocProf=Medico::where('id',$d->medico_id)->first()->num_documento;
        $registroMedico=Medico::where('id',$d->medico_id)->first()->reg_medico;

        $i->put('Nombre del prestador',$prestador);
        $i->put('Nit del prestador',$nitprestador);
        $i->put('Dirección del prestador',$direccionprestador);
        $i->put('Ciudad',"");
        $i->put('NombreEPS',"Comfenalco Valle de la gente EPS");
        $i->put('Fecha de impresion', $fechahora ->toDateTimeString());
        $i->put('Fecha de consulta médica',$d->fecha_atencion);
        $i->put('Fecha y hora de generacion',$d->created_at);
        $i->put('Nombre del paciente',$nombreCompleto);
        $i->put('Tipo de identificacion del paciente',$tipoDoc);
        $i->put('Numero de documento del paciente',$numDoc);
        $i->put('Tipo afiliado',$tipoAfiliado);

        $i->put('Tipo de cotizante',$tipoCotizante);
        $i->put('Tipo de aportante',$tipoAportante);
        $i->put('Nombre aportante',$nombreEmpresa);
        $i->put('Numero historia clinica',$numDoc);

        $i->put('Tipo de certificado','Licencia de maternidad');
        $i->put('Tipo de licencia',$d->tipo_licencia);
        $i->put('Fecha de inicio de la licencia',$d->fecha_inicio_licencia);
        $i->put('Fecha fin de la licencia',$d->fecha_fin_licencia);

        $i->put('Días solicitados en letra',$formatter->toWords($d->dias_solicitados, 0));
        $i->put('Días solicitados',$d->dias_solicitados);


        $i->put('Diagnostico principal',$d->codigo_diagnostico);
           
        $i->put('Contingencia origen',"Licencia");

        
       
        $i->put('Nombre del profesional que genera',$nombrePrestador);      
        $i->put('Profesión profesional que genera',$especialidad);          
        $i->put('Firma profesional que genera',''); 
        $i->put('Tipo doc profesional que genera',$tipoDocProf); 
        $i->put('Numero doc profesional que genera',$numDocProf); 
        $especialidades=["","Médico general","Médico especialista","Odontólogo general","Odontólogo especialista", "Médico Laboral"];
        
        $i->put('Especialidad',$especialidades[$especialidad]); 
       
        $i->put('Registro Médico',$registroMedico); 
        $i->put('Observacion EPS',''); 

        $pdf = PDF::loadView('incapacidades.certificadoLicencia',[
            'i' => $i

        ])->setPaper('US Legal', 'landscape');
        
        return $pdf->stream('certificado.pdf');

        return view('incapacidades.certificadoLicencia',[
            'i' => $i
        ]);
    }
    public function certificadoInvalidez($id){
        $i = collect([]);
        $cronicos = Cronicos::where('id',$id)->first();
        $ciudad = $cronicos->municipio;
        $nombrePrestador = $cronicos->nombre_ips;
        $nitPrestador = $cronicos->nit_ips_primaria;
        $nombre=$cronicos->nombre_1_usuario." ".$cronicos->nombre_2_usuario." ".$cronicos->apellido_1_usuario." ".$cronicos->apellido_2_usuario;
        $idp = $cronicos->id_usuario;
        $empresa = $cronicos->nombre_aportante;
        $nit = $cronicos->nit_aportante;
        $fechad = $cronicos->cpclo_fecha_1a_oport;
        $cpclo = $cronicos->cpclo_cierre;
        $codigo = $cronicos->cie10_evento_seguimiento;
        $fechae = $cronicos->fecha_estructuracion_cierre;
        $fechaa = $cronicos->fecha_it_inicio_ciclo;
        $origen = $cronicos->contingencia_origen_de_cierre;

        $id = Auth::id();
        $medico=Medico::where('user_id',$id)->first()->nombre;
        $especialidad=Medico::where('user_id',$id)->first()->especialidad;
        $tipoDocProf=Medico::where('user_id',$id)->first()->tipo_documento;
        $numDocProf=Medico::where('user_id',$id)->first()->num_documento;
        $registroMedico=Medico::where('user_id',$id)->first()->reg_medico;

        $fechahora= Carbon::now();
        $i->put('titulo','CERTIFICADO ESTADO INVALIDEZ');
        $i->put('No','');
        $i->put('Fecha de expedicion',$fechahora);
        $i->put('ciudad',$ciudad);
        $i->put('Nombre Prestador',$nombrePrestador);
        $i->put('Nit Prestador',$nitPrestador);
        $i->put('nombre',$nombre);
        $i->put('id',$idp);
        $i->put('empresa',$empresa);
        $i->put('nit',$nit);
        $i->put('fechad',$fechad);
        $i->put('cpclo',$cpclo);
        $i->put('codigo',$codigo);
        $i->put('fechaa',$fechaa);
        $i->put('fechae',$fechae);
        $i->put('origen',$origen);
        $i->put('Nombre del profesional que genera',$medico);      
        $i->put('Profesión profesional que genera',$especialidad);          
        $i->put('Firma profesional que genera',''); 
        $i->put('Tipo doc profesional que genera',$tipoDocProf); 
        $i->put('Numero doc profesional que genera',$numDocProf); 
        $especialidades=["","Médico general","Médico especialista","Odontólogo general","Odontólogo especialista"];
        
        $i->put('Especialidad',$especialidades[$especialidad]); 

        $pdf = PDF::loadView('incapacidades.certificadoInvalidez',[
            'i' => $i

        ])->setPaper('letter', 'Portrait');
        
       // dd($i);
        return $pdf->stream('certificadoInvalidez.pdf');


        return view('incapacidades.certificadoInvalidez',[
            'i' => $i
        ]);
    }
    
}
