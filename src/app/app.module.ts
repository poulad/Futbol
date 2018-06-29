import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { HomeComponent } from './components/home/home.component';
import { WorldCupComponent } from './components/world-cup/world-cup.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';
import { CompetitionService } from './services/competition.service';
import { RegistrationService } from './services/registration.service';
import { FormsModule } from '@angular/forms';

const routes: Routes = [
    {path: '', component: HomeComponent},
    {path: '**', component: NotFoundComponent},
];

@NgModule({
    declarations: [
        AppComponent,
        HomeComponent,
        WorldCupComponent,
        NavbarComponent,
        NotFoundComponent
    ],
    imports: [
        BrowserModule,
        ServiceWorkerModule.register('/Futbol/sw.js', {enabled: environment.production}),
        RouterModule.forRoot(routes),
        HttpClientModule,
        FormsModule,
    ],
    providers: [
        RegistrationService,
        CompetitionService,
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
