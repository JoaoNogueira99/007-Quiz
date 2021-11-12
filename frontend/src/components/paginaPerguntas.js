import React from "react";
import "./paginaPerguntas.css"



function Pergunta({ pergunta }) {
    
    return <div className="pergunta">{pergunta}</div>

}

function Pontuacao({ pontuacao }) {
    return <div className="pontuacao">{pontuacao}</div>
}


function Temporizador({temporizador}) {
        return <div className="temporizador">{Math.trunc(temporizador)}
        </div>
}

function Respostas({ onSelect, respostas, respostaEliminada }) {
    if (respostas.length === 0) return <div />
    return <div>
        <div className="respostas">
            <button disabled={respostas[0].key === respostaEliminada} onClick={() => onSelect(respostas[0].key)}>{respostas[0].text}</button> 
            <button disabled={respostas[1].key === respostaEliminada} onClick={() => onSelect(respostas[1].key)}>{respostas[1].text}</button>
        </div>
        <div className="respostas">
            <button disabled={respostas[2].key === respostaEliminada} onClick={() => onSelect(respostas[2].key)}>{respostas[2].text}</button>
            <button disabled={respostas[3].key === respostaEliminada} onClick={() => onSelect(respostas[3].key)}>{respostas[3].text}</button>
        </div>
    </div>
}

function Jokers({ onUse, jokers }) {
    return (
        <div>
            <div  className="jokers">
                {jokers.map((jokers, index) =>
                <button disabled={!jokers} onClick={() => onUse()} key={index.toString()}
                    value={jokers}>
                        <img src="/jokerbala.png"/>
                    </button>
            )}
            </div>

            
        </div>
    );
}

export { Pergunta, Pontuacao, Respostas, Jokers, Temporizador};