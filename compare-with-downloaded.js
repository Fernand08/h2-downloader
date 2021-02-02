const fs = require('fs');
const allDoujins = require('./all-nh-doujins.json');
const downloaded = require('./already_downloaded.json');

function processAll() {
	const done = downloaded.downloaded;
	const pending = allDoujins.doujins;
	const notDownloaded = [];
	for (const i in pending) {
		const current = pending[i];
		if (!done.includes(current)) {
			notDownloaded.push(current)
		}
	}
	console.log(notDownloaded);
	const toDownload = {
		doujins: notDownloaded,
	};
	fs.writeFile('./all-nh-doujins.json', JSON.stringify(toDownload, null, 4), (err) => {
		if (err) console.log(err);
	})
}

processAll();
