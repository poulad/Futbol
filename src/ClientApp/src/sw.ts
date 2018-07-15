const sw = <any>self;
sw.importScripts('ngsw-worker.js');

export interface PushNotification {
    title: string;
    options: NotificationOptions;
}

sw.addEventListener('push', evt => {
    const pushNotif = evt.data.json();
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
    evt.notification.close();

    const notif: Notification = evt.notification;
    const action: string = evt.action;
    const baseUrl = evt.target.location.href.replace(/\/sw.js$/, '');

    if (notif.tag === 'TEAMS') {
        let url = `${baseUrl}/teams`;

        if (action && action.substring(0, 5) === 'TEAM:') {
            const teamName = action.substr(5).toLowerCase();
            url += `/${teamName}`;
        }

        evt.waitUntil(
            this.clients.openWindow(url)
        );
    }
});

sw.addEventListener('install', e => {
    console.log('Installing service worker');
});

sw.addEventListener('activate', e => {
    console.log('Activating service worker');
});
