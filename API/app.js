const express = require('express');
const MainRoutes = require('./src/routes/MainRoutes.js');
const rateLimit = require('express-rate-limit');
const requestIp = require('request-ip');
const cors = require('cors');

// const urlProxy = "https://api-agendamendo-jb.wesleybrum.repl.co";
const app = express();
app.use(cors())
app.set('trust proxy', 1)

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*'); 
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// Crie um middleware personalizado para extrair o endereço IP real do cabeçalho personalizado
app.use(requestIp.mw());

// Configure o middleware de limitação de taxa
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // Janela de tempo de 15 minutos
  max: 10000000, // Limite de 10 requisições por IP durante a janela de tempo
});

app.use(MainRoutes);

// Certifique-se de que o middleware de limitação de taxa seja aplicado após o middleware de extração do IP real
app.use(limiter);

// Exporte o aplicativo
module.exports = app;
