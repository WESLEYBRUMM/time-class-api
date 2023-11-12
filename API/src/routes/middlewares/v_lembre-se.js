const jwt = require('jsonwebtoken');
const jwtSecret = 'wesley-brum';
const verifyToken = (req, res, next) => {
  const token = req.header('Authorization');
  const { email, userId } = req.body;

  console.log(email, userId)

  // Verifique se o token está presente
  if (!token) {
    return res.status(401).json({ error: 'Token de autenticação não fornecido' });
  }

  try {
    const payload = jwt.verify(token, jwtSecret); 
    if (payload.email === email && payload.userId === userId) { 
      return res.status(200).json({ message: 'Sucesso: O token pertence às mesmas informações do payload.' });
    } else {
      return res.status(401).json({ error: 'Erro: O token não pertence às mesmas informações do payload.' });
      console.log(payload.email)
    }
  } catch (error) {
    return res.status(401).json({ error: 'Erro: Token inválido ou expirado.' });
  }
}

module.exports = verifyToken;
