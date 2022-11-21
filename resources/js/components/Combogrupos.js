import React,{ useState, useEffect} from 'react'
import Axios from 'axios'

export default function Combogrupos(props){
    const [grupos,setGrupos]= useState([])
    
    const getGrupos = () => {
        let url ='list/grupos'
        Axios.get(url)
            .then(resp => {
                setGrupos(resp.data.data)
            })
            .catch(err =>{
                console.log(err)
            })
    }
   
    /*
    const handleIpsChange = (e) => {
        //props.handleIpsChange(e)
        console.log(e.target.value)
        putnitIps(e.target.value)
        putCodigo(e.target.value)
    }*/
    const handleGrupos = (e) => {
        //console.log(e.target.value)
        props.handleGrupos(e.target.value)
    }
    useEffect(getGrupos,[])

    return(
        <div className="form-group">
            <label htmlFor="grupoServicio">Grupo de servicio</label>
            <select id="grupoServicio" className="form-control" onChange={handleGrupos} value={props.value}>
            
                <option value={0}></option>
                {
                    grupos.map(grupo => <option key={grupo.id} value={grupo.id}>{grupo.grupo_servicio}</option>)
                }
            </select>
            <div className={props.error}>
                <div className={ ( props.error || "") + " redf"}>{ props.mensaje}</div>
            </div>
        </div>
    )
}