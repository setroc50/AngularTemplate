import { Component, Input, Output, EventEmitter, ContentChild,TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Importa FormsModule para usar ngModel
import { ActionPoputComponent } from '../action-poput/action-poput.component';


@Component({
  selector: 'app-table',
  imports: [CommonModule, FormsModule,ActionPoputComponent],
  templateUrl: './table.component.html',
  styleUrl: './table.component.css'
})
export class TableComponent {

  @ContentChild(TemplateRef) rowTemplate!: TemplateRef<any>;

  @Input() name: string = 'tabla'; // Propiedad para determinar si es selección única o múltiple
  @Input() columns: { separateWords:boolean, type:string, name: string; label: string; field: string; align: string }[] = [];
  @Input() data: any[] = [];
  @Input() single: boolean = false; // Propiedad para determinar si es selección única o múltiple
  @Input() identifier: string = 'id'; // Propiedad para determinar si es selección única o múltiple
  @Output() selectedItemsChange = new EventEmitter<any[]>();

  currentPage = 1;
  itemsPerPage = 15;
  selectAll = false;
  selectedItems: any[] = [];
  searchQuery: string = '';
  filteredData: any[] = [];

  // Método para aplicar el filtro de búsqueda
  applyFilter(): void {
    if (this.searchQuery) {
      this.filteredData = this.data.filter(item => {
        return this.columns.some(col => {
          const value = item[col.field];
          return value && value.toString().toLowerCase().includes(this.searchQuery.toLowerCase());
        });
      });
    } else {
      this.filteredData = [...this.data];
    }
    this.currentPage = 1; // Reinicia la paginación al aplicar el filtro
  }

  // Método para manejar la selección/deselección de todos los elementos
  toggleSelectAll(): void {
    if (!this.single) {
      this.selectAll = !this.selectAll;
      this.selectedItems = this.selectAll ? [...this.filteredData] : [];
      this.emitSelectedItems();
    }
  }

  // Método para manejar la selección/deselección de un item individual
  toggleItemSelection(item: any): void {
    if (this.single) {
      // Si es selección única, solo puede haber un item seleccionado
      if (this.selectedItems.includes(item)) {
        // Si el item ya está seleccionado, lo deseleccionamos
        this.selectedItems = [];
      } else {
        // Si no está seleccionado, lo seleccionamos y reemplazamos el array
        this.selectedItems = [item];
      }
    } else {
      // Si no es selección única, permite agregar o quitar ítems del array
      const index = this.selectedItems.indexOf(item);
      if (index === -1) {
        this.selectedItems.push(item);
      } else {
        this.selectedItems.splice(index, 1);
      }
      this.selectAll = this.selectedItems.length === this.paginatedData.length;
    }
    this.emitSelectedItems();
  }

  // Método para emitir los elementos seleccionados al componente padre
  emitSelectedItems(): void {
    this.selectedItemsChange.emit(this.selectedItems);
  }

  // Método para obtener los datos paginados
  get paginatedData(): any[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.filteredData.slice(startIndex, endIndex);
  }

  // Método para cambiar de página
  changePage(page: number): void {
    this.currentPage = page;
  }

  // Método para obtener el número total de páginas
  get totalPages(): number {
    return Math.ceil(this.filteredData.length / this.itemsPerPage);
  }

  // Inicializa filteredData con los datos originales
  ngOnInit(): void {
    this.filteredData = [...this.data];
  }

}
