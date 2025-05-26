import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
 import { Subscription } from 'rxjs';
import {getConfig } from '../../../JSON/jsonConfigs';


import { DynamicFormPageComponent } from '../dynamic-form-page/dynamic-form-page.component'; // Asegúrate de la ruta correcta


@Component({
  selector: 'app-dynamic-page',
  standalone: true,
  imports: [CommonModule,DynamicFormPageComponent],
  templateUrl: './dynamic-page.component.html',

 })
export class DynamicPageComponent  implements OnInit, OnDestroy   {

  private route = inject(ActivatedRoute);
   private router = inject(Router); // Inyecta el Router si lo necesitas
  private routeSubscription: Subscription | undefined;
  formData: any; // Aquí almacenarás los datos del formulario del JSON
  error: any;
  formGroup: string = ''; // Aquí almacenarás el nombre del formulario
  formName: string = ''; // Aquí almacenarás el nombre del formulario


  ngOnInit(): void {

    this.routeSubscription = this.route.params.subscribe(params => {

      this.formGroup = params['group']; // Obtén el valor del parámetro 'portadillas'
      this.formName = params['name']; // Obtén el valor del parámetro 'portadillas'

      this.formData = getConfig(this.formGroup, this.formName); // Llama a la función para obtener la configuración del JSON

if(this.formData == 404)       this.router.navigate(['/landing']);  // 👈 Ya puedes usar el router aquí


     });
  }

  ngOnDestroy(): void {
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }
  }








}
