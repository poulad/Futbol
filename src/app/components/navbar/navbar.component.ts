import { Component, OnInit } from '@angular/core';
import { RegistrationService } from '../../services/registration.service';

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styles: []
})
export class NavbarComponent implements OnInit {
    areNotificationsGranted: boolean;

    collapse = true;

    constructor(private _regService: RegistrationService) {
    }

    ngOnInit() {
        this.getNotificationStatus()
            .then(status => {
                this.areNotificationsGranted = status;
            });
    }

    async enableNotifications() {
        this.areNotificationsGranted = await this._regService
            .requestNotificationPermission();

        if (this.areNotificationsGranted) {
            await this._regService
                .trySubscribePushNotifications();
        }
    }

    disableNotifications() {
        this.areNotificationsGranted = false;
    }

    private async getNotificationStatus(): Promise<boolean> {
        return this._regService
                .isNotificationPermissionGranted()
            &&
            (await this._regService.isPushSubscribed())
            ;
    }
}
