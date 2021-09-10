const express = require('express');
const { check, validationResult } = require('express-validator');
const User = require('../models/User');
const uniqid = require('uniqid');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const router = express.Router();
const passport = require('passport');

module.exports = router;
