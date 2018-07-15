import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TeamService } from '../../services/team.service';
import { Team } from '../../models/team';

type ComponentState = 'loading' | 'loaded' | 'failed';

@Component({
    selector: 'app-teams',
    templateUrl: './team.component.html'
})
export class TeamComponent implements OnInit {
    team: Team;
    state: ComponentState;
    error: string;

    constructor(
        private _teamService: TeamService,
        private _route: ActivatedRoute
    ) {
    }

    ngOnInit() {
        this._route.paramMap
            .subscribe(p => {
                const teamName = p.get('teamName');
                this.getTeam(teamName);
            });
    }

    private async getTeam(name: string) {
        this.state = 'loading';

        let teamId: string;
        try {
            teamId = await this._teamService.findTeamId(name).toPromise();
        } catch (e) {
            this.error = e.toString();
            this.state = 'failed';
            return;
        }

        try {
            this.team = await this._teamService.getById(teamId).toPromise();
        } catch (e) {
            this.error = e.toString();
            this.state = 'failed';
            return;
        }

        this.state = 'loaded';
    }
}
