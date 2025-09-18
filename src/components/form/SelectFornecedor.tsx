// src/components/form/SelectFornecedor.tsx
import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';

type Props = {
  fornecedores: { id: number; nome: string }[];
};

export default function SelectFornecedor({ fornecedores }: Props) {
  const { control } = useFormContext();

  return (
    <div className="mb-0 text-start">
      <label htmlFor="fornecedor">Pessoa</label>
      <Controller
        name="fornecedor"
        control={control}
        render={({ field }) => (
          <select {...field} className="input-compra">
            {!field.value && <option value="0">Selecione uma pessoa</option>}
            {fornecedores.map(p => (
              <option key={p.id} value={p.id}>
                {p.nome}
              </option>
            ))}
          </select>
        )}
      />
    </div>
  );
}
