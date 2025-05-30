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
import { GenericFileUploadComponent, GenericFileElementConfig } from '../generic-file-upload.component';
import { ImageUploadComponent, ImageUploadElementConfig } from '../image-upload.component';
import { SingleImageUploadComponent, SingleImageUploadElementConfig } from '../single-image-upload.component';
import { RadioButtonGroupComponent, RadioButtonGroupElementConfig, RadioButtonOption } from '../radio-button-group.component';
import { ColorPickerComponent, ColorPickerElementConfig } from '../color-picker.component';
import { ToggleSwitchComponent, ToggleSwitchElementConfig } from '../toggle-switch.component';
import { RangeSliderComponent, RangeSliderElementConfig } from '../range-slider.component';
import { DateInputComponent, DateInputElementConfig } from '../date-input.component';
import { TextInputComponent, TextInputElementConfig } from '../text-input.component';
import { TextareaInputComponent, TextareaElementConfig } from '../textarea-input.component';
import { SelectInputComponent, SelectElementConfig, SelectOption } from '../select-input.component';
import { CheckboxInputComponent, CheckboxElementConfig } from '../checkbox-input.component';
import { MultipleCheckboxComponent, MultipleCheckboxElementConfig, CheckboxOption as MultiCheckboxOption } from '../multiple-checkbox.component';
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
  styleUrls: ['./form-input-manager.component.css'],
})
export class FormInputManagerComponent implements OnInit {
  @Input() element!: FormElementConfig;          // Configuración para UN SOLO campo
  @Input() control!: AbstractControl;            // El FormControl o FormArray para este campo
  @Input() parentFormGroup!: FormGroup;
         // El FormGroup padre (para dependencias)
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
      // TextInputComponent espera parentFormGroup si usa disabledField.
      // Podríamos hacerlo opcional en TextInputComponent si disabledField no está presente.
      // console.warn(`FormInputManagerComponent: parentFormGroup no fue provisto para el elemento '${this.element?.key}'. Algunas funcionalidades podrían no estar disponibles.`);
    }
  }

  // Getters para castear el 'control' a su tipo específico en la plantilla
  // Esto ayuda a la verificación de tipos de Angular en la plantilla.
  get controlAsFormControl(): FormControl {
    if (!(this.control instanceof FormControl)) {
      // Este log es útil durante el desarrollo.
      // console.warn(`Se esperaba un FormControl para el elemento '${this.element?.key}', pero se recibió otro tipo de AbstractControl.`);
    }
    return this.control as FormControl;
  }

  get controlAsFormArray(): FormArray {
    if (!(this.control instanceof FormArray)) {
      // console.warn(`Se esperaba un FormArray para el elemento '${this.element?.key}', pero se recibió otro tipo de AbstractControl.`);
    }
    return this.control as FormArray;
  }

  // Helpers para castear la configuración del elemento si los componentes hijos esperan un tipo más específico.
  // Si FormElementConfig ya es un superconjunto compatible, estos podrían no ser estrictamente necesarios
  // o podrían simplemente hacer un casteo directo 'as SpecificConfig'.
  // Por ahora, asumiré que los componentes hijos aceptan FormElementConfig directamente
  // o que sus propias interfaces de config son compatibles con las propiedades de FormElementConfig.

  // Ejemplo si fuera necesario:
  // get textInputConfig(): TextInputElementConfig { return this.element as TextInputElementConfig; }
  // get selectConfig(): SelectElementConfig { return this.element as SelectElementConfig; }
  // etc.
  // Por simplicidad, pasaremos 'element' directamente y los componentes hijos tomarán las props que necesiten.
  // Las interfaces específicas de config en los hijos son más para documentación y claridad del @Input.
}
