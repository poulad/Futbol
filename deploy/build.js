const $ = require('shelljs')
const path = require('path')
require('./logging')

$.config.fatal = true
const root = path.join(__dirname, '..')
const distDir = path.join(root, 'dist')


function clear() {
    console.info('Clearing dist directory...')
    $.rm('-rf', distDir)
    $.mkdir('-p', `${distDir}/app/ClientApp`)
}

function buildAspNetCoreApp() {
    console.info('Building ASP.NET Core app...')

    console.debug('Publishing project...')
    $.exec(
        `docker run --rm ` +
        `--volume "${root}/src/:/src" --volume "${root}/dist/app:/app" --workdir /src/Futbol.Web/ ` +
        `microsoft/dotnet:2.1-sdk ` +
        `dotnet publish --configuration Release --output /app/`
    )
}

function buildAngularApp() {
    console.info('Building Angular app...')

    const outputPath = `${distDir}/app/ClientApp`
    $.cd(`${root}/src/ClientApp/`)

    console.debug('Restoring Angular dependencies...')
    $.exec('npm install')

    const baseHref =  process.env['APP_BASE_HREF'] || '/Futbol/';

    console.debug(`Publishing Angular app using base href "${baseHref}" ...`)
    $.exec(`npm run build -- --prod --extract-css --base-href "${baseHref}" --output-path "${outputPath}"`)

    console.debug('Building service worker...')
    $.cd(`${root}/src/ClientApp`)
    $.exec(`node node_modules/typescript/bin/tsc --project "${root}/src/ClientApp/src/tsconfig.sw.json" --outDir "${outputPath}"`)

    console.debug('Removing unused service worker files...')
    $.rm(`${outputPath}/safety-worker.js`)
}


clear()
buildAspNetCoreApp()
buildAngularApp()
console.info(`Build succeeded: "${path.join(distDir, 'app')}"`)