const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  user_username: {
    type: String,
  },
  user_email: {
    type: String,
  },
  user_password: {
    type: String,
  },
  user_admin: {
    type: Boolean,
  },
});

module.exports = mongoose.model('users', UserSchema);
