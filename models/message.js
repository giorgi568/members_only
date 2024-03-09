const mongoose = require('mongoose');
const { DateTime } = require('luxon');

const Schema = mongoose.Schema;

const MessageSchema = new Schema({
  title: { type: String, required: true },
  text: { type: String, required: true },
  timestamp: { type: Date, required: true, default: new Date() },
  author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
});

MessageSchema.virtual('timestamp_formatted').get(function () {
  return DateTime.fromJSDate(this.timestamp).toLocaleString(
    DateTime.DATETIME_MED
  );
});

//indexes for search
MessageSchema.index(
  { text: 'text', title: 'text' },
  {
    name: 'TextIndex',
    default_language: 'none', // Set the default language for text analysis
    stopwords: [], // Specify custom stop words
  }
);

module.exports = mongoose.model('Message', MessageSchema);
