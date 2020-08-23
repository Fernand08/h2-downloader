const fs = require('fs');
const { JSDOM } = require('jsdom');
const fetch = require('node-fetch');
const path = require('path');
const url = require('url');
const { convertToPdf } = require('../pdf-converter');
const FormData = require('form-data');

const BASE_PATH = "https://hentai2read.com/";
const BASE_DOWNLOAD_PATH = "https://hentai2read.com/api";
const BASE_CDN_PATH = "https://static.hentaicdn.com/hentai";
const DOWNLOAD_BASE = "./h2-downloads";

async function process(doujinName = "") {

    const fullpathWebpage = url.resolve(BASE_PATH, doujinName);
    console.log("Visiting " + fullpathWebpage);
    const webPage = await JSDOM.fromURL(fullpathWebpage);
    const DOC = webPage.window.document;
    const downloads = [...DOC.querySelectorAll("a.btn.btn-default.btn-circle")].reverse();
    const mappedValues = downloads.map((e) => ({
        href: e.attributes.getNamedItem("href").value
    }));
    const dwldNumber = getNumberFromValues(mappedValues);
    for (let i = 0; i < mappedValues.length; i++) {
        const currentUrl = mappedValues[i].href;
        console.log("Visiting " + currentUrl);
        const currentPage = await JSDOM.fromURL(currentUrl);
        const currentDOC = currentPage.window.document;
        const downloadButton = currentDOC.querySelector("button#dl-button");
        const mangaId = downloadButton.attributes.getNamedItem("data-manga").value;
        const mangaPath = downloadButton.attributes.getNamedItem("data-path").value;
        const currentForm = createFormRequest(mangaId, mangaPath);
        const apiResponse = await fetch(BASE_DOWNLOAD_PATH, {
            method: "POST",
            body: currentForm
        })
        const jsonData = await apiResponse.json();
        console.log(jsonData)
        const images = jsonData.images;
        for (let j = 0; j < images.length; j++) {
            const currentImage = images[j];
            const imageName = path.basename(currentImage);
            const parentDir = path.join(DOWNLOAD_BASE, dwldNumber, `${doujinName}_chapter_${mangaPath}`);
            if (!fs.existsSync(parentDir)) {
                fs.mkdirSync(parentDir, { recursive: true });
            }
            const fileName = path.join(parentDir, imageName);
            if (fs.existsSync(fileName)) {
                console.log(`File ${fileName} already exists`);
                continue;
            }
            const currentImageCdn = BASE_CDN_PATH + currentImage;
            console.log(`Downloading image ${(j + i)} ${currentImageCdn}`);
            const imageResponse = await fetch(currentImageCdn);
            if (imageResponse.status === 200) {
                const arrayBuffer = await imageResponse.arrayBuffer();
                const buffer = Buffer.from(arrayBuffer);
                fs.writeFileSync(fileName, buffer);
                console.log(`Wrote ${fileName}`);
            }

        }
    }

    const sourceDir = path.join(DOWNLOAD_BASE, dwldNumber);
    convertToPdf(sourceDir);

}

function getNumberFromValues(values = []) {
    return values.map(e => e.href.match(/file=[0-9]+/g)[0].replace("file=", ""))[0];
}

function createFormRequest(mangaId = "", mangaPath = "") {
    const form = new FormData();
    form.append("controller", "manga");
    form.append("action", "download");
    form.append("mangaId", mangaId);
    form.append("path", mangaPath);
    return form;
}

module.exports = {
    process
}