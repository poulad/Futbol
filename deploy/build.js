const $ = require('shelljs');
const path = require('path');

$.config.fatal = true;
const root = path.join(__dirname, '..');
const modulesDir = root + '/node_modules';
const srcDir = root + '/src';
const distDir = root + '/dist';


console.log('# Clearing dist directory...');
$.rm('-rf', distDir);
$.mkdir(distDir);

console.log('# Building Angular app...');
$.cd(`${root}/src/Client App/`);
$.exec(`npm run build:prod -- --base-href /Futbol/ --output-path "${distDir}/ng/"`);

console.log('# Building ASP.NET Core app...');
const webApiDir = `${root}/src/Futbol.Web`;
$.cd(webApiDir);
$.exec(`
    docker run --rm --volume "${webApiDir}:/app/" --workdir /app/ microsoft/dotnet:2.1-sdk \n
    "dotnet publish --configuration Release --output bin/publish/"
`);
$.cp('-r', `${webApiDir}/bin/publish`, `${distDir}/aspnetcore`);