const express = require('express');
const { check, validationResult } = require('express-validator');
const { pageConfig } = require('../config/defaultPageConfig');
const Category = require('../models/Category');
const Logs = require('../models/ActivityLogs');
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

    try {
      const category = await new Category({
        category_name: title,
      });

      console.log(category);

      if (!err.isEmpty()) {
        const errorMsg = err.mapped();
        let errorMsgValue = '';
        const title = errorMsg?.title;

        if (title) {
          errorMsgValue = 'Please fill in the missing field.';
        }

        req.flash('error_message', `${errorMsgValue}`);
        res.redirect('/category');
      } else {
        await category.save().then((savedCategory) => {
          const log = new Logs({
            user: req.user,
            category: savedCategory.id,
            post: null,
            task: null,
            note: `${req.user.user_username} added new category`,
          });

          log.save();

          req.flash('success_message', 'Category was created successfully');
          res.redirect('/category');
        });
      }
    } catch (error) {
      res.status(500).send('Server Error');
    }
  }
);

router.put(
  '/:id',
  [check('title', 'Please set a category name').isLength({ min: 1, max: 100 })],
  async (req, res) => {
    const { title } = req.body;

    try {
      const category = await Category.findById(req.params.id);

      category.category_name = title;

      await category.save().then((savedCategory) => {
        const log = new Logs({
          user: req.user,
          category: savedCategory.id,
          post: null,
          task: null,
          note: `${req.user.user_username} updated the category`,
        });

        log.save();
      });

      res.redirect('/category');
    } catch (error) {
      res.status(500).json({ message: 'Server Error' });
    }
  }
);

router.delete('/:id', async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);

    await category.remove().then((savedCategory) => {
      const log = new Logs({
        user: req.user,
        category: savedCategory.id,
        post: null,
        task: null,
        note: `${req.user.user_username} deleted a task`,
      });

      log.save();
    });

    res.redirect('/category');
  } catch (error) {
    res.status(500).send('Server Error');
  }
});

module.exports = router;
