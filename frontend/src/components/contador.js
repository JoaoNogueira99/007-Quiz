import React from "react";

class Contador extends React.Component {
    constructor(props) {
        super(props);
        this.state = { 
            
        }
        // this.incrementa = this.incrementa.bind(this)
        // this.fetchContador = this.fetchContador.bind(this)
        // this.ws = new WebSocket('ws://localhost:8080')
    }

    async incrementa() {
        await fetch("/api/contador", {
            method: 'POST',

        })
        // this.fetchContador() nao precisamos desta linha com websocket
    }

    componentDidMount() {
        this.fetchContador()
        //this.intervalId = setInterval(this.Contador, 2000)

        // this.addEventListener('open',  () => {
        //   this.ws.send('something');
        // });

        this.ws.addEventListener('message', (event) => {
         if (event.data === 'update') {
           this.fetchContador()
         }

        });
    }

    fetchContador() {  //para ir aceder ao backend
        fetch("/api/contador")
            .then(response => response.json())
            .then(json => this.setState({
                contador: json.contador
            }))
    }



    render() {
        // this.props.maximo
        // 1. Adicionar botão para decrementar
        // 2. Garantir que o contador não desce abaixo de 0, nem sobe acima de this.props.maximo
        return (
            <section>
                <p>{this.state.contador}</p>
                <button
                    onClick={async () => {
                        try {
                            const resawait =  fetch("/api/contador", {
                                method: 'POST'
                            })
                        } catch(err){
                            console.log(err)
                        }
                        }}>Incrementar</button>
            </section>
        )
    }
}

export default Contador;