const catchAsync = require('../utils/catch-async/catch-async');
const Post = require('../models/post-model');
const {
  getAll,
  createOne,
  getOne,
  updateOne,
  deleteOne,
} = require('./handle-factory');

exports.getAllPosts = getAll(Post);
exports.createPost = createOne(Post);
exports.getPost = getOne(Post);
exports.updatePost = updateOne(Post);
exports.deletePost = deleteOne(Post);
