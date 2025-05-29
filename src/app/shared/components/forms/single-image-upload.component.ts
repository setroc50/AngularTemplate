import { Component, Input, OnInit, ElementRef, ViewChild, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule, ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

// Interfaz de configuración para este componente
export interface SingleImageUploadElementConfig {
  key: string;
  label?: string;
  accept?: string;       // Ej: 'image/png,image/jpeg'
  defaultImageUrl?: string; // URL para la imagen por defecto si no hay ninguna seleccionada/cargada
}

@Component({
  selector: 'app-single-image-upload',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="single-image-upload-container">
      <label
        *ngIf="config.label"
        [for]="config.key + '-single-image-input'"
        class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
      >
        {{ config.label }}
      </label>
      <input
        #singleImageFileInputRef
        type="file"
        [id]="config.key + '-single-image-input'"
        (change)="onFileSelected($event)"
        [accept]="config.accept || 'image/*'"
        class="hidden"
      />
      <div
        (click)="singleImageFileInputRef.click()"
        class="preview-area w-[150px] h-auto p-2.5 border border-dashed border-gray-400 dark:border-gray-600 rounded-md cursor-pointer hover:border-blue-500 dark:hover:border-blue-400 transition-colors"
        role="button"
        tabindex="0"
        (keydown.enter)="singleImageFileInputRef.click()"
        (keydown.space)="singleImageFileInputRef.click()"
        [title]="currentImageUrl ? 'Cambiar imagen' : 'Seleccionar imagen'"
      >
        <img
          [src]="currentImageUrl || config.defaultImageUrl || '/assets/emptyImage.jpg'"
          alt="{{ config.label || 'Previsualización de imagen' }}"
          class="max-w-full h-auto block rounded"
        />
        <p class="text-center text-xs text-gray-500 dark:text-gray-400 mt-1.5">
          {{ selectedFileName || (currentImageUrl ? 'Cambiar imagen' : 'Seleccionar imagen') }}
        </p>
      </div>
      <div *ngIf="control?.invalid && (control?.touched || control?.dirty)" class="text-red-500 dark:text-red-400 text-xs mt-1">
        <div *ngIf="control?.errors?.['required']">{{ config.label }} es requerida.</div>
        </div>
    </div>
  `,
  styles: [`
    /* Estilos opcionales si Tailwind no cubre algo específico */
    .preview-area:focus {
      outline: 2px solid var(--blue-500, #3b82f6); /* Ajusta el color si es necesario */
      outline-offset: 2px;
    }
  `],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SingleImageUploadComponent),
      multi: true
    }
  ]
})
export class SingleImageUploadComponent implements ControlValueAccessor, OnInit {
  @Input() config!: SingleImageUploadElementConfig;
  @Input() control!: FormControl; // Recibe el FormControl directamente

  @ViewChild('singleImageFileInputRef') singleImageFileInputRef!: ElementRef<HTMLInputElement>;

  currentImageUrl: string | null = null; // URL/base64 para la previsualización
  selectedFileName: string | null = null;
  private selectedFileObject: File | null = null;

  // --- Implementación de ControlValueAccessor ---
  onChange: (value: string | null) => void = () => {};
  onTouched: () => void = () => {};

  writeValue(value: string | null): void {
    // Este método se llama cuando el valor del FormControl se establece desde el exterior
    // (ej. patchValue en el padre o al inicializar el formulario).
    this.currentImageUrl = value;
    this.selectedFileName = null; // Reseteamos el nombre si el valor viene de afuera
    this.selectedFileObject = null;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    // Opcional: maneja el estado deshabilitado si es necesario
    // (ej. deshabilitar el click en el área de previsualización)
    if (this.singleImageFileInputRef?.nativeElement) {
      this.singleImageFileInputRef.nativeElement.disabled = isDisabled;
    }
  }
  // --- Fin de ControlValueAccessor ---

  ngOnInit(): void {
    // Si el control ya tiene un valor al iniciar (ej. desde initialData),
    // writeValue ya lo habrá manejado.
    if (this.control && this.control.value) {
        this.currentImageUrl = this.control.value;
    } else if (this.config?.defaultImageUrl) {
        this.currentImageUrl = this.config.defaultImageUrl;
    }
  }

  onFileSelected(event: Event): void {
    const element = event.target as HTMLInputElement;
    const file = element.files?.[0];

    if (file) {
      if (!file.type.startsWith('image/')) {
        console.warn('Archivo seleccionado no es una imagen:', file.name);
        // Podrías mostrar un error al usuario aquí
        if (this.singleImageFileInputRef?.nativeElement) {
            this.singleImageFileInputRef.nativeElement.value = ''; // Limpiar el input
        }
        return;
      }

      this.selectedFileObject = file;
      this.selectedFileName = file.name;

      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.currentImageUrl = e.target.result as string;
        this.onChange(this.currentImageUrl); // Notifica al FormControl padre el nuevo valor (base64)
        this.onTouched();
      };
      reader.readAsDataURL(file); // Convierte la imagen a base64 para previsualización y valor del form
    } else {
      // Si el usuario cancela la selección de archivo, podríamos querer revertir o no hacer nada.
      // this.currentImageUrl = this.config.defaultImageUrl || null; // O el valor anterior del control
      // this.selectedFileName = null;
      // this.selectedFileObject = null;
      // this.onChange(null); // O el valor anterior
      // this.onTouched();
    }
     // Limpiar el valor del input de archivo para permitir seleccionar el mismo archivo de nuevo
    if (this.singleImageFileInputRef?.nativeElement) {
        this.singleImageFileInputRef.nativeElement.value = '';
    }
  }

  /**
   * Método público opcional para obtener el objeto File real, si es necesario.
   * El FormControl padre ya almacena la representación base64 de la imagen.
   */
  public getActualFile(): File | null {
    return this.selectedFileObject;
  }
}
