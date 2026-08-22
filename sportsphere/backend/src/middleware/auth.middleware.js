import jwt from 'jsonwebtoken';
import { logSecurityEvent } from '../utils/logger.js';

export const requireAuth = (req, res, next) => {
  let token;

  // 1. Read token from secure HttpOnly cookie
  if (req.cookies && req.cookies.sportsphere_access_token) {
    token = req.cookies.sportsphere_access_token;
  } 
  // 2. Fallback to Authorization: Bearer <token>
  else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    logSecurityEvent('UNAUTHENTICATED_ACCESS_ATTEMPT', 'ANONYMOUS', { path: req.originalUrl }, req);
    return res.status(401).json({
      success: false,
      message: 'Authentication required. No token provided.',
    });
  }

  try {
    const secret = process.env.JWT_SECRET || 'sportsphere_ultra_secure_jwt_secret_2026_key';
    const decoded = jwt.verify(token, secret);

    // Attach minimal safe identity
    req.user = {
      id: decoded.sub || decoded.id || 'user_1',
      email: decoded.email,
      role: decoded.role || 'USER',
      name: decoded.name || 'Vivek Kumar',
    };

    return next();
  } catch (error) {
    logSecurityEvent('INVALID_TOKEN_ATTEMPT', 'ANONYMOUS', { path: req.originalUrl, error: error.message }, req);
    return res.status(401).json({
      success: false,
      message: 'Authentication failed. Invalid or expired token.',
    });
  }
};
