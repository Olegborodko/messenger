require('dotenv').config();
const { OAuth2Client } = require('google-auth-library');

const googleClientId = process.env.GOOGLE_CLIENT_ID;
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;
const client = new OAuth2Client(googleClientId, googleClientSecret);

async function verifyToken(accessToken) {
  try {
    const tokenInfo = await client.getTokenInfo(accessToken);
    const userEmail = tokenInfo.email;
    console.log(userEmail);

    const currentTime = Math.floor(Date.now() / 1000);
    const exp = tokenInfo.exp;

    const isExpired = exp < currentTime;

    if (isExpired) {
      return null;
    } else {
      return checkEmail(userEmail);
    }
  } catch (error) {
    return null;
  }
}

function checkEmail(userEmail) {
  return process.env.CORRECT_USER === userEmail ? userEmail : null;
}

module.exports = { verifyToken, checkEmail };