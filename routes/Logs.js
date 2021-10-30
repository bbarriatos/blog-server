const express = require('express');
const { pageConfig } = require('../config/defaultPageConfig');
const Posts = require('../models/Post');
const Tasks = require('../models/Task');
const Users = require('../models/User');
const Logs = require('../models/ActivityLogs');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    Logs.find({})
      .populate('category')
      .populate('posts')
      .populate('tasks')
      .populate('user')
      .then((log) => {
        // console.log(log);
        res.render('home/logs/index', {
          ...pageConfig,
          title: 'Activity Logs | Bon Blog Site',
          bodyClass: `bg-gradient-primary`,
          logs_list: log,
        });
      });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;
