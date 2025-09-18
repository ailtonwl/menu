// src/components/form/SelectProduto.tsx
import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';

type Produto = {
  id: number;
  nome: string;
};

type Props = {
  produtos: Produto[];
};

export default function SelectProduto({ produtos }: Props) {
  const { control } = useFormContext();

  return (
    <div className="mb-0 text-start">
      <label htmlFor="produto">Produto</label>
      <Controller
        name="produto"
        control={control}
        render={({ field }) => (
          <select {...field} className="input-compra">
            {!field.value && <option value="0">Selecione um produto</option>}
            {produtos.map(p => (
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
