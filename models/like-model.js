const mongoose = require('mongoose');

const likeSchema = new mongoose.Schema({
  post: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, 'A like must have a post!'],
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, 'A like must have a user!'],
  },
});

const Like = mongoose.model('Like', likeSchema);

module.exports = Like;
