const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  idEmail: String,
  from: String,
  subject: String,
  body: Text,
  date: String,
  status: String,
});

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;