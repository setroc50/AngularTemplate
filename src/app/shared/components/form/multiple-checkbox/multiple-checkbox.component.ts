import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Observable, isObservable } from 'rxjs';

@Component({
  selector: 'app-multiple-checkbox',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="flex flex-col space-y-2">
      <label class="text-sm font-medium text-gray-700">{{ element.label }}</label>

      <div *ngFor="let opt of options" class="flex items-center space-x-2">
        <input
          type="checkbox"
          [value]="opt.value"
          [checked]="isChecked(opt.value)"
          (change)="onCheckboxChange($event)"
          class="form-checkbox h-4 w-4 text-blue-600"
        />
        <span class="text-sm text-gray-700">{{ opt.name }}</span>
      </div>
    </div>
  `
})
export class MultipleCheckboxComponent implements OnInit {
  @Input() element!: any;
  @Input() control!: FormControl;
  @Input() optionsSource?: FormControl | Observable<any[]>;

  options: Array<{ name: string; value: any }> = [];

  ngOnInit(): void {
    // Initialize control with an empty array if it's not yet defined
    if (!this.control.value) {
      this.control.setValue([]);
    }

    // Dynamic options loading
    if (this.optionsSource instanceof FormControl) {
      this.options = this.transformOptions(this.optionsSource.value);
      this.optionsSource.valueChanges.subscribe((value) => {
        this.options = this.transformOptions(value);
      });
    } else if (isObservable(this.optionsSource)) {
      this.optionsSource.subscribe((value) => {
        this.options = this.transformOptions(value);
      });
    } else if (this.element?.Options) {
      this.options = this.element.Options;
    }
  }

  /**
   * Transforms any array of raw values into proper { name, value } format
   */
  transformOptions(raw: any): Array<{ name: string; value: number }> {
    if (Array.isArray(raw) && raw.length && raw[0]?.name && raw[0]?.value !== undefined) {
      return raw; // Already in correct format
    }

    if (Array.isArray(raw)) {
      return raw.map((item: string | number, index: number) => ({
        name: item.toString(),
        value: index
      }));
    }

    return [];
  }

  isChecked(value: number): boolean {
    return this.control.value?.includes(value);
  }

  onCheckboxChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const value = Number(input.value);
    let selected: number[] = [...(this.control.value || [])];

    if (input.checked) {
      if (!selected.includes(value)) {
        selected.push(value);
      }
    } else {
      selected = selected.filter((v) => v !== value);
    }

    this.control.setValue(selected);
    this.control.markAsDirty();
    this.control.markAsTouched();
  }
}
