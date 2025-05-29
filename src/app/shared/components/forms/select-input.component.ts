import { Component, Input, forwardRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule, ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

// Interfaz para las opciones del select
export interface SelectOption {
  value: any;
  name: string; // El texto que se muestra para la opción
  disabled?: boolean; // Opcional: para deshabilitar una opción individual
}

// Interfaz para la configuración de este componente
export interface SelectElementConfig {
  key: string;        // Para el 'id' del select y el 'for' de la etiqueta
  label?: string;     // Etiqueta principal opcional para el campo
  placeholder?: string; // Texto para la opción deshabilitada por defecto (ej: "Seleccionar...")
  // Podrías añadir 'multiple' si necesitas selects múltiples en el futuro
}

@Component({
  selector: 'app-select-input',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="select-input-container">
      <label
        *ngIf="config.label"
        [for]="config.key"
        class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
      >
        {{ config.label }}
      </label>
      <select
        [id]="config.key"
        [formControl]="control"
        (blur)="onTouched()"
        class="bg-gray-50 border border-gray-300 text-gray-700 sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        >
        <option [ngValue]="null" value="" disabled selected>
          {{ config.placeholder || 'Seleccionar ' + (config.label || 'una opción') }}
        </option>
        <option
          *ngFor="let option of options"
          [ngValue]="option.value"
          [disabled]="option.disabled"
        >
          {{ option.name }}
        </option>
      </select>
      <div *ngIf="control?.invalid && (control?.touched || control?.dirty)" class="text-red-500 dark:text-red-400 text-xs mt-1">
        <div *ngIf="control?.errors?.['required']">Es necesario seleccionar una opción para "{{ config.label }}".</div>
        </div>
    </div>
  `,
  styles: [`
    /* :host { display: block; } */
    /* select {
      -webkit-appearance: none;
      -moz-appearance: none;
      appearance: none;
      background-image: url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23007CB2%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E');
      background-repeat: no-repeat;
      background-position: right .7em top 50%;
      background-size: .65em auto;
      padding-right: 2.5em; // Asegura espacio para la flecha personalizada
    }
    .dark select {
       background-image: url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23FFFFFF%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E');
    } */
  `],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectInputComponent),
      multi: true
    }
  ]
})
export class SelectInputComponent implements ControlValueAccessor, OnInit {
  @Input() config!: SelectElementConfig;
  @Input() options: SelectOption[] = [];
  @Input() control!: FormControl;

  // --- Implementación de ControlValueAccessor ---
  onChange: any = (_: any) => {}; // El valor puede ser de cualquier tipo
  onTouched: any = () => {};

  writeValue(value: any): void {
    // El enlace [formControl]="control" en el select y [ngValue] en las options
    // se encargan de seleccionar la opción correcta.
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    // El estado 'disabled' del FormControl se propaga automáticamente.
  }
  // --- Fin de ControlValueAccessor ---

  constructor() {}

  ngOnInit(): void {
    if (!this.control) {
      console.warn('SelectInputComponent: FormControl no fue proporcionado.', this.config);
    }
     if (!this.config || !this.config.key) {
        console.error('SelectInputComponent: La propiedad "key" en la configuración es obligatoria.', this.config);
    }
  }
}
