import { Component, Input, OnInit, OnChanges, SimpleChanges, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, FormArray, AbstractControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DynamicPageTabsContainerComponent } from '../dynamic-page-tabs-container/dynamic-page-tabs-container.component'; // Asegúrate que la ruta sea correcta
import { DynamicService } from '../../../../../services/dynamic-service.service'; // Asegúrate de la ruta correcta

// Interfaz para la configuración de elementos de formulario/página
interface FormElementConfig {
  colZize?: string;
  field?: string;
  type: string;
  key: string;
  label?: string;
  options?: { value: any; name: string }[];
  required?: boolean;
  validators?: string[];
  pattern?: string;
  maxLength?: number;
  minLength?: number;
  min?: number;
  max?: number;
  step?: number;
  accept?: string;
  disabledField?: string;
  disabledValue?: string;
  columns?:{ type:string, separateWords:boolean, name: string; label: string; field: string; align: string }[];
  single?: boolean; // Cambiado de 'single:boolean,'
  identifier?: string; // Cambiado de 'identifier:string;'
  data?: any[]; // <--- CORREGIDO: de data:[] a data: any[]
  layoutGroup?:string;
  layoutName?:string;
}

@Component({
  selector: 'app-dynamic-page-construct',
  standalone: true, // Asumiendo que es standalone por los imports directos en @Component
  imports: [
    CommonModule,
    ReactiveFormsModule, // Necesario si este componente usa Reactive Forms directamente
    DynamicPageTabsContainerComponent // Si lo usas en la plantilla de este componente
  ],
  templateUrl: './dynamic-page-construct.omponent.html', // <--- CORREGIDO EL NOMBRE DEL ARCHIVO (añadida 'c')
})
export class DynamicPageConstruct implements OnChanges { // Quité OnInit porque no se usa aquí

  private dynamicService = inject(DynamicService);

  // --- Propiedades de la clase ---
  @Input() formConfigInput: any = [{}]; // Considera tipar esto mejor si conoces su estructura

  // Propiedades que faltaban, ahora declaradas:
  public formConfig: FormElementConfig[] | undefined; // Contendrá los 'fields'
  public formFields: any[] | undefined; // Tipo 'any[]' por ahora, idealmente una interfaz
  public services: any[] | undefined;   // Tipo 'any[]' por ahora, idealmente una interfaz

  public resources: { [key: string]: any } = {};

  constructor() {} // Constructor es buena práctica tenerlo, aunque esté vacío

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['formConfigInput'] && changes['formConfigInput'].currentValue) {
      const currentConfig = changes['formConfigInput'].currentValue?.[0]; // Asume que es un array y tomas el primer elemento

      if (currentConfig) {
        this.formConfig = currentConfig.fields;
        this.formFields = currentConfig.formFields; // Asumiendo que formFields está al mismo nivel que fields
        this.services = currentConfig.services;

        if (this.services && this.services.length > 0 && (this.services as any[])[0]?.related) {
          // console.log('Related services endpoint:', (this.services as any[])[0].related);
          this.cargarRecursos((this.services as any[])[0].related);
        } else {
          // Si no hay 'services' o 'related', podrías querer limpiar los recursos o no hacer nada
          this.resources = {}; // Limpiar recursos si la configuración de servicios cambia y es inválida
        }
      } else {
        // Si currentConfig es undefined, limpia las propiedades
        this.formConfig = undefined;
        this.formFields = undefined;
        this.services = undefined;
        this.resources = {};
      }
    }
  }

  cargarRecursos(endpoints:[]): void {
    if (!endpoints || endpoints.length === 0) {
      // console.log('No endpoints to load resources from.');
      this.resources = {}; // Limpia recursos si no hay endpoints
      return;
    }
    // Asumiendo que getMultipleWithKeys espera un array de objetos con {key: string, endpoint: string}
    // o un formato que tu servicio entienda. El tipo '[]' original era muy restrictivo.
    this.dynamicService.getMultipleWithKeys<any>(endpoints).subscribe( // Usar 'any' si la estructura de respuesta varía
      (data) => {
        console.log('Recursos cargados:', data);
        this.resources = data;
      },
      (error) => {
        console.error('Error al cargar recursos:', error);
        this.resources = {}; // Limpia recursos en caso de error
      }
    );
  }
}
