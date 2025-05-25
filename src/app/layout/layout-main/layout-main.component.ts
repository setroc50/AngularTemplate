



import { Component, HostListener, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
 import { SidebarComponent } from '../../shared/components/sidebar/sidebar.component';

@Component({
  selector: 'app-layout-main',
  standalone: true,
  imports: [RouterOutlet, CommonModule, SidebarComponent],
  templateUrl: './layout-main.component.html',
  styleUrls: ['./layout-main.component.css']
})
export class LayoutMainComponent implements OnInit {
  isMobileMenuOpen: boolean = false;
  isDesktop: boolean = false;
  isProfileMenu: boolean = false; // Para el menú de perfil



  ngOnInit(): void {
    this.checkScreenWidth();
  }

  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  toggleProfileMenu(): void {
    this.isProfileMenu = !this.isProfileMenu;
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any): void {
    this.checkScreenWidth();
  }

  checkScreenWidth(): void {
    this.isDesktop = window.innerWidth >= 1024; // 1024px es el breakpoint 'lg' de Tailwind
    if (this.isDesktop) {
      this.isMobileMenuOpen = false; // Asegurarse de que el menú móvil esté cerrado en escritorio
    }
  }
}
