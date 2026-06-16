const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const maskedURI = process.env.MONGO_URI 
      ? process.env.MONGO_URI.replace(/:([^@:]+)@/, ':****@') 
      : 'undefined';
    console.log("Connecting to MongoDB Atlas:", maskedURI);

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