import { pool } from '../../config/postgres.js';
import * as authService from '../auth/auth.service.js';
import * as chatService from './chat.service.js';
import * as chatRepo from './chat.repository.js';
import { runChatMigrations } from './chat.migrations.js';

export const verifyPhase7Chat = async () => {
  console.log('--- PHASE 7: REAL-TIME CHAT & MESSAGING VERIFICATION TEST STARTED ---');
  const results = {};

  try {
    // 0. Run migrations to ensure tables exist
    console.log('🧪 Step 0: Running chat DB migrations (idempotent)...');
    await runChatMigrations();
    console.log('✅ [0/7 Chat Migrations Passed]: conversations + messages tables verified.');

    // 1. Create two test athletes
    console.log('🧪 Step 1: Creating two test athlete accounts...');
    const ts = Date.now();
    const userA = await authService.registerService({
      email: `chat_athlete_a_${ts}@sportsphere.com`,
      password: 'Password123!',
      name: 'Chat Athlete A',
    });
    const userB = await authService.registerService({
      email: `chat_athlete_b_${ts}@sportsphere.com`,
      password: 'Password123!',
      name: 'Chat Athlete B',
    });
    const athleteA = userA.user.athlete.athlete_id;
    const athleteB = userB.user.athlete.athlete_id;
    console.log(`✅ [1/7 Athletes Created]: A=${athleteA.slice(0,8)}... B=${athleteB.slice(0,8)}...`);

    // 2. Create conversation (idempotent)
    console.log('🧪 Step 2: Creating DM conversation (should be idempotent)...');
    const { conversationId } = await chatService.getOrCreateConversationService(athleteA, athleteB);
    const { conversationId: sameId } = await chatService.getOrCreateConversationService(athleteB, athleteA);
    if (conversationId !== sameId) throw new Error('Conversation IDs do not match for A→B and B→A!');
    console.log(`✅ [2/7 Idempotent Conversation Passed]: ID ${conversationId.slice(0,8)}...`);
    results.conversationPassed = true;

    // 3. Persist messages
    console.log('🧪 Step 3: Persisting 5 messages to the database...');
    for (let i = 1; i <= 5; i++) {
      await chatRepo.saveMessage({
        conversationId,
        senderId: i % 2 === 0 ? athleteB : athleteA,
        content: `Test message #${i} — Hello from ${i % 2 === 0 ? 'B' : 'A'}!`,
      });
    }
    console.log('✅ [3/7 Message Persistence Passed]: 5 messages saved to DB.');
    results.persistencePassed = true;

    // 4. Retrieve message history
    console.log('🧪 Step 4: Retrieving message history with sender info...');
    const messages = await chatService.getMessageHistoryService(conversationId, athleteA, { limit: 50 });
    if (messages.length === 5 && messages[0].sender_name) {
      console.log(`✅ [4/7 Message History Passed]: Retrieved ${messages.length} messages with sender names.`);
      console.log(`  Last msg: "${messages[messages.length - 1].content}"`);
      results.historyPassed = true;
    } else {
      throw new Error(`Expected 5 messages, got ${messages.length}`);
    }

    // 5. Read receipts
    console.log('🧪 Step 5: Verifying is_read auto-mark after getMessageHistory...');
    const dbMsg = await pool.query(
      `SELECT COUNT(*) as unread FROM messages
       WHERE conversation_id = $1 AND sender_id != $2 AND is_read = false;`,
      [conversationId, athleteA]
    );
    const unread = parseInt(dbMsg.rows[0].unread, 10);
    if (unread === 0) {
      console.log('✅ [5/7 Read Receipts Passed]: All messages from B marked as read by A.');
      results.readReceiptsPassed = true;
    } else {
      throw new Error(`Expected 0 unread messages, found ${unread}.`);
    }

    // 6. Conversations list with unread counts
    console.log('🧪 Step 6: Testing conversations list API with last message preview...');
    // Send a new message from B that A hasn't read
    await chatRepo.saveMessage({ conversationId, senderId: athleteB, content: 'Unread test message from B' });
    const convList = await chatService.getConversationsService(athleteA);
    const conv = convList.find((c) => c.conversation_id === conversationId);
    if (conv && parseInt(conv.unread_count, 10) === 1 && conv.last_message) {
      console.log(`✅ [6/7 Conversations List Passed]: Unread count = ${conv.unread_count}, Last msg = "${conv.last_message.slice(0, 30)}..."`);
      results.conversationListPassed = true;
    } else {
      throw new Error(`Conversation list check failed. conv=${JSON.stringify(conv)}`);
    }

    // 7. Self-conversation guard
    console.log('🧪 Step 7: Testing self-conversation guard...');
    try {
      await chatService.getOrCreateConversationService(athleteA, athleteA);
      throw new Error('Should have rejected self-conversation!');
    } catch (err) {
      if (err.code === 'SELF_CONVERSATION') {
        console.log(`✅ [7/7 Self-Conversation Guard Passed]: (${err.message})`);
        results.selfGuardPassed = true;
      } else {
        throw err;
      }
    }

    console.log('\n--- PHASE 7: REAL-TIME CHAT ALL 7 CHECKS PASSED 100% ---');
    console.log('🔌 Socket.IO Event Contract:');
    console.log('  Client → Server: chat:join, chat:leave, chat:send_message, chat:typing, radar:ping');
    console.log('  Server → Client: chat:new_message, chat:typing, chat:read_ack, chat:error, presence:online, presence:offline, radar:new_match_ping');
    return results;
  } catch (error) {
    console.error('❌ [PHASE 7 CHAT ERROR]:', error.message);
    throw error;
  }
};

if (process.argv[1] && process.argv[1].endsWith('verifyPhase7.js')) {
  verifyPhase7Chat().then(() => pool.end());
}
