const express = require('express');
const cors = require('cors');
const login = require('./api/loginRoutes.js')
const registrar = require('./api/registrarRouter.js')
const agendamento = require('./api/agendamentoRouter.js')
const solicitacao = require('./api/solicitacaoRouter.js')
const router = express.Router();
router.use(cors());

router.use(login);
router.use(agendamento)
router.use(registrar);
router.use(solicitacao)
// router.use(usuariosRouter);


router.get("/loaderio-f8be67fd967b5da888f3b3489ea67c06/", (req,res)=>{
  try{
  res.status(200).send('loaderio-f8be67fd967b5da888f3b3489ea67c06')
  }
  catch(error){
    res.status(500).send({
      error:'erro',
      messagem:"nao foi posssivel acessar a API"
    })
  }
})

router.route('/')
.post((req,res)=>{
  try{
  res.status(400).send({
   status:"a rota solicitada nao é possivel realizar o metado POST"
  })
  }
  catch(error){
    res.status(400).send({
      error:'nao é possivel, vefique se indicou o metado certo',error
    })
  }
})
.put((req,res)=>{
  try{
    res.send({
      status:"a rota solicitada nao é possivel realizar o metado PUT"
    })
  }
  catch(error){
    res.send({
      error:'nao é possivel, vefique se indicou o metado certo',error
    })
  }
})
.delete((req,res)=>{
   try{
    res.send({
      status:"a rota solicitada nao é possivel realizar o metado DELETE"
    })
  }
  catch(error){
    res.send({
      error:'nao é possivel, vefique se indicou o metado certo',error
    })
  }
})


module.exports = router;