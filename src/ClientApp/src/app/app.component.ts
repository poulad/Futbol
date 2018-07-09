import { Component, OnInit } from '@angular/core';
import { AppNotificationService } from './services/app-notification.service';
import { PushSubscriptionService } from './services/push-subscription.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
    alerts: string[] = [];

    constructor(
        private _pushSubService: PushSubscriptionService,
        private _regService: AppNotificationService
    ) {
        this.detectFeatures();
    }

    ngOnInit() {
    }

    public closeAlert(alert) {
        const index: number = this.alerts.indexOf(alert);
        this.alerts.splice(index, 1);
    }

    private async detectFeatures() {
        if (!this._regService.isNotificationSupported()) {
            this.alerts.push('Notification API is not supported in your current browser.');
        }

        if (!this._regService.isServiceWorkerSupported()) {
            this.alerts.push('Service Worker is not supported in your current browser.');
        }
    }
}
