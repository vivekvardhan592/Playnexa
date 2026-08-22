import { env } from '../../config/env.js';
import * as authService from './auth.service.js';
import { sendSuccess } from '../../utils/response.js';
import { logSecurityEvent } from '../../utils/logger.js';

const setAuthCookie = (res, token) => {
  res.cookie('sportsphere_access_token', token, {
    httpOnly: true,
    secure: env.NODE_ENV === 'production',
    sameSite: env.NODE_ENV === 'production' ? 'none' : 'lax',
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    path: '/',
  });
};

export const register = async (req, res, next) => {
  try {
    const { token, user } = await authService.registerService(req.body, req);
    setAuthCookie(res, token);
    return sendSuccess(res, { token, user }, 'Athlete registered successfully.', 201);
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { token, user } = await authService.loginService(req.body, req);
    setAuthCookie(res, token);
    return sendSuccess(res, { token, user }, 'Logged in successfully.');
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res) => {
  const userId = req.user ? req.user.id : 'ANONYMOUS';

  res.clearCookie('sportsphere_access_token', {
    httpOnly: true,
    secure: env.NODE_ENV === 'production',
    sameSite: env.NODE_ENV === 'production' ? 'none' : 'lax',
    path: '/',
  });

  logSecurityEvent('USER_LOGGED_OUT', userId, {}, req);
  return sendSuccess(res, {}, 'Logged out and session cleared successfully.');
};

export const getMe = async (req, res, next) => {
  try {
    const user = await authService.getMeService(req.user.id);
    return sendSuccess(res, { user }, 'User profile retrieved.');
  } catch (error) {
    next(error);
  }
};
