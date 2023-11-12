const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt');
const Solicitacao = require('../../../models/RegistrarSolicitacao');
const { conectarMongo, desconectarMongo } = require('../../../dataBase/mongodb');
const { email_code, verify_code } = require('../../../emails/email_code');
const verifyCodeMiddleware = require('../middlewares/v_code');
const email_envio_solicitacao = require('../../../emails/solicitacao_enviada')

const router = express.Router();

router.use(bodyParser.json());
router.use(cors());

// colentando dados para gerar um code de verificaçao e manda o email
router.post('/cadastro', async (req, res) => {
  try {
    await conectarMongo();
    const { email } = req.body;
  

    if (!email) {
      return res.status(400).json({
        error: 'Preencha todos os campos obrigatórios'
      });
    }

    const existingUser = await Solicitacao.findOne({ email: email });

    if (existingUser) {
      console.log('Usuário já existe');
      return res.status(400).json('Usuário já existe');
    }

     email_code(req,res,email)

  } catch (error) {
    console.error('Erro ao inserir o usuário:', error);
    res.status(500).json({ error: 'Erro ao cadastrar o usuário' });
  } finally {
    desconectarMongo();
  }
});

// rota para verificar code de autenticaçao e cadastrar no banco de dados de solicitaçao 
router.post('/cadastro/verificar', verifyCodeMiddleware, async (req, res) => {

    const { nomeuser, senha, email } = req.body;

  try{
    await conectarMongo();
  
    if (!nomeuser || !senha || !email) {
      return res.status(400).json({
        error: 'Preencha todos os campos obrigatórios'
      });
    }
    email_envio_solicitacao(req,res,email)
    // Criptografar a senha antes de salvar no banco de dados
    const senhaCriptografada = await bcrypt.hash(senha, 10);

    // Crie um novo usuário
    const newUser = new Solicitacao({
      nomeUser: nomeuser, // Corrigido para nomeUser
      senha: senhaCriptografada,
      email: email,
      agendamentos: {
        id: 0
      }
    });

    // Salve o novo usuário no banco de dados
    const savedUser = await newUser.save();
    console.log('Usuário inserido com sucesso:', savedUser);

    res.json({ message: 'Usuário cadastrado com sucesso!' });

  } catch (error) {
    console.error('Erro ao inserir o usuário:', error);
    res.status(500).json({ error: 'Erro ao cadastrar o usuário' });
  }
  finally{
     desconectarMongo();
  }
});

module.exports = router;
