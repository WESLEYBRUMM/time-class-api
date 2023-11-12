const mongoose = require('mongoose');

// Defina o esquema do usuário
const userSchema = new mongoose.Schema({
  nomeUser: {
    type: String,
    required: true,
    unique: true,
  },
  senha: {
    type: String,
    required: true,
  },
});
var bancco = "users";

// Crie e exporte o modelo do usuário com base no esquema
module.exports = mongoose.model(`${bancco}`, userSchema);
