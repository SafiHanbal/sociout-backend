const AppError = require('../utils/app-error/app-error');

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    err,
    stack: err.stack,
  });
};

const sendErrorProd = (err, res) => {
  if (!err.isOperational) {
    res.status(500).json({
      status: 'error',
      message: 'Something went wrong!',
    });
  }

  res.status(err.status).json({
    status: err.status,
    message: err.message,
  });
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') sendErrorDev(err, res);
  if (process.env.NODE_ENV === 'production') sendErrorProd(err, res);
};
