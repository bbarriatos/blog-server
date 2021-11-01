const express = require('express');
const { check, validationResult } = require('express-validator');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const router = express.Router();

const defaultPageConfig = {
  title: 'All Users | Bon Blog Site',
  listExists: true,
};

router.get('/', async (req, res) => {
  try {
    User.find({}).then((user) => {
      res.render('home/users/index', {
        ...defaultPageConfig,
        title: 'Users | Bon Blog Site',
        bodyClass: `bg-gradient-primary`,
        users: user,
      });
    });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

router.get('/addUser', async (req, res) => {
  try {
    res.render('home/users/addUser', {
      ...defaultPageConfig,
      title: 'Add User | Bon Blog Site',
      bodyClass: `bg-gradient-primary`,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

router.post(
  '/',
  [
    check('username', 'Please input your desired username').isLength({
      min: 1,
    }),
    check('email', 'Please include a valid email')
      .isLength({ min: 4, max: 100 })
      .isEmail(),
    check('password', 'Password is Required')
      .isLength({ min: 8, max: 100 })
      .exists(),
    check('confirmPassword').custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Password confirmation does not match password');
      }
      return true;
    }),
  ],
  async (req, res) => {
    const err = validationResult(req);
    const { username, email, password } = req.body;

    if (!err.isEmpty()) {
      return res.status(400).json({ errors: err.array() });
    }

    try {
      let checkEmail = await User.findOne({ user_email: email });

      if (checkEmail) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'Email already exists' }] });
      }

      const user = await new User({
        user_username: username,
        user_email: email,
        user_password: password,
        user_admin: true,
      });

      const salt = await bcrypt.genSalt(10);
      user.user_password = await bcrypt.hash(user.user_password, salt);

      await user.save().then((savedUser) => {
        req.flash('success_message', 'User added successfully');
        res.redirect('/users');
      });
    } catch (error) {
      res.status(500).send('Server Error');
    }
  }
);

router.delete('/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    await user.remove().then((savedUser) => {
      req.flash('success_message', 'User deleted successfully');
      res.redirect('/users');
    });
  } catch (error) {
    res.status(500).send('Server Error');
  }
});

module.exports = router;
