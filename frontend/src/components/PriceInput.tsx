import React, { useState, useEffect, forwardRef } from 'react';
import { Input } from './ui/input';

interface PriceInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export const PriceInput = forwardRef<HTMLInputElement, PriceInputProps>(
  ({ value, onChange, placeholder, className }, ref) => {
    const [displayValue, setDisplayValue] = useState('');

    useEffect(() => {
      // When the value prop changes (e.g., data loaded from DB),
      // format it for display. Take only the integer part.
      const integerPart = String(value).split('.')[0];
      const formatted = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      setDisplayValue(formatted);
    }, [value]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      // When the user types, remove formatting and non-digits,
      // then call the parent's onChange with the raw numeric string.
      const numericValue = e.target.value.replace(/[^\d]/g, '');
      onChange(numericValue);
    };

    return (
      <Input
        type="text"
        value={displayValue}
        onChange={handleChange}
        placeholder={placeholder}
        className={className}
        ref={ref}
        inputMode="numeric" // Use numeric keyboard on mobile devices
        pattern="[0-9,]*"
      />
    );
  }
);

PriceInput.displayName = 'PriceInput';