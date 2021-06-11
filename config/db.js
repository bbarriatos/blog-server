const mongoose = require('mongoose');
const db = 'mongodb+srv://root:root@blog-todo.yypn0.mongodb.net/blog_server';

const connectDB = () => {
  try {
    mongoose.connect(db, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    });
    console.log('MongoDB Connected...');
  } catch (err) {
    console.log(err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
