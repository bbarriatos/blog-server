const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const LogsSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'users',
  },
  post: {
    type: Schema.Types.ObjectId,
    ref: 'posts',
  },
  task: {
    type: Schema.Types.ObjectId,
    ref: 'tasks',
  },
});

module.exports = mongoose.model('logs', LogsSchema);
