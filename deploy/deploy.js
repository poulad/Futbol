const $ = require('shelljs');
const path = require('path');
require('./logging');

$.config.fatal = true;
const deployDir = __dirname;
const distDir = path.join(deployDir, '/../dist');

function verifySettings() {
    console.info('Verifying settings...');
    const script = require('./verify-settings');
    try {
        script.verifyDistDirectory();
        script.verifyDockerSettings();
        script.verifyDockerConnection();
        script.verifyDockerCompose();
    } catch (e) {
        console.error('Settings are invalid!');
        console.error(e);
        process.exit(1);
    }
}

function tryReadAppSettings() {
    console.info('Reading app settings...');
    const script = require('./verify-settings');
    try {
        script.verifyAppSettings(`${distDir}/app/appsettings.Production.json`);
    } catch (e) {
        console.error('App settings are invalid!');
        console.error(e);
        process.exit(1);
    }
}

function pushContainers() {
    console.info('Pushing Docker Compose containers...');
    const dcOptions = `--file ${deployDir}/docker-compose.yml --project-name futbol`;

    console.debug('Removing previous containers...');
    $.exec(`docker-compose ${dcOptions} rm -f`);

    console.debug('Building containers...');
    $.cp(`${deployDir}/Dockerfile`, distDir);
    $.exec(`docker-compose ${dcOptions} build --force-rm --no-cache`);

    console.debug('Pushing new containers...');
    $.exec(`docker-compose ${dcOptions} up -d`);
}

function publishGithubPages() {
    $.cd(`${deployDir}/../src/ClientApp/`);
    $.exec(`node build-gh-pages.js`);
}

verifySettings();
tryReadAppSettings();
pushContainers();
// publishGithubPages();