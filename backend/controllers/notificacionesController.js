// 📁 backend/controllers/notificacionesController.js

const nodemailer = require('nodemailer');

const enviarCorreo = async (req, res) => {
  const { asunto, contenido } = req.body;

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    await transporter.sendMail({
        from: process.env.EMAIL_FROM,
        to: process.env.ADMIN_EMAIL, 
        subject: asunto,
        text: contenido,
      });      

    res.status(200).json({ mensaje: '✅ Correo enviado' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: '❌ Error al enviar correo' });
  }
};

module.exports = { enviarCorreo };

