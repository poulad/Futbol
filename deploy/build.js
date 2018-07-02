const $ = require('shelljs');
const path = require('path');

$.config.fatal = true;
const root = path.join(__dirname, '..');
const distDir = root + '/dist';


function clear() {
    console.log('# Clearing dist directory...');
    $.rm('-rf', distDir);
    $.mkdir('-p', `${distDir}/app/ClientApp`);
}

function buildAspNetCoreApp() {
    console.log('# Building ASP.NET Core app...');

    console.log('# Pulling .NET Core SDK image...');
    $.exec('docker pull "microsoft/dotnet:2.1-sdk"');

    console.log('# Publishing project...');
    $.exec(`
        docker run --rm --volume "${root}/src/:/src" --volume "${root}/dist/app:/app" --workdir /src/Futbol.Web/ microsoft/dotnet:2.1-sdk dotnet publish --configuration Release --output /app/
    `);
}

function buildAngularApp() {
    console.log('# Building Angular app...');
    const outputPath = `${distDir}/app/ClientApp/`;
    $.cd(`${root}/src/ClientApp/`);

    console.log('## Restoring Angular dependencies...');
    $.exec('npm install');
    $.exec('npm install --global typescript');

    console.log('## Publishing Angular app...');
    $.exec(`npm run build -- --prod --extract-css --base-href /Futbol/ --output-path "${outputPath}"`);

    console.log('## Building service worker...');
    $.cd(`${root}/src/ClientApp/src/service-worker`);
    $.exec(`tsc --outFile "${outputPath}/sw.js"`);

    console.log('## Combining service worker files...');
    $.cat(`${outputPath}/ngsw-worker.js`, `${outputPath}/sw.js`).to(`${outputPath}/sw.js`);

    console.log('## Removing unused service worker files...');
    $.rm(`${outputPath}/ngsw-worker.js`, `${outputPath}/safety-worker.js`);
}


clear();
buildAspNetCoreApp();
buildAngularApp();
console.log(`# Build succeeded: "${distDir}/app"`);