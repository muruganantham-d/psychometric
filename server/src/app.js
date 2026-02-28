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

app.use(
  cors({
    origin: allowedOrigins.length > 0 ? allowedOrigins : true,
  })
);
app.use(express.json());
app.use(morgan("dev"));

app.get("/", (req, res) => {
  if (isProduction && hasClientBuild) {
    return res.sendFile(clientIndexPath);
  }

  return res.status(200).send("OK");
});

if (isProduction && hasClientBuild) {
  app.use(express.static(clientDistPath));
}

app.get("/api/health", (req, res) => {
  return sendSuccess(res, { status: "ok" });
});

app.use("/api/questions", questionRoutes);
app.use("/api/sessions", sessionRoutes);

if (isProduction && hasClientBuild) {
  app.use((req, res, next) => {
    if (
      req.method !== "GET" ||
      req.path.startsWith("/api") ||
      path.extname(req.path)
    ) {
      return next();
    }

    return res.sendFile(clientIndexPath);
  });
}

app.use(notFound);
app.use(errorHandler);

module.exports = app;
