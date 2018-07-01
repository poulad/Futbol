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
            body: body
        })
    );
});

if (sw.Notification.permission === 'granted') {
    sw.registration.showNotification('Hello from service worker', {
        tag: 'sw',
        body: 'at ' + new Date()
    });
}
