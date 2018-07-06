import {AutoCompleteService} from 'ionic2-auto-complete';
import { Http } from '@angular/http';
import {Injectable} from "@angular/core";
import 'rxjs/add/operator/map'

@Injectable()
export class CompleteTestService implements AutoCompleteService {
  labelAttribute = "Brand";

  constructor(private http:Http) {

  }
  getResults(keyword:string) {
    return this.http.get('./assets/data/brands.json')
          .map(
        result =>
        {
          return result.json()
            .filter(item => item.Brand.toLowerCase().startsWith(keyword.toLowerCase()) )
        });
  }
}