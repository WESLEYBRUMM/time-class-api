// const cluster = require('cluster');
// const numCPUs = require('os').cpus().length;

// if (cluster.isMaster) {
//   for (let i = 0; i < numCPUs; i++) {
//     cluster.fork();
//   }

//   cluster.on('exit', (worker, code, signal) => {
//     console.log(`Worker ${worker.process.pid} died (code: ${code}, signal: ${signal})`);
//     cluster.fork();
//   });
// } else {
const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const dotenv = require('dotenv');
const cors = require('cors');
const app = require('./app')

dotenv.config();

const server = http.createServer(app);

// app.use(cors());

const io = socketIO(server, {
  cors: {
    origin: ["*"]
  }
});


const PORT = process.env.PORT || 3000;
io.on('connection', (socket) => {
  console.log('Cliente conectado');

  socket.on('newAgendamento', (agendamento) => {
    console.log('Novo agendamento recebido:', agendamento);
  });

  socket.on('listaAgendamentos', (agendamento) => {
    console.log('Lista de agendamentos recebida:', agendamentos);
  });

  socket.on('disconnect', () => {
    console.log('Cliente desconectado');
  });
});

server.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

// Lidar com erros não tratados
process.on('uncaughtException', (err) => {
  console.error('Erro não tratado:', err);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Rejeição não tratada:', reason);
});
