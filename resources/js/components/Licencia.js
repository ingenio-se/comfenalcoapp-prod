import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Mensaje from './Mensaje';
import Comboips from './Comboips.js';
import Combocausae from './Combocausae.js';
import Medico from './Medico.js';
import AutocompleteDescripcion from './AutocompleteDescripcion.js';
import AutocompleteDescripcionL from './AutocompleteDescripcionL.js';
import ValidacionDerechos from './ValidacionDerechos';
import { size } from 'lodash';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


class LicenciaFront extends Component {
    constructor(props) {
        super(props);

        let today = new Date();
        let dd = today.getDate();
        let mm = today.getMonth() + 1;
        const yyyy = today.getFullYear();
        if (dd < 10) {
            dd = `0${dd}`;
        }
        if (mm < 10) {
            mm = `0${mm}`;
        }
        today = `${yyyy}-${mm}-${dd}`;
        this.state = {
            tipoDocumento: '',
            numeroIdentificacion: '',
            nombreCompleto: '',
            tipoDocAfiliado: '',
            IDTrabajador: '',
            historiaClinica: '',
            genero: '',
            estado: '',
            tipoCotizante: '',
            mensaje: '',
            tipoMensaje: '',
            loading: false,
            fechaAtencion: today,
            fechaInicioLicencia: today,
            diasSolicitados: 0,
            diasSugerencia:'', 
            diasMaximosCie10: 0,
            diasMaximosEspecialidad: 0,
            fechaFinLicencia: today,
            diasReconocidos: 0,
            causae: '15',
            tipoAtencion:'',

            semanasGestacion:0,
            diasGestacion:0,
            diasGestacionC:0,
            nacidoViable:0,
            nacidoViableState:true,
            fechaProbableState:'oculto',
            partoMultiple:'',


            tipoLicencia:'0',
            
            contingencia: '1',
            tipoDocAportante: '',
            numDocAportante: '',
            nombreAportante: '',
            observacion: '-',
            observacion_estado: '',
            diagnostico: '',
            codigoDiagnostico: '',
            diagnostico1: '',
            codigoDiagnostico1: '',
            diagnostico2: '',
            codigoDiagnostico2: '',
            diagnostico3: '',
            codigoDiagnostico3: '',

            capitulo: '',
            id: '00001',
            prorrogaId: 0,
            tipoPrestador: '',
            ips_id: 0,
            medico_id: 0,
            visible: 'oculto',
            estado_id: 2,
            errors: {
                diagnostico: 'oculto',
                tipoPrestador: 'oculto',
                ips: 'oculto',
                causae: 'oculto',
                tipoAtencion: 'oculto',
                tipoLicencia: 'oculto',
                diasSolicitados: 'oculto',
                contingencia: 'oculto'
            },
            errorMensajes: {
                diagnostico: '',
                tipoPrestador: '',
                ips: '',
                causae: '',
                tipoAtencion: '',
                tipoLicencia:'',
                diasSolicitados: '',
                contingencia: ''
            },
            validaciones : [],
            cronico :{
                consec :'',
                visible :'visible',
                alarmas: [],
            },
            flagCertificado: 'disabled'

        };
        this.initialState = { ...this.state }

        // bind

        this.handleSubmit = this.handleSubmit.bind(this);
        this.getNumeroLicencia = this.getNumeroLicencia.bind(this);
        this.handleChange=this.handleChange.bind(this);

        this.handleMedico = this.handleMedico.bind(this);
        this.handleMaxDias = this.handleMaxDias.bind(this);
        this.handlePrestador = this.handlePrestador.bind(this);
        this.handleIpsChange = this.handleIpsChange.bind(this);
        this.buscarHistorico = this.buscarHistorico.bind(this);
        this.handleFechaInicioLicencia = this.handleFechaInicioLicencia.bind(this);
        this.diasGestacionC = this.diasGestacionC.bind(this);
        this.partoMultiple = this.partoMultiple.bind(this);
        this.validartipoLicencia = this.validartipoLicencia.bind(this);
        this.seleccionartipoLicencia = this.seleccionartipoLicencia.bind(this);
        this.handleFechaFin = this.handleFechaFin.bind(this);
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
        this.guardarLicencia = this.guardarLicencia.bind(this);

        this.activarGeneracion=this.activarGeneracion.bind(this);
        this.renderAfiliaciones=this.renderAfiliaciones.bind(this);
        this.renderAportantes=this.renderAportantes.bind(this);
        this.generarCertificado=this.generarCertificado.bind(this);
        this.handleToast = this.handleToast.bind(this);

        /*
        this.handlePrestador = this.handlePrestador.bind(this);
        
        this.handleMedico = this.handleMedico.bind(this);
        this.handleLateralidad = this.handleLateralidad.bind(this);
        this.handleProrroga = this.handleProrroga.bind(this);
        this.showMessage = this.showMessage(this)

        
        this.buscarHistorico = this.buscarHistorico.bind(this);
        this.handleFechaAtencion = this.handleFechaAtencion.bind(this);
        this.validarForm = this.validarForm.bind(this);
        this.clearErrors = this.clearErrors.bind(this);
        this.reviewProrroga = this.reviewProrroga.bind(this);

        this.handleMaxDias = this.handleMaxDias.bind(this);
        */
    }

    async getNumeroLicencia() {
        let url = 'getNumeroLicencia'
        axios.get(url)
            .then(resp => {
                this.setState({
                    id: `0000${resp.data.data}`,
                    prorrogaId: 0,
                });
                return;
            })
            .catch(err => {
                console.log(err)
            })
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
            autoClose: 2500,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        });
    }

    generarCertificado(a){
        let id=this.state.id;
        let pid= this.state.prorrogaId;
        //let id=1;
        let url = '/certificadoLicencia/'+id+"/"+a;
        window.open(url,"_blank");
    }
    activarGeneracion(incapacidades,response,afiliaciones){
        let mensaje = response.data.responseMessageOut.body.response.validadorResponse.Derechos['MENSAJE'];
        console.log(incapacidades);
       // mensaje = utf8_decode(mensaje)
        if (incapacidades.includes(1,0)){
                
            this.getNumeroLicencia()       
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
                // console.log('target response: ', response);

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
                        for (var i = 0; i < size(afiliaciones); i++) {
                            if (incapacidades[i] == 0) {
                                afiliaciones[i]["Incapacidad"] = "NO"
                            }
                            if (incapacidades[i] == 1) {
                                afiliaciones[i]["Incapacidad"] = "SI"
                                if (aportantes==""){
                                    if (afiliaciones[i]["IDEmpresa"]!='N/A'){
                                        aportantes=afiliaciones[i]["NombreEmpresa"];
                                    }
                                    else{
                                        aportantes="afiliado";
                                    }
                                }
                                else{
                                    if (afiliaciones[i]["IDEmpresa"]!='N/A'){
                                        aportantes=aportantes+";"+afiliaciones[i]["NombreEmpresa"];
                                    }
                                    else{
                                        aportantes=aportantes+";afiliado";
                                    }
                                }
                            }
                        }
                        this.setState({
                            validaciones: afiliaciones,
                            aportantes: aportantes
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
                this.setState({
                    cronico: resp.data.data,
                });
                if (this.state.visible != 'oculto'){
                    this.setState({
                        visible:resp.data.data.visible,
                    });
                }
            })
            .catch(err => {
                console.log(err)
            })
        
    }
    handleChange({ target }) {
        
        this.setState({
          [target.name]: target.value
        },  () => {
            if (target.name == "tipoAtencion"){
                if (target.value == 1){
                    this.setState({
                        nacidoViableState: false
                      });
                }
                else{
                    this.setState({
                        nacidoViableState: true
                      });
                }
                
            }
            if (target.name == "tipoLicencia"){
               
                if (target.value == 15){
                    this.setState({
                        fechaProbableState: 'visible', 
                        diasSolicitados: 7,
                      });
                    // alert("Los días solicitados pueden ser 7 o 14 días")
                    this.handleToast("Los días solicitados pueden ser 7 o 14 días",'warning');
                }
                else{
                    this.setState({
                        fechaProbableState: 'oculto'
                      });
                }
                this.validartipoLicencia(target.value)
            }
            
            if ((target.name == "tipoAtencion")||(target.name == "nacidoViable")){
                this.seleccionartipoLicencia();
            }
           
          
            
        });
       
        
    }
    seleccionartipoLicencia(){
        let tipoAtencion = this.state.tipoAtencion;
        let edadG = this.state.diasGestacionC;
        let rnv = parseInt(this.state.nacidoViable);

        console.log("Atencion:"+tipoAtencion);
        console.log("EdadG:"+edadG);
        console.log("rnv:"+rnv);

        let band = false;

        if ( (tipoAtencion =="1") && (edadG >= 266) && (rnv ==1)){
            this.setState({
                diasSolicitados: 126,
                tipoLicencia: "1"
            });
            band=true;
            
        }
        else if ((tipoAtencion =="2" || tipoAtencion=="3")){
            // alert("Puede escoger 14 o 28 días máximo")
             this.setState({
                 diasSolicitados: 14,
                 tipoLicencia: "2"
             });
             band=true;
        }
        else if ((tipoAtencion =="1") && (edadG < 266) && (rnv ==1)){
            var dias = 126 + (280-edadG)
            this.setState({
                diasSolicitados: dias,
                tipoLicencia: "4"
            });
            band=true;
        }
        else if ((tipoAtencion =="1") && (edadG >= 266) && (rnv >=2)){
            this.setState({
                diasSolicitados: 140,
                tipoLicencia: "5"
            });
            band=true;
        }
        else if ((tipoAtencion =="1") && (edadG < 266) && (rnv>=2)){
            var dias = 126 + (280-edadG) + 14
            this.setState({
                diasSolicitados: dias,
                tipoLicencia: "6"
            });
            band=true;
        }
        else if( tipoAtencion=="1" && rnv == 0){
            //alert("Puede escoger 14 o 28 días máximo")
            this.setState({
                diasSolicitados: 14,
                tipoLicencia: "2"
            });
            band=true;
        }
        else{
            
            this.setState({
                tipoLicencia:'',
                diasSolicitados: 0
            });
        }
        console.log(this.state.tipoLicencia)
       

    }
    validartipoLicencia(tipoLicencia){
        //let tipoLicencia = this.state.tipoLicencia;
        let tipoAtencion = this.state.tipoAtencion;
        let edadG = this.state.diasGestacionC;
        let rnv = parseInt(this.state.nacidoViable);

        let band = false;

        /*console.log(tipoLicencia)
        console.log(tipoAtencion)
        console.log(edadG)
        console.log(rnv)*/

        if ((tipoLicencia =="1") && (tipoAtencion =="1") && (edadG >= 266) && (rnv ==1)){
            this.setState({
                diasSolicitados: 126
            });
            band=true;
        }
        else if ((tipoLicencia == "2" && (tipoAtencion =="2" || tipoAtencion=="3"))|| (tipoLicencia == "2" && tipoAtencion=="1" && rnv == 0)){
            // alert("Puede escoger 14 o 28 días máximo")
            this.handleToast("Puede escoger 14 o 28 días máximo",'warning');
            this.setState({
                diasSolicitados: 14
            });
            band=true;
        }
        else if ((tipoLicencia =="4") && (tipoAtencion =="1") && (edadG < 266) && (rnv ==1)){
            var dias = 126 + (280-edadG)
            this.setState({
                diasSolicitados: dias
            });
            band=true;
        }
        else if ((tipoLicencia =="5") && (tipoAtencion =="1") && (edadG >= 266) && (rnv >=2)){
            this.setState({
                diasSolicitados: 140
            });
            band=true;
        }
        else if ((tipoLicencia =="6") && (tipoAtencion =="1") && (edadG < 266) && (rnv>=2)){
            var dias = 126 + (280-edadG) + 14
            this.setState({
                diasSolicitados: dias
            });
            band=true;
        }
        
        if (tipoLicencia == "3" && this.state.medico_id !=0){
            // alert("Esta licencia NO la generan los médicos, es administrativa por solicitud del aportante.")
            this.handleToast("Esta licencia NO la generan los médicos, es administrativa por solicitud del aportante.",'warning');
        }
        if (tipoLicencia == "10" && this.state.medico_id !=0){
            // alert("La licencia se da al padre, se resuelve por via administrativa no la generan los medicos. Solicitar ante la EPS")
            this.handleToast("La licencia se da al padre, se resuelve por via administrativa no la generan los medicos. Solicitar ante la EPS",'warning');
        }
        if (tipoLicencia == "12"  || tipoLicencia == "13" || tipoLicencia == "14"  ){
            // alert("La licencia la da la EPS. Se resuelve por via administrativa. Se debe mostrar aviso para solicitar ante la EPS")
            this.handleToast("La licencia la da la EPS. Se resuelve por via administrativa. Se debe mostrar aviso para solicitar ante la EPS",'warning');
        }
        if (tipoLicencia == "15"  ){
            band=true
        }
        if (band == false){
            // alert("No cumple las condiciones para este tipo de licencia")
            this.handleToast("No cumple las condiciones para este tipo de licencia",'warning');
            this.setState({
                tipoLicencia:'',
                diasSolicitados: 0
            });
        }

    }
    partoMultiple(){
        let cantidad = parseInt(this.state.nacidoViable);
        if (cantidad > 1){
            this.setState({
                partoMultiple: 'checked'
              });
        }
        else{
            this.setState({
                partoMultiple: ''
              });
        }

    }
    diasGestacionC(){
        let semanas = parseInt(this.state.semanasGestacion);
        let dias = parseInt(this.state.diasGestacion);
        let calculado = parseInt((semanas * 7) + dias);
        //console.log(calculado);
        this.setState({
            diasGestacionC: calculado
        }, () => {
            this.seleccionartipoLicencia();
        });
        
    }
    
    //diagnosticos 
    handleDiagnostico(dato) {
        this.setState({ diagnostico: dato })
    }
    handleCodigoDiagnostico(dato) {
        console.log(dato);
        this.setState({ codigoDiagnostico: dato })
    }
    handleDiagnostico1(dato) {
        this.setState({ diagnostico1: dato })
    }
    handleCodigoDiagnostico1(dato) {
        this.setState({ codigoDiagnostico1: dato })
    }
    handleDiagnostico2(dato) {
        this.setState({ diagnostico2: dato })
    }
    handleCodigoDiagnostico2(dato) {
        this.setState({ codigoDiagnostico2: dato })
    }
    handleDiagnostico3(dato) {
        this.setState({ diagnostico3: dato })
    }
    handleCodigoDiagnostico3(dato) {
        this.setState({ codigoDiagnostico3: dato })
    }
    handleCapituloDiagnostico(dato) {
        this.setState({ capitulo: dato })
    }
    handleMaximosCie10(dato) {
        this.setState({ diasMaximosCie10: dato })
    }
    
    
    handleFechaInicioLicencia(e) {
        //var todayDate = new Date().toISOString().slice(0,10);
        let fi = new Date(e.target.value).getTime();

        let l1 = new Date(this.state.fechaAtencion);
        let l2 = new Date(this.state.fechaAtencion);

        l1 = new Date(l1.setTime(l1.getTime() + 30 * 86400000)).getTime()
        l2 = new Date(l2.setTime(l2.getTime() - 30 * 86400000)).getTime()

        this.setState({
            fechaInicioLicencia: new Date(e.target.value).toISOString().slice(0, 10),
        });
        /*
        if (fi > l1) {
            alert("La fecha de inicio es mayor a 30  días desde la fecha de atención. Debe justificarlo en observacion")
            this.setState({
                fechaInicioIncapacidad: new Date().toISOString().slice(0, 10)
            });
        }
        */
        if (fi < l2) {
            // alert("La fecha de inicio no puede ser menor a 30 días desde la fecha de atención. Debe justificarlo en observacion")
            this.handleToast("La fecha de inicio no puede ser menor a 30 días desde la fecha de atención. Debe justificarlo en observacion",'warning');
            this.setState({
                fechaInicioIncapacidad: new Date().toISOString().slice(0, 10),
            });
        }

    }
    handleDiasSolicitados(e) {
        this.setState({
            diasSolicitados: e.target.value,
        })
        //console.log(this.state.diasSolicitados);
        //console.log(this.state.diasMaximosCie10);

        let observacion_estado = this.state.observacion_estado;
        let observacion = "Dias solicitados mayor a especificado por Cie10"

        if (this.state.diasSolicitados > this.state.diasMaximosCie10) {
            this.setState({
                estado_id: 1,
                observacion_estado: `${observacion_estado} ${observacion}`,
            })
        }
    }
    handleFechaFin() {
        let l1 = new Date(this.state.fechaInicioLicencia);
        let dias = this.state.diasSolicitados - 1;
        l1 = new Date(l1.setTime(l1.getTime() + dias * 86400000)).getTime()
        this.setState({
            fechaFinLicencia: new Date(l1).toISOString().slice(0, 10),
        });
        //this.getBusinessDatesCount(new Date(this.state.fechaInicioIncapacidad), new Date(l1))

        //this.reviewProrroga()
    }
    handleCausa(e) {
        console.log(e);
        this.setState({
            causae: e,
        });

        /*
        if (e == 1) {
            this.setState({
                contingencia: 3,
            });
        }
        if (e == 9) {
            this.setState({
                contingencia: 2,
            });
        }
        if (e == 15) {
            this.setState({
                contingencia: 1,
            });
        }*/
    }
    
    handlePrestador(dato) {
        this.setState(
            { tipoPrestador: dato }
        )
    }
    handleIpsChange(dato) {
        this.setState(
            { ips_id: dato }
        )
    }
    handleMedico(dato) {
        this.setState(
            { medico_id: dato }
        )
    }
    handleMaxDias(dato) {
        this.setState({
            diasMaximosEspecialidad: dato
        });
    }
    handleContingencia(e) {
        // console.log(e.target.value);
        this.setState({
            contingencia: e.target.value,
        });
        var contingencia = e.target.value;
        var causae = this.state.causae
        if ((contingencia == 2 || contingencia == 3) && (causae != 1 && causae != 14)) {
            // alert("la causa externa solo puede ser Accidente de trabajo o Enfermedad laboral")
            this.handleToast("la causa externa solo puede ser Accidente de trabajo o Enfermedad laboral",'warning');
            this.setState({
                causae: '',
            });
        }
    }
    getBusinessDatesCount(startDate, endDate) {
        //var startDate = new Date(startDate);
        //var endDate = new Date(endDate);   
        //console.log(endDate.toISOString().slice(0,10))    
        var count = 0;
        var countf = 0;
        var festivos = ["2020-05-01", "2020-05-25", "2020-06-15", "2020-06-22", "2020-06-29", "2020-07-20", "2020-08-07", "2020-08-17", "2020-10-12", "2020-11-02", "2020-11-16", "2020-12-08", "2020-12-25"];
        var curDate = startDate;
        while (curDate <= endDate) {
            var dayOfWeek = curDate.getDay();
            //console.log(curDate.toISOString().slice(0,10) + " " + dayOfWeek);
            if (dayOfWeek < 6)
                count++;
            //console.log(count + " "+ countf)
            if (festivos.includes(curDate.toISOString().slice(0, 10)))
                countf++;

            curDate.setDate(curDate.getDate() + 1);
        }
        console.log(count);
        console.log(countf);
        var reconocidos = count - countf;
        this.setState({
            diasReconocidos: reconocidos
        });
    }
    guardarLicencia({target}) {
        target.disabled = true;
        //console.log(this.state)
        //console.log(parseInt(this.state.diasSolicitados));
        //let resp = this.validarForm()
        if (this.state.fechaInicioLicencia == this.state.fechaFinLicencia){
            // alert("Verifique la fecha fin de licencia ")
            this.handleToast("Verifique la fecha fin de licencia ",'warning');
            setTimeout(target.disabled = false, 3000);
        }
        else{
            let resp = this.validarForm()

            if (resp) {
                let url = 'saveLicencia'
                    axios.post(url, { datos: this.state })
                        .then(resp => {
                            console.log(resp.data)
                            // alert(resp.data)
                            //this.setState(this.initialState);
                            //location.reload();
                            this.handleToast(resp.data,'success');
                            setTimeout(target.disabled = false,1500);
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
            else {
                // alert("Hay errores en algunos campos");
                this.handleToast("Hay errores en algunos campos",'error');
                setTimeout(target.disabled = false,1500);
            }
        }
        /*
        if (parseInt(this.state.diasSolicitados) <= this.state.diasMaximosEspecialidad) {
            let resp = this.validarForm()

            if (resp) {

                //alert(this.state.id);

                let url = 'saveIncapacidad'
                axios.post(url, { datos: this.state })
                    .then(resp => {
                        console.log(resp.data)
                        alert(resp.data)
                        this.setState(this.initialState);
                        location.reload();
                    })
                    .catch(err => {
                        console.log(err)
                    })

            }
            else {
                alert("Hay errores en algunos campos");
            }
        }
        else {
            alert("Los días solicitados exceden el máximo definido para su especialidad médica");
        }

        */
    }
    async validarForm() {
        this.clearErrors()

        let resp = true;

        //Auditoria
        if (this.state.diasSolicitados > this.state.diasMaximosCie10) {
            this.setState({
                estado_id: 1
            })
        }
        /*
        if (this.state.diasSolicitados > this.state.diasMaximosEspecialidad) {
            this.setState({
                estado_id: 1
            })
        }*/

        let newState = Object.assign({}, this.state);
        if (this.state.tipoPrestador == '') {
            newState.errors.tipoPrestador = "visible";
            newState.errorMensajes.tipoPrestador = "Tipo de prestador requerido";
            resp = false;
        }
        if ((this.state.tipoPrestador == 1) && (this.state.ips_id == 0)) {
            newState.errors.ips = "visible";
            newState.errorMensajes.ips = "IPS requerida";
            resp = false;
        }
        if (this.state.causae == 0) {
            newState.errors.causae = "visible";
            newState.errorMensajes.causae = "Causa externa requerida";
            resp = false;
        }
        /*if (this.state.lateralidad_id == 0) {
            newState.errors.lateralidad = "visible";
            newState.errorMensajes.lateralidad = "Lateralidad requerida";
            resp = false;
        }*/
        if (this.state.diagnostico == '') {
            newState.errors.diagnostico = "visible";
            newState.errorMensajes.diagnostico = "Diagnóstico requerido";
            resp = false;
        }
        if (this.state.diasSolicitados == 0) {
            newState.errors.diasSolicitados = "visible";
            newState.errorMensajes.diasSolicitados = "Días debe ser mayor a 0";
            resp = false;
        }
        if (this.state.contingencia == 0) {
            newState.errors.contingencia = "visible";
            newState.errorMensajes.contingencia = "Contingencia requerida";
            resp = false;
        }
        if (this.state.tipoAtencion == '') {
            newState.errors.tipoAtencion = "visible";
            newState.errorMensajes.tipoAtencion = "Tipo de atención requerida";
            resp = false;
        }
        if (this.state.tipoLicencia == '0') {
            newState.errors.tipoLicencia = "visible";
            newState.errorMensajes.tipoLicencia = "Tipo de licencia requerida";
            resp = false;
        }
        this.setState(newState);

       
        await this.getNumeroLicencia();
    

        return resp;

    }
    clearErrors() {
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
    buscarHistorico() {

        let tipoDocumento = this.state.tipoDocumento;
        let numeroIdentificacion = this.state.numeroIdentificacion;
        let url = '/buscarHistorico/' + tipoDocumento + "/" + numeroIdentificacion;
        window.open(url, "_blank");
        /*
        axios.get(url)
            .then(resp => {
               console.log(resp.data.respuesta)

            })
            .catch(err =>{
                console.log(err)
            })*/
    }
    showMessage(m) {
        return (<div className="alert alert-success" role="alert">{m}</div>);
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
        console.log(validaciones);
        
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
        let mensaje = <div></div>;
        let mensaje2 =<div></div>;
        if (this.state.loading) {
            if (this.state.tipoMensaje == 'success') {
                mensaje = (<div className="alert alert-success reco" role="alert">
                    {this.state.mensaje}
                </div>);

            }
            if (this.state.tipoMensaje == 'error') {
                mensaje = (<div className="alert alert-danger reco" role="alert">
                    {this.state.mensaje}
                </div>);
            }
        }
        if(this.state.cronico.consec != 0){
            mensaje2 = (<div className="alert alert-warning reco" role="alert">
            El usuario se encuentra registrado en la base de seguimiento por ICP <a href={ 'verCronico/' + this.state.cronico.consec } target="_blank">Ver detalle</a>
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
            <div className="container">
                <ToastContainer/>
                <div className="row justify-content-center">
                    <div className="col-md-10">
                        <div className="card">

                            <div className="card-header verde3 titulo">Validación de derechos - Licencias</div>

                            <div className="card-body texto">
                                <form onSubmit={this.handleSubmit}>
                                    <div className="row">
                                        <div className="col-sm-4">
                                            <label htmlFor="tipoDocumento">Tipo documento</label>
                                            <select className="form-control" name="tipoDocumento" onChange={this.handleChange} value={this.state.tipoDocumento}>
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
                                            <label htmlFor="numeroIdentificacion">Número de identificación</label>
                                            <input type="text" name="numeroIdentificacion" className="form-control" onChange={this.handleChange} value={this.state.numeroIdentificacion} />
                                        </div>
                                        <div className="col-sm-4">
                                            <br />
                                            <input type="submit" id="btnBuscar" className="btn btn-primary" value="Buscar" />
                                        </div>
                                    </div>

                                </form>
                            </div>
                        </div>
                    </div>
                </div>
                <br />


                {mensaje}

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
                                                <input type="text" className="form-control texto " defaultValue={this.state.tipoDocAfiliado} readOnly />
                                            </div>
                                        </div>

                                        <div className="col-sm-3">
                                            <div className="form-group">
                                                <label htmlFor="numeroIdentificacion">Número de identificacion</label>
                                                <input type="text" className="form-control texto" defaultValue={this.state.IDTrabajador} readOnly />
                                            </div>
                                        </div>
                                        <div className="col-sm-6">
                                            <div className="form-group">
                                                <label htmlFor="nombreAfiliado">Nombre completo</label>
                                                <input type="text" id="nombreAfiliado" className="form-control texto" defaultValue={this.state.nombreCompleto} readOnly />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row">

                                        <div className="col-sm-3">
                                            <div className="form-group">
                                                <label htmlFor="historiaClinica">Numero de historia clínica</label>
                                                <input type="text" id="historiaClinica" className="form-control texto" defaultValue={this.state.historiaClinica} readOnly />
                                            </div>
                                        </div>

                                        <div className="col-sm-1">
                                            <div className="form-group">
                                                <label htmlFor="genero">Género</label>
                                                <input type="text" id="genero" className="form-control texto" defaultValue={this.state.genero} readOnly />
                                            </div>
                                        </div>
                                        <div className="col-sm-4">
                                            <div className="form-group">
                                                <label htmlFor="estado">Estado</label>
                                                <input type="text" id="estado" className="form-control texto" defaultValue={this.state.estado} readOnly />
                                            </div>
                                        </div>
                                        <div className="col-sm-4">
                                            <div className="form-group">
                                                <label htmlFor="tipoCotizante">Tipo de cotizante</label>
                                                <input type="text" id="tipoCotizante" className="form-control texto" defaultValue={this.state.tipoCotizante} readOnly />
                                            </div>
                                        </div>
                                        <div className="col-sm-4">
                                            <div className="form-group">
                                                <label htmlFor="tipoCotizante">Descripción programa</label>
                                                <input type="text" id="descripcionPrograma" className="form-control texto" defaultValue={this.state.descripcionPrograma} readOnly />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <br />

                <div className={this.state.visible}>
                    <div className="row justify-content-center">
                        <div className="col-md-10">
                            <div className="card">
                                <div className="card-header bg2 titulo">Datos de la IPS / Médico</div>

                                <div className="card-body texto">

                                    <Comboips handleIpsChange={this.handleIpsChange} handlePrestador={this.handlePrestador} valor={this.state.ips_id} error={this.state.errors['tipoPrestador']} mensaje={this.state.errorMensajes['tipoPrestador']} errorIps={this.state.errors['ips']} mensajeIps={this.state.errorMensajes['ips']} />
                                    <Medico handleMedico={this.handleMedico} handleMaxDias={this.handleMaxDias} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <br />

                <div className={this.state.visible}>
                    <div className="row justify-content-center">
                        <div className="col-md-10">
                            <div className="card">
                                <div className="card-header bg2 titulo">Información de la licencia</div>

                                <div className="card-body texto">
                                    <div className="row">
                                        <div className="col-sm-4">
                                            <div className="form-group">
                                                <button className="btn btn-primary" onClick={this.buscarHistorico}>Histórico incapacidades</button>
                                            </div>
                                        </div>
                                        <div className="col-sm-4">
                                            <div className="form-group">
                                                <div className="form-group">
                                                    <label htmlFor="contingenciaOrigen">Contingencia origen</label>
                                                    <select id="contingenciaOrigen" className="form-control texto" onChange={this.handleChange} value={this.state.contingencia}>
                                                        <option value="1">Licencia</option>
                                                    </select>
                                                    <div className={this.state.errors['contingencia']}>
                                                        <div className={"redf  " + (this.state.errors['contingencia'] || "")}>{this.state.errorMensajes['contingencia']}</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-sm-4">
                                            <div className="form-group">
                                                <label htmlFor="numeroIncapacidad">Número de licencia</label>
                                                <input type="text" name="numeroLicencia" className="form-control texto" value={this.state.id + "-" + this.state.prorrogaId} readOnly />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-sm-4">
                                            <div className="form-group">
                                                <label htmlFor="fechaAtencion">Fecha de atención</label>
                                                <input type="date" name="fechaAtencion" className="form-control texto" defaultValue={this.state.fechaAtencion} onChange={this.handleChange} />
                                                <div className={this.state.errors['fechaAtencion']}>
                                                    <div className={"redf  " + (this.state.errors['fechaAtencion'] || "")}>{this.state.errorMensajes['fechaAtencion']}</div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-sm-4">
                                            <div className="form-group">
                                                <label htmlFor="fechaInicioLicencia">Fecha inicio licencia</label>
                                                <input type="date" name="fechaInicioLicencia" className="form-control texto" value={this.state.fechaInicioLicencia} onChange={this.handleFechaInicioLicencia} />
                                                <div className={this.state.errors['fechaInicioLicencia']}>
                                                    <div className={"redf  " + (this.state.errors['fechaInicioLicencia'] || "")}>{this.state.errorMensajes['fechaInicioLicencia']}</div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-sm-4">
                                            <Combocausae handleCausa={this.handleCausa} value={this.state.causae} error={this.state.errors['causae']} mensaje={this.state.errorMensajes['causae']} />
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-sm-3">
                                            <div className="form-group">
                                                <label htmlFor="tipoAtencion">Tipo atención</label>
                                                <select name="tipoAtencion" className="form-control texto" onChange={this.handleChange} value={this.state.tipoAtencion}>
                                                    <option value=""></option>
                                                    <option value="1">Vaginal/Cesárea</option>
                                                    <option value="2">Aborto</option>
                                                    <option value="3">Ectópico</option>
                                                </select>
                                                <div className={this.state.errors['tipoAtencion']}>
                                                    <div className={"redf  " + (this.state.errors['tipoAtencion'] || "")}>{this.state.errorMensajes['tipoAtencion']}</div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-sm-3">
                                            <div className="form-group">
                                                <label htmlFor="edadGestacional">Edad gestacional al parto Semanas</label>
                                                <input type="number" className="form-control texto" name="semanasGestacion" value={ this.state.semanasGestacion} onChange={this.handleChange} onKeyUp={this.diasGestacionC}/>
                                                <div className={this.state.errors['semanasGestacion']}>
                                                    <div className={"redf  " + (this.state.errors['semanasGestacion'] || "")}>{this.state.errorMensajes['contingencia']}</div>
                                                </div>
                                                Días<input type="number" className="form-control texto" name="diasGestacion" value={ this.state.diasGestacion} onChange={this.handleChange} onKeyUp={this.diasGestacionC}/>
                                            </div>
                                        </div>
                                        <div className="col-sm-3">
                                            <label htmlFor="edadGestacional">Días de gestación</label>
                                            <input type="number" className="form-control texto" name="diasGestacionC" value={ this.state.diasGestacionC} readOnly />
                                        </div>
                                        <div className="col-sm-3">
                                            <label htmlFor="nacidoViable">Recién nacido viable</label>
                                            <input type="number" className="form-control texto" min="0" max="9" name="nacidoViable" value={ this.state.nacidoViable} onChange={this.handleChange} disabled={this.state.nacidoViableState} onKeyUp={this.partoMultiple} onClick={this.partoMultiple}/>

                                            <label>
                                                Parto múltiple&nbsp;
                                                <input name="partoMultiple"
                                                    type="checkbox"
                                                    checked={this.state.partoMultiple}
                                                    readOnly
                                                />
                                            </label>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-sm-6">
                                            <label htmlFor="tipoLicencia">Tipo licencia</label>
                                            <select name="tipoLicencia" className="form-control texto" onChange={this.handleChange} value={this.state.tipoLicencia}>
                                                <option value=""></option>
                                                <option value="1">Maternidad Normal</option>
                                                <option value="2">Parto no viable</option> 	
                                                <option value="3">Paternidad</option>
                                                <option value="4">Parto prematuro</option>
                                                <option value="5">Parto normal múltiple</option>
                                                <option value="6">Parto prematuro múltiple</option>
                                                <option value="10">Fallecimiento de la madre</option>
                                                <option value="12">Fallo de tutela</option>
                                                <option value="13">Enfermedad materna grave</option>
                                                <option value="14">Adopción</option>
                                                <option value="15">Prelicencia en época de parto (anticipo)</option>

                                            </select>
                                            <div className={this.state.errors['tipoLicencia']}>
                                                <div className={"redf  " + (this.state.errors['tipoLicencia'] || "")}>{this.state.errorMensajes['tipoLicencia']}</div>
                                            </div>
                                        </div>
                                        <div className="col-sm-6">
                                           
                                                <div className={this.state.fechaProbableState}>
                                                    
                                                        <div className="form-group">
                                                            <label htmlFor="fechaProbable">Fecha probable de parto</label>
                                                            <input type="date" id="fechaProbable" className="form-control texto" defaultValue={this.state.fechaProbable} onChange={this.handlefechaProbable}  />
                                                            <div className={this.state.errors['fechaProbable']}>
                                                                <div className={"redf  " + (this.state.errors['fechaProbable'] || "")}>{this.state.errorMensajes['fechaProbable']}</div>
                                                            </div>
                                                        </div>
                                                  
                                                   
                                                        <label htmlFor="tipoLicencia">Soporte definición fecha probable parto</label>
                                                        <select id="soporte" className="form-control texto" onChange={this.handleChange} value={this.state.soporte}>
                                                            <option value=""></option>
                                                            <option value="1">Fecha última regla confiable</option>
                                                            <option value="2">Ecografía primer trimestre</option>
                                                        </select>
                                                        <div className={this.state.errors['soporte']}>
                                                            <div className={"redf  " + (this.state.errors['soporte'] || "")}>{this.state.errorMensajes['soporte']}</div>
                                                        </div>
                                                   
                                                </div>
                                            
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-sm-12">
                                            <AutocompleteDescripcionL licencia={this.state.tipoLicencia} title="Diagnostico principal" handleDiagnostico={this.handleDiagnostico} handleCodigoDiagnostico={this.handleCodigoDiagnostico} handleCapituloDiagnostico={this.handleCapituloDiagnostico} handleMaximosCie10={this.handleMaximosCie10} error={this.state.errors['diagnostico']} mensaje={this.state.errorMensajes['diagnostico']} />
                                        </div>
                                    </div>
                                    {/*
                                    <div className="row">
                                        <div className="col-sm-12">
                                            <AutocompleteDescripcion title="Diagnóstico relacionado 1" handleDiagnostico={this.handleDiagnostico1} handleCodigoDiagnostico={this.handleCodigoDiagnostico1} />
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-sm-12">
                                            <AutocompleteDescripcion title="Diagnóstico relacionado 2" handleDiagnostico={this.handleDiagnostico2} handleCodigoDiagnostico={this.handleCodigoDiagnostico2} />
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-sm-12">
                                            <AutocompleteDescripcion title="Diagnóstico relacionado 3" handleDiagnostico={this.handleDiagnostico3} handleCodigoDiagnostico={this.handleCodigoDiagnostico3} />
                                        </div>
                                    </div>
                                    */}
                                    <div className="row">
                                        <div className="col-sm-4">
                                            <div className="form-group">
                                                <label htmlFor="diasSolicitados">Dias solicitados</label>
                                                <input type="number" name="diasSolicitados" className="form-control texto" onChange={this.handleChange} value={this.state.diasSolicitados} />
                                                <div className={this.state.errors['diasSolicitados']}>
                                                    <div className={"redf  " + (this.state.errors['diasSolicitados'] || "")}>{this.state.errorMensajes['diasSolicitados']}</div>
                                                </div>
                                            </div>
                                        </div>  
                                        <div className="col-sm-4">
                                            <div className="form-group">
                                                <label htmlFor="fechaFinLicencia">Fecha fin licencia</label>
                                                <input type="date" id="fechaFinLicencia" className="form-control texto" value={this.state.fechaFinLicencia} onSelect={this.handleFechaFin} readOnly />
                                            </div>
                                        </div>  
                                    </div>
                                    <div className="row">
                                        <div className="col-sm-12">
                                            <div className="form-group">
                                                <label htmlFor="observacionMedica">Resumen observación médico</label>
                                                <textarea rows="10" className="form-control texto" name="observacion" onChange={this.handleChange}>
                                                    { this.state.observacion }
                                                </textarea>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <br />

                <div className={this.state.visible}>
                    <div className="row justify-content-center">
                        <div className="col-md-10">
                            <button className="btn btn-block btn-success" onClick={this.guardarLicencia}>GUARDAR LICENCIA</button>
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
export default LicenciaFront;

if (document.getElementById('rootl')) {
    ReactDOM.render(<LicenciaFront />, document.getElementById('rootl'));
}