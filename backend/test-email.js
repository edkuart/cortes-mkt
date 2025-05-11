const nodemailer = require('nodemailer');
require('dotenv').config();

async function enviarCorreoPrueba() {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: Number(process.env.EMAIL_PORT),
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: process.env.EMAIL_USER, // te lo mandas a ti mismo para probar
      subject: '📨 Prueba de correo desde Node.js',
      text: 'Este es un correo de prueba para verificar la configuración de nodemailer.',
    });

    console.log('✅ Correo enviado:', info.messageId);
  } catch (error) {
    console.error('❌ Error al enviar el correo:', error);
  }
}

enviarCorreoPrueba();
