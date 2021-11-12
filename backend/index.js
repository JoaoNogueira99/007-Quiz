import express from "express";
import * as fs from "fs/promises"
const app = express()
const port = 3001
const DB_FILE = "db.json"

app.use(express.json())

app.get("/api", (req, res) => res.send("Working"))

app.get("/api/contador", async (req, res) => {
    try {
        // Ler o ficheiro para um array
        const conteudo = await fs.readFile(DB_FILE)
        const db = JSON.parse(conteudo.toString())

        res.status(200).json({contador: db.contador})
    } catch (err) {
        res.status(500).send("Erro a ler as mensagens")
    }
})

app.post("/api/contador", async (req, res) => {
    try {
        // Ler o ficheiro para um array
        const conteudo = await fs.readFile(DB_FILE)
        const db = JSON.parse(conteudo.toString())

        console.log(req.body)

        // Adicionar ao array a mensagem recebida
        db.contador += 1
        // Gravar o array novamente no ficheiro
        await fs.writeFile(DB_FILE, JSON.stringify(db, null, 2))

        // No final, enviar o estado 201
        res.sendStatus(201)
    } catch (err) {
        res.status(500).send("Erro a adicionar a mensagem")
    }
})

app.listen(port, () => console.log(`Ready on ${port}`))