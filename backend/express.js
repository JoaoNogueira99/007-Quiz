import express from "express";
import * as fs from "fs/promises"
const app = express()
const port = 3001
const DB_FILE = "jogo.json"

app.use(express.json())

app.get("/api/", (req, res) => res.send("Working"))

function escolherPerguntas(questions) { // filtrar as questions por nivel de dificuldade
    const easyQuestions = questions.filter(question => question.level === "easy");
    const mediumQuestions = questions.filter(question => question.level === "medium");
    const hardQuestions = questions.filter(question => question.level === "hard");


    return [
        ...geraNumerosAleatorios(10, easyQuestions.length).map(i => easyQuestions[i]), // o map esta a transformar o indice no numero da pergunta
        ...geraNumerosAleatorios(10, mediumQuestions.length).map(i => mediumQuestions[i]),
        ...geraNumerosAleatorios(5, hardQuestions.length).map(i => hardQuestions[i]),

    ]
}


app.get("/api/teste", (req, res) => res.send(criarJogo()))

function geraNumerosAleatorios(n, x) { // vai gerar numeros random entre 0 e 10 ou 5(neste caso), e com o Set nao se repete nenhum numero.
    let numbers = new Set()
    while (numbers.size < n) {
        numbers.add(geraAleatorio(x))
    }
    return Array.from(numbers)
}

function geraAleatorio(number) { //gerar numeros aleatorios entre 0 e 1
    const aleatorio = Math.floor(Math.random() * number)
    return aleatorio
}

app.get("/api/game/:id/question", async (req, res) => {
    try {
        // Ler o ficheiro para um array
        const conteudo = await fs.readFile(DB_FILE)
        const db = JSON.parse(conteudo.toString())
        const id = parseInt(req.params.id)
        const jogo = db.game[id]


        if (jogo.perguntaAtual > jogo.perguntas.length - 1) {
            res.status(200).json({ perguntaAtual: jogo.perguntas.length })
            return
        }
        let pergunta = jogo.perguntas[jogo.perguntaAtual]
        if (!pergunta.dataExpiracao) {// 
            const dataExpiracao = new Date().valueOf() + 30000
            pergunta.dataExpiracao = dataExpiracao

            await fs.writeFile(DB_FILE, JSON.stringify(db, null, 2))
        } else if (pergunta.dataExpiracao < new Date().valueOf()) {
            jogo.perguntaAtual += 1

            if (jogo.perguntaAtual > jogo.perguntas.length - 1) {
                res.status(200).json({ perguntaAtual: jogo.perguntas.length })
                return
            }
            pergunta = jogo.perguntas[jogo.perguntaAtual]
            const dataExpiracao = new Date().valueOf() + 30000 // definir nova data de expiraçao para a proxima pergunta.
            pergunta.dataExpiracao = dataExpiracao
            await fs.writeFile(DB_FILE, JSON.stringify(db, null, 2))// grava a atualizaçao da pergunta atual.
        }
        delete pergunta.answer
        res.status(200).json({ ...pergunta, perguntaAtual: jogo.perguntaAtual, temporizador: (pergunta.dataExpiracao - new Date().valueOf()) / 1000 })
    } catch (err) {

    }
})

app.get("/api/game/:id/pontuacao", async (req, res) => { 
    try {
        const conteudo = await fs.readFile(DB_FILE)
        const db = JSON.parse(conteudo.toString())
        const id = parseInt(req.params.id)
        const jogo = db.game[id]
        console.log(jogo.pontuacao)
        res.status(200).json({ pontuacao: jogo.pontuacao })
    } catch (err) {
        console.log(err)
    }
})

app.get("/api/game/:id/jokers", async (req, res) => { // ir buscar os jokers
    try {
        const conteudo = await fs.readFile(DB_FILE)
        const db = JSON.parse(conteudo.toString())
        const id = parseInt(req.params.id)
        const jogo = db.game[id]
        console.log(jogo.jokers)
        res.status(200).json({ jokers: jogo.jokers })
    } catch (err) {
        console.log(err)
    }
})

app.post("/api/game/:id/jokers", async (req, res) => { // para usar os jokers e desativar a pergunta
    try {
        const conteudo = await fs.readFile(DB_FILE)
        const db = JSON.parse(conteudo.toString())

        const id = parseInt(req.params.id)
        const jogo = db.game[id]
        const pergunta = jogo.perguntas[jogo.perguntaAtual]
        jogo.jokers.pop()// para tirar um joker do array

        const erradas = pergunta.options.filter(e => e.key !== pergunta.answer)
        const indiceEscolhido = geraAleatorio(erradas.length) // da me o indice de uma errada aleatoriamente
        const errada = erradas[indiceEscolhido].key


        await fs.writeFile(DB_FILE, JSON.stringify(db, null, 2))

        // No final, enviar o estado 201
        res.status(200).json({ errada }) // envia objeto com a propriedade errada com a chave escolhida
    } catch (err) {
        res.status(500).send("Erro")

    }
})


app.post("/api/game", async (req, res) => {
    try {
        // Ler o ficheiro para um array
        const conteudo = await fs.readFile(DB_FILE)
        const db = JSON.parse(conteudo.toString())

        const perguntas = await fs.readFile("perguntas.json") // vai buscar as perguntas ao perguntas.json
        const dbperguntas = JSON.parse(perguntas.toString())
        const perguntasEscolhidas = escolherPerguntas(dbperguntas.questions)

        // const pontos = atribuirPontos()


        // Adicionar ao array a pergunta recebida
        const id = db.game.length
        db.game.push({
            id: id,// nº de jogos que ja foram criados
            perguntas: perguntasEscolhidas,
            respostas: 0,
            jokers: [true, true, true, true, true, true, true],
            user: "",
            perguntaAtual: 0,
            pontuacao: 0,
            temporizador: 10

        })
        // Gravar o array novamente no ficheiro
        await fs.writeFile(DB_FILE, JSON.stringify(db, null, 2))
        res.status(200).json({ id: id })
    } catch (err) {
        console.log(err)
        res.status(500).send("Erro")
    }
})

app.post("/api/game/:id/answer", async (req, res) => {
    try {
        const conteudo = await fs.readFile(DB_FILE)
        const db = JSON.parse(conteudo.toString())

        const id = parseInt(req.params.id)
        const jogo = db.game[id]
        jogo.perguntaAtual += 1
        console.log(req.body)
        const pergunta = jogo.perguntas[jogo.perguntaAtual - 1]
        if (req.body.chave === pergunta.answer) {
            console.log("certo")
            jogo.pontuacao += 100
        } else {
            console.log("errado")
            jogo.pontuacao = Math.max(0, jogo.pontuacao - 300)
        }

        await fs.writeFile(DB_FILE, JSON.stringify(db, null, 2))

        // No final, enviar o estado 201
        res.sendStatus(201)
    } catch (err) {
        res.status(500).send("Erro")

    }
})


app.listen(port, () => console.log(`Ready on ${port}`))

