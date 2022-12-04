const AppError = require('../utils/app-error/app-error');
const catchAsync = require('../utils/catch-async/catch-async');
const Comment = require('../models/comment-model');

const { getAll, getOne, updateOne, deleteOne } = require('./handle-factory');

exports.getAllComments = getAll(Comment);
exports.getComment = getOne(Comment);
exports.updateComment = updateOne(Comment);
exports.deleteComment = deleteOne(Comment);

exports.createComment = catchAsync(async (req, res, next) => {
  const user = req.user;
  const { post, comment: commentStr } = req.body;
  console.log(post, user, commentStr);
  const comment = await Comment.create({
    user: user?._id,
    post,
    comment: commentStr,
  });

  if (!comment) return next(new AppError('Error in creating commnet!', 400));

  res.status(201).json({
    status: 'success',
    data: {
      comment: {
        _id: comment._id,
        comment: comment.comment,
        post: comment.post,
        user: {
          _id: user?._id,
          userName: user?.userName,
          image: user?.image,
        },
      },
    },
  });
});
