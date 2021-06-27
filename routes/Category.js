const express = require('express');
const { check, validationResult } = require('express-validator');
const Category = require('../models/Category');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const category = await Category.find();

    res.json(category);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

router.post(
  '/',
  [check('name', 'Please set a category name').isLength({ min: 1, max: 100 })],
  async (req, res) => {
    const err = validationResult(req);
    const { name } = req.body;

    if (!err.isEmpty()) {
      return res.status(400).json({ errors: err.array() });
    }

    try {
      const category = await new Category({
        category_name: name,
      });

      await category.save();
      res.json(category);
    } catch (error) {
      res.status(500).send('Server Error');
    }
  }
);

router.put('/:id', async (req, res) => {
  const err = validationResult(req);
  const { name } = req.body;

  if (!err.isEmpty()) {
    return res.status(400).json({ errors: err.array() });
  }

  try {
    const category = await Category.findById(req.params.id);

    category.category_name = name;

    await category.save();

    res.json(category);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);

    await category.remove();

    res.json('Category Deleted');
  } catch (error) {
    res.status(500).send('Server Error');
  }
});

module.exports = router;
