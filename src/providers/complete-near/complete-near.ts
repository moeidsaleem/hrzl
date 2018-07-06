import {AutoCompleteService} from 'ionic2-auto-complete';
import { Http } from '@angular/http';
import {Injectable} from "@angular/core";
import 'rxjs/add/operator/map'

@Injectable()
export class CompleteNearService implements AutoCompleteService {
  labelAttribute = "Near";

  constructor(private http:Http) {

  }
  getResults(keyword:string) {
    return this.http.get('./assets/data/near.json')
          .map(
        result =>
        {
          return result.json()
            .filter(item => item.Near.toLowerCase().startsWith(keyword.toLowerCase()) )
        });
  }
}