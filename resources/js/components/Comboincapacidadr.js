import React,{ useState, useEffect} from 'react'
import Axios from 'axios'

export default function Comboincapacidadr(props){
    const [incar,setIncar]= useState([])
    
    const getIncar = () => {
        let url ='list/incar'
        Axios.get(url)
            .then(resp => {
                setIncar(resp.data.data)
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
    const handleIncar = (e) => {
        //console.log(e.target.value)
        props.handleIncar(e.target.value)
    }
    useEffect(getIncar,[])

    return(
        <div className="form-group">
            <label htmlFor="incaR">Incapacidad retroactiva</label>
            <select id="incaR" className="form-control" onChange={handleIncar} value={props.value}>
                <option value={0}></option>
                {
                    incar.map(incar => <option key={incar.id} value={incar.id}>{incar.incapacidad_retroactiva}</option>)
                }
            </select>
            <div className={props.error}>
                <div className={ ( props.error || "") + " redf"}>{ props.mensaje}</div>
            </div>
        </div>
    )
}