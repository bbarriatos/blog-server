const mongoose = require('mongoose');

const connectDB = () => {
  const db = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@blog-todo.yypn0.mongodb.net/blog_server`;

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
