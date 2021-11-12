import React from "react";
import "./paginaInicial.css"


function Jogar({ onStart }) {


    return <div>

        <video autoPlay muted loop className="videoinicio">
            <source src="/videofundo.mp4" type="video/mp4" />
        </video>

        <img className="titulo" src="./titulopagina.png" type="img" />
        
        <button className="primeiro" onClick={onStart}>Aceitar Contrato</button>
    </div>

}

export default Jogar;