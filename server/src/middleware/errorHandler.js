const errorHandler = (err, req, res, next) => {
  const statusCode =
    err.statusCode || err.status || (res.statusCode && res.statusCode !== 200 ? res.statusCode : 500);

  res.status(statusCode).json({
    success: false,
    message: err.message || "Server Error",
    ...(err.errors ? { errors: err.errors } : {}),
  });
};

module.exports = { errorHandler };
