import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppNotificationService } from './app-notification.service';
import { environment } from '../../environments/environment';

@Injectable()
export class PushSubscriptionService {
    constructor(
        private _notificationService: AppNotificationService,
        private _http: HttpClient
    ) {
    }

    registerEndpoint(subscription: PushSubscription) {
        return this._http
            .post('api/subscriptions', subscription);
    }

    unregisterSubscription(subscription: PushSubscription) {
        return this._http
            .post('api/unsubscribe', subscription);
    }

    async isSubscribed(): Promise<boolean> {
        const sw = navigator['serviceWorker'] as ServiceWorkerContainer;
        if (!(sw)) {
            return false;
        }

        const swReg: ServiceWorkerRegistration = await sw.ready;
        const pushManager: PushManager = swReg['pushManager'];
        if (!pushManager) {
            return false;
        }

        const subscription = await pushManager.getSubscription();
        return !!subscription;
    }

    async trySubscribe(): Promise<any> {
        if (!this._notificationService.isNotificationPermissionGranted()) {
            throw new Error('Notifications are not permitted.');
        }

        const sw = navigator['serviceWorker'] as ServiceWorkerContainer;
        if (!(sw)) {
            throw new Error('Service Worker is not supported in your browser.');
        }

        const swReg: ServiceWorkerRegistration = await sw.ready;

        const pushManager: PushManager = swReg['pushManager'];
        if (!pushManager) {
            throw new Error('Push notifications are not supported in your browser.');
        }

        let subscription = await pushManager.getSubscription();
        if (subscription) {
            return subscription;
        }

        const opts = {
            userVisibleOnly: true,
            applicationServerKey: urlBase64ToUint8Array2(environment.vapid)
        };
        try {
            subscription = await pushManager.subscribe(opts);
        } catch (e) {
            throw new Error('Unable to subscribe to push notifications. ' + e);
        }

        const subscriptionObject = JSON.parse(JSON.stringify(subscription));

        console.warn(subscriptionObject); // ToDo

        try {
            await this.registerEndpoint(subscription).toPromise();
        } catch (e) {
            throw new Error('Unable to send subscription info to the backend.' + e);
        }

        return subscription;
    }

    async tryUnsubscribe(): Promise<void> {
        const sw = navigator['serviceWorker'] as ServiceWorkerContainer;
        if (!(sw)) {
            throw new Error('Service Worker is not supported in your browser.');
        }

        const swReg: ServiceWorkerRegistration = await sw.ready;

        const pushManager: PushManager = swReg['pushManager'];
        if (!pushManager) {
            throw new Error('Push notifications are not supported in your browser.');
        }

        const subscription = await pushManager.getSubscription();
        if (!subscription) {
            return;
        }

        try {
            await subscription.unsubscribe();
        } catch (e) {
            throw new Error('Unable to unsubscribe.' + e);
        }

        const subscriptionObject = JSON.parse(JSON.stringify(subscription));
        try {
            await this.unregisterSubscription(subscriptionObject).toPromise();
        } catch (e) {
            throw new Error('Unable to unregister subscription on the backend.' + e);
        }
    }
}


function urlBase64ToUint8Array2(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
        .replace(/\-/g, '+')
        .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}
