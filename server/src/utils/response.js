function sendSuccess(res, data, status = 200) {
  return res.status(status).json({
    success: true,
    data,
  });
}

function sendFailure(res, message, status = 400, errors) {
  return res.status(status).json({
    success: false,
    message,
    ...(errors ? { errors } : {}),
  });
}

module.exports = {
  sendSuccess,
  sendFailure,
};
