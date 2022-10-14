const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    required: [true, 'Please provide a user!'],
  },
  comment: {
    type: String,
    required: [true, 'Please provide a comment!'],
  },
  post: {
    type: mongoose.Schema.ObjectId,
    required: [true, 'Please provide a post id!'],
  },
});

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;
