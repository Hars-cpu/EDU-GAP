import mongoose from "mongoose";

const connectDB = async () => {
  if (!process.env.MONGO_URI) {
    console.warn("MONGO_URI not set; running with in-memory chatbot data.");
    return false;
  }
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB connected");
    return true;
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    console.warn("Continuing without MongoDB; persistent auth features are unavailable.");
    return false;
  }
};

export default connectDB;