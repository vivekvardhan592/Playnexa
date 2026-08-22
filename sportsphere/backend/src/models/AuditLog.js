import mongoose from 'mongoose';

const AuditLogSchema = new mongoose.Schema(
  {
    eventType: { type: String, required: true },
    userId: { type: String, required: true },
    ipAddress: { type: String },
    userAgent: { type: String },
    details: { type: Object },
  },
  { timestamps: true }
);

export default mongoose.models.AuditLog || mongoose.model('AuditLog', AuditLogSchema);
