import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
    ngOnInit() {
        this.requestNotifications();
        this.registerServiceWorker();
    }

    private async requestNotifications() {
        const Notification = window['Notification'];
        if (Notification) {
            const permission = await Notification.requestPermission();
            if (permission === 'granted') {
                const notif = new Notification('Hello, football fan!', {
                    body: 'Welcome at ' + new Date().toLocaleTimeString(),
                    badge: 'favicon.ico',
                    icon: 'favicon.ico',
                    tag: 'startup',
                    timestamp: Date.now(),
                    silent: false,
                    vibrate: [200, 100, 200, 200, 100, 200, 200, 100, 200, 200, 100, 200],
                });
            } else if (permission === 'denied') {
                alert('No notifications?! :(');
            } else if (permission === 'default') {
                alert('Please allow notifications to get the best experience');
            }
        } else {
            alert('Notifications are not supported here');
        }
    }

    private async registerServiceWorker() {
        if (navigator.serviceWorker) {
            const registration = await navigator.serviceWorker.register('sw.js');
            console.log('ServiceWorker registration successful with scope: ', registration.scope);
        }
    }
}
