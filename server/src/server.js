require("dotenv").config();

const app = require("./app");
const { connectDB } = require("./config/db");

const HOST = "0.0.0.0";
const PORT = Number(process.env.PORT) || 5000;
const MONGO_RETRY_DELAY_MS = 5000;

async function connectToDatabase() {
  if (!process.env.MONGODB_URI) {
    console.warn(
      "MONGODB_URI is not set. API routes that require MongoDB will stay unavailable."
    );
    return;
  }

  try {
    await connectDB();
  } catch (error) {
    console.error(
      `MongoDB connection failed. Retrying in ${MONGO_RETRY_DELAY_MS / 1000} seconds.`,
      error
    );

    setTimeout(() => {
      void connectToDatabase();
    }, MONGO_RETRY_DELAY_MS);
  }
}

console.log("BOOT PORT", PORT);

const server = app.listen(PORT, HOST, () => {
  console.log(`API listening on port ${PORT}`);
  void connectToDatabase();
});

server.on("error", (error) => {
  console.error(`Server failed to bind on ${HOST}:${PORT}`, error);
  process.exit(1);
});
