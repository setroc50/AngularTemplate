import {
  Component,
  Input,
  OnInit,
  OnDestroy,
  ElementRef,
  ViewChild,
  forwardRef,
  HostListener,
} from '@angular/core'; // Asegúrate que todas las importaciones necesarias estén aquí
import { CommonModule } from '@angular/common';
import {
  FormArray,
  FormControl,
  ReactiveFormsModule,
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';
import { Subscription } from 'rxjs';

// ... otras importaciones si son necesarias ...

// La interfaz GenericFileElementConfig debería estar definida aquí o importada
export interface GenericFileElementConfig {
  key: string;
  label?: string;
  accept?: string;
}

@Component({
  selector: 'app-generic-file-upload',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="generic-file-upload-container">
      <label
        *ngIf="config.label"
        [for]="config.key"
        class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
      >
        {{ config.label }}
      </label>

      <div
        class="drop-area p-5 border-2 border-dashed rounded-md text-center cursor-pointer"
        [class.border-blue-500]="isDraggingOverDropArea"
        [class.border-gray-300]="!isDraggingOverDropArea"
        [class.dark:border-blue-400]="isDraggingOverDropArea"
        [class.dark:border-gray-600]="!isDraggingOverDropArea"
        (drop)="handleDropAreaDrop($event)"
        (dragover)="handleDropAreaDragOver($event)"
        (dragleave)="handleDropAreaDragLeave($event)"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="mx-auto h-12 w-12 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="1"
            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
          />
        </svg>
        <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">
          Arrastra y suelta los archivos aquí
        </p>
        <p class="text-xs text-gray-500 dark:text-gray-500 mt-1">o</p>
        <button
          type="button"
          (click)="fileInputRef.click()"
          class="mt-2 bg-gray-200 hover:bg-gray-300 text-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-300 font-semibold py-2 px-4 rounded shadow text-xs"
        >
          Seleccionar archivos
        </button>
      </div>
      <input
        #fileInputRef
        type="file"
        [id]="config.key + '-file-input'"
        (change)="onFileInputChange($event)"
        [accept]="config.accept || ''"
        multiple
        class="hidden"
      />

      @let filesToDisplay = currentFileValues; @let filesLength =
      filesToDisplay.length;

      <div *ngIf="filesLength > 0" class="mt-3 space-y-2">
        <div
          *ngFor="let fileValue of filesToDisplay; let i = index"
          class="draggable-file-item relative flex items-center justify-between p-2 border rounded-md bg-white dark:bg-gray-700 dark:border-gray-600 shadow-sm cursor-move"
          draggable="true"
          (dragstart)="handleItemDragStart(i, $event)"
          (dragover)="handleItemDragOver(i, $event)"
          (drop)="handleItemDrop(i, $event)"
        >
          <div class="flex items-center overflow-hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-6 w-6 text-gray-500 dark:text-gray-400 flex-shrink-0 mr-2"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fill-rule="evenodd"
                d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 0v1.5A1.5 1.5 0 007.5 7H9V4H6zm5.5 0v2.5a.5.5 0 00.5.5H14v-.086L11.586 4H11.5z"
                clip-rule="evenodd"
              />
            </svg>
            <span
              class="text-sm text-gray-700 dark:text-gray-300 truncate"
              [title]="fileValue"
            >
              {{ fileValue }}
            </span>
          </div>
          <button
            type="button"
            (click)="removeFileAtIndex(i)"
            title="Eliminar archivo"
            class="ml-2 p-1 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-500 focus:outline-none"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>

      <p
        class="text-xs text-gray-500 dark:text-gray-400 mt-2"
        *ngIf="filesLength > 0"
      >
        Total de archivos: {{ filesLength }}
      </p>
    </div>
  `, // <--- Fin de la plantilla HTML
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => GenericFileUploadComponent),
      multi: true,
    },
  ],
})
export class GenericFileUploadComponent
  implements OnInit, OnDestroy, ControlValueAccessor
{
  // ... (el resto de tu clase TypeScript como la definimos antes)
  @Input() config!: GenericFileElementConfig;
  @Input() formArrayControl!: FormArray
  @ViewChild('fileInputRef') fileInputRef!: ElementRef<HTMLInputElement>; // Esto seguirá funcionando con plantillas inline

  isDraggingOverDropArea = false;
  private draggedInternalIndex: number | null = null;
  private valueChangesSubscription?: Subscription;

  onChange: (value: any[]) => void = () => {};
  onTouched: () => void = () => {};

  constructor() {} // Añadir constructor si no existe

  ngOnInit(): void {}
  ngOnDestroy(): void {
    this.valueChangesSubscription?.unsubscribe();
  }

  writeValue(value: any[]): void {}
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  get currentFileValues(): any[] {
    return this.formArrayControl
      ? this.formArrayControl.controls.map((control) => control.value)
      : [];
  }

  private _addedFileObjects: File[] = [];

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

  onFileInputChange(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const files = inputElement.files;
    if (files && files.length > 0) {
      this.processIncomingFiles(files);
    }
    if (inputElement) {
      // Asegurar que inputElement no es null
      inputElement.value = '';
    }
  }

  private processIncomingFiles(files: FileList): void {
    const newFilesArray = Array.from(files);
    newFilesArray.forEach((file) => {
      this._addedFileObjects.push(file);
      this.formArrayControl.push(new FormControl(file.name));
    });
    this.onTouched();
    this.onChange(this.formArrayControl.value);
  }

  removeFileAtIndex(indexToRemove: number): void {
    if (
      indexToRemove >= 0 &&
      this.formArrayControl &&
      indexToRemove < this.formArrayControl.length
    ) {
      const removedControlValue = this.formArrayControl.at(indexToRemove).value;
      this.formArrayControl.removeAt(indexToRemove);

      const correspondingFileObjectIndex = this._addedFileObjects.findIndex(
        (f) => f.name === removedControlValue
      );
      if (correspondingFileObjectIndex !== -1) {
        this._addedFileObjects.splice(correspondingFileObjectIndex, 1);
      }
      this.onTouched();
      this.onChange(this.formArrayControl.value);
    }
  }

  handleItemDragStart(index: number, event: DragEvent): void {
    if (event.dataTransfer) {
      event.dataTransfer.effectAllowed = 'move';
    }
    this.draggedInternalIndex = index;
  }

  handleItemDragOver(index: number, event: DragEvent): void {
    if (
      this.draggedInternalIndex !== null &&
      this.draggedInternalIndex !== index
    ) {
      event.preventDefault();
    }
  }

  handleItemDrop(dropIndex: number, event: DragEvent): void {
    event.preventDefault();
    if (
      this.draggedInternalIndex !== null &&
      this.draggedInternalIndex !== dropIndex &&
      this.formArrayControl
    ) {
      const controlToMove = this.formArrayControl.at(this.draggedInternalIndex);
      this.formArrayControl.removeAt(this.draggedInternalIndex);
      this.formArrayControl.insert(dropIndex, controlToMove);

      if (
        this.draggedInternalIndex < this._addedFileObjects.length &&
        dropIndex <= this._addedFileObjects.length
      ) {
        const movedFile = this._addedFileObjects.splice(
          this.draggedInternalIndex,
          1
        )[0];
        if (movedFile) {
          this._addedFileObjects.splice(dropIndex, 0, movedFile);
        }
      }
      this.onTouched();
      this.onChange(this.formArrayControl.value);
    }
    this.draggedInternalIndex = null;
  }

  // No necesitas isDragSourceInternal si no tienes HostListener('dragover')
  // en este componente para el drag de archivos del sistema operativo.
  // El HostListener original era para ese propósito.
  // Los eventos dragover/dragleave en el drop-area son suficientes para su propio highlighting.

  public getActualFiles(): File[] {
    return [...this._addedFileObjects];
  }
}
