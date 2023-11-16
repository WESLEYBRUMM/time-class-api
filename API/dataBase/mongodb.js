const mongoose = require('mongoose');
const url = process.env.MONGODB_URI;

async function conectarMongo() {
  try {
    await mongoose.connect(url)
    console.log("Conectado com sucesso ao MongoDB");
  } catch (error) {
    console.error("Erro ao conectar ao MongoDB:", error);
    // throw error; // Você pode simplesmente lançar o erro para frente se desejar
  }
}

async function desconectarMongo() {
  try {
    await mongoose.disconnect();
    console.log("Conexão com o MongoDB encerrada");
  } catch (error) {
    console.error("Erro ao desconectar do MongoDB:", error);
    // throw error; // Você pode simplesmente lançar o erro para frente se desejar
    
  }
}

module.exports = { conectarMongo, desconectarMongo };
