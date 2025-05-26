import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-theme-toggle',
  imports: [CommonModule],
  template: `
    <button
      (click)="toggleTheme()"
      class="px-4 py-2 rounded bg-primary text-white hover:bg-primary/80"
    >
      {{ isDarkMode ? '☀️ Modo Claro' : '🌙 Modo Oscuro' }}
    </button>
  `
})
export class ThemeToggleComponent {
  isDarkMode = false;

  constructor() {
    // Leer preferencia inicial
    const savedTheme = localStorage.getItem('theme');
    this.isDarkMode = savedTheme === 'dark';

    this.updateTheme();
  }

  toggleTheme() {
    this.isDarkMode = !this.isDarkMode;
    localStorage.setItem('theme', this.isDarkMode ? 'dark' : 'light');
    this.updateTheme();
  }

  private updateTheme() {
    const root = document.documentElement;
    if (this.isDarkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }
}
