const express = require('express');
const MainRoutes = require('./src/routes/MainRoutes.cjs');
const rateLimit = require('express-rate-limit');
const requestIp = require('request-ip');
const bodyParser = require('body-parser');
const cors = require('cors');
// const dotenv = require('dotenv');

// // Carregue as variáveis de ambiente do arquivo .env
// dotenv.config();

const app = express();

// Middleware de tratamento de erro
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(HTTP_STATUS.SERVER_ERROR).json({ error: 'Erro interno do servidor' });
});

app.set('trust proxy', 1);

// Use o middleware body-parser para analisar dados JSON
app.use(bodyParser.json());

// Use o middleware cors para lidar com requisições de diferentes origens
app.use(cors());

// Crie um middleware personalizado para extrair o endereço IP real do cabeçalho personalizado
app.use(requestIp.mw());

// Middleware de limitação de taxa
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100,
});

app.use(limiter);

// Use as rotas principais
app.use(MainRoutes);

module.exports = app;
