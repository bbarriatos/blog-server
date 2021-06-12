const express = require('express');
const { check, validationResult } = require('express-validator');
const Status = require('../models/Status');
const router = express.Router();

router.post(
  '/',
  [
    check('name', 'Please set a status name').isLength({ min: 1, max: 100 }),
    check('category', 'Please set a category name').isLength({
      min: 1,
      max: 100,
    }),
  ],
  async (req, res) => {
    const err = validationResult(req);
    const { name, category } = req.body;

    if (!err.isEmpty()) {
      return res.status(400).json({ errors: err.array() });
    }

    try {
      const status = await new Status({
        status_name: name,
        status_category: category,
      });

      await status.save();
      res.json(status);
    } catch (error) {
      res.status(500).send('Server Error');
    }
  }
);

module.exports = router;
