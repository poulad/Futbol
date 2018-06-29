import { Component, OnInit } from '@angular/core';
import { RegistrationService } from '../../services/registration.service';
import { b } from '@angular/core/src/render3';

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styles: []
})
export class NavbarComponent implements OnInit {
    areNotifsGranted: boolean;

    constructor(private _regService: RegistrationService) {
    }

    ngOnInit() {
        this.getNotificationStatus()
            .then(status => {
                this.areNotifsGranted = status;
            });
    }

    private async getNotificationStatus(): Promise<boolean> {
        return this._regService
                .isNotificationPermissionGranted()
            &&
            (await this._regService.isPushSubscribed())
            ;
    }

    async enableNotifications() {
        this.areNotifsGranted = await this._regService
            .requestNotificationPermission();

        if (this.areNotifsGranted) {
            await this._regService
                .trySubscribePushNotifications();
        }
    }

    disableNotifications() {
        this.areNotifsGranted = false;
    }
}
