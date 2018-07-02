const $ = require('shelljs');
const path = require('path');

$.config.fatal = true;
const root = path.join(__dirname, '..');
const outputPath = `${distDir}/ng/`;

function clear() {
    console.log('# Clearing dist directory...');
    $.rm('-rf', outputPath);
}

function buildAngularApp() {
    console.log('# Building Angular app...');

    $.cd(`${root}/src/ClientApp/`);
    $.exec('npm install');
    $.exec(`npm run build -- --prod --extract-css --base-href /Futbol/ --output-path "${outputPath}"`);

    console.log('## Building service worker...');
    $.cd(rootDir + '/src/service-worker/');
    $.exec(`tsc --outFile "${outputPath}/sw.js"`);

    console.log('## Combining service worker files...');
    $.cd(rootDir + '/dist/futbol');
    $.cat(`${outputPath}/ngsw-worker.js`, `${outputPath}/sw.js`).to(`${outputPath}/sw.js`);

    console.log('## Removing unused service worker files...');
    $.rm(`${outputPath}/ngsw-worker.js`, `${outputPath}/safety-worker.js`);
}


clear();
buildAngularApp();