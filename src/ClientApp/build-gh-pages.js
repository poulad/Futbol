const $ = require('shelljs');
const fs = require('fs');

$.config.fatal = true;
const root = __dirname;
const outputPath =  $.tempdir() + '/futbol-gh-pages-build';


console.log('# Building app for gh-pages...');
console.log(`## Outputting to: "${outputPath}"`);

try {
    $.config.fatal = false;
    $.exec(`git worktree add "${outputPath}" gh-pages`);
} finally {
    $.config.fatal = true;
}

const gitFileContent = $.cat(`${outputPath}/.git`).stdout;
$.rm('-rf', outputPath);
$.exec(`npm run build:gh-pages -- --output-path "${outputPath}"`);
$.echo(gitFileContent).to(`${outputPath}/.git`);

const gpgSign = $.exec(`git config commit.gpgsign`).stdout.trim().toLowerCase() === 'true';
if (gpgSign) {
    $.exec(`git config commit.gpgsign false`)
}
$.cd(outputPath)
$.exec(`git add .`)
$.exec(`git commit -m "Build for gh-pages"`)
$.exec(`git push --force`)
if (gpgSign) {
    $.exec(`git config commit.gpgsign true`)
}
