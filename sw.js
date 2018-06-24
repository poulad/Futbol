console.log(self.registration);

self.addEventListener('install', function (event) {
    // Perform install steps
    console.log('installing sw...');
});

self.registration.showNotification('Hello from service worker', {
    tag: 'sw',
    body: 'at ' + new Date()
});
