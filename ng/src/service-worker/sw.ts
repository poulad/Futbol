const sw = <any>self;

console.log(sw.registration);

sw.addEventListener('install', function (event) {
    // Perform install steps
    console.log('installing sw...');
});

sw.registration.showNotification('Hello from service worker', {
    tag: 'sw',
    body: 'at ' + new Date()
});
