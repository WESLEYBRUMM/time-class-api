const mongoose = require('mongoose');

const agendamentoSchema = new mongoose.Schema({
  nome_do_professor: {
    type: String,
    required: true,
  },
  id_prof: {
    type: String,
    required: true,
  },
  id_sala: {
    type: Number,
    required: true,
  },
  descricao_do_uso: {
    type: String,
    required: true,
  },
  data_do_agendamento: {
    type: Date,
    required: true,
  },
  hora_entrada: {
    type: String,
    required: true,
  },
  hora_saida: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('Agendamento', agendamentoSchema);
