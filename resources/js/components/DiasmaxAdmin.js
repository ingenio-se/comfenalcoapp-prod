import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import TableDiasmax from './TableDiasmax.js';
import Modal from "react-bootstrap/Modal";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from 'axios';


class DiasmaxAdmin extends Component {
    constructor(props) {
        super(props);

        this.state = {
            esp: '',
            esped:'',
            diasmax:'',
            nuevo: 'oculto',
            modalOpen:false,
            nombre: '',
            errors : {
                nombre : 'oculto',
            },
            errorMensajes :{
                nombre : '',
            },
            IdEditar:''
        }

        // bind
        this.getSystemDiasmax = this.getSystemDiasmax.bind(this);

        this.handleSubmit = this.handleSubmit.bind(this);
        this.validarForm = this.validarForm.bind(this);
        this.clearErrors = this.clearErrors.bind(this);
        this.handleChange=this.handleChange.bind(this);
        this.handleEdition = this.handleEdition.bind(this);
        this.handleCrear = this.handleCrear.bind(this);
        this.handleGuardar = this.handleGuardar.bind(this);
        this.handleEliminar = this.handleEliminar.bind(this);
        this.handleCerrarModal = this.handleCerrarModal.bind(this);
        this.getSystemDiasmax();
    }

    handleCrear(){
        this.setState({
            nuevo:'visible'
          });
    }

    handleEdition(id,esped){

        this.setState({
            esped:esped[0],
            diasmax: esped[1],
            modalOpen: true,
            IdEditar: id
        });
    }
    handleChange({ target }) {
        this.setState({
          [target.name]: target.value
        });
    }
    handleCerrarModal(){
        this.setState({

            modalOpen: false,
          });
    }
    handleEliminar(id){

    }
    handleSubmit(e){
        e.preventDefault();
        let url = 'parametro/diasmax/agregar'
        let especialidad = document.getElementsByName('crear_especialidad')[0].value
        let dias_maximos = document.getElementsByName('asignar_dias_maximos')[0].value
        axios.post(url, {dias_maximos: dias_maximos, especialidad: especialidad})
            .then(resp => {
                this.props.showToast(resp.data.data,'success')
                this.setState({
                    esp: [...this.state.esp, resp.data.row],
                    nuevo: 'oculto'
                });
            })
            .catch(err => {
                this.props.showToast('¡Ups! Ha ocurrido un Error, por favor verifica los datos e intenta nuevamente','error')
            })
    }
    handleGuardar(e){
        e.preventDefault();
        let id = this.state.IdEditar;
        console.log(id)
        let url = `parametro/diasmax/${id}/editar`
        let especialidad = document.getElementsByName('editar_especialidad')[0].value
        let dias_maximos = document.getElementsByName('diasmax')[0].value
        axios.put(url, {dias_maximos: dias_maximos, especialidad: especialidad})
            .then(resp => {
                this.props.showToast(resp.data.data,'success')
                this.getSystemDiasmax()
                this.setState({
                    esp: [...this.state.esp]
                });
                this.handleCerrarModal()
            })
            .catch(err => {
                this.props.showToast('¡Ups! Ha ocurrido un Error, por favor verifica los datos e intenta nuevamente','error')
            })
    }
    validarForm() {

    }
    clearErrors(){

    }
    getSystemDiasmax() {
        let url = 'getSystemDiasmax'
        axios.get(url)
            .then(resp => {
                this.setState({
                    esp: resp.data.data,
                });

            })
            .catch(err => {
                this.props.showToast('¡Ups! Ha ocurrido un Error, por favor verifica los datos e intenta nuevamente','error')
            })

    }

    render() {
        const { esp } = this.state;
        return (
            <div>
                <br/>
                <button className="btn btn-success btn-sm" onClick={this.handleCrear}>+ Crear</button>
                <form onSubmit={this.handleSubmit} className="row mt-2">
                    <div className={this.state.nuevo}>
                        <div className="col-md-12">
                            <div className="card">
                                <div className="card-body texto">
                                    <div className="row">
                                        <div className="col-sm-12">
                                            <table>
                                                <tr>
                                                    <td>Especialidad</td>
                                                    <td><input type="text" className="form-control" id="nombre" name="crear_especialidad" defaultValue='' onChange={this.handleChange} required></input></td>
                                                </tr>
                                                <tr>
                                                    <td>Días máximos</td>
                                                    <td><input type="number" className="form-control" id="nombre" name="asignar_dias_maximos" onChange={this.handleChange} required></input></td>
                                                </tr>
                                                <tr>
                                                    <td><button type="submit" className="btn btn-success btn-sm" >Guardar</button></td>
                                                </tr>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
                <div className="row mt-5">
                    <div className="col-md-12">
                        <div className="card">
                            <div className="card-header bg2 titulo">Días máximos por especialidad</div>
                            <div className="card-body texto">
                                <table className="table table-hover table-sm">
                                    <thead>
                                        <tr>
                                            <th scope="col"></th>
                                            <th scope="col">Especialidad</th>
                                            <th scope="col">Días máximos</th>
                                            <th scope="col">Días máximos retroactivo</th>
                                            <th scope="col">Días máximos prospectivo</th>
                                            <th scope="col"></th>
                                        </tr>
                                    </thead>
                                    <TableDiasmax esp={esp} handleEdition ={this.handleEdition} handleEliminar ={this.handleEliminar}/>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>

                <Modal show={this.state.modalOpen}>
                    <Modal.Header>Días máximos</Modal.Header>
                    <Modal.Body>
                        <div className="container">
                            <div className="row">
                                <div className="col-12">
                                    <form id="editarDias" onSubmit={ this.handleGuardar }>
                                        <div className="form-group">
                                            <label htmlFor="codigo">Especialidad</label>
                                            <input type="text" className="form-control form-control-sm" name="editar_especialidad" defaultValue={this.state.esped} onChange={this.handleChange } required/>
                                        </div>

                                        <div className="form-group">
                                            <label htmlFor="capitulo_grupo">Días máximos</label>
                                            <input type="number"  min='0' className="form-control form-control-sm" name="diasmax" defaultValue={this.state.diasmax} onChange={this.handleChange } required/>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>

                    </Modal.Body>
                    <Modal.Footer>
                        <button form="editarDias" type="submit" className="btn btn-primary btn-sm" >Guardar</button>
                        <button className="btn btn-primary btn-sm" onClick={ this.handleCerrarModal }>Cerrar</button></Modal.Footer>
                </Modal>

            </div>
        );
    }

}

export default DiasmaxAdmin;
/*
if (document.getElementById('menuUsuarios')) {
    ReactDOM.render(<MenuUsuarios />, document.getElementById('menuUsuarios'));
}
*/
