const fs = require("fs");
const path = require("path");
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const questionRoutes = require("./routes/questionRoutes");
const sessionRoutes = require("./routes/sessionRoutes");
const { notFound } = require("./middleware/notFound");
const { errorHandler } = require("./middleware/errorHandler");
const { sendSuccess } = require("./utils/response");

const app = express();
const isProduction = process.env.NODE_ENV === "production";
const clientDistPath = path.resolve(__dirname, "../../client/dist");
const clientIndexPath = path.join(clientDistPath, "index.html");
const hasClientBuild = fs.existsSync(clientIndexPath);

const allowedOrigins = (process.env.CLIENT_ORIGIN || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

function sendClientIndex(req, res, next, fallbackToHealth = false) {
  return res.sendFile(clientIndexPath, (error) => {
    if (!error) {
      return undefined;
    }

    if (res.headersSent) {
      return next(error);
    }

    if (fallbackToHealth) {
      console.error(
        "Failed to serve client index for root route. Returning API health payload instead.",
        error
      );
      return sendSuccess(res, { status: "ok" });
    }

    return next(error);
  });
}

app.use(
  cors({
    origin: allowedOrigins.length > 0 ? allowedOrigins : true,
  })
);
app.use(express.json());
app.use(morgan("dev"));

app.get("/api/health", (req, res) => {
  return sendSuccess(res, { status: "ok" });
});

app.use("/api/questions", questionRoutes);
app.use("/api/sessions", sessionRoutes);

if (isProduction) {
  if (!hasClientBuild) {
    console.warn(
      `Client build not found at ${clientIndexPath}; root route will return API health payload.`
    );
  } else {
    app.use(express.static(clientDistPath));
  }
}

app.get("/", (req, res, next) => {
  if (isProduction && hasClientBuild) {
    return sendClientIndex(req, res, next, true);
  }

  return sendSuccess(res, { status: "ok" });
});

if (isProduction && hasClientBuild) {
  app.get(/^\/(?!api(?:\/|$)).*/, (req, res, next) => {
    return sendClientIndex(req, res, next);
  });
}

app.use(notFound);
app.use(errorHandler);

module.exports = app;
