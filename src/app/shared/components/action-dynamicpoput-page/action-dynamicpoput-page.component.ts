
import { Component, OnInit, OnDestroy, inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import {getConfig } from '../../../JSON/jsonConfigs';


import { DynamicFormSecondarypageComponent } from '../dynamic-form-secondpage/dynamic-form-secondpage.component';
import { FormInputManagerComponent } from '../forms/form-input-manager/form-input-manager.component';
import { AdminMainApiv1FormComponent } from '../../../pages/admin-main-apiv1-form/admin-main-apiv1-form.component';



@Component({
  selector: 'app-dynamicpoput-page',
  standalone: true,
  imports: [CommonModule, DynamicFormSecondarypageComponent,FormInputManagerComponent,AdminMainApiv1FormComponent ],
  templateUrl: './action-dynamicpoput-page.component.html',

})
export class ActionDynamicpoputComponent  implements OnInit, OnDestroy   {

    @Input() operation: 'create' | 'edit' | 'delete' = 'create';

    @Input() layoutGroup:string = ''  ;
    @Input() layoutName:string = ''  ;
     @Input() rowData:[] = []  ;



  isVisible = false;


  iconos: { [key: string]: string } = {
    create: 'fa-solid fa-plus',
    edit: 'fa-solid fa-pencil',

    delete: 'fa-solid fa-trash',
    view: 'fa-solid fa-pencil',
  };


  private routeSubscription: Subscription | undefined;
  formData: any; // Aquí almacenarás los datos del formulario del JSON
  error: any;
  formGroup: string = ''; // Aquí almacenarás el nombre del formulario
  formName: string = ''; // Aquí almacenarás el nombre del formulario

      closeForm(): void {
    this.isVisible = false;
  }
    openForm(): void {
    this.isVisible = true;}

  ngOnInit(): void {

      console.log(this.rowData,'Datos en el componente')

      this.formGroup = this.layoutGroup; // Obtén el valor del parámetro 'portadillas'
      this.formName =  this.layoutName; // Obtén el valor del parámetro 'portadillas'
      console.log(this.formGroup, this.formName,"GET")
      this.formData = getConfig(this.formGroup, this.formName); // Llama a la función para obtener la configuración del JSON




  }

  ngOnDestroy(): void {
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }



  }








}




