const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  idEmail: String,
  fromName: String,
  fromEmail: String,
  subject: String,
  body: String,
  date: String,
  status: String,
  answer: String,
}, { strict: 'throw' });

const Message = mongoose.model('Message', messageSchema);

module.exports = { Message, mongoose };