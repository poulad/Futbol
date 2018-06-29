const $ = require('shelljs');

$.config.fatal = true;
const rootDir = __dirname;

{
    console.log('# Build ng app');
    $.cd(rootDir);
    $.exec('npm run "build:prod"')
}

{
    console.log('# Build service worker');
    $.cd(rootDir + '/src/service-worker/');
    $.exec('tsc')
}

{
    console.log('# Combine service worker files');
    $.cd(rootDir + '/dist/futbol');
    $.cat('ngsw-worker.js', 'sw.js').to('sw.js');
    $.rm('ngsw-worker.js', 'safety-worker.js')
}
