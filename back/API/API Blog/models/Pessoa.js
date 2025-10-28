const mongoose = require('mongoose');

const PessoaSchema = new mongoose.Schema(
    {
        nome: { type: String, required: true },
        idade: { type: Number, required: true },
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('Pessoa', PessoaSchema);