const PDFDocument = require('pdfkit');
const sizeOf = require('image-size');
const path = require('path');
const fs = require('fs');

const SUPPORTED_FORMATS = [".png", ".jpg"];

function convertToPdf(dir = "./") {

    const directories = readAndOrderDirs(dir);

    const readableDirs = directories.filter(onlyDir(dir));

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

            const dimension = sizeOf(imageBuffer);

            DOC.addPage({
                size: [dimension.width, dimension.height],
            })

            DOC.image(fullImagePath, 0, 0);

        })

    })

    DOC.end();

}

function readAndOrderDirs(dir) {
    const directories = fs.readdirSync(dir);
    directories.sort((dira, dirb) => {
        const numberA = extractNumericPart(dira);
        const numberB = extractNumericPart(dirb);
        if (numberA < numberB) return -1;
        if (numberA > numberB) return 1;
        return 0;
    });
    return directories;
}

function extractNumericPart(dir) {
    const value = dir.replace(/\D+$/g, "").replace(/^.+_chapter_/g, "");
    return parseFloat(value);
}

function onlyDir(dir) {
    return function (child) {
        return fs.statSync(path.join(dir, child)).isDirectory();
    }
}

module.exports = {
    convertToPdf
}