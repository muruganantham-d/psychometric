require("dotenv").config();
const fs = require("fs");
const path = require("path");
const app = require("./app");
const { connectDB } = require("./config/db");

const HOST = "0.0.0.0";

function getReplitLocalPort() {
  const replitConfigPath = path.resolve(__dirname, "../../.replit");

  try {
    if (!fs.existsSync(replitConfigPath)) {
      return null;
    }

    const content = fs.readFileSync(replitConfigPath, "utf8");
    const match = content.match(/localPort\s*=\s*(\d+)/);

    if (!match) {
      return null;
    }

    const parsed = Number(match[1]);
    return Number.isFinite(parsed) ? parsed : null;
  } catch (error) {
    console.warn("Unable to read .replit localPort:", error.message);
    return null;
  }
}

const replitLocalPort = getReplitLocalPort();
const PORT =
  replitLocalPort ||
  Number(process.env.PORT) ||
  Number(process.env.REPL_PORT) ||
  Number(process.env.REPLIT_PORT) ||
  3000;

async function startServer() {
  const server = app.listen(PORT, HOST, () => {
    console.log(`API listening on ${HOST}:${PORT}`);
  });

  server.on("error", (error) => {
    console.error(`Server failed to bind on ${HOST}:${PORT}`, error);
    process.exit(1);
  });

  try {
    await connectDB();
  } catch (error) {
    console.error("MongoDB connection failed", error);
  }
}

startServer();
