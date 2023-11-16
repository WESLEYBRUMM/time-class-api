const cluster = require('cluster');
const numCPUs = 2; // Defina o número desejado de instâncias
const maxRestarts = 5; // Número máximo de reinicializações
let numRestarts = 0;

if (cluster.isMaster) {
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    if (code !== 0 && numRestarts < maxRestarts) {
      console.log(`Worker ${worker.process.pid} died (code: ${code}, signal: ${signal})`);
      numRestarts++;
      setTimeout(() => cluster.fork(), 1000); // Adicione um delay de 1 segundo antes de criar um novo worker
    } else {
      console.log(`Not forking new worker after ${maxRestarts} restarts.`);
    }
  });
} else {
  const app = require('./app');
  const PORT = process.env.PORT || 0; // Altere para a porta desejada, por exemplo, 3001
  require('dotenv').config();
  app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT} - Worker ${process.pid}`);
  });
}
