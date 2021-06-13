const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const TaskSchema = new Schema({
  task_title: {
    type: String,
  },
  task_content: {
    type: String,
  },
  task_date: {
    type: String,
    default: Date.now(),
  },
  task_due: {
    type: String,
    default: Date.now(),
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'user',
  },
  status: {
    type: Schema.Types.ObjectId,
    ref: 'status',
  },
});

module.exports = mongoose.model('tasks', TaskSchema);
