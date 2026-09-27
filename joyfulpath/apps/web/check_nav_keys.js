const fs = require('fs');
const ar = JSON.parse(fs.readFileSync('messages/ar.json'));
const en = JSON.parse(fs.readFileSync('messages/en.json'));

const navKeys = [
  'dashboard', 'lessons', 'tasks', 'quizzes', 'attendance', 'classes', 'students', 'prayers', 'analytics', 'store',
  'families', 'progress', 'reports', 'journey', 'events', 'games', 'challenges', 'leaderboard', 'badges', 'qrCode',
  'profile', 'gamification', 'approvals', 'users', 'rewards', 'qr', 'crm', 'files', 'permissions', 'settings'
];

navKeys.forEach(key => {
  if (!ar.nav[key]) console.log(`ar.json missing nav.${key}`);
  if (!en.nav[key]) console.log(`en.json missing nav.${key}`);
});
console.log("Check complete.");
