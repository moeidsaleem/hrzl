import {AutoCompleteService} from 'ionic2-auto-complete';
import { Http } from '@angular/http';
import {Injectable} from "@angular/core";
import 'rxjs/add/operator/map'

@Injectable()
export class CompleteLocationService implements AutoCompleteService {
  labelAttribute = "location";

  constructor(private http:Http) {

  }
  getResults(keyword:string) {
    return this.http.get('./assets/data/location.json')
          .map(
        result =>
        {
          return result.json()
            .filter(item => item.location.toLowerCase().startsWith(keyword.toLowerCase()) )
        });
  }
}