const { ZodError } = require("zod");
const { sendFailure } = require("../utils/response");
const { HttpError } = require("../utils/httpError");

function errorHandler(err, req, res, next) {
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

  console.error(err);
  return sendFailure(res, "Unexpected server error.", 500);
}

module.exports = {
  errorHandler,
};
