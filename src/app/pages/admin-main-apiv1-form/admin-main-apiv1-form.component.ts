

import { Component, OnInit } from '@angular/core';
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
        key: 'userEmail',
        type: 'email',
        label: 'Correo Electrónico',
        placeholder: 'tu@correo.com',
        required: true
      },
      {
        key: 'userAge',
        type: 'number',
        label: 'Edad',
        placeholder: 'Tu edad',
        min: 18,
        max: 99
      },
      {
        key: 'profileBio',
        type: 'textarea',
        label: 'Biografía Corta',
        placeholder: 'Cuéntanos algo sobre ti...',
        rows: 3,
        maxLength: 200
      },
      {
        key: 'userRole',
        type: 'select',
        label: 'Rol de Usuario',
        placeholder: 'Selecciona un rol',
        required: true,
        options: [
          { value: 'admin', name: 'Administrador' },
          { value: 'editor', name: 'Editor' },
          { value: 'viewer', name: 'Visualizador' }
        ] as SelectOption[] // Casteo para asegurar el tipo
      },
      {
        key: 'status',
        type: 'radio',
        label: 'Estado Actual',
        required: true,
        options: [
          { value: '1010', name: 'Almacen1' },
          { value: '1210', name: 'De Permiso' },
          { value: '1310', name: 'Inactivo' }
        ] as RadioButtonOption[]
      },
      {
        key: 'preferences',
        type: 'MultipleCheckbox', // Asegúrate que este string coincida con tu ngSwitchCase
        label: 'Preferencias de Notificación',
        options: [
           { value: 1010, name: 'GDL' },
          { value: 1210, name: 'COL' },
          { value: 1310, name: 'GTM' }
        ] as MultiCheckboxOption[]
      },
      {
        key: 'eventDate',
        type: 'date',
        label: 'Fecha del Evento',
        required: true
      },
      {
        key: 'satisfaction',
        type: 'range',
        label: 'Nivel de Satisfacción',
        min: 0,
        max: 10,
        step: 1
      },
      {
        key: 'acceptPolicy',
        type: 'toggle', // O 'checkbox' si tienes ambos y quieres un toggle aquí
        label: 'Acepto la política de privacidad',
        required: true // Para toggle, esto usualmente significa que debe ser true
      },
      {
        key: 'themeColor',
        type: 'color',
        label: 'Color del Tema Preferido'
      },
      {
        key: 'profilePicture',
        type: 'image', // Para SingleImageUploadComponent
        label: 'Foto de Perfil'
      },
      {
        key: 'projectFiles',
        type: 'multipleFileDragGeneric', // Para GenericFileUploadComponent
        label: 'Adjuntar Archivos del Proyecto'
      },
      {
        key: 'galleryImages',
        type: 'multipleImageDrag', // Para ImageUploadComponent
        label: 'Subir Imágenes a la Galería'
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

