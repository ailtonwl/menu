// src/pages/produto/ProdutoEdit.tsx
import { Controller } from 'react-hook-form';
import React, { useState, useEffect, useContext } from 'react'
import { useForm, FormProvider } from 'react-hook-form'
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import { AppContext } from '../../contexts/AppContext';
import api from '../../services/api'
import { formatarParaBRL } from '../../components/common/Tools';
import InputMonetario from '../../components/form/InputMonetario';
import 'react-toastify/dist/ReactToastify.css';
import './styles.css'

type ProdutoFormData = {
  descricao: string
  vrcusto: string
  vrvenda: string
  ativo: boolean
  unidadeId: number
}

type tipoProduto = {
  id: number
  descricao: string
  vrcusto: number
  vrvenda: number
  customedio: number
  estoque: number
  ativo: boolean
  unidadeId: number
}

type tipoUnidade = {
  id: number
  sigla: string
  descricao: string
  ativo: boolean
}

function ProdutoEdit() {
  const { produto } = useContext(AppContext);
  const navigate = useNavigate();

  const formMethods = useForm<ProdutoFormData>({
    defaultValues: {
      descricao: '',
      vrcusto: '',
      vrvenda: '',
      ativo: true,
      unidadeId: 0
    }
  });

  const { register, handleSubmit, setValue, reset, watch } = formMethods;
  const [unidades, setUnidades] = useState<tipoUnidade[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!produto) {
      navigate('/produtos');
      return;
    }

    const fetchData = async () => {
      try {
        const resUnidades = await api.get('/unidade');
        setUnidades(resUnidades.data);

        const valoresIniciais = {
          descricao: produto.descricao,
          vrcusto: 'R$ ' + formatarParaBRL(produto.vrcusto),
          vrvenda: 'R$ ' + formatarParaBRL(produto.vrvenda),
          ativo: produto.ativo,
          unidadeId: produto.unidadeId
        };

        reset(valoresIniciais);
        setIsLoading(false);
      } catch (error) {
        console.error('Erro ao buscar dados:', error);
        toast.error('Erro ao carregar dados.');
        navigate('/produtos');
      }
    };
    fetchData();
  }, [produto]);

  const onSubmit = async (data: ProdutoFormData) => {
    const produtoAtualizado: tipoProduto = {
      id: produto.id,
      descricao: data.descricao,
      vrcusto: parseFloat(data.vrcusto.replace(/\D/g, '')) / 100,
      vrvenda: parseFloat(data.vrvenda.replace(/\D/g, '')) / 100,
      customedio: produto.customedio,
      estoque: produto.estoque,
      ativo: data.ativo,
      unidadeId: data.unidadeId
    };
    console.log('produtoData: ', produtoAtualizado);
    try {
      const response = await api.put(`/produto/${produto.id}`, produtoAtualizado);
      if (response) {
        toast.success('Produto alterado com sucesso! 🎉');
        setTimeout(() => navigate('/produtos'), 2000); // Aguarda 3s antes de redirecionar
      } else {
        toast.error('Erro ao alterar o produto. Verifique os dados e tente novamente.');
      }
    } catch (error: any) {
      toast.error(`Erro inesperado: ${error.message}`);
    }
  }

  function voltar() {
    navigate('/produtos');
  }

  if (isLoading) return <div>Carregando...</div>

  return (
    <div className="tela-login">
      <div className="mycard">
        <h2 className="title">Alterar Produto</h2>
        <FormProvider {...formMethods}>
          <form onSubmit={handleSubmit(onSubmit)} className="form">
            <label htmlFor="descricao">Descrição do produto</label>
            <input
              {...register('descricao')}
              className="input-produto"
              type="text"
              placeholder="Descrição do produto"
              required
            />
            <div className='input-linha'>
            <label htmlFor="unidadeId">Escolha a unidade</label>
            <select id="unidadeId" {...register('unidadeId', { valueAsNumber: true })}>
              {unidades.map((unidade) => (
                <option key={unidade.id} value={unidade.id}>
                  {unidade.sigla}
                </option>
              ))}
            </select>
            </div>
            <InputMonetario
              name="vrcusto"
              control={formMethods.control}
              label="Preço de custo"
              placeholder="Vr. Custo"
              required
            />
            <InputMonetario
              name="vrvenda"
              control={formMethods.control}
              label="Preço de venda"
              placeholder="Vr. Venda"
              required
            />
            <div className="ckBoxes">
              <label>
                Ativo:&nbsp;&nbsp;
                <input type="checkbox" {...register('ativo')} />
              </label>
            </div>
            <div className='container-itens'>
              <button className='button cancel' type="button" onClick={voltar}>Voltar</button>
              <button className='button add' type="submit">Alterar</button>
            </div>
          </form>
        </FormProvider>
        <ToastContainer />
      </div>
    </div>
  )
}

export default ProdutoEdit
