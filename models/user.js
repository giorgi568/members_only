const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  username: { type: String, required: true },
  password: { type: String, required: true },
  membership: { type: Boolean, required: true },
});

UserSchema.virtual('fullName').get(function () {
  return `${firstName} ${firstName}`;
});

module.exports = mongoose.model('User', UserSchema);
