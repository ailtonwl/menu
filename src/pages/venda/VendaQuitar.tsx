// src/pages/venda/VendaQuitar.tsx
import React, { useState, useEffect, useContext } from 'react';
import { useForm, FormProvider, useFieldArray } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import { AppContext } from '../../contexts/AppContext';
import api from '../../services/api';
import SelectFornecedor from '../../components/form/SelectFornecedor';
import ItemVendaForm from './ItemVendaForm';
import ItemVendaList from '../../components/form/ItemVendaList';
import { formatarParaBRL } from '../../components/common/Tools';
import './styles.css';

function VendaQuitar() {

  const { venda } = useContext(AppContext);
  const navigate = useNavigate();

  const formMethods = useForm({
    defaultValues: {
      dtrecebimento: '',
      nrdocumento: '',
      vrrecebido: 0,
    },
  });

  const { control, register, handleSubmit, setValue, watch, reset, formState: { errors } } = formMethods;
  const { fields, append, remove } = useFieldArray({ control, name: 'itensVenda' });

  const [produtos, setProdutos] = useState([]);
  const [pessoas, setPessoas] = useState([]);
  const [vrTotal, setVrTotal] = useState(0);

  // useEffect(() => {
  //   if (!venda) {
  //     navigate('/vendas');
  //     return;
  //   }

  //   const fetchData = async () => {
  //     const [resProdutos, resPessoas] = await Promise.all([
  //       api.get('/produto'),
  //       api.get('/pessoa'),
  //     ]);
  //     setProdutos(resProdutos.data);
  //     setPessoas(resPessoas.data);

  //     const itens = venda.itemVenda.map(item => ({
  //       produtoId: item.produtoId,
  //       descricao: item.produto.descricao,
  //       sigla: item.produto.unidade.sigla,
  //       quantidade: item.quantidade,
  //       vrunit: item.vrunit ?? 0,
  //       ativo: item.ativo,
  //       vendaId: item.vendaId,
  //       id: item.id,
  //     }));

  //     reset({
  //       dtrecebimento: venda.dtrecebimento?.slice(0, 10) || new Date().toISOString().slice(0, 10),
  //       nrdocumento: venda.nrdocumento || '',
  //       vrrecebido: venda.vrrecebido || 0,
  //       itensVenda: itens,

  //     });
  //   };
  //   fetchData();
  // }, [venda, navigate, reset]);

  // const itensVenda = watch('itensVenda');

  // useEffect(() => {
  //   const total = itensVenda?.reduce((acc, item) => acc + item.quantidade * item.vrunit, 0) || 0;
  //   setVrTotal(total);
  // }, [itensVenda]);

  const onSubmit = async (fields) => {
    if (!fields.dtrecebimento || !fields.nrdocumento || !fields.vrrecebido) {
      alert("Preencha os dados para quitar.");
      return;
    }
    const vrRecebido = venda.vrrecebido + fields.vrrecebido;
    let statusRec = 'Recebido';
    if (vrRecebido < venda.vrtotal) {
      statusRec = 'Parcial';
    }
    const dadosQuitar = {
      vendaId: venda.id,
      dtrecebimento: fields.dtrecebimento,
      nrdocumento: fields.nrdocumento,
      vrrecebido: fields.vrrecebido,
      vrjuros: 0,
      vrdesconto: 0,
      ativo: true,
    }

    try {
      const response = await api.post(`/venda/${venda.id}`, vendaAtualizada);
      if (response.status === 200) {
        toast.success('Venda atualizada com sucesso!');
        setTimeout(() => navigate('/vendas'), 2000);
      } else {
        toast.error('Erro ao atualizar a venda.');
      }
    } catch (error) {
      toast.error(`Erro inesperado: ${error.message}`);
    }
  };

  return (
    <div className="tela-login">
      <div className="mycard-venda">
        <div className='title'>
          <h4>Quitar Venda</h4>
        </div>
        <div className='info-container'>
          <div className="row">
            <div className="col">Cliente: {venda.pessoa.nome}</div>
            <div className='col'>{`Emissão: ${venda.dtemissao.substring(8,10)}/${venda.dtemissao.substring(5,7)}/${venda.dtemissao.substring(0,4)}`}</div>
            <div className='col'>Nº Documento: {venda.nrdocumento}</div>
            <div className='col'>Vr. Total: {formatarParaBRL(venda.vrtotal)}</div>
          </div>
        </div>

        <div className="container p-0">

          <ItemVendaList itens={venda.itemVenda} onRemove={remove} />

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
export default VendaQuitar;
