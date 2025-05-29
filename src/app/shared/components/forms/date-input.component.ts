import { Component, Input, forwardRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule, ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

// Interfaz para la configuración de este componente
export interface DateInputElementConfig {
  key: string;        // Para el 'id' del input y el 'for' de la etiqueta
  label?: string;     // Etiqueta principal opcional para el campo de fecha
  placeholder?: string; // Placeholder para el input
  // Podrías añadir min/max date strings si fueran necesarios
}

@Component({
  selector: 'app-date-input',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="date-input-container">
      <label
        *ngIf="config.label"
        [for]="config.key"
        class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
      >
        {{ config.label }}
      </label>
      <div class="relative">
        <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <svg
            class="h-5 w-5 text-gray-400 dark:text-gray-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        </div>
        <input
          type="date"
          [id]="config.key"
          [formControl]="control"
          class="bg-gray-50 border border-gray-300 text-gray-700 sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          [placeholder]="config.placeholder || 'Selecciona una fecha'"
          (blur)="onTouched()" />
      </div>
      <div *ngIf="control?.invalid && (control?.touched || control?.dirty)" class="text-red-500 dark:text-red-400 text-xs mt-1">
        <div *ngIf="control?.errors?.['required']">La fecha para "{{ config.label || 'este campo' }}" es requerida.</div>
        </div>
    </div>
  `,
  styles: [`
    /* :host { display: block; } */
    /* input[type="date"]::-webkit-calendar-picker-indicator {
        cursor: pointer;
        opacity: 0.6; // O ajusta como necesites para que no interfiera con tu ícono si se superponen
        filter: invert(0.5) sepia(1) saturate(5) hue-rotate(175deg); // Ejemplo para cambiar color del ícono nativo
    } */
  `],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DateInputComponent),
      multi: true
    }
  ]
})
export class DateInputComponent implements ControlValueAccessor, OnInit {
  @Input() config!: DateInputElementConfig;
  @Input() control!: FormControl; // Recibe el FormControl directamente del padre

  // --- Implementación de ControlValueAccessor ---
  onChange: any = (_: string | null) => {}; // El valor es un string en formato YYYY-MM-DD o null
  onTouched: any = () => {};

  writeValue(value: any): void {
    // El enlace [formControl]="control" ya establece el valor en el input.
    // El input[type=date] espera un string en formato 'YYYY-MM-DD'.
    // Si el valor es un objeto Date, necesitarías formatearlo aquí. Por ahora, asumimos string.
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
      console.warn('DateInputComponent: FormControl no fue proporcionado.', this.config);
    }
    if (!this.config || !this.config.key) {
        console.error('DateInputComponent: La propiedad "key" en la configuración es obligatoria.', this.config);
    }
  }
}
