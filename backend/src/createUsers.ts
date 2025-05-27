import mongoose from "mongoose";
import { User } from "./models/User";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";

dotenv.config();

const MONGO_URI = process.env.MONGODB_URI as string;
const defaultPassword = "123456789";

const rolesWithCounts = {
  manager: 1,
  team_lead: 3,
  client: 3,
  team_member: 12,
};

// Helper function to generate random names
function generateRandomName() {
  const firstNames = ["Alex", "Jordan", "Taylor", "Morgan", "Casey", "Jamie", "Riley", "Avery", "Skylar", "Robin"];
  const lastNames = ["Smith", "Johnson", "Lee", "Brown", "Garcia", "Miller", "Davis", "Clark", "Walker", "Hall"];
  const randomFirst = firstNames[Math.floor(Math.random() * firstNames.length)];
  const randomLast = lastNames[Math.floor(Math.random() * lastNames.length)];
  return `${randomFirst} ${randomLast}`;
}

async function createUsers() {
  await mongoose.connect(MONGO_URI);
  console.log("Connected to MongoDB");

  const hashedPassword = await bcrypt.hash(defaultPassword, 10);
  const usersToInsert = [];

  for (const [role, count] of Object.entries(rolesWithCounts)) {
    for (let i = 1; i <= count; i++) {
      const email = `${role}${i}@company.com`;
      const name = generateRandomName();

      usersToInsert.push({
        name,
        email,
        role,
        password: hashedPassword,
      });
    }
  }

  await User.insertMany(usersToInsert);
  console.log("Users inserted successfully");

  await mongoose.disconnect();
}

if (require.main === module) {
  createUsers().catch(console.error);
}
