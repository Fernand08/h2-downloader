const processFromH2R = require('./downloader/h2-downloader').process;
const processFromNH = require('./downloader/nh-downloader').process;
const json = require('./all-nh-doujins.json');

const list = [...json.doujins];

setTimeout(async () => {
	for (let i = 0; i < list.length; i++) {
		const code = list[i];
		await processFromH2R(code);
	}
}, 500)

console.log(`Processing ${list.length} doujins`);
