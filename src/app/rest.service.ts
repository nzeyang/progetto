import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http'
import { Dati } from './dati';
import { PW1FormData } from './pw1-form-data';

@Injectable({
  providedIn: 'root'
})
export class RestService {

  list: any[];

  constructor(private http: HttpClient) { }
  
  getList(): any[]{
    if ((this.list == null) || (this.list == undefined))
    {
      this.list = [];
      this.http.get<string[]>('https://reqres.in/api/users?per_page=100').subscribe(
        (response: any) => {
          for (var itm of response.data)
          {
            this.list.push([itm.last_name+', '+itm.first_name, itm.id]);
          }
        }
      );    
    }
    return this.list;
  }

  invia(dati: PW1FormData){
    console.log(dati);
    this.http.post('https://reqres.in/api/users', dati).subscribe(
      (response: any) => {
        console.log(response);
      }
    ); 

  }
}