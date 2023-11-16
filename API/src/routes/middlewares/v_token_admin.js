const jwt = require('jsonwebtoken');
const jwtTokenAdmin = process.env.CHAVEADMIN; 


const verificarTokenAdmin = (req, res, next) => {

  const token = req.header('Authorization');

  if (!token) {
    return res.status(401).json({ error: 'Token de autenticação não fornecido' });
  }

  try {
    if (decoded.role !== 'admin') {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({ error: 'Acesso não autorizado' });
    }

    // Se o usuário for um admin, continue para a próxima rota
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Token inválido' });
  }
};

module.exports = verificarTokenAdmin;
