const PDFDocument = require('pdfkit');
const sizeOf = require('image-size');
const path = require('path');
const fs = require('fs');

const SUPPORTED_FORMATS = [".png", ".jpg"];

function convertToPdf(dir = "./") {

    const directories = fs.readdirSync(dir);

    const readableDirs = directories.filter(onlyDir(dir)).sort(sortByChapter);

    const pdfName = path.join(dir, path.basename(readableDirs[0])) + ".pdf";

    console.log(`Creating pdf ${pdfName}`)

    const DOC = new PDFDocument({ autoFirstPage: false });

    const outputStream = fs.createWriteStream(pdfName);

    DOC.pipe(outputStream);

    readableDirs.forEach(directory => {

        const namedDirectory = path.join(dir, directory);

        const images = fs.readdirSync(namedDirectory);

        images.forEach(image => {

            if (!SUPPORTED_FORMATS.includes(path.extname(image)))
                return;

            const fullImagePath = path.join(namedDirectory, image);

            console.log(`Adding image ${fullImagePath}`);

            const imageBuffer = fs.readFileSync(fullImagePath);

            const { width, height } = sizeOf(imageBuffer);

            DOC.addPage({
                size: [width, height],
            })

            DOC.image(fullImagePath, 0, 0);

        })

    })

    DOC.end();

}

function getFirstStringMatch(value = "") {
    const match = value.match(/(\d|\.)+/g);
    if (match && match.length) {
        return match[0];
    }
    return 0;
}


function sortByChapter(a, b) {
    const aMatch = getFirstStringMatch(a);
    const bMatch = getFirstStringMatch(b);
    const firstNumber = parseInt(aMatch, 10);
    const secondNumber = parseInt(bMatch, 10);
    if (firstNumber > secondNumber) return 1;
    if (secondNumber > firstNumber) return -1;
    return 0; 
}

function onlyDir(dir) {
    return function (child) {
        return fs.statSync(path.join(dir, child)).isDirectory();
    }
}

module.exports = {
    convertToPdf
}