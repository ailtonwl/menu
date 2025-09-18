// src/pages/compra/ItemCompraForm.tsx
import React, { useEffect } from 'react';
import { UseFormReturn } from 'react-hook-form';
import InputMonetario from '../../components/form/InputMonetario';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function ItemCompraForm({ produtos, adicionarItem, form }: {
  produtos: any[],
  adicionarItem: (item: any) => void,
  form: UseFormReturn<any>
}) {
  const { register, watch, setValue, getValues } = form;

  const produtoId = watch('produtoId');
  const produtoSelecionado = produtos.find(p => p.id === Number(produtoId));

  useEffect(() => {
    if (produtoSelecionado) {
      const valor = produtoSelecionado?.vrvenda ?? 0;
      const valorFormatado = `R$ ${valor.toFixed(2).replace('.', ',')}`;
      setValue('vrunit', valorFormatado);
    }
  }, [produtoId]);

  function handleAdicionar() {
    const { produtoId, quantidade, vrunit } = getValues();
    const valorNumerico = parseFloat(vrunit.replace(/\D/g, '')) / 100;
    if (!produtoSelecionado || quantidade <= 0 || valorNumerico <= 0) {
      alert("Preencha todos os campos corretamente.");
      return;
    }

    adicionarItem({
      produtoId: Number(produtoId),
      sigla: produtoSelecionado.sigla,
      quantidade,
      vrunit: valorNumerico,
      ativo: true,
      descricao: produtoSelecionado.descricao,
      vrTotal: quantidade * valorNumerico
    });

    // toast.success('Item cadastrado com sucesso! 🎉');

    // Resetar campos
    setValue('produtoId', 0);
    setValue('quantidade', 1);
    setValue('vrunit', 'R$ 0,00');
  }

  return (
    <div className="item-compra-form">
      <div className='titulo-adic'>Adicione produto</div>
      <div className='input-linha'>
        <label htmlFor="idProd">Produto</label>
        <select {...register('produtoId')}>
          <option value="0">Selecione um produto</option>
          {produtos.map(({ id, descricao }) => (
            <option key={id} value={id}>{descricao}</option>
          ))}
        </select>
      </div>
      <div className='input-linha'>
        <label htmlFor="quantidade">Quant.</label>
        <input
          className='input-compra larg-80 alt-40'
          type="text"
          {...register('quantidade', { valueAsNumber: true })}
          placeholder="Quantidade"
        />
        <InputMonetario
          name="vrunit"
          control={form.control}
          label="Vr. Unit."
          placeholder="R$ 0,00"
          required
        />
        <button className='button-add-item tam-150' type="button" onClick={handleAdicionar}>Adicionar Item</button>
      </div>
    </div>
  );
}

export default ItemCompraForm;
