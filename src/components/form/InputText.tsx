// src/components/form/InputText.tsx
import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';

type Props = {
  name: string;
  label: string;
  placeholder?: string;
  type?: string;
};

export default function InputText({ name, label, placeholder, type = 'text' }: Props) {
  const { control } = useFormContext();

  return (
    <div className="mb-0 text-start">
      <label htmlFor={name}>{label}</label>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <input
            {...field}
            type={type}
            placeholder={placeholder}
            className="input-compra"
          />
        )}
      />
    </div>
  );
}
