const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
    });

    console.log("MongoDB Connected Successfully");
  } catch (error) {
    console.log("DB Error:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;