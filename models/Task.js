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
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'users',
  },
  status: {
    type: Schema.Types.ObjectId,
    ref: 'status',
    default: '6158a53a53aa9419a84e22b0',
  },
});

module.exports = mongoose.model('tasks', TaskSchema);
