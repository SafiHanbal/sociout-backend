const multer = require('multer');
const sharp = require('sharp');
const catchAsync = require('../utils/catch-async/catch-async');
const Post = require('../models/post-model');
const { getAll, getOne, updateOne, deleteOne } = require('./handle-factory');

exports.getAllPosts = getAll(Post);
exports.getPost = getOne(Post);
exports.updatePost = updateOne(Post);
exports.deletePost = deleteOne(Post);

exports.createPost = catchAsync(async (req, res, next) => {
  console.log(req.file);
  const storage = multer.memoryStorage();
  console.log(true);

  res.status(201).json({
    status: 'success',
    data: {
      data: 'data',
    },
  });
});
