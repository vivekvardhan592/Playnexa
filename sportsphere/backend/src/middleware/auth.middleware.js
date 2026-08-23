import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';

export const requireAuth = (req, res, next) => {
  let token = req.cookies?.sportsphere_access_token;

  if (!token && req.headers.authorization) {
    const authHeader = req.headers.authorization;
    if (authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7);
    }
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      error: {
        code: 'UNAUTHENTICATED',
        message: 'Authentication required. Please log in.',
        requestId: req.requestId,
      },
    });
  }

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET);
    req.user = {
      id: decoded.sub,
      athleteId: decoded.athleteId,
      email: decoded.email,
      role: decoded.role || 'ATHLETE',
      name: decoded.name,
    };
    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      error: {
        code: 'INVALID_TOKEN',
        message: 'Invalid or expired authentication session token.',
        requestId: req.requestId,
      },
    });
  }
};

// Public endpoints can use this to enrich a response for logged-in callers
// without rejecting anonymous visitors.
export const optionalAuth = (req, res, next) => {
  let token = req.cookies?.sportsphere_access_token;
  if (!token && req.headers.authorization?.startsWith('Bearer ')) {
    token = req.headers.authorization.substring(7);
  }
  if (token) {
    try {
      const decoded = jwt.verify(token, env.JWT_SECRET);
      req.user = {
        id: decoded.sub,
        athleteId: decoded.athleteId,
        email: decoded.email,
        role: decoded.role || 'ATHLETE',
        name: decoded.name,
      };
    } catch {
      // An invalid optional token is treated as an anonymous request.
    }
  }
  next();
};
