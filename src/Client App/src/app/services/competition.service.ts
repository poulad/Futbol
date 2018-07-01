import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Competition } from '../models/competition';
import { headers } from './request-headers';

@Injectable()
export class CompetitionService {
    constructor(
        private _http: HttpClient
    ) {
    }

    getWorldCupCompetition() {
        return this._http
            .get<Competition>(
                'https://api.football-data.org/v1/competitions/467',
                {headers: headers}
            );
    }
}
