// src/pages/compra/CompraAdd.tsx
import React, {useState, useEffect} from 'react'
import { useForm, FormProvider, SubmitHandler } from "react-hook-form";
import api from '../../services/api';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import './styles.css';
import ItemCompraForm from './ItemCompraForm';

type tipoCompra = {
  id: number,
  dtemissao: string,
  nrdocumento: string,
  vrtotal: number,
  ativo: boolean,
  fornecedor: number,
  pessoa: {nome: string},
  itemCompra: [{
    id: number,
    quantidade: number,
    vrunit: number,
    ativo: string,
    compraId: number,
    descricao: string,
    produtoId: number,
    produtoDesc: {descricao: string}
  }]
};

type tipoItemCompra = {
  idProduto : number,
  descricao : string,
  sigla : string,
  quantidade : number,
  vrunit : number
}

type tipoPessoa = {
  id: number,
  nome: string,
  email: string,
  status: string,
  cliente: boolean,
  fornecedor: boolean,
  fornece: boolean,
  ativo: boolean
}

function CompraAdd() {

  const [produtos, setProdutos] = useState([]);
  const [pessoas, setPessoas] = useState([]);
  const [itens, setItens] = useState([]);
  const [vrTotal, setVrTotal] = useState(0);
  const [itensCompra, setItensCompra] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const formMethods = useForm<tipoCompra>({
  defaultValues: {
    itemCompra: [],
    vrtotal: 0,
    dtemissao: '',
    nrdocumento: '',
    fornecedor: 0,
    // se estiver usando campos internos no ItemCompraForm:
    // produtoId: 0,
    // quantidade: 1,
    // vrunit: 'R$ 0,00'
  }
});

  const navigate = useNavigate();

  useEffect(() => {
    setVrTotal(calcularTotal(itensCompra));
  }, [itensCompra]);

  async function getProdutos() {
    let produtosFromApi = await api.get('/produto');
    setProdutos(produtosFromApi.data);
  }

  async function getPessoas() {
    let pessoasFromApi = await api.get('/pessoa');
    setPessoas(pessoasFromApi.data);
  }

  function calcularTotal(itens) {
    return itens.reduce((acc, item) => acc + item.quantidade * item.vrunit, 0);
  }

  function adicionarItem(novoItem:tipoItemCompra) {
    setItensCompra([...itensCompra, novoItem]);
  }

  if (isLoading) {
    getProdutos();
    getPessoas();
    setIsLoading(false);
  }

  function voltar() {
    navigate('/compras');
  }

  const { register,
    handleSubmit,
    formState: { errors } } = useForm<tipoCompra>();

  const onSubmit: SubmitHandler<tipoCompra> = async (data) => {
    if (!data.dtemissao || !data.nrdocumento || !data.fornecedor) {
      alert("Preencha os dados do cabeçalho.");
      return;
    }

    if (itensCompra.length === 0) {
      alert("Adicione pelo menos um item na compra.");
      return;
    }

    const compraData = {
      dtemissao: data.dtemissao,
      nrdocumento: data.nrdocumento,
      fornecedor: data.fornecedor,
      pessoaId: data.fornecedor,
      vrtotal: vrTotal,
      ativo: true,
      itemCompra: itensCompra,
    };

    try {
      const response = await api.post("/compra", compraData);
      if (response) {
        toast.success('Compra cadastrada com sucesso! 🎉');
        setTimeout(() => navigate('/compras'), 2000); // Aguarda 2s antes de redirecionar

      } else {
        toast.error('Erro ao cadastrar a compra. Verifique os dados e tente novamente.');
      }
    } catch (error: any) {
      toast.error(`Erro inesperado: ${error.message}`);
    }
  };

  return (
    <div className="tela-login">
      <div className="mycard-compra">
        <div className='title'>
          <h4>Nova Compra</h4>
        </div>
        <div id="nomeUsuario"></div>
        <FormProvider {...formMethods}>
        <form onSubmit={handleSubmit(onSubmit)} className="form">
          <div className='container-itens'>
            <div className="mb-0 text-start">
              <label htmlFor="dtemissao">Data Emissão</label>
              <input
                {...register('dtemissao')}
                className='input-compra'
                type="date"
                name="dtemissao"
                id="dtemissao"
                required
              />
            </div>
            <div className="mb-0 text-start">
              <label htmlFor="nrdocumento">Nº Documento</label>
              <input
                {...register('nrdocumento')}
                className='input-compra'
                type="text"
                name="nrdocumento"
                id="nrdocumento"
                placeholder="Nº Documento"
                required
              />
            </div>
            <div className="mb-0 text-end">
              <label htmlFor="vrtotal">Vr. Total</label>
              <input className='input-compra text-end' name='vrtotal' id='vrtotal' value={vrTotal} readOnly />
            </div>
          </div>
          <div className="mb-0 text-start">
            <label htmlFor="fornecedor">Fornecedor</label>
            <select id="fornecedor" {...register("fornecedor", { valueAsNumber: true })} >
              <option value="0">Selecione um fornecedor</option>
              {
              pessoas.map((pessoa:tipoPessoa) => (
                <option key={pessoa.id} value={pessoa.id}>
                  {pessoa.nome}
                </option>
              ))
              }
            </select>
          </div>

          <ItemCompraForm
            produtos={produtos}
            adicionarItem={adicionarItem}
            form={formMethods}
          />

          <div className="container">
            <div className="row grid-cab">
              <div className="col-6 ps-0 pe-1 pos-left">
                Produto
              </div>
              <div className="col-1 ps-1 pe-0 pos-left">
                Unid.
              </div>
              <div className="col-1 ps-1 pe-0 pos-right">
                Quant.
              </div>
              <div className="col-2 ps-1 pe-0 pos-right">
                Vr.Unit.
              </div>
              <div className="col-2 ps-1 pe-0 pos-right">
                Vr.Total
              </div>
            </div>
            <div id='listaItens' className="row grid-itens">
              {itensCompra.map((item:tipoItemCompra, index) => (
                <div key={index} className='div-limpa'>
                  <div className="col-6 ps-0 pe-1 pos-left">
                    {item.descricao}
                  </div>
                  <div className="col-1 ps-1 pe-0 pos-left">
                    {item.sigla}
                  </div>
                  <div className="col-1 ps-1 pe-0 pos-right">
                    {item.quantidade}
                  </div>
                  <div className="col-2 ps-1 pe-0 pos-right">
                    {(item.vrunit).toFixed(2)}
                  </div>
                  <div className="col-2 ps-1 pe-0 pos-right">
                    {(item.quantidade * item.vrunit).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className='container-itens'>
            <button className='button cancel' type="button" onClick={voltar}>Voltar</button>
            <button className='button add' type="submit">Cadastrar</button>
          </div>
        </form>
        </FormProvider>
        <ToastContainer />
      </div>
    </div>
  )
}

export default CompraAdd;
