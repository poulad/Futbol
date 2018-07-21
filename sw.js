var _this = this;
var sw = self;
sw.importScripts('ngsw-worker.js');
sw.addEventListener('push', function (evt) {
    var pushNotif = evt.data.json();
    if (!(pushNotif.title && pushNotif.options)) {
        console.warn('Unsupported notification received');
        evt.waitUntil(sw.registration.showNotification('Push Notification', {
            data: pushNotif
        }));
        return;
    }
    evt.waitUntil(sw.registration.showNotification(pushNotif.title, pushNotif.options));
});
sw.addEventListener('notificationclick', function (evt) {
    evt.notification.close();
    var notif = evt.notification;
    var action = evt.action;
    var baseUrl = evt.target.location.href.replace(/\/sw.js$/, '');
    if (notif.tag === 'TEAMS') {
        var url = baseUrl + "/teams";
        if (action && action.substring(0, 5) === 'TEAM:') {
            var teamName = action.substr(5).toLowerCase();
            url += "/" + teamName;
        }
        evt.waitUntil(_this.clients.openWindow(url));
    }
});
sw.addEventListener('install', function (e) {
    console.log('Installing service worker');
});
sw.addEventListener('activate', function (e) {
    console.log('Activating service worker');
});
