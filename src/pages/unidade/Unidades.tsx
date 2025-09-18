// src/pages/unidade/Unidades.tsx
import { useContext } from 'react';
import { AppContext } from '../../contexts/AppContext';
import React, {useState, useEffect} from 'react'
import api from '../../services/api';
import { useNavigate } from 'react-router-dom';
import ConfirmModal from '../../components/common/ConfirmModal.tsx';
import '../../declarations.d.ts';
import Plus from '../../assets/addcircle.svg';
import Delete from '../../assets/delete.svg';
import Edit from '../../assets/edit.svg';
import '../../App.css';

export default function Unidades() {

  type tipoUnidade = {
    id: number,
    sigla: string,
    descricao: string,
    ativo: boolean
  }

  const [unidades, setUnidades] = useState([]);
  const navigate = useNavigate();
  const [descProduto, setDescProduto] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [idParaExcluir, setIdParaExcluir] = useState<number | null>(null);

  function confirmarExclusao(id: number, descProduto: string) {
    if (id !== null) {
      setDescProduto(descProduto);
    }

    setIdParaExcluir(id);
    setShowModal(true);
  }

  function handleConfirmarExclusao() {
    if (idParaExcluir !== null) {
      deleteUnidade(idParaExcluir);
    }
    setShowModal(false);
    setIdParaExcluir(null);
  }

  function handleCancelarExclusao() {
    setShowModal(false);
    setIdParaExcluir(null);
  }

  async function deleteUnidade(id: number) {

    await api.delete(`/unidade/${id}`)

    getUnidades();
  }

  useEffect(() => {

  }, [unidades])

  function adicionaUnidade() {
    navigate('/unidades/add');
  }

  const { setUnidade } = useContext(AppContext);

  function alteraUnidade(data: tipoUnidade) {

    console.log(data);

    setUnidade(data);
    navigate('/unidades/edit');
  }

  async function getUnidades() {
    let unidadesFromApi = await api.get('/unidade');

    setUnidades(unidadesFromApi.data);
  }

  const [isLoading, setIsLoading] = useState(true);

  if (isLoading) {
    getUnidades();
    setIsLoading(false);
  }

  useEffect(() => {
    // setIsLoading(true);
  }, [unidades])

  return (
    <div className="container corpo">
      <div className="titOpcoes">
        <h2>Lista de Unidades de Produtos</h2>
        <button className='butAdd' aria-label="Adicionar unidade" onClick={adicionaUnidade}>
          <img alt='Imagem plus' src={Plus} />
        </button>
      </div>
      <div className="table-responsive text-start w-100">
        <table className="table table-striped table-sm">
          <thead className="table-dark">
            <tr>
              <th scope="col">Sigla</th>
              <th scope="col">Descrição</th>
              <th scope="col">Ativo</th>
              <th scope="col" className='text-end'>Ações</th>
            </tr>
          </thead>
          <tbody className="table-dark">
            {
              unidades.map((unidade:tipoUnidade) => (
                <tr key={unidade.id}>
                  <td>{unidade.sigla}</td>
                  <td>{unidade.descricao}</td>
                  <td>{unidade.ativo ? "Sim" : "Não"}</td>
                  <td>
                    <div className="buttons text-end">
                      <button type='button' aria-label="Alterar registro" color='blue' className="butRow"
                        onClick={() => {
                          alteraUnidade(unidade);
                        }}
                      >
                        <img alt='Imagem editar' src={Edit} />
                      </button>
                      <button type='button' aria-label="Alterar registro"  className="butRow"
                        onClick={() => confirmarExclusao(unidade.id, unidade.descricao)}
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
      {showModal && idParaExcluir !== null && (
        <ConfirmModal
          mensagem={`Deseja realmente excluir o produto ${descProduto} ?`}
          onConfirmar={handleConfirmarExclusao}
          onCancelar={handleCancelarExclusao}
        />
      )}
    </div>
  )
}
