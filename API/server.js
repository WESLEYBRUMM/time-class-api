const cluster = require('cluster');
const numCPUs = 2; // Defina o número desejado de instâncias

if (cluster.isMaster) {
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} died (code: ${code}, signal: ${signal})`);
    cluster.fork();
  });
} else {
  const app = require('./app');
  const PORT = 3000;
  require('dotenv').config();
  app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT} - Worker ${process.pid}`);
  });
}
