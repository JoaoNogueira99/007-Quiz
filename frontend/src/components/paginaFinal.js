import React from "react";
import "./paginaFinal.css"

function ReinicarJogo({ onStart }) {
  
    return <div>
        <img src="/backgroun007.gif"/>
        <button onClick={onStart}>Jogar novamente</button></div> 
}

export default ReinicarJogo