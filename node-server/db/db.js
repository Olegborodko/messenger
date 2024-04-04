require('dotenv').config();
const mongoose = require('mongoose');

const urlDB = process.env.DB_URL || "";

async function connect(){
  try {
    const connection = await mongoose.connect(urlDB);
    console.log('Connect db success');
    return connection;
  } catch(error) {
    console.error('Error connect to db - ', error);
    throw error;
  }
}

module.exports = connect;
