import { Component, OnInit } from '@angular/core';
import { TeamService } from '../../services/team.service';
import { Team } from '../../models/team';

type ComponentState = 'loading' | 'loaded' | 'failed';

@Component({
    selector: 'app-list-teams',
    templateUrl: './list-teams.component.html'
})
export class ListTeamsComponent implements OnInit {
    teams: Team[];
    state: ComponentState;
    error: string;

    constructor(
        private _teamService: TeamService
    ) {
    }

    ngOnInit() {
        this.getTeams();
    }

    private getTeams() {
        this.state = 'loading';
        this._teamService
            .getAll()
            .subscribe(
                teams => {
                    this.teams = teams;
                    this.state = 'loaded';
                },
                e => {
                    this.error = e.toString();
                    this.state = 'failed';
                }
            );
    }
}
