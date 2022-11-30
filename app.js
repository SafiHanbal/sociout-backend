const path = require('path');
const express = require('express');
const cors = require('cors');

const userRouter = require('./routes/user-routes');
const postRouter = require('./routes/post-routes');
const likeRouter = require('./routes/like-routes');
const commentRouter = require('./routes/comment-routes');

const globalErrorHandler = require('./controllers/error-controller');

const app = express();

app.use(express.static(path.join(__dirname, 'public')));

app.use(cors());
app.use(express.json());

if (process.env.NODE_ENV === 'development') {
  const morgan = require('morgan');
  app.use(morgan('dev'));
}

app.use('/api/v1/user', userRouter);
app.use('/api/v1/post', postRouter);
app.use('/api/v1/like', likeRouter);
app.use('/api/v1/comment', commentRouter);

app.use('*', (req, res, next) => {
  const port =
    process.env.NODE_ENV === 'development' ? `:${process.env.PORT}` : '';
  const url = `${req.protocol}//:${req.hostname}${port}${req.originalUrl}`;
  const message = `${url} route is not defined!`;

  res.status(404).json({
    status: 'fail',
    message,
  });
});

app.use(globalErrorHandler);

module.exports = app;
