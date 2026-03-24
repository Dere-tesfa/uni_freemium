const { env } = require('../config/env');

exports.notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

exports.errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);

  console.error(`❌ ERROR: ${err.message}`, {
    stack: env.nodeEnv === 'production' ? null : err.stack,
    url: req.originalUrl,
  });

  res.json({
    success: false,
    message: err.message,
    stack: env.nodeEnv === 'production' ? null : err.stack,
  });
};
