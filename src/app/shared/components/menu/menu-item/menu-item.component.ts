import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { Input as AngularInput, Output as AngularOutput } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
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
  selector: 'app-menu-item',
  imports: [RouterModule, CommonModule, MenuItemComponent],
  templateUrl: './menu-item.component.html',
  styleUrl: './menu-item.component.css',

})


export class MenuItemComponent {



    constructor(public menuService: MenuService) {}

  @AngularInput() item!: MenuItem;
  @AngularOutput() toggleSubmenuEvent = new EventEmitter<MenuItem>();

  get expandIconClass(): string {
    return this.item.expanded ? 'fa fa-chevron-up' : 'fa fa-chevron-down';
  }


  toggleSubmenu(): void { // SIN parámetros
    if (this.item.submenu) {
      this.item.expanded = !this.item.expanded;
      this.toggleSubmenuEvent.emit(this.item);
    }
  }



}
