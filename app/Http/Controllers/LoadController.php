<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Ips;
use App\User;
use App\Medico;
use App\Cie10;
use App\Causae;
use App\Estadosi;
use App\Estadosa;
use App\Clasesa;
use App\Descripcionesp;
use App\Diasmax;
use App\Cronicos;
use App\Judiciales;

class LoadController extends Controller
{
    //
    public function datos($tipo){
        if ($tipo== "ips"){ 
            $this->loadIps(); 
        }
        if ($tipo== "medicos"){ 
            $this->loadMedicos(); 
        }
        if ($tipo== "usuarios"){ 
            $this->loadUsuarios(); 
        }
        if ($tipo== "cie10"){ 
            $this->loadCie10(); 
        }
        if ($tipo== "causas"){ 
            $this->loadCausas(); 
        }
        if ($tipo== "estados"){ 
            $this->loadEstados(); 
        }
        if ($tipo== "estadosa"){ 
            $this->loadEstadosa(); 
        }
        if ($tipo== "clasesa"){ 
            $this->loadClasesa(); 
        }
        if ($tipo== "descripcionesp"){ 
            $this->loadDescripcionesp(); 
        }
        if ($tipo== "diasmax"){ 
            $this->loadDiasmax(); 
        }
        if ($tipo== "cronicos"){ 
            $this->loadCronicos(); 
        }
        if ($tipo== "judiciales"){ 
            $this->loadJudiciales(); 
        }
        if($tipo == "todos"){
            $this->loadIps(); 
            $this->loadUsuarios(); 
            $this->loadMedicos();  
            $this->loadCausas();  
            $this->loadEstados(); 
            $this->loadEstadosa(); 
            $this->loadClasesa(); 
            $this->loadDescripcionesp(); 
            $this->loadDiasmax(); 
            $this->loadCronicos(); 
            $this->loadJudiciales(); 
            $this->loadCie10();  
        }
        return 'Datos cargados';
    }
    private function loadJudiciales(){
        $file = public_path('csv/judiciales.csv');
        $customerArr = $this->csvToArray($file);
        //dd($customerArr);
        for ($i = 0; $i < count($customerArr); $i ++){
            //dd($customerArr[$i]);
            Judiciales::firstOrCreate($customerArr[$i]);
            //Cronicos::create($customerArr[$i]);
        }   
     
    }
    private function loadCronicos(){
        $file = public_path('csv/cronicos.csv');
        $customerArr = $this->csvToArray($file);
        //dd($customerArr);
        for ($i = 0; $i < count($customerArr); $i ++){
            //dd($customerArr[$i]);
            Cronicos::firstOrCreate($customerArr[$i]);
            //Cronicos::create($customerArr[$i]);
        }   
     
    }
    private function loadIps(){
        $file = public_path('csv/IPS.csv');
        $customerArr = $this->csvToArray($file);
        //dd($customerArr);
        for ($i = 0; $i < count($customerArr); $i ++){
            Ips::firstOrCreate($customerArr[$i]);
        }   
     
    }
    private function loadMedicos(){
        $file = public_path('csv/medicos.csv');
        $customerArr = $this->csvToArray($file);
        //dd($customerArr);
        for ($i = 0; $i < count($customerArr); $i ++){
            Medico::firstOrCreate($customerArr[$i]);
        }   
    }
    private function loadCausas(){
        $file = public_path('csv/causaExterna.csv');
        $customerArr = $this->csvToArray($file);
        //dd($customerArr);
        for ($i = 0; $i < count($customerArr); $i ++){
            Causae::firstOrCreate($customerArr[$i]);
        }   
    }
    private function loadEstados(){
        $file = public_path('csv/estados.csv');
        $customerArr = $this->csvToArray($file);
        //dd($customerArr);
        for ($i = 0; $i < count($customerArr); $i ++){
            Estadosi::firstOrCreate($customerArr[$i]);
        }   
    }
    private function loadUsuarios(){
        $file = public_path('csv/usuarios.csv');
        $customerArr = $this->csvToArray($file);
        //dd($customerArr);
        for ($i = 0; $i < count($customerArr); $i ++){
            User::firstOrCreate($customerArr[$i]);
        }    
    }
    private function loadCie10(){
        $file = public_path('csv/CIE10.csv');
        $customerArr = $this->csvToArray($file);
        //dd($customerArr);
        for ($i = 0; $i < count($customerArr); $i ++){
            //dd($customerArr[$i]['descripcion_diagnostico']);
            Cie10::create($customerArr[$i]);
        }    
    }
    private function loadEstadosa(){
        $file = public_path('csv/estadosa.csv');
        $customerArr = $this->csvToArray($file);
        //dd($customerArr);
        for ($i = 0; $i < count($customerArr); $i ++){
            Estadosa::firstOrCreate($customerArr[$i]);
        }   
    }
    private function loadClasesa(){
        $file = public_path('csv/clasesa.csv');
        $customerArr = $this->csvToArray($file);
        //dd($customerArr);
        for ($i = 0; $i < count($customerArr); $i ++){
            Clasesa::firstOrCreate($customerArr[$i]);
        }   
    }
    private function loadDescripcionesp(){
        $file = public_path('csv/descripcionesp.csv');
        $customerArr = $this->csvToArray($file);
        //dd($customerArr);
        for ($i = 0; $i < count($customerArr); $i ++){
            Descripcionesp::firstOrCreate($customerArr[$i]);
        }   
    }
    private function loadDiasmax(){
        $file = public_path('csv/diasmax.csv');
        $customerArr = $this->csvToArray($file);
        //dd($customerArr);
        for ($i = 0; $i < count($customerArr); $i ++){
            Diasmax::firstOrCreate($customerArr[$i]);
        }   
    }
    private function csvToArray($filename = '', $delimiter = ';'){
    if (!file_exists($filename) || !is_readable($filename))
        return false;

    $header = null;
    $data = array();
    
    if (($handle = fopen($filename, 'r')) !== false)
    {
        
        while (($row = fgetcsv($handle, 0, $delimiter)) !== false)
        {
            //array_push($data,$row);
            
            if (!$header)
                $header = $row;
            else
                //dd(count($row));
                $data[] = array_combine($header, $row);
                //dd($data);
            
        }
        fclose($handle);
    }

    return $data;
    }
}
