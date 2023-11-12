const mongoose = require('mongoose');

const RegistrarUserSchema = new mongoose.Schema({
   nomeUser: {
      type: String
   },
   senha: {
      type: String
   },
   email: {
      type: String
   },
   agendamentos: [{
      id: {
        type: Number,
        unique: false// Se deseja que o campo "id" seja único
      }
   }]
});

const RegistrarUser = mongoose.model('usuarios', RegistrarUserSchema);

module.exports = RegistrarUser;
