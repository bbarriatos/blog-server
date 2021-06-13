const express = require('express');
const { check, validationResult } = require('express-validator');
const Task = require('../models/Task');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const status = await Task.find();

    res.json(status);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

router.post(
  '/',
  [
    check('title', 'Title is required').isLength({ min: 1, max: 100 }),
    check('content').optional(),
    check('date', 'Date is required').exists(),
    check('due', 'Please set a valid due date').exists(),
  ],
  async (req, res) => {
    const err = validationResult(req);
    const { title, content, date, due, status } = req.body;

    if (!err.isEmpty()) {
      return res.status(400).json({ errors: err.array() });
    }

    try {
      // date and due will be formatted in the client side same as on checking the date range
      // status should be an id value
      // user value will be set on the current user who created the task
      const task = await new Task({
        task_title: title,
        task_content: content,
        task_date: date,
        task_due: due,
        status: status,
      });

      await task.save();

      res.json(task);
    } catch (error) {
      res.status(500).json({ message: 'Server Error' });
    }
  }
);

router.put('/:id', async (req, res) => {
  const err = validationResult(req);
  const { title, content, date, due, status } = req.body;

  if (!err.isEmpty()) {
    return res.status(400).json({ errors: err.array() });
  }

  try {
    const task = await Task.findById(req.params.id);

    task.task_title = title;
    task.task_content = content;
    task.task_date = date;
    task.task_due = due;
    task.status = status;

    await task.save();

    res.json(task);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const task_due = await Task.findByIdAndDelete(req.params.id);

    await task_due.remove();

    res.json('Task Deleted');
  } catch (error) {
    res.status(500).send('Server Error');
  }
});

module.exports = router;
