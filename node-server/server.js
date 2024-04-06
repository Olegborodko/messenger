const express = require('express');
const app = express();
const port = 3001; //
const connect = require('./db/db');
const cors = require('cors');

const Message = require('./db/models/messageModel');

let dbConnection;

(async () => {
  try {
    dbConnection = await connect();
  } catch (error) {
    process.exit(1);
  }
})();

app.use(cors());

app.get('/', (req, res) => {
  res.send('TEST SERVER');
});

app.get('/messages', async (req, res) => {
  const messages = await Message.find();
  res.send(messages);
});

app.listen(port, () => {
  console.log(`Server works on port ${port}`);
});