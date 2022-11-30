const AppError = require('../utils/app-error/app-error');
const catchAsync = require('../utils/catch-async/catch-async');
const Like = require('../models/like-model');

exports.likePost = catchAsync(async (req, res, next) => {
  const userId = req.user._id;
  const postId = req.params.post;

  const isLiked = Boolean(await Like.findOne({ user: userId, post: postId }));

  if (isLiked) return next(new AppError('You already liked this post!', 400));

  const like = await Like.create({ user: userId, post: postId });

  res.status(201).json({
    status: 'success',
    data: {
      like,
    },
  });
});

exports.unlikePost = catchAsync(async (req, res, next) => {
  const userId = req.user._id;
  const postId = req.params.post;

  const isLiked = Boolean(await Like.findOne({ user: userId, post: postId }));

  if (!isLiked) return next(new AppError('You did not liked this post', 400));

  const unlike = await Like.findOneAndDelete({ user: userId, post: postId });

  res.status(204).json({
    status: 'success',
    data: {
      unlike,
    },
  });
});
