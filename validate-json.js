const fs = require('fs');
try {
  const data = fs.readFileSync('config/tool-constants.json', 'utf8');
  JSON.parse(data);
  console.log('JSON IS VALID');
} catch(e) {
  console.error('JSON IS INVALID:', e.message);
}
