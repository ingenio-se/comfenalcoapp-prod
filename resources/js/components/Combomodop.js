import React,{ useState, useEffect} from 'react'
import Axios from 'axios'

export default function Combomodop(props){
    const [modop,setModop]= useState([])
    
    const getModop = () => {
        let url ='list/modop'
        Axios.get(url)
            .then(resp => {
                setModop(resp.data.data)
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
    const handleModop = (e) => {
        //console.log(e.target.value)
        props.handleModop(e.target.value)
    }
    useEffect(getModop,[])

    return(
        <div className="form-group">
            <label htmlFor="modoPrestacion">Modo prestación</label>
            <select id="modoPrestacion" className="form-control" onChange={handleModop} value={props.value}>
                <option value={0}></option>
                {
                    modop.map(modop => <option key={modop.id} value={modop.id}>{modop.modo_prestacion}</option>)
                }
            </select>
            <div className={props.error}>
                <div className={ ( props.error || "") + " redf"}>{ props.mensaje}</div>
            </div>
        </div>
    )
}