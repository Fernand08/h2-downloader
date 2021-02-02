const fs = require('fs');
const pending = require('./h2-pending.json');

const string = `
`;

const basePath = /https:\/\/hentai2read\.com\//g

const parsedString = string.replace(basePath, "").split("/\n").filter(e => e);

const names = Array.from(new Set([...pending.names, ...parsedString]));

const newPending = { names };

fs.writeFile('./h2-pending.json', JSON.stringify(newPending, null, 4), (err) => {
	if (err) {
		throw err;
	}
});
