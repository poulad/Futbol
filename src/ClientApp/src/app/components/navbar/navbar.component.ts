import { Component, OnInit } from '@angular/core';
import { AppNotificationService } from '../../services/app-notification.service';
import { PushSubscriptionService } from '../../services/push-subscription.service';

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html'
})
export class NavbarComponent implements OnInit {
    isNotificationGranted: boolean;
    isChangingNotificationState = false;
    isMenuCollapsed = true;

    constructor(
        private _pushSubService: PushSubscriptionService,
        private _notifService: AppNotificationService
    ) {
    }

    ngOnInit() {
        this.isNotificationGranted = this._notifService
            .isNotificationPermissionGranted();
    }

    async enableNotifications() {
        this.isChangingNotificationState = true;

        this.isNotificationGranted = await this._notifService
            .requestNotificationPermission();

        if (!this.isNotificationGranted) {
            this.isChangingNotificationState = false;
            return;
        }

        try {
            await this._pushSubService.trySubscribe();
        } catch (e) {
            console.warn(e);
        }
        this.isChangingNotificationState = false;
    }

    async disableNotifications() {
        this.isChangingNotificationState = true;

        try {
            await this._pushSubService.tryUnsubscribe();
        } catch (e) {
            console.warn(e);
        }
        this.isNotificationGranted = false;
        this.isChangingNotificationState = false;
    }
}
