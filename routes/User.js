const express = require('express');
const { check, validationResult } = require('express-validator');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const uniqid = require('uniqid');
const jwt = require('jsonwebtoken');
const router = express.Router();

router.get('/', (req, res) => {
  res.send('express js');
});

router.post(
  '/',
  [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is Required').exists(),
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
      });

      const salt = await bcrypt.genSalt(10);
      user.user_password = await bcrypt.hash(user.user_password, salt);

      await user.save();

      const payload = {
        user: {
          id: user.id,
        },
      };

      jwt.sign(payload, uniqid(), { expiresIn: 360000 }, (err, token) => {
        if (err) throw err;
        res.json({ token });
      });
    } catch (error) {
      res.status(500).send('Server Error');
    }
  }
);

router.put('/:id', (req, res) => {});

module.exports = router;
