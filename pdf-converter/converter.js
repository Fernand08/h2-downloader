const PDFDocument = require('pdfkit');
const sizeOf = require('image-size');
const path = require('path');
const fs = require('fs');

function convertToPdf(dir = "./") {

    const directories = fs.readdirSync(dir);

    directories.filter(onlyDir).forEach(directory => {

        const namedDirectory = path.join(dir, directory);

        const images = fs.readdirSync(namedDirectory);

        const pdfName = `${namedDirectory}.pdf`;

        console.log(`Creating pdf ${pdfName}`)

        const DOC = new PDFDocument({ autoFirstPage: false });

        const outputStream = fs.createWriteStream(pdfName);

        DOC.pipe(outputStream);

        images.forEach(image => {

            const fullImagePath = path.join(namedDirectory, image);

            console.log(`Adding image ${fullImagePath}`);

            const dimension = sizeOf(fullImagePath);

            DOC.addPage({
                size: [ dimension.width, dimension.height ],
            })

            DOC.image(fullImagePath, 0, 0);

        })

        DOC.end();

        // fs.unlink(dir);

    })

}

function onlyDir(dir) {
    return !(path.extname(dir));
}

convertToPdf("D:\\C\\Documents\\Proyectos\\node\\h2-downloader\\downloads\\288285");

module.exports = {
    convertToPdf
}