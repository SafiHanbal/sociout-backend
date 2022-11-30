const express = require('express');
const { protect } = require('../controllers/auth-controller');
const { likePost, unlikePost } = require('../controllers/like-controller');

const router = express.Router();

router.use(protect);

router.route('/:post').get(likePost).delete(unlikePost);

module.exports = router;
