import { Component } from '@angular/core';
import { MenuService } from '../menu/menuServices/menu.service';
import { MenuComponent } from '../menu/menu/menu.component';
import { CommonModule } from '@angular/common';


import packageJson from '../../../../../../package.json'

@Component({
  selector: 'app-sidebar',
  imports: [ MenuComponent,CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
  public appJson: any = packageJson;


  constructor(public menuService: MenuService) {}
  ngOnInit(): void {}

  public toggleSidebar() {
    this.menuService.toggleSidebar();
  }

}
