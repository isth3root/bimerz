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
      const integerPart = String(value).split('.')[0];
      const formatted = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      setDisplayValue(formatted);
    }, [value]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
        inputMode="numeric"
        pattern="[0-9,]*"
      />
    );
  }
);

PriceInput.displayName = 'PriceInput';