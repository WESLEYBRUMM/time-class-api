const express = require('express');
const { conectarMongo, desconectarMongo } = require('../dataBase/mongodb');
const  Solicitacao = require('../models/RegistrarSolicitacao'); 
const RegistrarUser = require('../models/RegistrarUser')

const HTTP_STATUS = {
  OK: 200, // sucesso
  UNAUTHORIZED: 401, // nao autorizada
  NOT_FOUND: 404, // nao encontrado
  SERVER_ERROR: 500, // error no servidor
};

const solicitacaoAdmin = async (req, res) => {
  try {
    await conectarMongo();
    const solicitacoes = await Solicitacao.find({}, 'id nomeUser'); 
    res.status(HTTP_STATUS.OK).json(solicitacoes);
    // desconectarMongo();
  } catch (error) {
    res.status(HTTP_STATUS.SERVER_ERROR).json({ error: 'Erro ao buscar as solicitações'});
    console.log(error)
  }
  finally {
    desconectarMongo();
  }
};


const aceitarSolicitacao = async (req, res) => {
  const { email } = req.body;

  try {
  // Conecta ao banco de dados
  await conectarMongo();

  // Verifica se o email já está cadastrado
  const usuarioExistente = await RegistrarUser.findOne({ email:email });
  if(!email){
    console.log("email não informado")
  }

  if(usuarioExistente){
   return console.log("email ja cadastrado")
  }
// buscando os dados do user no banco solicitaçoes
  const buscarSolicitacao = await Solicitacao.findOne({ email:email });
  if(!buscarSolicitacao){
    console.log("email nao existe no banco solicitação")
  }

 
      // Se o usuário não existe, crie um novo usuário
      const newUser = new RegistrarUser({
        nomeUser: buscarSolicitacao.nomeUser, // Corrigindo para usar a variável nomeUser
        senha: buscarSolicitacao.senha, // Certifique-se de ter uma variável chamada senhaCriptografada definida
        email: buscarSolicitacao.email,
        agendamentos:{id:
          null
        }
      });

      // Salva o novo usuário no banco de dados
      const savedUser = await newUser.save();
      console.log('Usuário inserido com sucesso:', savedUser);

      // Responde com uma mensagem de sucesso
      res.status(HTTP_STATUS.OK).json({ message: 'Usuário cadastrado com sucesso!' });
    
  } catch (error) {
    // Trata erros
    console.log(error);
    res.status(HTTP_STATUS.SERVER_ERROR).json({ error: 'Erro ao processar a solicitação' });
  }
};


 module.exports = {aceitarSolicitacao, solicitacaoAdmin}; // Exporta la función solicitacaoAdmin
