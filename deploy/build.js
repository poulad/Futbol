const $ = require('shelljs');
const path = require('path');

$.config.fatal = true;
const root = path.join(__dirname, '..');
const modulesDir = root + '/node_modules';
const srcDir = root + '/src';
const distDir = root + '/dist/web';


console.log('# Clearing dist directory...');
$.rm('-rf', distDir);

console.log('# Building Angular app...');
$.cd(`${root}/src/Client App/`);
$.exec(`npm run build:prod -- --base-href /Futbol/ --output-path "${root}/dist/ng/"`);