const { ZodError } = require("zod");
const { sendFailure } = require("../utils/response");
const { HttpError } = require("../utils/httpError");

function errorHandler(err, req, res, next) {
  if (res.headersSent) {
    return next(err);
  }

  if (err instanceof ZodError) {
    const fieldErrors = err.issues.reduce((acc, issue) => {
      const path = issue.path.join(".") || "body";
      acc[path] = issue.message;
      return acc;
    }, {});

    return sendFailure(res, "Validation failed.", 400, fieldErrors);
  }

  if (err instanceof HttpError) {
    return sendFailure(res, err.message, err.status || 400, err.errors);
  }

  if (err.name === "CastError") {
    return sendFailure(res, "Invalid identifier format.", 400);
  }

  const statusCode =
    err.status ||
    err.statusCode ||
    (res.statusCode >= 400 ? res.statusCode : 500);

  if (statusCode >= 500) {
    console.error(err);
  }

  return sendFailure(
    res,
    err.message || "Unexpected server error.",
    statusCode,
    err.errors
  );
}

module.exports = {
  errorHandler,
};
