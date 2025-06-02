import { Component, Input, forwardRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule, ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

export interface ToggleSwitchElementConfig {
  key: string;
  label?: string;
}

@Component({
  selector: 'app-toggle-switch',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="toggle-switch-container flex items-center">
      <label
        [for]="config.key"
        class="relative inline-flex items-center cursor-pointer select-none"
        (keydown.space)="toggleValueFromKeyboard(); $event.preventDefault()"
        (keydown.enter)="toggleValueFromKeyboard(); $event.preventDefault()"
        tabindex="0"
        [attr.aria-checked]="control.value"
        role="switch"
      >
        <input
          type="checkbox"
          [id]="config.key"
          class="sr-only peer"
          [formControl]="control"
          (blur)="onTouched()" #toggleInput
        />
        <div
          class="w-11 h-6 bg-gray-200 peer-focus-visible:outline-none peer-focus-visible:ring-2 peer-focus-visible:ring-blue-300 dark:peer-focus-visible:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"
        ></div>
        <span
          *ngIf="config.label"
          class="ml-3 text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          {{ config.label }}
        </span>
      </label>
      <div *ngIf="control?.invalid && (control?.touched || control?.dirty)" class="text-red-500 dark:text-red-400 text-xs ml-3">
        <div *ngIf="control?.errors?.['required']">Es necesario activar "{{ config.label }}".</div>
        <div *ngIf="control?.errors?.['requiredTrue']">El campo "{{ config.label }}" debe estar activado.</div>
      </div>
    </div>
  `,
  styles: [`/* :host { display: block; } */`],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ToggleSwitchComponent),
      multi: true
    }
  ]
})
export class ToggleSwitchComponent implements ControlValueAccessor, OnInit {
  @Input() config!: ToggleSwitchElementConfig;
  @Input() control!: FormControl;

  onChange: any = (_: boolean) => {};
  onTouched: any = () => {};

  constructor() {}

  ngOnInit(): void {
    if (!this.control) {
      console.warn('ToggleSwitchComponent: FormControl no fue proporcionado.', this.config);
    }
    if (!this.config || !this.config.key) {
        console.error('ToggleSwitchComponent: La propiedad "key" en la configuración es obligatoria.', this.config);
    }
  }

  writeValue(value: any): void {}
  registerOnChange(fn: any): void { this.onChange = fn; }
  registerOnTouched(fn: any): void { this.onTouched = fn; }
  setDisabledState?(isDisabled: boolean): void {}

  /**
   * Este método ahora es específicamente para interacciones de teclado en la etiqueta.
   * El clic en la etiqueta usará el comportamiento nativo para cambiar el checkbox,
   * y [formControl] actualizará el valor del control.
   */
  toggleValueFromKeyboard(): void {
    if (this.control && !this.control.disabled) {
      this.control.setValue(!this.control.value);
      this.onTouched(); // Marcar como tocado al interactuar con el teclado
    }
  }
}
