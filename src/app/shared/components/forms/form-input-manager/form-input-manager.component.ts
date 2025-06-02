import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormControl, FormArray, AbstractControl, ReactiveFormsModule } from '@angular/forms';

// Importa la interfaz de configuración principal
// Asumo que FormElementConfig está definida en un archivo accesible
// o la puedes definir/importar aquí.
// Por ejemplo, desde tu archivo original:
// interface FormElementConfig { /* ... todas las propiedades ... */ }
// O la versión que hemos estado usando en el showcase:
import { FormElementConfig, FormElementOption } from '../interfaces/form-config.inerface'; // Ajusta la ruta



// Importa TODOS tus componentes de input hijos
import { GenericFileUploadComponent, GenericFileElementConfig } from '../components/generic-file-upload.component';
import { ImageUploadComponent, ImageUploadElementConfig } from '../components/image-upload.component';
import { SingleImageUploadComponent, SingleImageUploadElementConfig } from '../components/single-image-upload.component';
import { RadioButtonGroupComponent, RadioButtonGroupElementConfig, RadioButtonOption } from '../components/radio-button-group.component';
import { ColorPickerComponent, ColorPickerElementConfig } from '../components/color-picker.component';
import { ToggleSwitchComponent, ToggleSwitchElementConfig } from '../components/toggle-switch.component';
import { RangeSliderComponent, RangeSliderElementConfig } from '../components/range-slider.component';
import { DateInputComponent, DateInputElementConfig } from '../components/date-input.component';
import { TextInputComponent, TextInputElementConfig } from '../components/text-input.component';
import { TextareaInputComponent, TextareaElementConfig } from '../components/textarea-input.component';
import { SelectInputComponent, SelectElementConfig, SelectOption } from '../components/select-input.component';
import { CheckboxInputComponent, CheckboxElementConfig } from '../components/checkbox-input.component';
import { MultipleCheckboxComponent, MultipleCheckboxElementConfig, CheckboxOption as MultiCheckboxOption } from '../components/multiple-checkbox.component';
// No olvides el componente para 'label' y 'separator' si los vas a manejar como componentes separados.

@Component({
  selector: 'app-form-input-manager', // Puedes mantener o cambiar este nombre

  imports: [
    CommonModule,
    ReactiveFormsModule,
    GenericFileUploadComponent,
    ImageUploadComponent,
    SingleImageUploadComponent,
    RadioButtonGroupComponent,
    ColorPickerComponent,
    ToggleSwitchComponent,
    RangeSliderComponent,
    DateInputComponent,
    TextInputComponent,
    TextareaInputComponent,
    SelectInputComponent,
    CheckboxInputComponent,
    MultipleCheckboxComponent,
    // Añade aquí los componentes para 'label' y 'separator' si los creas
  ],
  templateUrl: './form-input-manager.component.html',
 })
export class FormInputManagerComponent implements OnInit {
  @Input() element!: FormElementConfig;
  @Input() control!: AbstractControl;
  @Input() parentFormGroup!: FormGroup;
 public objectKeys = Object.keys

  constructor() {}

  ngOnInit(): void {
    if (!this.element) {
      console.error('FormInputManagerComponent: La configuración del elemento (element) es requerida.');
    }
    if (!this.control) {
      console.error(`FormInputManagerComponent: El control para el elemento '${this.element?.key}' es requerido.`);
    }
    if (!this.parentFormGroup && (this.element?.disabledField || this.element?.type === 'text' || this.element?.type === 'email' || this.element?.type === 'number')) {
     }
  }

   get controlAsFormControl(): FormControl {
    if (!(this.control instanceof FormControl)) {
     }
    return this.control as FormControl;
  }

  get controlAsFormArray(): FormArray {
    if (!(this.control instanceof FormArray)) {
     }
    return this.control as FormArray;
  }

}
