// src/components/form/SelectPessoa.tsx
import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';

type Props = {
  pessoas: { id: number; nome: string }[];
};

export default function SelectPessoa({ pessoasSelect }: Props) {
  const { control } = useFormContext();

  return (
    <div className="mb-0 text-start">
      <label htmlFor="pessoa">Pessoa</label>
      <Controller
        name="pessoa"
        control={control}
        render={({ field }) => (
          <select {...field} className="input-compra">
            {!field.value && <option value="0">Selecione uma pessoa</option>}
            {pessoasSelect.map(p => (
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
