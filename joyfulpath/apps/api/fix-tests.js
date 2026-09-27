const fs = require('fs');
let s = fs.readFileSync('src/instructors/instructors.service.spec.ts', 'utf8');
s = s.replace("provide: 'PrismaService'", "provide: PrismaService");
s = "import { PrismaService } from '../prisma/prisma.service';\n" + s;
fs.writeFileSync('src/instructors/instructors.service.spec.ts', s);

let c = fs.readFileSync('src/instructors/instructors.controller.spec.ts', 'utf8');
c = c.replace("provide: 'InstructorsService'", "provide: InstructorsService");
c = "import { InstructorsService } from './instructors.service';\n" + c;
fs.writeFileSync('src/instructors/instructors.controller.spec.ts', c);
