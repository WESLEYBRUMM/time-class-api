const mongoose = require('mongoose');

const removerAgendamento = new mongoose.Scheama({
  _id:Number
})

// const banco = "";

module.export = mongoose.model(`agendamento`,removerAgendamento);