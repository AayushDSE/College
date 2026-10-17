require("dotenv").config();
const mongoose = require("mongoose");

async function testConnection() {
  try {
    console.log("Connecting to MongoDB Atlas...");

    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 10000
    });

    console.log("MongoDB Atlas connected successfully!");
  } catch (err) {
    console.log("Connection failed:", err.message);
    console.log("Details:", err.reason);
  } finally {
    await mongoose.disconnect();
    process.exit();
  }
}

testConnection();