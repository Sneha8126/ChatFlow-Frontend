import React, { useState, useEffect, useRef } from 'react';
import { Search, X } from 'lucide-react';

export default function SearchBar({ placeholder = 'Search...', onSearch, autoFocus = false }) {
  const [value, setValue] = useState('');
  const timeoutRef = useRef(null);

  useEffect(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      onSearch?.(value.trim());
    }, 300);
    return () => clearTimeout(timeoutRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const handleClear = () => {
    setValue('');
    onSearch?.('');
  };

  return (
    <div className="relative">
      <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
      <input
        type="text"
        value={value}
        autoFocus={autoFocus}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-surface-muted border border-transparent focus:border-primary-300 focus:bg-white rounded-xl pl-9 pr-8 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 transition-colors"
      />
      {value && (
        <button
          onClick={handleClear}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          aria-label="Clear search"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
}
