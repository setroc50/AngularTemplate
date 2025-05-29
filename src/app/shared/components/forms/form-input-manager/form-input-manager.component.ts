// form-input-manager.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  FormArray,
  FormControl,
  Validators,
  ReactiveFormsModule,
  AbstractControl,
} from '@angular/forms';

// Importa los componentes de input y sus interfaces de configuración
import {
  GenericFileUploadComponent,
  GenericFileElementConfig,
} from '../generic-file-upload.component';
import {
  ImageUploadComponent,
  ImageUploadElementConfig,
} from '../image-upload.component';
import {
  SingleImageUploadComponent,
  SingleImageUploadElementConfig,
} from '../single-image-upload.component';
import {
  RadioButtonGroupComponent,
  RadioButtonGroupElementConfig,
  RadioButtonOption,
} from '../radio-button-group.component';
import {
  ColorPickerComponent,
  ColorPickerElementConfig,
} from '../color-picker.component';
import {
  ToggleSwitchComponent,
  ToggleSwitchElementConfig,
} from '../toggle-switch.component';
import {
  RangeSliderComponent,
  RangeSliderElementConfig,
} from '../range-slider.component';
import {
  DateInputComponent,
  DateInputElementConfig,
} from '../date-input.component';
import {
  TextInputComponent,
  TextInputElementConfig,
} from '../text-input.component';
import {
  TextareaInputComponent,
  TextareaElementConfig,
} from '../textarea-input.component';
import {
  SelectInputComponent,
  SelectElementConfig,
  SelectOption,
} from '../select-input.component';
import {
  CheckboxInputComponent,
  CheckboxElementConfig,
} from '../checkbox-input.component';
import {
  MultipleCheckboxComponent,
  MultipleCheckboxElementConfig,
  CheckboxOption as MultiCheckboxOption,
} from '../multiple-checkbox.component';

@Component({
  selector: 'app-form-input-manager',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, GenericFileUploadComponent, ImageUploadComponent,
    SingleImageUploadComponent, RadioButtonGroupComponent, ColorPickerComponent,
    ToggleSwitchComponent, RangeSliderComponent, DateInputComponent, TextInputComponent,
    TextareaInputComponent, SelectInputComponent, CheckboxInputComponent, MultipleCheckboxComponent,
  ],
  templateUrl: './form-input-manager.component.html',
  styleUrls: ['./form-input-manager.component.css'],
})
export class FormInputManagerComponent implements OnInit {
  showcaseForm!: FormGroup;
  public objectKeys = Object.keys;

  configForGenericUpload: GenericFileElementConfig = { key: 'genericFiles', label: 'Archivos Genéricos', accept: '.pdf,.zip' };
  configForMultiImageUpload: ImageUploadElementConfig = { key: 'multiImages', label: 'Imágenes Múltiples', accept: 'image/*' };
  configForSingleImage: SingleImageUploadElementConfig = { key: 'singleImage', label: 'Imagen Única', defaultImageUrl: '/assets/placeholder-image.png' };
  configForRadioDirect: RadioButtonGroupElementConfig = { key: 'radioDirect', label: 'Radios (Directos)' };
  optionsForRadioDirect: RadioButtonOption[] = [ { value: 'a', name: 'Opción A' }, { value: 'b', name: 'Opción B' }];
  configForRadioResource: RadioButtonGroupElementConfig = { key: 'radioResource', label: 'Radios (Recurso)' };
  optionsForRadioResource: RadioButtonOption[] = [];
  configForSelectDirect: SelectElementConfig = { key: 'selectDirect', label: 'Select (Directo)', placeholder: 'Selecciona...' };
  optionsForSelectDirect: SelectOption[] = [ { value: 's_a', name: 'Select A' }, { value: 's_b', name: 'Select B' }];
  configForSelectResource: SelectElementConfig = { key: 'selectResource', label: 'Select (Recurso)', placeholder: 'Elige...' };
  optionsForSelectResource: SelectOption[] = [];
  configForColorPicker: ColorPickerElementConfig = { key: 'colorPicker', label: 'Selector de Color' };
  configForToggleSwitch: ToggleSwitchElementConfig = { key: 'toggleSwitch', label: 'Interruptor Toggle' };
  configForCheckbox: CheckboxElementConfig = { key: 'simpleCheckbox', label: 'Acepto Términos (Simple)'};
  configForMultiCheckbox: MultipleCheckboxElementConfig = { key: 'userPermissions2', label: 'Permisos (Múltiples Checkboxes)'};
  optionsForMultiCheckbox: MultiCheckboxOption[] = [
    { value: 'CREATE', name: 'Crear' }, { value: 'READ', name: 'Leer' }, { value: 'UPDATE', name: 'Actualizar' }, { value: 'DELETE', name: 'Eliminar', disabled: true }, { value: 'PUBLISH', name: 'Publicar' },
  ];
  configForRangeSlider: RangeSliderElementConfig = { key: 'rangeSlider', label: 'Slider de Rango', min:0, max:100, step:10 };
  configForDateInput: DateInputElementConfig = { key: 'dateInput', label: 'Selector de Fecha', placeholder: 'YYYY-MM-DD' };
  configForConditionalText: TextInputElementConfig = { key: 'conditionalText', label: 'Texto Condicional', type:'text', disabledField: 'textEnabler', disabledValue: 'enable' };
  configForTextEnabler: { key: string; label: string } = { key: 'textEnabler', label: 'Habilitador de Texto' };
  configForEmailInput: TextInputElementConfig = { key: 'emailInput', label: 'Email', type: 'email' };
  configForNumberInput: TextInputElementConfig = { key: 'numberInput', label: 'Número', type: 'number' };
  configForTextarea: TextareaElementConfig = { key: 'textareaInput', label: 'Área de Texto', rows: 3 };

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.optionsForRadioResource = [ { value: 'r_res_a', name: 'Radio Recurso A' }, { value: 'r_res_b', name: 'Radio Recurso B' }];
    this.optionsForSelectResource = [ { value: 100, name: 'Select Recurso 1' }, { value: 200, name: 'Select Recurso 2' }];

    this.showcaseForm = this.fb.group({
      [this.configForGenericUpload.key]: this.fb.array([]),
      [this.configForMultiImageUpload.key]: this.fb.array([]),
      [this.configForSingleImage.key]: [null],
      [this.configForRadioDirect.key]: ['a', Validators.required],
      [this.configForRadioResource.key]: [null, Validators.required],
      [this.configForSelectDirect.key]: ['s_b', Validators.required],
      [this.configForSelectResource.key]: [null, Validators.required],
      [this.configForColorPicker.key]: ['#FF5733', Validators.required],
      [this.configForToggleSwitch.key]: [true, Validators.requiredTrue],
      [this.configForCheckbox.key]: [false, Validators.requiredTrue],
      [this.configForMultiCheckbox.key]: [['READ'], Validators.required], // Valor inicial para MultipleCheckbox
      [this.configForRangeSlider.key]: [30, [Validators.min(Number(this.configForRangeSlider.min ?? 0)), Validators.max(Number(this.configForRangeSlider.max ?? 100))]],
      [this.configForDateInput.key]: ['2025-07-15', Validators.required],
      [this.configForTextEnabler.key]: ['disable'],
      [this.configForConditionalText.key]: ['Bloqueado por defecto'],
      [this.configForEmailInput.key]: ['', [Validators.required, Validators.email]],
      [this.configForNumberInput.key]: [10, [Validators.required, Validators.min(1)]],
      [this.configForTextarea.key]: ['Texto inicial para el área de texto.'],
    });

    // ----- DEBUGGING DIRECTO EN FormInputManagerComponent -----
    const multiCheckboxFormControl = this.showcaseForm.get(this.configForMultiCheckbox.key);
    if (multiCheckboxFormControl) {
      const initialValueJSON = JSON.stringify(multiCheckboxFormControl.value);
      console.log(`FormInputManager: Suscribiéndose a valueChanges de '${this.configForMultiCheckbox.key}' (valor inicial: ${initialValueJSON})`);
      multiCheckboxFormControl.valueChanges.subscribe(value => {
        console.log(`FormInputManager: FormControl '${this.configForMultiCheckbox.key}' CAMBIÓ A:`, value);
      });
    } else {
      console.error(`FormInputManager: No se encontró el FormControl con la clave '${this.configForMultiCheckbox.key}'`);
    }
    // ----- FIN DEBUGGING -----
  }

  public getControlAsFormArray(key: string): FormArray | null {
    const control = this.showcaseForm.get(key);
    return control instanceof FormArray ? control : null;
  }
  public getControlAsFormControl(key: string): FormControl | null {
    const control = this.showcaseForm.get(key);
    return control instanceof FormControl ? control : null;
  }

  onSubmitShowcase(): void {
    console.log('Intento de envío del Formulario de Muestra');
    if (this.showcaseForm.valid) {
      console.log('Formulario de Muestra VÁLIDO y Enviado:', this.showcaseForm.value);
    } else {
      console.error('Formulario de Muestra INVÁLIDO.');
      this.showcaseForm.markAllAsTouched();
      Object.keys(this.showcaseForm.controls).forEach(formKey => {
        const controlInstance = this.showcaseForm.get(formKey);
        if (controlInstance?.errors) {
          console.log('Errores en el control -> ' + formKey + ':', controlInstance.errors);
        }
      });
    }
  }
}
