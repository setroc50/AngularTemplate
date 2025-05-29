import { Component, Input, forwardRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule, ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

// Interfaz para las opciones de los radio buttons
export interface RadioButtonOption {
  value: any;
  name: string; // Texto a mostrar para la opción
  disabled?: boolean; // Opcional: para deshabilitar una opción individual
}

// Interfaz para la configuración básica del grupo de radios
export interface RadioButtonGroupElementConfig {
  key: string;    // Se usará para el atributo 'name' de los inputs y para el 'for' de la etiqueta principal
  label?: string; // Etiqueta principal del grupo de radio buttons
}

@Component({
  selector: 'app-radio-button-group',
  imports: [CommonModule, ReactiveFormsModule],
    standalone: true, // <--- ¡ASEGÚRATE DE ESTO!

  template: `
    <div class="radio-button-group-container" [attr.aria-labelledby]="config?.key + '-label'">
      <label
        *ngIf="config.label"
        [id]="config.key + '-label'"
        class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
      >
        {{ config.label }}
      </label>
      <div class="mt-2 space-y-2" role="radiogroup" [attr.aria-labelledby]="config?.key + '-label'">
        <div
          *ngFor="let option of options; let i = index"
          class="flex items-center"
        >
          <input
            type="radio"
            [id]="config.key + '-' + i + '-' + option.value"
            [name]="config.key"
            [formControl]="control"
            [value]="option.value"
            [disabled]="option.disabled || control.disabled"
            class="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded-full dark:bg-gray-700 dark:border-gray-600 dark:text-blue-500 dark:focus:ring-blue-600 dark:focus:ring-offset-gray-800"
          />
          <label
            [for]="config.key + '-' + i + '-' + option.value"
            class="ml-3 block text-sm font-medium text-gray-700 dark:text-gray-300"
            [class.opacity-50]="option.disabled || control.disabled"
          >
            {{ option.name }}
          </label>
        </div>
        <div *ngIf="!options || options.length === 0" class="text-xs text-gray-500 dark:text-gray-400">
          No hay opciones disponibles.
        </div>
      </div>
      <div *ngIf="control?.invalid && (control?.touched || control?.dirty)" class="text-red-500 dark:text-red-400 text-xs mt-1">
        <div *ngIf="control?.errors?.['required']">Por favor, selecciona una opción para "{{ config.label }}".</div>
        </div>
    </div>
  `,
  styles: [`
    /* Estilos opcionales para radio-button-group.component.css */
    /* :host { display: block; } */
  `],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => RadioButtonGroupComponent),
      multi: true
    }
  ]
})
export class RadioButtonGroupComponent implements ControlValueAccessor, OnInit {
  @Input() config!: RadioButtonGroupElementConfig; // Configuración básica como label y key (para 'name')
  @Input() options: RadioButtonOption[] = [];     // Array de opciones para los radio buttons
  @Input() control!: FormControl;                  // El FormControl del formulario padre

  // --- Implementación de ControlValueAccessor ---
  // Aunque Angular maneja mucho con [formControl] en inputs nativos,
  // CVA es útil si el componente mismo necesita lógica de transformación o
  // si se quiere usar formControlName directamente en <app-radio-button-group>.
  // En este caso, como pasamos el 'control' directamente, su rol es menor pero
  // se mantiene por consistencia y buenas prácticas para componentes de formulario.

  onChange: any = () => {};
  onTouched: any = () => {};

  writeValue(value: any): void {
    // El enlace [formControl]="control" en cada input radio ya se encarga de
    // seleccionar el radio correcto basado en el valor del FormControl.
    // Este método se invocaría si el valor del control se establece programáticamente.
    // No se necesita acción explícita aquí si el FormControl se maneja bien.
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
    // Si quisiéramos notificar cambios desde aquí (además de lo que hace el FormControl):
    // this.control.valueChanges.subscribe(fn);
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
    // Podríamos llamar a onTouched cuando un radio es clickeado,
    // pero el FormControl también maneja su estado touched.
  }

  setDisabledState?(isDisabled: boolean): void {
    // El estado 'disabled' del FormControl se propaga a los inputs
    // si están correctamente enlazados con [formControl].
    // Adicionalmente, lo usamos para deshabilitar opciones individuales.
    // Si quisiéramos deshabilitar todo el grupo programáticamente desde el CVA:
    // this.options.forEach(option => option.disabled = isDisabled); // Esto sería si options.disabled no existiera
  }
  // --- Fin de ControlValueAccessor ---

  constructor() {}

  ngOnInit(): void {
    if (!this.control) {
      console.warn('RadioButtonGroupComponent: FormControl no fue proporcionado. El componente podría no funcionar como se espera.', this.config);
      // Considera crear un FormControl por defecto si es un caso de uso válido, o lanzar un error.
      // this.control = new FormControl(); // No recomendado si se espera del padre
    }
    if (!this.config || !this.config.key) {
        console.error('RadioButtonGroupComponent: La propiedad "key" en la configuración es obligatoria y se usa para el atributo "name".', this.config);
    }
  }
}
