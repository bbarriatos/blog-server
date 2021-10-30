const express = require('express');
const { check, validationResult } = require('express-validator');
const { v4: uuidv4 } = require('uuid');
const { pageConfig, uploadDir } = require('../config/defaultPageConfig');
const Posts = require('../models/Post');
const Category = require('../models/Category');
const Status = require('../models/Status');
const User = require('../models/User');
const Logs = require('../models/ActivityLogs');
const { uploadIsEmpty } = require('../helpers/upload-helper');
const router = express.Router();
const fs = require('fs');

router.get('/', async (req, res) => {
  try {
    Posts.find({})
      .populate({ path: 'category', select: 'category_name -_id' })
      .populate({ path: 'status', select: 'status_name -_id' })
      .populate('user')
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
    const { category } = req.body;
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
    check('content', 'Content is required').isLength({ min: 1, max: 10000 }),
  ],
  async (req, res) => {
    const err = validationResult(req);
    const { title, content, category, status, allow_comments } = req.body;

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
        user: req.user.id,
        comments: [],
      });

      if (!err.isEmpty()) {
        const errorMsg = err.mapped();
        let errorMsgValue = '';
        const title = errorMsg?.title;
        const content = errorMsg?.content;

        if (title && content) {
          errorMsgValue = 'Please fill in the missing fields.';
        } else if (content) {
          errorMsgValue = content?.msg;
        } else if (title) {
          errorMsgValue = title?.msg;
        }

        req.flash('error_message', `${errorMsgValue}`);
        res.redirect('/posts/addpost');
      } else {
        await post.save().then((savedPost) => {
          const log = new Logs({
            user: req.user,
            category: null,
            post: savedPost.id,
            task: null,
            note: `${req.user.user_username} added new post`,
          });

          log.save();

          req.flash('success_message', 'Post was created successfully');
          res.redirect('/posts');
        });
      }
    } catch (error) {
      res.status(500).json({ message: 'Server Error' });
    }
  }
);

router.put('/:id', async (req, res) => {
  const err = validationResult(req);
  const { title, content, category, allow_comments, featuredImage } = req.body;

  try {
    const post = await Posts.findById(req.params.id);

    post.post_title = title;
    post.post_desc = content;
    post.category = category;
    post.allow_comments = allow_comments ? 'true' : 'false';

    if (req.files !== null) {
      let file = req.files.featuredImage;
      const fileId = uuidv4();
      const filename = `${fileId}x${file.name}`;
      post.file = filename;

      file.mv('./public/uploads/' + filename, (err) => {
        if (err) throw err;
      });
    }

    await post.save().then((savedPost) => {
      const log = new Logs({
        user: req.user,
        category: null,
        post: savedPost.id,
        task: null,
        note: `${req.user.user_username} updated a post`,
      });

      log.save();

      req.flash('success_message', 'Post was updated successfully');
      res.redirect('/posts');
    });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

router.delete('/:postId', async (req, res) => {
  try {
    Posts.findOne({ _id: req.params.postId }).then((post) => {
      fs.unlink(uploadDir + post.file, (err) => {
        post.remove().then((savedPost) => {
          const log = new Logs({
            user: req.user,
            category: null,
            post: savedPost.id,
            task: null,
            note: `${req.user.user_username} deleted post`,
          });

          log.save();

          req.flash('success_message', 'Post was deleted successfully');
          res.redirect('/posts');
        });
      });
    });
  } catch (error) {
    res.status(500).send('Server Error');
  }
});

module.exports = router;
