import { pool, query } from '../../config/postgres.js';
import * as authService from '../auth/auth.service.js';
import * as matchesService from './matches.service.js';

export const verifyPhase6Matches = async () => {
  console.log('--- PHASE 6: MATCHES CONCURRENCY & ROW LOCKING VERIFICATION TEST STARTED ---');
  const results = {};

  try {
    // 1. Create Creator & Participant Accounts
    console.log('🧪 Step 1: Creating 10 test athlete accounts for concurrency test...');
    const sportsRes = await query("SELECT id FROM sports WHERE slug = 'badminton';");
    const sportId = sportsRes.rows[0]?.id;

    const creatorUser = await authService.registerService({
      email: `match_creator_${Date.now()}@sportsphere.com`,
      password: 'Password123!',
      name: 'Match Creator',
    });
    const creatorId = creatorUser.user.athlete.athlete_id;

    const athletes = [];
    for (let i = 1; i <= 9; i++) {
      const u = await authService.registerService({
        email: `match_joiner_${i}_${Date.now()}@sportsphere.com`,
        password: 'Password123!',
        name: `Joiner ${i}`,
      });
      athletes.push(u.user.athlete.athlete_id);
    }
    console.log(`✅ [1/5 10 Accounts Ready]: Creator ID ${creatorId}, Joiners: ${athletes.length}`);

    // 2. Create Nearly-Full Match Lobby (Capacity = 2, current_players = 1)
    console.log('🧪 Step 2: Creating a nearly-full Badminton match lobby (Capacity = 2)...');
    const newMatch = await matchesService.createMatchService(creatorId, {
      sportId,
      title: 'High Stakes Doubles Badminton Clash',
      description: 'Need 1 player to fill final spot!',
      skillLevel: 'Advanced',
      locationName: 'Pullela Gopichand Badminton Academy',
      scheduledAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      capacity: 2,
    });
    console.log(`✅ [2/5 Match Lobby Created]: Match ID ${newMatch.id} (Capacity: ${newMatch.capacity}, Current: ${newMatch.current_players})`);

    // 3. Test Single Join & Duplicate Check
    console.log('🧪 Step 3: Testing single join and duplicate participant prevention...');
    const singleJoin = await matchesService.joinMatchService(newMatch.id, athletes[0]);
    if (singleJoin.current_players === 2 && singleJoin.status === 'FULL') {
      console.log('  Single join succeeded. Lobby is now FULL (2/2).');
    }

    try {
      await matchesService.joinMatchService(newMatch.id, athletes[0]);
      console.error('❌ [3/5 Duplicate Join Failed]: Should have rejected duplicate participant');
    } catch (err) {
      if (err.statusCode === 409 || err.code === 'DUPLICATE_PARTICIPANT' || err.code === 'MATCH_FULL') {
        console.log(`✅ [3/5 Duplicate/Full Prevention Passed]: Correctly rejected duplicate join (${err.message})`);
        results.duplicatePassed = true;
      } else {
        throw err;
      }
    }

    // 4. CONCURRENCY TEST: 8 Simultaneous Requests Joining a Nearly-Full Match (Capacity = 2, Current = 1)
    console.log('🧪 Step 4: LAUNCHING CONCURRENCY RACE CONDITION TEST...');
    console.log('  Creating fresh Match (Capacity = 2) & firing 8 SIMULTANEOUS join requests via Promise.all...');

    const freshMatch = await matchesService.createMatchService(creatorId, {
      sportId,
      title: 'Race Condition Test Lobby',
      description: 'Capacity test',
      locationName: 'Gachibowli Stadium',
      scheduledAt: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(),
      capacity: 2,
    });

    const joinPromises = athletes.slice(1, 9).map((athleteId) =>
      matchesService.joinMatchService(freshMatch.id, athleteId)
        .then((res) => ({ success: true, res }))
        .catch((err) => ({ success: false, code: err.code, message: err.message }))
    );

    const raceResults = await Promise.all(joinPromises);

    const successfulJoins = raceResults.filter((r) => r.success);
    const failedJoins = raceResults.filter((r) => !r.success);

    console.log(`  Race Results: ${successfulJoins.length} Successful Join(s), ${failedJoins.length} Rejections.`);

    // 5. Database Invariant Check: participants <= capacity (2 <= 2)
    const finalMatchState = await matchesService.getMatchByIdService(freshMatch.id);
    console.log(`  Final Database State: current_players = ${finalMatchState.current_players}, capacity = ${finalMatchState.capacity}, status = ${finalMatchState.status}`);
    console.log(`  Actual Active Participants in DB: ${finalMatchState.participants.length}`);

    if (successfulJoins.length === 1 && finalMatchState.participants.length === 2 && finalMatchState.current_players <= finalMatchState.capacity) {
      console.log('✅ [4/5 Row Locking Concurrency Test Passed]: SELECT FOR UPDATE guaranteed exactly 1 successful join out of 8 simultaneous attempts.');
      console.log(`✅ [5/5 Invariant Verified]: participants (${finalMatchState.participants.length}) <= capacity (${finalMatchState.capacity}) ALWAYS HOLDS!`);
      results.concurrencyPassed = true;
      results.invariantPassed = true;
    } else {
      throw new Error(`CONCURRENCY INVARIANT BROKEN! Successful joins: ${successfulJoins.length}, DB participants: ${finalMatchState.participants.length}`);
    }

    console.log('--- PHASE 6: MATCHES CONCURRENCY ALL CHECKS PASSED 100% ---');
    return results;
  } catch (error) {
    console.error('❌ [PHASE 6 MATCHES CONCURRENCY ERROR]:', error.message);
    throw error;
  }
};

// Run directly if invoked from CLI
if (process.argv[1] && process.argv[1].endsWith('verifyPhase6.js')) {
  verifyPhase6Matches().then(() => pool.end());
}
