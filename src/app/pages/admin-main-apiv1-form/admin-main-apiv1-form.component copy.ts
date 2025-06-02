

import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, FormArray,AbstractControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

// Importa FormInputManagerComponent y la interfaz de configuración
import { FormInputManagerComponent } from '../../shared/components/forms/form-input-manager/form-input-manager.component'; // Ajusta la ruta

import { FormElementConfig, FormElementOption, SelectOption, RadioButtonOption, CheckboxOption as MultiCheckboxOption } from '../../shared/components/forms/interfaces/form-config.inerface'; // Ajusta la ruta



@Component({
  selector: 'app-admin-main-apiv1-form',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormInputManagerComponent // Importa el manager
  ],
  templateUrl: './admin-main-apiv1-form.component.html',
  styleUrl: './admin-main-apiv1-form.component.css'
})
export class AdminMainApiv1FormComponent implements OnInit {

    @Input() rowData:[] = []  ;


  myForm!: FormGroup;
  formStructure: FormElementConfig[] = []; // Aquí definirás la estructura de tu formulario
  public objectKeys = Object.keys; // <--- AÑADE ESTA LÍNEA

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.defineFormStructure();
    this.myForm = this.createFormGroup();
  }

  defineFormStructure(): void {
    this.formStructure = [
          {
        key: 'Pais',
        type: 'radio',
        label: 'Pais',
        required: true,
        options: [
          { value: '1010', name: 'MX' },
          { value: '1210', name: 'COL' },
          { value: '1310', name: 'GTM' }
        ] as RadioButtonOption[]
      },

      {
        key: 'CodigoDistribuidor',
        type: 'text',
        label: 'Codigo DS',
        placeholder: 'Codigo',
        required: true
      },
      {
        key: 'Contrasena',
        type: 'text',
        label: 'Contraseña',
        placeholder: 'Contraseña',
        required: true
      },
      {
        key: 'Correo',
        type: 'email',
        label: 'Correo Electrónico',
        placeholder: 'correoDS@correo.com',
        required: true
      },
         {
        key: 'CorreosCopia',
        type: 'text',
        label: 'Correos Copia',
        placeholder: 'Separar por ;',

      },
      {
        key: 'Planta',
        type: 'MultipleCheckbox', // Asegúrate que este string coincida con tu ngSwitchCase
        label: 'Almacenes - Stocks',
         required: true,
        options: [
           { value: 1010, name: 'MX-Guadalajara' },
           { value: 1011, name: 'MX-Algarín' },
           { value: 1012, name: 'MX-Monterrey' },
           { value: 1013, name: 'MX-Gustavo Baz' },
           { value: 1014, name: 'MX-Torreón' },
          { value: 1210, name: 'COL-Colombia' },
          { value: 1211, name: 'COL-RIC' },
          { value: 1310, name: 'GTM-Guatemala' }
        ] as MultiCheckboxOption[]
      },
          {
        key: 'Estatus',
        type: 'toggle', // O 'checkbox' si tienes ambos y quieres un toggle aquí
        label: 'Estatus',
       },
          {
        key: 'Precio',
        type: 'toggle', // O 'checkbox' si tienes ambos y quieres un toggle aquí
        label: 'Precio',
       }
      // ... puedes añadir más configuraciones de campos aquí
    ];
  }

  createFormGroup(): FormGroup {
    const group: { [key: string]: AbstractControl } = {};
    this.formStructure.forEach(field => {
      let control: AbstractControl;
      const validators = [];
      if (field.required) {
        // Para 'toggle' o 'checkbox' que deben ser true, usa Validators.requiredTrue
        if (field.type === 'toggle' || field.type === 'checkbox') {
          validators.push(Validators.requiredTrue);
        } else {
          validators.push(Validators.required);
        }
      }
      if (field.minLength) { validators.push(Validators.minLength(field.minLength)); }
      if (field.maxLength) { validators.push(Validators.maxLength(field.maxLength)); }
      if (field.pattern) { validators.push(Validators.pattern(field.pattern)); }
      if (field.type === 'email') { validators.push(Validators.email); }
      if (field.type === 'number') {
        if (field.min !== undefined) { validators.push(Validators.min(field.min)); }
        if (field.max !== undefined) { validators.push(Validators.max(field.max)); }
      }


      if (field.type === 'multipleFileDragGeneric' || field.type === 'multipleImageDrag') {
        control = this.fb.array([], validators);
      } else if (field.type === 'MultipleCheckbox') {
        // El valor inicial es un array (puede ser vacío o con valores preseleccionados)
        control = this.fb.control([], validators);
      } else if (field.type === 'toggle' || field.type === 'checkbox') {
        control = this.fb.control(false, validators); // Valor inicial booleano
      }
      else {
        control = this.fb.control('', validators);
      }
      group[field.key] = control;
    });
    return this.fb.group(group);
  }

  onActualFormSubmit(): void {

    if (this.myForm.valid) {
      console.log('Formulario Principal Enviado:', this.myForm.value);
      // Aquí procesarías los datos del formulario
    } else {
      console.error('Formulario Principal Inválido. Por favor, revisa los campos.');
      this.myForm.markAllAsTouched(); // Marca todos los campos para mostrar errores
    }
  }

  // Helper para la plantilla, para acceder a los controles de forma más limpia
  getControl(key: string): AbstractControl | null {
    return this.myForm.get(key);
  }
}

