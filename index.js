const fs = require('fs');
const { JSDOM } = require('jsdom');
const fetch = require('node-fetch');
const path = require('path');
const url = require('url');
const { convertToPdf } = require('./pdf-converter');

const BASE_PATH = "https://nhentai.net/g/";
const BASE_DOWNLOAD_PATH = "https://i.nhentai.net/galleries/";
const DOWNLOAD_BASE = "./downloads";

async function process(nukeCode) {
    
    const fullPageUrl = url.resolve(BASE_PATH, nukeCode);

    const sourceDir = path.join(DOWNLOAD_BASE, nukeCode);

    const nhPage = await JSDOM.fromURL(fullPageUrl);

    const DOC = nhPage.window.document;

    const fullDjName = DOC.querySelector("div#info>h1").innerHTML;

    const fullPagesText = DOC.querySelector("div#info>div").innerHTML;

    const coverSrc = DOC.querySelector("div#cover>a>img").attributes.getNamedItem("data-src").value;

    const curatedName = curateName(fullDjName);

    const pages = parseInt(getNumericPart(fullPagesText), 10);

    const coverUrl = path.dirname(coverSrc);

    const downloadNumber = getNumericPart(coverUrl);

    console.log(downloadNumber);

    for (let i = 1; i <= pages; i++) {
        const currentPage = `${i}.jpg`;
        const downloadUrl = url.resolve(BASE_DOWNLOAD_PATH, path.join(downloadNumber, currentPage));
        console.log(`Downloading image ${i} ${downloadUrl}`);
        const response = await fetch(downloadUrl);
        if (response.status === 200) {
            const arrayBuffer = await response.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);
            const parentDir = path.join(sourceDir, curatedName);
            if (!fs.existsSync(parentDir)) {
                console.log(`Mkdir directory ${parentDir}`);
                fs.mkdirSync(parentDir, { recursive: true });
            }
            const imageFileName = paddCurrentPage(i) + ".jpg";
            const fileName = path.join(parentDir, imageFileName);
            fs.writeFileSync(fileName, buffer);
            console.log(`Wrote ${fileName}`);
        }
    }

    convertToPdf(sourceDir);

}

function curateName(fullDjName = "") {
    return fullDjName.replace(/( |)\[(([A-Z])\w+|(([A-Z])\w+( |)\w+))\]( |)/g, "");
}

function getNumericPart(fullPagesText = "") {
    return fullPagesText.match(/[0-9]+/g)[0];
}

function paddCurrentPage(page = 0) {
    return ("0000" + page).substr(-4);
}

process("288285");