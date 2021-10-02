const express = require('express');
const { check, validationResult } = require('express-validator');
const { v4: uuidv4 } = require('uuid');
const { pageConfig, uploadDir } = require('../config/defaultPageConfig');
const Posts = require('../models/Post');
const Category = require('../models/Category');
const Status = require('../models/Status');
const { uploadIsEmpty } = require('../helpers/upload-helper');
const router = express.Router();
const fs = require('fs');

router.get('/', async (req, res) => {
  try {
    Posts.find({})
      .populate({ path: 'category', select: 'category_name -_id' })
      .populate({ path: 'status', select: 'status_name -_id' })
      .then((posts) => {
        res.render('home/posts/posts', {
          ...pageConfig,
          title: 'Posts | Bon Blog Site',
          bodyClass: `bg-gradient-primary`,
          post_list: posts,
          number_of_post: posts.length,
        });
      });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

router.get('/addpost', async (req, res) => {
  try {
    const categories = await Category.find();
    const status = await Status.find();

    res.render('home/posts/addPost', {
      ...pageConfig,
      title: 'Add Post | Bon Blog Site',
      bodyClass: `bg-gradient-primary`,
      categories: categories,
      status: status.filter((stat) => stat.status_category === 'Posts'),
    });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

router.get('/:postId', async (req, res) => {
  try {
    const categories = await Category.find();
    const status = await Status.find();

    Posts.findOne({ _id: req.params.postId })
      .populate('category')
      .then((postData) => {
        res.render('home/posts/editPost', {
          ...pageConfig,
          title: 'Update Post | Bon Blog Site',
          bodyClass: `bg-gradient-primary`,
          post: postData,
          categories: categories,
          status: status.filter((stat) => stat.status_category === 'Posts'),
        });
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
    const { title, content, category, status, allow_comments } = req.body;

    if (!err.isEmpty()) {
      return res.status(400).json({ errors: err.array() });
    }

    let filename = '';

    if (!uploadIsEmpty(req.files)) {
      let file = req.files.featuredImage;
      const fileId = uuidv4();
      filename = `${fileId}x${file.name}`;

      file.mv('./public/uploads/' + filename, (err) => {
        if (err) throw err;
      });
    }

    try {
      const post = await new Posts({
        post_title: title,
        post_desc: content,
        file: filename,
        category: category,
        allow_comments: allow_comments ? 'true' : 'false',
        status: status,
        comments: [],
      });

      await post.save();

      res.redirect('/posts');
    } catch (error) {
      res.status(500).json({ message: 'Server Error' });
    }
  }
);

router.put('/:id', async (req, res) => {
  const err = validationResult(req);
  const { title, content, category, allow_comments } = req.body;

  if (!err.isEmpty()) {
    return res.status(400).json({ errors: err.array() });
  }

  let filename = '';

  if (!uploadIsEmpty(req.files)) {
    let file = req.files.featuredImage;
    const fileId = uuidv4();
    filename = `${fileId}x${file.name}`;

    file.mv('./public/uploads/' + filename, (err) => {
      if (err) throw err;
    });
  }

  try {
    const post = await Posts.findById(req.params.id);

    post.post_title = title;
    post.post_desc = content;
    post.file = filename;
    post.category = category;
    post.allow_comments = allow_comments ? 'true' : 'false';

    await post.save();

    res.redirect('/posts');
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

router.delete('/:postId', async (req, res) => {
  try {
    Posts.findOne({ _id: req.params.postId }).then((post) => {
      fs.unlink(uploadDir + post.file, (err) => {
        post.remove();
        res.redirect('/posts');
      });
    });
  } catch (error) {
    res.status(500).send('Server Error');
  }
});

module.exports = router;
