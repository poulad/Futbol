import { Injectable } from '@angular/core';

@Injectable()
export class AppNotificationService {
    isNotificationSupported(): boolean {
        return window['Notification'] && true;
    }

    isServiceWorkerSupported(): boolean {
        return navigator['serviceWorker'] && true;
    }

    isNotificationPermissionGranted(): boolean {
        if (!this.isNotificationSupported()) {
            return false;
        }
        return window['Notification'].permission === 'granted';
    }

    async isPushSubscribed(): Promise<boolean> {
        if (!('serviceWorker' in navigator)) {
            return false;
        }
        const swReg = await navigator.serviceWorker.getRegistration();
        if (!swReg) {
            return false;
        }
        const subscription = await swReg.pushManager.getSubscription();
        return subscription && true;
    }

    async requestNotificationPermission(): Promise<boolean> {
        const Notification = window['Notification'];
        if (!Notification) {
            alert('Your browser does not support notifications');
            return false;
        }

        const status = await Notification.requestPermission();
        if (status === 'granted') {
            return true;
        } else {
            alert('Please allow the app to send notifications.');
            return false;
        }
    }
}
