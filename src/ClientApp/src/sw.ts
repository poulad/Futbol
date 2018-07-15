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
    const toLog = JSON.stringify(evt);
    console.warn('Clicked');
    console.warn(toLog);

    const notif: Notification = evt.notification;
    notif.close();
    const action: string = notif['action'];
    const baseUrl = evt.target.location.href.replace(/\/sw.js$/, '');

    if (notif.tag === 'TEAMS') {
        let url = `${baseUrl}/teams`;

        if (action && action.substring(0, 5) === 'TEAM:') {
            const teamName = action.substr(5).toLowerCase();
            url += `/${teamName}`;
        }

        evt.waitUntil(
            this.clients.openWindow(url + `#e=${JSON.stringify(evt)}`)
        );
    }
});

sw.addEventListener('install', e => {
    console.log('Installing service worker');
});

sw.addEventListener('activate', e => {
    console.log('Activating service worker');
});
