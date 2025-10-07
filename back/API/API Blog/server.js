// Carregar variáveis de ambiente do arquivo .env
require("dotenv").config();

const express = require("express");
const { v4: uuidv4 } = require("uuid");
const cors = require("cors");

// Importar mongoose do mongo DB
const mongoose = require("mongoose");

const mongoURI = process.env.MONGO_URI;

mongoose.connect(mongoURI)
    .then(() => console.log("Conectado ao MongoDB"))
    .catch(err => console.error("Erro ao conectar ao MongoDB:", err));

const app = express();
app.use(express.json());
app.use(cors());

const PORT = 3000;

// “Banco de dados” em memória com alguns usuários iniciais
let usuarios = [
    { id: uuidv4(), nome: "Micael", idade: 16 },
    { id: uuidv4(), nome: "Lucas", idade: 21 },
    { id: uuidv4(), nome: "Amanda", idade: 19 },
    { id: uuidv4(), nome: "Beatriz", idade: 25 }
];

// Rota padrão
app.get("/", (req, res) => {
    res.send("🚀 API de Usuários está rodando!");
});

// === Listar todos os usuários ===
app.get("/usuarios", (req, res) => {
    res.json(usuarios);
});

// === Buscar um usuário específico ===
app.get("/usuarios/:id", (req, res) => {
    const user = usuarios.find(u => u.id === req.params.id);
    if (!user) {
        return res.status(404).json({ mensagem: "Usuário não encontrado" });
    }
    res.json(user);
});

// === Adicionar novo usuário ===
app.post("/usuarios", (req, res) => {
    const { nome, idade } = req.body;

    if (!nome || !idade) {
        return res.status(400).json({ mensagem: "Nome e idade são obrigatórios" });
    }

    const novoUsuario = {
        id: uuidv4(),
        nome,
        idade: parseInt(idade)
    };

    usuarios.push(novoUsuario);
    res.status(201).json(novoUsuario);
});

// === Editar usuário existente ===
app.put("/usuarios/:id", (req, res) => {
    const { id } = req.params;
    const { nome, idade } = req.body;

    const user = usuarios.find(u => u.id === id);
    if (!user) {
        return res.status(404).json({ mensagem: "Usuário não encontrado" });
    }

    if (nome !== undefined) user.nome = nome;
    if (idade !== undefined) user.idade = parseInt(idade);

    res.json(user);
});

// === Deletar usuário ===
app.delete("/usuarios/:id", (req, res) => {
    const index = usuarios.findIndex(u => u.id === req.params.id);
    if (index === -1) {
        return res.status(404).json({ mensagem: "Usuário não encontrado" });
    }

    usuarios.splice(index, 1);
    res.status(204).send();
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`✅ Servidor rodando em http://localhost:${PORT}`);
});
