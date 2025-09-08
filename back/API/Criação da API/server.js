const express = require("express");
const app = express();

const PORT = 3000;

app.use(PORT , () => {
    console.log(`Servidor rodando na porta ${PORT}`)
});

let usuarios = [
    {id: 1, nome: "Micael", idade: 16},
    {id: 1, nome: "Micael", idade: 16},
    {id: 1, nome: "Micael", idade: 16},
    {id: 1, nome: "Micael", idade: 16}
]

app.get("/usuarios", (requisito , resposta) => {
    resposta.json(usuarios)
})