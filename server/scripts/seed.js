require("dotenv").config();
const mongoose = require("mongoose");
const { connectDB } = require("../src/config/db");
const Question = require("../src/models/Question");
const Career = require("../src/models/Career");
const { careersSeed } = require("../src/utils/seedData");
const { synchronizeQuestionBank } = require("../src/utils/questionBank");

async function seedQuestions() {
  const syncResult = await synchronizeQuestionBank({ prune: true });
  const totalCount = await Question.countDocuments();
  console.log(
    `Question bank synced (upserted=${syncResult.upsertedCount}, modified=${syncResult.modifiedCount}, deleted=${syncResult.deletedCount}, total=${totalCount}).`
  );
}

async function seedCareersIfEmpty() {
  const existingCount = await Career.countDocuments();
  if (existingCount > 0) {
    console.log(`Careers already exist (${existingCount}). Skipping career seed.`);
    return;
  }

  await Career.insertMany(careersSeed);
  console.log(`Inserted ${careersSeed.length} careers.`);
}

async function runSeed() {
  await connectDB();
  await seedQuestions();
  await seedCareersIfEmpty();
  console.log("Seed completed.");
}

runSeed()
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.connection.close();
  });
