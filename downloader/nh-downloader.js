const fs = require('fs');
const { JSDOM } = require('jsdom');
const fetch = require('node-fetch');
const path = require('path');
const url = require('url');
const { convertToPdf } = require('../pdf-converter');

const BASE_PATH = "https://nhentai.net/g/";
const BASE_DOWNLOAD_PATH = "https://i.nhentai.net/galleries/";
const DOWNLOAD_BASE = "./nh-downloads";

async function process(nukeCode) {

    const fullPageUrl = url.resolve(BASE_PATH, nukeCode);

    const sourceDir = path.join(DOWNLOAD_BASE, nukeCode);

    const nhPage = await JSDOM.fromURL(fullPageUrl);

    const DOC = nhPage.window.document;

    const fullDjName = DOC.querySelector("div#info>h1.title>span.pretty").textContent.trim();
    console.log(`Downloading ${fullDjName}`)

    const pagesData = [...DOC.querySelectorAll("div.thumb-container>a>img")].map((img, index) => {
        const imageExt = path.extname(img.attributes.getNamedItem("data-src").value);
        const pageNumber = (index + 1);
        return ({ imageExt, pageNumber });
    })

    const coverSrc = DOC.querySelector("div#cover>a>img").attributes.getNamedItem("data-src").value;

    const curatedName = curateName(fullDjName);

    const coverUrl = path.dirname(coverSrc);

    const downloadNumber = getNumericPart(coverUrl);

    console.log(downloadNumber);

    const totalPages = pagesData.length;

    console.log(`Downloading ${totalPages} pages`);

    for (const index in pagesData) {
        const { imageExt, pageNumber } = pagesData[index];
        const currentPage = `${pageNumber}${imageExt}`;
        const downloadUrl = url.resolve(BASE_DOWNLOAD_PATH, path.join(downloadNumber, currentPage));
        const parentDir = path.join(sourceDir, curatedName);
        if (!fs.existsSync(parentDir)) {
            console.log(`Mkdir directory ${parentDir}`);
            fs.mkdirSync(parentDir, { recursive: true });
        }
        const imageFileName = paddCurrentPage(pageNumber) + imageExt;
        const fileName = path.join(parentDir, imageFileName);
        if (fs.existsSync(fileName)) {
            continue;
        }
        console.log(`Downloading image ${pageNumber} of ${totalPages} : ${downloadUrl}`);
        const response = await fetch(downloadUrl);
        if (response.status === 200) {
            const arrayBuffer = await response.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);
            fs.writeFileSync(fileName, buffer);
            console.log(`Wrote ${fileName}`);
        }
    }

    convertToPdf(sourceDir);

}

function curateName(fullDjName = "") {
    return fullDjName.replace(/(( |)\[(([A-Z])\w+|(([A-Z])\w+( |)\w+))\]( |)|(\W )+|(.+\| )|(\[\W+\]))/g, "").replace(/(\.|\?|\\|\/)+/g, "");
}

function getNumericPart(fullPagesText = "") {
    return fullPagesText.match(/[0-9]+/g)[0];
}

function paddCurrentPage(page = 0) {
    return ("0000" + page).substr(-4);
}

module.exports = {
    process
}