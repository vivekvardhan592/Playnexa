import mongoose from 'mongoose';

const MessageSchema = new mongoose.Schema(
  {
    senderName: { type: String, required: true },
    receiverName: { type: String, required: true },
    sport: { type: String, default: 'Badminton' },
    text: { type: String, required: true },
    read: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.models.Message || mongoose.model('Message', MessageSchema);
