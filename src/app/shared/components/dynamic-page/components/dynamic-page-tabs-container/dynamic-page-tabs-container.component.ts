import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // Necesario para *ngFor, *ngIf, [ngClass], [hidden], | json
import { DynamicPageTableComponent} from '../dynamic-page-components-table/dynamic-page-components-table.component'; // Asegúrate que la ruta sea correcta

// ========= IMPORTANTE: Definición de Interfaces =========
export interface TabFieldConfig {
  type: string;         // 'table', 'form', 'placeholder', etc.
  key: string;          // Identificador único para este fieldConfig dentro de la pestaña
  label?: string;       // Un título o etiqueta para el componente (ej. título de la tabla)
  colZize?: string;     // Para layout si usas un sistema de columnas

  // Propiedades comunes para componentes de tipo 'table'
  columns?: { type: string, separateWords: boolean, name: string; label: string; field: string; align: string }[];
  single?: boolean;
  identifier?: string;
  data?: any[];         // Array de datos para la tabla (puede ser provisto aquí o a través de 'resources')
  headerTools?: string[]; // Herramientas para el encabezado de la tabla (si la tabla interna las maneja)
   innerTools?: string[];  // Herramientas para las filas de la tabla
  layoutName?: string;  // Para pasar a subcomponentes si es necesario
  layoutGroup?: string; // Para pasar a subcomponentes si es necesario
  rowActionsConfig?: any; // Configuración específica para las acciones de fila de la tabla interna

  // Propiedades para otros tipos de 'fieldConfig'
  content?: string; // Para type: 'placeholder'
  formElements?: FormConfig[]; // Para type: 'form'

  [key: string]: any; // Para cualquier otra propiedad específica del tipo
}

// Interfaz FormConfig (si la necesitas para 'formElements')
export interface FormConfig {
  colZize?: string;
  field?: string;
  type: string;
  key: string;
  label?: string;
  options?: { value: any; name: string }[];
  required?: boolean;
  // ... más propiedades de configuración de formulario ...
}

export interface TabConfig {
  tabTitle: string;
  tabKey: string;
  isActive: boolean;
  icon?: string;
  fields: TabFieldConfig[]; // Array de configuraciones de campo para esta pestaña
}

export interface PageTabsConfig {
  pageTitle?: string;
  layoutType: 'tabsContainer';
  tabs: TabConfig[];
}
// ========= Fin de Definición de Interfaces =========

@Component({
  selector: 'app-dynamic-page-tabs-container',
  standalone: true,
  imports: [
    CommonModule,
    DynamicPageTableComponent // Importa tu componente de tabla
  ],
  template: `
<div class="tabs-container font-sans" *ngIf="config && config.tabs && config.tabs.length > 0">
  <div class="tab-headers-scroll-container bg-slate-100 dark:bg-slate-800 rounded-t-md">
    <div class="tab-headers flex border-b border-slate-300 dark:border-slate-700">
      <button
        *ngFor="let tab of config.tabs; let i = index"
        type="button"
        role="tab"
        [attr.aria-selected]="activeTabIndex === i"
        [attr.aria-controls]="'tabpanel-' + tab.tabKey"
        [id]="'tab-' + tab.tabKey"
        (click)="activateTab(i)"
        class="px-4 sm:px-6 py-3 text-sm font-medium border-b-2 focus:outline-none transition-colors duration-200 ease-in-out"
        [ngClass]="{
          'active-tab border-primary text-primary dark:border-primary-dark dark:text-primary-dark': activeTabIndex === i,
          'inactive-tab border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:border-slate-500 focus-visible:ring-2 focus-visible:ring-primary dark:focus-visible:ring-primary-dark focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-800': activeTabIndex !== i
        }">
        <span class="truncate">{{ tab.tabTitle }}</span>
      </button>
    </div>
  </div>

  <div class="tab-content-area bg-white dark:bg-slate-900 rounded-b-md relative min-h-[83vh] shadow-md">
    <ng-container *ngFor="let tab of config.tabs; let i = index">
      <div
        role="tabpanel"
        [id]="'tabpanel-' + tab.tabKey"
        [attr.aria-labelledby]="'tab-' + tab.tabKey"
        tabindex="0"
        class="tab-pane outline-none overflow-y-auto h-full"
        [hidden]="activeTabIndex !== i">
        <div class="p-1 sm:p-2"> <div *ngFor="let element of tab.fields" class="field-container mb-4 last:mb-0">
            <ng-container [ngSwitch]="element.type">

              <div *ngSwitchCase="'table'">
                <app-dynamic-page-components-table
                  [name]="element.label || element.key || ''"
                  [columns]="element.columns || []"
                  [single]="element.single || false"
                  [identifier]="element.identifier || 'id'"
                  [data]="resources[element.key].response"
                  [innerTools]="element.innerTools || []"
                  [headerTools]="element.headerTools || []"
                  [form]="allJson && allJson[0] ? allJson[0].form : []"
                  (selectedItemsChange)="handleTableSelectionChange(element.key, $event)"
                >
                </app-dynamic-page-components-table>
                </div>

              <div *ngSwitchCase="'form'">
                <p class="p-4 bg-blue-100 text-blue-700 rounded dark:bg-blue-900 dark:text-blue-300">
                  Renderizaría un Formulario (key: {{element.key}}).
                  </p>
              </div>

              <div *ngSwitchCase="'placeholder'">
                <div [innerHTML]="element.content"></div>
              </div>

              <div *ngSwitchDefault>
                <p class="p-4 bg-red-100 text-red-700 rounded dark:bg-red-900 dark:text-red-300">
                  Tipo de elemento desconocido: {{element.type}} (key: {{element.key}})
                </p>
              </div>
            </ng-container>
          </div>
        </div>
      </div>
    </ng-container>
  </div>
</div>

<div *ngIf="!config || !config.tabs || config.tabs.length === 0" class="p-4">
  <p class="text-slate-500 dark:text-slate-400 italic">No hay pestañas para mostrar. Verifica la configuración.</p>
</div>
  `,
  styles: [`
    /* Estilos CSS que complementan a Tailwind o son difíciles de hacer solo con utilidades */
    .tab-headers-scroll-container {
      -ms-overflow-style: none;  /* IE y Edge */
      scrollbar-width: none;  /* Firefox */
    }
    .tab-headers-scroll-container::-webkit-scrollbar {
      display: none; /* Chrome, Safari, y Opera */
    }
    .tab-header-button {
      margin-bottom: -2px; /* Solapa el borde inferior del contenedor .tab-headers */
    }
    /* Define tus colores primarios en :root o en tailwind.config.js */
    :host { /* O :root en tu CSS global si prefieres */
      --primary: #6366F1; /* Indigo-500 de Tailwind por defecto */
      --primary-dark: #818CF8; /* Indigo-400 de Tailwind por defecto */
    }
  `]
})
export class DynamicPageTabsContainerComponent implements OnInit {
  @Input() config!: PageTabsConfig;
  @Input() allJson:any[] = [{}]; // Asegúrate que la estructura de allJson[0].form sea la que esperas
  @Input() resources: { [key: string]: any } = {};

  activeTabIndex: number = 0;
  public selectedItemsPerTable: { [tableKey: string]: any[] } = {};

  constructor() {}

  ngOnInit() {
    if (this.config && this.config.tabs && this.config.tabs.length > 0) {
      const defaultActive = this.config.tabs.findIndex(tab => tab.isActive === true);
      this.activeTabIndex = defaultActive !== -1 ? defaultActive : 0;
    } else {
      this.activeTabIndex = 0;
      // console.warn('DynamicPageTabsContainerComponent: La configuración de pestañas no fue provista, está vacía o es inválida.');
    }
  }

  activateTab(index: number): void {
    if (this.config && this.config.tabs && index >= 0 && index < this.config.tabs.length) {
      this.activeTabIndex = index;
    }
  }

  handleTableSelectionChange(tableKey: string, selectedItems: any[]): void {
    this.selectedItemsPerTable[tableKey] = selectedItems;
  }

  getDataForTable(tableKey: string, elementData?: any[]): any[] {
    // Prioridad 1: Datos directamente en element.data (si tu JSON lo provee así y tiene contenido)
    if (elementData && Array.isArray(elementData) && elementData.length > 0) {
      return elementData;
    }
    // Prioridad 2: Datos desde el objeto 'resources' pasado por el padre
    if (this.resources && this.resources[tableKey] && this.resources[tableKey].response && Array.isArray(this.resources[tableKey].response)) {
      return this.resources[tableKey].response;
    }
    // Fallback a un array vacío si no se encuentran datos
    return [];
  }
}
