const jwt = require('jsonwebtoken');
const jwtTokenAdmin = 'wesley-brum-admin'; 


const verificarToken = (req, res, next) => {
  // Obtenha o token do cabeçalho da solicitação
  const token = req.header('Authorization');
console.log(token)
  // Verifique se o token está presente
  if (!token) {
    return res.status(401).json({ error: 'Token de autenticação não fornecido' });
  }

  try {
  
    const decoded = jwt.verify(token, jwtTokenAdmin);
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Token inválido' });
  }
};

module.exports = verificarToken;
