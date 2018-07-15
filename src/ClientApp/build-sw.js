const $ = require('shelljs');

$.config.fatal = true;
const root = __dirname;
const outputPath = `${root}/dist/futbol`;

console.log('# Building service worker...');
$.cd(`${root}/src`);
$.exec(`node ${root}/node_modules/typescript/bin/tsc --project "${root}/src/tsconfig.sw.json" --outDir "${outputPath}"`);

console.log('## Removing unused service worker files...');
$.rm(`${outputPath}/safety-worker.js`);

console.log('## Copying service worker files for dev mode...');
$.cp([`${outputPath}/sw.js`, `${outputPath}/ngsw-worker.js`, `${outputPath}/ngsw.json`], `${root}/src/`);
