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
          <span class="relative inline-flex items-center justify-center w-4 h-4">
            <input
              type="checkbox"
              [id]="generateOptionId(option.value, i)"
              [value]="option.value"
              [checked]="isSelected(option.value)"
              [disabled]="option.disabled || control?.disabled"
              (change)="onCheckboxChange(option.value, $event)"
              class="peer appearance-none h-full w-full rounded-sm cursor-pointer
                     border border-slate-400 dark:border-slate-500
                     bg-white dark:bg-slate-900
                     checked:bg-primary dark:checked:bg-secondary checked:border-transparent
                     focus:outline-none focus:ring-2 focus:ring-offset-0
                     focus:ring-primary dark:focus:ring-primary"
            />
            <svg
              class="pointer-events-none absolute left-0 top-0 h-full w-full text-white opacity-0 peer-checked:opacity-100"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="3"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </span>
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

      this.writeValue(valueFromControl);
    });

    if (!this.config || !this.config.key) {

    }

  }

  ngOnDestroy(): void {
    const componentId = this.config?.key || 'UnknownMultiCheckbox';

    this.controlValueChangesSubscription?.unsubscribe();
  }

  writeValue(value: any[] | null): void {
    const componentId = this.config?.key || 'UnknownMultiCheckbox';

    const newValues = Array.isArray(value) ? [...value] : [];

    if (JSON.stringify(this._selectedValues) !== JSON.stringify(newValues)) {
      this._selectedValues = newValues;

    } else {
      // console.log(`MultipleCheckboxComponent (${componentId}): writeValue - nuevo valor es idéntico al actual _selectedValues.`);
    }
  }

  registerOnChange(fn: (value: any[] | null) => void): void {
    const componentId = this.config?.key || 'UnknownMultiCheckbox';

    this.onChangeCallback = fn;
  }

  registerOnTouched(fn: () => void): void {
    const componentId = this.config?.key || 'UnknownMultiCheckbox';

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


    // ----- INICIO DE CAMBIO IMPORTANTE -----
    if (this.control) {
      // Actualiza el FormControl padre directamente
      this.control.setValue(this._selectedValues); // No es necesario { emitEvent: false } aquí, queremos que emita

    } else {

    }

    // Llama a onChangeCallback también, para cumplir con CVA por si algo más depende de ello.
    // Podría ser redundante si this.control.setValue ya hizo todo el trabajo.
    this.onChangeCallback(this._selectedValues);

    // ----- FIN DE CAMBIO IMPORTANTE -----

    this.onTouchedCallback();
  }

  public generateOptionId(optionValue: any, index: number): string {
    const baseKey = this.config?.key || 'multi-checkbox';
    const valueString = optionValue?.toString().replace(/\s+/g, '-') || `val-${index}`;
    return `${baseKey}-${index}-${valueString}`;
  }
}
