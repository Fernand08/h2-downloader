const fs = require('fs');
const path = require('path');
const json = require('../all-nh-doujins.json');

const FILE = '../all-nh-doujins.json';
const DOWNLOADED_CONTAINER = "/Users/tecnologia4/Desktop/Proyectos/PYTHON/reduce-pdf/red-pdf/src/source"

const alreadyDownloaded = fs.readdirSync(DOWNLOADED_CONTAINER);

let newList = [];

for (const index in json.doujins) {
	const doujin = json.doujins[index];
	const expression = `^${doujin}_chapter_.+.pdf`;
	const regexp = new RegExp(expression);
	const searched = alreadyDownloaded.find(e => e.match(regexp));
	if (!searched) {
		newList.push(doujin)
	}
}

console.log(newList.length);

const newJson = {
	doujins: [...newList],
}

const route = path.join(__dirname, FILE);

fs.writeFile(route, JSON.stringify(newJson, null, 4), (err) => {
	if (err) throw err;
})
