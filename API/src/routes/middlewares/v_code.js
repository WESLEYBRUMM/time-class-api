const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const randtoken = require('rand-token');
const speakeasy = require('speakeasy');
const cache = require('memory-cache');
const verifyCodeMiddleware = (req, res, next) => {
  const email = req.body.email;
  const code = req.body.code;

  // Recupere o código do cache
  const expectedCode = cache.get(email);
  console.log(email)
  console.log(expectedCode)
  console.log(code)

  if (code === expectedCode) {
    // Código válido
    next(); // Continue para a próxima função de middleware ou rota
  } else {
    // Código inválido
    res.status(401).json({ email, error: 'Código inválido. Tente novamente.' });
  }
};

module.exports = verifyCodeMiddleware;