const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const StatusSchema = new Schema({
  status_name: {
    type: String,
  },
});

module.exports = mongoose.model('status', StatusSchema);
