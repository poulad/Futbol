import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable()
export class BaseApiUrlInterceptor implements HttpInterceptor {
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const baseUrl = environment.baseApiUrl;
        if (baseUrl && baseUrl.length) {
            req = req.clone({
                url: baseUrl + req.url
            });
        }
        return next.handle(req);
    }
}
