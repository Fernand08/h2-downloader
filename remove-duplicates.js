const fs = require('fs');
const json = require('./h2-pending.json');

console.log(`Original size: ${json.names.length}`);

json.names = Array.from(new Set(json.names))

console.log(`Final size: ${json.names.length}`);

fs.writeFile('./h2-pending.json', JSON.stringify(json, null, 4), (err) => {
	if (err) throw err;
})