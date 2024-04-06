const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: String,
  email: String,
  text: String,
  status: String,
});

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;