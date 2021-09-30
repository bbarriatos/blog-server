require('dotenv').config();
const express = require('express');
const app = express();
const connectDB = require('./config/db');
const path = require('path');
const Handlebars = require('handlebars');
const {
  allowInsecurePrototypeAccess,
} = require('@handlebars/allow-prototype-access');
const handlebars = require('express-handlebars');
const bcrypt = require('bcryptjs');
const session = require('express-session');
const methodOverride = require('method-override');
const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const { isLoggedIn, isLoggedOut } = require('./config/authorizeUser');
const upload = require('express-fileupload');
const pageConfig = require('./config/defaultPageConfig');
const User = require('./models/User');

connectDB();

app.set('view engine', 'hbs');
app.use(upload());
app.engine(
  'hbs',
  handlebars({
    handlebars: allowInsecurePrototypeAccess(Handlebars),
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

app.use(express.static('public'));
app.use(
  session({
    secret: 'verygoodsecret',
    resave: false,
    saveUninitialized: true,
  })
);
app.use(express.urlencoded({ extended: false }));
app.use(express.json({ extended: false }));
app.use(methodOverride('_method'));

// Passport.js
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  User.findById(id, function (err, user) {
    done(err, user);
  });
});

passport.use(
  new localStrategy(function (email, password, done) {
    User.findOne({ user_email: email }, function (err, user) {
      if (err) return done(err);
      if (!user) return done(null, false, { message: 'Incorrect Email.' });

      bcrypt.compare(password, user.user_password, function (err, res) {
        if (err) return done(err);
        if (res === false)
          return done(null, false, { message: 'Incorrect Password.' });

        return done(null, user);
      });
    });
  })
);

app.get('/', isLoggedIn, (req, res) => {
  try {
    res.render('home/index', {
      ...pageConfig,
      title: 'Home | Bon Blog Site',
      bodyClass: 'bg-gradient-primary',
    });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

app.get('/login', isLoggedOut, (req, res) => {
  try {
    res.render('main', {
      ...pageConfig,
      bodyClass: 'bg-gradient-primary',
      error: req.query.error,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

app.post(
  '/login',
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login?error=true',
  })
);

app.get('/logout', function (req, res) {
  req.logout();
  res.redirect('/');
});

// app.use('/register', require('./routes/User'));
app.use('/posts', isLoggedIn, require('./routes/Posts'));
app.use('/category', isLoggedIn, require('./routes/Category'));
// app.use('/api/status', require('./routes/Status'));
// app.use('/api/task', require('./routes/Task'));
// app.use('/api/category', require('./routes/Category'));

app.listen(5000, () => {
  console.log(`Listening on port 5000`);
});
