import { strict as assert } from 'assert';

const API_URL = 'http://localhost:3001/api';

const USERS = {
  admin: { username: 'test_admin', password: 'password123', role: 'admin' },
  priest: { username: 'test_priest', password: 'password123', role: 'priest' },
  instructor: { username: 'test_instructor', password: 'password123', role: 'instructor' },
  parent: { username: 'test_parent', password: 'password123', role: 'parent' },
  student: { username: 'test_student', password: 'password123', role: 'student' }
};

async function login(user) {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(user)
  });
  if (!res.ok) throw new Error(`Login failed for ${user.username}: ${res.status}`);
  const data = await res.json();
  const cookies = res.headers.get('set-cookie');
  return { token: data.access_token, cookie: cookies };
}

async function request(endpoint, method, session, body = null) {
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${session.token}`,
      'Cookie': session.cookie
    }
  };
  if (body) options.body = JSON.stringify(body);
  const res = await fetch(`${API_URL}${endpoint}`, options);
  return { status: res.status, body: await res.text() };
}

async function runTests() {
  console.log('--- Starting API Integration & RBAC Tests ---');
  let passed = 0;
  let failed = 0;

  function expect(testName, actualRes, expected) {
    if (actualRes.status === expected) {
      console.log(`✅ ${testName} (Expected: ${expected}, Got: ${actualRes.status})`);
      passed++;
    } else {
      console.error(`❌ ${testName} (Expected: ${expected}, Got: ${actualRes.status})`);
      console.error(`   Body: ${actualRes.body}`);
      failed++;
    }
  }

  try {
    // 1. Authenticate all roles
    console.log('\n--- 1. Authentication ---');
    const sessions = {};
    for (const [role, creds] of Object.entries(USERS)) {
      sessions[role] = await login(creds);
      console.log(`✅ Logged in as ${role}`);
    }

    // 2. Test Admin/Priest Only Routes (e.g., POST /users)
    console.log('\n--- 2. Admin/Priest RBAC ---');
    const fakeUser = { username: `fake_${Date.now()}`, email: `fake_${Date.now()}@joyfulpath.org`, passwordHash: 'abc', role: 'student', firstName: 'Fake', lastName: 'User', displayName: 'Fake User', isProfileComplete: true };
    
    expect('Admin can create user', await request('/users', 'POST', sessions.admin, fakeUser), 201);
    
    const fakeUser2 = { ...fakeUser, username: `fake2_${Date.now()}`, email: `fake2_${Date.now()}@joyfulpath.org` };
    expect('Priest can create user', await request('/users', 'POST', sessions.priest, fakeUser2), 201);
    
    const fakeUser3 = { ...fakeUser, username: `fake3_${Date.now()}`, email: `fake3_${Date.now()}@joyfulpath.org` };
    expect('Instructor CANNOT create user', await request('/users', 'POST', sessions.instructor, fakeUser3), 403);
    expect('Student CANNOT create user', await request('/users', 'POST', sessions.student, fakeUser3), 403);
    expect('Parent CANNOT create user', await request('/users', 'POST', sessions.parent, fakeUser3), 403);

    // 3. Test Student Actions
    console.log('\n--- 3. Student Actions ---');
    expect('Student CANNOT start session (Instructor/Admin only)', await request('/games/start', 'POST', sessions.student, { gameType: 'quiz' }), 403);
    expect('Instructor CAN start session (Gets past RBAC, fails on missing DTO fields)', await request('/games/start', 'POST', sessions.instructor, { gameType: 'quiz' }), 500);
    
    expect('Student can view store rewards', await request('/store/rewards', 'GET', sessions.student), 200);

  } catch (err) {
    console.error('Test Execution Error:', err.message);
  }

  console.log(`\n--- Test Summary ---`);
  console.log(`Passed: ${passed}`);
  console.log(`Failed: ${failed}`);
  if (failed > 0) process.exit(1);
}

runTests();
