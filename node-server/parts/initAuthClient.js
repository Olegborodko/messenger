require('./constants');
const { OAuth2Client, google } = require('google-auth-library');
const nodemailer = require('nodemailer');

const clientReadyOAuth2 = new OAuth2Client(
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  'postmessage'
);

async function fnSendMail(mailOptions) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      type: 'login',
      user: MAIL_USER,
      pass: APP_PASSWORD
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
