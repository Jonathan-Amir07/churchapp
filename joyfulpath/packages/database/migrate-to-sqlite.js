const fs = require('fs');
const path = require('path');

const schemaPath = path.join(__dirname, 'prisma', 'schema.prisma');
let schema = fs.readFileSync(schemaPath, 'utf8');

// 1. Change provider
schema = schema.replace(/provider = "postgresql"/, 'provider = "sqlite"');
schema = schema.replace(/provider\s*=\s*"postgresql"/g, 'provider = "sqlite"');

// 2. We need to handle url for datasource
// In SQLite it's usually env("DATABASE_URL") but let's make sure it's set in the file if we want.
// We'll leave the url line intact, user just needs to set DATABASE_URL="file:./dev.db" in their .env

// 3. Remove @db annotations
schema = schema.replace(/@db\.\w+(\(\))?/g, '');
schema = schema.replace(/@db\.\w+\(\d+\)/g, '');

// 4. Change default uuid generation
schema = schema.replace(/@default\(dbgenerated\("gen_random_uuid\(\)"\)\)/g, '@default(uuid())');

// 5. Enums conversion
// We need to find all enums, remove them, and collect their names to replace their usage with String.
const enumRegex = /enum\s+([A-Za-z0-9_]+)\s*{[^}]*}/g;
const enums = [];
let match;
while ((match = enumRegex.exec(schema)) !== null) {
  enums.push(match[1]);
}

// Remove enums from file
schema = schema.replace(/enum\s+[A-Za-z0-9_]+\s*{[^}]*}/g, '');

// Replace enum usages with String
// Also need to handle @default(student) -> @default("student")
for (const enumName of enums) {
  const typeRegex = new RegExp(`\\b${enumName}\\b`, 'g');
  schema = schema.replace(typeRegex, 'String');
}

// Fix array types. SQLite does not support String[] or Int[]. We have to change to String.
// In this case, we'll convert String[] to String and we'll have to JSON parse/stringify in app code.
schema = schema.replace(/String\[\]/g, 'String');
schema = schema.replace(/Int\[\]/g, 'String');
schema = schema.replace(/Json/g, 'String');

// Fix unquoted enum defaults
// e.g. @default(student) -> @default("student")
schema = schema.replace(/@default\((?!autoincrement|now|uuid|cuid|dbgenerated)([a-zA-Z0-9_]+)\)/g, '@default("$1")');

fs.writeFileSync(schemaPath, schema);
console.log('Schema converted to SQLite successfully.');
