const express = require('express');
const { body } = require('express-validator');
const AuthController = require('../controllers/authController');
const { handleValidationErrors } = require('../middlewares/validation');

const router = express.Router();

const validateSignup = [
  body('email').isEmail().withMessage('Valid email is required'),
  body('name').notEmpty().withMessage('Name is required'),
  handleValidationErrors
];

const validateLogin = [
  body('email').isEmail().withMessage('Valid email is required'),
  handleValidationErrors
];

router.post('/signup', validateSignup, AuthController.signup);
router.post('/login', validateLogin, AuthController.login);

module.exports = router;