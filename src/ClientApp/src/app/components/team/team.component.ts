import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TeamService } from '../../services/team.service';
import { Team } from '../../models/team';

@Component({
    selector: 'app-team',
    templateUrl: './team.component.html'
})
export class TeamComponent implements OnInit {
    team: Team;

    constructor(
        private _teamService: TeamService,
        private _route: ActivatedRoute
    ) {
    }

    ngOnInit() {
        this._route.paramMap
            .subscribe(p => {
                const teamCode = p.get('teamCode');
                this.getTeam(teamCode);
            });
    }

    private getTeam(code: string) {
        this._teamService
            .getByCode(code)
            .subscribe(
                t => {
                    this.team = t;
                },
                e => {
                    console.error(e);
                }
            );
    }
}
