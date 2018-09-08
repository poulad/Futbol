const $ = require('shelljs');
const fs = require('fs');
require('./logging');

const deployDir = __dirname;

exports.verifyDistDirectory = function () {
    const path = `${deployDir}/../dist`;
    if (!$.test('-d', path)) {
        throw `Distributions directory does not exist: "${path}"`;
    }
}

exports.verify_heroku_app = function () {
    const app_name = process.env['HEROKU_APP'];
    if (!(app_name && app_name.length)) {
        throw `Heroku app name is not set.:\n` +
            `\tHEROKU_APP='my-app'`;
    }
    return app_name;
}

exports.verifyDockerSettings = function () {
    const dockerSettingsValue = process.env['DOCKER_SETTINGS_JSON'];
    if (!(dockerSettingsValue && dockerSettingsValue.length)) {
        console.warn(
            `Docker settings is not set. Skipping this check.\n` +
            `\tDOCKER_SETTINGS_JSON='{"host":"my-hostname.org:2376","ca":"","cert":"","key":""}'`
        );
        return;
    }
    let dockerSettings;
    try {
        dockerSettings = JSON.parse(dockerSettingsValue)
    } catch (e) {
        throw `Docker settings is not valid JSON. Valid format is:\n` +
            `\tDOCKER_SETTINGS_JSON='{"host":"my-hostname.org:2376","ca":"","cert":"","key":""}'`;
    }
    if (!(
            dockerSettings.host && dockerSettings.host.length &&
            dockerSettings.ca && dockerSettings.ca.length &&
            dockerSettings.cert && dockerSettings.ca.length &&
            dockerSettings.key && dockerSettings.key.length
        )) {
        throw `Docker settings is not valid JSON. Valid format is:\n` +
            `\tDOCKER_SETTINGS_JSON='{"host":"my-hostname.org:2376","ca":"","cert":"","key":""}'`;
    }

    const dockerCertsDir = $.tempdir();
    fs.writeFileSync(`${dockerCertsDir}/ca.pem`, dockerSettings.ca);
    fs.writeFileSync(`${dockerCertsDir}/cert.pem`, dockerSettings.cert);
    fs.writeFileSync(`${dockerCertsDir}/key.pem`, dockerSettings.key);

    process.env['DOCKER_HOST'] = dockerSettings.host;
    process.env['DOCKER_TLS_VERIFY'] = 1;
    process.env['DOCKER_CERT_PATH'] = dockerCertsDir;
}

exports.verifyDockerConnection = function () {
    if ($.exec(`docker version --format '{{.Server.Version}}'`).code !== 0) {
        throw 'Failed to connect to remote Docker daemon.';
    }
}

exports.verifyDockerCompose = function () {
    const filePath = `${deployDir}/docker-compose.yml`;
    if (!$.test('-f', filePath)) {
        throw `Docker Compose file does not exist: "${filePath}"`;
    }
    if ($.exec('docker-compose version').code !== 0) {
        throw 'Docker Compose not found.';
    }
    if ($.exec(`docker-compose --file ${filePath} config --quiet`).code !== 0) {
        throw `"${filePath}" is invalid.`;
    }
}

exports.verifyAppSettings = function (settingsFile) {
    const appSettingsValue = process.env['APP_SETTINGS_JSON'];
    if (!(appSettingsValue && appSettingsValue.length)) {
        throw `App settings environment variable is not set.\n\tAPP_SETTINGS_JSON='{}'`;
    }
    let appSettings;
    try {
        appSettings = JSON.parse(appSettingsValue)
    } catch (e) {
        throw `App settings is not valid JSON.`;
    }

    fs.writeFileSync(settingsFile, JSON.stringify(appSettings));

    return appSettings;
}