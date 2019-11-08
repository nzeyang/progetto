import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { PW1FormData } from '../pw1-form-data';
import { RestService } from '../rest.service';
import { Dati } from '../dati';
import { prepareEventListenerParameters } from '@angular/compiler/src/render3/view/template';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit {
  iDescription_MaxLength: number = 100;

  PW1_data: PW1FormData = new PW1FormData;

  PW1_form = this.fb.group({
    description:['', [(val:any) => { return this.validateDescription(val.value) } ]],
    detail:[''],
    date:['', [(val:any) => { return this.validateDate() }]],
    time:['', [(val:any) => { return this.validateDate() }]],
    worker:['', [(val:any) => { return this.validateWorker(val.value) }]],
    price:['',[(val:any) => { return this.validatePrice(val.value) }]]
  })

  constructor(private fb:FormBuilder, private rest:RestService) { }

  ngOnInit() {
  }

  validateDescription(value: string){ 

    if (value.length > 0)
    {
      return null;
    } else {
      return {'error': 'la descrizione è necessaria.'};
    }
  }
  validateDate(){

    if (this.PW1_form)
    {
      this.PW1_data.date = this.PW1_form.get('date').value+'T'+this.PW1_form.get('time').value;

      if ( (new Date(this.PW1_data.date)) > (new Date()))
      {
        this.PW1_form.get('date').setErrors(null);
        this.PW1_form.get('time').setErrors(null);

        return null;
      } else {
        return {'error': 'la data è necessaria.'};
      }
    }else
    {
      return {'error': 'la data è necessaria.'};
    }
  }
  validateWorker(value: string){
    var i: number;
    var aWorkers: any[] = this.rest.getList();

    for (i = 0; i < aWorkers.length; i++)
    {
      if (aWorkers[i][0] == value)
      {
        this.PW1_data.worker_id = aWorkers[i][1];
        return null;
      }
    }

    return {'error': 'il manutentore è necessario.'};
  }
  validatePrice(value: any){
    var bIsValid: boolean;
    var i: number;
    var iCountDecChar: number = 0;
    var iCountNums: number = 0;
    var sDecimalChar: string = (1.1).toLocaleString();
    sDecimalChar = sDecimalChar.substring(1, sDecimalChar.length-1);

    if (value.length > 0)
    {
      bIsValid = true;
      for (i = 0; bIsValid && (i < value.length); i++)
      {
        if (isNaN(value[i]))
        {
          if (value[i] == '-')
          {
            if ( i > 0 )
            {
              bIsValid = false;
            }
          }else if (value[i] == sDecimalChar)
          {
            if ((iCountDecChar > 0) || (iCountNums <= 0))
            {
              bIsValid = false;
            }else {
              iCountDecChar += 1;
            }
          }else
          {
            bIsValid = false;
          }
        }else
        {
          iCountNums += 1;
        }
      }
    } else {
      bIsValid = false;
    }

    if (iCountNums <= 0)
    {
      bIsValid = false;
    }

    if (bIsValid)
    {
      return null;
    } else {
      return {'error': 'il prezzo è necessario.'};
    }
  }



  invia(){
    this.rest.invia(this.PW1_data);
    /*
    var dati = new Dati()
    dati.descrizione=
    var dettaglio =
    dettaglio.descriptionng
    this.rest.invia(dati)
    */
  }
}
