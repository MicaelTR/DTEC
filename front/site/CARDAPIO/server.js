const express = require("express");
const cors = require("cors");
const app = express();

app.use(express.json());
app.use(cors());

const PORT = 3001;

// Lista "Vazia" de produtos onde vão ser armazenados os produtos
let produtos = [
    { "id": 1, "nome": "Hamburguer da Casa", "preco": "29.99", "imagem": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR464svueYsA-NERyuGDPyIr_CdFNCF7yJtww&s", "categoria": "sanduiches", "descricao": "hamburguer completo" },
    { "id": 2, "nome": "Smash Turbo", "preco": "24.99", "imagem": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR0jUvXPb01DCcvzxWVEL3C5fJDx_Dac4j8RA&s", "categoria": "sanduiches", "descricao": "Smash da melhor qualidade" },
    { "id": 3, "nome": "Coca-Cola", "preco": "7.99", "imagem": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQtJwliVQqgUxaRgGdhikZrq8u6M-Quz7LlFQ&s", "categoria": "bebidas", "descricao": "Refrigerante 350ml" },
    { "id": 4, "nome": "Copo Da Felicidade", "preco": "12.99", "imagem": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSKObVh4HlDznauAdGxvmobbCj2OSH9eIdyvw&s", "categoria": "sobremesas", "descricao": "Uma sobremesa recheada com uva ninho e uma grande quantidade de chocolate" }

];


// Transforma o array/Lista de produtos em um JSON e se a pessoa jogar na URL ele mostra os produtos.
app.get("/produtos", (req, res) => {
    res.json(produtos);
});

// Pega o produto pelo ID
app.get("/produtos/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const produto = produtos.find(p => p.id === id);
    if (!produto) {
        return res.status(404).json({ mensagem: "Produto não encontrado" });
    }
    res.json(produto);
});

// Adiciona um novo produto na lista "Vazia" de produtos.
app.post("/produtos", (req, res) => {
    const { nome, preco, imagem, categoria, descricao } = req.body;
    const novoProduto = {
        id: Date.now(), // Cria um ID único sem repetir. Ele crie com base em milisegundos desde 1970.
        nome,
        preco,
        imagem,
        categoria,
        descricao
    };

    produtos.push(novoProduto);
    res.status(201).json(novoProduto);
});

// Atualiza e edita o produto pelo ID.
app.put("/produtos/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const produtoIndex = produtos.findIndex(p => p.id === id);

    if (produtoIndex === -1) {
        return res.status(404).json({ mensagem: "Produto não encontrado" });
    }

    const { nome, preco, imagem, categoria, descricao } = req.body;

    produtos[produtoIndex] = {
        ...produtos[produtoIndex],
        nome,
        preco,
        imagem,
        categoria,
        descricao
    };

    res.json(produtos[produtoIndex]);
});

// Deleta o produto pelo ID.
app.delete("/produtos/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const produtosAntes = produtos.length;
    produtos = produtos.filter(p => p.id !== id);

    if (produtos.length === produtosAntes) {
        return res.status(404).json({ mensagem: "Produto não encontrado para excluir" });
    }

    res.json({ mensagem: "Produto excluído com sucesso" });
});




// Verifica se o servidor ta funcionando
app.get("/", (req, res) => {
    res.send("API do Cardápio funcionando");
});

// Inicia o servidor na porta 3001 e mostra a mensagem no console pra saber que ta rodando o servidor
app.listen(PORT, () => {
    console.log(`Servidor do Cardápio rodando na porta ${PORT}`);
});
