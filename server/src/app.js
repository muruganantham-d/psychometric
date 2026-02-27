const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
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

const allowedOrigins = (process.env.CLIENT_ORIGIN || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

// OR, if you want to be strict:
app.use(cors({ origin: '*' }));

app.use(express.json());
app.use(morgan("dev"));

app.get("/api/health", (req, res) => {
  return sendSuccess(res, { status: "ok" });
});

app.use("/api/questions", questionRoutes);
app.use("/api/sessions", sessionRoutes);

if (isProduction) {
  app.use(express.static(clientDistPath));

  app.get("/", (req, res) => {
    return res.sendFile(clientIndexPath);
  });

  app.get(/^\/(?!api(?:\/|$)).*/, (req, res) => {
    return res.sendFile(clientIndexPath);
  });
} else {
  app.get("/", (req, res) => {
    return sendSuccess(res, { status: "ok" });
  });
}

app.use(notFound);
app.use(errorHandler);

module.exports = app;
