import { useState, useCallback } from "react";

export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  patternMessage?: string;
  matchField?: string;
  custom?: (value: string, allValues: Record<string, string>) => string | null;
}

export interface UseFormValidationReturn<T extends Record<string, string>> {
  values: T;
  errors: Partial<Record<keyof T, string>>;
  touched: Partial<Record<keyof T, boolean>>;
  handleChange: (
    field: keyof T,
  ) => (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleBlur: (field: keyof T) => () => void;
  handleSubmit: (onValid: (values: T) => void) => () => void;
  isValid: boolean;
  reset: () => void;
}

function validateField<T extends Record<string, string>>(
  field: keyof T,
  value: string,
  rules: ValidationRule[],
  allValues: T,
): string | null {
  for (const rule of rules) {
    if (rule.required && !value.trim()) {
      return "This field is required";
    }
    if (rule.minLength && value.trim().length < rule.minLength) {
      return `Must be at least ${rule.minLength} characters`;
    }
    if (rule.maxLength && value.trim().length > rule.maxLength) {
      return `Must be at most ${rule.maxLength} characters`;
    }
    if (rule.pattern && !rule.pattern.test(value)) {
      return rule.patternMessage ?? "Invalid format";
    }
    if (rule.matchField && value !== allValues[rule.matchField]) {
      return "Fields do not match";
    }
    if (rule.custom) {
      const error = rule.custom(value, allValues);
      if (error) return error;
    }
  }
  return null;
}

export function useFormValidation<T extends Record<string, string>>(
  initialValues: T,
  rules: Record<keyof T, ValidationRule[]>,
): UseFormValidationReturn<T> {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({});

  const handleChange = useCallback(
    (field: keyof T) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      setValues((prev) => {
        const updated = { ...prev, [field]: newValue };
        // Clear error for this field as user types
        setErrors((prevErrors) => {
          if (!prevErrors[field]) return prevErrors;
          const next = { ...prevErrors };
          delete next[field];
          return next;
        });
        return updated;
      });
    },
    [],
  );

  const handleBlur = useCallback(
    (field: keyof T) => () => {
      setTouched((prev) => ({ ...prev, [field]: true }));
      // Validate on blur using the current value
      setValues((prev) => {
        const error = validateField(
          field,
          prev[field],
          rules[field] ?? [],
          prev,
        );
        setErrors((prevErrors) => {
          if (error) {
            return { ...prevErrors, [field]: error };
          }
          const next = { ...prevErrors };
          delete next[field];
          return next;
        });
        return prev;
      });
    },
    [rules],
  );

  const isValid = Object.keys(errors).length === 0;

  const handleSubmit = useCallback(
    (onValid: (values: T) => void) => (e: React.FormEvent) => {
      e.preventDefault();

      // Mark all fields as touched
      const allTouched = Object.keys(rules).reduce(
        (acc, key) => ({ ...acc, [key]: true }),
        {} as Record<keyof T, boolean>,
      );
      setTouched(allTouched);

      // Validate all fields
      const newErrors: Partial<Record<keyof T, string>> = {};
      let hasErrors = false;

      for (const field of Object.keys(rules) as (keyof T)[]) {
        const error = validateField(
          field,
          values[field],
          rules[field] ?? [],
          values,
        );
        if (error) {
          newErrors[field] = error;
          hasErrors = true;
        }
      }

      setErrors(newErrors);

      if (!hasErrors) {
        onValid(values);
      }
    },
    [rules, values],
  );

  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
  }, [initialValues]);

  return {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
    isValid,
    reset,
  };
}
