import {
  Component,
  Input,
  OnInit,
  OnChanges,
  SimpleChanges,
} from '@angular/core'; // Añade OnChanges y SimpleChanges
import {
  FormBuilder,
  FormGroup,
  FormControl,
  FormArray,
  AbstractControl,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';

// Importa FormInputManagerComponent y la interfaz de configuración
import { FormInputManagerComponent } from '../form-input-manager/form-input-manager.component'; // Ajusta la ruta
import {
  FormElementConfig,
  FormElementOption,
  SelectOption,
  RadioButtonOption,
  CheckboxOption as MultiCheckboxOption,
} from '../interfaces/form-config.inerface'; // Ajusta la ruta

@Component({
  selector: 'app-form-constuct-manager', // Este es tu selector
  standalone: true, // Asumo que es standalone por 'imports' directamente aquí
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormInputManagerComponent, // Importa el manager
  ],
  templateUrl: './form-construct-manager.component.html',
})
export class FormConstructManager implements OnInit, OnChanges {
  // Implementa OnChanges

  // Renombrado a initialData para consistencia con discusiones previas, y tipado como 'any' o null
  @Input() configData: any | null = null;
  @Input() initialData: any | null = null;
  @Input() operation = ''; // Para saber si es creación o edición
  @Input() endpointRoute: string = '';

  myForm!: FormGroup;
  formStructure: FormElementConfig[] = [];
  public objectKeys = Object.keys;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    console.log(this.endpointRoute, 'InitialData');
    this.defineFormStructure([]);
    this.myForm = this.createFormGroup(); // Crea el formulario
    // Si hay datos iniciales y es edición, popúlalos
    if (this.operation === 'edit' && this.initialData) {
      this.populateForm(this.initialData);
    }
  }

  // ngOnChanges es útil si initialData puede cambiar después de la inicialización
  ngOnChanges(changes: SimpleChanges): void {
    console.log(this.operation, this.initialData, 'DATOS');

    if (
      changes['initialData'] &&
      changes['initialData'].currentValue &&
      this.operation === 'edit'
    ) {
      console.log(this.operation, this.initialData, 'DATOS');

      // Asegúrate que el formulario ya esté construido antes de intentar poblarlo
      if (this.myForm) {
        this.populateForm(changes['initialData'].currentValue);
      }
    }
    // Si la operación cambia, podrías querer limpiar y repopular el formulario
    if (changes['operation'] && this.myForm) {
      this.myForm.reset(); // Limpia el formulario
      if (changes['operation'].currentValue === 'edit' || changes['operation'].currentValue === 'delete'  && this.initialData) {
        this.populateForm(this.initialData);
      }
    }
  }

  defineFormStructure(jsonFiels: []): void {
    // Tu definición de formStructure existente está bien
    this.formStructure = [
      {
        key: 'Pais',
        type: 'radio',
        label: 'Pais',
        required: true,
        options: [
          { value: 'MX', name: 'MX' },
          { value: 'COL', name: 'COL' },
          { value: 'GTM', name: 'GTM' },
        ] as RadioButtonOption[],
      },
      {
        key: 'CodigoDistribuidor',
        type: 'text',
        label: 'Codigo DS',
        placeholder: 'Codigo',
        required: true,
      },
      {
        key: 'Contrasena',
        type: 'text',
        label: 'Contraseña',
        placeholder: 'Contraseña',
        required: true,
      },
      {
        key: 'Correo',
        type: 'email',
        label: 'Correo Electrónico',
        placeholder: 'correoDS@correo.com',
        required: true,
      },
      {
        key: 'CorreosCopia',
        type: 'text',
        label: 'Correos Copia',
        placeholder: 'Separar por ;',
      },
      {
        key: 'Planta',
        type: 'MultipleCheckbox',
        label: 'Almacenes - Stocks',
        required: true,
        options: [
          { value: 1010, name: 'MX-Guadalajara' },
          { value: 1011, name: 'MX-Algarín' },
          { value: 1012, name: 'MX-Monterrey' },
          { value: 1013, name: 'MX-Gustavo Baz' },
          { value: 1014, name: 'MX-Torreón' },
          { value: 1210, name: 'COL-Colombia' },
          { value: 1211, name: 'COL-RIC' },
          { value: 1310, name: 'GTM-Guatemala' },
        ] as MultiCheckboxOption[],
      },
      { key: 'Estatus', type: 'toggle', label: 'Estatus' },
      { key: 'Precio', type: 'toggle', label: 'Precio' },
    ];
  }

  createFormGroup(): FormGroup {
    const group: { [key: string]: AbstractControl } = {};
    this.formStructure.forEach((field) => {
      let control: AbstractControl;
      const initialValue =
        this.operation === 'edit'||
        this.operation === 'delete'  &&
        this.initialData &&
        this.initialData[field.key] !== undefined
          ? this.initialData[field.key]
          : field.type === 'toggle' || field.type === 'checkbox'
          ? false
          : field.type === 'MultipleCheckbox'
          ? []
          : ''; // Valor por defecto

      const validators = [];
      if (field.required) {
        if (field.type === 'toggle' || field.type === 'checkbox') {
          validators.push(Validators.requiredTrue);
        } else {
          validators.push(Validators.required);
        }
      }
      // ... (tus otros validadores) ...
      if (field.type === 'email') {
        validators.push(Validators.email);
      }

      if (
        field.type === 'multipleFileDragGeneric' ||
        field.type === 'multipleImageDrag'
      ) {
        control = this.fb.array(initialValue || [], validators);
      } else if (field.type === 'MultipleCheckbox') {
        control = this.fb.control(initialValue || [], validators); // El valor inicial es un array
      } else if (field.type === 'toggle' || field.type === 'checkbox') {
        control = this.fb.control(!!initialValue, validators); // Asegura que sea booleano
      } else {
        control = this.fb.control(initialValue, validators);
      }
      group[field.key] = control;
    });
    return this.fb.group(group);
  }

  // Nuevo método para poblar el formulario
  private populateForm(data: any): void {
    if (this.myForm && data) {
      // patchValue es útil porque solo actualiza los controles que coinciden
      // y no da error si faltan algunos campos en 'data' o en el form.
      this.myForm.patchValue(data);
      console.log('Formulario populado con:', data);
    }
  }

  onActualFormSubmit(): void {
    if (this.myForm.valid) {
      let dataToSubmit = { ...this.myForm.value };
      if (
        this.operation === 'edit' &&
        this.initialData &&
        this.initialData.id
      ) {
         dataToSubmit = { ...this.initialData, ...this.myForm.value }; // Conserva el ID y otras props no editables del initialData
      }
      console.log('Formulario Principal Enviado:', dataToSubmit);
     } else {
      console.error(
        'Formulario Principal Inválido. Por favor, revisa los campos.'
      );
      this.myForm.markAllAsTouched();
    }
  }

  getControl(key: string): AbstractControl | null {
    return this.myForm.get(key);
  }
}
