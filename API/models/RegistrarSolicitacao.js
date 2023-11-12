const mongoose = require('mongoose');

const usuarioSchema = new mongoose.Schema({
  nomeUser: {
    type: String,
    required: true,
  },
  senha: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  agendamentos: {
    id: {
      type: Number
      // unique: true
    }
  }
});

const Solicitacao = mongoose.model('Solicitacao', usuarioSchema);

module.exports = Solicitacao; // Exporta diretamente o modelo
