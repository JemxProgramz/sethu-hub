import assert from 'node:assert';
import bcrypt from 'bcryptjs';
import { get, run } from '../../database/db.js';
import { signToken, verifyToken } from '../../backend/utils/jwt.js';

export async function runAuthTests() {
  console.log('🧪 Running Backend Auth & Security Tests...');

  // Test 1: Password Hashing
  const plain = 'sethu123';
  const hash = bcrypt.hashSync(plain, 10);
  assert(bcrypt.compareSync(plain, hash), 'Bcrypt hash comparison should succeed');
  assert(!bcrypt.compareSync('wrongpass', hash), 'Bcrypt comparison should fail on wrong password');
  console.log('  ✅ Password hashing and comparison verified');

  // Test 2: JWT Signing & Verification
  const payload = { userId: 'u-karthik', username: 'karthik_csd', role: 'student' as const };
  const token = signToken(payload);
  assert(typeof token === 'string' && token.length > 20, 'JWT token should be generated');

  const verified = verifyToken(token);
  assert(verified !== null, 'JWT verification should succeed');
  assert.strictEqual(verified.userId, 'u-karthik', 'Token payload userId matches');
  assert.strictEqual(verified.role, 'student', 'Token payload role matches');
  console.log('  ✅ JWT signing, verification, and role preservation verified');

  // Test 3: Demo Accounts In Database
  const demoStudent = get<any>('SELECT * FROM users WHERE username = ?', ['karthik_csd']);
  assert(demoStudent, 'Demo student karthik_csd must exist in database');
  assert.strictEqual(demoStudent.role, 'student', 'Demo student has student role');

  const demoFaculty = get<any>('SELECT * FROM users WHERE username = ?', ['dr_ramanathan']);
  assert(demoFaculty, 'Demo faculty dr_ramanathan must exist');
  assert.strictEqual(demoFaculty.role, 'faculty', 'Demo faculty has faculty role');

  const demoMod = get<any>('SELECT * FROM users WHERE username = ?', ['priya_mod']);
  assert(demoMod, 'Demo moderator priya_mod must exist');
  assert.strictEqual(demoMod.role, 'moderator', 'Demo moderator has moderator role');

  const demoAdmin = get<any>('SELECT * FROM users WHERE username = ?', ['admin_sethu']);
  assert(demoAdmin, 'Demo admin admin_sethu must exist');
  assert.strictEqual(demoAdmin.role, 'admin', 'Demo admin has admin role');
  console.log('  ✅ All 4 demo persona accounts verified with distinct RBAC roles');

  console.log('🎉 Auth & Security tests passed successfully!\n');
}
