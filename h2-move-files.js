const fs = require('fs');
const path = require('path');

const DOWNLOAD_BASE = "./h2-downloads";
const DESTINY = "./h2-pdf-files";

function moveFiles() {

    const dirs = getDirectories(DOWNLOAD_BASE);

    dirs.forEach(directory => {

        const directoryPath = path.join(DOWNLOAD_BASE, directory);

        const pdfName = getPdfName(directoryPath);

        if (!pdfName) return;

        const source = path.join(directoryPath, pdfName);

        const target = path.join(DESTINY, pdfName);

        fs.rename(source, target, (err) => {
            if (err) throw err;
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

function isDirectory(parent) {
    return function (child) {
        return (fs.statSync(path.join(parent, child)).isDirectory());
    }
}

function getDirectories(parent) {
    return fs.readdirSync(parent).filter(isDirectory(parent));   
}

moveFiles();