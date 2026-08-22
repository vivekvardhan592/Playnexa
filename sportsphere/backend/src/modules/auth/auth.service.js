import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { env } from '../../config/env.js';
import * as authRepo from './auth.repository.js';
import { logSecurityEvent } from '../../utils/logger.js';

export const generateAuthToken = (user) => {
  return jwt.sign(
    {
      sub: user.id,
      athleteId: user.athlete_id || user.athlete?.athlete_id,
      email: user.email,
      role: user.role,
      name: user.display_name || user.athlete?.display_name || user.name,
    },
    env.JWT_SECRET,
    { expiresIn: '30d' }
  );
};

export const registerService = async ({ email, password, name, role = 'ATHLETE', city = 'Hyderabad' }, req) => {
  const existingUser = await authRepo.findUserByEmail(email);
  if (existingUser) {
    const error = new Error('An account already exists for this email address.');
    error.statusCode = 409;
    error.code = 'EMAIL_ALREADY_EXISTS';
    throw error;
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const newUser = await authRepo.createUserWithAthleteProfile({ email, hashedPassword, role, name, city });
  const token = generateAuthToken(newUser);

  logSecurityEvent('USER_REGISTERED', newUser.id, { email: newUser.email, role: newUser.role }, req);

  return { token, user: newUser };
};

export const loginService = async ({ email, password }, req) => {
  const user = await authRepo.findUserByEmail(email);
  if (!user) {
    logSecurityEvent('LOGIN_FAILED_USER_NOT_FOUND', 'ANONYMOUS', { email }, req);
    const error = new Error('Invalid email or password credentials.');
    error.statusCode = 401;
    error.code = 'INVALID_CREDENTIALS';
    throw error;
  }

  const isPasswordValid = await bcrypt.compare(password, user.password_hash);
  if (!isPasswordValid) {
    logSecurityEvent('LOGIN_FAILED_INVALID_PASSWORD', user.id, { email }, req);
    const error = new Error('Invalid email or password credentials.');
    error.statusCode = 401;
    error.code = 'INVALID_CREDENTIALS';
    throw error;
  }

  const userFull = await authRepo.findUserById(user.id);
  const token = generateAuthToken(userFull);

  logSecurityEvent('USER_LOGGED_IN_SUCCESS', user.id, { email: user.email }, req);

  return { token, user: userFull };
};

export const getMeService = async (userId) => {
  const user = await authRepo.findUserById(userId);
  if (!user) {
    const error = new Error('User profile not found.');
    error.statusCode = 404;
    error.code = 'USER_NOT_FOUND';
    throw error;
  }
  return user;
};
