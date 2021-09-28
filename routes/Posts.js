const express = require('express');
const { check, validationResult } = require('express-validator');
const { v4: uuidv4 } = require('uuid');
const { pageConfig, uploadDir } = require('../config/defaultPageConfig');
const Posts = require('../models/Post');
const { uploadIsEmpty } = require('../helpers/upload-helper');
const router = express.Router();
const fs = require('fs');

router.get('/', async (req, res) => {
  try {
    Posts.find({}).then((posts) => {
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

router.get('/addpost', (req, res) => {
  try {
    res.render('home/posts/addPost', {
      ...pageConfig,
      title: 'Add Post | Bon Blog Site',
      bodyClass: `bg-gradient-primary`,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

router.get('/:postId', (req, res) => {
  try {
    Posts.findOne({ _id: req.params.postId }).then((postData) => {
      res.render('home/posts/editPost', {
        ...pageConfig,
        title: 'Update Post | Bon Blog Site',
        bodyClass: `bg-gradient-primary`,
        post: postData,
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
    // const err = validationResult(req);
    const { title, content, allow_comments } = req.body;

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
        allow_comments: allow_comments ? 'true' : 'false',
        status: '60c50dc4e10a9750b826edc3',
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

router.delete('/:postId', async (req, res) => {
  try {
    Posts.findOne({ _id: req.params.postId }).then((post) => {
      console.log(uploadDir);
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
