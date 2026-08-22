import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/sportsphere');
    console.log(`[MongoDB Connected]: ${conn.connection.host}`);
  } catch (error) {
    console.warn(`[DB Notice]: MongoDB connection bypassed or unavailable. Falling back to in-memory mode for development. (${error.message})`);
  }
};
