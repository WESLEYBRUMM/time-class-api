//atualizar para verificar admin tbm

const jwt = require('jsonwebtoken');
const CHAVEUSER = 'wesley-brum';
const CHAVEADMIN = 'wesley-brum-admin'
const verifyToken = (req, res, next) => {
  const token = req.header('Authorization');
  const { email, userId } = req.body;

  console.log(email, userId)

  // Verifique se o token está presente
  if (!token) {
    return res.status(401).json({ error: 'Token de autenticação não fornecido' });
  }

  try {

    //verificando user normal token
    const payload = jwt.verify(token, CHAVEUSER); 
    if (payload.email === email && payload.userId === userId) { 
      return res.status(200).json({ message: 'Sucesso: O token pertence às mesmas informações do payload.' });
    } 
    // verificando admin token
    const payloadAdmin = jwt.verifiy(token, CHAVEADMIN);
    if(payloadAdmin.email === email && payloadAdmin.userId === userId 
    && payloadAdmin.role === 'admin'){
       return res.status(200).json({ message: 'Sucesso: O token pertence às mesmas informações do payload.admin' });
    }
    
      return res.status(401).json({ error: 'Erro: O token não pertence às mesmas informações do payload.' })
      
    
  }
  catch (error) {
    return res.status(401).json({ error: 'Erro: Token inválido ou expirado.' });
  }
}

module.exports = verifyToken;
