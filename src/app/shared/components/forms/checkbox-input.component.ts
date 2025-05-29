import { Component, Input, forwardRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule, ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

// Interfaz para la configuración de este componente
export interface CheckboxElementConfig {
  key: string;    // Para el 'id' del input y el 'for' de la etiqueta
  label?: string; // Etiqueta a mostrar junto al checkbox
  // Podrías añadir más configuraciones, como 'indeterminate' si fuera necesario en el futuro
}

@Component({
  selector: 'app-checkbox-input',
   imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="checkbox-input-container flex items-center">
      <input
        type="checkbox"
        [id]="config.key"
        [formControl]="control"
        class="mr-2 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:bg-gray-700 dark:border-gray-600 cursor-pointer"
        (blur)="onTouched()" />
      <label
        *ngIf="config.label"
        [for]="config.key"
        class="text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer select-none"
      >
        {{ config.label }}
      </label>
      <div *ngIf="control?.invalid && (control?.touched || control?.dirty)" class="text-red-500 dark:text-red-400 text-xs ml-3">
        <div *ngIf="control?.errors?.['requiredTrue']">Debes aceptar "{{ config.label }}".</div>
        <div *ngIf="control?.errors?.['required'] && !control?.errors?.['requiredTrue']">Este campo es requerido.</div>
        </div>
    </div>
  `,
  styles: [`
    /* :host { display: block; } */
  `],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CheckboxInputComponent),
      multi: true
    }
  ]
})
export class CheckboxInputComponent implements ControlValueAccessor, OnInit {
  @Input() config!: CheckboxElementConfig;
  @Input() control!: FormControl; // Recibe el FormControl directamente del padre

  // --- Implementación de ControlValueAccessor ---
  onChange: any = (_: boolean) => {}; // El valor es booleano
  onTouched: any = () => {};

  writeValue(value: any): void {
    // El enlace [formControl]="control" ya establece el estado 'checked' del checkbox.
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
      console.warn('CheckboxInputComponent: FormControl no fue proporcionado.', this.config);
    }
    if (!this.config || !this.config.key) {
        console.error('CheckboxInputComponent: La propiedad "key" en la configuración es obligatoria.', this.config);
    }
  }
}
