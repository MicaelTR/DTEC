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

const PORT = process.env.PORT || 3000;

const userSchema = new mongoose.Schema({
    nome: {type: String, required: true},
    idade: {type: Number, required: true}
}, { timestamps: true });

const User = mongoose.model("User", userSchema);

// “Banco de dados” em memória com alguns usuários iniciais

// Rota padrão
app.get("/", (req, res) => {
    res.send("🚀 API de Usuários está rodando!");
});

// === Listar todos os usuários ===
app.get("/usuarios", async (req, res) => {
    try {
        const usuarios = await User.find({});
        res.json(usuarios);
    }
    catch (err) {
        res.status(500).json({ mensagem: "Erro ao buscar usuários", err: err.message });
    }
});

// === Buscar um usuário específico ===

// Buscar por ID
app.get("/usuarios/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const user = await User.findById(id);

        if (user) {
            res.json(user);
        }

        else {
            res.status(404).json({ mensagem: "Usuário não encontrado" });
        }
    }

    catch (err) {
        res.status(400).json({ mensagem: "Erro ao buscar usuário", err: err.message });
    }
});

// Buscar por nome
app.get("/usuarios/nome/:nome", async (req, res) => {
    try {
        const proucrarNome = req.params.idade;
        const resultado = await User.find({
            nome: { $regex: proucrarNome, $options: "i" }
        });
        
        if (resultado.length > 0) {
            res.json(resultado);
        }

        else {
            res.status(404).json({ mensagem: "Usuário não encontrado" });
        }[]
         
          ,g
    }

    catch (err) {
    }
});

// Buscar por idade
app.get("/usuarios/idade/:idade", async (req, res) => {
    try {
        const nome = req.params.idade;
        const user = await User.find(idade);

        if (user) {
            res.json(user);
        }

        else {
            res.status(404).json({ mensagem: "Usuário não encontrado" });
        }
    }

    catch (err) {
        res.status(400).json({ mensagem: "Erro ao buscar usuário", err: err.message });
    }
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
