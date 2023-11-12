const nodemailer = require('nodemailer');
const randtoken = require('rand-token');
const cache = require('memory-cache');

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: 'wesley.brum@aluno.edu.es.gov.br', // Insira seu email e senha do Gmail aqui
    pass: 'wesleybrum546010',
  }
});

const email_envio_solicitacao = (req, res, email) => {
  const code = randtoken.generate(6, '1234567890');
  cache.put(email, code, 300000);

  const mailOptions = {
    from: 'wesleybrum12345@gmail.com',
    to: email,
  subject: 'PEDIDO DE ACESSO ENVIADO',
    html: `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <!-- <title>Confirmação de Envio</title> -->
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f5f5f5;
            text-align: center;
            
        }

        .container {
            max-width: 800;
            margin: 0 auto;
            padding: 20px;
            background-color: #fff;
            border-radius: 5px;
            box-shadow: 0 2px 5px rgba(4, 4, 4, 0.5);
        }
      .corpo_descricao{
        width: 400px;
        margin: 0 auto;
        /* text-align: left; */
        /* border: 3px solid black; */
      }
      .corpo_descricao p {
        font-size: 22px;
      }

        h1 {
            color: #333;
          padding-bottom: -30px;
        }

        p {
            color: #666;
        }
      .sucesso{
        /* display: flex; */
        margin: 0 auto;
      
        line-height:1;
        color: green;
      }

        .button {
            display: inline-block;
            padding: 10px 20px;
            /* background-color: #007BFF; */
            color: #fff;
            text-decoration: none;
            border-radius: 5px;
            margin-top: 20px;
          background-color: rgba(0, 123, 255, 0.5);
        }

        .button:hover {
            background-color: #0056b3;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>SOLICITAÇÃO ENVIADA COM <h1 class="sucesso">SUCESSO</h1></h1>
      <div class="corpo_descricao">
        <p>Sua solicitação foi enviada com sucesso.</p>
        <p>Estamos processando sua solicitação e entraremos em contato em breve.</p>
        </div>
        <a  class="button">JOAO BLEY</a>
    </div>
</body>
</html>`
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Erro ao enviar email de verificação:', error);
      res.status(500).json({ error: 'Erro ao enviar email de verificação' });
    } else {
      res.json({ email, message: 'Código de verificação enviado. Verifique seu e-mail.' });
    }
  });
};


module.exports = email_envio_solicitacao
