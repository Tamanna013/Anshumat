"use client";

import { useState, useEffect, useCallback } from "react";
import { debounce } from "lodash";

interface BudgetInputProps {
  value: number;
  onChange: (value: number) => void;
  placeholder: string;
  prefix?: string;
}

export function BudgetInput({
  value = 0,
  onChange,
  placeholder,
  prefix,
}: BudgetInputProps) {
  const [inputValue, setInputValue] = useState(value.toString());
  const [isEditing, setIsEditing] = useState(false);

  // Debounced onChange to prevent too many updates
  const debouncedOnChange = useCallback(
    debounce((val: number) => {
      onChange(val);
    }, 300),
    [onChange]
  );

  // Update local state when prop changes
  useEffect(() => {
    if (!isEditing) {
      setInputValue(value.toString());
    }
  }, [value, isEditing]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/[^0-9]/g, "");
    const numValue = rawValue === "" ? 0 : parseInt(rawValue, 10);

    setInputValue(rawValue);
    debouncedOnChange(numValue);
  };

  const handleFocus = () => setIsEditing(true);
  const handleBlur = () => {
    setIsEditing(false);
    const numValue = inputValue === "" ? 0 : parseInt(inputValue, 10);
    onChange(numValue);
  };

  const formatDisplay = (val: string) => {
    if (val === "") return "";
    const num = parseInt(val, 10);
    return isNaN(num) ? "0" : num.toLocaleString();
  };

  return (
    <div className="relative">
      {prefix && (
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
          {prefix}
        </div>
      )}
      <input
        type="text"
        value={formatDisplay(inputValue)}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        placeholder={placeholder}
        className={`input-field ${prefix ? "pl-10" : ""}`}
        inputMode="numeric"
        pattern="[0-9]*"
      />
      <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-500">
        Auto-saves as you type
      </div>
    </div>
  );
}
