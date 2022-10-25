@extends('layouts.app')

@section('content')
<div id="rootHistorico">
    <div className="container texto"> 
            <div className="row">
                <div className="col-sm-2 offset-sm-2">
                @if ($datos != "no")
                <b> {{$datos[0]->tipo_documento_afiliado. ": ".$datos[0]->num_documento_afiliado}}</b>
                @endif
                </div>
            </div>
            <br>
            <div className="row justify-content-center">
                <div className="col-md-10">
                    <table class="table table-hover table-bordered table-sm texto">
                    <thead>
                        <tr class="bg-info">
                        <th></th>
                        <th scope="col">No</th>
                       
                        <th scope="col">Fecha Atencion</th>
                        <th scope="col">Código</th>
                        <th scope="col">Diagnóstico</th>
                        <th scope="col">Diag1</th>
                        <th scope="col">Diag2</th>
                        <th scope="col">Diag3</th>
                        <th scope="col">Fecha de inicio</th>
                        <th scope="col">Días</th>
                        <th scope="col">Fecha fin</th>
                        <th scope="col">Observación</th>
                        <th scope="col">Estado</th>
                        <th scope="col">Ob.Estado</th>
                        </tr>
                    </thead>
                    <tbody>
                    @if ($datos != "no")
                    @foreach ($datos as $dato)
                    <?php
                        $aportantes =explode(";", $dato->aportantes);
                        
                    ?>   
                        <tr>
                        <td>
                       
                        @for ($i =0; $i < count($aportantes) ; $i++)
                            <button class='btn btn-default' type='button' value='print' onclick='print({{$dato->id}},{{$dato->prorrogaid}},{{ $i }},{{ $datos[0]->tipo_documento_afiliado}},{{ $datos[0]->num_documento_afiliado }})'>
                            {{ $i+1 }}
                                <i class='fa fa-print'> </i>
                            </button>
                        @endfor   
                        </td>
                        <td>{{$dato->id ."-".$dato->prorrogaid}}</td>
                        
                        <td>{{$dato->fecha_atencion}}</td>
                        <td>{{$dato->codigo_diagnostico}}</td>
                        <td>{{$dato->diagnostico->descripcion_diagnostico}}</td>
                        <td>{{$dato->codigo_diagnostico1}}</td>
                        <td>{{$dato->codigo_diagnostico2}}</td>
                        <td>{{$dato->codigo_diagnostico3}}</td>
                        <td>{{$dato->fecha_inicio_incapacidad}}</td>
                        <td>{{$dato->dias_solicitados}}</td>
                        <td>{{$dato->fecha_fin_incapacidad}}</td>
                        <td>{{$dato->observacion}}</td>
                        <td>{{$dato->estado->estado}}</td>
                        <td>{{$dato->observacion_estado}}</td>
                        </tr>
                    @endforeach
                    @endif
                    </tbody>
                    </table>
                </div>
            </div>
    </div>    
</div>
<script> 
function print(id,pr,a,tipoDoc,IDTrabajador){
    var url = '../../certificadoIncapacidad/' + id +"/" + pr + "/"+a+"/"+tipoDoc+"/"+IDTrabajador;
    window.open(url,'_blank');
}
</script>
@endsection