const mongoose = require('mongoose');
const DateTime = require('luxon');

const Schema = mongoose.Schema;

const MessageSchema = new Schema({
  title: { type: String, required: true },
  text: { type: String, required: true },
  timestamp: { type: Date, required: true, default: new Date() },
});

MessageSchema.virtual('timestamp_formatted').get(function () {
  return DateTime.fromJSDate(this.timestamp).toLocaleString(DateTime.DATE_MED);
});

module.exports = mongoose.model('Message', MessageSchema);
