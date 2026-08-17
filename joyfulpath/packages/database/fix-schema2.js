const fs = require('fs');
const path = require('path');

const schemaPath = path.join(__dirname, 'prisma', 'schema.prisma');
let schema = fs.readFileSync(schemaPath, 'utf8');

// Fix missing default values: `@default ` or `@default @map`
schema = schema.replace(/@default\s+@map/g, '@default(0) @map');
schema = schema.replace(/@default\n/g, '@default(0)\n');
schema = schema.replace(/@default\s*\n/g, '@default(0)\n');
schema = schema.replace(/@default\s*$/gm, '@default(0)');
schema = schema.replace(/@default\s+([A-Za-z])/g, '@default(0) $1');

// Fix Decimal (5, 2) to Decimal
schema = schema.replace(/Decimal\s*\(\d+,\s*\d+\)/g, 'Decimal');

fs.writeFileSync(schemaPath, schema);
console.log('Schema fixed successfully 2.');
