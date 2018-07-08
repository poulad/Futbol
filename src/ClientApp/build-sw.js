const $ = require('shelljs');

$.config.fatal = true;
const root = __dirname;
const outputPath = `${root}/dist/futbol`;

console.log('# Building service worker...');
$.cd(`${root}/src`);
$.exec(`node ${root}/node_modules/typescript/bin/tsc --project "${root}/src/tsconfig.sw.json" --outDir "${outputPath}"`);

console.log('## Combining service worker files...');
$.cat(`${outputPath}/ngsw-worker.js`, `${outputPath}/sw.js`).to(`${outputPath}/sw.js`);

console.log('## Removing unused service worker files...');
$.rm(`${outputPath}/ngsw-worker.js`, `${outputPath}/safety-worker.js`);

console.log('## Copying service worker file for dev mode...');
$.cp(`${outputPath}/sw.js`, `${root}/src/sw.js`);
