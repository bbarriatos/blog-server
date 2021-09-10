const express = require('express');
const { check, validationResult } = require('express-validator');
const Posts = require('../models/Post');
const router = express.Router();
const { isLoggedIn, isLoggedOut } = require('../config/authorizeUser');

const defaultPageConfig = {
  title: 'Posts | Bon Blog Site',
  listExists: true,
  username: null,
  email: null,
};

router.get('/', async (req, res) => {
  try {
    res.render('home/posts', {
      ...defaultPageConfig,
      bodyClass: `bg-gradient-primary`,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

router.post(
  '/',
  [
    check('title', 'Title is required').isLength({ min: 1, max: 100 }),
    check('content', 'Content is required').exists(),
  ],
  async (req, res) => {
    const err = validationResult(req);
    const { title, content } = req.body;

    if (!err.isEmpty()) {
      return res.status(400).json({ errors: err.array() });
    }

    try {
      const post = await new Posts({
        post_title: title,
        post_desc: content,
        status: '60c50dc4e10a9750b826edc3',
      });

      await post.save();

      res.json(post);
    } catch (error) {
      res.status(500).json({ message: 'Server Error' });
    }
  }
);

router.put('/:id', async (req, res) => {
  const err = validationResult(req);
  const { title, content, status } = req.body;

  if (!err.isEmpty()) {
    return res.status(400).json({ errors: err.array() });
  }

  try {
    const post = await Posts.findById(req.params.id);

    post.post_title = title;
    post.post_desc = content;
    post.status = status;

    await post.save();

    res.json(post);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const post = await Posts.findByIdAndDelete(req.params.id);

    await post.remove();

    res.json('Post Deleted');
  } catch (error) {
    res.status(500).send('Server Error');
  }
});

module.exports = router;
