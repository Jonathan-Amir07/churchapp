const fs = require('fs');
const path = require('path');

const schemaPath = path.join(__dirname, 'prisma', 'schema.prisma');
let schema = fs.readFileSync(schemaPath, 'utf8');

// Fix left over length limits like (200) or @unique(50)
schema = schema.replace(/\(\d+\)/g, '');

// Fix quotes around numbers in @default
schema = schema.replace(/@default\("(\d+)"\)/g, '@default($1)');

fs.writeFileSync(schemaPath, schema);
console.log('Schema fixed successfully.');
