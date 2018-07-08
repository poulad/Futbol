const sw = <any>self;

export interface PushNotification {
    title: string;
    options: NotificationOptions;
}

sw.addEventListener('push', evt => {
    const pushNotif = evt.data.json();
    console.log('Received push message: ' + JSON.stringify(pushNotif));
    if (!(pushNotif.title && pushNotif.options)) {
        console.warn('Unsupported notification received');
        evt.waitUntil(
            sw.registration.showNotification('Push Notification', {
                data: pushNotif
            })
        );
        return;
    }

    evt.waitUntil(
        sw.registration.showNotification(pushNotif.title, pushNotif.options)
    );
});

sw.addEventListener('notificationclick', evt => {
    console.log('Notification is clicked');
    console.log(evt);
    console.log(evt.notification);

    const notif: Notification = evt.notification;
    if (notif.tag === 'TEAMS') {
        notif.close();
    }

    evt.waitUntil(
        this.clients.openWindow(`${evt.target.location.origin}/teams/a`)
    );
});

sw.addEventListener('install', e => {
    console.log('Installing service worker');
});

sw.addEventListener('activate', e => {
    console.log('Activating service worker');
});
