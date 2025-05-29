import { Component, Input, OnInit, OnDestroy, ElementRef, ViewChild, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormControl, ReactiveFormsModule, ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Subscription } from 'rxjs';

// Interfaz de configuración para este componente específico
export interface ImageUploadElementConfig {
  key: string;
  label?: string;
  accept?: string; // Por defecto será 'image/*'
}

@Component({
  selector: 'app-image-upload',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
<div class="image-upload-container">
  <label
    *ngIf="config.label"
    [for]="config.key + '-image-input'"
    class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
  >
    {{ config.label }}
  </label>

  <div
    #dropAreaRef
    class="drop-area p-5 border-2 border-dashed rounded-md text-center cursor-pointer"
    [class.border-blue-500]="isDraggingOverDropArea"
    [class.border-gray-300]="!isDraggingOverDropArea"
    [class.dark:border-blue-400]="isDraggingOverDropArea"
    [class.dark:border-gray-600]="!isDraggingOverDropArea"
    (drop)="handleDropAreaDrop($event)"
    (dragover)="handleDropAreaDragOver($event)"
    (dragleave)="handleDropAreaDragLeave($event)"
  >
    <svg xmlns="http://www.w3.org/2000/svg" class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
    <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">
      Arrastra y suelta las imágenes aquí
    </p>
    <p class="text-xs text-gray-500 dark:text-gray-500 mt-1">o</p>
    <button
      type="button"
      (click)="imageUploadInputRef.click()"
      class="mt-2 bg-gray-200 hover:bg-gray-300 text-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-300 font-semibold py-2 px-4 rounded shadow text-xs"
    >
      Seleccionar imágenes
    </button>
  </div>
  <input
    #imageUploadInputRef
    type="file"
    [id]="config.key + '-image-input'"
    (change)="onMultipleFileChange($event)"
    [accept]="config.accept || 'image/*'"
    multiple
    class="hidden"
  />

  @let currentPreviews = imagePreviews;
  @let previewsLength = currentPreviews.length;

  <div *ngIf="previewsLength > 0" class="mt-3 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
    <div
      *ngFor="let previewUrl of currentPreviews; let i = index"
      class="relative cursor-move aspect-square border rounded-md overflow-hidden shadow-sm bg-gray-50 dark:bg-gray-700"
      draggable="true"
      (dragstart)="dragStart(i)"
      (dragover)="dragOver(i, $event)"
      (drop)="drop(i)"
    >
      <img
        [src]="previewUrl"
        alt="Imagen seleccionada {{ i + 1 }}"
        class="w-full h-full object-cover"
      />
      <button
        type="button"
        (click)="removeImage(i)"
        title="Eliminar imagen"
        class="absolute top-1 right-1 bg-red-600 hover:bg-red-700 text-white rounded-full w-6 h-6 flex items-center justify-center focus:outline-none shadow-md opacity-80 hover:opacity-100"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  </div>

  @let newFileNames = currentSelectedFileNames;
  <p class="text-xs text-gray-500 dark:text-gray-400 mt-2" *ngIf="newFileNames.length > 0">
    Archivos nuevos seleccionados: {{ newFileNames.join(", ") }}
  </p>
</div>
  `,
  styles: [`
    /* :host { display: block; } */
    /* Tailwind v3+ ya incluye 'aspect-square', pero si usas una versión anterior o necesitas un fallback: */
    /*
    .aspect-square {
      aspect-ratio: 1 / 1;
    }
    */
  `],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ImageUploadComponent),
      multi: true
    }
  ]
})
export class ImageUploadComponent implements OnInit, OnDestroy, ControlValueAccessor {
  @Input() config!: ImageUploadElementConfig;
  @Input() formArrayControl!: FormArray;

  @ViewChild('imageUploadInputRef') imageUploadInputRef!: ElementRef<HTMLInputElement>;

  imagePreviews: string[] = [];
  selectedFiles: File[] = [];
  private draggedImageIndex: number | null = null;
  isDraggingOverDropArea = false;

  private controlValueSubscription?: Subscription;

  onChange: (value: any[]) => void = () => {};
  onTouched: () => void = () => {};

  constructor() {}

  writeValue(value: any[]): void {
    if (value && Array.isArray(value)) {
      this.imagePreviews = [...value];
      this.selectedFiles = [];
    } else {
      this.imagePreviews = [];
      this.selectedFiles = [];
    }
  }

  registerOnChange(fn: any): void { this.onChange = fn; }
  registerOnTouched(fn: any): void { this.onTouched = fn; }

  ngOnInit(): void {
    if (this.formArrayControl) {
      this.writeValue(this.formArrayControl.value);
      this.controlValueSubscription = this.formArrayControl.valueChanges.subscribe(values => {
        this.imagePreviews = values ? [...values] : [];
      });
    }
  }

  ngOnDestroy(): void {
    this.controlValueSubscription?.unsubscribe();
  }

  handleDropAreaDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDraggingOverDropArea = false;
    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      this.processIncomingFiles(files);
    }
  }

  handleDropAreaDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDraggingOverDropArea = true;
  }

  handleDropAreaDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDraggingOverDropArea = false;
  }

  onMultipleFileChange(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const files = inputElement.files;
    if (files && files.length > 0) {
      this.processIncomingFiles(files);
    }
    if (inputElement) {
        inputElement.value = '';
    }
  }

  private processIncomingFiles(files: FileList): void {
    const newFilesArray = Array.from(files).filter(file => file.type.startsWith('image/'));

    newFilesArray.forEach(file => {
      this.selectedFiles.push(file);
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const base64Result = e.target.result as string;
        // No modificamos this.imagePreviews directamente aquí si está ligado a formArrayControl.valueChanges
        // En su lugar, actualizamos el FormArray, y valueChanges actualizará imagePreviews.
        this.formArrayControl.push(new FormControl(base64Result));
        // Si no usaras valueChanges para imagePreviews, entonces sí: this.imagePreviews.push(base64Result);
        this.onTouched();
        this.onChange(this.formArrayControl.value); // Notifica que el valor del FormArray cambió
      };
      reader.readAsDataURL(file);
    });
  }

  removeImage(indexToRemove: number): void {
    if (indexToRemove >= 0 && indexToRemove < this.formArrayControl.length) {
      this.formArrayControl.removeAt(indexToRemove); // Esto disparará valueChanges y actualizará imagePreviews

      // Lógica para quitar de `selectedFiles` (los File objects nuevos)
      // Esta lógica asume que los archivos nuevos se añaden al final del FormArray
      // y que `selectedFiles` mantiene el mismo orden relativo.
      // Contamos cuántos ítems iniciales (no nuevos) había antes de este borrado.
      // El número de ítems en formArrayControl *antes* de este borrado, menos los nuevos archivos,
      // nos da el conteo de los ítems "viejos".
      // O, más simple: si imagePreviews y selectedFiles se mantienen en sintonía de alguna forma.
      // La lógica original del `DynamicFormSecondaryPageComponent` para `removeImage` era:
      // this.imagePreviews[key].splice(index, 1);
      // this.selectedFiles[key].splice(index, 1);
      // (imageArray as FormArray).removeAt(index);
      // Dado que imagePreviews ahora se deriva de formArrayControl.value, solo necesitamos
      // preocuparnos por selectedFiles.

      // Intenta encontrar si el archivo borrado estaba entre los nuevos (selectedFiles).
      // Esto es imperfecto sin IDs únicos. Una estrategia simple es si el índice
      // corresponde a un archivo recién añadido.
      // Si `formArrayControl.at(indexToRemove).value` (antes de borrarlo) era un base64
      // que generaste para un archivo en `selectedFiles`, podrías buscarlo.
      // Por ahora, esta es una heurística:
      const initialImageCountBeforeThisSession = this.formArrayControl.length - this.selectedFiles.length; // Longitud ANTES de quitar el elemento del FormArray
      if (indexToRemove >= initialImageCountBeforeThisSession) {
          const newFileIndex = indexToRemove - initialImageCountBeforeThisSession;
          if (newFileIndex >= 0 && newFileIndex < this.selectedFiles.length) {
              this.selectedFiles.splice(newFileIndex, 1);
          }
      }

      this.onTouched();
      this.onChange(this.formArrayControl.value); // Notifica que el valor del FormArray cambió
    }
  }

  dragStart(index: number): void {
    this.draggedImageIndex = index;
  }

  dragOver(index: number, event: DragEvent): void {
    if (this.draggedImageIndex !== null && this.draggedImageIndex !== index) {
      event.preventDefault();
    }
  }

  drop(dropIndex: number): void {
    if (this.draggedImageIndex !== null && this.draggedImageIndex !== dropIndex) {
      const controlToMove = this.formArrayControl.at(this.draggedImageIndex);
      this.formArrayControl.removeAt(this.draggedImageIndex);
      this.formArrayControl.insert(dropIndex, controlToMove);

      // Reordenar `selectedFiles` si es necesario y si su orden es importante.
      // Esta parte es la más compleja de mantener sincronizada sin identificadores únicos.
      // Si `selectedFiles` solo contiene los archivos *nuevos* y se asume que se añaden al final,
      // y el reordenamiento solo afecta a esos nuevos archivos o a la lista completa.
      if (this.draggedImageIndex < this.selectedFiles.length && dropIndex < this.selectedFiles.length) {
          // Solo reordena dentro de `selectedFiles` si ambos índices están dentro de su rango
          const movedFile = this.selectedFiles.splice(this.draggedImageIndex, 1)[0];
          if (movedFile) {
              this.selectedFiles.splice(dropIndex, 0, movedFile);
          }
      }
      // Si el reordenamiento mezcla archivos "viejos" (del initialData) con "nuevos",
      // la sincronización de `selectedFiles` es más difícil y podría no ser necesaria
      // si solo te importa el orden en `formArrayControl` y la colección de `selectedFiles` para subir.

      this.onTouched();
      this.onChange(this.formArrayControl.value);
    }
    this.draggedImageIndex = null;
  }

  get currentSelectedFileNames(): string[] {
    return this.selectedFiles.map(file => file.name);
  }

  public getNewActualFiles(): File[] {
    return [...this.selectedFiles];
  }
}
