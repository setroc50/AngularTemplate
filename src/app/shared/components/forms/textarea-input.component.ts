import { Component, Input, forwardRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule, ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

// Interfaz para la configuración de este componente
export interface TextareaElementConfig {
  key: string;        // Para el 'id' del textarea y el 'for' de la etiqueta
  label?: string;     // Etiqueta principal opcional para el campo
  placeholder?: string; // Placeholder para el textarea
  rows?: number;        // Número de filas visibles para el textarea (opcional)
  // Podrías añadir maxLength, etc., si quieres manejarlos aquí también,
  // aunque Validators.maxLength en el FormControl es más común.
}

@Component({
  selector: 'app-textarea-input',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="textarea-input-container">
      <label
        *ngIf="config.label"
        [for]="config.key"
        class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
      >
        {{ config.label }}
      </label>
      <textarea
        [id]="config.key"
        [formControl]="control"
        [placeholder]="config.placeholder || config.label || ''"
        [rows]="config.rows || 3" class="bg-gray-50 border border-gray-300 text-gray-700 sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-3 pr-3 py-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        (blur)="onTouched()" ></textarea>
      <div *ngIf="control?.invalid && (control?.touched || control?.dirty)" class="text-red-500 dark:text-red-400 text-xs mt-1">
        <div *ngIf="control?.errors?.['required']">{{ config.label || 'Este campo' }} es requerido.</div>
        <div *ngIf="control?.errors?.['minlength']">Debe tener al menos {{ control.errors?.['minlength']?.requiredLength }} caracteres.</div>
        <div *ngIf="control?.errors?.['maxlength']">No debe exceder {{ control.errors?.['maxlength']?.requiredLength }} caracteres.</div>
        </div>
    </div>
  `,
  styles: [`
    /* :host { display: block; } */
    /* textarea { resize: vertical; } */ /* Comportamiento por defecto, puedes restringirlo si quieres */
  `],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TextareaInputComponent),
      multi: true
    }
  ]
})
export class TextareaInputComponent implements ControlValueAccessor, OnInit {
  @Input() config!: TextareaElementConfig;
  @Input() control!: FormControl; // Recibe el FormControl directamente del padre

  // --- Implementación de ControlValueAccessor ---
  onChange: any = (_: string | null) => {};
  onTouched: any = () => {};

  writeValue(value: any): void {
    // El enlace [formControl]="control" ya establece el valor en el textarea.
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
      console.warn('TextareaInputComponent: FormControl no fue proporcionado.', this.config);
    }
    if (!this.config || !this.config.key) {
        console.error('TextareaInputComponent: La propiedad "key" en la configuración es obligatoria.', this.config);
    }
  }
}
