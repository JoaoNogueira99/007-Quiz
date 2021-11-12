import Contador from './components/contador'
import './App.css';
import { Component } from 'react';
import React from 'react';
import Jogar from './components/paginaInicial';
import { Pergunta, Pontuacao, Respostas, Jokers, Temporizador } from './components/paginaPerguntas';
import ReinicarJogo from './components/paginaFinal';




 
class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      pagina: "inicial", // para mudar usar o setState. mudar para jogo e fim
      perguntaAtual: 1,
      respostas: [],
      // respostaDesativada: "",
      jokers: [],
      pontuacao: 0,
      temporizador: 10,
      respostaEliminada: ''

    }
  }

  //fazer o temporizador para ir atualizando a pergunta.
  componentDidUpdate(pp, prevState) { // nao usar componentDidMount, mas sim com o didUpdate,  porque quero fazer setTimeOut qndo atualizo o estado.
    if (this.state.pagina === "jogo" && (this.state.pergunta !== prevState.pergunta || this.state.pagina !== prevState.pagina)) {


      // clearTimeout(this.perguntaAtual);
      // this.perguntaAtual = setTimeout(
      //   () => this.setState({ perguntaAtual: this.state.perguntaAtual + 1 }), 30000);
     

      this.fetchPerguntaAtual()
    }
  }

  componentDidMount() {
    this.timer = setInterval(() => {
      this.setState((state) => {
        if(state.temporizador < 0) {
          this.fetchPerguntaAtual()
          return {} // faz com que nao haja modificaçao nenhuma no state
        }
        return {temporizador: state.temporizador - 1}
      })
    }, 1000)
  }

  componentWillUnmount() {
    clearInterval(this.timer)
    clearTimeout(this.state.perguntaAtual);
  }

  fetchPerguntaAtual() {  //para ir aceder ao backend
    fetch(`/api/game/${this.state.game}/question`)
      .then(response => response.json())
      .then(json => {
        console.log(json)
        this.setState({
          pergunta: json.question,
          respostas: json.options,
          respostaEliminada: "",
          perguntaAtual: json.perguntaAtual, temporizador: json.temporizador
        })
        this.fetchPontuacao()
        this.fetchJokers()

      })
  }

  fetchPontuacao() {
    fetch(`/api/game/${this.state.game}/pontuacao`)
      .then(response => response.json())
      .then(json => {
        console.log(json)
        this.setState({
          pontuacao: json.pontuacao

        })
      })
  }



  fetchJokers() {
    fetch(`/api/game/${this.state.game}/jokers`)
      .then(response => response.json())
      .then(json => {
        console.log(json)
        this.setState({
          jokers: json.jokers

        })
      })
  }

  


  render() { // definimos qual é o jsx que vai ser retornado
    console.log(this.state) // console.log da pagina inicial
    if (this.state.pagina === "inicial") { // se estivermos na pagina inicial

      return <Jogar onStart={() => {
        fetch("/api/game", {
          method: 'POST',
        })
          .then(response => response.json())
          .then(json => this.setState({
            game: json.id,
            pagina: 'jogo'
          }))
      }} /> // aparece um componente jogar com o botao que nos leva para a pagina jogo
    }
    if (this.state.pagina === "jogo" && this.state.perguntaAtual < 25) {
      return <div className="paginaPerguntas" style={{backgroundImage:'url(./fundo-da-pagina.png'}}>
       <div className="estilopontos">Pontuação<Pontuacao pontuacao={this.state.pontuacao} /> </div>
        <div className="perguntanumero">{this.state.perguntaAtual + 1}/25</div>
        <div className="tempos"><Temporizador temporizador={this.state.temporizador}/></div>
        <Pergunta pergunta={this.state.pergunta} />
        
        <Respostas
          respostas={this.state.respostas}
          respostaEliminada={this.state.respostaEliminada}
          // respostaDesativada={this.state.respostaDesativada}
          onSelect={async (chave) => { // por aqui fetch para enviar as respostas para o servidor 
            try {
              const res = await fetch(`/api/game/${this.state.game}/answer`, { // passar resposta para o backend
                method: 'POST',
                body: JSON.stringify({ chave }), // converter objeto JSON em string
                headers: {
                  "Content-Type": "application/json"
                }
              })

              this.fetchPerguntaAtual()

            } catch (err) {
              console.error(err)
            }
            // 
            // console.log(chave)
          }
          }

        />
        {/* falta aparecer número da pergunta */}
        
        <Jokers jokers={this.state.jokers}
          onUse={async () => {
            if (this.state.respostaEliminada !== '') return
            // Fazer Fetch:
            const res = await fetch(`/api/game/${this.state.game}/jokers`, { // passar resposta para o backend
              // POST /api/game/:id/jokers
              method: 'POST',

            })
            const guardarResposta = await res.json()

            // Guardar no state a resposta escolhida
            this.setState({ respostaEliminada: guardarResposta.errada })
            // Depois, atualizar os Jokers com this.fetchJokers()
            this.fetchJokers()
           
          }} />
           
      </div>;
      } else {
        
        return <div className="finaltudo" style={{backgroundImage:'url(./backgroun007.png'}}>
          <div >
          <ReinicarJogo onStart={() => {
          this.setState({
              pagina: 'inicial'
            })
        }} />
        <div className="pontosfinais">Pontuação Final<Pontuacao pontuacao={this.state.pontuacao} /></div>
        </div> 
        </div>
      }
      
    }
  }



export default App;