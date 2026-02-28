const { ZodError } = require("zod");

const { HttpError } = require("../utils/httpError");
const { sendFailure } = require("../utils/response");

function errorHandler(err, req, res, next) {
  if (res.headersSent) {
    return next(err);
  }

  if (err instanceof ZodError) {
    const fieldErrors = err.issues.reduce((accumulator, issue) => {
      const fieldPath = issue.path.join(".") || "body";
      accumulator[fieldPath] = issue.message;
      return accumulator;
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
    err.statusCode ||
    err.status ||
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
