const catchAsync = require('../utils/catch-async/catch-async');
const User = require('../models/user-model');

// User controllers for admin
exports.getAllUsers = catchAsync(async (req, res, next) => {
  res.status(200).json({
    status: 'success',
  });
});

exports.createUser = catchAsync(async (req, res, next) => {
  res.status(200).json({
    status: 'success',
  });
});

exports.getUser = catchAsync(async (req, res, next) => {
  res.status(200).json({
    status: 'success',
  });
});

exports.updateUser = catchAsync(async (req, res, next) => {
  res.status(200).json({
    status: 'success',
  });
});

exports.deleteUser = catchAsync(async (req, res, next) => {
  res.status(200).json({
    status: 'success',
  });
});

// Me controllers
exports.getMe = catchAsync(async (req, res, next) => {
  res.status(200).json({
    status: 'success',
  });
});

exports.updateMe = catchAsync(async (req, res, next) => {
  res.status(200).json({
    status: 'success',
  });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  res.status(200).json({
    status: 'success',
  });
});
