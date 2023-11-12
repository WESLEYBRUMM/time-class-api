const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { solicitacaoAdmin, aceitarSolicitacao}= require('../../../controllers/solicitacaoAdmin');
const tokenAdmin = require('../middlewares/v_token');


const router = express.Router();

router.get('/solicitacaoUser', solicitacaoAdmin)
// tokenAdmin,
router.post('/aceitarSolicitacao', aceitarSolicitacao)

module.exports = router;