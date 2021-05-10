import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import TableCronicos from './TableCronicos.js';
import { size } from 'lodash';
import axios from 'axios';
import { countBy } from 'lodash';



class CronicoTab2 extends Component {
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
        this.props.dataToSend(ncronico, 2);
    }
    calcularfp(){
        
        let f120 = new Date(this.state.cronico["fecha_it_inicio_ciclo"]);
        f120 = new Date(f120.setTime( f120.getTime() + 119 * 86400000 )).getTime();
        console.log(f120);
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
        console.log(fp);
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
                                <a className="nav-link active" data-toggle="tab" href="#ii">INFORMACIÓN INCAPACIDADES (SISPOS)</a>
                            </li>
                            {this.state.id != 0 ?
                                <li className="nav-item">
                                    <a className="nav-link" data-toggle="tab" href="#fp">FECHAS PROYECTADAS</a>
                                </li>
                                : null
                            }
                            <li className="nav-item">
                                <a className="nav-link" data-toggle="tab" href="#scrh">GESTION CRHs (SIR)</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link " data-toggle="tab" href="#cplo1">1 INSTANCIA DE CPCLO </a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link " data-toggle="tab" href="#cplo2">2 INSTANCIA DE CPCLO </a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link " data-toggle="tab" href="#cplo3">3 INSTANCIA DE CPCLO </a>
                            </li>
                        </ul>

            
                        <div className="tab-content">
                            <div className="tab-pane container active" id="ii">
                                <div className="col-md-8 texto">
                                    <table className="table table-sm table-striped table-bordered texto mt-5">
                                        <tbody>
                                        <tr className="form-group">
                                            <td>Fecha cierre</td>
                                            <td><input className="form-control" type="date" id="fecha_cierre" defaultValue={this.state.id != 0 ? cronico[cols[51]]: ''} size="50" onChange={this.handleChange}/></td>
                                        </tr>
                                        <tr className="form-group">
                                            <td>Fecha IT inicio ciclo</td>
                                            <td><input className="form-control" type="date" id="fecha_it_inicio_ciclo" defaultValue={this.state.id != 0 ? cronico[cols[52]]: ''} size="50" onChange={this.handleChange}/></td>
                                        </tr>
                                        <tr className="form-group">
                                            <td>Fecha inicio ultima IT</td>
                                            <td><input className="form-control" type="date" id="fecha_inicio_ultima_it" defaultValue={this.state.id != 0 ? cronico[cols[53]]: ''} size="50" onChange={this.handleChange}/></td>
                                        </tr>
                                        <tr className="form-group">
                                            <td>Fecha fin ultima IT</td>
                                            <td><input className="form-control" type="date" id="fecha_fin_ultima_it" defaultValue={this.state.id != 0 ? cronico[cols[54]]: ''} size="50" onChange={this.handleChange}/></td>
                                        </tr>
                                        <tr className="form-group">
                                            <td>Días acumulados a fecha ultima IT</td>
                                            <td><input className="form-control" type="text" id="dias_acumulados_a_fecha_ultima_it" defaultValue={this.state.id != 0 ? cronico[cols[55]]: ''} size="50" onChange={this.handleChange}/></td>
                                        </tr>
                                        { this.state.id != 0 ?
                                            <tr className="form-group">
                                                <td>Rango días a fecha ultima IT</td>
                                                <td><input disabled className="form-control" type="text" id="rango_dias_a_fecha_ultima_it" defaultValue={this.state.id != 0 ? cronico[cols[56]]: ''} size="50" onChange={this.handleChange}/></td>
                                            </tr>
                                            : null
                                        }
                                        { this.state.id != 0 ?
                                            <tr className="form-group">
                                                <td>Días acumulados a hoy desde inicio ciclo</td>
                                                <td><input disabled className="form-control" type="text" id="dias_acumulado_a_hoy_desde_fech _inic _ciclo" defaultValue={this.state.id != 0 ? cronico[cols[57]]: ''} size="50" onChange={this.handleChange}/></td>
                                            </tr>
                                            : null
                                        }
                                        { this.state.id != 0 ?
                                            <tr className="form-group">
                                                <td>Perdidos</td>
                                                <td><input disabled className="form-control" type="text" id="perdidos" defaultValue={this.state.id != 0 ? cronico[cols[58]]: ''} size="50" onChange={this.handleChange}/></td>
                                            </tr>
                                            : null
                                        }
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <div className="tab-pane container fade" id="fp">
                                <div className="row mt-2">
                                    <div className="col-md-6 texto">
                                        <table className="table table-sm table-striped table-bordered texto mt-5">
                                            <tbody>
                                                <tr className="form-group">
                                                    <td>Fecha día 180</td>
                                                    <td><input disabled className="form-control" type="date" id="fecha_dia_180" defaultValue={this.state.id != 0 ? this.state.fp[2]: ''} size="50" onChange={this.handleChange}/></td>
                                                </tr>
                                                <tr className="form-group">
                                                    <td>Fecha día 540</td>
                                                    <td><input disabled className="form-control" type="date" id="fecha_dia_540" defaultValue={this.state.id != 0 ? this.state.fp[3]: ''} size="50" onChange={this.handleChange}/></td>
                                                </tr>
                                                <tr className="form-group">
                                                    <td>Fecha día 120</td>
                                                    <td><input disabled className="form-control" type="date" id="fecha_dia_120" defaultValue={this.state.id != 0 ? this.state.fp[0]: ''} size="50" onChange={this.handleChange}/></td>
                                                </tr>
                                                <tr className="form-group">
                                                    <td>Fecha día 150</td>
                                                    <td><input disabled className="form-control" type="date" id="fecha_dia_150" defaultValue={this.state.id != 0 ? this.state.fp[1]: ''} size="50" onChange={this.handleChange}/></td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                            <div className="tab-pane container fade" id="scrh">
                                <div className="col-md-8 texto">
                                    <table className="table table-sm table-striped table-bordered texto mt-5">
                                        <tbody>
                                            <tr className="form-group">
                                                <td>Radicación masiva fecha carta</td>
                                                <td><input className="form-control" type="date" id="radicacion_masiva_fecha_carta" defaultValue={this.state.id != 0 ? cronico[cols[63]]: ''} size="50" onChange={this.handleChange}/></td>
                                            </tr>
                                            <tr className="form-group">
                                                <td>Fecha emisión CRH1 (antes del 180)</td>
                                                <td><input className="form-control" type="date" id="fecha_emision_crh1_(antes_del_180)" defaultValue={this.state.id != 0 ? cronico[cols[64]]: ''} size="50" onChange={this.handleChange}/></td>
                                            </tr>
                                            {this.state.id != 0 ?
                                                <tr className="form-group">
                                                    <td>Año emisión CRH1</td>
                                                    <td><input disabled className="form-control" type="text" id="ano_emision_crh1" defaultValue={this.state.id != 0 ? cronico[cols[65]]: ''} size="50" onChange={this.handleChange}/></td>
                                                </tr>
                                                :null
                                            }
                                            {this.state.id != 0 ?
                                                <tr className="form-group">
                                                    <td>Mes emisión CRH1</td>
                                                    <td><input disabled className="form-control" type="text" id="mes_emision_crh1" defaultValue={this.state.id != 0 ? cronico[cols[66]]: ''} size="50" onChange={this.handleChange}/></td>
                                                </tr>
                                                :null
                                            }
                                            <tr className="form-group">
                                                <td>Decisión CRH1 favorable</td>
                                                <td>
                                                    <select className="form-control" id="decision_crh1" onChange={this.handleChange}>
                                                        <option defaultValue={this.state.id != 0 ? cronico[cols[67]]: ''}>{this.state.id != 0 ? cronico[cols[67]]: ''}</option>
                                                        <option value="SI">SI</option>
                                                        <option value="NO">NO</option>
                                                    </select>
                                                </td>
                                            </tr>
                                            <tr className="form-group">
                                                <td>Días acumulados a CRH1</td>
                                                <td><input className="form-control" type="text" id="dias_acumulados_a_crh1" defaultValue={this.state.id != 0 ? cronico[cols[68]]: ''} size="50" onChange={this.handleChange}/></td>
                                            </tr>
                                            {this.state.id != 0 ?
                                                <tr className="form-group">
                                                    <td>Oportunidad a CRH1</td>
                                                    <td><input disabled className="form-control" type="text" id="oportunidad_a_crh1" defaultValue={this.state.id != 0 ? cronico[cols[69]]: ''} size="50" onChange={this.handleChange}/></td>
                                                </tr>
                                                :null
                                            }
                                            <tr className="form-group">
                                                <td>Fecha remisión AFP-ARL CRH1</td>
                                                <td><input className="form-control" type="date" id="fecha_remision_afp_arl_crh1" defaultValue={this.state.id != 0 ? cronico[cols[70]]: ''} size="50" onChange={this.handleChange}/></td>
                                            </tr>
                                            <tr className="form-group">
                                                <td>Fecha notificación CRH1 a AFP</td>
                                                <td><input className="form-control" type="date" id="fecha_notif_crh1_a_afp" defaultValue={this.state.id != 0 ? cronico[cols[71]]: ''} size="50" onChange={this.handleChange}/></td>
                                            </tr>
                                            <tr className="form-group">
                                                <td>Fecha día 480</td>
                                                <td><input className="form-control" type="date" id="fecha_dia_480" defaultValue={this.state.id != 0 ? cronico[cols[72]]: ''} size="50" onChange={this.handleChange}/></td>
                                            </tr>
                                            <tr className="form-group">
                                                <td>Fecha emisión CRH2 (antes del 540)</td>
                                                <td><input className="form-control" type="date" id="fecha_emision_crh2_(antes_del_540)" defaultValue={this.state.id != 0 ? cronico[cols[73]]: ''} size="50" onChange={this.handleChange}/></td>
                                            </tr>
                                            <tr className="form-group">
                                                <td>Decisión CRH2 favorable</td>
                                                <td>
                                                    <select className="form-control" id="decision_crh2_favorable" onChange={this.handleChange}>
                                                        <option defaultValue={this.state.id != 0 ? cronico[cols[74]]: ''}>{this.state.id != 0 ? cronico[cols[74]]: ''}</option>
                                                        <option value="SI">SI</option>
                                                        <option value="NO">NO</option>
                                                        <option value=""></option>
                                                    </select>
                                                </td>
                                            </tr>
                                            <tr className="form-group">
                                                <td>Días acumulados a CRH2</td>
                                                <td><input className="form-control" type="text" id="dias_acum_a_crh2" defaultValue={this.state.id != 0 ? cronico[cols[75]]: ''} size="50" onChange={this.handleChange}/></td>
                                            </tr>
                                            <tr className="form-group">
                                                <td>Fecha remisión AFP - ARL CRH2</td>
                                                <td><input className="form-control" type="date" id="fecha_remision_afp_arl_crh2" defaultValue={this.state.id != 0 ? cronico[cols[76]]: ''} size="50" onChange={this.handleChange}/></td>
                                            </tr>
                                            <tr className="form-group">
                                                <td>Fecha notificación CRH2 a AFP</td>
                                                <td><input className="form-control" type="date" id="fecha_notif_crh2_a_afp" defaultValue={this.state.id != 0 ? cronico[cols[77]]: ''} size="50" onChange={this.handleChange}/></td>
                                            </tr>
                                            <tr className="form-group">
                                                <td>Fecha emisión CRH3 mod pronostico</td>
                                                <td><input className="form-control" type="date" id="fecha_emision_crh3_mod_pronostico" defaultValue={this.state.id != 0 ? cronico[cols[78]]: ''} size="50" onChange={this.handleChange}/></td>
                                            </tr>
                                            <tr className="form-group">
                                                <td>Decisión CRH3 favorable</td>
                                                <td>
                                                    <select className="form-control" id="decision_crh3_favorable" onChange={this.handleChange}>
                                                        <option defaultValue={this.state.id != 0 ? cronico[cols[79]]: ''}>{this.state.id != 0 ? cronico[cols[79]]: ''}</option>
                                                        <option value="SI">SI</option>
                                                        <option value="NO">NO</option>
                                                    </select>
                                                </td>
                                            </tr>
                                            <tr className="form-group">
                                                <td>Días acumulados a CRH3</td>
                                                <td><input className="form-control" type="text" id="dias_acum_a_crh3" defaultValue={this.state.id != 0 ? cronico[cols[80]]: ''} size="50" onChange={this.handleChange}/></td>
                                            </tr>
                                            <tr className="form-group">
                                                <td>Fecha remisión AFP - ARL CRH3</td>
                                                <td><input className="form-control" type="date" id="fecha_remision_afp_arl_crh3" defaultValue={this.state.id != 0 ? cronico[cols[81]]: ''} size="50" onChange={this.handleChange}/></td>
                                            </tr>
                                            <tr className="form-group">
                                                <td>Fecha notificación CRH3 a AFP</td>
                                                <td><input className="form-control" type="date" id="fecha_notif_crh3_a_afp" defaultValue={this.state.id != 0 ? cronico[cols[82]]: ''} size="50" onChange={this.handleChange}/></td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <div className="tab-pane container fade" id="cplo1">
                                <div className="col-md-8 texto">
                                    <table className="table table-sm table-striped table-bordered texto mt-5">
                                        <tbody>
                                            <tr className="form-group">
                                                <td>CPCLO fecha 1a oportunidad</td>
                                                <td><input className="form-control" type="date" id="cpclo_fecha_1a_oport" defaultValue={this.state.id != 0 ? cronico[cols[83]]: ''} size="50" onChange={this.handleChange}/></td>
                                            </tr>
                                            <tr className="form-group">
                                                <td>Entidad califica 1a oportunidad</td>
                                                <td>
                                                    <select className="form-control" id="entidad_califica_1a_oportunidad" onChange={this.handleChange}>
                                                        <option defaultValue={this.state.id != 0 ? cronico[cols[84]]: ''}>{this.state.id != 0 ? cronico[cols[84]]: ''}</option>
                                                        <option value="AFP">AFP</option>
                                                        <option value="ARL">ARL</option>
                                                        <option value="EPS">EPS</option>
                                                        <option value="ASEGURADORA">ASEGURADORA</option>
                                                    </select>
                                                </td>
                                            </tr>
                                            <tr className="form-group">
                                                <td>CPCLO</td>
                                                <td><input type="number" min="0" max="100" pattern="[0-9]{1,2}([\.,][0-9]+)?" step="0.01" title="número con máximo dos decimas ej: 22,42" className="form-control" id="cpclo" defaultValue={this.state.id != 0 ? cronico[cols[85]]: ''} size="50" onChange={this.handleChange}/></td>
                                            </tr>
                                            <tr className="form-group">
                                                <td>Contingencia origen dictamen 1a oportunidad</td>
                                                <td>
                                                    <select className="form-control" id="contingencia_origen_dictamen_1_oport " onChange={this.handleChange}>
                                                        <option defaultValue={this.state.id != 0 ? cronico[cols[86]]: ''}>{this.state.id != 0 ? cronico[cols[86]]: ''}</option>
                                                        <option value="EG">EG</option>
                                                        <option value="AT">AT</option>
                                                        <option value="EL">EL</option>
                                                    </select>
                                                </td>
                                            </tr>
                                            <tr className="form-group">
                                                <td>Fecha estructuración 1a oportunidad</td>
                                                <td><input className="form-control" type="date" id="fecha_estructuracion_1_oport " defaultValue={this.state.id != 0 ? cronico[cols[87]]: ''} size="50" onChange={this.handleChange}/></td>
                                            </tr>
                                            <tr className="form-group">
                                                <td>Quien manifiesta desacuerdo</td>
                                                <td>
                                                    <select className="form-control" id="quien_manifiesta_desacuerdo" onChange={this.handleChange}>
                                                        <option defaultValue={this.state.id != 0 ? cronico[cols[88]]: ''}>{this.state.id != 0 ? cronico[cols[88]]: ''}</option>
                                                        <option value="AFP">AFP</option>
                                                        <option value="ARL">ARL</option>
                                                        <option value="EPS">EPS</option>
                                                        <option value="USUARIO">USUARIO</option>
                                                        <option value="EMPRESA">EMPRESA</option>
                                                        <option value="ASEGURADORA">ASEGURADORA</option>
                                                    </select>
                                                </td>
                                            </tr>
                                            <tr className="form-group">
                                                <td>Fecha manifestacion desacuerdo</td>
                                                <td><input className="form-control" type="date" id="fecha_manifestacion_desacuerdo" defaultValue={this.state.id != 0 ? cronico[cols[89]]: ''} size="50" onChange={this.handleChange}/></td>
                                            </tr>
                                            <tr className="form-group">
                                                <td>Fecha entrega a JRCI</td>
                                                <td><input className="form-control" type="date" id="fecha_entrega_a_jrci" defaultValue={this.state.id != 0 ? cronico[cols[90]]: ''} size="50" onChange={this.handleChange}/></td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <div className="tab-pane container fade" id="cplo2">
                                <div className="col-md-8 texto">
                                    <table className="table table-sm table-striped table-bordered texto mt-5">
                                        <tbody>
                                            <tr className="form-group">
                                                <td>CPCLO fecha JRCI</td>
                                                <td><input className="form-control" type="date" id="cpclo_fecha_jrci" defaultValue={this.state.id != 0 ? cronico[cols[91]]: ''} size="50" onChange={this.handleChange}/></td>
                                            </tr>
                                            <tr className="form-group">
                                                <td>%CPCLO</td>
                                                <td><input type="number" min="0" max="100" pattern="[0-9]{1,2}([\.,][0-9]+)?" step="0.01" title="número con máximo dos decimas ej: 22,42" className="form-control" id="cpclo2" defaultValue={this.state.id != 0 ? cronico[cols[92]]: ''} size="50" onChange={this.handleChange}/></td>
                                            </tr>
                                            <tr className="form-group">
                                                <td>Contingencia origen dictamen JRCI</td>
                                                <td>
                                                    <select className="form-control" id="contingencia_origen_dictamen_jrci" onChange={this.handleChange}>
                                                        <option defaultValue={this.state.id != 0 ? cronico[cols[93]]: ''}>{this.state.id != 0 ? cronico[cols[93]]: ''}</option>
                                                        <option value="EG">EG</option>
                                                        <option value="AT">AT</option>
                                                        <option value="EL">EL</option>
                                                    </select>
                                                </td>
                                            </tr>
                                            <tr className="form-group">
                                                <td>Fecha estructuración JRCI</td>
                                                <td><input className="form-control" type="date" id="fecha_estructuracion_jrci" defaultValue={this.state.id != 0 ? cronico[cols[94]]: ''} size="50" onChange={this.handleChange}/></td>
                                            </tr>
                                            <tr className="form-group">
                                                <td>Quien manifiesta controversia</td>
                                                <td>
                                                    <select className="form-control" id="quien_manifiesta_controversia" onChange={this.handleChange}>
                                                        <option defaultValue={this.state.id != 0 ? cronico[cols[95]]: ''}>{this.state.id != 0 ? cronico[cols[95]]: ''}</option>
                                                        <option value="AFP">AFP</option>
                                                        <option value="ARL">ARL</option>
                                                        <option value="EPS">EPS</option>
                                                        <option value="USUARIO">USUARIO</option>
                                                        <option value="EMPRESA">EMPRESA</option>
                                                        <option value="ASEGURADORA">ASEGURADORA</option>
                                                    </select>
                                                </td>
                                            </tr>
                                            <tr className="form-group">
                                                <td>Fecha manifestacion controversia</td>
                                                <td><input className="form-control" type="date" id="fecha_manifestacion_controversia" defaultValue={this.state.id != 0 ? cronico[cols[96]]: ''} size="50" onChange={this.handleChange}/></td>
                                            </tr>
                                            <tr className="form-group">
                                                <td>Fecha entrega a JNCI</td>
                                                <td><input className="form-control" type="date" id="fecha_entrega_a_jnci" defaultValue={this.state.id != 0 ? cronico[cols[97]]: ''} size="50" onChange={this.handleChange}/></td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <div className="tab-pane container fade" id="cplo3">
                                <div className="col-md-8 texto">
                                    <table className="table table-sm table-striped table-bordered texto mt-5">
                                        <tbody>
                                            <tr className="form-group">
                                                <td>CPCLO fecha JNCI</td>
                                                <td><input className="form-control" type="date" id="cpclo_fecha_jnci" defaultValue={this.state.id != 0 ? cronico[cols[98]]: ''} size="50" onChange={this.handleChange}/></td>
                                            </tr>
                                            <tr className="form-group">
                                                <td>%CPCLO</td>
                                                <td><input type="number" min="0" max="100" pattern="[0-9]{1,2}([\.,][0-9]+)?" step="0.01" title="número con máximo dos decimas ej: 22,42" className="form-control" id="cpclo3" defaultValue={this.state.id != 0 ? cronico[cols[99]]: ''} size="50" onChange={this.handleChange}/></td>
                                            </tr>
                                            <tr className="form-group">
                                                <td>Contingencia origen dictamen JNCI</td>
                                                <td>
                                                    <select className="form-control" id="contingencia_origen_dictamen_jnci" onChange={this.handleChange}>
                                                        <option defaultValue={this.state.id != 0 ? cronico[cols[100]]: ''}>{this.state.id != 0 ? cronico[cols[100]]: ''}</option>
                                                        <option value="EG">EG</option>
                                                        <option value="AT">AT</option>
                                                        <option value="EL">EL</option>
                                                    </select>
                                                </td>
                                            </tr>
                                            <tr className="form-group">
                                                <td>Fecha estructuración JNCI</td>
                                                <td><input className="form-control" type="date" id="fecha_estructuracion_jnci" defaultValue={this.state.id != 0 ? cronico[cols[101]]: ''} size="50" onChange={this.handleChange}/></td>
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

export default CronicoTab2;

