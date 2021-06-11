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
});

module.exports = mongoose.model('tasks', TaskSchema);
