const express = require("express");
const cors = require("cors");
const app = express();

app.use(express.json());
app.use(cors());

const PORT = 3001;

app.listen(PORT , () => {
    console.log(`Servidor rodando na porta ${PORT}`)
});

let usuarios = [
    {id: 1, nome: "Micael", idade: 16},
    {id: 1, nome: "Micael", idade: 16},
    {id: 1, nome: "Micael", idade: 16},
    {id: 1, nome: "Micael", idade: 16}
]

app.get("/", (require , response) => {
    response.send("Testando a API")
})

app.get("/usuarios/:id", (require , response) => {
    const id = require.params.id
    const usuario = usuarios.find(user => user.id == id)

    response.json(usuario)
})

app.get("/usuarios", (require , response) => {
    response.json(usuarios)
})