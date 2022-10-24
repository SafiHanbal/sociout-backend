const express = require('express');

const { protect, strictTo } = require('../controllers/auth-controller');
const {
  getAllPosts,
  createPost,
  getPost,
  updatePost,
  deletePost,
} = require('../controllers/post-controller');

const router = express.Router();

router.route('/').get(getAllPosts).post(protect, createPost);
router
  .route('/:id')
  .get(getPost)
  .patch(protect, updatePost)
  .delete(protect, deletePost);

module.exports = router;
