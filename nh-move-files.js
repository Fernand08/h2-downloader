const fs = require('fs');
const path = require('path');

const DOWNLOAD_BASE = "./nh-downloads";
const DESTINY = "./nh-pdf-files";

function moveFiles() {

    const dirs = fs.readdirSync(DOWNLOAD_BASE);

    dirs.forEach(directory => {

        const directoryPath = path.join(DOWNLOAD_BASE, directory);

        const pdfName = getPdfName(directoryPath);
        
        if (!pdfName) return;

        const source = path.join(directoryPath, pdfName);

        const target = path.join(DESTINY, pdfName);

        fs.rename(source, target, (err) => {
            if (err) console.log(err);
        });

    })

}

function getPdfName(directory) {
    return fs.readdirSync(directory).find(noDirectory(directory));
}

function noDirectory(parent) {
    return function (child) {
        return !(fs.statSync(path.join(parent, child)).isDirectory());
    }
}

moveFiles();