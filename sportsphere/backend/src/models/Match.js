import mongoose from 'mongoose';

const MatchSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    sport: { type: String, required: true },
    requiredSkillLevel: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced', 'Any'], default: 'Intermediate' },
    locationName: { type: String, required: true },
    distanceKm: { type: Number, default: 1.2 },
    scheduledAt: { type: Date, required: true },
    maxPlayers: { type: Number, default: 4 },
    joinedPlayers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    status: { type: String, enum: ['OPEN', 'FULL', 'COMPLETED', 'CANCELLED'], default: 'OPEN' },
    matchReasoning: [String], // Explainable matching criteria
  },
  { timestamps: true }
);

export default mongoose.models.Match || mongoose.model('Match', MatchSchema);
