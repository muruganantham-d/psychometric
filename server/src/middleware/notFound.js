const { sendFailure } = require("../utils/response");

function notFound(req, res) {
  return sendFailure(
    res,
    `Route not found: ${req.method} ${req.originalUrl}`,
    404
  );
}

module.exports = {
  notFound,
};
