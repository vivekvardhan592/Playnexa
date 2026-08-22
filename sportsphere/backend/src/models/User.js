import mongoose from 'mongoose';

const SportIdentitySchema = new mongoose.Schema({
  sport: { type: String, required: true },
  skillLevel: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced', 'Competitive'], default: 'Intermediate' },
  customMetrics: { type: Map, of: String },
  preferredVenues: [String],
  gear: String,
});

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, index: true },
    password: { type: String, required: true }, // Hashed password
    role: { type: String, enum: ['USER', 'COACH', 'ORGANIZER', 'ADMIN'], default: 'USER' },
    city: { type: String, default: 'Hyderabad' },
    verified: { type: Boolean, default: true },
    avatar: { type: String, default: '/athlete_rahul.jpg' },
    sports: [SportIdentitySchema],
    participationScore: {
      totalScheduled: { type: Number, default: 24 },
      completed: { type: Number, default: 22 },
      attendanceRatePct: { type: Number, default: 92 },
      zeroFlakeStreak: { type: Number, default: 14 },
      uniqueCoPlayersMet: { type: Number, default: 18 },
    },
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model('User', UserSchema);
