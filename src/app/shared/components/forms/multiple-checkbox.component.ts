// multiple-checkbox.component.ts
import { Component, Input, forwardRef, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule, ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Subscription } from 'rxjs';

export interface CheckboxOption {
  value: any;
  name: string;
  disabled?: boolean;
}

export interface MultipleCheckboxElementConfig {
  key: string;
  label?: string;
}

@Component({
  selector: 'app-multiple-checkbox',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="multiple-checkbox-container" role="group" [attr.aria-labelledby]="config?.key + '-label'">
      <label
        *ngIf="config.label"
        [id]="config.key + '-label'"
        class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
      >
        {{ config.label }}
      </label>
      <div class="space-y-2">
        <div
          *ngFor="let option of options; let i = index"
          class="flex items-center"
        >
          <input
            type="checkbox"
            [id]="generateOptionId(option.value, i)"
            [value]="option.value"
            [checked]="isSelected(option.value)"
            [disabled]="option.disabled || control?.disabled"
            (change)="onCheckboxChange(option.value, $event)"
            class="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:bg-gray-700 dark:border-gray-600 cursor-pointer"
          />
          <label
            [for]="generateOptionId(option.value, i)"
            class="ml-3 block text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer select-none"
            [class.opacity-50]="option.disabled || control?.disabled"
          >
            {{ option.name }}
          </label>
        </div>
        <div *ngIf="!options || options.length === 0" class="text-xs text-gray-500 dark:text-gray-400">
          No hay opciones disponibles.
        </div>
      </div>
      <div *ngIf="control?.invalid && (control?.touched || control?.dirty)" class="text-red-500 dark:text-red-400 text-xs mt-1">
        <div *ngIf="control?.errors?.['required'] && control.value?.length === 0">Se requiere al menos una selección para "{{ config.label }}".</div>
      </div>
    </div>
  `,
  styles: [],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MultipleCheckboxComponent),
      multi: true
    }
  ]
})
export class MultipleCheckboxComponent implements ControlValueAccessor, OnInit, OnDestroy {
  @Input() config!: MultipleCheckboxElementConfig;
  @Input() options: CheckboxOption[] = [];
  @Input() control!: FormControl;

  private _selectedValues: any[] = [];
  private controlValueChangesSubscription?: Subscription;

  onChangeCallback: (value: any[] | null) => void = () => {};
  onTouchedCallback: () => void = () => {};

  constructor() {}

  ngOnInit(): void {
    const componentId = this.config?.key || 'UnknownMultiCheckbox';
    console.log(`MultipleCheckboxComponent (${componentId}): ngOnInit INICIADO - Control inicial value:`, this.control?.value);

    if (!this.control) {
      console.error(`MultipleCheckboxComponent (${componentId}): FormControl NO FUE PROPORCIONADO.`);
      return;
    }

    if (this.control.value === null || typeof this.control.value === 'undefined') {
        this.control.setValue([], { emitEvent: false });
    } else if (!Array.isArray(this.control.value)) {
        console.warn(`MultipleCheckboxComponent (${componentId}): ngOnInit - El valor inicial del FormControl no es un array. Se establecerá a []. Valor actual:`, this.control.value);
        this.control.setValue([], { emitEvent: false });
    }
    this.writeValue(this.control.value);

    this.controlValueChangesSubscription = this.control.valueChanges.subscribe(valueFromControl => {
      console.log(`MultipleCheckboxComponent (${componentId}): valueChanges from parent control RECEIVED:`, valueFromControl);
      this.writeValue(valueFromControl);
    });

    if (!this.config || !this.config.key) {
      console.error(`MultipleCheckboxComponent (${componentId}): La propiedad "key" en la configuración es obligatoria.`);
    }
    console.log(`MultipleCheckboxComponent (${componentId}): ngOnInit FINALIZADO. Initial _selectedValues:`, this._selectedValues);
  }

  ngOnDestroy(): void {
    const componentId = this.config?.key || 'UnknownMultiCheckbox';
    console.log(`MultipleCheckboxComponent (${componentId}): ngOnDestroy - Desuscribiendo de valueChanges.`);
    this.controlValueChangesSubscription?.unsubscribe();
  }

  writeValue(value: any[] | null): void {
    const componentId = this.config?.key || 'UnknownMultiCheckbox';
    console.log(`MultipleCheckboxComponent (${componentId}): writeValue CALLED with:`, value);
    const newValues = Array.isArray(value) ? [...value] : [];

    if (JSON.stringify(this._selectedValues) !== JSON.stringify(newValues)) {
      this._selectedValues = newValues;
      console.log(`MultipleCheckboxComponent (${componentId}): internal _selectedValues SET to:`, this._selectedValues);
    } else {
      // console.log(`MultipleCheckboxComponent (${componentId}): writeValue - nuevo valor es idéntico al actual _selectedValues.`);
    }
  }

  registerOnChange(fn: (value: any[] | null) => void): void {
    const componentId = this.config?.key || 'UnknownMultiCheckbox';
    console.log(`MultipleCheckboxComponent (${componentId}): registerOnChange CALLED.`);
    this.onChangeCallback = fn;
  }

  registerOnTouched(fn: () => void): void {
    const componentId = this.config?.key || 'UnknownMultiCheckbox';
    console.log(`MultipleCheckboxComponent (${componentId}): registerOnTouched CALLED.`);
    this.onTouchedCallback = fn;
  }

  setDisabledState?(isDisabled: boolean): void {}

  isSelected(optionValue: any): boolean {
    return this._selectedValues.includes(optionValue);
  }

  onCheckboxChange(optionValue: any, event: Event): void {
    const componentId = this.config?.key || 'UnknownMultiCheckbox';
    const target = event.target as HTMLInputElement | null;
    if (!target) {
      console.error(`MultipleCheckboxComponent (${componentId}): event target is null in onCheckboxChange for optionValue: ${optionValue}.`);
      return;
    }
    const isChecked = target.checked;
    console.log(`MultipleCheckboxComponent (${componentId}): onCheckboxChange for value: ${optionValue}, isChecked: ${isChecked}`);
    console.log(`MultipleCheckboxComponent (${componentId}): _selectedValues BEFORE change:`, JSON.parse(JSON.stringify(this._selectedValues)));

    const newSelectedValuesArray = [...this._selectedValues];

    if (isChecked) {
      if (!newSelectedValuesArray.includes(optionValue)) {
        newSelectedValuesArray.push(optionValue);
      }
    } else {
      const index = newSelectedValuesArray.indexOf(optionValue);
      if (index > -1) {
        newSelectedValuesArray.splice(index, 1);
      }
    }

    this._selectedValues = newSelectedValuesArray; // Actualiza el estado interno primero
    console.log(`MultipleCheckboxComponent (${componentId}): _selectedValues AFTER change:`, this._selectedValues);

    // ----- INICIO DE CAMBIO IMPORTANTE -----
    if (this.control) {
      // Actualiza el FormControl padre directamente
      this.control.setValue(this._selectedValues); // No es necesario { emitEvent: false } aquí, queremos que emita
      console.log(`MultipleCheckboxComponent (${componentId}): this.control.setValue CALLED with:`, this._selectedValues);
      console.log(`MultipleCheckboxComponent (${componentId}): this.control.value AFTER setValue:`, JSON.parse(JSON.stringify(this.control.value)));
    } else {
      console.error(`MultipleCheckboxComponent (${componentId}): this.control es null/undefined en onCheckboxChange!`);
    }

    // Llama a onChangeCallback también, para cumplir con CVA por si algo más depende de ello.
    // Podría ser redundante si this.control.setValue ya hizo todo el trabajo.
    this.onChangeCallback(this._selectedValues);
    // console.log(`MultipleCheckboxComponent (${componentId}): onChangeCallback CALLED with:`, this._selectedValues);
    // ----- FIN DE CAMBIO IMPORTANTE -----

    this.onTouchedCallback();
  }

  public generateOptionId(optionValue: any, index: number): string {
    const baseKey = this.config?.key || 'multi-checkbox';
    const valueString = optionValue?.toString().replace(/\s+/g, '-') || `val-${index}`;
    return `${baseKey}-${index}-${valueString}`;
  }
}
