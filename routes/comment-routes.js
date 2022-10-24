const express = require('express');

const { protect, strictTo } = require('../controllers/auth-controller');
const {
  getAllComments,
  createComment,
  getComment,
  updateComment,
  deleteComment,
} = require('../controllers/comment-controller');
const router = express.Router();

router.route('/').get(getAllComments).post(protect, createComment);
router
  .route('/:id')
  .get(getComment)
  .patch(protect, updateComment)
  .delete(protect, deleteComment);

module.exports = router;
