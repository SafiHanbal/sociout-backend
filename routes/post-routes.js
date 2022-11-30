const express = require('express');

const { protect, strictTo } = require('../controllers/auth-controller');
const {
  getPosts,
  createPost,
  getPost,
  updatePost,
  deletePost,
  uploadImages,
  resizeUserPhoto,
} = require('../controllers/post-controller');

const router = express.Router();

router
  .route('/')
  .get(protect, getPosts)
  .post(protect, uploadImages, resizeUserPhoto, createPost);

router
  .route('/:id')
  .get(getPost)
  .patch(protect, updatePost)
  .delete(protect, deletePost);

module.exports = router;
