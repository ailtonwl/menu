// src/components/form/SelectFornecedor.tsx
import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';

type Props = {
  fornecedores: { id: number; nome: string; cliente: boolean; fornecedor: boolean }[];
};

export default function SelectFornecedor({ fornecedores, espPessoa }: Props) {
  const { control } = useFormContext();
  let pessoasFiltradas = [...fornecedores];
  if (espPessoa === "cliente") {
    pessoasFiltradas = pessoasFiltradas.filter(p => p.cliente);
  }
  if (espPessoa === "fornecedor") {
    pessoasFiltradas = pessoasFiltradas.filter(p => p.fornecedor);
  }

  return (
    <div className="mb-0 text-start">
      <label htmlFor="fornecedor">Pessoa</label>
      <Controller
        name="fornecedor"
        control={control}
        render={({ field }) => (
          <select {...field} className="input-compra">
            {!field.value && <option value="0">Selecione uma pessoa</option>}
            {pessoasFiltradas.map(p => (
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
