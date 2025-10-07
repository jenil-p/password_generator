import mongoose from "mongoose";

let isConnected = false;

export const connectDB = async () => {
  if (isConnected) return;
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    isConnected = true;
    console.log("mongodb connected ...");
  } catch (err) {
    console.error("failed to connect to database ...", err);
  }
};
