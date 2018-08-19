import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';

@Injectable()
export class AppService {
    constructor(private _http: Http) { }

    public GetCityList() {
        return this._http.get("https://servis.mgm.gov.tr/api/merkezler/iller").map(x => x.json());
    }

    public GetDistrictListFromCity(city: string) {
        return this._http.get("https://servis.mgm.gov.tr/api/merkezler/ililcesi?il=" + city).map(x => x.json());
    }
}