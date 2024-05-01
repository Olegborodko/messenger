const { OAuth2Client } = require('google-auth-library');
const nodemailer = require('nodemailer');

const clientReadyOAuth2 = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  'postmessage'
);

async function fnSendMail(mailOptions, mailUser, appPassword) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      type: 'login',
      user: mailUser,
      pass: appPassword
    }
  });

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.response);
    return true;
  } catch (error) {
    console.error('Error occurred:', error);
    return null;
  }
}

module.exports = { clientReadyOAuth2, fnSendMail }
