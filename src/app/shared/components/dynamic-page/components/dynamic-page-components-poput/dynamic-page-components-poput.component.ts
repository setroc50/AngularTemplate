
import { Component, OnInit, OnDestroy, inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { FormConstructManager } from '../../../forms/form-construct-manager/form-construct-manager.component';




@Component({
  selector: 'app-dynamic-page-components-poput',
   imports: [CommonModule, FormConstructManager, FormConstructManager],
  templateUrl: './dynamic-page-components-poput.component.html',

})
export class DynamicPageComponentsPoput implements OnInit, OnDestroy   {

  @Input() rowData:[] = []  ;
  @Input() operation: string = 'create' ;
  @Input() endpointRoute:string = ""  ;
  @Input() icono:string = ""  ;
  @Input() formConfig: any[] = []  ;



  isVisible = false;


  iconos: { [key: string]: string } = {
    create: 'fa-solid fa-plus',
    edit: 'fa-solid fa-pencil',

    delete: 'fa-solid fa-trash',
    view: 'fa-solid fa-pencil',
  };


  private routeSubscription: Subscription | undefined;

  error: any;

      closeForm(): void {
    this.isVisible = false;
  }
    openForm(): void {
    this.isVisible = true;}

  ngOnInit(): void {  console.log(this.operation)}

  ngOnDestroy(): void {
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }



  }








}




