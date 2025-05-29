import { Component, Input, forwardRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormControl, ReactiveFormsModule, ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

// Interfaz para la configuración de este componente
export interface TextInputElementConfig {
  key: string;
  label?: string;
  placeholder?: string;
  type?: 'text' | 'email' | 'password' | 'tel' | 'url' | 'number'; // <--- AÑADIDO 'number' AQUÍ
  disabledField?: string; // Clave del campo en el FormGroup que controla el estado readonly
  disabledValue?: any;    // Valor que debe tener el campo 'disabledField' para que este input sea editable
}

@Component({
  selector: 'app-text-input',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="text-input-container">
      <label
        *ngIf="config.label"
        [for]="config.key"
        class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
      >
        {{ config.label }}
      </label>
      <input
        [type]="config.type || 'text'"
        [id]="config.key"
        [formControl]="control"
        [placeholder]="config.placeholder || config.label || ''"
        [readOnly]="isReadOnly"
        class="bg-gray-50 border border-gray-300 text-gray-700 sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        [ngClass]="{'bg-gray-200 dark:bg-gray-600 cursor-not-allowed': isReadOnly}"
        (blur)="onTouched()"
      />
      <div *ngIf="control?.invalid && (control?.touched || control?.dirty)" class="text-red-500 dark:text-red-400 text-xs mt-1">
        <div *ngIf="control?.errors?.['required']">{{ config.label || 'Este campo' }} es requerido.</div>
        <div *ngIf="control?.errors?.['email']">Por favor, introduce un email válido.</div>
        <div *ngIf="control?.errors?.['minlength']">Debe tener al menos {{ control.errors?.['minlength']?.requiredLength }} caracteres.</div>
        <div *ngIf="control?.errors?.['maxlength']">No debe exceder {{ control.errors?.['maxlength']?.requiredLength }} caracteres.</div>
        <div *ngIf="control?.errors?.['pattern']">El formato no es válido.</div>
        </div>
    </div>
  `,
  styles: [`
    /* :host { display: block; } */
  `],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TextInputComponent),
      multi: true
    }
  ]
})
export class TextInputComponent implements ControlValueAccessor, OnInit {
  @Input() config!: TextInputElementConfig;
  @Input() control!: FormControl;
  @Input() formGroup!: FormGroup; // Referencia al FormGroup padre

  // --- Implementación de ControlValueAccessor ---
  onChange: any = (_: string | null) => {};
  onTouched: any = () => {};

  writeValue(value: any): void {}
  registerOnChange(fn: any): void { this.onChange = fn; }
  registerOnTouched(fn: any): void { this.onTouched = fn; }
  setDisabledState?(isDisabled: boolean): void {
    // El estado 'disabled' del FormControl se propaga.
    // Para 'readonly', usamos nuestra lógica personalizada.
  }
  // --- Fin de ControlValueAccessor ---

  constructor() {}

  ngOnInit(): void {
    if (!this.control) {
      console.warn('TextInputComponent: FormControl no fue proporcionado.', this.config);
    }
    if (!this.config || !this.config.key) {
        console.error('TextInputComponent: La propiedad "key" en la configuración es obligatoria.', this.config);
    }
    // Si `disabledField` existe, es buena idea suscribirse a sus cambios si el `formGroup` se pasa
    // y puede cambiar dinámicamente, para forzar la reevaluación de `isReadOnly`.
    // Sin embargo, la reevaluación en la plantilla durante el ciclo de detección de cambios
    // a menudo es suficiente si el `formGroup` y sus valores se actualizan correctamente.
  }

  get isReadOnly(): boolean {
    if (this.config.disabledField && this.config.disabledValue !== undefined && this.formGroup) {
      const controllingField = this.formGroup.get(this.config.disabledField);
      if (controllingField) {
        // El input es editable si el valor del campo de control ES IGUAL al disabledValue.
        // Por lo tanto, es readOnly si NO SON IGUALES.
        return controllingField.value != this.config.disabledValue;
      }
    }
    return false; // Por defecto, no es readonly si no se cumple la condición o no hay config para ello.
  }
}
