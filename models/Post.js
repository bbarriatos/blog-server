const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const formatYmd = (date) => date.toISOString().slice(0, 10);

const PostSchema = new Schema({
  post_title: {
    type: String,
  },
  post_desc: {
    type: String,
  },
  file: {
    type: String,
  },
  post_date: {
    type: String,
    default: formatYmd(new Date()),
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: 'category',
  },
  status: {
    type: Schema.Types.ObjectId,
    ref: 'status',
  },
  allow_comments: {
    type: Boolean,
  },
  comments: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: 'users',
      },
      comment_content: {
        type: String,
      },
    },
  ],
  user: {
    type: Schema.Types.ObjectId,
    ref: 'users',
  },
});

module.exports = mongoose.model('posts', PostSchema);
