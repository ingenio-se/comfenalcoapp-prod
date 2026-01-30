import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import CausasAdmin from './CausasAdmin.js';
import Cie10Admin from './Cie10Admin.js';
import EstadosAdmin from './EstadosAdmin';
import DiasmaxAdmin from './DiasmaxAdmin';
import IpsAdmin from './IpsAdmin';
import DerechosAdmin from './DerechosAdmin';

class MenuGenerales extends Component {
    constructor(props) {
        super(props);

        // bind

    }

    render() {

        const { showToast } = this.props;

        return (
            <div>
                <ul className="nav nav-tabs">
                    <li className="nav-item">
                        <a className="nav-link active" data-toggle="tab" href="#ce">Causa externa</a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link" data-toggle="tab" href="#cie10">Cie10-11</a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link" data-toggle="tab" href="#diase">Días especialidades</a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link" data-toggle="tab" href="#estados">Estados</a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link" data-toggle="tab" href="#ips">Ips</a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link" data-toggle="tab" href="#validacion">Validación derechos</a>
                    </li>
                </ul>


                <div className="tab-content">
                    <div className="tab-pane container active" id="ce"><CausasAdmin showToast={showToast}/></div>
                    <div className="tab-pane container fade" id="cie10"><Cie10Admin /></div>
                    <div className="tab-pane container fade" id="diase"><DiasmaxAdmin showToast={showToast}/></div>
                    <div className="tab-pane container fade" id="estados"><EstadosAdmin showToast={showToast}/></div>
                    <div className="tab-pane container fade" id="ips"><IpsAdmin showToast={showToast}/></div>
                    <div className="tab-pane container fade" id="validacion"><DerechosAdmin showToast={showToast}/></div>

                </div>
            </div>
        );
    }

}

export default MenuGenerales;

