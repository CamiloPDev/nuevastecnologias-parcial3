// src/utils/sendEmail.js
const nodemailer = require("nodemailer");

// Transportador SMTP
const transporter = nodemailer.createTransport({
  service: "gmail", // puedes cambiar a outlook, yahoo o SMTP personalizado
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Función para enviar correos
const sendEmail = async (to, subject, html) => {
  try {
    const mailOptions = {
      from: `"Nails Studio" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html
    };

    await transporter.sendMail(mailOptions);

    console.log(`📧 Email enviado a: ${to}`);
    return true;

  } catch (error) {
    console.error("❌ Error al enviar email:", error.message);
    return false;
  }
};

module.exports = sendEmail;
