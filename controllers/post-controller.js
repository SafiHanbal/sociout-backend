const multer = require('multer');
const sharp = require('sharp');
const catchAsync = require('../utils/catch-async/catch-async');
const APIFeatures = require('../utils/api-features/api-features');

const Post = require('../models/post-model');
const User = require('../models/user-model');
const Like = require('../models/like-model');
const { getOne, updateOne, deleteOne } = require('./handle-factory');

exports.getPost = getOne(Post);
exports.updatePost = updateOne(Post);
exports.deletePost = deleteOne(Post);

exports.getPosts = catchAsync(async (req, res, next) => {
  const userId = req.user?._id;

  const query = new APIFeatures(Post.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate().query;

  let posts = await query
    .populate('comments')
    .populate({ path: 'user', model: 'User', select: 'userName image' })
    .populate({
      path: 'comments',
      populate: [{ path: 'user', model: 'User', select: 'userName image' }],
    });

  posts = await Promise.all(
    posts.map(async (post) => {
      const isLiked = Boolean(
        await Like.findOne({ user: userId, post: post?._id })
      );

      const { _id, user, images, likesCount, caption, comments, createdAt } =
        post;

      return {
        _id,
        user,
        images,
        likesCount,
        caption,
        comments,
        isLiked,
        createdAt,
      };
    })
  );

  res.status(200).json({
    status: 'success',
    data: {
      results: posts.length,
      posts,
    },
  });
});

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('Not an image! Please upload only images.', 400));
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

exports.uploadImages = upload.array('images');

exports.resizeUserPhoto = (req, res, next) => {
  const { files } = req;
  if (!files) return next();

  const filesArr = [];

  files.forEach((file, i) => {
    const fileName = `${req.user._id}-${Date.now()}-${i}.jpeg`;
    sharp(file.buffer)
      .resize(1080, 1080)
      .toFormat('jpeg')
      .jpeg({ quality: 80 })
      .toFile(`public/images/post/${fileName}`);

    filesArr.push(`http://127.0.0.1:8000/images/post/${fileName}`);
  });

  req.body.images = filesArr;

  next();
};

exports.createPost = catchAsync(async (req, res, next) => {
  const { caption, images } = req.body;
  const post = await Post.create({
    user: req.user._id,
    caption,
    images,
  });

  res.status(201).json({
    status: 'success',
    data: {
      post,
    },
  });
});
