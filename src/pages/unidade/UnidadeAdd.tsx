import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import api from '../../services/api';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import './styles.css';

type tipoUnidade = {
    id: number,
    sigla: string,
    descricao: string,
    ativo: boolean
  }

function UnidadeAdd() {

  const navigate = useNavigate();

  function voltar() {
    navigate('/unidades');
  }

  const { register,
    handleSubmit,
    formState: { errors }
  } = useForm<tipoUnidade>();

  const onSubmit: SubmitHandler<tipoUnidade> = async (data) => {

    try {
      const response = await api.post("/unidade", data);

      if (response) {

        toast.success('Unidade cadastrada com sucesso! 🎉');
        setTimeout(() => navigate('/unidades'), 2000); // Aguarda 2s antes de redirecionar

      } else {
        toast.error('Erro ao cadastrar unidade. Verifique os dados e tente novamente.');
      }
    } catch (error: any) {
      toast.error(`Erro inesperado: ${error.message}`);
    }
  };

  return (
    <div className="tela-unidade">
      <div className="mycard">
        <h2 className="title">Nova Unidade</h2>
        <div id="nomeUsuario"></div>
        <form onSubmit={handleSubmit(onSubmit)} className="form">
          <label htmlFor="sigla">Abreviatura da unidade</label>
          <input
            {...register('sigla')}
            className='input-unidade'
            type="text"
            name="sigla"
            id="sigla"
            placeholder="Sigla"
            required
          />
          <label htmlFor="descricao">Descrição da unidade</label>
          <input
            {...register('descricao')}
            className='input-unidade'
            type="text"
            name="descricao"
            id="descricao"
            placeholder="Descrição"
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

export default UnidadeAdd;
