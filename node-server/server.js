require('dotenv').config();
require('express-async-errors');
const express = require('express');
const port = process.env.PORT || 3001; //
const connect = require('./db/db');
const http = require('http');
const cors = require('cors');
const path = require('path');
const socketIo = require('socket.io');
const { Message, mongoose } = require('./db/models/messageModel');

const buildPath = path.join(__dirname, '../react-part/build');

const app = express();
app.use(express.static(buildPath));
const server = http.createServer(app);

const io = socketIo(server, {
  cors: {
    origin: process.env.FRONTEND_URL,
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
app.use(express.json());

function errorFill(errObj) {
  return Object.assign(new Error(errObj.message || 'error'), { status: errObj.status });
}

const errorHandling = (err, req, res, next) => {
  res.status(err.status || 500).json({
    msg: err.message,
    status: err.status,
  });
};

app.get('/test', (req, res) => {
  res.send('TEST SERVER');
});

app.post('/webhook', async (req, res, next) => {
  if (req.body) {
    let data = req.body;
    let id = data.id;
    let oneMessage = await Message.findOne({ idEmail: id });

    if (!oneMessage) {
      let newMessage = new Message({
        _id: new mongoose.Types.ObjectId(),
        idEmail: id,
        ...data
      });

      await newMessage.save();
      res.status(200).end();
    } else {
      next(errorFill({status: 304, message: "the entry already exists"}));
    }
  }

  // const messages = await Message.find({});

  // const error = new Error('Произошла ошибка');
  // error.status = 500;
  // next(error);

  // next(errorFill({status: 400}));
  res.status(200).end();
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

app.use(errorHandling);

server.listen(port, () => {
  console.log(`Server works on port ${port}`);
});