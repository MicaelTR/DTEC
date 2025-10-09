// Carregar variáveis de ambiente do arquivo .env
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();
app.use(express.json());
app.use(cors());

// Conectar ao MongoDB
const mongoURI = process.env.MONGO_URI;
mongoose.connect(mongoURI)
    .then(() => console.log("✅ Conectado ao MongoDB"))
    .catch(err => console.error("❌ Erro ao conectar ao MongoDB:", err));

// Esquema do usuário
const userSchema = new mongoose.Schema({
    nome: { type: String, required: true },
    idade: { type: Number, required: true }
}, { timestamps: true });

const User = mongoose.model("User", userSchema);

// Rota padrão
app.get("/", (req, res) => {
    res.send("🚀 API de Usuários está rodando!");
});

// === Listar todos os usuários ===
app.get("/usuarios", async (req, res) => {
    try {
        const usuarios = await User.find({});
        res.json(usuarios);
    } catch (err) {
        res.status(500).json({ mensagem: "Erro ao buscar usuários", erro: err.message });
    }
});

// === Buscar um usuário por ID ===
app.get("/usuarios/:id", async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ mensagem: "Usuário não encontrado" });
        }
    } catch (err) {
        res.status(400).json({ mensagem: "ID inválido ou erro ao buscar usuário", erro: err.message });
    }
});

// === Buscar usuários por nome (parcial, case-insensitive) ===
app.get("/usuarios/nome/:nome", async (req, res) => {
    try {
        const procurarNome = req.params.nome;
        const resultado = await User.find({
            nome: { $regex: procurarNome, $options: "i" }
        });

        if (resultado.length > 0) {
            res.json(resultado);
        } else {
            res.status(404).json({ mensagem: "Usuário não encontrado" });
        }
    } catch (err) {
        res.status(400).json({ mensagem: "Erro ao buscar por nome", erro: err.message });
    }
});

// === Buscar usuários por idade ===
app.get("/usuarios/idade/:idade", async (req, res) => {
    try {
        const idade = parseInt(req.params.idade);
        const resultado = await User.find({ idade });

        if (resultado.length > 0) {
            res.json(resultado);
        } else {
            res.status(404).json({ mensagem: "Nenhum usuário encontrado com essa idade" });
        }
    } catch (err) {
        res.status(400).json({ mensagem: "Erro ao buscar por idade", erro: err.message });
    }
});

// === Criar novo usuário ===
app.post("/usuarios", async (req, res) => {
    const { nome, idade } = req.body;

    if (!nome || !idade) {
        return res.status(400).json({ mensagem: "Nome e idade são obrigatórios" });
    }

    try {
        const novoUsuario = new User({ nome, idade });
        const salvo = await novoUsuario.save();
        res.status(201).json(salvo);
    } catch (err) {
        res.status(500).json({ mensagem: "Erro ao criar usuário", erro: err.message });
    }
});

// === Atualizar usuário por ID ===
app.put("/usuarios/:id", async (req, res) => {
    const { nome, idade } = req.body;

    try {
        const atualizado = await User.findByIdAndUpdate(
            req.params.id,
            { nome, idade },
            { new: true, runValidators: true }
        );

        if (atualizado) {
            res.json(atualizado);
        } else {
            res.status(404).json({ mensagem: "Usuário não encontrado" });
        }
    } catch (err) {
        res.status(400).json({ mensagem: "Erro ao atualizar usuário", erro: err.message });
    }
});

// === Deletar usuário por ID ===
app.delete("/usuarios/:id", async (req, res) => {
    try {
        const deletado = await User.findByIdAndDelete(req.params.id);

        if (deletado) {
            res.status(204).send();
        } else {
            res.status(404).json({ mensagem: "Usuário não encontrado" });
        }
    } catch (err) {
        res.status(400).json({ mensagem: "Erro ao deletar usuário", erro: err.message });
    }
});

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`✅ Servidor rodando em http://localhost:${PORT}`);
});
