const express = require('express');
const { check, validationResult } = require('express-validator');
const Tasks = require('../models/Task');
const Category = require('../models/Category');
const Status = require('../models/Status');
const router = express.Router();
const { pageConfig } = require('../config/defaultPageConfig');
const fs = require('fs');

router.get('/', async (req, res) => {
  try {
    Tasks.find({})
      .populate({ path: 'status', select: 'status_name -_id' })
      .populate('user')
      .then((tasks) => {
        res.render('home/tasks/tasks', {
          ...pageConfig,
          title: 'Tasks | Bon Blog Site',
          bodyClass: `bg-gradient-primary`,
          task_list: tasks,
          number_of_post: tasks.length,
        });
      });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

router.get('/addTask', async (req, res) => {
  try {
    res.render('home/tasks/addTask', {
      ...pageConfig,
      title: 'Add Task | Bon Blog Site',
      bodyClass: `bg-gradient-primary`,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

router.get('/:taskId', async (req, res) => {
  try {
    const status = await Status.find();

    Tasks.findOne({ _id: req.params.taskId }).then((taskData) => {
      res.render('home/tasks/editTask', {
        ...pageConfig,
        title: 'Update Task | Bon Blog Site',
        bodyClass: `bg-gradient-primary`,
        task: taskData,
        status: status.filter((stat) => stat.status_category === 'Tasks'),
      });
    });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// router.get('/:postId', async (req, res) => {
//   try {
//     const { category } = req.body;
//     const categories = await Category.find();
//     const status = await Status.find();

//     Posts.findOne({ _id: req.params.postId })
//       .populate('category')
//       .then((postData) => {
//         res.render('home/posts/editPost', {
//           ...pageConfig,
//           title: 'Update Post | Bon Blog Site',
//           bodyClass: `bg-gradient-primary`,
//           post: postData,
//           categories: categories,
//           status: status.filter((stat) => stat.status_category === 'Posts'),
//         });
//       });
//   } catch (error) {
//     res.status(500).json({ message: 'Server Error' });
//   }
// });

router.post('/', async (req, res) => {
  // const err = validationResult(req);
  const { title, content, daterange } = req.body;

  // if (!err.isEmpty()) {
  //   return res.status(400).json({ errors: err.array() });
  // }

  try {
    const task = await new Tasks({
      task_title: title,
      task_content: content,
      task_due: daterange,
      user: req.user.id,
    });

    await task.save().then((savedPost) => {
      req.flash('success_message', 'Task was created successfully');
      res.redirect('/tasks');
    });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

router.put('/:id', async (req, res) => {
  // const err = validationResult(req);
  const { title, content, daterange, status } = req.body;

  // if (!err.isEmpty()) {
  //   return res.status(400).json({ errors: err.array() });
  // }

  try {
    const task = await Tasks.findById(req.params.id);

    task.task_title = title;
    task.task_content = content;
    task.task_due = daterange;
    task.status = status;

    await task.save().then(() => {
      req.flash('success_message', 'Task was updated successfully');
      res.redirect('/tasks');
    });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const task_due = await Tasks.findByIdAndDelete(req.params.id);

    await task_due.remove().then((savedPost) => {
      req.flash('success_message', 'Task deleted successfully');
      res.redirect('/tasks');
    });
  } catch (error) {
    res.status(500).send('Server Error');
  }
});

module.exports = router;
