import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import TableIps from './TableIps.js';
import Modal from "react-bootstrap/Modal";

import axios from 'axios';

class IpsAdmin extends Component {
    constructor(props) {
        super(props);

        this.state = {
            ips: '',
            modalOpen: false,
            nuevo:'oculto',
            name: {},
            errors : {

            },
            errorMensajes :{

            },
            IdEditar:''
        }
        // bind
        this.getSystemIps = this.getSystemIps.bind(this);

        this.handleSubmit = this.handleSubmit.bind(this);
        this.validarForm = this.validarForm.bind(this);
        this.clearErrors = this.clearErrors.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleCrear = this.handleCrear.bind(this);
        this.handleGuardar = this.handleGuardar.bind(this);
        this.handleEdition = this.handleEdition.bind(this);
        this.handleEliminar = this.handleEliminar.bind(this);
        this.handleCerrarModal = this.handleCerrarModal.bind(this);

        this.getSystemIps();
    }

    handleCrear() {
        this.setState({
            nuevo:'visible'
          });
    }

    handleChange({ target }) {
        this.setState({
          [target.name]: target.value
        });
    }

    handleEdition(id,name){
        this.setState({
            modalOpen: true,
            name: name,
            IdEditar:id
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
        let url = 'parametro/ips/agregar'
        let cod_sede = document.getElementsByName('crear_cod_sede')[0].value
        let nombre_sede = document.getElementsByName('crear_nombre_sede')[0].value
        let cod_habilitacion = document.getElementsByName('crear_cod_habilitacion')[0].value
        let direccion = document.getElementsByName('crear_direccion')[0].value
        let telefono = document.getElementsByName('crear_telefono')[0].value
        let razon_social = document.getElementsByName('crear_razon_social')[0].value
        let nit = document.getElementsByName('crear_nit')[0].value
        let estado = 'S'
        axios.post(url, {cod_sede:cod_sede,nombre_sede:nombre_sede,estado:estado,cod_habilitacion:cod_habilitacion,direccion:direccion,telefono:telefono,razon_social:razon_social,nit:nit})
            .then(resp => {
                this.props.showToast(resp.data.data,'success')
                this.setState({
                    ips: [...this.state.ips, resp.data.row],
                    nuevo: 'oculto'
                });
            })
            .catch(err => {
                this.props.showToast('¡Ups! Ha ocurrido un Error, por favor verifica los datos e intenta nuevamente','error')
            })
    }
    handleGuardar(e){
        e.preventDefault();
        let id = this.state.IdEditar
        let url = `parametro/ips/${id}/editar`
        let cod_sede = document.getElementsByName('editar_cod_sede')[0].value
        let nombre_sede = document.getElementsByName('editar_nombre_sede')[0].value
        let cod_habilitacion = document.getElementsByName('editar_cod_habilitacion')[0].value
        let direccion = document.getElementsByName('editar_direccion')[0].value
        let telefono = document.getElementsByName('editar_telefono')[0].value
        let razon_social = document.getElementsByName('editar_razon_social')[0].value
        let nit = document.getElementsByName('editar_nit')[0].value
        let estado = 'S'
        axios.put(url, {cod_sede:cod_sede,nombre_sede:nombre_sede,estado:estado,cod_habilitacion:cod_habilitacion,direccion:direccion,telefono:telefono,razon_social:razon_social,nit:nit})
            .then(resp => {
                this.props.showToast(resp.data.data,'success')
                this.getSystemIps()
                this.setState({
                    ips: [...this.state.ips]
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
    getSystemIps() {
        let url = 'getSystemIps'
        axios.get(url)
            .then(resp => {
                this.setState({
                    ips: resp.data.data,
                });

            })
            .catch(err => {
                this.props.showToast('¡Ups! Ha ocurrido un Error, por favor verifica los datos e intenta nuevamente','error')
            })

    }

    render() {
        const { ips } = this.state;
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
                                            <table className="container">
                                                <tr className="row">
                                                    <td className="col"><label>Código Sede <input type="text" className="form-control" id="nombre" name="crear_cod_sede" onChange={this.handleChange} required></input></label></td>
                                                    <td className="col"><label>Nombre Sede <input type="text" className="form-control" id="nombre" name="crear_nombre_sede" onChange={this.handleChange} required></input></label></td>
                                                </tr>
                                                <tr className="row">
                                                    <td className="col"><label>Cód. Habilitación <input type="text" className="form-control" id="nombre" name="crear_cod_habilitacion" onChange={this.handleChange} required></input></label></td>
                                                    <td className="col"><label>Dirección <input type="text" className="form-control" id="nombre" name="crear_direccion" onChange={this.handleChange} required></input></label></td>
                                                </tr>
                                                <tr className="row">
                                                    <td className="col"><label>Teléfono <input type="text" className="form-control" id="nombre" name="crear_telefono" onChange={this.handleChange} required></input></label></td>
                                                    <td className="col"><label>Razón Social <input type="text" className="form-control" id="nombre" name="crear_razon_social" onChange={this.handleChange} required></input></label></td>
                                                </tr>
                                                <tr className="row">
                                                    <td className="col"><label>Nit <input type="text" className="form-control" id="nombre" name="crear_nit" onChange={this.handleChange} required></input></label></td>
                                                    <td className="col align-self-center"><button type="submit" className="btn btn-success btn-sm " >Guardar</button></td>
                                                </tr>
                                            </table>
                                            <div className={this.state.errors['nombre']}>
                                                <div className={"redf  " + (this.state.errors['nombre'] || "")}>{this.state.errorMensajes['nombre']}</div>
                                            </div>
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
                            <div className="card-header bg2 titulo"></div>
                            <div className="card-body texto">
                                <table className="table table-hover table-sm">
                                    <thead>
                                        <tr>
                                            <th scope="col"></th>
                                            <th scope="col">Código Sede</th>
                                            <th scope="col">Nombre Sede</th>
                                            <th scope="col">Cod. Habilitación</th>
                                            <th scope="col">Dirección</th>
                                            <th scope="col">Teléfono</th>
                                            <th scope="col">Razón Social</th>
                                            <th scope="col">Nit</th>
                                            <th scope="col">Departamento</th>
                                            <th scope="col">Municipio</th>
                                            <th scope="col">Cod Municipio</th>
                                        </tr>
                                    </thead>
                                    <TableIps ips={ips} handleEdition ={this.handleEdition} handleEliminar ={this.handleEliminar}/>

                                </table>
                            </div>
                        </div>
                    </div>
                </div>
                <Modal show={this.state.modalOpen}>
                    <Modal.Header>IPS</Modal.Header>
                    <Modal.Body>
                        <div className="container">
                            <div className="row">
                                <div className="col-12">
                                    <form id="editarIps" onSubmit={ this.handleGuardar }>
                                        <div className="form-group">
                                            <label htmlFor="codigo">Código sede</label>
                                            <input type="text" className="form-control form-control-sm" name="editar_cod_sede" defaultValue={this.state.name[0]} onChange={this.handleChange } required/>
                                        </div>

                                        <div className="form-group">
                                            <label htmlFor="codigo">Nombre sede</label>
                                            <input type="text" className="form-control form-control-sm" name="editar_nombre_sede" defaultValue={this.state.name[1]} onChange={this.handleChange } required/>
                                        </div>

                                        <div className="form-group">
                                            <label htmlFor="codigo">Cod. Habilitación</label>
                                            <input type="text" className="form-control form-control-sm" name="editar_cod_habilitacion" defaultValue={this.state.name[2]} onChange={this.handleChange } required/>
                                        </div>

                                        <div className="form-group">
                                            <label htmlFor="codigo">Dirección</label>
                                            <input type="text" className="form-control form-control-sm" name="editar_direccion" defaultValue={this.state.name[3]} onChange={this.handleChange } required/>
                                        </div>

                                        <div className="form-group">
                                            <label htmlFor="codigo">Teléfono</label>
                                            <input type="text" className="form-control form-control-sm" name="editar_telefono" defaultValue={this.state.name[4]} onChange={this.handleChange } required/>
                                        </div>

                                        <div className="form-group">
                                            <label htmlFor="codigo">Razón social</label>
                                            <input type="text" className="form-control form-control-sm" name="editar_razon_social" defaultValue={this.state.name[5]} onChange={this.handleChange } required/>
                                        </div>

                                        <div className="form-group">
                                            <label htmlFor="codigo">Nit</label>
                                            <input type="text" className="form-control form-control-sm" name="editar_nit" defaultValue={this.state.name[6]} onChange={this.handleChange } required/>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>

                    </Modal.Body>
                    <Modal.Footer>
                        <button type="submit" form="editarIps" className="btn btn-primary btn-sm" >Guardar</button>
                        <button className="btn btn-primary btn-sm" onClick={ this.handleCerrarModal }>Cerrar</button>
                    </Modal.Footer>
                </Modal>
            </div>
        );
    }

}

export default IpsAdmin;
/*
if (document.getElementById('menuUsuarios')) {
    ReactDOM.render(<MenuUsuarios />, document.getElementById('menuUsuarios'));
}
*/
