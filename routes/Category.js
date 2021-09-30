const express = require('express');
const { check, validationResult } = require('express-validator');
const { pageConfig } = require('../config/defaultPageConfig');
const Category = require('../models/Category');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    Category.find({}).then((category) => {
      res.render('home/categories/index', {
        ...pageConfig,
        title: 'Category | Bon Blog Site',
        bodyClass: `bg-gradient-primary`,
        category_list: category,
        number_of_post: category.length,
      });
    });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    Category.findOne({ _id: req.params.id }).then((category) => {
      res.render('home/categories/editCategory', {
        ...pageConfig,
        title: 'Category | Bon Blog Site',
        bodyClass: `bg-gradient-primary`,
        category: category,
      });
    });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

router.post(
  '/',
  [check('title', 'Please set a category name').isLength({ min: 1, max: 100 })],
  async (req, res) => {
    const err = validationResult(req);
    const { title } = req.body;

    if (!err.isEmpty()) {
      return res.status(400).json({ errors: err.array() });
    }

    try {
      const category = await new Category({
        category_name: title,
      });

      await category.save();

      res.redirect('/category');
    } catch (error) {
      res.status(500).send('Server Error');
    }
  }
);

router.put(
  '/:id',
  [check('title', 'Please set a category name').isLength({ min: 1, max: 100 })],
  async (req, res) => {
    const err = validationResult(req);
    const { title } = req.body;

    if (!err.isEmpty()) {
      return res.status(400).json({ errors: err.array() });
    }

    try {
      const category = await Category.findById(req.params.id);

      category.category_name = title;

      await category.save();

      res.redirect('/category');
    } catch (error) {
      res.status(500).json({ message: 'Server Error' });
    }
  }
);

router.delete('/:id', async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);

    await category.remove();

    res.redirect('/category');
  } catch (error) {
    res.status(500).send('Server Error');
  }
});

module.exports = router;
