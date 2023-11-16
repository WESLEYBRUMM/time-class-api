const express = require('express');
const mongoose = require('mongoose')
const router = express.Router();
const Agendamento = require('../../../models/Agendamento');
const ModelUser = require('../../../models/RegistrarUser')
const { conectarMongo, desconectarMongo } = require('../../../dataBase/mongodb');
const verificarToken = require('../middlewares/v_token');
const verificarTokenAdmin = require('../middlewares/v_token_admin');
const { format } = require('date-fns');
const ptBR = require('date-fns/locale/pt-BR');

// TERMINEI POR COMPLETO ESSA ROTA
router.post('/agendamentos', verificarToken, async (req, res) => {
   const { id_prof, id_sala, hora_entrada, hora_saida, data_do_agendamento } = req.body;

  if(typeof id_prof == 'number'){
   return res.status(400).json({
      error: "id do tipo NUMBER não segue o padrao da api"
    })
  }
  if(typeof id_sala == 'string'){
    return res.status(400).json({
      error: "id do tipo STRING não segue o padrao da api"
    })
  }

  if (!mongoose.isValidObjectId(id_prof)) {
    return res.status(400).json({ error: 'ID inválido' });
  }

   if(!(id_prof || id_sala|| hora_entrada || hora_saida || data_do_agendamento)){
     return res.status(404).json({error: "preenchar todos os campos"})
   }
    if (id_sala < 1 || id_sala > 5) {
      return res.status(400).json({ error: 'Essa sala não existe' });
    }
  try {
    // Conectar ao MongoDB
    await conectarMongo();

    const agendamentoExistente = await Agendamento.findOne({
      id_sala,
      data_do_agendamento,
      $or: [
        {
          hora_entrada: { $lt: hora_saida },
          hora_saida: { $gt: hora_entrada }
        },
        {
          hora_entrada: { $gte: hora_entrada, $lt: hora_saida },
          hora_saida: { $gt: hora_saida }
        },
        {
          hora_entrada: { $lte: hora_entrada },
          hora_saida: { $gte: hora_saida }
        }
      ]
    });

    if (agendamentoExistente) {
      return res.status(400).json({ error: 'Conflito de horário com outro agendamento' });
    }
    const novoAgendamento = new Agendamento(req.body);
    const agendamentoSalvo = await novoAgendamento.save();

    return res.status(201).json(agendamentoSalvo);
  } catch (error) {

    console.error(error);
    res.status(400).json({ error: 'Erro ao criar o agendamento' });
  } finally {
    desconectarMongo();
  }
});

// TERMINEI POR COMPLETO ESSA ROTA
router.get('/agendamentos',verificarToken, async (req, res) => {
  try {
    await conectarMongo();
    const agendamentos = await Agendamento.find();
    res.status(200).json(agendamentos);
  } catch (error) {
   return res.status(500).json({ error: 'Erro ao buscar os agendamentos' });
  }
  finally{
    desconectarMongo();
  }
});


// TERMINEI A ROTA POR COMPLETO
router.get('/agendamentos/id-agendamento=:id', verificarToken, async (req, res) => {
  const id = req.params.id;
  if(typeof id == 'number'){
   return res.status(400).json({
      error: "id do tipo NUMBER não segue o padrao da api"
    })
  }

  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({ error: 'ID inválido' });
  }
  
  if(!id){
    return res.status(404).json({error: "ID não encontrado"})
  }

  try {
    await conectarMongo();

    const agendamento = await Agendamento.findById(id);

    if (!agendamento) {
      return res.status(404).json({ error: 'Agendamento não encontrado' });
    } 

    res.status(200).json(agendamento);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao buscar o agendamento' });
  } finally {
    desconectarMongo();
  }
});

// ROTAA DO PROF EXCULIR O AGENDAMENTO DELE
//TERMINEI TUDO NA ROTA 
router.delete('/agendamentos/user=professor', async (req, res) => {
  const { id_prof, id_Sala, hora_entrada, hora_saida, data_do_agendamento} = req.body;

  // Validar se id_prof é um número
  if (typeof id_prof === 'number') {
    return res.status(400).json({
      error: "O ID do tipo NUMBER não segue o padrão da API"
    });
  }
  if( typeof id_Sala === 'string'){
    return res.status(400).json({
      error: "O ID do tipo STRING não segue o padrão da API"
    });
  }
  if(typeof !hora_entrada === 'string' ||typeof !hora_saida === 'string' ){
   return res.status(400).json({error: "O HORÁRIO DEVE SER DO TIPO STRING NO FORMATO HH:MM"})
  }
  if(typeof !data_do_agendamento === 'date'){
    return res.staus(400).json({error: "A DATA DEVE SER DO TIPO DATE"})
  }

  // Validar se id_prof é um ObjectId válido
  if (!mongoose.isValidObjectId(id_prof)) {
    return res.status(400).json({ error: 'ID inválido' });
  }

  // Validar se todos os campos foram fornecidos
  if (!id_prof || !id_Sala || !hora_entrada || !hora_saida || !data_do_agendamento) {
    return res.status(400).json({ error: "Por favor, preencha todos os campos" });
  }

  try {
    await conectarMongo();

    // Verificar se o usuário existe
    const user = await ModelUser.findById(id_prof);
    if (!user) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }

    const resultadoExclusao = await Agendamento.deleteOne({
      id_prof: id_prof,
      id_sala: id_Sala,
      data_do_agendamento: data_do_agendamento,
      hora_entrada: hora_entrada,
      hora_saida: hora_saida
    });

    if (resultadoExclusao.deletedCount === 0) {
      return res.status(404).json({ error: 'Agendamento não encontrado' });
    }

    return res.status(200).json({ sucesso: 'Agendamento excluído com sucesso' });
    
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Erro ao processar a solicitação" });
  } finally {
    desconectarMongo();
  }
});


// Rota para atualizar um agendamento por ID
// router.put('/agendamentos/:id', async (req, res) => {
//   try {
//     await conectarMongo();
//     const agendamento = await Agendamento.findByIdAndUpdate(req.params.id, req.body, { new: true });
//     if (!agendamento) {
//       res.status(404).json({ error: 'Agendamento não encontrado' });
//     } else {
//       res.status(200).json(agendamento);
//     }
//   } catch (error) {
//     res.status(500).json({ error: 'Erro ao atualizar o agendamento' });
//   }
// });


//                             ROTAS ADMIN

// Rota para excluir um agendamento por ID
router.delete('/agendamentos/:id', verificarTokenAdmin, async (req, res) => {

  const {id_Sala, hora_entrada, hora_saida, data_do_agendamento} = req.body;

  if( typeof id_Sala === 'string'){
    return res.status(400).json({
      error: "O ID do tipo STRING não segue o padrão da API"
    });
  }
  if(typeof !hora_entrada === 'string' ||typeof !hora_saida === 'string' ){
   return res.status(400).json({error: "O HORÁRIO DEVE SER DO TIPO STRING NO FORMATO HH:MM"})
  }
  if(typeof !data_do_agendamento === 'date'){
    return res.staus(400).json({error: "A DATA DEVE SER DO TIPO DATE"})
  }

  // Validar se todos os campos foram fornecidos
  if (!id_Sala || !hora_entrada || !hora_saida || !data_do_agendamento) {
    return res.status(400).json({ error: "Por favor, preencha todos os campos" });
  }

  try {
    await conectarMongo();
    if (!user) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }

    const resultadoExclusao = await Agendamento.deleteOne({
      id_sala: id_Sala,
      data_do_agendamento: data_do_agendamento,
      hora_entrada: hora_entrada,
      hora_saida: hora_saida
    });

    if (resultadoExclusao.deletedCount === 0) {
      return res.status(404).json({ error: 'Agendamento não encontrado' });
    }

    return res.status(200).json({ sucesso: 'Agendamento excluído com sucesso' });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Erro ao processar a solicitação" });
  } finally {
    desconectarMongo();
  }
  
});
router.get('/agendamentos+adim',verificarTokenAdmin, async (req, res) => {
  try {
    await conectarMongo();
    const agendamentos = await Agendamento.find();
    res.status(200).json(agendamentos);
  } catch (error) {
   return res.status(500).json({ error: 'Erro ao buscar os agendamentos' });
  }
  finally{
    desconectarMongo();
  }
});

module.exports = router;

