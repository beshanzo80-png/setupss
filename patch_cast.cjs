const fs = require('fs');
const file = 'server/repositories/HardwareRepository.ts';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(/\$\$\{params.length\}/g, "$${params.length}::text");
// BUT we must not cast limit!
content = content.replace(/LIMIT \$\$\{params.length\}::text/g, "LIMIT $${params.length}");

fs.writeFileSync(file, content);
