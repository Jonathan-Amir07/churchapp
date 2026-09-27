const fs = require('fs');
const glob = require('glob'); // Need to check if available, or just use fs
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(function(file) {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) { 
      results = results.concat(walk(file));
    } else { 
      if (file.endsWith('.ts')) results.push(file);
    }
  });
  return results;
}

const files = walk('src');
let fixes = 0;
for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  const orig = content;
  content = content.replace(/@Request\(\) req: any/g, "@Request() req: { user: { userId: string; role: string; familyId?: string } }");
  if (content !== orig) {
    fs.writeFileSync(file, content);
    fixes++;
  }
}
console.log(`Fixed ${fixes} files`);
