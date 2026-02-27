require("dotenv").config();
const app = require("./app");
const { connectDB } = require("./config/db");

const PORT = process.env.PORT || 5000;
const HOST = "0.0.0.0";

async function startServer() {
  app.listen(PORT, HOST, () => {
    console.log(`API listening on ${HOST}:${PORT}`);
  });

  try {
    await connectDB();
  } catch (error) {
    console.error("MongoDB connection failed", error);
  }
}

startServer();
