const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { conectarMongo, desconectarMongo } = require('../dataBase/mongodb');
const User = require('../models/User');

const chave = 'wesley-brum'; // Substitua pela sua chave secreta real

const HTTP_STATUS = {
  OK: 200, // sucesso
  UNAUTHORIZED: 401, // nao autorizada 
  NOT_FOUND: 404, // nao encontrado 
  SERVER_ERROR: 500, // error no servidor
};


const loginController = async (req, res) => {
  const { email, senha } = req.body;

  try {
    if (!email || !senha) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({ error: 'Credenciais inválidas' });
    }

    await conectarMongo();

    const usuario = await User.findOne({ email: email });

    if (!usuario) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({ error: 'Usuário não encontrado' });
    }

    const senhaCorreta = await bcrypt.compare(senha, usuario.senha);
    if (!senhaCorreta) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({ error: 'Senha incorreta' });
    }

    const tokenPayload = {
      userId: usuario._id,
      nomeUser: usuario.nomeUser,
      email: email
      // role: usuario.role, // Exemplo de um campo personalizado (role)
    };
    const token = jwt.sign(tokenPayload, chave, { expiresIn: '1h' });
    res.status(HTTP_STATUS.OK).json({ token, payload: tokenPayload });
  } catch (error) {
    console.error('Erro ao autenticar o usuário:', error);
    res.status(HTTP_STATUS.SERVER_ERROR).json({ error: 'Erro ao autenticar o usuário' });
  } finally {
    await desconectarMongo();
  }
};

module.exports = loginController;
