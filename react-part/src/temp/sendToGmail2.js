require('dotenv').config();
const nodemailer = require('nodemailer');
const { google } = require('googleapis');

// const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
// const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
// const REFRESH_TOKEN = process.env.GOOGLE_REFRESH_TOKEN;

let transporter = nodemailer.createTransport({
  // service: process.env.MAIL_SERVICE,
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: "maddison53@ethereal.email",
    pass: "jn7jnAPss4f63QBp6D",
  },
});

// let mailOptions = {
//   from: 'your_email@gmail.com',
//   to: 'recipient_email@example.com',
//   subject: 'Тема вашего письма',
//   // text: 'Текст вашего письма'
//   html: '<p>Текст вашего письма в HTML формате</p>'
// };

async function sendEmail(optionsObj) {
  if (!optionsObj.from || !optionsObj.to || !optionsObj.subject) {
    return { success: false, body: "from, to, subject are required" };
  }

  try {
    let info = await transporter.sendMail(optionsObj);
    return { success: true, body: info.response };
  } catch (error) {
    return { success: false, body: error };
  }
}

module.exports = sendEmail;
