// src/pages/compra/CompraEdit.tsx
// import { Controller } from 'react-hook-form';
import React, { useState, useEffect, useContext } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import { AppContext } from '../../contexts/AppContext';
import api from '../../services/api';
import SelectFornecedor from '../../components/form/SelectFornecedor';
import ItemCompraForm from './ItemCompraForm';
import ItemCompraList from '../../components/form/ItemCompraList';
import './styles.css';

function CompraEdit() {
  const { compra } = useContext(AppContext);
  const navigate = useNavigate();

  const formMethods = useForm({
    defaultValues: {
      dtemissao: '',
      nrdocumento: '',
      fornecedor: 0
    }
  });

  const { register, handleSubmit, setValue, reset, watch } = formMethods;

  const [produtos, setProdutos] = useState([]);
  const [pessoas, setPessoas] = useState([]);
  const [itensCompra, setItensCompra] = useState([]);
  const [vrTotal, setVrTotal] = useState(0);

  useEffect(() => {
  if (!compra) {
    navigate('/compras');
    return;
  }

  const fetchData = async () => {
    const [resProdutos, resPessoas] = await Promise.all([
      api.get('/produto'),
      api.get('/pessoa')
    ]);

    setProdutos(resProdutos.data);
    setPessoas(resPessoas.data);

    const itens = compra.itemCompra.map(item => ({
      produtoId: item.produtoId,
      descricao: item.produto.descricao,
      sigla: item.produto.unidade.sigla,
      quantidade: item.quantidade,
      vrunit: item.vrunit,
      id: item.id
    }));

    setItensCompra(itens);

    const valoresIniciais = {
      dtemissao: compra.dtemissao?.slice(0, 10) || new Date().toISOString().slice(0, 10),
      nrdocumento: compra.nrdocumento || '',
      fornecedor: compra.pessoaId || resPessoas.data[0]?.id || 0
    };

    reset(valoresIniciais);
  };

  fetchData();
}, [compra]);

  useEffect(() => {
    setVrTotal(itensCompra.reduce((acc, item) => acc + item.quantidade * item.vrunit, 0));
  }, [itensCompra]);

  function adicionarItem(novoItem) {
    setItensCompra([...itensCompra, novoItem]);
  }

  // function excluirItem(index) {
  //   const novaLista = [...itensCompra];
  //   novaLista.splice(index, 1);
  //   setItensCompra(novaLista);
  // }

  // function atualizarItem(index, campo, valor) {
  //   const novaLista = [...itensCompra];
  //   novaLista[index][campo] = valor;
  //   setItensCompra(novaLista);
  // }

  function handleRemoveItem(id: number) {
    const novaLista = itensCompra.filter(item => item.id !== id);
    setItensCompra(novaLista);
  }

  const onSubmit = async (data) => {
    if (!data.dtemissao || !data.nrdocumento || !data.fornecedor) {
      alert("Preencha os dados do cabeçalho.");
      return;
    }

    if (itensCompra.length === 0) {
      alert("Adicione pelo menos um item.");
      return;
    }

    const compraAtualizada = {
      id: compra.id,
      dtemissao: data.dtemissao,
      nrdocumento: data.nrdocumento,
      // fornecedor: data.fornecedor,
      pessoaId: data.fornecedor,
      vrtotal: vrTotal,
      ativo: true,
      itemCompra: itensCompra
    };

    try {
      const response = await api.put(`/compra/${compra.id}`, compraAtualizada);
      if (response.status === 200) {
        toast.success('Compra atualizada com sucesso!');
        setTimeout(() => navigate('/compras'), 2000);
      } else {
        toast.error('Erro ao atualizar a compra.');
      }
    } catch (error) {
      toast.error(`Erro inesperado: ${error.message}`);
    }
  };

  return (
    <div className="tela-login">
      <div className="mycard-compra">
        <div className='title'>
          <h4>Editar Compra</h4>
        </div>
        <FormProvider {...formMethods}>
          <form onSubmit={handleSubmit(onSubmit)} className="form">
            <div className='container-itens'>
              <div className="mb-0 text-start">
                <label htmlFor="dtemissao">Data Emissão</label>
                <input {...register('dtemissao')} className='input-compra' type="date" required />
              </div>
              <div className="mb-0 text-start">
                <label htmlFor="nrdocumento">Nº Documento</label>
                <input {...register('nrdocumento')} className='input-compra' type="text" required />
              </div>
              <div className="mb-0 text-end">
                <label htmlFor="vrtotal">Vr. Total</label>
                <input id='vrtotal' className='input-compra text-end' value={vrTotal.toFixed(2)} readOnly />
              </div>
            </div>
            <div className="mb-0 text-start">
              <SelectFornecedor fornecedores={pessoas} espPessoa={"fornecedor"} />
            </div>

            <ItemCompraForm produtos={produtos} adicionarItem={adicionarItem} form={formMethods} />

            <div className="container p-0">

              <ItemCompraList itens={itensCompra} onRemove={handleRemoveItem} />

            </div>

            <div className='container-itens'>
              <button className='button cancel' type="button" onClick={() => navigate('/compras')}>Cancelar</button>
              <button className='button add' type="submit">Salvar</button>
            </div>
          </form>
        </FormProvider>
        <ToastContainer />
      </div>
    </div>
  );
}

export default CompraEdit;
