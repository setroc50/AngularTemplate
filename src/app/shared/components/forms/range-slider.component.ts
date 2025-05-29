import { Component, Input, forwardRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule, ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

// Interfaz para la configuración de este componente
export interface RangeSliderElementConfig {
  key: string;    // Para el 'id' del input y el 'for' de la etiqueta
  label?: string; // Etiqueta principal para el control de rango
  min?: number;   // Valor mínimo del rango
  max?: number;   // Valor máximo del rango
  step?: number;  // Incremento del valor
}

@Component({
  selector: 'app-range-slider',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="range-slider-container">
      <label
        *ngIf="config.label"
        [for]="config.key"
        class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
      >
        {{ config.label }}
      </label>

      <input
        type="range"
        [id]="config.key"
        [formControl]="control"
        class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
        [min]="config.min || 0"
        [max]="config.max || 100"
        [step]="config.step || 1"
        (blur)="onTouched()" />
      <div class="text-right mt-1">
        <output
          [for]="config.key"
          class="text-sm text-gray-600 dark:text-gray-400 font-medium"
        >
          {{ control.value }}
        </output>
      </div>

      <div *ngIf="control?.invalid && (control?.touched || control?.dirty)" class="text-red-500 dark:text-red-400 text-xs mt-1 text-right">
        <div *ngIf="control?.errors?.['required']">Es necesario un valor.</div>
        <div *ngIf="control?.errors?.['min']">El valor debe ser al menos {{ config.min }}.</div>
        <div *ngIf="control?.errors?.['max']">El valor no debe exceder {{ config.max }}.</div>
        </div>
    </div>
  `,
  styles: [`
    /* :host { display: block; } */
    /* Estilos adicionales si son necesarios, aunque Tailwind cubre la mayoría */
    input[type=range]::-webkit-slider-thumb {
      /* Puedes añadir estilos para el thumb si quieres personalizarlo más allá de Tailwind */
    }
    input[type=range]::-moz-range-thumb {
      /* Estilos para Firefox */
    }
  `],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => RangeSliderComponent),
      multi: true
    }
  ]
})
export class RangeSliderComponent implements ControlValueAccessor, OnInit {
  @Input() config!: RangeSliderElementConfig;
  @Input() control!: FormControl; // Recibe el FormControl directamente del padre

  // --- Implementación de ControlValueAccessor ---
  onChange: any = (_: number | null) => {};
  onTouched: any = () => {};

  writeValue(value: any): void {
    // El enlace [formControl]="control" ya establece el valor en el input.
    // El tipo de valor para input[type=range] es numérico o string que se convierte a número.
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
      console.warn('RangeSliderComponent: FormControl no fue proporcionado.', this.config);
      // this.control = new FormControl(this.config?.min || 0); // No recomendado si se espera del padre
    }
     if (!this.config || !this.config.key) {
        console.error('RangeSliderComponent: La propiedad "key" en la configuración es obligatoria.', this.config);
    }
  }
}
