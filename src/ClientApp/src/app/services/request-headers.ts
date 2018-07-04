import { HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';

export const headers = new HttpHeaders({
    'X-Auth-Token': environment.apiKey
});
