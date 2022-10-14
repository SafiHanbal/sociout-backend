const Comment = require('../models/comment-model');
const {
  getAll,
  createOne,
  getOne,
  updateOne,
  deleteOne,
} = require('./handle-factory');

exports.getAllComments = getAll(Comment);
exports.createComment = createOne(Comment);
exports.getComment = getOne(Comment);
exports.updateComment = updateOne(Comment);
exports.deleteComment = deleteOne(Comment);
