import {
  Component,
  Input,
  OnInit,
  OnChanges, // Podrías necesitar OnChanges si formInstance o formConfig cambian dinámicamente
  SimpleChanges,
  // ElementRef, // No se usa en el código actual
  // ViewChild, // No se usa en el código actual
  // inject, // No se usa en el código actual
} from '@angular/core';
import {
  FormGroup,
  ReactiveFormsModule, // ReactiveFormsModule es crucial
  FormArray,
  FormControl,
  // FormBuilder, // Ya no es necesario aquí si el form se pasa como input
  // Validators, // Validadores se aplican en el componente que crea el form
} from '@angular/forms';
import { TitleCasePipe, CommonModule } from '@angular/common';

// import { MultipleCheckboxComponent } from "../form/multiple-checkbox/multiple-checkbox.component"; // Descomenta si se usa en la plantilla
// import { getConfig } from '../../../JSON/jsonConfigs'; // Ya no es necesario
// import { Subscription } from 'rxjs'; // Ya no es necesario si no hay suscripciones activas

// La interfaz FormElementConfig se mantiene si la usas para renderizar el formulario
interface FormElementConfig {
  colZize?: string;
  field?: string;
  type: string;
  key: string;
  label?: string;
  options?: { value: any; name: string }[];
  required?: boolean; // Informativo, la validación ya está en el formInstance
  validators?: string[]; // Informativo
  pattern?: string; // Informativo
  maxLength?: number; // Informativo
  minLength?: number; // Informativo
  min?: number; // Informativo
  max?: number; // Informativo
  step?: number; // Informativo
  accept?: string;
  disabledField?: string;
  disabledValue?: string;
  columns?:{ type:string, separateWords:boolean, name: string; label: string; field: string; align: string }[];
  single?:boolean; // Asegúrate de que la propiedad single exista o remuévela si no es parte de la interfaz
  identifier?:string; // Asegúrate de que la propiedad identifier exista o remuévela si no es parte de la interfaz
  data?:any[]; // Cambiado de 'data:[]' a 'data?:any[]' para mayor flexibilidad
}
@Component({
  selector: 'app-action-poput',
  standalone: true, // Es buena práctica definir si es standalone
  imports: [
    CommonModule,
    ReactiveFormsModule, // Necesario para [formGroup], formControlName, etc.
    TitleCasePipe,
    // MultipleCheckboxComponent // Descomenta si se usa en la plantilla
  ],
  templateUrl: './action-poput.component.html',
  styleUrl: './action-poput.component.css'
})
export class ActionPoputComponent implements OnInit, OnChanges {
  @Input() operation: 'create' | 'edit' | 'delete' = 'create';
  @Input() initialData: any = {};
  @Input() formInstance!: FormGroup; // <--- NUEVO: Recibe el FormGroup construido
  @Input() formConfig: FormElementConfig[] = []; // <--- Recibe la configuración para renderizar

  // Las propiedades group y name ya no son necesarias como Inputs si el form viene de fuera
  // @Input() group:string = "";
  // @Input() name:string = "";

  iconos: { [key: string]: string } = {
    create: 'fa-solid fa-plus',
    edit: 'fa-solid fa-pencil',
    delete: 'fa-solid fa-trash',
    view: 'fa-solid fa-pencil' // view no estaba en tu input 'operation', considera añadirlo
  };

  isVisible = false;

  // Propiedades para manejo de archivos (se mantienen para la UI y la interacción)
  // Estas ahora deben sincronizarse con el formInstance recibido
  selectedFiles: { [key: string]: File[] } = {};
  imagePreviews: { [key: string]: string[] } = {};
  genericFiles: { [key: string]: File[] } = {};
  genericFileNames: { [key: string]: string[] } = {};

  private draggedIndex: number | null = null;
  private draggedKey: string | null = null;
  private draggedGenericIndex: number | null = null;
  private draggedGenericKey: string | null = null;

  // selectedItems y resources/services pueden o no ser necesarios dependiendo de tu lógica
  selectedItems: any[] = [];
  resources: { [key: string]: any } = {};
  // services: [] = []; // Si no se usa, se puede eliminar

  // private routeSubscription: Subscription | undefined; // No más getConfig
  // formData: any; // No más getConfig
  // error: any; // Manejar errores de otra forma si es necesario
  // formGroup: string = ''; // Obsoleto
  // formName: string = ''; // Obsoleto


  constructor(/*private fb: FormBuilder*/) { // FormBuilder ya no se inyecta aquí
    // El constructor ahora está más limpio
  }

  ngOnInit(): void {
    // La creación del formulario se elimina de aquí.
    // El formInstance debe ser válido cuando este componente se inicializa.
    // Puedes añadir validaciones o logs si es necesario:
    if (!this.formInstance) {
      console.error("ActionPoputComponent: formInstance no fue proporcionado.");
      return;
    }
    if (!this.formConfig || this.formConfig.length === 0) {
      console.warn("ActionPoputComponent: formConfig no fue proporcionado o está vacío. El renderizado dinámico puede fallar.");
    }
    this.initializeFileStates();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['formInstance'] && changes['formInstance'].currentValue) {
      // Si el formInstance cambia, podrías necesitar reinicializar estados
      this.initializeFileStates();
      // Si 'initialData' también cambia y necesitas repopular el form:
      // this.openForm(); // Considera el momento adecuado para llamar a esto
    }
    if (changes['initialData'] && this.formInstance) {
        // Si initialData cambia DESPUÉS de que formInstance está listo,
        // y la operación es 'edit', podrías querer repopular.
        if (this.operation === 'edit' && this.isVisible) { // Solo si el popup está visible y en modo edición
             this.populateFormWithInitialData();
        }
    }
  }

  private initializeFileStates(): void {
    if (!this.formInstance || !this.formConfig) return;

    this.formConfig.forEach(element => {
        if (element.type === 'multipleImageDrag' || element.type === 'multipleFileDragGeneric') {
            this.selectedFiles[element.key] = [];
            this.imagePreviews[element.key] = [];
            this.genericFiles[element.key] = [];
            this.genericFileNames[element.key] = [];

            // Si hay initialData, intenta popular las vistas previas/nombres de archivo
            // Esto es crucial si el formInstance ya tiene valores al entrar en modo 'edit'
            const controlValue = this.formInstance.get(element.key)?.value;
            if (this.operation === 'edit' && controlValue) {
                if (element.type === 'multipleImageDrag' && Array.isArray(controlValue)) {
                    // Asumimos que controlValue es un array de URLs para previsualización
                    this.imagePreviews[element.key] = [...controlValue].filter(url => typeof url === 'string');
                } else if (element.type === 'multipleFileDragGeneric' && Array.isArray(controlValue)) {
                    // Para archivos genéricos, el 'controlValue' podría ser más complejo.
                    // Aquí asumimos que podría tener nombres o necesitar lógica para obtenerlos.
                    // Si 'controlValue' en el form son los File objects o data URLs, ajusta según sea necesario.
                    // Por ahora, si son nombres de archivo directamente:
                    // this.genericFileNames[element.key] = [...controlValue].filter(name => typeof name === 'string');
                    // Si necesitas cargar los File objects desde initialData, esa lógica iría aquí.
                }
            }
        }
    });
  }


  private populateFormWithInitialData(): void {
    if (this.formInstance && this.initialData && Object.keys(this.initialData).length > 0) {
        this.formInstance.patchValue(this.initialData);
        this.formConfig?.forEach((element) => {
            const initialValue = this.initialData[element.key];
            if (element.type === 'multipleImageDrag' && Array.isArray(initialValue)) {
                this.imagePreviews[element.key] = [...initialValue];
                this.selectedFiles[element.key] = []; // Los File objects se deben volver a seleccionar
            } else if (element.type === 'multipleFileDragGeneric' && Array.isArray(initialValue)) {
                this.genericFiles[element.key] = []; // Los File objects se deben volver a seleccionar
                // Asumiendo que initialValue para archivos genéricos podría ser una lista de nombres o metadatos
                // Si son nombres, los puedes popular en genericFileNames
                this.genericFileNames[element.key] = initialValue.map(fileData => typeof fileData === 'string' ? fileData : fileData.name || 'archivo');
            }
        });
    }
  }


  openForm(): void {
    if (!this.formInstance) {
      console.error("El formulario (formInstance) no está disponible.");
      return;
    }
    this.isVisible = true;
    if (this.operation === 'edit' && Object.keys(this.initialData).length > 0) {
      this.populateFormWithInitialData();
    } else if (this.operation === 'create') {
      this.formInstance.reset();
      // Limpiar estados de archivos locales
      this.formConfig.forEach(element => {
        if (element.type === 'multipleImageDrag' || element.type === 'multipleFileDragGeneric') {
            this.selectedFiles[element.key] = [];
            this.imagePreviews[element.key] = [];
            this.genericFiles[element.key] = [];
            this.genericFileNames[element.key] = [];
        }
      });
    }
  }

  closeForm(): void {
    this.isVisible = false;
  }

  onSubmit(): void {
    if (!this.formInstance) {
      console.error("El formulario (formInstance) no está disponible para el envío.");
      return;
    }
    if (this.formInstance.valid) {
      console.log('Formulario enviado:', this.formInstance.value);
      console.log('Archivos de imágenes seleccionados (objetos File):', this.selectedFiles);
      console.log('Archivos genéricos seleccionados (objetos File):', this.genericFiles);
      // Aquí tu lógica de envío. Deberás decidir cómo enviar los archivos.
      // this.formInstance.value contendrá las URLs (para imágenes) o nulls (para archivos genéricos si así se configuró)
      // this.selectedFiles y this.genericFiles tienen los objetos File reales.
      this.closeForm();
    } else {
      this.formInstance.markAllAsTouched();
      console.warn('Formulario inválido. Por favor, revisa los campos.');
    }
  }

  // --- MÉTODOS DE MANEJO DE ARCHIVOS ADAPTADOS ---
  // La lógica interna de estos métodos debe ahora actualizar el formInstance también.

  onFileChange(event: any, key: string): void { // Para input de archivo único (no 'multipleImageDrag')
    const file = event.target.files[0];
    if (!this.formInstance.get(key)) {
        console.warn(`Control ${key} no encontrado en el formInstance.`);
        return;
    }

    this.selectedFiles[key] = file ? [file] : []; // selectedFiles almacena el objeto File

    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        // Decide qué almacenar en el formControl: el dataURL o el objeto File
        // Si es para previsualización y luego envías el File object por separado:
        this.imagePreviews[key] = [e.target?.result as string]; // Para previsualizar si es imagen
        this.formInstance.get(key)?.setValue(file); // Almacena el objeto File en el form
        // O si quieres el data URL en el form:
        // this.formInstance.get(key)?.setValue(e.target?.result);
      };
      reader.readAsDataURL(file); // Lee como DataURL para la previsualización
    } else {
      this.formInstance.get(key)?.setValue(null);
      this.imagePreviews[key] = [];
    }
  }

  onMultipleFileChange(event: any, key: string): void { // Para 'multipleImageDrag' o 'multipleFileDragGeneric'
    const files: FileList = event.target.files;
    const elementConfig = this.formConfig.find(el => el.key === key);
    if (elementConfig?.type === 'multipleImageDrag') {
        this.handleMultipleImageFiles(files, key);
    } else if (elementConfig?.type === 'multipleFileDragGeneric') {
        this.handleGenericFiles(files, key);
    }
  }

  handleDropAreaDrop(event: DragEvent, key: string): void { // Para 'multipleImageDrag'
    event.preventDefault();
    const files = event.dataTransfer?.files;
    if (files) {
        const elementConfig = this.formConfig.find(el => el.key === key);
        if (elementConfig?.type === 'multipleImageDrag') {
            this.handleMultipleImageFiles(files, key);
        }
        // No se ha implementado drop para generic files en tu código original con esta función
    }
  }

  handleDragOver(event: DragEvent): void {
    event.preventDefault();
  }

  handleMultipleImageFiles(files: FileList, key: string): void {
    const imageArray = this.formInstance.get(key) as FormArray;
    if (!imageArray) {
        console.warn(`FormArray con key '${key}' no encontrado en formInstance.`);
        return;
    }
    // Mantener una copia de los archivos seleccionados para el envío
    this.selectedFiles[key] = Array.from(files);

    // Limpiar para nuevas previsualizaciones y valores en el FormArray
    this.imagePreviews[key] = [];
    imageArray.clear(); // Limpia el FormArray

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const reader = new FileReader();
      reader.onload = (e) => {
        this.imagePreviews[key]?.push(e.target?.result as string);
        // En el FormArray, puedes guardar la URL de la previsualización o el objeto File
        // Si guardas el objeto File: imageArray.push(new FormControl(file));
        // Si guardas la DataURL (como en tu código original):
        imageArray.push(new FormControl(e.target?.result as string));
      };
      reader.readAsDataURL(file);
    }
  }

  getFileName(key: string): string | null { // Para un solo archivo
    if (this.selectedFiles[key] && this.selectedFiles[key].length > 0) {
      return this.selectedFiles[key][0].name;
    }
    // Podrías intentar obtenerlo del valor del formulario si el File object está ahí
    const controlValue = this.formInstance?.get(key)?.value;
    if (controlValue instanceof File) {
        return controlValue.name;
    }
    return null;
  }

  getMultipleFileNames(key: string): string[] { // Para 'multipleImageDrag'
    return this.selectedFiles[key]?.map((file) => file.name) || [];
  }

  removeImage(key: string, index: number): void { // Para 'multipleImageDrag'
    const imageArray = this.formInstance.get(key) as FormArray;
    if (this.imagePreviews[key] && this.selectedFiles[key] && imageArray) {
      this.imagePreviews[key].splice(index, 1);
      this.selectedFiles[key].splice(index, 1);
      imageArray.removeAt(index);
    }
  }

  // DRAG AND DROP PARA IMÁGENES (multipleImageDrag)
  dragStart(key: string, index: number): void {
    this.draggedIndex = index;
    this.draggedKey = key;
  }

  dragOver(key: string, index: number, event: DragEvent): void {
    if (key === this.draggedKey && index !== this.draggedIndex) {
      event.preventDefault();
    }
  }

  drop(key: string, dropIndex: number): void { // Para 'multipleImageDrag'
    if (
      key === this.draggedKey &&
      this.draggedIndex !== null &&
      this.draggedIndex !== dropIndex
    ) {
      const imageArray = this.formInstance.get(key) as FormArray;
      if (!imageArray) return;

      // Reordenar previews locales
      const draggedPreview = this.imagePreviews[key][this.draggedIndex];
      this.imagePreviews[key].splice(this.draggedIndex, 1);
      this.imagePreviews[key].splice(dropIndex, 0, draggedPreview);

      // Reordenar File objects locales
      const draggedFile = this.selectedFiles[key][this.draggedIndex];
      this.selectedFiles[key].splice(this.draggedIndex, 1);
      this.selectedFiles[key].splice(dropIndex, 0, draggedFile);

      // Reordenar FormControls en el FormArray
      const controls = [...imageArray.controls];
      const draggedControl = controls[this.draggedIndex];
      controls.splice(this.draggedIndex, 1);
      controls.splice(dropIndex, 0, draggedControl);
      imageArray.clear();
      controls.forEach((control) => imageArray.push(control));

      this.draggedIndex = null;
      this.draggedKey = null;
    }
  }

  // --- MÉTODOS PARA ARCHIVOS GENÉRICOS (multipleFileDragGeneric) ---
  handleGenericFileDrop(event: DragEvent, key: string): void {
    event.preventDefault();
    const files = event.dataTransfer?.files;
    if (files) {
      this.handleGenericFiles(files, key);
    }
  }

  handleGenericFiles(files: FileList, key: string): void {
    const filesArray = this.formInstance.get(key) as FormArray;
    if (!filesArray) {
        console.warn(`FormArray con key '${key}' no encontrado en formInstance.`);
        return;
    }
    this.genericFiles[key] = Array.from(files); // Guardar los File objects
    this.genericFileNames[key] = Array.from(files).map((file) => file.name); // Nombres para la UI

    filesArray.clear();
    // En el FormArray, usualmente para archivos genéricos, se guarda el File object o alguna referencia.
    // Tu código original ponía 'null'. Si quieres los File objects:
    Array.from(files).forEach((file) => filesArray.push(new FormControl(file)));
    // Si prefieres nulls como antes, y manejar los File objects solo localmente:
    // Array.from(files).forEach(() => filesArray.push(new FormControl(null)));
  }

  removeGenericFile(key: string, index: number): void {
    const filesArray = this.formInstance.get(key) as FormArray;
    if (this.genericFiles[key] && filesArray) {
      this.genericFiles[key].splice(index, 1);
      this.genericFileNames[key].splice(index, 1);
      filesArray.removeAt(index);
    }
  }

  // DRAG AND DROP PARA ARCHIVOS GENÉRICOS
  dragGenericStart(key: string, index: number): void {
    this.draggedGenericIndex = index;
    this.draggedGenericKey = key;
  }

  dragGenericOver(key: string, index: number, event: DragEvent): void {
    if (key === this.draggedGenericKey && index !== this.draggedGenericIndex) {
      event.preventDefault();
    }
  }

  dropGeneric(key: string, dropIndex: number): void {
    if (
      key === this.draggedGenericKey &&
      this.draggedGenericIndex !== null &&
      this.draggedGenericIndex !== dropIndex
    ) {
      const filesArray = this.formInstance.get(key) as FormArray;
      if (!filesArray) return;

      // Reordenar File objects locales
      const draggedFile = this.genericFiles[key][this.draggedGenericIndex];
      this.genericFiles[key].splice(this.draggedGenericIndex, 1);
      this.genericFiles[key].splice(dropIndex, 0, draggedFile);

      // Reordenar nombres de archivo locales
      const draggedName = this.genericFileNames[key][this.draggedGenericIndex];
      this.genericFileNames[key].splice(this.draggedGenericIndex, 1);
      this.genericFileNames[key].splice(dropIndex, 0, draggedName);

      // Reordenar FormControls en el FormArray
      const controls = [...filesArray.controls];
      const draggedControl = controls[this.draggedGenericIndex];
      controls.splice(this.draggedGenericIndex, 1);
      controls.splice(dropIndex, 0, draggedControl);
      filesArray.clear();
      controls.forEach((control) => filesArray.push(control));

      this.draggedGenericIndex = null;
      this.draggedGenericKey = null;
    }
  }

    onMultipleGenericFileChange(event: any, key: string): void {
    const files: FileList = event.target.files;
    this.handleGenericFiles(files, key);
  }

}
