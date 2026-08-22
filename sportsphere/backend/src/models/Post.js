import mongoose from 'mongoose';

const CommentSchema = new mongoose.Schema({
  authorName: { type: String, required: true },
  text: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const PostSchema = new mongoose.Schema(
  {
    authorName: { type: String, required: true },
    authorAvatar: { type: String, default: '/athlete_rahul.jpg' },
    sportBadge: { type: String, required: true },
    postType: { type: String, default: 'Achievement 🏆' },
    content: { type: String, required: true },
    isMatchSpot: { type: Boolean, default: false },
    spotsLeft: { type: Number, default: 0 },
    reactions: {
      fire: { type: Number, default: 0 },
      trophy: { type: Number, default: 0 },
      heart: { type: Number, default: 0 },
    },
    comments: [CommentSchema],
  },
  { timestamps: true }
);

export default mongoose.models.Post || mongoose.model('Post', PostSchema);
