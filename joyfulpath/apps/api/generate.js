const { execSync } = require('child_process');

const modules = [
  'auth', 'users', 'students', 'parents', 'classes', 
  'lessons', 'tasks', 'quizzes', 'attendance', 
  'rewards', 'events', 'notifications', 'reading-plans'
];

modules.forEach(m => {
  try {
    execSync(`npx nest g module ${m}`, { stdio: 'ignore' });
    execSync(`npx nest g controller ${m} --no-spec`, { stdio: 'ignore' });
    execSync(`npx nest g service ${m} --no-spec`, { stdio: 'ignore' });
  } catch (e) {
    console.error(e);
  }
});
console.log('Done!');
