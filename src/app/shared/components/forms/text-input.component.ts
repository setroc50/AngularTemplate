// En text-input.component.ts

import { Component, Input, forwardRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormControl, ReactiveFormsModule, ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

// Interfaz para la configuración de este componente
export interface TextInputElementConfig {
  key: string;
  label?: string;
  placeholder?: string;
  type?: string; // <--- CAMBIADO AQUÍ a 'string' (antes era una unión de tipos específicos)
  disabledField?: string;
  disabledValue?: any;
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
        [type]="safeInputType" [id]="config.key"
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
  styles: [],
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
  @Input() formGroup!: FormGroup;

  onChange: any = (_: string | null) => {};
  onTouched: any = () => {};

  constructor() {}

  ngOnInit(): void {
    if (!this.control) {
      console.warn('TextInputComponent: FormControl no fue proporcionado.', this.config);
    }
    if (!this.config || !this.config.key) {
        console.error('TextInputComponent: La propiedad "key" en la configuración es obligatoria.', this.config);
    }
  }

  writeValue(value: any): void {}
  registerOnChange(fn: any): void { this.onChange = fn; }
  registerOnTouched(fn: any): void { this.onTouched = fn; }
  setDisabledState?(isDisabled: boolean): void {}

  get isReadOnly(): boolean {
    if (this.config.disabledField && this.config.disabledValue !== undefined && this.formGroup) {
      const controllingField = this.formGroup.get(this.config.disabledField);
      if (controllingField) {
        return controllingField.value != this.config.disabledValue;
      }
    }
    return false;
  }

  /**
   * Devuelve un tipo de input HTML seguro. Si el tipo en config no es uno
   * de los soportados para input de texto, devuelve 'text' por defecto.
   */
  get safeInputType(): string {
    const defaultType = 'text';
    if (!this.config || !this.config.type) {
      return defaultType;
    }
    const supportedTypes = ['text', 'email', 'password', 'tel', 'url', 'number'];
    const lowerType = this.config.type.toLowerCase();
    return supportedTypes.includes(lowerType) ? lowerType : defaultType;
  }
}
