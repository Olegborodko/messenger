require('dotenv').config();
const express = require('express');
const port = process.env.PORT || 3001; //
const connect = require('./db/db');
const http = require('http');
const cors = require('cors');
const socketIo = require('socket.io');
const Message = require('./db/models/messageModel');

const app = express();
const server = http.createServer(app);

const io = socketIo(server, {
  cors: {
    origin: process.env.SERVER_URL,
    methods: ["GET", "POST"]
  }
});

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

// app.get('/messages', async (req, res) => {
//   const messages = await Message.find();
//   res.send(messages);
// });

io.on('connection', socket => {
  console.log('Client connected');

  const intervalId = setInterval(async () => {
    const messages = await Message.find().sort({ timestamp: -1 });
    socket.emit('messages', messages);
  }, 2000);

  socket.on('disconnect', () => {
    console.log('Client disconnected');
    clearInterval(intervalId);
  });
});

server.listen(port, () => {
  console.log(`Server works on port ${port}`);
});