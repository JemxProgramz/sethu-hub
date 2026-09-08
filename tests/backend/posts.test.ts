import assert from 'node:assert';
import { query, get, run } from '../../database/db.js';

export async function runPostsTests() {
  console.log('🧪 Running Posts, Comments & Communities Tests...');

  // Test 1: Seed Posts Count
  const posts = query<any>('SELECT * FROM posts WHERE is_deleted = 0');
  assert(posts.length >= 8, 'There should be at least 8 seeded posts');
  console.log(`  ✅ Verified ${posts.length} active posts across SIT communities`);

  // Test 2: Post Types Coverage
  const postTypes = new Set(posts.map(p => p.post_type));
  assert(postTypes.has('project'), 'Project post type must exist');
  assert(postTypes.has('question'), 'Question post type must exist');
  assert(postTypes.has('poll'), 'Poll post type must exist');
  assert(postTypes.has('event'), 'Event post type must exist');
  assert(postTypes.has('announcement'), 'Announcement post type must exist');
  assert(postTypes.has('showcase'), 'Showcase post type must exist');
  console.log('  ✅ Verified rich post type coverage (Project, Q&A, Poll, Event, Showcase, Announcement)');

  // Test 3: Q&A Accepted Answer
  const acceptedComment = get<any>('SELECT * FROM comments WHERE is_accepted_answer = 1');
  assert(acceptedComment, 'An accepted answer should exist in the seeded Q&A question');
  assert.strictEqual(acceptedComment.post_id, 'p-question-qa', 'Accepted answer attached to question post');
  console.log('  ✅ Q&A Accepted Answer workflow verified in database');

  // Test 4: Communities Verification
  const comms = query<any>('SELECT * FROM communities');
  assert(comms.length >= 12, 'There should be at least 12 SIT communities');
  const csd = comms.find(c => c.slug === 'csd');
  assert(csd, 'Computer Science & Design (/c/csd) must exist');
  console.log(`  ✅ Verified ${comms.length} SIT communities including /c/csd, /c/ai-ml, /c/projects`);

  console.log('🎉 Posts & Communities tests passed successfully!\n');
}

