const express = require('express');
const {
  getAllComments,
  createComment,
  getComment,
  updateComment,
  deleteComment,
} = require('../controllers/comment-controller');
const router = express.Router();

router.route('/').get(getAllComments).post(createComment);
router.route('/:id').get(getComment).patch(updateComment).delete(deleteComment);

module.exports = router;
