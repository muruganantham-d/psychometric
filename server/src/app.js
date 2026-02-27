const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const fs = require("fs");
const path = require("path");

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

function serveClientIndex(req, res, next) {
  return res.sendFile(clientIndexPath, (error) => {
    if (!error) {
      return undefined;
    }

    if (res.headersSent) {
      return next(error);
    }

    console.error("Failed to serve client index, returning health response for root route.", error);
    return sendSuccess(res, { status: "ok" });
  });
}

app.get("/api/health", (req, res) => {
  return sendSuccess(res, { status: "ok" });
});

if (isProduction && hasClientBuild) {
  app.get("/", (req, res, next) => {
    return serveClientIndex(req, res, next);
  });
} else {
  app.get("/", (req, res) => {
    return sendSuccess(res, { status: "ok" });
  });
}

// OR, if you want to be strict:
app.use(cors({ origin: '*' }));
app.use(express.json());
app.use(morgan("dev"));

app.use("/api/questions", questionRoutes);
app.use("/api/sessions", sessionRoutes);

if (isProduction) {
  if (!hasClientBuild) {
    console.warn(`Client build not found at ${clientIndexPath}; falling back to API root health response.`);
  } else {
    app.use(express.static(clientDistPath));
    app.get(/^\/(?!api(?:\/|$)).*/, (req, res, next) => {
      return serveClientIndex(req, res, next);
    });
  }
}

app.use(notFound);
app.use(errorHandler);

module.exports = app;
