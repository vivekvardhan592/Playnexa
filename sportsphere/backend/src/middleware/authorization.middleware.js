export const requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: { code: 'UNAUTHENTICATED', message: 'Authentication required.', requestId: req.requestId },
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: {
          code: 'FORBIDDEN_ROLE',
          message: `Access denied. Requires one of roles: [${allowedRoles.join(', ')}]`,
          requestId: req.requestId,
        },
      });
    }

    next();
  };
};

export const requireResourceOwner = (getOwnerIdFn) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: { code: 'UNAUTHENTICATED', message: 'Authentication required.', requestId: req.requestId },
      });
    }

    const resourceOwnerId = getOwnerIdFn(req);

    // Admin bypass or strict owner check
    if (req.user.role === 'ADMIN' || req.user.id === resourceOwnerId || req.user.athleteId === resourceOwnerId) {
      return next();
    }

    return res.status(403).json({
      success: false,
      error: {
        code: 'FORBIDDEN_RESOURCE_OWNER',
        message: 'Forbidden. You are not authorized to access or modify this resource.',
        requestId: req.requestId,
      },
    });
  };
};
