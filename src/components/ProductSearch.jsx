// src/components/ProductSearch.jsx
import React, { useState } from 'react';
import AsyncSelect from 'react-select/async';
import { useNavigate } from 'react-router-dom';
import useDebounce from '../hooks/useDebounce';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const ProductSearch = ({ theme, darkMode }) => {  // <-- Accept darkMode directly
  const navigate = useNavigate();
  const [inputValue, setInputValue] = useState('');
  const debouncedInput = useDebounce(inputValue, 400);

  const loadOptions = async (input) => {
    if (!input.trim()) return [];

    try {
      const res = await fetch(`${API_BASE_URL}/api/products?search=${input}`, {
        credentials: 'include',
      });
      if (!res.ok) throw new Error();
      const data = await res.json();

      return data.products.map((product) => ({
        value: product._id,
        label: product.name,
      }));
    } catch (err) {
      console.error(err);
      return [];
    }
  };

  const promiseOptions = () => loadOptions(debouncedInput);

  const handleChange = (option) => {
    if (option) {
      navigate(`/product/${option.value}`);
      setInputValue('');
    }
  };

  return (
    <AsyncSelect
      cacheOptions
      loadOptions={promiseOptions}
      onInputChange={setInputValue}
      onChange={handleChange}
      isClearable
      value={null}
      placeholder="Search products..."
      className="w-full"
      classNames={{
        control: () =>
          `!bg-transparent !border-none !shadow-none !min-h-0 !h-8 !rounded-full ${theme.searchBg} transition-all`,

        valueContainer: () => 'px-3 flex items-center h-full',

        // Remove Tailwind from input — we'll use styles
        input: () => 'text-sm m-0 p-0 leading-tight',

        placeholder: () => `text-sm ${theme.searchPlaceholder}`,

        indicatorsContainer: () => 'hidden',

        menu: () =>
          `!mt-1 !rounded-lg !shadow-lg !border-0 ${
            darkMode ? '!bg-gray-800' : '!bg-white'
          } w-full`,

        menuList: () => 'p-0 max-h-64 overflow-y-auto',

        option: ({ isFocused, isSelected }) =>
          `!text-sm !px-4 !py-1.5 cursor-pointer w-full leading-tight ${
            isSelected
              ? '!bg-purple-600 !text-white'
              : isFocused
                ? darkMode
                  ? '!bg-gray-700'
                  : '!bg-purple-50'
                : ''
          }`,
      }}
      styles={{
        control: (base) => ({
          ...base,
          border: 0,
          boxShadow: 'none',
          background: 'transparent',
          minHeight: 'auto',
          height: '32px',
        }),

        // CRITICAL: Force input text color
        input: (base) => ({
          ...base,
          color: darkMode ? '#ffffff' : '#111827', // White in dark, dark gray in light
          caretColor: '#a855f7', // Purple cursor
          fontSize: '0.875rem',
          lineHeight: '1.25',
        }),

        placeholder: (base) => ({
          ...base,
          color: darkMode ? '#9ca3af' : '#6b7280', // gray-400 / gray-500
        }),

        menu: (base) => ({
          ...base,
          width: '100%',
          marginTop: '4px',
          borderRadius: '0.5rem',
          overflow: 'hidden',
          backgroundColor: darkMode ? '#1f2937' : '#ffffff',
          border: darkMode ? '1px solid #374151' : '1px solid #e5e7eb',
        }),

        menuList: (base) => ({
          ...base,
          padding: 0,
        }),

        option: (base, state) => ({
          ...base,
          padding: '0.375rem 1rem',
          backgroundColor: state.isSelected
            ? '#a855f7'
            : state.isFocused
              ? darkMode
                ? '#374151'
                : '#f3e8ff'
              : 'transparent',
          color: state.isSelected ? '#ffffff' : darkMode ? '#e5e7eb' : '#111827',
        }),
      }}
    />
  );
};

export default ProductSearch;