import { Component, OnInit } from '@angular/core';
import { CompetitionService } from '../../services/competition.service';
import { Competition } from '../../models/competition';

@Component({
    selector: 'app-world-cup',
    templateUrl: './world-cup.component.html'
})
export class WorldCupComponent implements OnInit {
    competition: Competition;

    constructor(
        private _competitionService: CompetitionService
    ) {
    }

    public ngOnInit() {
        this.getCompetitionInfo();
    }

    private getCompetitionInfo() {
        this._competitionService
            .getWorldCupCompetition()
            .subscribe(
                competition => {
                    this.competition = competition;
                },
                e => {
                    console.warn(e);
                }
            );
    }
}
