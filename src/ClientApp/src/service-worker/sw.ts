const sw = <any>self;

sw.addEventListener('push', e => {
    let body;

    if (e.data) {
        body = e.data.text();
    } else {
        body = 'Push message - no payload';
    }

    e.waitUntil(
        sw.registration.showNotification('Push Notification', {
            body: body,
            tag: 'push',
            actions: [
                {action: 'like', title: '👍Like'},
                {action: 'reply', title: '⤻ Reply'}
            ]
        })
    );
});

sw.addEventListener('install', e => {
    console.log('Installing service worker');
});

sw.addEventListener('activate', e => {
    console.log('Activating service worker');
});
