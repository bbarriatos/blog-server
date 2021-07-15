const express = require('express');
const app = express();
const connectDB = require('./config/db');
const path = require('path');
const handlebars = require('express-handlebars');
const orderid = require('order-id')('mysecret');
const id = orderid.generate();

require('dotenv').config();

app.set('view engine', 'hbs');
app.engine(
  'hbs',
  handlebars({
    layoutsDir: __dirname + '/views/layouts',
    extname: 'hbs',
    defaultLayout: 'index',
    helpers: {
      copyrightYear: function () {
        return new Date().getFullYear();
      },
    },
    partialsDir: __dirname + '/views/partials/',
  })
);

connectDB();

app.use(express.static('public'));

// app.use('/', require('./routes/User'));

app.use('/api/users', require('./routes/User'));
app.use('/api/auth', require('./routes/Auth'));
app.use('/api/status', require('./routes/Status'));
app.use('/api/task', require('./routes/Task'));
app.use('/api/category', require('./routes/Category'));
app.use('/api/posts', require('./routes/Posts'));

const defaultPageConfig = {
  title: 'Login | Bon Blog Site',
  listExists: true,
};

app.get('/', (req, res) => {
  res.render('main', {
    ...defaultPageConfig,
    bodyClass: `bg-gradient-primary`,
  });
});

app.listen(5000, () => {
  console.log(`Listening on port 5000`);
});
