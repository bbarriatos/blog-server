const express = require('express');
const app = express();
const connectDB = require('./config/db');

require('dotenv').config();

app.use(express.json({ extended: false }));

connectDB();

app.use('/api/users', require('./routes/User'));
app.use('/api/auth', require('./routes/Auth'));
app.use('/api/status', require('./routes/Status'));
app.use('/api/task', require('./routes/Task'));

app.listen(5000, () => {
  console.log(`Listening on port 5000`);
});
