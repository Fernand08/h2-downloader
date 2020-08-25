const fs = require('fs');
const path = require('path');
const json = require('../all-nh-doujins.json');

const FILE = '../all-nh-doujins.json';

const list = [...new Set(json.doujins)];

const newJson = {
	doujins: list,
}

const route = path.join(__dirname, FILE);

fs.writeFile(route, JSON.stringify(newJson, null, 4), (err) => {
	if (err) throw err;
})
