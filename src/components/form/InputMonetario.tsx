// src/components/form/InputMonetario.tsx
import React from 'react';
import { Controller, Control } from 'react-hook-form';
import '../../pages/produto/styles.css';

type InputMonetarioProps = {
  name: string;
  control: Control<any>;
  label?: string;
  placeholder?: string;
  required?: boolean;
  className?: string;
};

function aplicarMascaraMonetaria(valor: string): string {
  const somenteNumeros = valor.replace(/\D/g, '');
  const numero = parseFloat(somenteNumeros) / 100;

  if (isNaN(numero)) return '';

  return numero.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2
  });
}

const InputMonetario: React.FC<InputMonetarioProps> = ({
  name,
  control,
  label,
  placeholder,
  required = false,
  className = 'input-compra larg-120 alt-40'
}) => {
  return (
    <>
      {label && <label htmlFor={name}>{label}</label>}
      <Controller
        name={name}
        control={control}
        rules={{ required }}
        render={({ field }) => (
          <input
            {...field}
            id={name}
            type="text"
            className={className}
            placeholder={placeholder}
            onChange={(e) => {
              const valorFormatado = aplicarMascaraMonetaria(e.target.value);
              field.onChange(valorFormatado);
            }}
          />
        )}
      />
    </>
  );
};

export default InputMonetario;
