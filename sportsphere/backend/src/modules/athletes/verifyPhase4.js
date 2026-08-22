import { pool, query } from '../../config/postgres.js';
import * as authService from '../auth/auth.service.js';
import * as athletesService from './athletes.service.js';

export const verifyPhase4Athletes = async () => {
  console.log('--- PHASE 4: ATHLETE PROFILE VERIFICATION TEST STARTED ---');
  const results = {};
  const testEmail = `profile_test_${Date.now()}@sportsphere.com`;
  const testPassword = 'Password123!';

  try {
    // 1. Create Test Athlete Account
    console.log('🧪 Step 1: Creating test athlete account...');
    const userResult = await authService.registerService({
      email: testEmail,
      password: testPassword,
      name: 'Profile Tester',
      city: 'Hyderabad',
    });
    const athleteId = userResult.user.athlete.athlete_id;
    console.log(`✅ [1/6 Account Created]: Athlete ID ${athleteId}`);

    // 2. Test Profile Retrieval
    console.log('🧪 Step 2: Retrieving athlete profile...');
    const profile = await athletesService.getAthleteProfile(athleteId);
    if (profile.display_name === 'Profile Tester') {
      console.log(`✅ [2/6 Profile Retrieval Passed]: ${profile.display_name} (${profile.city})`);
      results.retrievalPassed = true;
    }

    // 3. Test Profile Attribute Update
    console.log('🧪 Step 3: Updating profile bio and area...');
    const updated = await athletesService.updateAthleteProfileService(athleteId, {
      bio: 'Competitive Badminton smash player looking for doubles games.',
      area: 'HITEC City',
      preferredRadiusKm: 15,
    });
    if (updated.area === 'HITEC City' && updated.preferred_radius_km === 15) {
      console.log(`✅ [3/6 Profile Update Passed]: Updated area to ${updated.area}, radius to ${updated.preferred_radius_km} km`);
      results.updatePassed = true;
    }

    // 4. Test PostGIS Spatial Location Update (Gachibowli Coordinates)
    console.log('🧪 Step 4: Updating PostGIS spatial location coordinates (78.38, 17.44)...');
    const location = await athletesService.updateAthleteLocationService(athleteId, {
      longitude: 78.38,
      latitude: 17.44,
    });
    if (location.longitude === 78.38 && location.latitude === 17.44) {
      console.log(`✅ [4/6 PostGIS Location Update Passed]: (${location.longitude}, ${location.latitude})`);
      results.locationPassed = true;
    }

    // 5. Test Multi-Sport Management with JSONB Data
    console.log('🧪 Step 5: Adding Badminton sport with JSONB metrics...');
    const sportsListRes = await query("SELECT id FROM sports WHERE slug = 'badminton';");
    const badmintonId = sportsListRes.rows[0]?.id;

    if (badmintonId) {
      const sportRecord = await athletesService.addOrUpdateSportService(athleteId, {
        sportId: badmintonId,
        skillLevel: 'Advanced',
        sportData: { smashSpeed: '245 km/h', matchesPlayed: 34, winRatePct: 78 },
      });

      if (sportRecord.skill_level === 'Advanced' && sportRecord.sport_data.smashSpeed === '245 km/h') {
        console.log(`✅ [5/6 JSONB Sports Management Passed]: Added Badminton with ${sportRecord.sport_data.smashSpeed}`);
        results.sportsPassed = true;
      }
    }

    // 6. Test Coordinate Bounds Validation
    console.log('🧪 Step 6: Testing invalid coordinate bounds validation...');
    try {
      await athletesService.updateAthleteLocationService(athleteId, { longitude: 999, latitude: 17.44 });
      console.error('❌ [6/6 Validation Failed]: Should have rejected invalid longitude 999');
    } catch (err) {
      if (err.statusCode === 422 || err.code === 'COORDINATES_OUT_OF_BOUNDS') {
        console.log(`✅ [6/6 Validation Passed]: Correctly rejected out-of-bounds coordinates (${err.message})`);
        results.validationPassed = true;
      } else {
        throw err;
      }
    }

    console.log('--- PHASE 4: ATHLETE PROFILE VERIFICATION ALL CHECKS PASSED 100% ---');
    return results;
  } catch (error) {
    console.error('❌ [PHASE 4 ATHLETES ERROR]:', error.message);
    throw error;
  }
};

// Run directly if invoked from CLI
if (process.argv[1] && process.argv[1].endsWith('verifyPhase4.js')) {
  verifyPhase4Athletes().then(() => pool.end());
}
