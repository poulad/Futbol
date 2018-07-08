import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { headers } from './request-headers';
import { Team } from '../models/team';
// import 'rxjs/observable/of';
// import { Observable } from 'rxjs';

@Injectable()
export class TeamService {
    private teams: Team[];

    constructor(
        private _http: HttpClient
    ) {
    }

    getByCode(teamCode: string) {
        return this._http
            .get<Team>(
                'https://api.football-data.org/v1/teams/764',
                {headers: headers}
            );
    }

    // getAllTeams() {
    //     if (this.teams && this.teams.length) {
    //         return Observable.of([this.teams]);
    //     } else {
    //         return this._http
    //             .get<Competition>(
    //                 'https://api.football-data.org/v1/competitions/467/teams',
    //                 {headers: headers}
    //             );
    //     }
    // }
}
