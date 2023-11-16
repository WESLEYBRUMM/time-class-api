const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { conectarMongo, desconectarMongo } = require('../dataBase/mongodb');
const usuarios = require('../models/RegistrarUser');
const User = require('../models/User');

const CHAVEADMIN = process.env.CHAVE_ADMIN || "a"; // Substitua pela sua chave secreta real
const CHAVEUSER = process.env.CHAVEUSER || "b";
const HTTP_STATUS = {
  OK: 200, // sucesso
  UNAUTHORIZED: 401, // nao autorizada
  NOT_FOUND: 404, // nao encontrado
  SERVER_ERROR: 500, // error no servidor
};

const loginController = async (req, res) => {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(HTTP_STATUS.UNAUTHORIZED).json({ error: 'Credenciais inválidas' });
  }

  try {
    await conectarMongo();

    // Verificar se é um usuário normal
    const usuario = await usuarios.findOne({ email: email });
    if (usuario) {
      const senhaCorreta = await bcrypt.compare(senha, usuario.senha);

      if (senhaCorreta) {
        const tokenPayload = {
          userId: usuario._id,
          nomeUser: usuario.nomeUser,
          email: email,
        };
        const token = jwt.sign(tokenPayload, CHAVEUSER, { expiresIn: '1h' });
        return res.status(HTTP_STATUS.OK).json({ token, payload: tokenPayload });
      }
    }

    // Verificar se é um admin
    const userAdmin = await User.findOne({ email: email });
    if (userAdmin) {
      const senhaCorreta = await bcrypt.compare(senha, userAdmin.senha);

      if (senhaCorreta) {
        const tokenPayload = {
          userId: userAdmin._id,
          nomeUser: userAdmin.nomeUser,
          email: email,
          role: "admin",
        };
        const token = jwt.sign(tokenPayload, CHAVEADMIN, { expiresIn: '1h' });
        return res.status(HTTP_STATUS.OK).json({ token, payload: tokenPayload });
      }
    }

    // Se não for nem usuário normal nem admin
    return res.status(HTTP_STATUS.UNAUTHORIZED).json({ error: 'Credenciais inválidas' });
  } catch (error) {
    res.status(HTTP_STATUS.SERVER_ERROR).json({ error: 'Erro ao autenticar o usuário' });
  } finally {
    await desconectarMongo();
  }
};

module.exports = loginController;
