const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false, // true si usás puerto 465
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

async function enviarCorreo(destinatario, asunto, mensajeHTML) {
  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: destinatario,
    subject: asunto,
    html: mensajeHTML,
  });
}

module.exports = { enviarCorreo };
