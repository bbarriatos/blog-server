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
  category: {
    type: Schema.Types.ObjectId,
    ref: 'category',
  },
  note: {
    type: String,
  },
});

module.exports = mongoose.model('logs', LogsSchema);
