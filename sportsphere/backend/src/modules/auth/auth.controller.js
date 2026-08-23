import { env } from '../../config/env.js';
import * as authService from './auth.service.js';
import { sendSuccess } from '../../utils/response.js';
import { logSecurityEvent } from '../../utils/logger.js';

const passwordResetOtps = new Map();

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

export const forgotPassword = async (req, res, next) => {
  try {
    const email = req.body.email?.toLowerCase().trim();
    if (!email) {
      return res.status(422).json({ success: false, message: 'Email address is required.' });
    }
    // Do not reveal whether an account exists. The code is exposed only in
    // development to keep the hackathon demo usable without an email provider.
    const otpCode = process.env.DEMO_OTP || '123456';
    passwordResetOtps.set(email, { otpCode, expiresAt: Date.now() + 15 * 60 * 1000 });
    logSecurityEvent('PASSWORD_RESET_REQUESTED', 'ANONYMOUS', { email }, req);
    return sendSuccess(res, {
      ...(env.NODE_ENV !== 'production' && { demoOTP: otpCode }),
      expiresInMinutes: 15,
    }, 'If an account exists, a reset code has been sent.');
  } catch (error) {
    next(error);
  }
};

export const resetPassword = async (req, res, next) => {
  try {
    const email = req.body.email?.toLowerCase().trim();
    const { otpCode, newPassword } = req.body;
    const entry = passwordResetOtps.get(email);
    if (!email || !otpCode || !newPassword || newPassword.length < 8) {
      return res.status(422).json({ success: false, message: 'Email, reset code, and an 8-character password are required.' });
    }
    if (!entry || entry.expiresAt < Date.now() || entry.otpCode !== otpCode) {
      return res.status(401).json({ success: false, message: 'Invalid or expired password reset code.' });
    }
    const updated = await authService.updatePasswordService(email, newPassword);
    passwordResetOtps.delete(email);
    if (!updated) {
      return sendSuccess(res, {}, 'Password reset completed.');
    }
    logSecurityEvent('PASSWORD_RESET_COMPLETED', updated.id, { email }, req);
    return sendSuccess(res, {}, 'Password reset completed.');
  } catch (error) {
    next(error);
  }
};
