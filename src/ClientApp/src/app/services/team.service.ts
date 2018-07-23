import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Team } from '../models/team';
import { Observable, of } from 'rxjs';
import { map, tap } from 'rxjs/operators';

@Injectable()
export class TeamService {
    private _allTeamsResponse: any;

    constructor(
        private _http: HttpClient
    ) {
    }

    getById(id: string) {
        return this._http
            .get<Team>(`https://api.football-data.org/v2/teams/${id}`);
    }

    getAll(): Observable<Team[]> {
        if (this._allTeamsResponse) {
            return of(this._allTeamsResponse.teams);
        }

        return this._http
            .get<any>('https://api.football-data.org/v2/competitions/2000/teams')
            .pipe(
                tap(resp => {
                    this._allTeamsResponse = resp;
                }),
                map(resp => <Team[]>resp.teams),
            );
    }

    findTeamId(name: string): Observable<string> {
        return this.getAll()
            .pipe(
                map(_ =>
                    this._allTeamsResponse
                        .teams
                        .filter(t => t.name.toLowerCase() === name.toLowerCase())
                        [0]
                        .id
                )
            );
    }
}
