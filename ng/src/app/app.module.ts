import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { FooService } from './services/foo.service';
import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { HomeComponent } from './components/home/home.component';
import { FoosComponent } from './components/foos/foos.component';
import { AddFooComponent } from './components/foos/add-foo/add-foo.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { WorldCupComponent } from './components/world-cup/world-cup.component';
import { CompetitionService } from './services/competition.service';

const routes: Routes = [
    {path: '', component: HomeComponent},
    {path: '**', component: NotFoundComponent},
];

@NgModule({
    declarations: [
        AppComponent,
        HomeComponent,
        NavbarComponent,
        WorldCupComponent,
        FoosComponent,
        AddFooComponent,
        NotFoundComponent,
    ],
    imports: [
        CommonModule,
        BrowserModule,
        HttpClientModule,
        ReactiveFormsModule,
        FormsModule,
        RouterModule.forRoot(routes),
        NgbModule.forRoot(),
    ],
    providers: [
        FooService,
        CompetitionService,
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
