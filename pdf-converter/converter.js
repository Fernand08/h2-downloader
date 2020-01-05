const PDFDocument = require('pdfkit');
const sizeOf = require('image-size');
const path = require('path');
const fs = require('fs');

const SUPPORTED_FORMATS = [".png", ".jpg"];

function convertToPdf(dir = "./") {

    const directories = fs.readdirSync(dir);

    directories.filter(onlyDir(dir)).forEach(directory => {

        const namedDirectory = path.join(dir, directory);

        const images = fs.readdirSync(namedDirectory);

        const pdfName = `${namedDirectory}.pdf`;

        console.log(`Creating pdf ${pdfName}`)

        const DOC = new PDFDocument({ autoFirstPage: false });

        const outputStream = fs.createWriteStream(pdfName);

        DOC.pipe(outputStream);

        images.forEach(image => {

            if (!SUPPORTED_FORMATS.includes(path.extname(image)))
                return;

            const fullImagePath = path.join(namedDirectory, image);

            console.log(`Adding image ${fullImagePath}`);

            const dimension = sizeOf(fullImagePath);

            DOC.addPage({
                size: [dimension.width, dimension.height],
            })

            DOC.image(fullImagePath, 0, 0);

        })

        DOC.end();

    })

}

function onlyDir(dir) {
    return function (child) {
        return fs.statSync(path.join(dir, child)).isDirectory();
    }
}

module.exports = {
    convertToPdf
}