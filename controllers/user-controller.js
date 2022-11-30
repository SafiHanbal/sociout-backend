const catchAsync = require('../utils/catch-async/catch-async');
const User = require('../models/user-model');
const AppError = require('../utils/app-error/app-error');

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
  const userId = req.user?._id;

  const user = await User.findById(userId);

  if (!user) return next(new AppError('User not found!', 404));

  res.status(200).json({
    status: 'success',
    data: {
      user,
    },
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

exports.searchUsers = catchAsync(async (req, res, next) => {
  if (!req.query?.userName)
    return next(new AppError('Please provide a search string!', 404));

  const users = await User.find({
    userName: { $regex: req.query.userName, $options: 'i' },
    _id: { $ne: req.user?._id },
  });

  res.status(200).json({
    status: 'success',
    data: {
      results: users.length,
      users,
    },
  });
});

exports.followUser = catchAsync(async (req, res, next) => {
  const { userId } = req.params;

  if (req.user?.following?.includes(userId))
    return next(new AppError('Already followig user!', 400));

  const currentUserId = req.user?._id;
  await User.findByIdAndUpdate(currentUserId, { $push: { following: userId } });

  const user = await User.findByIdAndUpdate(
    userId,
    { $inc: { followerCount: 1 } },
    { new: true }
  );

  res.status(200).json({
    status: 'success',
    data: {
      user,
    },
  });
});

exports.unfollowUser = catchAsync(async (req, res, next) => {
  const { userId } = req.params;

  if (!req.user?.following?.includes(userId))
    return next(new AppError('You are not following provided user', 400));

  const currentUserId = req.user?._id;
  await User.findByIdAndUpdate(currentUserId, { $pull: { following: userId } });

  const user = await User.findByIdAndUpdate(
    userId,
    { $inc: { followerCount: -1 } },
    { new: true }
  );

  res.status(200).json({
    status: 'success',
    data: {
      user,
    },
  });
});
