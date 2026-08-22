import fs from 'fs';
import path from 'path';

// Security Audit Logger — Tracks auth events, role updates, and policy violations
export const logSecurityEvent = (eventType, userId, details = {}, req = null) => {
  const timestamp = new Date().toISOString();
  const ip = req ? (req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1') : 'SYSTEM';
  const userAgent = req ? req.headers['user-agent'] : 'INTERNAL';

  const logEntry = {
    timestamp,
    eventType,
    userId: userId || 'ANONYMOUS',
    ip,
    userAgent,
    details,
  };

  // Log to console (Structured JSON format for SIEM ingestion)
  console.log(`[SECURITY AUDIT] ${JSON.stringify(logEntry)}`);

  return logEntry;
};
