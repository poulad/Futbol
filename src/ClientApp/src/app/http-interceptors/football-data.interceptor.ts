import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable()
export class FootballDataInterceptor implements HttpInterceptor {
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (
            req.url.startsWith('https://api.football-data.org') &&
            !req.headers.has('X-Auth-Token')
        ) {
            req = req.clone({
                headers: req.headers.set('X-Auth-Token', environment.apiKey)
            });
        }
        return next.handle(req);
    }
}
