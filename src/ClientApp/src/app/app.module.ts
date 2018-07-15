import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ServiceWorkerModule } from '@angular/service-worker';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { WorldCupComponent } from './components/world-cup/world-cup.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { CompetitionService } from './services/competition.service';
import { AppNotificationService } from './services/app-notification.service';
import { PushSubscriptionService } from './services/push-subscription.service';
import { TeamComponent } from './components/team/team.component';
import { TeamService } from './services/team.service';
import { ListTeamsComponent } from './components/list-teams/list-teams.component';

const routes: Routes = [
    {path: '', component: HomeComponent},
    {path: 'teams', component: ListTeamsComponent},
    {path: 'teams/:teamName', component: TeamComponent},
    {path: '**', component: NotFoundComponent},
];

@NgModule({
    declarations: [
        AppComponent,
        HomeComponent,
        NavbarComponent,
        NotFoundComponent,
        WorldCupComponent,
        ListTeamsComponent,
        TeamComponent,
    ],
    imports: [
        BrowserModule,
        ServiceWorkerModule.register('./sw.js'),
        RouterModule.forRoot(routes),
        HttpClientModule,
        FormsModule,
        NgbModule.forRoot()
    ],
    providers: [
        AppNotificationService,
        PushSubscriptionService,
        CompetitionService,
        TeamService,
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
