const fs = require('fs');
const path = require('path');
const url = require('url');
const { JSDOM } = require('jsdom');
const BASE_DIR = "../nh-downloads";
const BASE_PATH = "https://nhentai.net/g/";

const list = [
	"261333",
	"261334",
	"261335",
	"261337",
]

async function readContents() {
	const mainDirectory = path.join(__dirname, BASE_DIR);
	for (index in list) {
		const code = list[index];
		const codePath = path.join(mainDirectory, code);
		const files = fs.readdirSync(codePath);
		const title = await getTitle(code);
		for (let i = 0; i < files.length; i++) {
			const currentFile = files[i];
			const ext = path.extname(currentFile);
			const oldPath = path.join(codePath, currentFile);
			const newPath = path.join(codePath, `${title}-${code}${ext}`);
			fs.rename(oldPath, newPath, err => {
				if (err) console.log(err);
				else console.log(`Renamed ${oldPath} to ${newPath}`);
			})
		}
	}
}

async function getTitle(code) {
	const fullPageUrl = url.resolve(BASE_PATH, code);
	const nhPage = await JSDOM.fromURL(fullPageUrl);
	const DOC = nhPage.window.document;
	const fullDjName = DOC.querySelector("div#info>h1.title>span.pretty").textContent.trim();
	console.log(`Original title: ${fullDjName}`);
	const curated = curateName(fullDjName);
	console.log(`Curated title: ${curated}`);
	return curated;
}

function curateName(fullDjName = "") {
    return fullDjName.replace(/(( |)\[(([A-Z])\w+|(([A-Z])\w+( |)\w+))\]( |)|(\W )+|(.+\| )|(\[\W+\]))/g, "").replace(/(\.|\?|\\|\/)+/g, "");
}

readContents();
