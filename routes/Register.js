const express = require('express');
const { check, validationResult } = require('express-validator');
const { isLoggedOut } = require('../config/authorizeUser');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const uniqid = require('uniqid');
const jwt = require('jsonwebtoken');
const router = express.Router();

const defaultPageConfig = {
  title: 'Login | Bon Blog Site',
  listExists: true,
};

router.get('/', isLoggedOut, async (req, res) => {
  try {
    res.render('register', {
      ...defaultPageConfig,
      title: 'Register | Bon Blog Site',
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

      await user.save();

      const payload = {
        user: {
          id: user.id,
        },
      };

      jwt.sign(payload, uniqid(), { expiresIn: 360000 }, (err, token) => {
        if (err) throw err;
        res.redirect('/login');
        // res.render('home/index', { title: 'Home | Bon Blog Site' });
      });
    } catch (error) {
      res.status(500).send('Server Error');
    }
  }
);

// router.put(
//   '/:id',
//   [
//     check('username', 'Please input your desired username')
//       .optional()
//       .isLength({
//         min: 1,
//       }),
//     check('email', 'Please include a valid email')
//       .optional()
//       .isLength({ min: 4, max: 100 })
//       .isEmail(),
//     check('password', 'Password is Required')
//       .isLength({ min: 8, max: 100 })
//       .optional()
//       .exists(),
//     check('confirmPassword')
//       .isLength({ min: 8, max: 100 })
//       .optional()
//       .custom((value, { req }) => {
//         if (value !== req.body.password) {
//           throw new Error('Password confirmation does not match password');
//         }
//         return true;
//       }),
//   ],
//   async (req, res) => {
//     const err = validationResult(req);
//     const { username, email, password } = req.body;
//     const user = await User.findById(req.params.id);

//     if (!err.isEmpty()) {
//       return res.status(400).json({ message: err.array() });
//     }

//     try {
//       let checkEmail = await User.findOne({ user_email: email });

//       if (checkEmail) {
//         return res
//           .status(400)
//           .json({ errors: [{ msg: 'Email already exists' }] });
//       }

//       const salt = await bcrypt.genSalt(10);

//       user.user_username = username;
//       user.user_email = email;
//       user.user_password = await bcrypt.hash(password, salt);

//       await user.save();

//       res.json(user);
//     } catch (error) {
//       res.status(500).send('Server Error');
//     }
//   }
// );

// router.delete('/:id', async (req, res) => {
//   try {
//     const user = await User.findByIdAndDelete(req.params.id);

//     await user.remove();

//     res.json('User Deleted');
//   } catch (error) {
//     res.status(500).send('Server Error');
//   }
// });

module.exports = router;
