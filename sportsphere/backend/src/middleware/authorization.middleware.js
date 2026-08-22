import { logSecurityEvent } from '../utils/logger.js';

// RBAC Middleware — Role-based authorization
export const requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Authentication required' });
    }

    if (!allowedRoles.includes(req.user.role)) {
      logSecurityEvent(
        'UNAUTHORIZED_ROLE_ACCESS',
        req.user.id,
        { requiredRoles: allowedRoles, userRole: req.user.role, path: req.originalUrl },
        req
      );

      return res.status(403).json({
        success: false,
        message: 'Access forbidden. Insufficient privileges.',
      });
    }

    next();
  };
};

// IDOR / BOLA Protection Middleware — Verifies resource ownership before modification
export const requireResourceOwner = (getOwnerIdFromResource) => {
  return async (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Authentication required' });
    }

    // Admins bypass ownership checks for moderation
    if (req.user.role === 'ADMIN') return next();

    const ownerId = await getOwnerIdFromResource(req);

    if (!ownerId) {
      return res.status(404).json({ success: false, message: 'Resource not found' });
    }

    if (String(ownerId) !== String(req.user.id)) {
      logSecurityEvent(
        'IDOR_ATTEMPT_BLOCKED',
        req.user.id,
        { targetResourceOwner: ownerId, path: req.originalUrl },
        req
      );

      return res.status(403).json({
        success: false,
        message: 'Forbidden. You do not own or control this resource.',
      });
    }

    next();
  };
};
