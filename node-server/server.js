require('dotenv').config();
require('express-async-errors');
const express = require('express');
const port = process.env.PORT || 3001;
const connect = require('./db/db');
const https = require('https');
const fs = require('fs');
const cors = require('cors');
const path = require('path');
const socketIo = require('socket.io');
const { fnSendMail } = require('./parts/initAuthClient');
const { Message, mongoose } = require('./db/models/messageModel');
const { verifyToken, getTokens } = require('./parts/googleAuth');
const userSession = require('./parts/userSession');
const { transformText } = require('./parts/openAI');
const { googleGetTranscription } = require('./parts/googleSpeech');

const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

const buildPath = path.join(__dirname, '../react-part/build');

const app = express();
app.use(express.static(buildPath));
// const server = http.createServer(app);

const options = {
  key: fs.readFileSync(process.env.KEY_PATH_PRIVKEY),
  cert: fs.readFileSync(process.env.KEY_PATH_FULLCHAIN),
};

const server = https.createServer(options, app).listen(port, () => {
  console.log('Server works on port ', port);
});

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

app.post('/google-speech', upload.single('audio'), async (req, res, next) => {
  try {
    const filePath = req.file.path;

    if (!req.body.sampleRateHertz){
      next(errorFill({ status: 500, message: 'error parameters' }));
    }

    let transcript = await googleGetTranscription(filePath, req.body.sampleRateHertz);

    res.status(200).json({ result: transcript });
  } catch (error) {
    next(errorFill({ status: 500, message: error }));
  }
});

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
      next(errorFill({ status: 304, message: "the entry already exists" }));
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

app.post('/open-ai', async (req, res, next) => {
  const data = req.body;
  if (!data || !data.data) {
    next(errorFill({ status: 500, message: 'Invalid request data' }));
  }

  try {
    let result = await transformText(data.data);

    if (result) {
      res.status(200).json({ result });
    } else {
      next(errorFill({ status: 500, message: 'Failed to transform text' }));
    }
  } catch (error) {
    next(errorFill({ status: 500, message: error.message }));
  }
});

app.post('/send-email', async (req, res, next) => {
  const formData = req.body;

  if (!formData.formData || !formData.formData.subject ||
    !formData.formData.idEmail || !formData.formData.fromEmail) {
    next(errorFill({ status: 500, message: '' }));
  }

  let data = formData.formData;

  let email = userSession.getCurrentValue(process.env.CORRECT_USER);
  let appPassword = userSession.getCurrentValue(process.env.APP_PASSWORD);

  const mailOptions = {
    from: email,
    to: data.fromEmail,
    subject: data.subject,
    html: data.message
  };

  let send = await fnSendMail(mailOptions, email, appPassword);
  if (send) {
    let oneMessage = await Message.findOne({ idEmail: data.idEmail });

    if (oneMessage) {
      oneMessage.answer = data.message;
      await oneMessage.save();
      res.status(200).json({ idEmail: data.idEmail });
    } else {
      next(errorFill({ status: 500, message: "db is not connection" }));
    }
  } else {
    next(errorFill({ status: 500, message: send.body }));
  }
});

const sendMessages = async (socket, token) => {
  const userEmail = await verifyToken(token, userSession);
  if (!userEmail) {
    socket.isAuthenticated = false;
    socket.disconnect();
    console.log('isAuthent false');
  } else {
    socket.isAuthenticated = true;
    const messages = await Message.find().sort({ timestamp: -1 });
    socket.emit('messages', messages);
    console.log('isAuthent true');
  }
}

io.on('connection', async socket => {
  let intervalId;
  console.log('Client connected');

  socket.on('google-authenticate', async (data) => {
    if (!data || !data.data) {
      socket.isAuthenticated = false;
      socket.disconnect();
      return;
    }

    const tokens = await getTokens(data.data);
    if (!tokens) {
      socket.isAuthenticated = false;
      socket.disconnect();
      return;
    }

    await sendMessages(socket, tokens.access_token);

    if (socket.isAuthenticated) {
      intervalId = setInterval(async () => {
        await sendMessages(socket, tokens.access_token);
      }, process.env.REFRESH_MESSAGES_INTERVAL);
    }
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
    clearInterval(intervalId);
  });
});

app.use(errorHandling);
