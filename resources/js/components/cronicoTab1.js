import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import TableCronicos from './TableCronicos.js';
import { size } from 'lodash';
import axios from 'axios';
import { countBy } from 'lodash';



class CronicoTab1 extends Component {
    constructor(props) {
        super(props);
       // console.log(props)
        this.state = {
            id: props.id,
            enable:props.enable,
            cronico:'',
            fp:[],
            estados: ['CERRADO', 'SEGUIMIENTO'],
            motivos: ['FALLECIDO', 'IPP', 'NUEVO', 'PENSIONADO', 'REINTEGRADO', 'RETIRADO', 'SEGUIMIENTO', 'TRAMITE DE PENSION'],
        }
        // bind
        
        this.handleChange = this.handleChange.bind(this);
        this.getCronico = this.getCronico.bind(this);
        this.calcularfp = this.calcularfp.bind(this);
        this.guardarCronico = this.guardarCronico.bind(this);
        this.getCronico()
    }
    guardarCronico(){
        let url = '/updateCronico'
        axios.post(url, { datos: this.state.cronico })
            .then(resp => {
                console.log(resp.data)
                // alert(resp.data)
            })
            .catch(err => {
                console.log(err)
            })
    }
    getCronico() {
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
    handleChange({ target }) {
       var ncronico = this.state.cronico;      
       ncronico[target.id]=target.value;    
       this.setState({
        cronico: ncronico,
    });
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
       console.log('cronico props: ', cronico);
        
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
                                <a className="nav-link active" data-toggle="tab" href="#ns">NOTIFICACIÓN (SIR)</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" data-toggle="tab" href="#esu">INFORMACION DEMOGRAFICA USUARIO Y EMPRESA (REGISTRO CLIENTE)</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" data-toggle="tab" href="#mel">MEL CITAS AGENDA</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" data-toggle="tab" href="#sico">SICOLOGIA CITAS AGENDA</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" data-toggle="tab" href="#ic">GESTION DEL CASO MEL (SIR)</a>
                            </li>
                        </ul>

            
                        <div className="tab-content">
                            <div className="tab-pane container active" id="ns">
                                <div className="row mt-2">
                                    <div className="col-md-6 texto">
                                        { size(cols) > 0 ?
                                        <table className="table table-sm table-striped table-bordered texto mt-5">
                                            <tbody>
                                            <tr>
                                                    <td>{cols[2]}</td>
                                                    <td><input type="text" id={cols[2]} value={this.state.cronico[cols[2]]} onChange={this.handleChange}/></td>
                                                </tr>
                                                <tr>
                                                    <td>{cols[3]}</td>
                                                    <td><input type="text" id={cols[3]} value={this.state.cronico[cols[3]]} onChange={this.handleChange}/></td>
                                                </tr>
                                                <tr>
                                                    <td>{cols[4]}</td>
                                                    <td><input type="text" id={cols[4]} value={cronico[cols[4]]} onChange={this.handleChange}/></td>
                                                </tr>
                                            </tbody>
                                        </table>
                                        : <table></table>}
                                    </div>
                                </div>
                            </div>
                            <div className="tab-pane container fade" id="esu">
                                <div className="row mt-2">
                                    <div className="col-md-8 texto">
                                        {size(cols) > 0 ?
                                            <table className="table table-sm table-striped table-bordered texto mt-5">
                                                <tbody>
                                                    {cols.map((col, index) =>
                                                        (index >=5  && index <= 36) ?
                                                            <tr>
                                                                <td>{cols[index]}</td>
                                                                <td>{cronico[cols[index]] != '1900-01-01' ? cronico[cols[index]] : ''}</td>
                                                                {/*<td><input type="text" id={cols[index]} value={cronico[cols[index]] != '1900-01-01' ? cronico[cols[index]] : ''} size="50"/></td>*/}
                                                            </tr>
                                                            : ''
                                                    )}
                                                </tbody>
                                            </table>
                                            : <table></table>}
                                    </div>
                                </div>
                            </div>
                            <div className="tab-pane container fade" id="mel">
                                <div className="row mt-2">
                                    <div className="col-md-8 texto">
                                        {size(cols) > 0 ?
                                            <table className="table table-sm table-striped table-bordered texto mt-5">
                                                <tbody>
                                                    {cols.map((col, index) =>
                                                        (index >=37  && index <= 39) ?
                                                            <tr>
                                                                <td>{cols[index]}</td>
                                                                {/*<td>{cronico[cols[index]] != '1900-01-01' ? cronico[cols[index]] : ''}</td>*/}
                                                                <td><input type="text" id={cols[index]} value={cronico[cols[index]] != '1900-01-01' ? cronico[cols[index]] : ''} size="50" onChange={this.handleChange}/></td>
                                                            </tr>
                                                            : ''
                                                    )}
                                                </tbody>
                                            </table>
                                            : <table></table>}
                                    </div>
                                </div>
                            </div>
                            <div className="tab-pane container fade" id="sico">
                                <div className="row mt-2">
                                    <div className="col-md-8 texto">
                                        {size(cols) > 0 ?
                                            <table className="table table-sm table-striped table-bordered texto mt-5">
                                                <tbody>
                                                    {cols.map((col, index) =>
                                                        (index >=40   && index <= 42) ?
                                                            <tr>
                                                                <td>{cols[index]}</td>
                                                                {/*<td>{cronico[cols[index]] != '1900-01-01' ? cronico[cols[index]] : ''}</td>*/}
                                                                <td><input type="text" id={cols[index]} value={cronico[cols[index]] != '1900-01-01' ? cronico[cols[index]] : ''} size="50" onChange={this.handleChange}/></td>
                                                            </tr>
                                                            : ''
                                                    )}
                                                </tbody>
                                            </table>
                                            : <table></table>}
                                    </div>
                                </div>
                            </div>
                            <div className="tab-pane container fade" id="ic">
                                <div className="row mt-2">
                                    <div className="col-md-8 texto">
                                        {size(cols) > 0 ?
                                            <table className="table table-sm table-striped table-bordered texto mt-5">
                                                <tbody>
                                                    {cols.map((col, index) =>
                                                        (index >= 43 && index <= 50) ?
                                                            <tr>
                                                                <td>{cols[index]}</td>
                                                                { cols[index] == "tipo_seguimiento" ?
                                                                    <td><select id={cols[index]} onChange={this.handleChange}>
                                                                        <option value={cronico[cols[index]]}>{cronico[cols[index]]}</option>
                                                                        <option value="EG">CPCLO</option>
                                                                        <option value="AT">ICP</option>
                                                                       
                                                                    </select></td> :
                                                                
                                                                cols[index] == "estado_seguimiento" ?
                                                                    <td><select id={cols[index]} onChange={this.handleChange}>
                                                                        <option value={cronico[cols[index]]}>{cronico[cols[index]]}</option>
                                                                        {this.state.estados.map((e) =>
                                                                            <option value={e}>{e}</option>

                                                                        )}
                                                                       
                                                                    </select></td> :
                                                                
                                                                cols[index] == "motivo_estado_seguimiento" ?
                                                                    <td><select id={cols[index]} onChange={this.handleChange}>
                                                                        <option value={cronico[cols[index]]}>{cronico[cols[index]]}</option>
                                                                        {this.state.motivos.map((e) =>
                                                                            <option value={e}>{e}</option>

                                                                        )}
                                                                    </select></td> :
                    
                                                                 cols[index] == "contingencia_origen_inicial" ?
                                                                 <td><select id={cols[index]} onChange={this.handleChange}>
                                                                     <option value={cronico[cols[index]]}>{cronico[cols[index]]}</option>
                                                                     <option value="EG">EG</option>
                                                                     <option value="AT">AT</option>
                                                                     <option value="EL">EL</option>
                                                                 </select></td> :

                                                                    <td><input type="text" id={cols[index]} value={cronico[cols[index]] != '1900-01-01' ? cronico[cols[index]] : ''} size="50" onChange={this.handleChange}/></td>  
                                                                }
                                                                
                                                            </tr>
                                                            : ''
                                                    )}
                                                </tbody>
                                            </table>
                                            : <table></table>}
                                    </div>
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

export default CronicoTab1;
