// src/pages/produto/ProdutoAdd.tsx
import React, {useState, useEffect} from 'react'
import { useForm, SubmitHandler } from "react-hook-form";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import api from '../../services/api';
import { useNavigate } from 'react-router-dom';
import './styles.css';

type tipoProduto = {
  id: number,
  descricao: string,
  vrcusto: number,
  vrvenda: number,
  customedio: number,
  estoque: number,
  ativo: boolean,
  unid: number
}

type tipoUnidade = {
  id: number,
  sigla: string,
  descricao: number,
  ativo: boolean,
}

function ProdutoAdd() {

  const [unidades, setUnidades] = useState([]);
  const [isLoading, setInsLoading] = useState(true);
  const navigate = useNavigate();

  function voltar() {
    navigate('/produtos');
  }

  const { register,
    handleSubmit,
    formState: { errors } } = useForm<tipoProduto>();

  const onSubmit: SubmitHandler<tipoProduto> = async (data) => {
    // const descricao = data.descricao;
    // const vrcusto = data.vrcusto;
    // const vrvenda = data.vrvenda;
    // const customedio = 0;
    // const estoque = 0;
    // const ativo = data.ativo;
    // const unidadeId = Number(data.unid);

    const produtoData = {
      descricao: data.descricao,
      vrcusto: data.vrcusto,
      vrvenda: data.vrvenda,
      customedio: 0,
      estoque: 0,
      ativo: data.ativo,
      unidadeId: data.unid
    }

    console.log(produtoData);

    // try {
    //   console.log('data: ', data);

    //   const response = await fetch('http://localhost:8080/produto', {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json',
    //       // 'Authorization': "Bearer seu-token-aqui",
    //     },
    //     credentials: 'include',
    //     body: JSON.stringify({ descricao, vrcusto, vrvenda, customedio, estoque , ativo, unidadeId }),
    //   },)

    //   if (response.ok) {
    //     const data = await response.json();

    //     toast.success('Produto cadastrado com sucesso! 🎉');
    //     setTimeout(() => navigate('/produtos'), 3000); // Aguarda 3s antes de redirecionar

    //   } else {
    //     toast.error('Erro ao cadastrar produto. Verifique os dados e tente novamente.');
    //   }
    // } catch (error: any) {
    //   toast.error(`Erro inesperado: ${error.message}`);
    // }
    try {
      const response = await api.post("/produto", produtoData);

      if (response) {
        toast.success('Produto cadastrada com sucesso! 🎉');
        setTimeout(() => navigate('/produtos'), 2000); // Aguarda 3s antes de redirecionar
      } else {
        toast.error('Erro ao cadastrar o produto. Verifique os dados e tente novamente.');
      }
    } catch (error: any) {
      toast.error(`Erro inesperado: ${error.message}`);
    }
  };

  async function getUnidades() {
    let unidadesFromApi = await api.get('/unidade');
    setUnidades(unidadesFromApi.data);
  }

  if (isLoading) {
    getUnidades();
    setInsLoading(false);
  }

  return (
    <div className="tela-produto">
      <div className="mycard">
        <h2 className="title">Novo Produto</h2>
        <div id="nomeUsuario"></div>
        <form onSubmit={handleSubmit(onSubmit)} className="form">
          <label htmlFor="descricao">Descrição do produto</label>
          <input
            {...register('descricao')}
            className='input-produto'
            type="text"
            name="descricao"
            id="descricao"
            placeholder="Descrição do produto"
            required
          />
          <label htmlFor="unid">Escolha a unidade</label>
          <select id="unid" {...register("unid", { valueAsNumber: true })} >
            <option value="0">Selecione uma unidade</option>
            {
            unidades.map((unidade:tipoUnidade) => (
              <option key={unidade.id} value={unidade.id}>
                {unidade.sigla}
              </option>
            ))
            }
            {/* <option value="2">Galão</option> */}
          </select>
          <label htmlFor="vrcusto">Vr. Custo</label>
          <input
            {...register('vrcusto', { valueAsNumber: true })}
            className='input-produto'
            type="text"
            name="vrcusto"
            id="vrcusto"
            placeholder="Preço Custo"
            required
          />
          <label htmlFor="vrvenda">Vr. Venda</label>
          <input
            {...register('vrvenda', { valueAsNumber: true })}
            className='input-produto'
            type="text"
            name="vrvenda"
            id="vrvenda"
            placeholder="Preço Venda"
            required
          />
          <label htmlFor="ativo">Marque ou desmarque</label>
          <div className="ckBoxes">
            <div className="itemBox">
              <label>
                Ativo: &nbsp;&nbsp;
                <input
                  type="checkbox"
                  {...register("ativo")}
                />
              </label>
              {errors.ativo && <p className='msg-erro'>{errors.ativo.message}</p>}
            </div>
          </div>
          <div className='container-itens'>
            <button className='button cancel' type="button" onClick={voltar}>Voltar</button>
            <button className='button add' type="submit">Cadastrar</button>
          </div>
          {/* {error && <p className={styles.error}>{error}</p>} */}
          {/* <Link href="/cadastro">Ainda não possui conta?</Link> */}
        </form>
        <ToastContainer />
      </div>
    </div>
  )
}

export default ProdutoAdd;
