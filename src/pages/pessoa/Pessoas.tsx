import { useContext } from 'react';
import { AppContext } from '../../contexts/AppContext';
import React, {useState, useEffect} from 'react'
import api from '../../services/api';
import { useNavigate } from 'react-router-dom';
import '../../declarations.d.ts';
import Plus from '../../assets/addcircle.svg';
import Delete from '../../assets/delete.svg';
import Edit from '../../assets/edit.svg';
import './styles.css';

type tipoPessoa = {
  id: number,
  nome: string,
  email: string,
  status: string,
  cliente: boolean,
  fornecedor: boolean,
  ativo: boolean
}

export default function Pessoas() {

  const [pessoas, setPessoas] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {

  }, [pessoas])

  function adicionaPessoa() {
    navigate('/pessoas/add');
  }

  const { setPessoa } = useContext(AppContext);

  function alterarPessoa(data: tipoPessoa) {

    setPessoa(data);
    navigate('/pessoas/edit');
  }

  async function deletePessoa(id) {

    await api.delete(`/pessoa/${id}`)

    getPessoas();
  }

  useEffect(() => { }, [pessoas])

  async function getPessoas() {
    let pessoasFromApi = await api.get('/pessoa');

    // console.log(pessoasFromApi.status);
    if (pessoasFromApi.status === 200) {
      setPessoas(pessoasFromApi.data);
    } else {
      navigate('/login');
    }

  }

  const [isLoading, setIsLoading] = useState(true);

  if (isLoading) {

    getPessoas();
    setIsLoading(false);
  }

  useEffect(() => {
    // setIsLoading(true);
  }, [pessoas])

  return (
    <div className="container corpo">
      <div className="titOpcoes">
        <h2>Lista de Pessoas</h2>
        <button className='butAdd' aria-label="Adicionar pessoa" onClick={adicionaPessoa}>
          <img alt='Imagem plus' src={Plus} />
        </button>
      </div>
      <div className="table-responsive text-start w-100">
        <table className="table table-striped table-sm">
          <thead className="table-dark">
            <tr>
              <th scope="col">Nome</th>
              <th scope="col">Email</th>
              <th scope="col">Status</th>
              <th scope="col">Cliente</th>
              <th scope="col">Fornecedor</th>
              <th scope="col">Ativo</th>
              <th scope="col">Ações</th>
            </tr>
          </thead>
          <tbody className="table-dark">
            {

              // dados.map((pessoa) => (
              pessoas.map((pessoa:tipoPessoa) => (
                <tr key={pessoa.id}>
                  <td>{pessoa.nome}</td>
                  <td>{pessoa.email}</td>
                  <td>{pessoa.status}</td>
                  <td>{pessoa.cliente ? "Sim" : "Não"}</td>
                  <td>{pessoa.fornecedor ? "Sim" : "Não"}</td>
                  <td>{pessoa.ativo ? "Sim" : "Não"}</td>
                  <td>
                    <div className="buttons">
                      <button type='button' aria-label="Alterar registro" color='blue' className="butRow"
                        onClick={() => {
                          alterarPessoa(pessoa);
                        }}
                      >
                        <img alt='Imagem editar' src={Edit} />
                      </button>
                      <button type='button' aria-label="Alterar registro"  className="butRow"
                        onClick={() => deletePessoa(pessoa.id)}
                      >
                        <img alt='Imagem lixeira' src={Delete} />
                      </button>
                    </div>
                  </td>

                </tr>
              ))
            }
          </tbody>
        </table>
      </div>
    </div>
  )
}
