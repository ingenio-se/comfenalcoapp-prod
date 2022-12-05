
<!DOCTYPE html>
<html>
<head>
	<title>Certificado de Licencia</title>

<link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.0/css/bootstrap.min.css" integrity="sha384-9aIt2nRpC12Uk9gS9baDl411NQApFmC26EwAOH8WgZl5MYYxFfc+NcPb1dKGj7Sk" crossorigin="anonymous">
<style>	

.bg-white{
	background-color: white;

}
.spaced{
	padding: 10px;
}

.font-ten{
    font-size:10px;
}

.font-eleven{
	font-size: 11px;
	
}
.table{
    margin: 0 !important; 
}
tr td{
  padding: 1 !important;
  margin: 0 !important;
}
@page {
  margin: 10;
}
</style>   
</head>
<body class="bg-white font-eleven">

<div class="row">
    <div class="col-sm-12  mx-auto">
        <table class="table table-bordered">
            <tr>
            <td ><img  src="img/comfenalcovalle.png" width="50" height="17"></td>
            <td class="font-weight-bold">{{ $i["titulo"] }}</td>
            <td class="font-weight-bold">Licencia No.</td><td>{{ $i["No"] }}</td>
            <td style="padding:0">
                <table class="table table-bordered">
                    <tr>
                        <td class="font-weight-bold">Fecha consulta</td>
                        <td>{{ $i["Fecha de consulta médica"] }}</td>
                    </tr>
                    <tr>
                        <td class="font-weight-bold">Lugar de expedición</td>
                        <td>{{ $i["Lugar de expedición"] }}</td>
                    </tr>
                </table>
                
            </td>
            <td>

            </td>
            
            </tr>
        </table>
    </div>

</div>
<br><br><br>
<div class="row">
    <div class="col-sm-12  mx-auto">
    <table class="table table-bordered table-sm">
            <tr><td class="font-weight-bold">Paciente</td>
            
            <td>{{ $i["Nombre del paciente"] }}</td>
            <td class="font-weight-bold">Identificación</td><td>{{ $i["Tipo de identificacion del paciente"]." ".$i["Numero de documento del paciente"] }}</td>
            </tr>
            <tr>
                <td class="font-weight-bold">Tipo afiliado</td><td>{{ $i["Tipo afiliado"] }}</td>
                <td class="font-weight-bold">Historia clínica</td><td></td>
                <td class="font-weight-bold">Tipo de cotizante</td><td>{{ $i["Tipo de cotizante"] }}</td> 
            </tr>
    </table>
    <table class="table table-bordered table-sm ">
            <tr><td class="font-weight-bold">Prestador</td>
            <td>{{ $i["Nombre del prestador"] }}</td>
            <td class="font-weight-bold">Nit</td><td>{{ $i["Nit del prestador"]}}</td>
            <td class="font-weight-bold">Código Habilitación</td><td>{{ $i["codigo habilitacion"] }}</td> 
            </tr>
            <tr>
                <td class="font-weight-bold">Dirección</td><td>{{ $i["Dirección del prestador"] }}</td>
                
                <td class="font-weight-bold">EPS</td><td>{{ $i["NombreEPS"] }}</td>
                <td class="font-weight-bold">Aportante</td><td>{{ $i["Nombre aportante"] }}</td>
            </tr>       
    </table>
    <table class="table table-bordered table-sm">
            <tr><td class="font-weight-bold">Licencia</td>
           <!-- <td class="font-weight-bold">Tipo de certificado</td><td>{{ $i["Tipo de certificado"] }}</td>
            <td class="font-weight-bold">Tipo de licencia</td><td>{{ $i["Tipo de licencia"] }}</td>-->
                <td class="font-weight-bold">Fecha Inicio</td><td>{{ $i["Fecha de inicio de la licencia"] }}</td>
                <td class="font-weight-bold">Fecha Fin</td><td>{{ $i["Fecha fin de la licencia"] }}</td>
                <td class="font-weight-bold">Fecha Probable de Parto</td><td>{{ $i["Fecha Probable de Parto"] }}</td>
                <td class="font-weight-bold">Edad Gestacional (semanas)</td><td>{{ $i["Edad Gestacional"] }}</td>
            </tr>
            <tr>
                <td class="font-weight-bold">Embarazo Múltiple </td><td>{{ $i["Embarazo Multiple"] }}</td>
                <td class="font-weight-bold">Certificado(s)</td><td class="">{{ $i["Certificados"] }}</td>
            </tr>
            <tr>
                <td class="font-weight-bold">Días </td><td>{{ $i["Días solicitados"] }}</td>
                <td class="font-weight-bold">Días en letras</td><td class="">{{ $i["Días solicitados en letra"] }}</td>
            </tr>
    </table>
    <table class="table table-bordered table-sm">
        <tr><td class="font-weight-bold">Diagnostico principal</td><td>{{ $i["Diagnostico principal"] }}</td>     
        <td class="font-weight-bold">Contingencia origen</td><td>{{ $i["Contingencia origen"] }}</td>
        
        </tr>   
    </table>

    <table class="table table-bordered table-sm">
        <tr><td class="font-weight-bold">Profesional</td>
        
            <td>{{ $i["Nombre del profesional que genera"] }}</td>
            <td class="font-weight-bold">Identificación</td><td>{{ $i["Tipo doc profesional que genera"]." ".$i["Numero doc profesional que genera"] }}</td>
            <td class="font-weight-bold">Reg. Médico</td><td>{{ $i["Registro Médico"] }}</td> 
            <td class="font-weight-bold">Especialidad</td><td>{{ $i["Especialidad"] }}</td> 
        </tr>
    </table>

    <table class="table table-bordered table-sm">
    <tr><td style="font-size: 10px">Este certificado no implica el reconocimiento de la certificación ni de la prestación económica. El trámite ante la EPS debe ser realizado por el aportante (empresa, trabajador independiente). La pertinencia médica y  validación de los conceptos en días, prórroga, coberturas, origen  se verá reflejada posterior a la radicación auditoria, liquidación por parte de la EPS,  según se cumpla con requisitos y condiciones de aseguramiento definidos por el Sistema General de Seguridad social</td></tr>
    </table>

    <table class="table table-bordered table-sm">
        <tr>
            <td class="font-weight-bold">Fecha de generación</td><td>{{ $i["Fecha y hora de generacion"] }}</td>
            <td class="font-weight-bold">Fecha de impresión</td><td>{{ $i["Fecha de impresion"] }}</td>
            <td>Copia original</td> 
        </tr>
    </table>
    <br>
    <table class="table" > 
        <tr><td class="font-weight-bold">{{ $i["Nombre del profesional que genera"]  ." - ".  $i["Tipo doc profesional que genera"]." ".$i["Numero doc profesional que genera"]." ".$i["Especialidad"] }}</td></tr> 
    </table>

    </div>
</div>


<!--COPIA-->
<br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br>
<div class="row">
    <div class="col-sm-12  mx-auto">
        <table class="table table-bordered">
            <tr>
            <td ><img  src="img/comfenalcovalle.png" width="50" height="17"></td>
            <td class="font-weight-bold">{{ $i["titulo"] }}</td>
            <td class="font-weight-bold">Licencia No.</td><td>{{ $i["No"] }}</td>
            <td style="padding:0">
                <table class="table table-bordered">
                    <tr>
                        <td class="font-weight-bold">Fecha consulta</td>
                        <td>{{ $i["Fecha de consulta médica"] }}</td>
                    </tr>
                    <tr>
                        <td class="font-weight-bold">Lugar de expedición</td>
                        <td>{{ $i["Lugar de expedición"] }}</td>
                    </tr>
                </table>
                
            </td>
            <td>

            </td>
            
            </tr>
        </table>
    </div>

</div>
<br><br><br>
<div class="row">
    <div class="col-sm-12  mx-auto">
    <table class="table table-bordered table-sm">
            <tr><td class="font-weight-bold">Paciente</td>
            
            <td>{{ $i["Nombre del paciente"] }}</td>
            <td class="font-weight-bold">Identificación</td><td>{{ $i["Tipo de identificacion del paciente"]." ".$i["Numero de documento del paciente"] }}</td>
            </tr>
            <tr>
                <td class="font-weight-bold">Tipo afiliado</td><td>{{ $i["Tipo afiliado"] }}</td>
                <td class="font-weight-bold">Historia clínica</td><td></td>
                <td class="font-weight-bold">Tipo de cotizante</td><td>{{ $i["Tipo de cotizante"] }}</td> 
            </tr>
    </table>
    <table class="table table-bordered table-sm ">
            <tr><td class="font-weight-bold">Prestador</td>
            <td>{{ $i["Nombre del prestador"] }}</td>
            <td class="font-weight-bold">Nit</td><td>{{ $i["Nit del prestador"]}}</td>
            <td class="font-weight-bold">Código Habilitación</td><td>{{ $i["codigo habilitacion"] }}</td> 
            </tr>
            <tr>
                <td class="font-weight-bold">Dirección</td><td>{{ $i["Dirección del prestador"] }}</td>
                
                <td class="font-weight-bold">EPS</td><td>{{ $i["NombreEPS"] }}</td>
                <td class="font-weight-bold">Aportante</td><td>{{ $i["Nombre aportante"] }}</td>
            </tr>       
    </table>
    <table class="table table-bordered table-sm">
            <tr><td class="font-weight-bold">Licencia</td>
           <!-- <td class="font-weight-bold">Tipo de certificado</td><td>{{ $i["Tipo de certificado"] }}</td>
            <td class="font-weight-bold">Tipo de licencia</td><td>{{ $i["Tipo de licencia"] }}</td>-->
                <td class="font-weight-bold">Fecha Inicio</td><td>{{ $i["Fecha de inicio de la licencia"] }}</td>
                <td class="font-weight-bold">Fecha Fin</td><td>{{ $i["Fecha fin de la licencia"] }}</td>
                <td class="font-weight-bold">Fecha Probable de Parto</td><td>{{ $i["Fecha Probable de Parto"] }}</td>
                <td class="font-weight-bold">Edad Gestacional (semanas)</td><td>{{ $i["Edad Gestacional"] }}</td>
            </tr>
            <tr>
                <td class="font-weight-bold">Embarazo Múltiple </td><td>{{ $i["Embarazo Multiple"] }}</td>
                <td class="font-weight-bold">Certificado(s)</td><td class="">{{ $i["Certificados"] }}</td>
            </tr>
            <tr>
                <td class="font-weight-bold">Días </td><td>{{ $i["Días solicitados"] }}</td>
                <td class="font-weight-bold">Días en letras</td><td class="">{{ $i["Días solicitados en letra"] }}</td>
            </tr>
    </table>
    <table class="table table-bordered table-sm">
        <tr><td class="font-weight-bold">Diagnostico principal</td><td>{{ $i["Diagnostico principal"] }}</td>     
        <td class="font-weight-bold">Contingencia origen</td><td>{{ $i["Contingencia origen"] }}</td>
        
        </tr>   
    </table>

    <table class="table table-bordered table-sm">
        <tr><td class="font-weight-bold">Profesional</td>
        
            <td>{{ $i["Nombre del profesional que genera"] }}</td>
            <td class="font-weight-bold">Identificación</td><td>{{ $i["Tipo doc profesional que genera"]." ".$i["Numero doc profesional que genera"] }}</td>
            <td class="font-weight-bold">Reg. Médico</td><td>{{ $i["Registro Médico"] }}</td> 
            <td class="font-weight-bold">Especialidad</td><td>{{ $i["Especialidad"] }}</td> 
        </tr>
    </table>

    <table class="table table-bordered table-sm">
    <tr><td style="font-size: 10px">Este certificado no implica el reconocimiento de la certificación ni de la prestación económica. El trámite ante la EPS debe ser realizado por el aportante (empresa, trabajador independiente). La pertinencia médica y  validación de los conceptos en días, prórroga, coberturas, origen  se verá reflejada posterior a la radicación auditoria, liquidación por parte de la EPS,  según se cumpla con requisitos y condiciones de aseguramiento definidos por el Sistema General de Seguridad social</td></tr>
    </table>

    <table class="table table-bordered table-sm">
        <tr>
            <td class="font-weight-bold">Fecha de generación</td><td>{{ $i["Fecha y hora de generacion"] }}</td>
            <td class="font-weight-bold">Fecha de impresión</td><td>{{ $i["Fecha de impresion"] }}</td>
            <td>Copia paciente</td> 
        </tr>
    </table>
    <br>
    <table class="table" > 
        <tr><td class="font-weight-bold">{{ $i["Nombre del profesional que genera"]  ." - ".  $i["Tipo doc profesional que genera"]." ".$i["Numero doc profesional que genera"]." ".$i["Especialidad"] }}</td></tr> 
    </table>

    </div>
</div>




</body>
</html>



<!--
<table border="1">
@foreach($i as $key => $value)
   
    <tr><td>{{ $key }}</td><td>{{ $value }}</td></tr>
@endforeach

</table>
-->