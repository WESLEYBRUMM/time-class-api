const jwt = require('jsonwebtoken');
const jwtSecret = process.env.CHAVEUSER; // Substitua pela sua chave secreta real

// Middleware para verificar tokens
const verificarToken = (req, res, next) => {
  // Obtenha o token do cabeçalho da solicitação
  const token = req.header('Authorization');

  // Verifique se o token está presente
  if (!token) {
    return res.status(401).json({ error: 'Token de autenticação não fornecido' });
  }

  try {
    // Verifique o token usando a chave secreta (a mesma chave usada para criar o token)
    const decoded = jwt.verify(token, jwtSecret); // Substitua 'sua-chave-secreta' pela sua chave real

    // Adicione o objeto decodificado (geralmente contém informações do usuário) à solicitação
    // req.user = decoded;

    // Avance para o próximo middleware ou rota
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Token inválido' });
  }
};

module.exports = verificarToken;
