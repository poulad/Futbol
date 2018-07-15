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

function handleTeamsNotification(evt) {
    const notif: Notification = evt.notification;
    const action: string = notif['action'];
    if (action && action.startsWith('TEAM:')) {

    }

    const baseUrl = evt.target.location.href.replace(/\/sw.js$/, '');
    evt.waitUntil(
        this.clients.openWindow(`${baseUrl}/teams/brazil`)
    );
}

sw.addEventListener('notificationclick', evt => {
    const notif: Notification = evt.notification;
    notif.close();
    const baseUrl = evt.target.location.href.replace(/\/sw.js$/, '');

    const action: string = notif['action'];
    if (notif.tag === 'TEAMS') {
        let url = `${baseUrl}/teams`;

        if (action && action.startsWith('TEAM:')) {
            const teamName = action.substr('TEAM:'.length).toLowerCase();
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
