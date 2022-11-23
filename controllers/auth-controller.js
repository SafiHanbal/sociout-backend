const { promisify } = require('util');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const catchAsync = require('../utils/catch-async/catch-async');
const AppError = require('../utils/app-error/app-error');
const sendEmail = require('../utils/email/email');
const User = require('../models/user-model');

const createAndSendToken = (res, statusCode, user) => {
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

  res.status(statusCode).json({
    status: 'success',
    data: {
      token,
      user,
    },
  });
};

exports.signUp = catchAsync(async (req, res, next) => {
  const {
    email,
    userName,
    displayPicture,
    banner,
    bio,
    interests,
    dateOfBirth,
    gender,
    password,
    passwordConfirm,
  } = req.body;

  const user = await User.create({
    email,
    userName,
    displayPicture,
    banner,
    bio,
    interests,
    dateOfBirth,
    gender,
    password,
    passwordConfirm,
  });

  if (!user) return next(new AppError('Error in creating user!', 400));

  createAndSendToken(res, 201, user);
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password)
    return next(new AppError('Please provide email and password!', 400));

  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.correctPassword(password, user.password)))
    return next(new AppError('Invalid email or password!', 404));

  createAndSendToken(res, 200, user);
});

exports.logout = catchAsync(async (req, res, next) => {
  res.status(200).json({
    status: 'success',
    token: null,
    message: 'You are logged out successfully!',
  });
});

exports.forgotPassword = catchAsync(async (req, res, next) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user)
    return next(new AppError('This email has no account in sociout!', 404));

  try {
    const resetToken = await user.createPasswordResetToken();
    user.save({ validateBeforeSave: false });

    sendEmail({
      email,
      subject: 'Sociout Password Reset',
      message: `Your password reset Link (valid for 10 min) is http://127.0.0.1:3000/auth/reset-password/${resetToken}`,
    });

    res.status(200).json({
      status: 'success',
      message: 'Reset password link is sent to your email!',
    });
  } catch (err) {
    return next(new AppError('Error in sending password reset token!', 500));
  }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  const { resetToken, password, passwordConfirm } = req.body;

  const hashedResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  const user = await User.findOne({ passwordResetToken: hashedResetToken });
  user.password = password;
  user.passwordConfirm = passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  user.passwordChangedAt = Date.now() - 1000;
  user.save();

  createAndSendToken(res, 200, user);
});

exports.protect = catchAsync(async (req, res, next) => {
  if (!req.headers.authorization?.startsWith('Bearer'))
    return next(
      new AppError('You are not logged in! Please login to continue!', 400)
    );
  const authorizationToken = req.headers.authorization.split(' ')[1];
  const decoded = await promisify(jwt.verify)(
    authorizationToken,
    process.env.JWT_SECRET
  );

  const user = await User.findById(decoded.id);

  if (!user)
    return next(
      new AppError('User associated with this token no longer exist', 400)
    );

  if (user.passwordChangedAfter(decoded.iat))
    return next(
      new AppError('User recently changed password. Please log in again!', 401)
    );

  req.user = user;
  next();
});

exports.strictTo =
  (...roles) =>
  (req, res, next) => {
    if (!roles.includes(req.user.role))
      return next(
        new AppError('You are not allowed to perform this task!', 400)
      );
    next();
  };
