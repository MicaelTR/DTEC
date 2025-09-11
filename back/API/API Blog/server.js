const express = require("express");
const { v4: uuidv4 } = require("uuid");
const app = express();

app.use(express.json());

const PORT = 3000;

let posts = [];


app.get("/posts", (req, res) => {
    res.json(posts);
});

app.get("/posts/:id", (req, res) => {
    const post = posts.find(p => p.id === req.params.id);

    if (!post) {
        return res.status(404).json({ mensagem: "Post não encontrado" });
    }

    res.json(post);
});

app.post("/posts", (req, res) => {
    const { autor, titulo, conteudo } = req.body;

    if (!autor || !titulo || !conteudo) {
        return res.status(400).json({ mensagem: "Autor, titulo e conteudo são obrigatórios" });
    }

    const novoPost = {
        id: uuidv4(),
        autor,
        titulo,
        conteudo,
        dataCriacao: new Date().toISOString(),
        comentarios: []
    };

    posts.push(novoPost);
    res.status(201).json(novoPost);
});

app.put("/posts/:id", (req, res) => {
    const { id } = req.params;
    const { autor, titulo, conteudo } = req.body;

    const post = posts.find(p => p.id === id);

    if (!post) {
        return res.status(404).json({ mensagem: "Post não encontrado" });
    }

    if (autor !== undefined) post.autor = autor;
    if (titulo !== undefined) post.titulo = titulo;
    if (conteudo !== undefined) post.conteudo = conteudo;

    res.json(post);
});

app.delete("/posts/:id", (req, res) => {
    const { id } = req.params;
    const index = posts.findIndex(p => p.id === id);

    if (index === -1) {
        return res.status(404).json({ mensagem: "Post não encontrado" });
    }

    posts.splice(index, 1);
    res.status(204).send();
});

app.post("/posts/:id/comentarios", (req, res) => {
    const { id } = req.params;
    const { comentario } = req.body;

    if (!comentario) {
        return res.status(400).json({ mensagem: "Campo 'comentario' é obrigatório" });
    }

    const post = posts.find(p => p.id === id);

    if (!post) {
        return res.status(404).json({ mensagem: "Post não encontrado" });
    }

    post.comentarios.push(comentario);
    res.status(201).json({ mensagem: "Comentário adicionado com sucesso" });
});

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
    
});

app.get("/", (req, res) => {
    res.send("Bem-vindo à API do Blog!");
});
