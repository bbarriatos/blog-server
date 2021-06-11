const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const CommentSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'users',
  },
  post: {
    type: Schema.Types.ObjectId,
    ref: 'posts',
  },
  comment_content: {
    type: String,
  },
});

module.exports = mongoose.model('comments', CommentSchema);
