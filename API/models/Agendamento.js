const mongoose = require('mongoose');

const agendamentoSchema = new mongoose.Schema({
  _id: Number, // Campo _id configurado como Number
  nome_do_professor: {
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
    type: String,
    required:true,
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


agendamentoSchema.pre('save', async function (next) {
  if (!this.isNew) {
    return next();
  }

  const count = await mongoose.model('Agendamento').countDocuments();
  this._id = count + 1;
  next();
});

module.exports = mongoose.model('Agendamento', agendamentoSchema);