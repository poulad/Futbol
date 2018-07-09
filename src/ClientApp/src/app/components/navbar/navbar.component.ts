import { Component, OnInit } from '@angular/core';
import { AppNotificationService } from '../../services/app-notification.service';
import { PushSubscriptionService } from '../../services/push-subscription.service';

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html'
})
export class NavbarComponent implements OnInit {
    isSubscribedForNotifications: boolean;
    isChangingNotificationState = false;
    isMenuCollapsed = true;

    constructor(
        private _pushSubService: PushSubscriptionService,
        private _notifService: AppNotificationService
    ) {
    }

    ngOnInit() {
        this.checkForSubscription()
            .catch(console.warn);
    }

    async enableNotifications() {
        this.isChangingNotificationState = true;

        const isPermissionGranted = await this._notifService
            .requestNotificationPermission();

        if (!isPermissionGranted) {
            this.isChangingNotificationState = false;
            return;
        }

        try {
            await this._pushSubService.trySubscribe();
            this.isSubscribedForNotifications = true;
        } catch (e) {
            this.isSubscribedForNotifications = false;
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
        this.isSubscribedForNotifications = false;
        this.isChangingNotificationState = false;
    }

    private async checkForSubscription() {
        this.isChangingNotificationState = true;

        const permissionGranted = this._notifService.isNotificationPermissionGranted();
        if (!permissionGranted) {
            this.isSubscribedForNotifications = false;
            this.isChangingNotificationState = false;
            return;
        }

        this.isSubscribedForNotifications = await this._pushSubService.isSubscribed();
        this.isChangingNotificationState = false;
    }
}
