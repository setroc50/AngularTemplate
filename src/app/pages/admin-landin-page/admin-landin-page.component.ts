import { Component } from '@angular/core';
import { TableComponent } from '../../shared/components/layout/table/table.component';
 import * as createFormConfig from "./formtestTemplate.json"
 import { DynamicFormComponent } from '../../shared/components/dynamic-form/dynamic-form.component'; // Asegúrate de la ruta correcta
import { CommonModule, JsonPipe } from '@angular/common';


@Component({
  selector: 'app-admin-landin-page',
  imports: [TableComponent,DynamicFormComponent, CommonModule],
  templateUrl: './admin-landin-page.component.html',
  styleUrl: './admin-landin-page.component.css'
})
export class AdminLandinPageComponent {

  createFormConfig = (createFormConfig as any).default;



  columns = [
    {type:"test", separateWords:false,  name: 'id', label: 'ID', field: 'id', align: 'left' },
    {type:"test", separateWords:false, name: 'name', label: 'Name2', field: 'age', align: 'left' },
    {type:"test", separateWords:false, name: 'age', label: 'Age', field: 'age', align: 'left' },
    {type:"test", separateWords:false, name: 'city', label: 'City', field: 'otherdata2', align: 'left' },
    {type:"test", separateWords:false, name: 'nada', label: 'Nada2', field: 'otherdata2', align: 'left' },
    {type:"test", separateWords:false, name: 'nada5', label: 'Nada4', field: 'otherdata2', align: 'left' },
    {type:"test", separateWords:false, name: 'nada5', label: 'Nada5', field: 'name', align: 'left' },
    {type:"test", separateWords:false, name: 'actions', label: 'actions', field: 'actions', align: 'left' },
  ];

  // Datos de la tabla
  data = [
    { id: 1, name: 'John Doe', age: 28, city: 'New York', otherdata1: 'Extra 1', otherdata2: 'Extra 2' },
    { id: 2, name: 'Jane Smith', age: 34, city: 'Los Angeles', otherdata1: 'Extra 3' },
    { id: 3, name: 'Sam Green', age: 45, city: 'Chicago', otherdata2: 'Extra 4' },
    { id: 4, name: 'Sam Green', age: 45, city: 'Chicago', otherdata2: 'Extra 4' },
    { id: 5, name: 'Sam Green', age: 45, city: 'Chicago', otherdata2: 'Extra 4' },
    { id: 6, name: 'Sam Green', age: 45, city: 'Chicago', otherdata2: 'Extra 4' },
    { id: 7, name: 'Sam Green', age: 45, city: 'Chicago', otherdata2: 'Extra 4' },
    { id: 8, name: 'Sam Green', age: 45, city: 'Chicago', otherdata2: 'Extra 4' },
    { id: 9, name: 'Sam Green', age: 45, city: 'Chicago', otherdata2: 'Extra 4' },
    { id: 10, name: 'Sam Green', age: 45, city: 'Chicago', otherdata2: 'Extra 4' },
    { id: 11, name: 'Sam Green', age: 45, city: 'Chicago', otherdata2: 'Extra 4' },
    { id: 12, name: 'Sam Green', age: 45, city: 'Chicago', otherdata2: 'Extra 4' },
    { id: 13, name: 'Sam Green', age: 45, city: 'Chicago', otherdata2: 'Extra 4' },
    { id: 14, name : 'Sam Green', age: 45, city: 'Chicago', otherdata2: 'Extra 4' },
    { id: 15, name: 'Sam Green', age: 45, city: 'Chicago', otherdata2: 'Extra 4' },
    { id: 16, name: 'Sam Green', age: 45, city: 'Chicago', otherdata2: 'Extra 4' },
    { id: 17, name: 'Sam Green', age: 45, city: 'Chicago', otherdata2: 'Extra 4' },
    { id: 18, name: 'Sam Green', age: 45, city: 'Chicago', otherdata2: 'Extra 4' },
    { id: 19, name: 'Sam Green', age: 45, city: 'Chicago', otherdata2: 'Extra 4' },
    { id: 20, name: 'Sam Green', age: 45, city: 'Chicago', otherdata2: 'Extra 4' },
    { id: 21, name: 'Sam Green', age: 45, city: 'Chicago', otherdata2: 'Extra 4' },
    { id: 22, name: 'Sam Green', age: 45, city: 'Chicago', otherdata2: 'Extra 4' },
    { id: 23, name: 'Sam Green', age: 45, city: 'Chicago', otherdata2: 'Extra 4' },
    { id: 23, name: 'Sam Green', age: 45, city: 'Chicago', otherdata2: 'Extra 4' },
    // Agrega más datos aquí...
  ];

  selectedItems: any[] = []

  editar = (a:any) => {

    console.log(a)

  }
}
