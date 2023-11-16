const nodemailer = require('nodemailer');
const randtoken = require('rand-token');
const cache = require('memory-cache');

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.AUTH_GMAIL_USER, // Insira seu email e senha do Gmail aqui
    pass: process.env.AUTH_GMAIL_PASS,
  }
});

const email_code = (req, res, email) => {
  const code = randtoken.generate(6, '1234567890');
  cache.put(email, code, 300000);

  const mailOptions = {
    from: process.env.AUTH_GMAIL_FROM,
    to: email,
    subject: 'Código de Autenticação de Duas Etapas',
    html: `<!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>
    .card {
      max-width: 400px;
      margin: 0 auto;
      padding: 20px;
      border: 2px solid #007bff;
      border-radius: 10px;
      background-color: #f7f7f7;
      box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
      height:'100%';
    }

    .logo {
      text-align: center;
      margin-bottom: 20px;
    }

    .logo img {
      width: 40px;
      height: auto;
    }

    .verification-code {
      text-align: center;
      font-size: 32px;
      font-weight: bold;
      color: #007bff;
      margin-top: 20px;
    }

    .instructions {
      text-align: center;
      font-size: 16px;
      margin-top: 20px;
      color: #333;
    }

    .cta-button {
      text-align: center;
      margin-top: 20px;
       background-color: rgba(0, 123, 255, 0.5);
    }

    .cta-button a {
      display: inline-block;
      padding: 10px 20px;
      background-color: #007bff;
      color: #fff;
      text-decoration: none;
      border-radius: 5px;
      font-weight: bold;
    }
  </style>
</head>
<body>
  <div class="card">
    <div class="logo">
      <img src="https://1.bp.blogspot.com/-R-MlNjK6ilI/TxXuA2_mU-I/AAAAAAAAAAU/G8K0IpD0LgQ/s220/Escudo+Jo%25C3%25A3o+Bley.bmp" alt="Logo do TimeClass">
      <br>
    </div>
    <div class="verification-code">
      Seu código de verificação é:${code}
    </div>
    <div class="instructions">
      Por favor, insira este código no aplicativo TimeClass para continuar.
    </div>
    <div class="cta-button">
      <a>JOÃO BLEY - TimeClass</a>
    </div>
  </div>
</body>
</html>
`
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Erro ao enviar email de verificação:', error);
      res.status(500).json({ error: 'Erro ao enviar email de verificação' });
    } else {
      res.status(200).json({ email, message: 'Código de verificação enviado. Verifique seu e-mail.' });
    }
  });
};

const verify_code = (email, code) => {
  // Implemente a lógica de verificação do código aqui
  // Verifique se o código fornecido corresponde ao código armazenado no cache
  const expectedCode = cache.get(email);

  return code === expectedCode;
};

module.exports = { email_code, verify_code };
