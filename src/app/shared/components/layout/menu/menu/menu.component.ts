import { Component, OnInit, signal } from '@angular/core';
import { MenuItemComponent } from '../menu-item/menu-item.component';
import { CommonModule } from '@angular/common';
import packageJson from '../../../../../../../package.json'
import { MenuService } from '../menuServices/menu.service';

interface MenuItem {
  icon?: string;
  name: string;
  description?: string;
  route?: string;
  submenu?: MenuItem[];
  expanded?: boolean;
}

@Component({
  selector: 'app-menu',
  imports: [MenuItemComponent, CommonModule, ],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css'
})
export class MenuComponent implements OnInit {
    public appJson: any = packageJson;

  menuItems = signal<MenuItem[]>([]);
  initialMenuItems: MenuItem[] = [

/*
    //digitalplatforms_portadillas
    {
      "icon": "fa fa-folder",
      "name": "Plataformas Digitales",
      "description": "Catálogo de productos",
      "submenu": [
        {
          "icon": "fa-solid fa-images",
          "name": "Portadillas",
          "description": "Ver todos los productos",
          "route": "digitalplatforms/portadillas"
        },
        {
          "icon": "fa-solid fa-images",
          "name": "Web Portadillas",
          "description": "portadillas",
          "route": "digitalplatforms/webportadillas"
        },

      ]
    },*/
    {
      "icon": "fa-solid fa-globe",
      "name": "API V1",
      "description": "Catálogo de productos",
      "submenu": [
        {
          "icon": "fa-solid fa-hexagon-nodes",
          "name": "V1",
          "description": "Ver todos los productos",
          "route": "digitalplatforms/apiv1Page"



        },


      ]
    },
    {
      "icon": "fa fa-cog",
      "name": "Configuración",
      "description": "Opciones de configuración",
      "route": "landing"
    }
  ];


/*
 initialMenuItems: MenuItem[] = [
    {
      "icon": "fa fa-home",
      "name": "Inicio",
      "description": "Página principal",
      "route": "/inicio"
    },
    {
      "icon": "fa fa-folder",
      "name": "Productos",
      "description": "Catálogo de productos",
      "submenu": [
        {
          "icon": "fa fa-list",
          "name": "Lista de Productos",
          "description": "Ver todos los productos",
          "route": "/productos/lista"
        },
        {
          "icon": "fa fa-plus",
          "name": "Nuevo Producto",
          "description": "Agregar un nuevo producto",
          "route": "/productos/nuevo",
          "submenu": [
            {
              "icon": "fa fa-list",
              "name": "aLista de Productos",
              "description": "aVer todos los productos",
              "route": "/productos/listaa"
            },
            {
              "icon": "fa fa-plus",
              "name": "vNuevo Producto",
              "description": "vAgregar un nuevo producto",
              "route": "/productos/nuevov",
              "submenu": [
                {
                  "icon": "fa fa-check",
                  "name": "Opción Final 1"
                },
                {
                  "icon": "fa fa-times",
                  "name": "Opción Final 2",
                  "submenu": [
                    {
                      "icon": "fa fa-list",
                      "name": "aLista de Productos",
                      "description": "aVer todos los productos",
                      "route": "/productos/listaa"
                    },
                    {
                      "icon": "fa fa-plus",
                      "name": "vNuevo Producto",
                      "description": "vAgregar un nuevo producto",
                      "route": "/productos/nuevov",
                      "submenu": [
                        {
                          "icon": "fa fa-check",
                          "name": "Opción Final 1"
                        },
                        {
                          "icon": "fa fa-times",
                          "name": "Opción Final 2"
                        }
                      ]
                    }
                  ]

                }
              ]
            }
          ]
        }
      ]
    },
    {
      "icon": "fa fa-cog",
      "name": "Configuración",
      "description": "Opciones de configuración",
      "route": "/configuracion"
    }
  ];

  */
  constructor(public menuService: MenuService) {}


  ngOnInit(): void {
    console.log("INICIO")
    this.menuItems.set(this.initialMenuItems);
  }

  toggleSubmenu(toggledItem: MenuItem): void { // Recibe el MenuItem toggled
    this.menuItems.update(currentItems =>
      currentItems.map(item =>
        item === toggledItem ? { ...item, expanded: toggledItem.expanded } : item
      )
    );
  }

    public toggleSidebar() {
    this.menuService.toggleSidebar();
  }


}
