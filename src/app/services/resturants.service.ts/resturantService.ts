import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http'; 
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable()
export class ResturantService {
    private Url                         = 'https://weboneapp.conveyor.cloud/api/';
    private resUrl                      = this.Url +'Branches';
    private searchUrl                   = this.Url +'Search';
    constructor(private _http: HttpClient){}
    getResturants(code: string){
        console.log('getting resturant ...');
        return this._http.get<any>(this.resUrl + '?code=' + code);
    }
    
    getAllResturantsNearMe(lat: string, lon: string){ 
        console.log('getting resturants ...');
        return this._http.get<any>(this.resUrl + '?userLocation=' + lon + ',' + lat + "&distance=" + 30);
    }

    serach(searchStr: string){  
        console.log('getting resturants ...');
        return this._http.get<any>(this.searchUrl + '?searchStr=' + searchStr);
    }
}