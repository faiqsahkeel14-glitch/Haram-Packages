// Form validation utilities

export interface ValidationError {
  field: string;
  message: string;
}

export const validators = {
  email: (email: string): string | null => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) return 'Email is required';
    if (!emailRegex.test(email)) return 'Invalid email format';
    return null;
  },

  username: (username: string): string | null => {
    if (!username) return 'Username is required';
    if (username.length < 3) return 'Username must be at least 3 characters';
    if (username.length > 20) return 'Username must not exceed 20 characters';
    if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
      return 'Username can only contain letters, numbers, dashes, and underscores';
    }
    return null;
  },

  password: (password: string): string | null => {
    if (!password) return 'Password is required';
    if (password.length < 6) return 'Password must be at least 6 characters';
    return null;
  },

  passwordMatch: (password: string, confirmPassword: string): string | null => {
    if (password !== confirmPassword) return 'Passwords do not match';
    return null;
  },

  price: (price: string | number): string | null => {
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    if (!price) return 'Price is required';
    if (isNaN(numPrice)) return 'Price must be a valid number';
    if (numPrice <= 0) return 'Price must be greater than 0';
    return null;
  },

  quantity: (quantity: string | number): string | null => {
    const numQty = typeof quantity === 'string' ? parseInt(quantity, 10) : quantity;
    if (!quantity) return 'Quantity is required';
    if (isNaN(numQty)) return 'Quantity must be a valid number';
    if (numQty < 0) return 'Quantity cannot be negative';
    return null;
  },

  text: (text: string, minLength = 1, maxLength = 255): string | null => {
    if (!text && minLength > 0) return 'This field is required';
    if (text.length < minLength) {
      return `Minimum ${minLength} character${minLength > 1 ? 's' : ''} required`;
    }
    if (text.length > maxLength) {
      return `Maximum ${maxLength} character${maxLength > 1 ? 's' : ''} allowed`;
    }
    return null;
  },
};

export function validateForm(
  data: Record<string, any>,
  schema: Record<string, (value: any) => string | null>
): ValidationError[] {
  const errors: ValidationError[] = [];

  for (const [field, validator] of Object.entries(schema)) {
    const error = validator(data[field]);
    if (error) {
      errors.push({ field, message: error });
    }
  }

  return errors;
}

export function hasErrors(errors: ValidationError[]): boolean {
  return errors.length > 0;
}

export function getFieldError(
  errors: ValidationError[],
  fieldName: string
): string | null {
  const error = errors.find((e) => e.field === fieldName);
  return error ? error.message : null;
}
