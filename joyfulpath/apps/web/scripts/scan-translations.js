// Scan all .tsx/.ts files for translation key usage and compare against locale files
const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, '..', 'src');
const enJson = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'messages', 'en.json'), 'utf-8'));
const arJson = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'messages', 'ar.json'), 'utf-8'));

// Flatten a nested object into dot-notation keys
function flattenKeys(obj, prefix = '') {
  let keys = [];
  for (const [k, v] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}.${k}` : k;
    if (typeof v === 'object' && v !== null && !Array.isArray(v)) {
      keys = keys.concat(flattenKeys(v, fullKey));
    } else {
      keys.push(fullKey);
    }
  }
  return keys;
}

const enKeys = new Set(flattenKeys(enJson));
const arKeys = new Set(flattenKeys(arJson));

// Recursively find all .tsx and .ts files
function walkDir(dir) {
  let results = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === 'node_modules' || entry.name === '.next') continue;
      results = results.concat(walkDir(fullPath));
    } else if (entry.name.endsWith('.tsx') || entry.name.endsWith('.ts')) {
      results.push(fullPath);
    }
  }
  return results;
}

const files = walkDir(srcDir);

// For each file, find useTranslations calls and t('key') usages
const usedKeys = new Map(); // key -> [file:line, ...]

for (const filePath of files) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');
  const relPath = path.relative(srcDir, filePath);

  // Find all useTranslations calls and their variable names + namespaces
  // Pattern: const tXxx = useTranslations('namespace') or const t = useTranslations()
  const translatorMap = {}; // varName -> namespace | ''
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    // Match: const varName = useTranslations('namespace') or useTranslations()
    const match = line.match(/const\s+(\w+)\s*=\s*useTranslations\(\s*(?:'([^']*)'|"([^"]*)")?\s*\)/);
    if (match) {
      const varName = match[1];
      const ns = match[2] || match[3] || '';
      translatorMap[varName] = ns;
    }
  }

  // Find all t('key'), tXxx('key') calls
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    // Match all translator calls: varName('key') or varName(`key`)
    const regex = /\b(\w+)\(\s*(?:'([^']*)'|"([^"]*)")\s*(?:,|\))/g;
    let m;
    while ((m = regex.exec(line)) !== null) {
      const varName = m[1];
      const key = m[2] || m[3];
      if (key && varName in translatorMap) {
        const ns = translatorMap[varName];
        const fullKey = ns ? `${ns}.${key}` : key;
        if (!usedKeys.has(fullKey)) usedKeys.set(fullKey, []);
        usedKeys.get(fullKey).push(`${relPath}:${i + 1}`);
      }
    }
    
    // Also match template literal patterns like t(`lessons.status.${status}`)
    const templateRegex = /\b(\w+)\(\s*`([^`]*)\$\{[^}]*\}([^`]*)`\s*(?:,|\))/g;
    while ((m = templateRegex.exec(line)) !== null) {
      const varName = m[1];
      const prefix = m[2];
      const suffix = m[3];
      if (varName in translatorMap) {
        const ns = translatorMap[varName];
        // Mark it as a dynamic key pattern
        const pattern = ns ? `${ns}.${prefix}<dynamic>${suffix}` : `${prefix}<dynamic>${suffix}`;
        if (!usedKeys.has(pattern)) usedKeys.set(pattern, []);
        usedKeys.get(pattern).push(`${relPath}:${i + 1} [DYNAMIC]`);
      }
    }
  }
}

// Report
console.log('=== MISSING FROM en.json ===');
let missingEn = 0;
for (const [key, locations] of usedKeys) {
  if (key.includes('<dynamic>')) continue; // skip dynamic keys
  if (!enKeys.has(key)) {
    console.log(`  MISSING: ${key}`);
    for (const loc of locations) console.log(`    used in: ${loc}`);
    missingEn++;
  }
}
console.log(`\nTotal missing from en.json: ${missingEn}\n`);

console.log('=== MISSING FROM ar.json ===');
let missingAr = 0;
for (const [key, locations] of usedKeys) {
  if (key.includes('<dynamic>')) continue;
  if (!arKeys.has(key)) {
    console.log(`  MISSING: ${key}`);
    for (const loc of locations) console.log(`    used in: ${loc}`);
    missingAr++;
  }
}
console.log(`\nTotal missing from ar.json: ${missingAr}\n`);

console.log('=== DYNAMIC KEY PATTERNS (need manual review) ===');
for (const [key, locations] of usedKeys) {
  if (key.includes('<dynamic>')) {
    console.log(`  PATTERN: ${key}`);
    for (const loc of locations) console.log(`    used in: ${loc}`);
  }
}

console.log('\n=== KEYS IN en.json BUT NOT ar.json ===');
for (const k of enKeys) {
  if (!arKeys.has(k)) console.log(`  ${k}`);
}

console.log('\n=== KEYS IN ar.json BUT NOT en.json ===');
for (const k of arKeys) {
  if (!enKeys.has(k)) console.log(`  ${k}`);
}
