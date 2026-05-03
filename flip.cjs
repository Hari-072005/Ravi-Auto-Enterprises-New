const fs = require('fs');
const content = fs.readFileSync('src/App.jsx', 'utf8');
const match = content.match(/const COUNTRY_CODES = \[\s*([\s\S]*?)\s*\];/);
if (match) {
  const arr = eval('[' + match[1] + ']');
  const flipped = arr.map(c => {
    const p = c.split(' ');
    return p[1] + ' ' + p[0];
  });
  const newContent = content.replace(match[0], 'const COUNTRY_CODES = ' + JSON.stringify(flipped, null, 2) + ';');
  fs.writeFileSync('src/App.jsx', newContent);
  console.log('Done!');
}
