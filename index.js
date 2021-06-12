const express = require('express');
const app = express();
const connectDB = require('./config/db');

app.use(express.json({ extended: false }));

connectDB();

app.use('/api/users', require('./routes/User'));
app.use('/api/auth', require('./routes/Auth'));

app.listen(5000, () => {
  console.log(`Listening on port 5000`);
});
