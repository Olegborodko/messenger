require('dotenv').config();
const { clientReadyOAuth2 } = require('./initAuthClient');
const client = clientReadyOAuth2;

async function verifyToken(accessToken, userSession) {
  try {
    const tokenInfo = await client.getTokenInfo(accessToken);
    const userEmail = tokenInfo.email;

    const currentTime = Math.floor(Date.now() / 1000);
    const exp = tokenInfo.exp;

    const isExpired = exp < currentTime;

    if (isExpired) {
      return null;
    } else {
      return checkEmail(userEmail, userSession);
    }
  } catch (error) {
    return null;
  }
}

function checkEmail(userEmail, userSession) {
  return getEmailIndex(userEmail, userSession) !== null ? userEmail : null;
}

function getEmailIndex(userEmail, userSession) {
  const correctUser = process.env.CORRECT_USER;
  const emails = correctUser.split('|');

  const index = emails.indexOf(userEmail);

  if (index > -1) {
    userSession.setCurrentIndex(index);
    return index;
  } else {
    return null
  }
}

async function getTokens(authCode) {
  try {
    const { tokens } = await client.getToken(authCode);
    return tokens;
  } catch (error) {
    return null;
  }
}

module.exports = { verifyToken, getTokens };
