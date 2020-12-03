const fs = require('fs');

async function writeFile(filename, content) {
	return new Promise((resolve, reject) => {
		fs.writeFile(filename, content, (err) => {
			if (err) {
				reject(err);
			} else {
				resolve();
			}
		});
	})
}

module.exports = writeFile;
