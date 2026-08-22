import { env } from '../config/env.js';

export const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || err.status || 500;
  const code = err.code || 'INTERNAL_SERVER_ERROR';
  const message = err.message || 'An unexpected error occurred on the server.';
  const requestId = req.requestId || 'N/A';

  console.error(`[ERROR] [ReqId: ${requestId}] [${statusCode}] ${code}: ${message}`);
  if (err.stack && env.NODE_ENV === 'development') {
    console.error(err.stack);
  }

  res.status(statusCode).json({
    success: false,
    error: {
      code,
      message,
      requestId,
      ...(env.NODE_ENV === 'development' && { details: err.details || null }),
    },
  });
};
