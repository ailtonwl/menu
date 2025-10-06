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
import InputMonetario from '../../components/form/InputMonetario';
import './styles.css';

type RecebeFormData = {
  dtrecebimento: Date
  nrdocumento: string
  vrrecebido: string
}

function VendaQuitar() {

  const { venda } = useContext(AppContext);
  const navigate = useNavigate();

  const formMethods = useForm({
    defaultValues: {
      dtrecebimento: new Date().toISOString().slice(0, 10),
      nrdocumento: '',
      vrrecebido: 'R$ ' + formatarParaBRL(venda.vrtotal) || '0',
    },
  });

  const { control, register, handleSubmit, setValue, watch, reset, formState: { errors } } = formMethods;
  // const { fields, append, remove } = useFieldArray({ control, name: 'itensVenda' });

  const [produtos, setProdutos] = useState([]);
  const [pessoas, setPessoas] = useState([]);

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

  const onSubmit = async (data: RecebeFormData) => {
    if (!data.dtrecebimento || !data.nrdocumento || !data.vrrecebido) {
      alert("Preencha os dados para quitar.");
      return;
    }
    const vrRecebido = venda.vrrecebido + data.vrrecebido;
    let statusRec = (vrRecebido < venda.vrtotal) ? 'Parcial' : 'Recebido';
    const dadosQuitar = {
      vendaId: venda.id,
      dtrecebimento: data.dtrecebimento,
      nrdocumento: data.nrdocumento,
      vrrecebido: parseFloat(data.vrrecebido.replace(/\D/g, '')) / 100,
      vrjuros: 0,
      vrdesconto: 0,
      ativo: true,
    }

    const dadosEditVenda = {
      dtrecebimento: data.dtrecebimento,
      nrdocumento: data.nrdocumento,
      vrrecebido: parseFloat(data.vrrecebido.replace(/\D/g, '')) / 100,
      vrRecAnterior: venda.vrrecebido,
      vendaTotal: venda.vrtotal
    }

    try {
      const response = await api.post("/recebimento", dadosQuitar);
      if (response.status === 201) {
        toast.success('Recebimento registrado com sucesso!');
        setTimeout(() => navigate('/vendas'), 2000);
      } else {
        toast.error('Erro ao registrar o recebimento.');
      }
    } catch (error) {
      toast.error(`Erro inesperado: ${error.message}`);
    }
    await api.put(`/venda/receb/${venda.id}`, dadosEditVenda)
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
            <div className="row grid-cab">
              <div className="col-6 ps-0 text-start">Produto</div>
              <div className="col-1 ps-0 text-start">Unid.</div>
              <div className="col-2 ps-0 pe-0 text-end">Quant.</div>
              <div className="col-3 ps-0 pe-0 text-end">Vr.Total</div>
            </div>
            <div className="row grid-itens">
              {venda.itemVenda.map((item, index:number) => (
                <div key={index} className='div-limpa mb-3'>
                  <div className="col-6 ps-0 text-start">{item.produto.descricao}</div>
                  <div className="col-1 ps-0 text-start">{item.produto.unidade.sigla}</div>  {/* introduzir item.sigla */}
                  <div className="col-2 ps-0 text-end">{item.quantidade.toFixed(2)}</div>
                  <div className="col-3 ps-0 text-end">{(item.quantidade * item.vrunit).toFixed(2)}</div>
                </div>
              ))}
            </div>
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
            <div className="container recebe">
            <div className="row titulo-recebe">Digite os dados do recebimento:</div>
            <div className='container-form'>
              <div className="mb-0 text-start">
                <label htmlFor="dtrecebimento">Data</label>
                <input {...register('dtrecebimento')} className='input-venda' type="date" required />
              </div>
              <div className="mb-0 text-start">
                <label htmlFor="nrdocumento">Documento</label>
                <input {...register('nrdocumento')} className='input-venda' type="text" required />
              </div>
              <div className="mb-0 text-end">
                <label htmlFor="vrrecebido">Valor</label>
                {/* <input {...register('vrrecebido')} id='vrrecebido' className='input-venda text-end' type='text' required /> */}
                <InputMonetario
                  name="vrrecebido"
                  control={formMethods.control}
                  // label="Valor"
                  // placeholder="Vr. Custo"
                  required
                />
              </div>
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
