const catchAsync = require('../utils/catch-async/catch-async');
const User = require('../models/user-model');

const { getAll, getOne, updateOne, deleteOne } = require('./handle-factory');

// User controllers for admin
exports.getAllUsers = getAll(User);
exports.getUser = getOne(User);
exports.updateUser = updateOne(User);
exports.deleteUser = deleteOne(User);

exports.createUser = catchAsync(async (req, res, next) => {
  res.status(400).json({
    status: 'fail',
    message: 'This route is not for create user. Please use /signup route!',
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
