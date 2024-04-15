require('dotenv').config();
const nodemailer = require('nodemailer');

let transporter = nodemailer.createTransport({
  service: process.env.MAIL_SERVICE,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASSWORD
  }
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
