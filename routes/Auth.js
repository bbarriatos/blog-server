const express = require('express');
const { check, validationResult } = require('express-validator');
const User = require('../models/User');
const uniqid = require('uniqid');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const router = express.Router();

router.get('/', (req, res) => {
  res.json('Logged In');
});

router.post(
  '/',
  [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is Required').exists(),
  ],
  async (req, res) => {
    const err = validationResult(req);
    const { email, password } = req.body;

    if (!err.isEmpty()) {
      return res.status(400).json({ errors: err.array() });
    }

    try {
      let checkEmail = await User.findOne({ user_email: email });

      if (!checkEmail) {
        return res.status(400).json({ error: 'Invalid Credentials' });
      }

      const loginMatch = await bcrypt.compare(
        password,
        checkEmail.user_password
      );

      if (!loginMatch) {
        return res.status(400).json({ error: 'Invalid Credentials' });
      }

      const payload = {
        user: {
          id: checkEmail.id,
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

module.exports = router;
