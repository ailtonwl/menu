import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import api from '../../services/api';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import '../../App.css';

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

function PessoaAdd() {

  const navigate = useNavigate();

  function voltar() {
    navigate('/pessoas');
  }

  const { register,
    handleSubmit,
    formState: { errors } } = useForm<tipoPessoa>();

  const onSubmit: SubmitHandler<tipoPessoa> = async (data) => {

    try {
      const response = await api.post("/pessoa", data);

      if (response) {
        toast.success('Pessoa cadastrada com sucesso! 🎉');
        setTimeout(() => navigate('/pessoas'), 3000); // Aguarda 3s antes de redirecionar
      } else {
        toast.error('Erro ao cadastrar a pessoa. Verifique os dados e tente novamente.');
      }
    } catch (error: any) {
      toast.error(`Erro inesperado: ${error.message}`);
    }
  };

  return (
    <div className="tela-login">
      <div className="mycard">
        <h2 className="title">Nova Pessoa</h2>
        <div id="nomeUsuario"></div>
        <form onSubmit={handleSubmit(onSubmit)} className="form">
          <label htmlFor="nome">Nome da pessoa</label>
          <input
            {...register('nome')}
            className='input-pessoa'
            type="text"
            name="nome"
            id="nome"
            placeholder="Nome da pessoa"
            required
          />
          <label htmlFor="email">E-mail</label>
          <input
            {...register('email')}
            className='input-pessoa'
            type="email"
            name="email"
            id="email"
            placeholder="Digite o e-mail"
            required
          />
          <label htmlFor="cliente">Marque ou desmarque</label>
          <div className="ckBoxes">
            <div className="itemBox">
              <label>
                É cliente: &nbsp;&nbsp;
                <input
                  type="checkbox"
                  {...register("cliente")}
                />
              </label>
              {errors.cliente && <p className='msg-erro'>{errors.cliente.message}</p>}
            </div>
            <div className="itemBox">
              <label>
                É fornecedor: &nbsp;&nbsp;
                <input
                  type="checkbox"
                  {...register("fornecedor")}
                />
              </label>
              {errors.fornecedor && <p className='msg-erro'>{errors.fornecedor.message}</p>}
            </div>
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
          <label htmlFor="status">Escolha uma opção</label>
          <select id="status" {...register("status")} >
            <option value="Liberado">Liberado</option>
            <option value="Bloqueado">Bloqueado</option>
            <option value="Em Débito">Em Débito</option>
          </select>
          <div className='container-itens'>
            <button className='button cancel' type="button" onClick={voltar}>Voltar</button>
            <button className='button' type="submit">Cadastrar</button>
          </div>
          {/* {error && <p className={styles.error}>{error}</p>} */}
          {/* <Link href="/cadastro">Ainda não possui conta?</Link> */}
        </form>
        <ToastContainer />
      </div>
    </div>
  )
}

export default PessoaAdd;
