const $ = require('shelljs');
const path = require('path');

$.config.fatal = true;
const root = path.join(__dirname, '..');
const srcDir = root + '/src';
const distDir = root + '/dist';


function clear() {
    console.log('# Clearing dist directory...');
    $.rm('-rf', distDir);
}

function buildAspNetCoreApp() {
    console.log('# Building ASP.NET Core app...');
    $.cd(root);
    $.exec(
        `docker run --rm --volume "$PWD:/src" --volume "$PWD/dist/app:/app" --workdir /src microsoft/dotnet:2.1-sdk ` +
        `dotnet publish --configuration Release --output /app/`
    );
}

function buildAngularApp() {
    console.log('# Building Angular app...');
    const outputPath = `${distDir}/app/ClientApp/`;

    $.cd(`${root}/src/ClientApp/`);
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
buildAspNetCoreApp();
buildAngularApp();