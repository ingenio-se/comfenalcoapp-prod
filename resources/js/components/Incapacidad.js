import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Mensaje from './Mensaje';
import Comboips from './Comboips.js';
import Combocausae from './Combocausae.js';
import Medico from './Medico.js';
import AutocompleteDescripcion from './AutocompleteDescripcion.js';
//import ValidacionDerechos from './ValidacionDerechos.js';
import axios from 'axios';
import { size } from 'lodash';
import ValidacionDerechos from './ValidacionDerechos';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


class IncapacidadFront extends Component {
    constructor(props) {
        super(props);

        let today = new Date();
        let dd = today.getDate();
        let mm = today.getMonth()+1; 
        const yyyy = today.getFullYear();
        if(dd<10) {
            dd=`0${dd}`;
        } 
        if(mm<10) {
            mm=`0${mm}`;
        } 
        today = `${yyyy}-${mm}-${dd}`;
        this.state = {
            tipoDocumento: '',
            numeroIdentificacion: '',
            nombreCompleto: '',
            tipoDocAfiliado:'',
            IDTrabajador:'',
            historiaClinica:'',
            genero: '',
            estado: '',
            tipoCotizante : '',
            descripcionPrograma:'',
            mensaje : '',
            tipoMensaje : '',
            loading : false,
            fechaAtencion : today,
            fechaInicioIncapacidad : today,
            diasSolicitados : 0,
            diasMaximosCie10:0,
            diasMaximosEspecialidad:0,
            fechaFinIncapacidad : today,
            diasReconocidos : 0,
            causae : '0',
            contingencia : '0',
            tipoDocAportante:'',
            numDocAportante: '',
            nombreAportante:'',
            observacion:'-',
            observacion_estado:'',
            diagnostico: '',
            codigoDiagnostico: '',
            diagnostico1: '',
            codigoDiagnostico1: '',
            diagnostico2: '',
            codigoDiagnostico2: '',
            diagnostico3: '',
            codigoDiagnostico3: '',

            capitulo : '',
            id : '00001',
            prorrogaId : 0,
            tipoPrestador: '',
            ips_id: 0,
            medico_id:0,
            lateralidad_id:0,
            lateralidad_id1:0,
            lateralidad_id2:0,
            lateralidad_id3:0,
            prorroga:'No',
            diasAcumuladosPrevios : 0,
            diasAcumuladosUltima : 0,
            fechaFinUltima:'',
            visible : 'oculto',
            estado_id : 2,
            errors : {
                diagnostico : 'oculto',
                tipoPrestador:'oculto',
                ips: 'oculto',
                causae:'oculto',
                lateralidad:'oculto',
                diasSolicitados:'oculto',
                contingencia:'oculto'
            },
            errorMensajes :{
                diagnostico : '',
                tipoPrestador:'',
                ips: '',
                causae:'',
                lateralidad:'',
                diasSolicitados:'',
                contingencia:''
            },
            validaciones : [],
            cronico :{
                consec :'',
                visible :'visible',
                alarmas: [],
            },
            flagCertificado: 'disabled',
            aportantes:'',
            edad:0
            
        };
        this.initialState = { ...this.state } 

        // bind
        
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleTipo = this.handleTipo.bind(this);
        this.handleNumero = this.handleNumero.bind(this);
        this.handleFechaInicioIncapacidad = this.handleFechaInicioIncapacidad.bind(this);
        this.handleFechaFin = this.handleFechaFin.bind(this);
        this.handleDiasSolicitados = this.handleDiasSolicitados.bind(this);
        this.getBusinessDatesCount = this.getBusinessDatesCount.bind(this);
        this.handleCausa = this.handleCausa.bind(this);
        this.handleContingencia = this.handleContingencia.bind(this);
        this.guardarIncapacidad = this.guardarIncapacidad.bind(this);
        this.handleObservacion = this.handleObservacion.bind(this);
        this.handleDiagnostico = this.handleDiagnostico.bind(this);
        this.handleCodigoDiagnostico = this.handleCodigoDiagnostico.bind(this);
        this.handleDiagnostico1 = this.handleDiagnostico1.bind(this);
        this.handleCodigoDiagnostico1 = this.handleCodigoDiagnostico1.bind(this);
        this.handleDiagnostico2 = this.handleDiagnostico2.bind(this);
        this.handleCodigoDiagnostico2 = this.handleCodigoDiagnostico2.bind(this);
        this.handleDiagnostico3 = this.handleDiagnostico1.bind(this);
        this.handleCodigoDiagnostico3 = this.handleCodigoDiagnostico3.bind(this);
        this.handleCapituloDiagnostico = this.handleCapituloDiagnostico.bind(this);
        this.handleMaximosCie10 = this.handleMaximosCie10.bind(this);
        this.handlePrestador = this.handlePrestador.bind(this);
        this.handleIpsChange = this.handleIpsChange.bind(this);
        this.handleMedico = this.handleMedico.bind(this);
        this.handleLateralidad= this.handleLateralidad.bind(this);
        this.handleLateralidad1= this.handleLateralidad1.bind(this);
        this.handleLateralidad2= this.handleLateralidad2.bind(this);
        this.handleLateralidad3= this.handleLateralidad3.bind(this);
        this.handleProrroga = this.handleProrroga.bind(this);
        this.showMessage = this.showMessage(this)

        this.getNumeroIncapacidad = this.getNumeroIncapacidad.bind(this);
        this.buscarHistorico=this.buscarHistorico.bind(this);
        this.handleFechaAtencion = this.handleFechaAtencion.bind(this);
        this.validarForm = this.validarForm.bind(this);
        this.clearErrors = this.clearErrors.bind(this);
        this.reviewProrroga = this.reviewProrroga.bind(this);

        this.handleMaxDias =this.handleMaxDias.bind(this);

      
        this.activarGeneracion=this.activarGeneracion.bind(this);
        this.renderAfiliaciones=this.renderAfiliaciones.bind(this);
        this.renderAportantes=this.renderAportantes.bind(this);
        this.generarCertificado=this.generarCertificado.bind(this);
        this.verificarTraslapo=this.verificarTraslapo.bind(this);
        this.calculoEdad = this.calculoEdad.bind(this);
        this.handleToast = this.handleToast.bind(this);
    }
    generarCertificado(a){
        console.log(a)
        let id=this.state.id;
        let pid= this.state.prorrogaId;
        //let id=56;
        let url = '/certificadoIncapacidad/'+id+"/"+pid+"/"+a;
        window.open(url,"_blank");
        //location.reload();
    }

    handleToast(arg,type) {
        const toastOptions = {
            success: 'success',
            error: 'error',
            info: 'info',
            warning: 'warn'
        }
        const toastType = toastOptions[type]
        toast[toastType](arg, {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        });
    }

    componentDidUpdate() {
        const { fechaInicioIncapacidad, updated } = this.state;
        if (fechaInicioIncapacidad && updated) {
            this.handleFechaFin();
            this.setState({ updated: false });
        }
    }

    async getNumeroIncapacidad(){
        let url ='getNumeroIncapacidad'
        axios.get(url)
            .then(resp => {
                this.setState({
                    id:`0000${resp.data.data}`,
                    prorrogaId:0,
                });
                return;
            })
            .catch(err =>{
                console.log(err)
            })
       
    }
    calculoEdad(fecha){
        console.log(fecha)
        //console.log(new Date(fecha).getTime());
        
        /*let f1 = new Date(fecha).getTime();
        let f2 = new Date().getTime();
        console.log(f1);
        console.log(f2);

        let f = f2-f1;
        let edad = new Date(f)
        console.log(edad)
        */
        var ageDifMs = Date.now() - new Date(fecha);
        var ageDate = new Date(ageDifMs); // miliseconds from epoch
        //console.log(Math.abs(ageDate.getUTCFullYear() - 1970));
        return Math.abs(ageDate.getUTCFullYear() - 1970);
    }
    activarGeneracion(incapacidades,response,afiliaciones){
        let mensaje = response.data.responseMessageOut.body.response.validadorResponse.Derechos['MENSAJE'];
        console.log(incapacidades);
       // mensaje = utf8_decode(mensaje)
        if (incapacidades.includes(1,0)){
                
            this.getNumeroIncapacidad()       
            console.log(response.data.responseMessageOut.body.response.validadorResponse);
            let nombre = afiliaciones[0]['Nombre'];
            let primerApellido = afiliaciones[0]['PrimerApellido']; 
            let segundoApellido = ' ';
            if(typeof afiliaciones[0]['SegundoApellido'] !== 'object' ){
                segundoApellido = afiliaciones[0]['SegundoApellido'];
            }
           
            let nombreCompleto = `${nombre} ${primerApellido} ${segundoApellido}`;

            let tipoDocAfiliado = afiliaciones[0]['TipoDocAfiliado'];
            let IDTrabajador = afiliaciones[0]['IdAfiliado'];
            
            let historiaClinica = afiliaciones[0]['IdHistoria12'];
            let genero = afiliaciones[0]['Sexo'];
            let fechaNacimiento = afiliaciones[0]['FechaNacimiento']
            var edad = this.calculoEdad(fechaNacimiento)

            let estado = afiliaciones[0]['EstadoDescripcion'];
            let tipoCotizante = afiliaciones[0]['ClaseAfiliacion'];
            let descripcionPrograma = afiliaciones[0]['DescripcionPrograma'];

            //datos aportante
            //let tipoDocAportante = response.data.responseMessageOut.body.response.validadorResponse.DsAfiliado.Afiliado['TipoDocEmpresa'];
            //let numDocAportante = response.data.responseMessageOut.body.response.validadorResponse.DsAfiliado.Afiliado['IDEmpresa'];
            //let nombreAportante = response.data.responseMessageOut.body.response.validadorResponse.DsAfiliado.Afiliado['NombreEmpresa'];
            // set state
            var visible =this.state.cronico.visible;
            
            this.setState({
                nombreCompleto: nombreCompleto,
                tipoDocAfiliado : tipoDocAfiliado,
                IDTrabajador : IDTrabajador,
                //historiaClinica : historiaClinica,
                historiaClinica : IDTrabajador,
                mensaje : mensaje,
                genero : genero,
                estado : estado,
                edad : edad,
                tipoCotizante: tipoCotizante,
                descripcionPrograma: descripcionPrograma,
                validacion: JSON.stringify(response.data),
                //tipoDocAportante: tipoDocAportante,
                //numDocAportante: numDocAportante,
                //nombreAportante:nombreAportante,
                tipoMensaje: 'success',
                visible:visible,
                loading:true,
            });

        }
        else{
            console.log(this.state)
            this.setState({
                mensaje : mensaje,
                loading: true,
                tipoMensaje: 'success',
                visible:'oculto',
            });

        }
      
    }
    async handleSubmit(e) {
        e.preventDefault();
        //this.setState(this.initialState);
        let tipoDocumento=this.state.tipoDocumento;
        let numeroIdentificacion= this.state.numeroIdentificacion;
        //let validaciones=await ValidacionDerechos(tipoDocumento, numeroIdentificacion);
       // console.log(validaciones);
       
        //this.getNumeroIncapacidad();
        let url = 'validacionDerechos/' + tipoDocumento + "/" + numeroIdentificacion;
        await axios
            .get(url, {
                tipoDocumento: tipoDocumento,
                numeroIdentificacion: numeroIdentificacion
                })
            .then(response => {
                // console
                //console.log(response);

                let mensaje = response.data.responseMessageOut.body.response.validadorResponse.Derechos['MENSAJE'];
                let derecho = response.data.responseMessageOut.body.response.validadorResponse.Derechos['DerechoPrestacion']
                
                if (derecho == "SI"){
                
                    let afiliaciones = response.data.responseMessageOut.body.response.validadorResponse.DsAfiliado.Afiliado;
                    //console.log(derecho);
                    //console.log(mensaje);
                    //console.log(afiliaciones);
                    //console.log(Array.isArray(afiliaciones));

                    let validaciones = [];

                    if (Array.isArray(afiliaciones) == false) {
                        afiliaciones = [afiliaciones]    
                    }
                
                    let incapacidades = [];
                    let promises = [];
                    for (var i = 0; i < size(afiliaciones); i++) {
                        var afiliacion = afiliaciones[i];
                        var clasea = afiliacion.ClaseAfiliacion;
                        var estado = afiliacion.Estado;
                        var descripcion = afiliacion.DescripcionPrograma;
                        var programa = afiliacion.IdPrograma 
                        if(typeof afiliacion.NombreEmpresa === 'object' ){
                           afiliacion.NombreEmpresa=''
                        }
                        if(typeof afiliacion.IDEmpresa === 'object' ){
                            afiliacion.IDEmpresa='N/A'
                        }
                        /*
                        if (Object.keys(afiliacion.NombreEmpresa).length ===0){
                            afiliacion.NombreEmpresa=''
                        }
                        if (Object.keys(afiliacion.IDEmpresa).length ===0){
                            afiliacion.IDEmpresa=''
                        }*/
                        let url = '/validacionDescripcion/'+ estado + "/" + clasea + "/" + programa;
                        promises.push(
                            axios.get(url).then(response => {
                                // do something with response
                                incapacidades.push(response.data);
                            })
                        )

                    }
                    Promise.all(promises).then(() => {

                        //console.log(incapacidades)
                        var aportantes=""
                        var programas=""
                        for (var i = 0; i < size(afiliaciones); i++) {
                            if (incapacidades[i] == 0){
                                afiliaciones[i]["Incapacidad"] = "NO"
                            }
                            if (incapacidades[i] == 1) {
                                afiliaciones[i]["Incapacidad"] = "SI"
                                if (aportantes==""){
                                    if (afiliaciones[i]["IDEmpresa"]!='N/A'){
                                        aportantes=afiliaciones[i]["IDEmpresa"];
                                    }
                                    else{
                                        aportantes="afiliado";
                                    }
                                }
                                else{
                                    if (afiliaciones[i]["IDEmpresa"]!='N/A'){
                                        aportantes=aportantes+";"+afiliaciones[i]["IDEmpresa"];
                                    }
                                    else{
                                        aportantes=aportantes+";afiliado";
                                    }
                                }
                                if (programas==""){
                                        programas=afiliaciones[i]["IdPrograma"];          
                                }
                                else{
                                        programas=programas+";"+afiliaciones[i]["IdPrograma"];
                                }
                            }
                        }
                        this.setState({
                            validaciones: afiliaciones,
                            aportantes: aportantes,
                            programas : programas
                        });
                        this.activarGeneracion(incapacidades, response,afiliaciones)
                    });
                   // console.log(this.state.validaciones);
                }
                else{
                    this.setState({
                        mensaje : mensaje,
                        loading: true,
                        tipoMensaje: 'error',
                        visible:'oculto',
                    });
                }
                
                
                
            });
        
        this.buscarCronico()
       
    }
    buscarCronico(){
        let url = 'buscarCronico'
        axios.post(url, { id : this.state.numeroIdentificacion })
            .then(resp => {
                //console.log(resp.data)
                this.setState({
                    cronico: resp.data.data,
                });
                if (this.state.diasMaximosEspecialidad >0){
                    if (this.state.visible != 'oculto'){
                        this.setState({
                            visible:resp.data.data.visible,
                        });
                    }
                }

            })
            .catch(err => {
                console.log(err)
            })
        
    }
    handleTipo(e) {
        this.setState({
            tipoDocumento: e.target.value
        });
    }
    handleMaxDias(dato) {
        this.setState({
            diasMaximosEspecialidad: dato
        });
    }
    handleFechaAtencion(e) {
        this.setState({
            fechaAtencion: e.target.value
        });
    }
    handleNumero(e) {
        this.setState({
            numeroIdentificacion: e.target.value
        });
    }
    //diagnosticos 
    handleDiagnostico(dato){
        this.setState({diagnostico: dato} )
    }
    handleCodigoDiagnostico(dato){
        this.setState({codigoDiagnostico: dato})
    }
    handleDiagnostico1(dato){
        this.setState({diagnostico1: dato} )
    }
    handleCodigoDiagnostico1(dato){
        this.setState({codigoDiagnostico1: dato})
    }
    handleDiagnostico2(dato){
        this.setState({diagnostico2: dato} )
    }
    handleCodigoDiagnostico2(dato){
        this.setState({codigoDiagnostico2: dato})
    }
    handleDiagnostico3(dato){
        this.setState({diagnostico3: dato} )
    }
    handleCodigoDiagnostico3(dato){
        this.setState({codigoDiagnostico3: dato})
    }
    handleCapituloDiagnostico(dato){
        this.setState({capitulo: dato })   
    }
    reviewProrroga(){
        let tipoDocumento=this.state.tipoDocumento;
        let numeroIdentificacion = this.state.numeroIdentificacion;
        let url = '/buscarHistoricoUltimaDias/' + tipoDocumento + "/" + numeroIdentificacion;
        let diasSolicitados = this.state.diasSolicitados
        
        axios.get(url)
            .then(resp => {
                console.log(resp.data)

                if (resp.data.capitulo == this.state.capitulo) {
                    let id = "0000" + resp.data.idant;
                    let prorrogaId = resp.data.prorrogaidant + 1;
                    //console.log(prorrogaId);

                    this.setState({
                        id: id,
                        prorroga : "Si",
                        prorrogaId: prorrogaId,
                        diasAcumuladosPrevios: resp.data.dias,
                        diasAcumuladosUltima: parseInt(resp.data.dias) + parseInt(diasSolicitados),
                        fechaFinUltima : resp.data.fechaFinUltima
                    })
                }
                else {
                    let observacion_estado = this.state.observacion_estado;
                    let observacion = "Ruptura por escoger otro capítulo";

                    // alert("El diagnóstico seleccionado no pertenece al mismo capítulo de la última incapacidad")
                    this.handleToast("El diagnóstico seleccionado no pertenece al mismo capítulo de la última incapacidad",'warning');
                    
                    if (!observacion_estado.includes(observacion)){
                        var nuevaob =`${observacion_estado} ${observacion}`
                    }
                    else{
                        var nuevaob = observacion_estado
                    }

                    this.setState({
                        diasAcumuladosPrevios: resp.data.dias,
                        diasAcumuladosUltima: parseInt(resp.data.dias) + parseInt(diasSolicitados),
                        estado_id: 1,
                        observacion_estado: nuevaob,
                        prorroga : "No",
                        fechaFinUltima : resp.data.fechaFinUltima
                    })
                }

            })
            .catch(err => {
                console.log(err)
            })
    }
    handleMaximosCie10(dato){
        this.setState({ diasMaximosCie10: dato})
    }
    handleLateralidad(e){
        this.setState({lateralidad_id: e.target.value})
    }
    handleLateralidad1(e){
        this.setState({lateralidad_id1: e.target.value})
    }
    handleLateralidad2(e){
        this.setState({lateralidad_id2: e.target.value})
    }
    handleLateralidad3(e){
        this.setState({lateralidad_id3: e.target.value})
    }
    handleProrroga(e){
        this.setState(
            {prorroga: e.target.value}
        )
        if (e.target.value=="Si"){
            let tipoDocumento=this.state.tipoDocumento;
            let numeroIdentificacion= this.state.numeroIdentificacion;
            let url = '/buscarHistoricoUltimaDias/'+tipoDocumento+"/"+numeroIdentificacion;
            let diasSolicitados = this.state.diasSolicitados
            
            axios.get(url)
                .then(resp => {
                //console.log(resp.data)
                
                if (resp.data.capitulo == this.state.capitulo){
                    let id= "0000"+resp.data.idant;
                    let prorrogaId = resp.data.prorrogaidant+1;
                    console.log(prorrogaId);
                    this.setState({
                        id : id,
                        prorrogaId: prorrogaId,
                        diasAcumuladosPrevios: resp.data.dias,
                        diasAcumuladosUltima : parseInt(resp.data.dias) + parseInt(diasSolicitados)
                    })
                }
                else{
                    // alert("El diagnóstico seleccionado no pertenece al mismo capítulo de la última incapacidad")
                    this.handleToast("El diagnóstico seleccionado no pertenece al mismo capítulo de la última incapacidad",'warning');
                    this.setState({
                        diasAcumuladosPrevios: resp.data.dias,
                        diasAcumuladosUltima : parseInt(resp.data.dias) + parseInt(diasSolicitados),
                        estado_id : 1,
                    })
                }

                })
                .catch(err =>{
                    console.log(err)
                })

        }
        if (e.target.value=="No"){
            this.setState({
                diasAcumuladosPrevios: 0,
                diasAcumuladosUltima : 0
            })
        
        }

    }
    verificarTraslapo(){
        let f1 = new Date(this.state.fechaInicioIncapacidad).getTime();
        let f2 = new Date(this.state.fechaFinUltima).getTime();
       
        if (f1 < f2){
            // alert("La fecha de inicio no puede ser menor a la fecha de finalización de la última incapacidad")
            this.handleToast("La fecha de inicio no puede ser menor a la fecha de finalización de la última incapacidad",'warning');
            return false;
        }
        return true;
    }
    handleFechaInicioIncapacidad(e){
        
        //var todayDate = new Date().toISOString().slice(0,10);
        
            let fi =new Date(e.target.value).getTime();

            let l1 = new Date(this.state.fechaAtencion);
            let l2 = new Date(this.state.fechaAtencion);
        
            l1 = new Date(l1.setTime( l1.getTime() + 3 * 86400000 )).getTime()
            l2 = new Date(l2.setTime( l2.getTime() - 3 * 86400000 )).getTime()

            this.setState({
                fechaInicioIncapacidad:new Date(e.target.value).toISOString().slice(0,10),
                updated: true
            });
            
            if (this.state.diasMaximosEspecialidad>0){
                if (fi>l1){
                   // alert("La fecha de inicio no puede ser mayor a 3 días desde la fecha de atención")
                    this.handleToast("La fecha de inicio no puede ser mayor a 3 días desde la fecha de atención",'warning');
                    this.setState({
                        fechaInicioIncapacidad:new Date().toISOString().slice(0,10)
                    });
                }
                if (fi<l2){
                    // alert("La fecha de inicio no puede ser menor a 3 días desde la fecha de atención")
                    this.handleToast("La fecha de inicio no puede ser mayor a 3 días desde la fecha de atención",'warning');
                    this.setState({
                        fechaInicioIncapacidad:new Date().toISOString().slice(0,10),
                    });
                }
            }
    }
    handleDiasSolicitados(e){
        this.setState({
            diasSolicitados: e.target.value,
        })
        //console.log(this.state.diasSolicitados);
        //console.log(this.state.diasMaximosCie10);
       
        let observacion_estado = this.state.observacion_estado;
        let observacion = "Dias solicitados mayor a especificado por Cie10"


        if (!observacion_estado.includes(observacion)){
            var nuevaob =`${observacion_estado} ${observacion}`
        }
        else{
            var nuevaob = observacion_estado
        }
                    
        if (this.state.diasSolicitados > this.state.diasMaximosCie10) {
            this.setState({
                estado_id : 1,
                observacion_estado: nuevaob,
            })
        }
        
    }
    handleFechaFin(e){
        const { diasSolicitados } = this.state;
        let l1 = new Date(this.state.fechaInicioIncapacidad);
        if (parseInt(diasSolicitados) !== 0) {
            let dias = diasSolicitados -1;
            l1 = new Date(l1.setTime( l1.getTime() + dias * 86400000 )).getTime()
            this.setState({
                fechaFinIncapacidad:new Date(l1).toISOString().slice(0,10),
            });
            this.getBusinessDatesCount(new Date(this.state.fechaInicioIncapacidad),new Date(l1))
        } else {
            this.setState({ diasReconocidos: 0 });
        }
        this.reviewProrroga()
    }
    handleCausa(e){
        //console.log(e);
        this.setState({
            causae : e,
        });
       
       
        if (e == 1) { 
            this.setState({
                contingencia : 3,
            });
        }
        if (e == 14) { 
            this.setState({
                contingencia : 2,
            });
        }
        if (e == 13) { 
            this.setState({
                contingencia : 1,
            });
        }
    }
    handleObservacion(e){
        this.setState({
            observacion : e.target.value,
        });
    }
    handlePrestador(dato){
        this.setState(
            {tipoPrestador: dato}
        )   
    }
    handleIpsChange(dato){
        this.setState(
            {ips_id: dato}
        )   
    }
    handleMedico(dato){
        this.setState(
            {medico_id: dato}
        )   
    }
    handleContingencia(e){
       // console.log(e.target.value);
        this.setState({
            contingencia : e.target.value,
        });
        var contingencia = e.target.value;
        var causae = this.state.causae
        if ((contingencia == 2 || contingencia == 3) && (causae != 1 && causae != 14)){
            // alert("la causa externa solo puede ser Accidente de trabajo o Enfermedad laboral")
            this.handleToast("la causa externa solo puede ser Accidente de trabajo o Enfermedad laboral",'warning');
            this.setState({
                causae : '',
            });
        }
    }
    getBusinessDatesCount(startDate, endDate) {
        //var startDate = new Date(startDate);
        //var endDate = new Date(endDate);   
        //console.log(endDate.toISOString().slice(0,10))    
        var count = 0;
        var countf = 0;
        var festivos = ["2020-05-01","2020-05-25","2020-06-15","2020-06-22","2020-06-29","2020-07-20","2020-08-07","2020-08-17","2020-10-12","2020-11-02","2020-11-16","2020-12-08","2020-12-25",
                        "2021-01-01","2021-01-11","2021-03-22","2021-04-01","2021-04-02","2021-05-01","2021-05-17","2021-06-03","2021-06-14","2021-07-05","2021-07-20","2021-08-07","2021-08-16",
                        "2021-10-18","2021-11-01","2021-11-15","2021-12-08","2021-12-25"];
        var curDate = startDate;
        while (curDate <= endDate) {
            var dayOfWeek = curDate.getDay();
            //console.log(curDate.toISOString().slice(0,10) + " " + dayOfWeek);
            if(dayOfWeek <6)
               count++;
            //console.log(count + " "+ countf)
            if(festivos.includes(curDate.toISOString().slice(0,10)))
                countf++;
    
            curDate.setDate(curDate.getDate() + 1);
        }
        //console.log(count);
        //console.log(countf);
        var reconocidos = count-countf;
        this.setState({
            diasReconocidos : reconocidos
        });
    }
    async guardarIncapacidad({target}){
        target.disabled = true;
        //console.log(this.state)
        //console.log(parseInt(this.state.diasSolicitados));
        var esp = "otros"
        if (this.state.diasMaximosEspecialidad == 0){
            esp = "laboral"
        }

        if (esp == "otros"){
            if (parseInt(this.state.diasSolicitados) <= this.state.diasMaximosEspecialidad){
                    let resp= await this.validarForm()
                    //alert(resp)
                    if (resp){
                        
                        //alert(this.state.id);
                        
                        let url = 'saveIncapacidad'
                        axios.post(url, { datos: this.state })
                            .then(resp => {
                                console.log(resp.data)
                                // alert(resp.data)
                                this.handleToast(resp.data,'success');
                                setTimeout(target.disabled = false,1500);
                                //this.setState(this.initialState);
                            // location.reload();
                            this.setState({
                                    flagCertificado: ''
                                })
                            })
                            .catch(err => {
                                console.log(err)
                                this.handleToast(err,'error');
                                setTimeout(target.disabled = false,1500);
                            })
                    }
                    else{
                        // alert("Hay errores en algunos campos");
                        this.handleToast("Hay errores en algunos campos",'error');
                        setTimeout(target.disabled = false,1500);
                    }
            }
            else{
                // alert("Los días solicitados exceden el máximo definido para su especialidad médica");
                this.handleToast("Los días solicitados exceden el máximo definido para su especialidad médica",'error');
            }
        }
        if (esp == "laboral"){
                    let resp= await this.validarForm()
                    //alert(resp)
                    if (resp){
                        
                        //alert(this.state.id);
                        
                        let url = 'saveIncapacidad'
                        axios.post(url, { datos: this.state })
                            .then(resp => {
                                console.log(resp.data)
                                // alert(resp.data)
                                this.handleToast(resp.data,'success');
                                setTimeout(target.disabled = false,1500);
                                //this.setState(this.initialState);
                            // location.reload();
                            this.setState({
                                    flagCertificado: ''
                                })
                            })
                            .catch(err => {
                                console.log(err)
                                this.handleToast(err,'error');
                                setTimeout(target.disabled = false,1500);
                            })
                    }
                    else{
                        // alert("Hay errores en algunos campos 2");
                        this.handleToast("Hay errores en algunos campos",'error');
                        setTimeout(target.disabled = false,1500);
                    }
        }
    }
    async validarForm(){
        this.clearErrors()
        
        let resp=true;
        //alert(resp)
        //Auditoria
        if (this.state.diasSolicitados > this.state.diasMaximosCie10) {
            this.setState({
                estado_id : 1
            })
        }
        if (this.state.diasSolicitados > this.state.diasMaximosEspecialidad) {
           
                this.setState({
                    estado_id : 1
                })
            
        }
        if (this.state.edad >= 65){
            let observacion_estado = this.state.observacion_estado;
            let observacion = "Auditoría paciente mayor de 65 años";
            
            if (!observacion_estado.includes(observacion)){
                var nuevaob =`${observacion_estado} ${observacion}`
            }
            else{
                var nuevaob = observacion_estado
            }
            this.setState({
                estado_id : 1,
                observacion_estado: nuevaob,
            })
        }
        resp=this.verificarTraslapo();
        let newState = Object.assign({}, this.state);
        if (this.state.tipoPrestador == ''){
            newState.errors.tipoPrestador = "visible";
            newState.errorMensajes.tipoPrestador = "Tipo de prestador requerido";
            resp=false;   
        }
        if ((this.state.tipoPrestador == 1)&&(this.state.ips_id == 0)){
            newState.errors.ips = "visible";
            newState.errorMensajes.ips = "IPS requerida";
            resp=false;
        }
        if (this.state.causae == 0){
            newState.errors.causae = "visible";
            newState.errorMensajes.causae = "Causa externa requerida";
            resp=false;   
        }
        if (this.state.lateralidad_id == 0){
            newState.errors.lateralidad = "visible";
            newState.errorMensajes.lateralidad = "Lateralidad requerida";
            resp=false;   
        }
        if (this.state.diagnostico == ''){
            newState.errors.diagnostico = "visible";
            newState.errorMensajes.diagnostico = "Diagnóstico requerido";
            resp=false;   
        }
        if (this.state.diasSolicitados == 0){
            newState.errors.diasSolicitados = "visible";
            newState.errorMensajes.diasSolicitados = "Días debe ser mayor a 0";
            resp=false;   
        }
        if (this.state.contingencia == 0){
            newState.errors.contingencia = "visible";
            newState.errorMensajes.contingencia = "Contingencia requerida";
            resp=false;   
        }
        this.setState(newState);

        if (this.state.prorroga=="No"){
            await this.getNumeroIncapacidad();
        }
        //alert(resp)
        return resp;
        
    }
    clearErrors(){
        let newState = Object.assign({}, this.state);
       // console.log(Object.entries(newState));  
        Object.keys(newState.errors).forEach(key => {
            newState.errors[key] = "oculto";
        });
        this.setState(newState);
        let newState2 = Object.assign({}, this.state);
        Object.keys(newState2.errorMensajes).forEach(key => {
            newState2.errorMensajes[key] = '';
        });
        //console.log(newState);
        this.setState(newState2);
    }   
    buscarHistorico(){
        
        let tipoDocumento=this.state.tipoDocumento;
        let numeroIdentificacion= this.state.numeroIdentificacion;
        let url = '/buscarHistorico/'+tipoDocumento+"/"+numeroIdentificacion;
        window.open(url,"_blank");
        /*
        axios.get(url)
            .then(resp => {
               console.log(resp.data.respuesta)

            })
            .catch(err =>{
                console.log(err)
            })*/
    }
    showMessage(m){
        return (<div className="alert alert-success" role="alert">{ m }</div>);
    }
    renderAfiliaciones(){
        const { validaciones } = this.state;
        
        return(
        <div className="afiliaciones white texto">
                <p>Afiliaciones</p>
                <table className="table table-hover table-bordered table-sm">
                    <tbody>
                    <tr className="white">
                        <td>Tipo Doc</td>
                        <td>Num Doc</td>
                        <td>Nombre</td>
                        <td>Estado</td>
                        <td>Clase</td>
                        <td>Descripción</td>
                        <td>Generación de Incapacidad</td>
                        <td>Nombre Empresa</td>
                        
                        <td>Num ID</td>
                    </tr>
                        
                            {Object.keys(validaciones).map((key) => (
                                
                                <tr key={key}>
                                    <td>{validaciones[key]['TipoDocAfiliado']}</td>
                                    <td>{validaciones[key]['IdAfiliado']}</td>
                                    <td>{validaciones[key]['Nombre'] + " " + validaciones[key]['PrimerApellido']+ " " + validaciones[key]['SegundoApellido']}</td>
                                    <td>{validaciones[key]['EstadoDescripcion']}</td>
                                    <td>{validaciones[key]['ClaseAfiliacion']}</td>
                                    <td>{validaciones[key]['DescripcionPrograma']}</td>
                                    <td>{validaciones[key]['Incapacidad']}</td>
                                    <td>{ validaciones[key]['NombreEmpresa']  }</td>
                                   
                                    <td>{ validaciones[key]['IDEmpresa'] }</td>
                                </tr>
                            ))}
                    </tbody>   
                </table>
            </div>);
    }
    renderAportantes(){
        const { validaciones } = this.state;
        //console.log(validaciones);
        
        return(
        <div className="afiliaciones white">
                <p>Aportantes</p>
                <table className="table table-hover table-sm">
                    <tbody>
                        <tr>
                            <td>Num ID</td>
                            <td>Nombre</td>
                            <td>Certificado</td>
                        </tr>

                        {Object.keys(validaciones).map((key) => (

                            <tr key={key}>

                                <td>{validaciones[key]['IDEmpresa'] == 'N/A' ? validaciones[key]['TipoDocAfiliado'] : validaciones[key]['IDEmpresa']}</td>

                                <td>{validaciones[key]['IDEmpresa'] == 'N/A' ? validaciones[key]['Nombre'] + " " + validaciones[key]['PrimerApellido'] + " " + validaciones[key]['SegundoApellido'] : validaciones[key]['NombreEmpresa']}</td>
                                <td>{validaciones[key]['Incapacidad'] == "SI" ? <input type="button" id={key} onClick={e => this.generarCertificado(e.target.id)} className="btn btn-primary" value="Certificado" disabled={this.state.flagCertificado}/> : ''}</td>


                            </tr>
                        ))}
                    </tbody>   
                </table>
            </div>);
    }
    render() {
        let mensaje=<div></div>;
        let mensaje2 =<div></div>;
          
        if (this.state.loading ){ 
            if (this.state.tipoMensaje == 'success'){
                mensaje = (<div className="alert alert-success reco" role="alert">
                 { this.state.mensaje }
                 </div>);
               
            }
            if (this.state.tipoMensaje == 'error'){
                mensaje = (<div className="alert alert-danger reco" role="alert">
                    { this.state.mensaje }
                    </div>);
               }
            
        }
        if(this.state.cronico.consec != 0){
            mensaje2 = (<div className="alert alert-warning reco" role="alert">
            El usuario se encuentra registrado en la base de seguimiento por Incapacidad continua prolongada <a href={ 'verCronico/' + this.state.cronico.consec + '/0' } target="_blank">Ver detalle</a>
                <ul>
                {this.state.cronico.alarmas.map((a, index) =>
                     <li>{this.state.cronico.alarmas[index]}</li>                        
                )} 
                </ul> 
               
                {
                   this.state.cronico.alarmas.includes("Paciente con IPT",0) ? 
                   <a href={ 'certificadoInvalidez/' + this.state.cronico.consec  } target="_blank">Certificado invalidez</a>
                   :
                   ''
                }
             </div>);
        }

                            
        return (
        <div className="container texto">
            <ToastContainer/>
            <div className="row justify-content-center">
                <div className="col-md-10">
                    <div className="card">
                        
                        <div className="card-header verde3 titulo">Validación de derechos - Incapacidades</div>
        
                        <div className="card-body texto">
                            <form onSubmit={this.handleSubmit}>
                                <div className="row">
                                    <div className="col-sm-4">
                                        <label htmlFor="tipoDocumento">Tipo documento</label>
                                        <select className="form-control" id="tipoDocumento" onChange={this.handleTipo} value={this.state.tipoDocumento}>
                                            <option value=""></option>
                                            <option value="CC">CC</option>
                                            <option value="NIT">NIT</option>
                                            <option value="TI">TI</option>
                                            <option value="CE">CE</option>
                                            <option value="PA">PA</option>
                                            <option value="RC">RC</option>
                                            <option value="NUIP">NUIP</option>
                                            <option value="MS">MS</option>
                                            <option value="CN">CN</option>
                                           
                                        </select>
                                    </div>
                                    <div className="col-sm-4">
                                        <label htmlFor="numeroIdentificacion">Número de identificacion</label>
                                        <input type="text" id="numeroIdentificacion" className="form-control" onChange={this.handleNumero} value={this.state.numeroIdentificacion }/>
                                    </div>
                                    <div className="col-sm-4">
                                        <br/>
                                        <input type="submit" id="btnBuscar" className="btn btn-primary" value="Buscar"/>
                                    </div>
                                </div>  
                                
                            </form> 
                        </div>
                    </div>
                </div>
            </div>
            <br/> 
            
            { mensaje }
           
            <br/>

            { mensaje2 }
           
            <br/>
          
            {this.renderAfiliaciones()}
            

            <br/>

            <div className={this.state.visible}>
            
            <div className="row justify-content-center ">
                <div className="col-md-10">
                    <div className="card">
                        <div className="card-header bg2 titulo">Datos del afiliado</div>
        
                        <div className="card-body texto">
                                <div className="row">
            
                                    <div className="col-sm-3">
                                        <div className="form-group">
                                            <label htmlFor="tipoDocumento">Tipo documento</label>
                                            <input type="text"  className="form-control" defaultValue={this.state.tipoDocAfiliado}  readOnly />
                                        </div>
                                    </div>

                                    <div className="col-sm-3">
                                        <div className="form-group">
                                            <label htmlFor="numeroIdentificacion">Número de identificacion</label>
                                            <input type="text"  className="form-control" defaultValue={this.state.IDTrabajador}  readOnly  />
                                        </div>
                                    </div>
                                    <div className="col-sm-6">
                                        <div className="form-group">
                                            <label htmlFor="nombreAfiliado">Nombre completo</label>
                                            <input type="text" id="nombreAfiliado" className="form-control" defaultValue={this.state.nombreCompleto}  readOnly/>
                                        </div>
                                    </div>
                                </div>  
                                <div className="row">
            
                                    <div className="col-sm-3">
                                        <div className="form-group">
                                            <label htmlFor="historiaClinica">Numero de historia clínica</label>
                                            <input type="text" id="historiaClinica" className="form-control" defaultValue={this.state.historiaClinica}  readOnly />
                                        </div>
                                    </div>

                                    <div className="col-sm-1">
                                        <div className="form-group">
                                            <label htmlFor="genero">Género</label>
                                            <input type="text" id="genero" className="form-control" defaultValue={this.state.genero}  readOnly  />
                                        </div>
                                    </div>
                                    <div className="col-sm-2">
                                        <div className="form-group">
                                            <label htmlFor="estado">Estado</label>
                                            <input type="text" id="estado" className="form-control" defaultValue={this.state.estado}  readOnly/>
                                        </div>
                                    </div>
                                    <div className="col-sm-2">
                                        <div className="form-group">
                                            <label htmlFor="tipoCotizante">Tipo de cotizante</label>
                                            <input type="text" id="tipoCotizante" className="form-control" defaultValue={this.state.tipoCotizante}  readOnly/>
                                        </div>
                                    </div>
                                    <div className="col-sm-4">
                                        <div className="form-group">
                                            <label htmlFor="tipoCotizante">Descripción programa</label>
                                            <input type="text" id="descripcionPrograma" className="form-control" defaultValue={this.state.descripcionPrograma}  readOnly/>
                                        </div>
                                    </div>
                                </div>  
                        </div>
                    </div>
                </div>
            </div>
            </div>
            <br/>
              
            <div className={this.state.visible}>
            <div className="row justify-content-center">
                <div className="col-md-10">
                    <div className="card">
                        <div className="card-header bg2 titulo">Datos de la IPS / Médico</div>
        
                        <div className="card-body texto">
        
                                <Comboips handleIpsChange={this.handleIpsChange} handlePrestador={this.handlePrestador} valor={this.state.ips_id} error={this.state.errors['tipoPrestador']} mensaje={this.state.errorMensajes['tipoPrestador']} errorIps={this.state.errors['ips']} mensajeIps={this.state.errorMensajes['ips']}/>
                                <Medico handleMedico={this.handleMedico} handleMaxDias={this.handleMaxDias}/> 
                        </div>
                    </div>
                </div>
            </div>
            </div>
            <br/>

            <div className={this.state.visible}>
            <div className="row justify-content-center">
                <div className="col-md-10">
                    <div className="card">
                        <div className="card-header bg2 titulo">Información de la incapacidad</div>
        
                        <div className="card-body texto">
                                <div className="row">
                                    <div className="col-sm-3">
                                        <div className="form-group">
                                            <button className="btn btn-primary" onClick={this.buscarHistorico}>Histórico incapacidades</button>
                                        </div>
                                    </div>

                                    <div className="col-sm-3">
                                        <div className="form-group">
                                            <label htmlFor="numeroIncapacidad">Número de incapacidad</label>
                                            <input type="text" id="numeroIncapacidad" className="form-control" value={this.state.id + "-" + this.state.prorrogaId}  readOnly  />
                                            
                                        </div>
                                    </div>
                                    <div className="col-sm-3">
                                        <div className="form-group">
                                            <label htmlFor="nombreAfiliado">Fecha de atención</label>
                                         
                                            <input type="date" id="fechaAtencion" className="form-control"  defaultValue={this.state.fechaAtencion} onChange={this.handleFechaAtencion}/>
                                        </div>
                                    </div>
                                    <div className="col-sm-3">
                                        <Combocausae handleCausa = {this.handleCausa} value= { this.state.causae} error={this.state.errors['causae']} mensaje={this.state.errorMensajes['causae']}/>
                                    </div>
                                </div>  
                                <div className="row">
                                    <div className="col-sm-10">
                                        <AutocompleteDescripcion title="Diagnostico principal" handleDiagnostico ={this.handleDiagnostico} handleCodigoDiagnostico ={this.handleCodigoDiagnostico} handleCapituloDiagnostico ={this.handleCapituloDiagnostico} handleMaximosCie10 ={this.handleMaximosCie10} error={this.state.errors['diagnostico']} mensaje={this.state.errorMensajes['diagnostico']}/>
                                    </div>
                                    <div className="col-sm-2">
                                        <div className="form-group">
                                            <label htmlFor="lateralidad">Lateralidad</label>
                                            <select id="lateralidad" className="form-control" onChange={this.handleLateralidad}>
                                                <option value="0"></option>
                                                <option value="1">Derecha</option>
                                                <option value="2">Izquierda</option>
                                                <option value="3">Bilateral</option>
                                                <option value="4">No aplica</option>
                                            </select>
                                            <div className={this.state.errors['lateralidad']}>
                                                <div className={ "redf  " + ( this.state.errors['lateralidad'] || "") }>{this.state.errorMensajes['lateralidad']}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div> 
                                <div className="row">
                                    <div className="col-sm-10">
                                    <AutocompleteDescripcion title="Diagnóstico relacionado 1" handleDiagnostico ={this.handleDiagnostico1} handleCodigoDiagnostico ={this.handleCodigoDiagnostico1}  />
                                    </div>
                                    <div className="col-sm-2">
                                        <div className="form-group">
                                            <label htmlFor="lateralidad1">Lateralidad 1</label>
                                            <select id="lateralidad1" className="form-control" onChange={this.handleLateralidad1}>
                                                <option value="0"></option>
                                                <option value="1">Derecha</option>
                                                <option value="2">Izquierda</option>
                                                <option value="3">Bilateral</option>
                                                <option value="4">No aplica</option>
                                            </select>
                                           
                                        </div>
                                    </div>
                                </div> 
                                <div className="row">
                                    <div className="col-sm-10">
                                    <AutocompleteDescripcion title="Diagnóstico relacionado 2" handleDiagnostico ={this.handleDiagnostico2} handleCodigoDiagnostico ={this.handleCodigoDiagnostico2}  />
                                    </div>
                                    <div className="col-sm-2">
                                        <div className="form-group">
                                            <label htmlFor="lateralidad2">Lateralidad 2</label>
                                            <select id="lateralidad2" className="form-control" onChange={this.handleLateralidad2}>
                                                <option value="0"></option>
                                                <option value="1">Derecha</option>
                                                <option value="2">Izquierda</option>
                                                <option value="3">Bilateral</option>
                                                <option value="4">No aplica</option>
                                            </select>
    
                                        </div>
                                    </div>
                                </div> 
                                <div className="row">
                                    <div className="col-sm-10">
                                    <AutocompleteDescripcion title="Diagnóstico relacionado 3" handleDiagnostico ={this.handleDiagnostico3} handleCodigoDiagnostico ={this.handleCodigoDiagnostico3}  />
                                    </div>
                                    <div className="col-sm-2">
                                        <div className="form-group">
                                            <label htmlFor="lateralidad3">Lateralidad 3</label>
                                            <select id="lateralidad3" className="form-control" onChange={this.handleLateralidad3}>
                                                <option value="0"></option>
                                                <option value="1">Derecha</option>
                                                <option value="2">Izquierda</option>
                                                <option value="3">Bilateral</option>
                                                <option value="4">No aplica</option>
                                            </select>
                                           
                                        </div>
                                    </div>
                                </div> 
                                <div className="row">
                                    
                                    <div className="col-sm-4">
                                        <div className="form-group">
                                            <label htmlFor="fechaInicioIncapacidad">Fecha inicio incapacidad</label>
                                            <input type="date" id="fechaInicioIncapacidad" className="form-control" value={this.state.fechaInicioIncapacidad} onChange={this.handleFechaInicioIncapacidad} />
                                        </div>
                                    </div>
                                    <div className="col-sm-2">
                                        <div className="form-group">
                                            <label htmlFor="diasSolicitados">Dias solicitados</label>
                                            <input type="number" min='0' id="diasSolicitados" className="form-control" onChange={this.handleDiasSolicitados} value={this.state.diasSolicitados} onKeyUp={this.handleFechaFin} onClick={this.handleFechaFin}/>
                                            <div className={this.state.errors['diasSolicitados']}>
                                                <div className={ "redf  " + ( this.state.errors['diasSolicitados'] || "") }>{this.state.errorMensajes['diasSolicitados']}</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-sm-2">
                                        <div className="form-group">
                                            <label htmlFor="diasReconocidos">Dias reconocidos</label>
                                            <input type="number" id="diasReconocidos" className="form-control" value={this.state.diasReconocidos} readOnly/>
                                        </div>
                                    </div>
                                    <div className="col-sm-4">
                                        <div className="form-group">
                                            <label htmlFor="fechaFinIncapacidad">Fecha fin incapacidad</label>
                                            <input type="date" id="fechaFinIncapacidad" className="form-control" value={this.state.fechaFinIncapacidad} onSelect ={this.handleFechaFin} readOnly/>
                                        </div>
                                    </div>
                                </div>  
                                <div className="row">
                                    <div className="col-sm-3">
                                        <div className="form-group">
                                            <label htmlFor="contingenciaOrigen">Contingencia origen</label>
                                            <select id="contingenciaOrigen" className="form-control" onChange={this.handleContingencia} value={ this.state.contingencia}>
                                                <option value=""></option> 
                                                <option value="1">Enfermedad general</option>
                                                <option value="2">Enfermedad laboral</option>
                                                <option value="3">Accidente de trabajo</option>
                                            </select>
                                            <div className={this.state.errors['contingencia']}>
                                            <div className={ "redf  " + ( this.state.errors['contingencia'] || "") }>{this.state.errorMensajes['contingencia']}</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-sm-2">
                                        <div className="form-group">
                                            <label htmlFor="prorroga">Prórroga</label>
                                            <select id="prorroga" className="form-control" onChange={ this.handleProrroga} value={ this.state.prorroga} readOnly disabled>
                                                <option value="No">No</option>
                                                <option value="Si">Si</option>
                                               
                                                
                                            </select>
                                        </div>
                                    </div>
                                    <div className="col-sm-3">
                                        <div className="form-group">
                                            <label htmlFor="diasAcumuladosPrevios">Días acumulados previos</label>
                                            <input type="number" id="diasAcumuladosPrevios" className="form-control"  value={this.state.diasAcumuladosPrevios} readOnly/>
                                        </div>
                                    </div>
                                    
                                    <div className="col-sm-4">
                                        <div className="form-group">
                                            <label htmlFor="diasAcumuladosUltimaIncpacidad">Días acumulados última incapacidad</label>
                                            <input type="number" id="diasAcumuladosUltimaIncapacidad" className="form-control"  value={this.state.diasAcumuladosUltima} readOnly/>
                                        </div>
                                    </div>
                                </div>  
                                <div className="row">
                                    <div className="col-sm-12">
                                        <div className="form-group">
                                            <label htmlFor="observacionMedica">Resumen observacion médico</label>
                                            <textarea rows="10" className="form-control" id="observacionMedica" onChange={this.handleObservacion} value={  this.state.observacion}>
                                           
                                            </textarea>
                                        </div>
                                    </div>
                                </div>
                        </div>
                    </div>
                </div>
            </div>
            </div>
            <br/>
            <div className={this.state.visible}>
                <div className="row justify-content-center">
                    <div className="col-md-10">
                        <button className="btn btn-block btn-success" onClick={this.guardarIncapacidad}>GUARDAR INCAPACIDAD</button>
                    </div>
                </div>
            </div>

            <div className={this.state.visible}>
            <div className="row justify-content-center">
                <div className="col-md-10">
                    <div className="card">
                        <div className="card-header bg2 titulo">Datos del aportante</div>
        
                        <div className="card-body texto">
                                { this.renderAportantes()}
                                
                        </div>
                    </div>
                </div>
               
            </div>
            </div>
            <br />
            
           
        
        </div>
       
    

        );
    }
}
export default IncapacidadFront;

if (document.getElementById('root')) {
    ReactDOM.render(<IncapacidadFront />, document.getElementById('root'));
}