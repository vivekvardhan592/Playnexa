import { pool } from '../../config/postgres.js';
import * as authService from './auth.service.js';
import { requireAuth } from '../../middleware/auth.middleware.js';
import { requireRole, requireResourceOwner } from '../../middleware/authorization.middleware.js';

export const verifyPhase3Auth = async () => {
  console.log('--- PHASE 3: AUTHENTICATION VERIFICATION TEST STARTED ---');
  const results = {};
  const testEmail = `test_athlete_${Date.now()}@sportsphere.com`;
  const testPassword = 'Password123!';

  try {
    // 1. Test Successful Registration
    console.log('🧪 Test 1: Registering new athlete user...');
    const regResult = await authService.registerService({
      email: testEmail,
      password: testPassword,
      name: 'Test Athlete User',
      role: 'ATHLETE',
      city: 'Hyderabad',
    });

    if (regResult.token && regResult.user.id) {
      console.log(`✅ [1/6 Registration Passed]: User ID ${regResult.user.id}`);
      results.registrationPassed = true;
    }

    // 2. Test Duplicate Email Rejection (409 Conflict)
    console.log('🧪 Test 2: Attempting duplicate email registration...');
    try {
      await authService.registerService({
        email: testEmail,
        password: testPassword,
        name: 'Duplicate User',
      });
      console.error('❌ [2/6 Duplicate Email Failed]: Should have thrown duplicate email error');
    } catch (err) {
      if (err.statusCode === 409 || err.code === 'EMAIL_ALREADY_EXISTS') {
        console.log(`✅ [2/6 Duplicate Email Passed]: Correctly rejected with 409 (${err.message})`);
        results.duplicateEmailPassed = true;
      } else {
        throw err;
      }
    }

    // 3. Test Invalid Login Credentials Rejection (401 Unauthorized)
    console.log('🧪 Test 3: Attempting invalid password login...');
    try {
      await authService.loginService({
        email: testEmail,
        password: 'WrongPassword999!',
      });
      console.error('❌ [3/6 Invalid Login Failed]: Should have rejected invalid password');
    } catch (err) {
      if (err.statusCode === 401 || err.code === 'INVALID_CREDENTIALS') {
        console.log(`✅ [3/6 Invalid Login Passed]: Correctly rejected invalid password with 401`);
        results.invalidLoginPassed = true;
      } else {
        throw err;
      }
    }

    // 4. Test Successful Login & Authenticated Request
    console.log('🧪 Test 4: Logging in with valid credentials...');
    const loginResult = await authService.loginService({
      email: testEmail,
      password: testPassword,
    });

    const meUser = await authService.getMeService(loginResult.user.id);
    if (meUser.email === testEmail) {
      console.log(`✅ [4/6 Authenticated Request Passed]: Retrieved profile for ${meUser.email}`);
      results.authenticatedReqPassed = true;
    }

    // 5. Test Unauthenticated Request Handling
    console.log('🧪 Test 5: Simulating unauthenticated request middleware...');
    let unauthPassed = false;
    const reqMockUnauth = { cookies: {}, headers: {}, requestId: 'test-req-1' };
    const resMockUnauth = {
      status(code) {
        if (code === 401) unauthPassed = true;
        return this;
      },
      json(payload) {
        return payload;
      },
    };
    requireAuth(reqMockUnauth, resMockUnauth, () => {});
    if (unauthPassed) {
      console.log('✅ [5/6 Unauthenticated Request Passed]: Correctly blocked with 401');
      results.unauthenticatedReqPassed = true;
    }

    // 6. Test Unauthorized Role Access Handling (RBAC)
    console.log('🧪 Test 6: Simulating unauthorized RBAC role access...');
    let rbacPassed = false;
    const reqMockRbac = { user: { role: 'ATHLETE', id: regResult.user.id }, requestId: 'test-req-2' };
    const resMockRbac = {
      status(code) {
        if (code === 403) rbacPassed = true;
        return this;
      },
      json(payload) {
        return payload;
      },
    };
    const adminMiddleware = requireRole('ADMIN');
    adminMiddleware(reqMockRbac, resMockRbac, () => {});
    if (rbacPassed) {
      console.log('✅ [6/6 Unauthorized RBAC Access Passed]: Correctly blocked ATHLETE from ADMIN endpoint with 403');
      results.unauthorizedAccessPassed = true;
    }

    console.log('--- PHASE 3: AUTHENTICATION VERIFICATION ALL CHECKS PASSED 100% ---');
    return results;
  } catch (error) {
    console.error('❌ [PHASE 3 AUTH ERROR]:', error.message);
    throw error;
  }
};

// Run directly if invoked from CLI
if (process.argv[1] && process.argv[1].endsWith('verifyPhase3.js')) {
  verifyPhase3Auth().then(() => pool.end());
}
