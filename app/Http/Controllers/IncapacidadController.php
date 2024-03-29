<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Descripcionesp;
use App\Clasesa;
use App\Estadosa;
use App\Validacion;
use Illuminate\Support\Facades\Http;
class IncapacidadController extends Controller
{
    //
    public function inicio(){
        return view('incapacidades.incapacidad');
    }
    
    public function validacion($tipo,$numero){
        $tipoDocumento = $tipo;
        $numeroIdentificacion = $numero;
        
        if ($numeroIdentificacion == "" || $tipoDocumento == "") {
            echo json_encode('error');
        }
        else{
                $hoy = date("Y-m-d H:i:s"); 

                $validacion = Validacion::where('id',1)->first();
                $host = $validacion->url;
                $username=$validacion->username;
                $password = $validacion->password;
                /*
                $host = "https://webservice.epsdelagente.com.co/api/Servicios/ValidacionDerechos";
                //$host="https://webservice.epscomfenalcovalle.boxalud.com/api/Servicios/ValidacionDerechos";
                //$host = "https://virtual.comfenalcovalle.com.co/esbtest/V2RESTJSONChannelAdapter";
                $username = "SUCURSALVIRTUALEPS";
                $password = "e95SucV7rtual";
        */
                $headers = array(
                    'Accept: */*',
                    'Content-Type:application/json',
                    'Authorization: Basic '. base64_encode("$username:$password")
                );
                $payload = '{
                    "requestMessageOut": {
                    "header": { "invokerDateTime":"2022-10-0610:03:00",
                    "moduleId": "PRUEBAS",
                    "systemId": "PRUEBAS",
                    "messageId": "PRUEBAS|CONSULTA|CE340590", "logginData": {
                    "sourceSystemId": "",
                    "destinationSystemId": "" },
                    "destination": { "namespace":
                    "http://co/com/comfenalcovalle/esb/ws/ValidadorServiciosEps",
                    "name": "ValidadorServiciosEps",
                    "operation": "execute" },
                    "securityCredential": { "userName": "", "userToken": ""
                    }, "classification": {
                    "classification": "" }
                    }, "body": {
                    "request": { "validadorRequest": {
                    "abreviatura": "'.$tipoDocumento.'",
                    "identificacion": "'.$numeroIdentificacion.'" }
                    } }
                    } }';
                //dd($payload);
                header("Content-Type:application/json");
                $process = curl_init($host);
                curl_setopt($process, CURLOPT_HTTPHEADER, $headers);
                curl_setopt($process, CURLOPT_HEADER, 0);
                curl_setopt($process, CURLOPT_USERPWD, $username . ":" . $password);
                curl_setopt($process, CURLOPT_TIMEOUT, 30);
                curl_setopt($process, CURLOPT_POST, 1);
                curl_setopt($process, CURLOPT_POSTFIELDS, $payload);
                curl_setopt($process, CURLOPT_ENCODING, "UTF-8" );
                curl_setopt($process, CURLOPT_RETURNTRANSFER, TRUE);
                $return = curl_exec($process);
                
                curl_close($process);
            
                //finally print your API response
                echo utf8_encode($return);
        }
        //$tipoDocumento = $tipo;
        //$numeroIdentificacion = $numero;
        
       /*return view('incapacidades.validacion',[
            'tipoDocumento' => $tipoDocumento, 
            'numeroIdentificacion' => $numeroIdentificacion
            ]);*/
        //respuesta NO
       //return '{"responseMessageOut":{"header":{"invokerDateTime":"2020-05-26 15:50:56","moduleId":"CHATBOTEPS","systemId":"CHATBOTEPS","messageId":"CHATBOTEPS |80197028|CC","logginData":{"sourceSystemId":"NA","destinationSystemId":"NA"},"destination":{"namespace":"http:\/\/co\/com\/comfenalcovalle\/esb\/ws\/ValidadorServiciosEps","name":"ValidadorServiciosEps","operation":"execute"},"responseStatus":{"statusCode":"SUCCESS"}},"body":{"response":{"validadorResponse":{"xsi":"http:\/\/www.w3.org\/2001\/XMLSchema-instance","Derechos":{"DerechoPrestacion":"NO","Programa":"EP","DescripcionPrograma":"Por plan de beneficios de salud","MENSAJE":"El usuario con tipo CC y numero 80197028 NO tiene derecho a prestación de servicios, Por plan de beneficios de salud"},"DsAfiliado":{},"DsSede":{"Sede":{"Observaciones":"No se encontraron registros"},"SedeAtencion":{"Observaciones":"No se encontraron registros"}},"DsGrupoFamiliar":{"Beneficiario":{"TipoDocTrabajador":"CC","TipoDocBeneficiario":"CC","TIdBeneficiario":"1","IDBeneficiario":"80197028","EstadoCaja":"NA","EstadoPOS":"RE","EstadoPCO":"NA","Nombre":"JUAN FERNANDO","PrimerApellido":"GUERRA","SegundoApellido":"CAMARGO","Sexo":"M","TidTrabajador":"1","IDTrabajador":"80197028"}}}}}}}';

        //respuesta correcta
        // return '{"responseMessageOut":{"header":{"invokerDateTime":"2020-09-21 16:27:48","moduleId":"CHATBOTEPS","systemId":"CHATBOTEPS","messageId":"CHATBOTEPS |65756548|CC","logginData":{"sourceSystemId":"NA","destinationSystemId":"NA"},"destination":{"namespace":"http:\/\/co\/com\/comfenalcovalle\/esb\/ws\/ValidadorServiciosEps","name":"ValidadorServiciosEps","operation":"execute"},"responseStatus":{"statusCode":"SUCCESS"}},"body":{"response":{"validadorResponse":{"xsi":"http:\/\/www.w3.org\/2001\/XMLSchema-instance","Derechos":{"DerechoPrestacion":"SI","Programa":"EP","DescripcionPrograma":"Por plan de beneficios de salud","MENSAJE":"El usuario con tipo CC y numero 65756548 SI tiene derecho a prestación de servicios, Por plan de beneficios de salud"},"DsAfiliado":{"Afiliado":{"EstadoDescripcion":"Afiliado","TipoDocAfiliado":"CC","TipoDocEmpresa":{},"TipoDocTrabajador":"CC","NombreDepartamento":"VALLE","NombreMunicipio":"CANDELARIA","TidTrabajador":"1","IDTrabajador":"6257247","Nombre":"SARA ROCIO","PrimerApellido":"SIERRA","SegundoApellido":"DIAZ","FechaNacimiento":"1972-07-11T00:00:00","Estrato":"1","Sexo":"F","IDEmpresa":{},"TidEmpresa":{},"SedeCapita":"MODELO DE ATENCION DE SALUD SERINSA CALI NORORIENT","IdAfiliado":"65756548","TIdAfiliado":"1","FechaAfiliacion":"2019-08-14T00:00:00","Estado":"0","IdEntidad":"12","Direccion":"MZ 12 C CASA 69","Telefono":"0","NombreEmpresa":{},"Telefono2":{},"IdCapita":"815005012","IdMunicipio":"76130","EstadoCivil":"UL","IdUnico":"1077023641819731","email":{},"FechaAfiliacionSSS":{},"Programa":"EP","IdPrograma":"121312","DescripcionPrograma":"Compañero\/Compañera Permanente","IdRegional":"13","DiasCotizados":{},"IdArp":{},"IdDiscapacidad":{},"DirEmpresa":{},"IdHistoria09":{},"IdHistoria12":"101014840","FechaDesafiliacion":"0","IdConyuge":"6001023641704081","CabezaFamilia":"N","NombreTrabajador":"VICTOR HUGO SALGUERO VERA","Principal":"N","IdBarrio":"0","FechaRetiro":"0","PorcentajeDescuento":{},"TipoDescuento":{},"IdIpsCapita":"13010","SemCotSSS":"0","ClaseAfiliacion":"BEN","CodigoRegional":"13"}},"DsSede":{"Sede":[{"NitEntidad":"800168722","Descripcion":"LA OPTICA NORORIENTE"},{"NitEntidad":"805026250","Descripcion":"CL.SIGMA S.NORORIENTE"},{"NitEntidad":"815005012","Descripcion":"NORORIENTE SERINSA"},{"NitEntidad":"890307534","Descripcion":"OPTOMETRIA NORORIENT"},{"NitEntidad":"900127525","Descripcion":"CIC-VITAL NORORIENTE"}],"SedeAtencion":{"IdSedeAtencion":"815005012","SedeAtencion":"MODELO DE ATENCION DE SALUD SERINSA CALI NORORIENT","CodSedeAtencion":"13010"}},"DsGrupoFamiliar":{"Beneficiario":{"TipoDocTrabajador":{},"TipoDocBeneficiario":{},"TIdBeneficiario":{},"IDBeneficiario":{},"EstadoCaja":{},"EstadoPOS":{},"EstadoPCO":{},"Nombre":{},"PrimerApellido":{},"SegundoApellido":{},"Sexo":{},"Parentesco":{},"TidTrabajador":{},"IDTrabajador":{},"Observaciones":"No existe Trabajador"}}}}}}}';
          
       
       //return '{"responseMessageOut":{"header":{"invokerDateTime":"2020-09-09 09:08:16","moduleId":"CHATBOTEPS","systemId":"CHATBOTEPS","messageId":"CHATBOTEPS |14635420|CC","logginData":{"sourceSystemId":"NA","destinationSystemId":"NA"},"destination":{"namespace":"http:\/\/co\/com\/comfenalcovalle\/esb\/ws\/ValidadorServiciosEps","name":"ValidadorServiciosEps","operation":"execute"},"responseStatus":{"statusCode":"SUCCESS"}},"body":{"response":{"validadorResponse":{"xsi":"http:\/\/www.w3.org\/2001\/XMLSchema-instance","Derechos":{"DerechoPrestacion":"SI","Programa":"EP","DescripcionPrograma":"Por plan de beneficios de salud","MENSAJE":"El usuario con tipo CC y numero 14635420 SI tiene derecho a prestación de servicios, Por plan de beneficios de salud"},"DsAfiliado":{"Afiliado":{"EstadoDescripcion":"Afiliado","TipoDocAfiliado":"CC","TipoDocEmpresa":"NI","TipoDocTrabajador":"CC","NombreDepartamento":"VALLE","NombreMunicipio":"CALI","TidTrabajador":"1","IDTrabajador":"14635420","Nombre":"FLORENTINO ","PrimerApellido":"PEÑALOZA","SegundoApellido":"ASPRILLA","FechaNacimiento":"1983-06-10T00:00:00","Estrato":"1","Sexo":"M","IDEmpresa":"890323239","TidEmpresa":"2","SedeCapita":"MODELO DE ATENCION DE SALUD SERVIMEDIC QUIRON LTDA","IdAfiliado":"14635420","TIdAfiliado":"1","FechaAfiliacion":"2020-02-14T00:00:00","Estado":"0","IdEntidad":"12","Direccion":"KR 31 38 19","Telefono":"4371418","NombreEmpresa":"SUMMAR TEMPORALES S.A.S","Telefono2":{},"IdCapita":"900014785","IdMunicipio":"76001","EstadoCivil":"UL","IdUnico":"9999022619426335","email":"juniorf84@hotmail.com","FechaAfiliacionSSS":{},"Programa":"EP","IdPrograma":"121201","DescripcionPrograma":"Dependiente","IdRegional":"14","DiasCotizados":{},"IdArp":"10","IdDiscapacidad":"P","DirEmpresa":"CALLE 11 N 28 346 BOD 16 MARIANO RAMOS","IdHistoria09":{},"IdHistoria12":"1658614","FechaDesafiliacion":"0","IdConyuge":"6059118335919291","CabezaFamilia":"S","NombreTrabajador":"FLORENTINO PEÑALOZA ASPRILLA","Principal":"S","IdBarrio":"0","FechaRetiro":"0","PorcentajeDescuento":{},"TipoDescuento":{},"IdIpsCapita":"14029","SemCotSSS":"0","ClaseAfiliacion":"COT","CodigoRegional":"14"}},"DsSede":{"Sede":[{"NitEntidad":"800168722","Descripcion":"LA OPTICA S.SUR"},{"NitEntidad":"805023423","Descripcion":"SEDE SUR - SERVIQUIRON"},{"NitEntidad":"890307534","Descripcion":"OPTOMETRIA S.SUR"},{"NitEntidad":"900014785","Descripcion":"SERVIMEDIC QUIRON"},{"NitEntidad":"900127525","Descripcion":"CIC-VITAL S.SUR"}],"SedeAtencion":{"IdSedeAtencion":"900014785","SedeAtencion":"MODELO DE ATENCION DE SALUD SERVIMEDIC QUIRON LTDA","CodSedeAtencion":"14029"}},"DsGrupoFamiliar":{"Beneficiario":[{"TipoDocTrabajador":"CC","TipoDocBeneficiario":"CC","TIdBeneficiario":"1","IDBeneficiario":"14635420","EstadoCaja":"NA","EstadoPOS":"AF","EstadoPCO":"NA","Nombre":"FLORENTINO ","PrimerApellido":"PENALOZA","SegundoApellido":"ASPRILLA","Sexo":"M","TidTrabajador":"1","IDTrabajador":"14635420"},{"TipoDocTrabajador":"CC","TipoDocBeneficiario":"CC","TIdBeneficiario":"1","IDBeneficiario":"1143940539","EstadoCaja":"NA","EstadoPOS":"AF","EstadoPCO":"NA","Nombre":"KAREN TATIANA","PrimerApellido":"SUAREZ","SegundoApellido":"ARBOLEDA","Sexo":"F","TidTrabajador":"1","IDTrabajador":"14635420"}]}}}}}}';
       // return '{"responseMessageOut":{"header":{"invokerDateTime":"2020-05-30 17:58:48","moduleId":"CHATBOTEPS","systemId":"CHATBOTEPS","messageId":"CHATBOTEPS |16449455|CC","logginData":{"sourceSystemId":"NA","destinationSystemId":"NA"},"destination":{"namespace":"http:\/\/co\/com\/comfenalcovalle\/esb\/ws\/ValidadorServiciosEps","name":"ValidadorServiciosEps","operation":"execute"},"responseStatus":{"statusCode":"SUCCESS"}},"body":{"response":{"validadorResponse":{"xsi":"http:\/\/www.w3.org\/2001\/XMLSchema-instance","Derechos":{"DerechoPrestacion":"SI","Programa":"EP","DescripcionPrograma":"Por plan de beneficios de salud","MENSAJE":"El usuario con tipo CC y numero 16449455 SI tiene derecho a prestación de servicios, Por plan de beneficios de salud"},"DsAfiliado":{"Afiliado":{"EstadoDescripcion":"Afiliado","TipoDocAfiliado":"CC","TipoDocEmpresa":"NI","TipoDocTrabajador":"CC","NombreDepartamento":"VALLE","NombreMunicipio":"YUMBO","TidTrabajador":"1","IDTrabajador":"16449455","Nombre":"MANUEL ANTONIO","PrimerApellido":"SALCEDO","SegundoApellido":"POVEDA","FechaNacimiento":"1961-02-04T00:00:00","Estrato":"1","Sexo":"M","IDEmpresa":"830511993","TidEmpresa":"2","SedeCapita":"SERSALUD S.A - SEDE YUMBO","IdAfiliado":"16449455","TIdAfiliado":"1","FechaAfiliacion":"2019-07-08T00:00:00","Estado":"0","IdEntidad":"12","Direccion":"CL 1 B ESTE 3CU 03","Telefono":"6933873","NombreEmpresa":"NUCLEO S.A","Telefono2":{},"IdCapita":"805025846","IdMunicipio":"76892","EstadoCivil":"SO","IdUnico":"6052103532445721","email":{},"FechaAfiliacionSSS":{},"Programa":"EP","IdPrograma":"121201","DescripcionPrograma":"Dependiente","IdRegional":"16","DiasCotizados":{},"IdArp":"15","IdDiscapacidad":{},"DirEmpresa":"CR 12 8 46","IdHistoria09":{},"IdHistoria12":"101658249","FechaDesafiliacion":"0","IdConyuge":"6089933260318791","CabezaFamilia":"S","NombreTrabajador":"MANUEL ANTONIO SALCEDO POVEDA","Principal":"S","IdBarrio":"0","FechaRetiro":"0","PorcentajeDescuento":{},"TipoDescuento":{},"IdIpsCapita":"16007","SemCotSSS":"0","ClaseAfiliacion":"COT","CodigoRegional":"16"}},"DsSede":{"Sede":[{"NitEntidad":"805026250","Descripcion":"CL.SIGMA S.YUMBO"},{"NitEntidad":"890307534","Descripcion":"OPTOMETRIA YUMBO"}],"SedeAtencion":{"IdSedeAtencion":"805025846","SedeAtencion":"SERSALUD S.A - SEDE YUMBO","CodSedeAtencion":"16007"}},"DsGrupoFamiliar":{"Beneficiario":[{"TipoDocTrabajador":"CC","TipoDocBeneficiario":"CC","TIdBeneficiario":"1","IDBeneficiario":"16449455","EstadoCaja":"NA","EstadoPOS":"AF","EstadoPCO":"NA","Nombre":"MANUEL ANTONIO","PrimerApellido":"SALCEDO","SegundoApellido":"POVEDA","Sexo":"M","TidTrabajador":"1","IDTrabajador":"16449455"},{"TipoDocTrabajador":"CC","TipoDocBeneficiario":"CC","TIdBeneficiario":"1","IDBeneficiario":"29820286","EstadoCaja":"NA","EstadoPOS":"AF","EstadoPCO":"NA","Nombre":"OLGA DORA","PrimerApellido":"PATINO","SegundoApellido":"QUINTERO","Sexo":"F","TidTrabajador":"1","IDTrabajador":"16449455"},{"TipoDocTrabajador":"CC","TipoDocBeneficiario":"TI","TIdBeneficiario":"3","IDBeneficiario":"1104825934","EstadoCaja":"NA","EstadoPOS":"AF","EstadoPCO":"NA","Nombre":"JHON STEVEN","PrimerApellido":"GIRALDO","SegundoApellido":"PATINO","Sexo":"M","TidTrabajador":"1","IDTrabajador":"16449455"},{"TipoDocTrabajador":"CC","TipoDocBeneficiario":"CC","TIdBeneficiario":"1","IDBeneficiario":"1118308000","EstadoCaja":"NA","EstadoPOS":"AF","EstadoPCO":"NA","Nombre":"JUAN CARLOS","PrimerApellido":"AGUIRRE","SegundoApellido":"PATINO","Sexo":"M","TidTrabajador":"1","IDTrabajador":"16449455"}]}}}}}}';
        //return '{"responseMessageOut":{"header":{"invokerDateTime":"2020-07-28 15:56:11","moduleId":"CHATBOTEPS","systemId":"CHATBOTEPS","messageId":"CHATBOTEPS |29361924|CC","logginData":{"sourceSystemId":"NA","destinationSystemId":"NA"},"destination":{"namespace":"http:\/\/co\/com\/comfenalcovalle\/esb\/ws\/ValidadorServiciosEps","name":"ValidadorServiciosEps","operation":"execute"},"responseStatus":{"statusCode":"SUCCESS"}},"body":{"response":{"validadorResponse":{"xsi":"http:\/\/www.w3.org\/2001\/XMLSchema-instance","Derechos":{"DerechoPrestacion":"SI","Programa":"EP","DescripcionPrograma":"Por plan de beneficios de salud","MENSAJE":"El usuario con tipo CC y numero 29361924 SI tiene derecho a prestación de servicios, Por plan de beneficios de salud"},"DsAfiliado":{"Afiliado":{"EstadoDescripcion":"Afiliado","TipoDocAfiliado":"CC","TipoDocEmpresa":{},"TipoDocTrabajador":"CC","NombreDepartamento":"VALLE","NombreMunicipio":"CALI","TidTrabajador":"1","IDTrabajador":"29361924","Nombre":"CATHERINE MIGRETH","PrimerApellido":"SANCHEZ","SegundoApellido":"CASANOVA","FechaNacimiento":"1982-02-26T00:00:00","Estrato":"1","Sexo":"F","IDEmpresa":{},"TidEmpresa":{},"SedeCapita":"MODELO DE ATENCION DE SALUD SERVIMEDIC QUIRON LTDA","IdAfiliado":"29361924","TIdAfiliado":"1","FechaAfiliacion":"2020-07-17T00:00:00","Estado":"0","IdEntidad":"12","Direccion":"CR 98 A 42 85","Telefono":"3276471","NombreEmpresa":{},"Telefono2":{},"IdCapita":"900014785","IdMunicipio":"76001","EstadoCivil":"SO","IdUnico":"9999022619351478","email":"CATHESTEVEN@HOTMAIL.COM","FechaAfiliacionSSS":{},"Programa":"EP","IdPrograma":"121259","DescripcionPrograma":"Independiente Contrato de Prestación","IdRegional":"1","DiasCotizados":{},"IdArp":{},"IdDiscapacidad":{},"DirEmpresa":{},"IdHistoria09":{},"IdHistoria12":"158551","FechaDesafiliacion":"0","IdConyuge":{},"CabezaFamilia":{},"NombreTrabajador":"CATHERINE MIGRETH SANCHEZ CASANOVA","Principal":"S","IdBarrio":"0","FechaRetiro":"0","PorcentajeDescuento":{},"TipoDescuento":{},"IdIpsCapita":"14029","SemCotSSS":"0","ClaseAfiliacion":"COT","CodigoRegional":"1"}},"DsSede":{"Sede":[{"NitEntidad":"800168722","Descripcion":"LA OPTICA S.SUR"},{"NitEntidad":"805023423","Descripcion":"SEDE SUR - SERVIQUIRON"},{"NitEntidad":"890307534","Descripcion":"OPTOMETRIA S.SUR"},{"NitEntidad":"900014785","Descripcion":"SERVIMEDIC QUIRON"},{"NitEntidad":"900127525","Descripcion":"CIC-VITAL S.SUR"}],"SedeAtencion":{"IdSedeAtencion":"900014785","SedeAtencion":"MODELO DE ATENCION DE SALUD SERVIMEDIC QUIRON LTDA","CodSedeAtencion":"14029"}},"DsGrupoFamiliar":{"Beneficiario":[{"TipoDocTrabajador":"CC","TipoDocBeneficiario":"CC","TIdBeneficiario":"1","IDBeneficiario":"29361924","EstadoCaja":"NA","EstadoPOS":"AF","EstadoPCO":"NA","Nombre":"CATHERINE MIGRETH","PrimerApellido":"SANCHEZ","SegundoApellido":"CASANOVA","Sexo":"F","TidTrabajador":"1","IDTrabajador":"29361924"},{"TipoDocTrabajador":"CC","TipoDocBeneficiario":"RC","TIdBeneficiario":"7","IDBeneficiario":"1108259584","EstadoCaja":"NA","EstadoPOS":"AF","EstadoPCO":"NA","Nombre":"MATHIAS ","PrimerApellido":"RAMIREZ","SegundoApellido":"SANCHEZ","Sexo":"M","TidTrabajador":"1","IDTrabajador":"29361924"}]}}}}}}';
    //  return '{"responseMessageOut":{"header":{"invokerDateTime":"2020-08-27 16:07:03","moduleId":"CHATBOTEPS","systemId":"CHATBOTEPS","messageId":"CHATBOTEPS |328651|CE","logginData":{"sourceSystemId":"NA","destinationSystemId":"NA"},"destination":{"namespace":"http:\/\/co\/com\/comfenalcovalle\/esb\/ws\/ValidadorServiciosEps","name":"ValidadorServiciosEps","operation":"execute"},"responseStatus":{"statusCode":"SUCCESS"}},"body":{"response":{"validadorResponse":{"xsi":"http:\/\/www.w3.org\/2001\/XMLSchema-instance","Derechos":{"DerechoPrestacion":"SI","Programa":"EP","DescripcionPrograma":"Por plan de beneficios de salud","MENSAJE":"El usuario con tipo CE y numero 328651 SI tiene derecho a prestación de servicios, Por plan de beneficios de salud"},"DsAfiliado":{"Afiliado":{"EstadoDescripcion":"Afiliado","TipoDocAfiliado":"CE","TipoDocEmpresa":"NI","TipoDocTrabajador":"CE","NombreDepartamento":"VALLE","NombreMunicipio":"BUENAVENTURA","TidTrabajador":"4","IDTrabajador":"328651","Nombre":"JOSE ANGEL","PrimerApellido":"ZAVALA","SegundoApellido":"BLANCO","FechaNacimiento":"1958-04-14T00:00:00","Estrato":"1","Sexo":"M","IDEmpresa":"900336004","TidEmpresa":"2","SedeCapita":"MODELO DE ATENCION DE SALUD SERSALUD S.A.","IdAfiliado":"328651","TIdAfiliado":"4","FechaAfiliacion":"2020-06-11T00:00:00","Estado":"0","IdEntidad":"12","Direccion":"CR 1E 68 48","Telefono":"4471901","NombreEmpresa":"ADMINISTRADORA COLOMBIANA DE PENSIONES COLPENSIONES","Telefono2":{},"IdCapita":"805025846","IdMunicipio":"76109","EstadoCivil":"CA","IdUnico":"9999022619751914","email":"zavalajose1@hotmail.com","FechaAfiliacionSSS":{},"Programa":"EP","IdPrograma":"121205","DescripcionPrograma":"Pensionado","IdRegional":"17","DiasCotizados":{},"IdArp":{},"IdDiscapacidad":{},"DirEmpresa":"CRA 10 N 72 33 TO B","IdHistoria09":{},"IdHistoria12":"1819887","FechaDesafiliacion":"0","IdConyuge":"9999022621254490","CabezaFamilia":"S","NombreTrabajador":"JOSE ANGEL ZAVALA BLANCO","Principal":"S","IdBarrio":"0","FechaRetiro":"0","PorcentajeDescuento":{},"TipoDescuento":{},"IdIpsCapita":"12007","SemCotSSS":"0","ClaseAfiliacion":"COT","CodigoRegional":"17"}},"DsSede":{"Sede":[{"NitEntidad":"800168722","Descripcion":"LA OPTICA S.NORTE"},{"NitEntidad":"805025846","Descripcion":"SERSALUD S.A."},{"NitEntidad":"805026250","Descripcion":"CL.SIGMA S.NORTE"},{"NitEntidad":"890307534","Descripcion":"OPTOMETRIA S.NORTE"},{"NitEntidad":"900127525","Descripcion":"CIC-VITAL S.NORTE"}],"SedeAtencion":{"IdSedeAtencion":"805025846","SedeAtencion":"MODELO DE ATENCION DE SALUD SERSALUD S.A.","CodSedeAtencion":"12007"}},"DsGrupoFamiliar":{"Beneficiario":[{"TipoDocTrabajador":"CE","TipoDocBeneficiario":"CE","TIdBeneficiario":"4","IDBeneficiario":"328651","EstadoCaja":"NA","EstadoPOS":"AF","EstadoPCO":"NA","Nombre":"JOSE ANGEL","PrimerApellido":"ZAVALA","SegundoApellido":"BLANCO","Sexo":"M","TidTrabajador":"4","IDTrabajador":"328651"},{"TipoDocTrabajador":"CE","TipoDocBeneficiario":"CC","TIdBeneficiario":"1","IDBeneficiario":"29993202","EstadoCaja":"NA","EstadoPOS":"AF","EstadoPCO":"NA","Nombre":"ELSA ","PrimerApellido":"GARCIA","SegundoApellido":"GARCIA","Sexo":"F","TidTrabajador":"4","IDTrabajador":"328651"},{"TipoDocTrabajador":"CE","TipoDocBeneficiario":"TI","TIdBeneficiario":"3","IDBeneficiario":"1127940021","EstadoCaja":"NA","EstadoPOS":"AF","EstadoPCO":"NA","Nombre":"JOELNATAN JOSE","PrimerApellido":"ZAVALA","SegundoApellido":"GARCIA","Sexo":"M","TidTrabajador":"4","IDTrabajador":"328651"}]}}}}}}';
         //respuesta varios
        //return '{"responseMessageOut":{"header":{"invokerDateTime":"2020-09-23 16:37:36","moduleId":"CHATBOTEPS","systemId":"CHATBOTEPS","messageId":"CHATBOTEPS |1501098|CC","logginData":{"sourceSystemId":"NA","destinationSystemId":"NA"},"destination":{"namespace":"http:\/\/co\/com\/comfenalcovalle\/esb\/ws\/ValidadorServiciosEps","name":"ValidadorServiciosEps","operation":"execute"},"responseStatus":{"statusCode":"SUCCESS"}},"body":{"response":{"validadorResponse":{"xsi":"http:\/\/www.w3.org\/2001\/XMLSchema-instance","Derechos":{"DerechoPrestacion":"SI","Programa":"EP","DescripcionPrograma":"Por plan de beneficios de salud","MENSAJE":"El usuario con tipo CC y numero 1501098 SI tiene derecho a prestación de servicios, Por plan de beneficios de salud"},"DsAfiliado":{"Afiliado":{"EstadoDescripcion":"Afiliado","TipoDocAfiliado":"CC","TipoDocEmpresa":"NI","TipoDocTrabajador":"CC","NombreDepartamento":"VALLE","NombreMunicipio":"CALI","TidTrabajador":"1","IDTrabajador":"1501098","Nombre":"EDGAR ","PrimerApellido":"VIVEROS","SegundoApellido":"DOMINGUEZ","FechaNacimiento":"1963-10-13T00:00:00","Estrato":"1","Sexo":"M","IDEmpresa":"800115720","TidEmpresa":"2","SedeCapita":"IPS RIO CAUCA","IdAfiliado":"1501098","TIdAfiliado":"1","FechaAfiliacion":"2011-01-18T00:00:00","Estado":"0","IdEntidad":"12","Direccion":"CALLE 72 L3 28E 165","Telefono":"4278416","NombreEmpresa":"RG DISTRIBUCIONES LIMITADA","Telefono2":{},"IdCapita":"900922290","IdMunicipio":"76001","EstadoCivil":"UL","IdUnico":"9999022619406473","email":{},"FechaAfiliacionSSS":{},"Programa":"EP","IdPrograma":"121201","DescripcionPrograma":"Dependiente","IdRegional":"1","DiasCotizados":{},"IdArp":{},"IdDiscapacidad":{},"DirEmpresa":"CL 8 9 46","IdHistoria09":{},"IdHistoria12":"1650327","FechaDesafiliacion":"0","IdConyuge":{},"CabezaFamilia":{},"NombreTrabajador":"EDGAR VIVEROS DOMINGUEZ","Principal":"S","IdBarrio":"10001","FechaRetiro":"0","PorcentajeDescuento":{},"TipoDescuento":{},"IdIpsCapita":"19008","SemCotSSS":"132","ClaseAfiliacion":"COT","CodigoRegional":"1"}},"DsSede":{"Sede":{"NitEntidad":"805027261","Descripcion":"ESE CENTRO CALI INPE"},"SedeAtencion":{"IdSedeAtencion":"900922290","SedeAtencion":"IPS RIO CAUCA","CodSedeAtencion":"19008"}},"DsGrupoFamiliar":{"Beneficiario":[{"TipoDocTrabajador":"CC","TipoDocBeneficiario":"CC","TIdBeneficiario":"1","IDBeneficiario":"1501098","EstadoCaja":"NA","EstadoPOS":"AF","EstadoPCO":"NA","Nombre":"EDGAR ","PrimerApellido":"VIVEROS","SegundoApellido":"DOMINGUEZ","Sexo":"M","TidTrabajador":"1","IDTrabajador":"1501098"},{"TipoDocTrabajador":"CC","TipoDocBeneficiario":"CC","TIdBeneficiario":"1","IDBeneficiario":"25620542","EstadoCaja":"NA","EstadoPOS":"RE","EstadoPCO":"NA","Nombre":"ANA RUTH","PrimerApellido":"OREJUELA","SegundoApellido":"VALENCIA","Sexo":"F","TidTrabajador":"1","IDTrabajador":"1501098"}]}}}}}}';
       // return '{"responseMessageOut":{"header":{"invokerDateTime":"2020-07-28 17:13:35","moduleId":"CHATBOTEPS","systemId":"CHATBOTEPS","messageId":"CHATBOTEPS |16626278|CC","logginData":{"sourceSystemId":"NA","destinationSystemId":"NA"},"destination":{"namespace":"http:\/\/co\/com\/comfenalcovalle\/esb\/ws\/ValidadorServiciosEps","name":"ValidadorServiciosEps","operation":"execute"},"responseStatus":{"statusCode":"SUCCESS"}},"body":{"response":{"validadorResponse":{"xsi":"http:\/\/www.w3.org\/2001\/XMLSchema-instance","Derechos":{"DerechoPrestacion":"SI","Programa":"EP","DescripcionPrograma":"Por plan de beneficios de salud","MENSAJE":"El usuario con tipo CC y numero 16626278 SI tiene derecho a prestación de servicios, Por plan de beneficios de salud"},"DsAfiliado":{"Afiliado":{"EstadoDescripcion":"Afiliado","TipoDocAfiliado":"CC","TipoDocEmpresa":"NI","TipoDocTrabajador":"CC","NombreDepartamento":"VALLE","NombreMunicipio":"CALI","TidTrabajador":"1","IDTrabajador":"16626278","Nombre":"JUAN CARLOS","PrimerApellido":"LUNA","SegundoApellido":"CUELLAR","FechaNacimiento":"1959-03-20T00:00:00","Estrato":"2","Sexo":"M","IDEmpresa":"900336004","TidEmpresa":"2","SedeCapita":"MODELO DE ATENCION DE SALUD CIS EMCALI","IdAfiliado":"16626278","TIdAfiliado":"1","FechaAfiliacion":"2019-09-01T00:00:00","Estado":"0","IdEntidad":"12","Direccion":"CL 20 118 235 T2 APT 508","Telefono":"3396742","NombreEmpresa":"ADMINISTRADORA COLOMBIANA DE PENSIONES COLPENSIONES","Telefono2":{},"IdCapita":"890303093","IdMunicipio":"76001","EstadoCivil":"CA","IdUnico":"9999022619003651","email":"JCLUNA57@HOTMAIL.COM","FechaAfiliacionSSS":{},"Programa":"EP","IdPrograma":"121205","DescripcionPrograma":"Pensionado","IdRegional":"1","DiasCotizados":{},"IdArp":{},"IdDiscapacidad":{},"DirEmpresa":"CRA 10 N 72 33 TO B","IdHistoria09":{},"IdHistoria12":"179870","FechaDesafiliacion":"0","IdConyuge":"9999022620123312","CabezaFamilia":"S","NombreTrabajador":"JUAN CARLOS LUNA CUELLAR","Principal":"S","IdBarrio":"0","FechaRetiro":"0","PorcentajeDescuento":{},"TipoDescuento":{},"IdIpsCapita":"2024","SemCotSSS":"1152","ClaseAfiliacion":"COT","CodigoRegional":"1"}},"DsSede":{"Sede":[{"NitEntidad":"800168722","Descripcion":"LA OPTICA EMCALI"},{"NitEntidad":"890307534","Descripcion":"OPTOMETRIA EMCALI"},{"NitEntidad":"900127525","Descripcion":"CIC-VITAL EMCAL"},{"NitEntidad":"900612531","Descripcion":"SEDE EMCALI"}],"SedeAtencion":{"IdSedeAtencion":"890303093","SedeAtencion":"MODELO DE ATENCION DE SALUD CIS EMCALI","CodSedeAtencion":"2024"}},"DsGrupoFamiliar":{"Beneficiario":[{"TipoDocTrabajador":"CC","TipoDocBeneficiario":"CC","TIdBeneficiario":"1","IDBeneficiario":"16626278","EstadoCaja":"NA","EstadoPOS":"AF","EstadoPCO":"NA","Nombre":"JUAN CARLOS","PrimerApellido":"LUNA","SegundoApellido":"CUELLAR","Sexo":"M","TidTrabajador":"1","IDTrabajador":"16626278"},{"TipoDocTrabajador":"CC","TipoDocBeneficiario":"CC","TIdBeneficiario":"1","IDBeneficiario":"30038121","EstadoCaja":"NA","EstadoPOS":"AF","EstadoPCO":"NA","Nombre":"MARIA ELENA","PrimerApellido":"MARTINEZ","SegundoApellido":{},"Sexo":"F","TidTrabajador":"1","IDTrabajador":"16626278"},{"TipoDocTrabajador":"CC","TipoDocBeneficiario":"CC","TIdBeneficiario":"1","IDBeneficiario":"31915457","EstadoCaja":"NA","EstadoPOS":"AF","EstadoPCO":"NA","Nombre":"PATRICIA ","PrimerApellido":"MARTINEZ","SegundoApellido":{},"Sexo":"F","TidTrabajador":"1","IDTrabajador":"16626278"},{"TipoDocTrabajador":"CC","TipoDocBeneficiario":"TI","TIdBeneficiario":"3","IDBeneficiario":"1006100013","EstadoCaja":"NA","EstadoPOS":"AF","EstadoPCO":"NA","Nombre":"MARIA JULIANA","PrimerApellido":"LUNA","SegundoApellido":"MARTINEZ","Sexo":"F","TidTrabajador":"1","IDTrabajador":"16626278"},{"TipoDocTrabajador":"CC","TipoDocBeneficiario":"CC","TIdBeneficiario":"1","IDBeneficiario":"1144057372","EstadoCaja":"NA","EstadoPOS":{},"EstadoPCO":"NA","Nombre":"ANA MARIA","PrimerApellido":"LUNA","SegundoApellido":"MARTINEZ","Sexo":"F","TidTrabajador":"1","IDTrabajador":"16626278"}]}}}}}}';
        /*
        if ($numeroIdentificacion == "" || $tipoDocumento == "") {
            echo json_encode('error');
        }
        else{
                $hoy = date("Y-m-d H:i:s"); 

                $validacion = Validacion::where('id',1)->first();
                $host = $validacion->url;
                $username=$validacion->username;
                $password = $validacion->password;
                /*
                $host="https://virtual.comfenalcovalle.com.co/esb/V2RESTJSONChannelAdapter";
                //$host = "https://virtual.comfenalcovalle.com.co/esbtest/V2RESTJSONChannelAdapter";
                $username = "INGENIOSE";
                $password = "1nG3n1o5e";
                */
                /*
                $headers = array(
                    'Content-type: charset=iso-8859-1; charset=utf-8',
                    'Authorization: Basic '. base64_encode("$username:$password")
                );
                $payload = '{
                    "requestMessageOut": {
                    "header": {
                        "invokerDateTime": "'.$hoy.'",
                        "moduleId": "CHATBOTEPS",
                        "systemId": "CHATBOTEPS",
                        "messageId": "CHATBOTEPS |'.$numeroIdentificacion.'|'.$tipoDocumento.'",
                        "logginData": {
                        "sourceSystemId": "NA",
                        "destinationSystemId": "NA"
                        },
                        "destination": {
                        "namespace": "http://co/com/comfenalcovalle/esb/ws/ValidadorServiciosEps",
                        "name": "ValidadorServiciosEps",
                        "operation": "execute"
                        },
                        "securityCredential": {
                        "userName": "",
                        "userToken": ""
                        },
                        "classification": ""
                    },
                    "body": {
                        "request": {
                        "validadorRequest": {
                            "abreviatura":"'.$tipoDocumento.'",
                            "identificacion": "'.$numeroIdentificacion.'"
                        }
                        }
                    }
                    }
                }';
                //dd($payload);
                header("Content-type: charset=iso-8859-1");
                $process = curl_init($host);
                curl_setopt($process, CURLOPT_HTTPHEADER, $headers);
                curl_setopt($process, CURLOPT_HEADER, 0);
                curl_setopt($process, CURLOPT_USERPWD, $username . ":" . $password);
                curl_setopt($process, CURLOPT_TIMEOUT, 30);
                curl_setopt($process, CURLOPT_POST, 1);
                curl_setopt($process, CURLOPT_POSTFIELDS, $payload);
                curl_setopt($process, CURLOPT_ENCODING, "UTF-8" );
                curl_setopt($process, CURLOPT_RETURNTRANSFER, TRUE);
                $return = curl_exec($process);
                
                curl_close($process);
            
                //finally print your API response
                echo utf8_encode($return);
        }*/
    }
    public function validacionD($estadoa,$clasea,$programa){
      
        $estadoa = $estadoa +1;
        $i = Estadosa::where('id',$estadoa)->first()->incapacidad;
        if ($i==0){
            return 0;
        }  
        else{
            $claseid = Clasesa::where('abbr',$clasea)->first()->id;
            $v = Descripcionesp::where('clases_afiliacion_id',$claseid)->where('codigo',$programa)->exists();
            if ($v){
                $value = Descripcionesp::where('clases_afiliacion_id',$claseid)->where('codigo',$programa)->first()->incapacidad;
                return $value;
            }
            else{
                return 0;
            }
        }



        /*
        else{
            $descripcion=utf8_decode($descripcion);
            $v = Descripcionesp::where('clases_afiliacion_id',$claseid)->where('descripcion',$descripcion)->exists();
            if ($v){
                $value = Descripcionesp::where('clases_afiliacion_id',$claseid)->where('descripcion',$descripcion)->first()->incapacidad;
                return $value;
            }
            else{
                return 0;
            }
        }
        */
        
        
       
    }
    public function validacion2022($tipo,$numero){
        $tipoDocumento = $tipo;
        $numeroIdentificacion = $numero;
        
        if ($numeroIdentificacion == "" || $tipoDocumento == "") {
            echo json_encode('error');
        }
        else{
                $hoy = date("Y-m-d H:i:s"); 

                $validacion = Validacion::where('id',1)->first();
                $host = $validacion->url;
                $username=$validacion->username;
                $password = $validacion->password;
                /*
                $host = "https://webservice.epsdelagente.com.co/api/Servicios/ValidacionDerechos";
                //$host="https://webservice.epscomfenalcovalle.boxalud.com/api/Servicios/ValidacionDerechos";
                //$host = "https://virtual.comfenalcovalle.com.co/esbtest/V2RESTJSONChannelAdapter";
                $username = "SUCURSALVIRTUALEPS";
                $password = "e95SucV7rtual";
        */
                $headers = array(
                    'Accept: */*',
                    'Content-Type:application/json',
                    'Authorization: Basic '. base64_encode("$username:$password")
                );
                $payload = '{
                    "requestMessageOut": {
                    "header": { "invokerDateTime":"2022-10-0610:03:00",
                    "moduleId": "PRUEBAS",
                    "systemId": "PRUEBAS",
                    "messageId": "PRUEBAS|CONSULTA|CE340590", "logginData": {
                    "sourceSystemId": "",
                    "destinationSystemId": "" },
                    "destination": { "namespace":
                    "http://co/com/comfenalcovalle/esb/ws/ValidadorServiciosEps",
                    "name": "ValidadorServiciosEps",
                    "operation": "execute" },
                    "securityCredential": { "userName": "", "userToken": ""
                    }, "classification": {
                    "classification": "" }
                    }, "body": {
                    "request": { "validadorRequest": {
                    "abreviatura": "'.$tipoDocumento.'",
                    "identificacion": "'.$numeroIdentificacion.'" }
                    } }
                    } }';
                //dd($payload);
                header("Content-Type:application/json");
                $process = curl_init($host);
                curl_setopt($process, CURLOPT_HTTPHEADER, $headers);
                curl_setopt($process, CURLOPT_HEADER, 0);
                curl_setopt($process, CURLOPT_USERPWD, $username . ":" . $password);
                curl_setopt($process, CURLOPT_TIMEOUT, 30);
                curl_setopt($process, CURLOPT_POST, 1);
                curl_setopt($process, CURLOPT_POSTFIELDS, $payload);
                curl_setopt($process, CURLOPT_ENCODING, "UTF-8" );
                curl_setopt($process, CURLOPT_RETURNTRANSFER, TRUE);
                $return = curl_exec($process);
                
                curl_close($process);
            
                //finally print your API response
                echo utf8_encode($return);
        }
        
    }
}
