import React, { useState, useEffect } from 'react'
import Axios from 'axios'


export default function TableClasesa(props) {

    const eliminar = (u) => {
        props.handleEliminar(u.target.id)
    }
    const editar = (u) =>{
        const name = u.target.name.split('/');
        props.handleEdition(u.target.id,name,'Clase', null);
    }
    const clasesa = props.clasesa;
    //const { users } = this.state;
    const estadoTypes = ["Inactivo", "Activo"]
    return (
        <tbody>
            {Object.keys(clasesa).map((key) => (
                <tr key={key}><td></td><td>{clasesa[key]['clase']}</td>
                <td>{ clasesa[key]['abbr'] }</td>
                <td>{estadoTypes[clasesa[key]['activo']]}</td>
                    <td><button className="btn btn-warning btn-sm" id={clasesa[key]['id']} name={clasesa[key]['clase']+'/'+clasesa[key]['abbr']} onClick={editar}>Editar</button></td>
                </tr>
            ))}
        </tbody>

    );

}
