// En: ../form-input-manager/form-config.interface.ts (o la ruta que estés usando)

// Opción general si la usas
export interface FormElementOption {
  value: any;
  name: string;
  disabled?: boolean;
}

// Interfaz específica para opciones de Select (puede ser la misma que FormElementOption)
export interface SelectOption {
  value: any;
  name: string;
  disabled?: boolean;
}

// Interfaz específica para opciones de RadioButton (puede ser la misma que FormElementOption)
export interface RadioButtonOption {
  value: any;
  name: string;
  disabled?: boolean;
}

// Interfaz específica para opciones de Checkbox (usada por MultipleCheckboxComponent)
// Es importante que el nombre 'CheckboxOption' aquí coincida con lo que importas
// (antes del 'as MultiCheckboxOption' si usas el alias).
export interface CheckboxOption {
  value: any;
  name: string;
  disabled?: boolean;
}

export interface FormElementConfig {
  key: string;
  type: string;
  label?: string;
  placeholder?: string;
  options?: FormElementOption[] | SelectOption[] | RadioButtonOption[] | CheckboxOption[]; // Puedes usar una unión o un tipo más genérico si prefieres
  required?: boolean;
    pattern?: string;      // <--- AÑADE ESTA LÍNEA COMO OPCIONAL

  // ... otras propiedades comunes ...
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  step?: number;
  accept?: string;
  defaultImageUrl?: string;
  rows?: number;
  disabledField?: string;
  disabledValue?: any;
}

// ... cualquier otra interfaz que necesites exportar ...
