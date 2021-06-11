const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const PostSchema = new Schema({
  post_title: {
    type: String,
  },
  post_desc: {
    type: String,
  },
  post_date: {
    type: String,
    default: Date.now(),
  },
  comments: [
    {
      type: Schema.Types.ObjectId,
      ref: 'comment',
    },
  ],
  user: {
    type: Schema.Types.ObjectId,
    ref: 'users',
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: 'category',
  },
  status: {
    type: Schema.Types.ObjectId,
    ref: 'status',
  },
});

module.exports = mongoose.model('posts', PostSchema);
