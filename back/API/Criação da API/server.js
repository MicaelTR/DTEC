const express = require("express");
const cors = require("cors");
const app = express();

app.use(express.json());
app.use(cors());

const PORT = 3001;

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`)
});

let usuarios = [
    { id: 1, nome: "Micael", idade: 16 },
    { id: 1, nome: "Micael", idade: 20 },
    { id: 1, nome: "Micael", idade: 16 },
    { id: 1, nome: "Micael", idade: 16 }
]

app.get("/", (require, response) => {
    response.send("Testando a API")
})

app.get("/usuarios/:id", (require, response) => {
    const id = require.params.id
    const usuario = usuarios.find(user => user.id == id)

    if (usuario) {
        response.json(usuario)
    }
    else {
        response.status(404).json({ mensagem: "Usuário não encontrado" });
    }
});

app.get("/usuarios/nome/:nome", (require, response) => {
    const buscarNome = require.params.nome.toLowerCase()
    const resultado = usuarios.filter(user => user.nome.toLowerCase().includes(buscarNome))

    if (resultado.length > 0) {
        response.json(resultado)
    }
    else {
        response.status(404).json({ mensagem: "Nenhum usuário encontrado" });
    }
})

app.get("/usuarios", (require, response) => {
    response.json(usuarios)
})

app.delete("/usuarios/:id", (require, response) => {
    const id = require.params.id
    usuarios = usuarios.filter(user => user.id != id)
    response.json({ mensagem: "Usuário removido com sucesso" })
})

app.post("/usuarios", (require, response) => {
    const novoUsuario = {
        id: usuarios.length + 1,
        nome: require.body.nome,
        idade: require.body.idade
    };
    usuarios.push(novoUsuario)
    response.status(201).json(novoUsuario)
})

app.get("/usuarios/idade/:idade", (require, response) => {
    const idade = parseInt(require.params.idade)
    resultado = usuarios.filter(user => user.idade === idade)

    if (resultado.length > 0) {
        response.json(resultado)
    }
    else {
        response.status(404).json({ mensagem: "Nenhum usuário encontrado com essa idade selecionada" });
    }
})

app.put("/usuarios/:id", (require , response) => {
    const id = require.params.id
    const nome = require.body.nome
    const idade = require.body.idade

    const usuario = usuarios.find(user => user.id == id)

    if (!usuario) {
        return response.status(404).json({ mensagem: "Usuário não encontrado" });
    }
    
    usuario.nome = nome || usuario.nome
    usuario.idade = idade || usuario.idade

    response.json(usuario)  
})