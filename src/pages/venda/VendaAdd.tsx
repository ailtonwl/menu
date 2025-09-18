// src/pages/venda/VendaAdd.tsx
import React, { useState, useEffect, useContext } from 'react';
import { useForm, FormProvider, useFieldArray } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import { AppContext } from '../../contexts/AppContext';
import api from '../../services/api';
import SelectFornecedor from '../../components/form/SelectFornecedor';
import ItemVendaForm from './ItemVendaForm';
import ItemVendaList from '../../components/form/ItemVendaList';
import './styles.css';

function VendaAdd() {

  const { venda } = useContext(AppContext);
  const navigate = useNavigate();

  const formMethods = useForm({
    defaultValues: {
      dtemissao: '',
      nrdocumento: '',
      fornecedor: '',
      vrtotal: 0,
      vrrecebido: 0,
      status: 'Aberto',
      itensVenda: [],
    },
  });

  const { control, register, handleSubmit, setValue, watch, reset, formState: { errors } } = formMethods;
  const { fields, append, remove } = useFieldArray({ control, name: 'itensVenda' });

  const [produtos, setProdutos] = useState([]);
  const [pessoas, setPessoas] = useState([]);
  const [vrTotal, setVrTotal] = useState(0);

  useEffect(() => {
    if (!venda) {
      navigate('/vendas');
      return;
    }

    const fetchData = async () => {
      const [resProdutos, resPessoas] = await Promise.all([
        api.get('/produto'),
        api.get('/pessoa'),
      ]);
      setProdutos(resProdutos.data);
      setPessoas(resPessoas.data);

      // const itens = venda.itemVenda.map(item => ({
      //   produtoId: item.produtoId,
      //   descricao: item.produto.descricao,
      //   sigla: item.produto.unidade.sigla,
      //   quantidade: item.quantidade,
      //   vrunit: item.vrunit ?? 0,
      //   ativo: item.ativo,
      //   vendaId: item.vendaId,
      //   id: item.id,
      // }));

      const itens:any = [];

      reset({
        dtemissao: new Date().toISOString().slice(0, 10),
        nrdocumento: '',
        fornecedor: '',
        vrtotal: 0,
        vrrecebido: 0,
        status: 'Aberto',
        itensVenda: itens,
      });
    };
    fetchData();
  }, [venda, navigate, reset]);

  const itensVenda = watch('itensVenda');

  useEffect(() => {
    const total = itensVenda?.reduce((acc, item) => acc + item.quantidade * item.vrunit, 0) || 0;
    setVrTotal(total);
  }, [itensVenda]);

  const onSubmit = async (fields) => {
    if (!fields.dtemissao || !fields.nrdocumento || !fields.fornecedor) {
      alert("Preencha os dados do cabeçalho.");
      return;
    }

    const vendaAtualizada = {
      id: venda.id,
      dtemissao: fields.dtemissao,
      nrdocumento: fields.nrdocumento,
      pessoaId: fields.fornecedor,
      vrtotal: vrTotal,
      vrrecebido: fields.vrrecebido,
      status: fields.status,
      ativo: true,
      itemVenda: fields.itensVenda,
    };

    try {
      const response = await api.post('/venda', vendaAtualizada);
      if (response.status === 201) {
        toast.success('Venda cadastrada com sucesso!');
        setTimeout(() => navigate('/vendas'), 2000);
      } else {
        toast.error('Erro ao registrar a venda.');
      }
    } catch (error) {
      toast.error(`Erro inesperado: ${error.message}`);
    }
  };

  return (
    <div className="tela-login">
      <div className="mycard-venda">
        <div className='title'>
          <h4>Nova Venda</h4>
        </div>
        <FormProvider {...formMethods}>
          <form
            onSubmit={handleSubmit(onSubmit)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
              }
            }}
            className="form"
          >
            <div className='container-itens'>
              <div className="mb-0 text-start">
                <label htmlFor="dtemissao">Data Emissão</label>
                <input {...register('dtemissao')} className='input-venda' type="date" required />
              </div>
              <div className="mb-0 text-start">
                <label htmlFor="nrdocumento">Nº Documento</label>
                <input {...register('nrdocumento')} className='input-venda' type="text" required />
              </div>
              <div className="mb-0 text-end">
                <label htmlFor="vrtotal">Vr. Total</label>
                <input id='vrtotal' className='input-venda text-end' value={vrTotal.toFixed(2)} readOnly />
              </div>
            </div>

            <div className="mb-0 text-start">
              <SelectFornecedor fornecedores={pessoas} />
            </div>

            <ItemVendaForm produtos={produtos} append={append} />

            <div className="container p-0">

              <ItemVendaList itens={fields} onRemove={remove} />

            </div>

            <div className='container-itens'>
              <button className='button cancel' type="button" onClick={() => navigate('/vendas')}>Cancelar</button>
              <button
                className='button add'
                type="submit"
                onClick={() => console.log('Botão clicado')}
              >
                Salvar
              </button>
            </div>
          </form>
        </FormProvider>
        <ToastContainer />
      </div>
    </div>
  );
}
export default VendaAdd;
