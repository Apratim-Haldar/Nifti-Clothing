const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
dotenv.config();

const sendEmail = async (to, subject, html) => {
  const transporter = nodemailer.createTransporter({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT),
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  await transporter.sendMail({ from: process.env.EMAIL_FROM, to, subject, html });
};

module.exports = { sendEmail };