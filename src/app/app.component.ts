import { Component } from '@angular/core';
import { RegistrationService } from './services/registration.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html'
})
export class AppComponent {
    alerts: string[] = [];

    constructor(private _regService: RegistrationService) {
        this.detectFeatures();
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
