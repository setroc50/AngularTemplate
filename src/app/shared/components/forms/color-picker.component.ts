import { Component, Input, forwardRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule, ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

// Interfaz para la configuración de este componente
export interface ColorPickerElementConfig {
  key: string;    // Para el 'id' del input y el 'for' de la etiqueta
  label?: string; // Etiqueta a mostrar
  // Aquí podrías añadir más configuraciones específicas si fueran necesarias en el futuro
}

@Component({
  selector: 'app-color-picker',

  imports: [CommonModule, ReactiveFormsModule],
  template: `AAA
    <div class="color-picker-container">
      <label
        *ngIf="config.label"
        [for]="config.key"
        class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
      >

      </label>
      <input
        type="color"
        [id]="config.key"
        [formControl]="control"
        class="mt-1 block w-full h-10 rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 cursor-pointer"
        (blur)="onTouched()" />
      <div *ngIf="control?.invalid && (control?.touched || control?.dirty)" class="text-red-500 dark:text-red-400 text-xs mt-1">
        <div *ngIf="control?.errors?.['required']">Es necesario seleccionar un color para "{{ config.label }}".</div>
        </div>
    </div>
  `,
  styles: [`
    /* Estilos opcionales para color-picker.component.css */
    /* :host { display: block; } */
    /* El input de color a veces tiene un padding/borde por defecto que no toma el color completo. */
    /* Puedes necesitar estilos adicionales para que se vea exactamente como quieres. */
    /* input[type="color"] {
      -webkit-appearance: none;
      -moz-appearance: none;
      appearance: none;
      background-color: transparent;
      padding: 0; // Puede ayudar a que el color ocupe todo el espacio
    } */
    /* input[type="color"]::-webkit-color-swatch-wrapper {
      padding: 0;
    }
    input[type="color"]::-webkit-color-swatch {
      border: none;
      border-radius: 0.375rem; // igual al rounded-md
    }
    input[type="color"]::-moz-color-swatch {
      border: none;
      border-radius: 0.375rem; // igual al rounded-md
    } */
  `],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ColorPickerComponent),
      multi: true
    }
  ]
})
export class ColorPickerComponent implements ControlValueAccessor, OnInit {
  @Input() config!: ColorPickerElementConfig;
  @Input() control!: FormControl; // Recibe el FormControl directamente del padre

  // --- Implementación de ControlValueAccessor ---
  // Dado que enlazamos [formControl]="control" directamente a un input nativo,
  // Angular maneja la mayoría de las interacciones. Estos métodos son más para
  // cumplir el contrato de CVA y permitir que <app-color-picker> funcione con formControlName.

  onChange: any = () => {};
  onTouched: any = () => {};

  writeValue(value: any): void {
    // El enlace [formControl]="control" ya establece el valor en el input.
    // Si el valor necesita transformación antes de mostrarse (no es el caso para type="color"),
    // se haría aquí.
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
    // Si el input nativo no actualizara el FormControl automáticamente (que sí lo hace),
    // aquí nos suscribiríamos al evento 'input' o 'change' del input
    // y llamaríamos a fn(nuevoValor).
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
    // El (blur)="onTouched()" en el input es una forma simple de manejarlo.
  }

  setDisabledState?(isDisabled: boolean): void {
    // El estado 'disabled' del FormControl se propaga automáticamente al input
    // nativo a través del enlace [formControl]="control".
    // Si tuviéramos elementos custom que no son inputs nativos, los deshabilitaríamos aquí.
  }
  // --- Fin de ControlValueAccessor ---

  constructor() {}

  ngOnInit(): void {
    if (!this.control) {
      console.warn('ColorPickerComponent: FormControl no fue proporcionado. El componente podría no funcionar como se espera.', this.config);
      // En un escenario real, podrías querer inicializar un FormControl por defecto o lanzar un error
      // this.control = new FormControl(); // No recomendado si se espera del padre
    }
    if (!this.config || !this.config.key) {
        console.error('ColorPickerComponent: La propiedad "key" en la configuración es obligatoria.', this.config);
    }
  }
}
