import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import TableCronicos from './TableCronicos.js';
import { size } from 'lodash';
import axios from 'axios';
import { countBy } from 'lodash';



class CronicoTab3 extends Component {
    constructor(props) {
        super(props);
       // console.log(props)
        this.state = {
            id: props.id,
            enable:props.enable,
            cronico:{},
            fp:[],
            estados: ['CERRADO', 'SEGUIMIENTO', 'REVISION'],
            motivos: ['FALLECIDO', 'IPP', 'NUEVO', 'PENSIONADO', 'REINTEGRADO', 'RETIRADO', 'SEGUIMIENTO', 'TRAMITE DE PENSION'],
        }
        // bind
        
        this.handleChange = this.handleChange.bind(this);
        this.getCronico = this.getCronico.bind(this);
        this.calcularfp = this.calcularfp.bind(this);
        this.guardarCronico = this.guardarCronico.bind(this);
        this.getCronico()
    }
    guardarCronico({target}){
        target.disabled = true;
        let url = '';
        if(this.state.id != 0) {
            url = '/updateCronico';
        } else {
            url = '/addCronico';
        }
        axios.post(url, { datos: this.props.data })
        .then(resp => {
            console.log(resp.data);
            this.props.showToast(resp.data,'success');
            setTimeout(()=>window.location.reload(),300);
            this.state.id == 0 ? window.history.back() : null; 
        })
        .catch(err => {
            this.props.showToast(err,'error');
        })
    }
    getCronico() {
        if(this.state.id != 0) {
            let url = '/getCronico/'+this.state.id
            axios.get(url)
                .then(resp => {
                    console.log(resp.data.data);
                    this.setState({
                        cronico: resp.data.data,
                    });
                    this.calcularfp()
                })
                .catch(err => {
                    console.log(err)
                })
        }
    }
    handleChange({target}) {
        var ncronico = this.state.cronico;
        ncronico[target.id]=target.value; 
        this.props.dataToSend(ncronico, 3);
    }
    calcularfp(){
        
        let f120 = new Date(this.state.cronico["fecha_it_inicio_ciclo"]);
        f120 = new Date(f120.setTime( f120.getTime() + 119 * 86400000 )).getTime();
        f120=new Date(f120).toISOString().slice(0,10);
        console.log(f120);

        let f150 = new Date(this.state.cronico["fecha_it_inicio_ciclo"]);
        f150 = new Date(f150.setTime( f150.getTime() + 149 * 86400000 )).getTime();
        f150=new Date(f150).toISOString().slice(0,10);
        console.log(f150);

        let f180 = new Date(this.state.cronico["fecha_it_inicio_ciclo"]);
        f180 = new Date(f180.setTime( f180.getTime() + 179 * 86400000 )).getTime();
        f180=new Date(f180).toISOString().slice(0,10);
        console.log(f180);

        let f540 = new Date(this.state.cronico["fecha_it_inicio_ciclo"]);
        f540 = new Date(f540.setTime( f540.getTime() + 539 * 86400000 )).getTime();
        f540=new Date(f540).toISOString().slice(0,10);
        console.log(f540);
        
        let fp = [f120,f150,f180,f540]
        this.setState({
           fp : fp
        });
    }
    render() {
        const { cronico } = this.state;
       // console.log(cronico);
        
        if (typeof this.state.cronico === 'object'){
            var cols=Object.keys(this.state.cronico)
            //console.log(cols);
        }

        return (
            <div>
                <div className="row mt-2">
                    <div className="col-md-12 texto">
                        <ul className="nav nav-tabs">
                            <li className="nav-item">
                                <a className="nav-link active" data-toggle="tab" href="#ddc">DEMANDA DICTAMEN CPCLO</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" data-toggle="tab" href="#cplocierre">DICTAMEN CPCLO AL CIERRE</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link " data-toggle="tab" href="#abuso">ABUSO DEL DERECHO</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" data-toggle="tab" href="#cr">CIERRE REINTEGRO</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" data-toggle="tab" href="#gp">GESTION PERDIDOS</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" data-toggle="tab" href="#gd">GESTION DEUDA</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" data-toggle="tab" href="#observ">OBSERVACIONES - TUTELA</a>
                            </li>
                        </ul>

            
                        <div className="tab-content">
                            <div className="tab-pane container active" id="ddc">
                                <div className="col-md-8 texto">
                                    <table className="table table-sm table-striped table-bordered texto mt-5">
                                        <tbody>
                                            <tr className="form-group">
                                                <td>Fecha demanda laboral</td>
                                                <td><input className="form-control" type="date" id="fecha_demanda_lboral" defaultValue={this.state.id != 0 ? cronico[cols[102]]: ''} size="50" onChange={this.handleChange}/></td>
                                            </tr>
                                            <tr className="form-group">
                                                <td>%CPCLO</td>
                                                <td><input type="number" min="0" max="100" pattern="[0-9]{1,2}([\.,][0-9]+)?" step="0.01" title="número con máximo dos decimas ej: 22,42" className="form-control" id="cpclo_demanda_dictamen" defaultValue={this.state.id != 0 ? cronico[cols[103]]: ''} size="50" onChange={this.handleChange}/></td>
                                            </tr>
                                            <tr className="form-group">
                                                <td>Contingencia origen dictamen demanda</td>
                                                <td>
                                                    <select className="form-control" id="contingencia_origen_dictamen_demanda" onChange={this.handleChange}>
                                                        <option defaultValue={this.state.id != 0 ? cronico[cols[104]]: ''}>{this.state.id != 0 ? cronico[cols[104]]: ''}</option>
                                                        <option value="EG">EG</option>
                                                        <option value="AT">AT</option>
                                                        <option value="EL">EL</option>
                                                    </select>
                                                </td>
                                            </tr>
                                            <tr className="form-group">
                                                <td>Fecha estructuración demanda</td>
                                                <td><input className="form-control" type="date" id="fecha_estructuracion_demanda" defaultValue={this.state.id != 0 ? cronico[cols[105]]: ''} size="50" onChange={this.handleChange}/></td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <div className="tab-pane container fade" id="cplocierre">
                                <div className="col-md-8 texto">
                                    <table className="table table-sm table-striped table-bordered texto mt-5">
                                        <tbody>
                                            <tr className="form-group">
                                                <td>FIRME (SI)</td>
                                                <td>
                                                    <select className="form-control" id="firme_si" onChange={this.handleChange}>
                                                        <option defaultValue={this.state.id != 0 ? cronico[cols[106]]: ''}>{this.state.id != 0 ? cronico[cols[106]]: ''}</option>
                                                        <option value="SI">SI</option>
                                                        <option value="NO">NO</option>
                                                    </select>
                                                </td>
                                            </tr>
                                            <tr className="form-group">
                                                <td>%CPCLO cierre</td>
                                                <td><input type="number" min="0" max="100" pattern="[0-9]{1,2}([\.,][0-9]+)?" step="0.01" title="número con máximo dos decimas ej: 22,42" className="form-control" id="cpclo_cierre" defaultValue={this.state.id != 0 ? cronico[cols[107]]: ''} size="50" onChange={this.handleChange}/></td>
                                            </tr>
                                            { this.state.id != 0 ?
                                                <tr className="form-group">
                                                    <td>Rango CPCLO cierre</td>
                                                    <td><input disabled className="form-control" type="text" id="rango_cpclo_cierre" defaultValue={this.state.id != 0 ? cronico[cols[108]]: ''} size="50" onChange={this.handleChange}/></td>
                                                </tr>
                                                :null
                                            }
                                            <tr className="form-group">
                                                <td>Categoría discapacidad</td>
                                                <td>
                                                    <select className="form-control" id="categoria_discapacidad" onChange={this.handleChange}>
                                                        <option defaultValue={this.state.id != 0 ? cronico[cols[109]]: ''}>{this.state.id != 0 ? cronico[cols[109]]: ''}</option>
                                                        <option value="FISICA">FISICA</option>
                                                        <option value="AUDITIVA">AUDITIVA</option>
                                                        <option value="VISUAL">VISUAL</option>
                                                        <option value="SORDOCEGUERA">SORDOCEGUERA</option>
                                                        <option value="INTELECTUAL">INTELECTUAL</option>
                                                        <option value="PSICOSOCIAL(MENTAL)">PSICOSOCIAL(MENTAL)</option>
                                                        <option value="MULTIPLE">MULTIPLE</option>
                                                    </select>
                                                </td>
                                            </tr>
                                            <tr className="form-group">
                                                <td>Contingencia origen de cierre</td>
                                                <td>
                                                    <select className="form-control" id="contingencia_origen_de_cierre" onChange={this.handleChange}>
                                                        <option defaultValue={this.state.id != 0 ? cronico[cols[110]]: ''}>{this.state.id != 0 ? cronico[cols[110]]: ''}</option>
                                                        <option value="EG">EG</option>
                                                        <option value="AT">AT</option>
                                                        <option value="EL">EL</option>
                                                    </select>
                                                </td>
                                            </tr>
                                            <tr className="form-group">
                                                <td>Fecha estructuración de cierre</td>
                                                <td><input className="form-control" type="date" id="fecha_estructuracion_cierre" defaultValue={this.state.id != 0 ? cronico[cols[111]]: ''} size="50" onChange={this.handleChange}/></td>
                                            </tr>
                                            <tr className="form-group">
                                                <td>Instancia al cierre</td>
                                                <td>
                                                    <select className="form-control" id="instancia_al_cierre" onChange={this.handleChange}>
                                                        <option defaultValue={this.state.id != 0 ? cronico[cols[112]]: ''}>{this.state.id != 0 ? cronico[cols[112]]: ''}</option>
                                                        <option value="PRIMERA OPORTUNIDAD EPS">PRIMERA OPORTUNIDAD EPS</option>
                                                        <option value="PRIMERA OPORTUNIDAD AFP">PRIMERA OPORTUNIDAD AFP</option>
                                                        <option value="PRIMERA OPORTUNIDAD ARL">PRIMERA OPORTUNIDAD ARL</option>
                                                        <option value="JRCI">JRCI</option>
                                                        <option value="JNCI">JNCI</option>
                                                        <option value="FALLO">FALLO</option>
                                                    </select>
                                                </td>
                                            </tr>
                                            <tr className="form-group">
                                                <td>Clasificación tipo incapacidad</td>
                                                <td>
                                                    <select className="form-control" id="clasificacion_tipo_incpacidad" onChange={this.handleChange}>
                                                        <option defaultValue={this.state.id != 0 ? cronico[cols[113]]: ''}>{this.state.id != 0 ? cronico[cols[113]]: ''}</option>
                                                        <option value="IPP">IPP</option>
                                                        <option value="IPT">IPT</option>
                                                        <option value="IT">IT</option>
                                                    </select>
                                                </td>
                                            </tr>
                                            <tr className="form-group">
                                                <td>Fecha Cert.inva</td>
                                                <td><input className="form-control" type="date" id="fecha_cert_inva" defaultValue={this.state.id != 0 ? cronico[cols[114]]: ''} size="50" onChange={this.handleChange}/></td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <div className="tab-pane container fade" id="abuso">
                                <div className="col-md-8 texto">
                                    <table className="table table-sm table-striped table-bordered texto mt-5">
                                        <tbody>
                                            <tr className="form-group">
                                                <td>Fecha carta cita pemel</td>
                                                <td><input className="form-control" type="date" id="fecha_carta_cita_pemel" defaultValue={this.state.id != 0 ? cronico[cols[115]]: ''} size="50" onChange={this.handleChange}/></td>
                                            </tr>
                                            <tr className="form-group">
                                                <td>Fecha carta explicaciones abuso</td>
                                                <td><input className="form-control" type="date" id="fecha_carta_explicaciones_abuso" defaultValue={this.state.id != 0 ? cronico[cols[116]]: ''} size="50" onChange={this.handleChange}/></td>
                                            </tr>
                                            <tr className="form-group">
                                                <td>Fecha carta cita acuerdo abuso</td>
                                                <td><input className="form-control" type="date" id="fecha_carta_cita_acuerdo__abuso" defaultValue={this.state.id != 0 ? cronico[cols[117]]: ''} size="50" onChange={this.handleChange}/></td>
                                            </tr>
                                            <tr className="form-group">
                                                <td>Fecha acta acuerdo de cumplimiento</td>
                                                <td><input className="form-control" type="date" id="fecha_acta_acuerdo_de_cumplimiento" defaultValue={this.state.id != 0 ? cronico[cols[118]]: ''} size="50" onChange={this.handleChange}/></td>
                                            </tr>
                                            <tr className="form-group">
                                                <td>Fecha carta suspension abuso del derecho</td>
                                                <td><input className="form-control" type="date" id="fecha_carta_suspension_abuso_del_derecho" defaultValue={this.state.id != 0 ? cronico[cols[119]]: ''} size="50" onChange={this.handleChange}/></td>
                                            </tr>
                                            <tr className="form-group">
                                                <td>Fecha restitución derecho IT</td>
                                                <td><input className="form-control" type="date" id="fecha_restitucion_derecho_it" defaultValue={this.state.id != 0 ? cronico[cols[120]]: ''} size="50" onChange={this.handleChange}/></td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <div className="tab-pane container fade" id="cr">
                                <div className="col-md-8 texto">
                                    <table className="table table-sm table-striped table-bordered texto mt-5">
                                        <tbody>
                                            <tr className="form-group">
                                                <td>Fecha reintegro por MMM</td>
                                                <td><input className="form-control" type="date" id="fecha_reintegro_por_mmm" defaultValue={this.state.id != 0 ? cronico[cols[121]]: ''} size="50" onChange={this.handleChange}/></td>
                                            </tr>
                                            <tr className="form-group">
                                                <td>Fecha control reintegro</td>
                                                <td><input className="form-control" type="date" id="fecha_control_reintegro" defaultValue={this.state.id != 0 ? cronico[cols[122]]: ''} size="50" onChange={this.handleChange}/></td>
                                            </tr>
                                            <tr className="form-group">
                                                <td>Resultado reintegro por MMMM</td>
                                                <td>
                                                    <select className="form-control" id="resultado_reintegro_por_mmm" onChange={this.handleChange}>
                                                        <option defaultValue={this.state.id != 0 ? cronico[cols[123]]: ''}>{this.state.id != 0 ? cronico[cols[123]]: ''}</option>
                                                        <option value="REINGRESO">REINGRESO</option>
                                                        <option value="ADAPTACION">ADAPTACION</option>
                                                        <option value="REUBICACION">REUBICACION</option>
                                                        <option value="FALLIDO">FALLIDO</option>
                                                    </select>
                                                </td>
                                            </tr>
                                            <tr className="form-group">
                                                <td>Fecha refuerzo reintegro</td>
                                                <td><input className="form-control" type="date" id="fecha_refuerzo_reintegro" defaultValue={this.state.id != 0 ? cronico[cols[124]]: ''} size="50" onChange={this.handleChange}/></td>
                                            </tr>
                                            <tr className="form-group">
                                                <td>Fecha control fallido</td>
                                                <td><input className="form-control" type="date" id="fecha_control_fallido" defaultValue={this.state.id != 0 ? cronico[cols[125]]: ''} size="50" onChange={this.handleChange}/></td>
                                            </tr>
                                            <tr className="form-group">
                                                <td>Resultado refuerzo reintegro</td>
                                                <td>
                                                    <select className="form-control" id="resultado_refuerzo_reintegro" onChange={this.handleChange}>
                                                        <option defaultValue={this.state.id != 0 ? cronico[cols[126]]: ''}>{this.state.id != 0 ? cronico[cols[126]]: ''}</option>
                                                        <option value="REINGRESO">REINGRESO</option>
                                                        <option value="ADAPTACION">ADAPTACION</option>
                                                        <option value="REUBICACION">REUBICACION</option>
                                                        <option value="FALLIDO">FALLIDO</option>
                                                    </select>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <div className="tab-pane container fade" id="gp">
                                <div className="col-md-8 texto">
                                    <table className="table table-sm table-striped table-bordered texto mt-5">
                                        <tbody>
                                            <tr className="form-group">
                                                <td>Fecha comunicado usuario</td>
                                                <td><input className="form-control" type="date" id="fecha_comunicado_usuario" defaultValue={this.state.id != 0 ? cronico[cols[127]]: ''} size="50" onChange={this.handleChange}/></td>
                                            </tr>
                                            <tr className="form-group">
                                                <td>Tipo comunicado emitido</td>
                                                <td>
                                                    <select className="form-control" id="tipo_comunicado_(llamado-email-carta)" onChange={this.handleChange}>
                                                        <option defaultValue={this.state.id != 0 ? cronico[cols[128]]: ''}>{this.state.id != 0 ? cronico[cols[128]]: ''}</option>
                                                        <option value="LLAMADA">LLAMADA</option>
                                                        <option value="EMAIL">EMAIL</option>
                                                        <option value="CARTA">CARTA</option>
                                                    </select>
                                                </td>
                                            </tr>
                                            <tr className="form-group">
                                                <td>Fecha comunicado busqueda empresa</td>
                                                <td><input className="form-control" type="date" id="fecha_comunicado_busqueda_empresa" defaultValue={this.state.id != 0 ? cronico[cols[129]]: ''} size="50" onChange={this.handleChange}/></td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <div className="tab-pane container fade" id="gd">
                                <div className="col-md-8 texto">
                                    <table className="table table-sm table-striped table-bordered texto mt-5">
                                        <tbody>
                                            <tr className="form-group">
                                                <td>Deuda</td>
                                                <td>
                                                    <select className="form-control" id="deuda" onChange={this.handleChange}>
                                                        <option defaultValue={this.state.id != 0 ? cronico[cols[130]]: ''}>{this.state.id != 0 ? cronico[cols[130]]: ''}</option>
                                                        <option value="SI">SI</option>
                                                        <option value="NO">NO</option>
                                                    </select>
                                                </td>
                                            </tr>
                                            <tr className="form-group">
                                                <td>Procedimiento pendiente</td>
                                                <td><input className="form-control" type="text" id="procedimiento_pendiente" defaultValue={this.state.id != 0 ? cronico[cols[131]]: ''} size="50" onChange={this.handleChange}/></td>
                                            </tr>
                                            <tr className="form-group">
                                                <td>Fecha de solicitud</td>
                                                <td><input className="form-control" type="date" id="fecha_de_solicitud" defaultValue={this.state.id != 0 ? cronico[cols[132]]: ''} size="50" onChange={this.handleChange}/></td>
                                            </tr>
                                            <tr className="form-group">
                                                <td>Area de contacto</td>
                                                <td><input className="form-control" type="text" id="area_de_contacto" defaultValue={this.state.id != 0 ? cronico[cols[133]]: ''} size="50" onChange={this.handleChange}/></td>
                                            </tr>
                                            <tr className="form-group">
                                                <td>Fecha de respuesta</td>
                                                <td><input className="form-control" type="date" id="fecha_de_respuesta" defaultValue={this.state.id != 0 ? cronico[cols[134]]: ''} size="50" onChange={this.handleChange}/></td>
                                            </tr>
                                            <tr className="form-group">
                                                <td>Respuesta</td>
                                                <td><input className="form-control" type="text" id="respuesta" defaultValue={this.state.id != 0 ? cronico[cols[135]]: ''} size="50" onChange={this.handleChange}/></td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <div className="tab-pane container fade" id="observ">
                                <div className="col-md-8 texto">
                                    <table className="table table-sm table-striped table-bordered texto mt-5">
                                        <tbody>
                                            <tr className="form-group">
                                                <td>Fecha cierre notificación evento</td>
                                                <td><input className="form-control" type="date" id="fecha_cierre_notificacion_evento" defaultValue={this.state.id != 0 ? cronico[cols[136]]: ''} size="50" onChange={this.handleChange}/></td>
                                            </tr>
                                            <tr className="form-group">
                                                <td>Observación</td>
                                                <td><input className="form-control" type="text" id="observacion" defaultValue={this.state.id != 0 ? cronico[cols[137]]: ''} size="50" onChange={this.handleChange}/></td>
                                            </tr>
                                            <tr className="form-group">
                                                <td>Tutela PE</td>
                                                <td>
                                                    <select className="form-control" id="tutela_pe" onChange={this.handleChange}>
                                                        <option defaultValue={this.state.id != 0 ? cronico[cols[138]]: ''}>{this.state.id != 0 ? cronico[cols[138]]: ''}</option>
                                                        <option value="SI">SI</option>
                                                        <option value="NO">NO</option>
                                                    </select>
                                                </td>
                                            </tr>
                                            <tr className="form-group">
                                                <td>Observación cobertura tutela</td>
                                                <td>
                                                    <select className="form-control" id="observacion_cobertura_tutela" onChange={this.handleChange}>
                                                        <option defaultValue={this.state.id != 0 ? cronico[cols[139]]: ''}>{this.state.id != 0 ? cronico[cols[139]]: ''}</option>
                                                        <option value="PAGO SOLO IT MENOR A 180">PAGO SOLO IT MENOR A 180</option>
                                                        <option value="PAGO SOLO IT DIA 180-540 CRH OPORTUNO">PAGO SOLO IT DIA 180-540 CRH OPORTUNO</option>
                                                        <option value="PAGO SOLO IT DIA 180-540 CRH NO OPORTUNO">PAGO SOLO IT DIA 180-540 CRH NO OPORTUNO</option>
                                                        <option value="PAGO SOLO IT MAYOR 540 CRH FAVORABLE">PAGO SOLO IT MAYOR 540 CRH FAVORABLE</option>
                                                        <option value="PAGO SOLO IT MAYOR 540 CRH NO FAVORABLE">PAGO SOLO IT MAYOR 540 CRH NO FAVORABLE</option>
                                                        <option value="PAGO IT HASTA CPCLO FIRME">PAGO IT HASTA CPCLO FIRME</option>
                                                        <option value="PAGO IT HASTA CPCLO NO FIRME">PAGO IT HASTA CPCLO NO FIRME</option>
                                                        <option value="PAGO IT HASTA PENSION">PAGO IT HASTA PENSION</option>
                                                        <option value="PAGO IT HASTA REINTEGRO">PAGO IT HASTA REINTEGRO</option>
                                                        <option value="PAGO IT HASTA CURACION-MMM">PAGO IT HASTA CURACION-MMM</option>
                                                        <option value="PAGO IT A FECHA RESTRUCTURACION">PAGO IT A FECHA RESTRUCTURACION</option>
                                                    </select>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                { this.state.enable == "1" ?
                <div className="row mt-4">
                    <div className="col-md-6 offset-md-3 texto">
                        <button className="btn btn-success btn-block" onClick={this.guardarCronico}>GUARDAR CAMBIOS</button>
                    </div>                                            
                </div>
                : ''
                }
            </div>
        );
    }

}

export default CronicoTab3;
