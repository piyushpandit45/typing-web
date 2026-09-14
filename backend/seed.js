require("dotenv").config();
const { connectDb } = require("./config/db");
const { seedDefaultTopics } = require("./utils/seedTopics");
const { ensureAdmin } = require("./utils/ensureAdmin");

async function seed() {
  await connectDb();
  const result = await seedDefaultTopics();
  await ensureAdmin();
  console.log(result.seeded ? `Seeded ${result.count} topics.` : `Topics already exist (${result.count}).`);
  process.exit(0);
}

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});
