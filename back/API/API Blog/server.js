   //CARREGAR VARIÁVEIS DE AMBIENTE
require('dotenv').config()

//Importando o express
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

//Importando o modelo de Usuário
const Pessoa = require('./models/Pessoa');

// Importando o modelo de Usuário
const User = require('./models/User');

// Importando bcrypt para hash de senhas
const bcrypt = require('bcryptjs');

// Importando jsonwebtoken para autenticação
const jwt = require('jsonwebtoken');

const PORT = process.env.PORT || 3000;
const mongoURI = process.env.MONGO_URI;
const JWT_SECRET = process.env.JWT_SECRET;

//CONEXÃO MONGODB
mongoose.connect(mongoURI)
  .then(() => console.log("Conectado ao MongoDb Atlas"))
  .catch(error => {
    console.error("Falha na Conexão ao MongoDB",error.message);
    process.exit(1);
  })

// Função para gerar token JWT
const generateToken = (id) => {
  return jwt.sign({id}, JWT_SECRET, {expiresIn: "1d"})
}

const protect = (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];
      jwt.verify(token, JWT_SECRET);
      next()
    }

    catch (error) {
      res.status(401).json({mensagem: "Não autorizado, token inválido"})
    }
  }
}


//Criando minha aplicação
const app = express()

//Permitir trabalhar com json
app.use(express.json())
app.use(cors())





app.get('/',(req,res) => {
  res.send("API funcionando!")
})


app.get('/usuarios',async (req,res) => {
    try {
      const usuarios = await Pessoa.find({});
      res.json(usuarios);
    } catch (error) {
      res.status(500).json({mensagem: "Erro ao buscar usuários",erro: error.message})
    }
})

app.get('/usuarios/:id', async (req, res) => {
    try {
      const id = req.params.id;
      const usuario = await Pessoa.findById(id);

      if(usuario){
        res.json(usuario)
      }else{
        res.status(404).json({mensagem: "Usuário Não encontrado"})
      }
    } catch (error) {
      res.status(400).json({mensagem: "Erro de Servidor", erro: error.message})
    }
})

app.get('/usuarios/nome/:nome', async (req,res) => {
  try{
    const buscaNome = req.params.nome;
    const resultados = await Pessoa.find({
      nome: {$regex: buscaNome, $options: 'i'}
    });
    if (resultados.length > 0) {
      res.json(resultados);
    }else {
      res.status(404).json({mensagem: "Usuário Não Encontrado"})
    }
  } catch (error) {
    console.error("Erro na busca", error);
    res.status(500).json({mensagem: "Erro no servidor", erro: error.message})
  }
    
})

app.get('/usuarios/idade/:idade', async (req,res) => {
  try{
    const buscaIdade = req.params.idade;
    const resultados = await Pessoa.find({
      idade: buscaIdade
    });
    if (resultados.length > 0) {
      res.json(resultados);
    }else {
      res.status(404).json({mensagem: "Usuário Não Encontrado"})
    }
  } catch (error) {
    console.error("Erro na busca", error);
    res.status(500).json({mensagem: "Erro no servidor", erro: error.message})
  }
})

app.delete('/usuarios/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const usuarioDeletado = await Pessoa.findByIdAndDelete(id);

    if(!usuarioDeletado) {
      return res.status(404).json({mensagem: "Usuário Não Encontrado"})
    }
    res.json({mensagem: "Usuário deletado", usuario: usuarioDeletado});
  }catch (error) {
    res.status(400).json({mensagem: "Erro ao deletar", erro: error.message})
  } 
})

// A sua rota POST para criar um novo usuário
app.post('/usuarios', async (req, res) => {
    try {
      const novoUsuario = await Pessoa.create({
        nome: req.body.nome,
        idade: req.body.idade
      });
      res.status(201).json(novoUsuario);
    }catch (error) {
      res.status(400).json({mensagem: "Dados Inválidos ou Erro ao salvar", erro: error.message})
    }
});

app.put('/usuarios/:id', async (req,res) => {
  try {
    const id = req.params.id
    const nome = req.body.nome
    const idade = req.body.idade
    const usuarioAtualizado = await Pessoa.findByIdAndUpdate(
      id,
      {nome, idade},
      {new: true, runValidators: true}
    )
    if (!usuarioAtualizado){
      return res.status(404).json({mensagem: " Usuário Não Encontrado"})
    }
    res.json(usuarioAtualizado)
  }catch{
    res.status(400).json({mensagem: "Erro ao atualizar", erro: error.message})
  }
})

//Inicia o servidor
app.listen(PORT, () => {
    console.log(`Servidor na porta ${PORT}`)
})