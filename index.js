const processFromH2R = require('./downloader/h2-downloader').process;
const processFromNH = require('./downloader/nh-downloader').process;
const doujinJson = require("./doujinList.json");

async function process() {

	const doujinList = Array.from(new Set(doujinJson.doujinList));
	
	console.log(`Preparing to download ${doujinList.length} doujins`)
	
	for (const index in doujinList) {
		const doujinName = doujinList[index];
		console.log(`Downloading doujin ${(index + 1)}: ${doujinName}`);
		await processFromH2R(doujinName)
	}
}

process();
