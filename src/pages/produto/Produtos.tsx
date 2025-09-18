// src/pages/Produtos.tsx
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
import { formatarParaBRL } from '../../components/common/Tools'

type tipoProduto = {
  id: number,
  descricao: string,
  vrcusto: number,
  vrvenda: number,
  customedio: number,
  estoque: number,
  ativo: boolean,
  unidadeId: number
  sigla: string,
}

export default function Produtos() {

  const [produtos, setProdutos] = useState([]);
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
      deleteProduto(idParaExcluir);
    }
    setShowModal(false);
    setIdParaExcluir(null);
  }

  function handleCancelarExclusao() {
    setShowModal(false);
    setIdParaExcluir(null);
  }

  async function deleteProduto(id: number) {

    await api.delete(`/produto/${id}`)

    getProdutos();
  }

  function adicionaProduto() {
    navigate('/produtos/add');
  }

  const { setProduto } = useContext(AppContext);

  function alterarProduto(data: tipoProduto) {

    setProduto(data);
    navigate('/produtos/edit');
  }

  useEffect(() => { }, [produtos])

  async function getProdutos() {
    let produtosFromApi = await api.get('/produto');

    setProdutos(produtosFromApi.data);
  }

  const [isLoading, setInsLoading] = useState(true);

  if (isLoading) {
    getProdutos();
    setInsLoading(false);
  }

  return (
    <div className="container corpo">
      <div className="titOpcoes">
        <h2>Lista de Produtos</h2>
        <button className='butAdd' aria-label="Adicionar produto" onClick={adicionaProduto}>
          <img alt='Imagem plus' src={Plus} />
        </button>
      </div>
      <div className="table-responsive text-start w-100">
      <table className="table table-striped table-sm">
        <thead className="table-dark">
          <tr>
            <th className="col texto-esquerda">Descrição</th>
            <th className="col">Unidade</th>
            <th className="col texto-direita">Estoque</th>
            <th className="col texto-direita">Custo R$</th>
            <th className="col texto-direita">Custo Médio</th>
            <th className="col texto-direita">Venda R$</th>
            <th className="col texto-centro">Ativo</th>
            <th className="col texto-centro">Ações</th>
          </tr>
        </thead>
        <tbody className="table-dark">
          {
            produtos.map((produto:tipoProduto) => (
              <tr key={produto.id}>
                <td className="texto-esquerda">{produto.descricao}</td>
                <td>{produto.sigla}</td>
                <td className='text-end'>{produto.estoque}</td>
                <td className='text-end'>{formatarParaBRL(produto.vrcusto)}</td>
                <td className='text-end'>{produto.customedio}</td>
                <td className='text-end'>{formatarParaBRL(produto.vrvenda)}</td>
                <td className="texto-centro">{produto.ativo ? "Sim" : "Não"}</td>
                <td className="texto-centro">
                  <div className="buttons">
                    <button type='button' aria-label="Alterar registro" color='blue' className="butRow"
                      onClick={() => {
                        alterarProduto(produto);
                      }}
                    >
                      <img alt='Imagem editar' src={Edit} />
                    </button>
                    <button type='button' aria-label="Alterar registro"  className="butRow"
                      onClick={() => confirmarExclusao(produto.id, produto.descricao)}
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
