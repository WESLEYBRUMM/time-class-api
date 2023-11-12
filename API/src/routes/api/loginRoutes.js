const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const loginController = require('../../../controllers/loginControllers');
const token_lembre_se = require('../middlewares/v_lembre-se');


const router = express.Router();

router.post('/login', loginController)

router.post("/auth-auto", token_lembre_se)

module.exports = router;