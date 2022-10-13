const express = require('express');
const {
  login,
  logout,
  signUp,
  forgotPassword,
  resetPassword,
} = require('../controllers/auth-controller');

const {
  getAllUsers,
  createUser,
  getUser,
  updateUser,
  deleteUser,
  getMe,
  updateMe,
  deleteMe,
} = require('../controllers/user-controller');

const router = express.Router();

// Authentication routes
router.route('/signup').post(signUp);
router.route('/login').post(login);
router.route('/logout').get(logout);
router.route('/forgot-password').post(forgotPassword);
router.route('/reset-password').patch(resetPassword);

// Me routes
router.route('/me').get(getMe).patch(updateMe).delete(deleteMe);

// User routes for admin
router.route('/').get(getAllUsers).post(createUser);
router.route('/:username').get(getUser).patch(updateUser).delete(deleteUser);

module.exports = router;
