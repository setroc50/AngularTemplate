import {
  Component,
  Input,
  OnInit,
  OnChanges,
  SimpleChanges,
  ElementRef,
  ViewChild,
  inject,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  FormArray,
  FormControl,
} from '@angular/forms';
import { TitleCasePipe, CommonModule } from '@angular/common';
import { DynamicService } from './../../../services/dynamic-service.service'; // Asegúrate de la ruta correcta
import { TableComponent } from '../layout/table/table.component';
 import { ActionDynamicpoputComponent } from "../action-dynamicpoput-page/action-dynamicpoput-page.component";

interface FormElementConfig {
  colZize?: string;
  field?: string;
  type: string;
  key: string;
  label?: string;
  options?: { value: any; name: string }[];
  required?: boolean;
  validators?: string[];
  pattern?: string;
  maxLength?: number;
  minLength?: number;
  min?: number;
  max?: number;
  step?: number;
  accept?: string;
  disabledField?: string;
  disabledValue?: string;
  columns?:{ type:string, separateWords:boolean, name: string; label: string; field: string; align: string }[];
  single:boolean,
  identifier:string;
  data:[];
  layoutGroup?:string;
  layoutName?:string;
}

@Component({
  selector: 'app-dynamic-form-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TitleCasePipe, TableComponent, ActionDynamicpoputComponent,],
  templateUrl: './dynamic-form-page.component.html',
  styleUrls: ['./dynamic-form-page.component.css'],
})
export class DynamicFormPageComponent implements OnInit, OnChanges {
  private dynamicService = inject(DynamicService);

  @Input() operation: 'create' | 'edit' | 'delete' = 'create';
  @Input() initialData: any = {};
  @Input() formConfigInput: FormElementConfig[] | undefined;

  /*  TEMPORAL * */

  selectedItems: any[] = [];



  resources: { [key: string]: any } = {};
  services: [] = [];
  formFields: [] = [];

  form!: FormGroup;
  formConfig: FormElementConfig[] | undefined;
  isVisible = false;
  private selectedFiles: { [key: string]: File[] } = {};
  imagePreviews: { [key: string]: string[] } = {};
  genericFiles: { [key: string]: File[] } = {}; // Nuevo para archivos genéricos
  genericFileNames: { [key: string]: string[] } = {}; // Para mostrar los nombres
  private draggedIndex: number | null = null;
  private draggedKey: string | null = null;
  private draggedGenericIndex: number | null = null; // Para archivos genéricos
  private draggedGenericKey: string | null = null; // Para archivos genéricos

  iconos: { [key: string]: string } = {
    create: 'fa-solid fa-plus',
    edit: 'fa-solid fa-pencil',

    delete: 'fa-solid fa-trash',
    view: 'fa-solid fa-pencil',
  };
  /**

<i class=""></i>

 */


  @ViewChild('dropArea') dropArea!: ElementRef;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['formConfigInput'] && changes['formConfigInput'].currentValue) {
      this.formConfig = changes['formConfigInput'].currentValue?.[0].fields;
      this.services = changes['formConfigInput'].currentValue?.[0].services;
      this.formFields = changes['formConfigInput'].currentValue?.[0].formFields;
      //this.formConfig = changes['formConfigInput'].currentValue;
      if (this.services && this.services.length > 0) {
        console.log((this.services as any[])[0].related);
        this.cargarRecursos((this.services as any[])[0].related);
      }
      this.createForm();
    }
  }

  cargarRecursos(endpoint: []): void {
    this.dynamicService.getMultipleWithKeys<[]>(endpoint).subscribe(
      (data) => {
        console.log('Recursos cargados:', data);
        this.resources = data;
      },
      (error) => {
        console.error('Error al cargar recursos:', error);
      }
    );
  }

  createForm(): void {
    if (!this.formConfig) {
      return;
    }
    const controls: any = {};
    this.formConfig.forEach((element) => {
      if (element.type === 'multipleImageDrag') {
        controls[element.key] = this.fb.array([]);
        this.selectedFiles[element.key] = [];
        this.imagePreviews[element.key] = [];
        if (
          this.initialData[element.key] &&
          Array.isArray(this.initialData[element.key])
        ) {
          this.initialData[element.key].forEach((url: string) => {
            (controls[element.key] as FormArray).push(new FormControl(url));
            this.imagePreviews[element.key]?.push(url);
          });
        }
      } else if (element.type === 'multipleFileDragGeneric') {
        controls[element.key] = this.fb.array([]);
        this.genericFiles[element.key] = [];
        this.genericFileNames[element.key] = [];
        if (
          this.initialData[element.key] &&
          Array.isArray(this.initialData[element.key])
        ) {
          // Aquí podrías necesitar lógica diferente si initialData contiene información de archivos genéricos
          // Por ahora, solo inicializamos el FormArray
        }
      } else {
        controls[element.key] = [
          this.initialData[element.key] || '',
          this.getValidators(element),
        ];
      }
    });
    this.form = this.fb.group(controls);
  }

  getValidators(element: FormElementConfig): any[] {
    const validatorsList = [];
    if (element.required) {
      validatorsList.push(Validators.required);
    }
    if (element.validators?.includes('email')) {
      validatorsList.push(Validators.email);
    }
    if (element.pattern) {
      validatorsList.push(Validators.pattern(element.pattern));
    }
    if (element.maxLength !== undefined) {
      validatorsList.push(Validators.maxLength(element.maxLength));
    }
    if (element.minLength !== undefined) {
      validatorsList.push(Validators.minLength(element.minLength));
    }
    return validatorsList;
  }

  openForm(): void {
    this.isVisible = true;
    if (this.operation === 'edit' && Object.keys(this.initialData).length > 0) {
      this.form.patchValue(this.initialData);
      this.formConfig?.forEach((element) => {
        if (
          element.type === 'multipleImageDrag' &&
          Array.isArray(this.initialData[element.key])
        ) {
          this.imagePreviews[element.key] = [...this.initialData[element.key]];
          this.selectedFiles[element.key] = [];
        } else if (
          element.type === 'multipleFileDragGeneric' &&
          Array.isArray(this.initialData[element.key])
        ) {
          // Lógica para cargar nombres de archivos iniciales si es necesario
          this.genericFiles[element.key] = [];
          this.genericFileNames[element.key] = [
            ...this.initialData[element.key],
          ]; // Asumiendo initialData tiene nombres
        }
      });
    } else if (this.operation === 'create') {
      this.form.reset();
      this.selectedFiles = {};
      this.imagePreviews = {};
      this.genericFiles = {};
      this.genericFileNames = {};
    }
  }

  closeForm(): void {
    this.isVisible = false;
  }

  onSubmit(): void {
    if (this.form.valid) {
      console.log('Formulario enviado:', this.form.value);
      console.log('Archivos de imágenes seleccionados:', this.selectedFiles);
      console.log('Archivos genéricos seleccionados:', this.genericFiles);
      this.closeForm();
      // Aquí manejar la carga de archivos.
    } else {
      this.form.markAllAsTouched();
    }
  }

  onFileChange(event: any, key: string): void {
    const file = event.target.files[0];
    this.selectedFiles[key] = [file];

    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        this.form.get(key)?.setValue(e.target?.result);
      };
      reader.readAsDataURL(file);
    } else {
      this.form.get(key)?.setValue(null);
    }
  }

  onMultipleFileChange(event: any, key: string): void {
    const files: FileList = event.target.files;
    this.handleMultipleFiles(files, key);
  }

  handleDropAreaDrop(event: DragEvent, key: string): void {
    event.preventDefault();
    const files = event.dataTransfer?.files;
    if (files) {
      this.handleMultipleFiles(files, key);
    }
  }

  handleDragOver(event: DragEvent): void {
    event.preventDefault();
  }

  handleMultipleFiles(files: FileList, key: string): void {
    this.selectedFiles[key] = Array.from(files);
    const imageArray = this.form.get(key) as FormArray;
    this.imagePreviews[key] = [];
    imageArray.clear();

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const reader = new FileReader();
      reader.onload = (e) => {
        imageArray.push(new FormControl(e.target?.result));
        this.imagePreviews[key]?.push(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  }

  getFileName(key: string): string | null {
    if (this.selectedFiles[key] && this.selectedFiles[key].length > 0) {
      return this.selectedFiles[key][0].name;
    }
    return null;
  }

  getMultipleFileNames(key: string): string[] {
    return this.selectedFiles[key]?.map((file) => file.name) || [];
  }

  removeImage(key: string, index: number): void {
    if (this.imagePreviews[key] && this.selectedFiles[key]) {
      this.imagePreviews[key].splice(index, 1);
      this.selectedFiles[key].splice(index, 1);
      const imageArray = this.form.get(key) as FormArray;
      imageArray.removeAt(index);
    }
  }

  dragStart(key: string, index: number): void {
    this.draggedIndex = index;
    this.draggedKey = key;
  }

  dragOver(key: string, index: number, event: DragEvent): void {
    if (key === this.draggedKey && index !== this.draggedIndex) {
      event.preventDefault();
    }
  }

  drop(key: string, dropIndex: number): void {
    if (
      key === this.draggedKey &&
      this.draggedIndex !== null &&
      this.draggedIndex !== dropIndex
    ) {
      const imagePreviews = [...this.imagePreviews[key]];
      const selectedFiles = [...this.selectedFiles[key]];
      const imageArray = this.form.get(key) as FormArray;
      const controls = [...imageArray.controls];

      const draggedPreview = imagePreviews[this.draggedIndex];
      imagePreviews.splice(this.draggedIndex, 1);
      imagePreviews.splice(dropIndex, 0, draggedPreview);
      this.imagePreviews[key] = imagePreviews;

      const draggedFile = selectedFiles[this.draggedIndex];
      selectedFiles.splice(this.draggedIndex, 1);
      selectedFiles.splice(dropIndex, 0, draggedFile);
      this.selectedFiles[key] = selectedFiles;

      const draggedControl = controls[this.draggedIndex];
      controls.splice(this.draggedIndex, 1);
      controls.splice(dropIndex, 0, draggedControl);
      imageArray.clear();
      controls.forEach((control) => imageArray.push(control));

      this.draggedIndex = null;
      this.draggedKey = null;
    }
  }

  // Métodos para archivos genéricos
  onMultipleGenericFileChange(event: any, key: string): void {
    const files: FileList = event.target.files;
    this.handleGenericFiles(files, key);
  }

  handleGenericFileDrop(event: DragEvent, key: string): void {
    event.preventDefault();
    const files = event.dataTransfer?.files;
    if (files) {
      this.handleGenericFiles(files, key);
    }
  }

  handleGenericFiles(files: FileList, key: string): void {
    this.genericFiles[key] = Array.from(files);
    this.genericFileNames[key] = Array.from(files).map((file) => file.name);
    const filesArray = this.form.get(key) as FormArray;
    filesArray.clear();
    Array.from(files).forEach(() => filesArray.push(new FormControl(null))); // No necesitamos la URL, solo el archivo
  }

  removeGenericFile(key: string, index: number): void {
    if (this.genericFiles[key]) {
      this.genericFiles[key].splice(index, 1);
      this.genericFileNames[key].splice(index, 1);
      const filesArray = this.form.get(key) as FormArray;
      filesArray.removeAt(index);
    }
  }

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
      const genericFiles = [...this.genericFiles[key]];
      const genericFileNames = [...this.genericFileNames[key]];
      const filesArray = this.form.get(key) as FormArray;
      const controls = [...filesArray.controls];

      const draggedFile = genericFiles[this.draggedGenericIndex];
      genericFiles.splice(this.draggedGenericIndex, 1);
      genericFiles.splice(dropIndex, 0, draggedFile);
      this.genericFiles[key] = genericFiles;

      const draggedName = genericFileNames[this.draggedGenericIndex];
      genericFileNames.splice(this.draggedGenericIndex, 1);
      genericFileNames.splice(dropIndex, 0, draggedName);
      this.genericFileNames[key] = genericFileNames;

      const draggedControl = controls[this.draggedGenericIndex];
      controls.splice(this.draggedGenericIndex, 1);
      controls.splice(dropIndex, 0, draggedControl);
      filesArray.clear();
      controls.forEach((control) => filesArray.push(control));

      this.draggedGenericIndex = null;
      this.draggedGenericKey = null;
    }
  }
}
