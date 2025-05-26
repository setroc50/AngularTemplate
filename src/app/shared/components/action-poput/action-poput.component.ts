import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { getConfig } from '../../../JSON/jsonConfigs';
 import { Subscription } from 'rxjs';


@Component({
  selector: 'app-action-poput',
  imports: [CommonModule],
  templateUrl: './action-poput.component.html',
  styleUrl: './action-poput.component.css'
})
export class ActionPoputComponent {
  @Input() operation: 'create' | 'edit' | 'delete' = 'create';
  @Input() group:string = "";
  @Input() name:string = "";

    iconos: { [key: string]: string } = {
    create: 'fa-solid fa-plus',
    edit: 'fa-solid fa-pencil',

    delete: 'fa-solid fa-trash',
    view: 'fa-solid fa-pencil'
  };

  isVisible = false;

  closeForm(): void {
    this.isVisible = false;
  }
    openForm(): void {
    this.isVisible = true;
  }





  private routeSubscription: Subscription | undefined;
  formData: any; // Aquí almacenarás los datos del formulario del JSON
  error: any;
  formGroup: string = ''; // Aquí almacenarás el nombre del formulario
  formName: string = ''; // Aquí almacenarás el nombre del formulario


  ngOnInit(): void {

      this.formGroup = this.group; // Obtén el valor del parámetro 'portadillas'
      this.formName = this.name; // Obtén el valor del parámetro 'portadillas'

      this.formData = getConfig(this.formGroup, this.formName); // Llama a la función para obtener la configuración del JSON
console.log(this.formData)

  }

}
