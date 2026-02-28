if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
const app = require("./app");
const { connectDB } = require("./config/db");

const HOST = "0.0.0.0";
const PORT = Number(process.env.PORT) || 5000;

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
    console.error("MongoDB connection failed. Retrying in 5 seconds.", error);
    setTimeout(() => {
      void connectToDatabase();
    }, 5000);
  }
}

console.log(`Using PORT=${PORT}`);

const server = app.listen(PORT, HOST, () => {
  console.log(`Server listening on ${HOST}:${PORT}`);
  void connectToDatabase();
});

server.on("error", (error) => {
  console.error("Failed to start server", error);
  process.exit(1);
});
