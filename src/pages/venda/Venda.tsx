// src/pages/venda/Venda.tsx
import React, {useState, useEffect} from 'react'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useContext } from 'react';
import { AppContext } from '../../contexts/AppContext';
import api from '../../services/api';
import { useNavigate } from 'react-router-dom';
import '../../declarations.d.ts';
import Plus from '../../assets/addcircle.svg';
import Delete from '../../assets/delete.svg';
import Edit from '../../assets/edit.svg';
import Dollar from '../../assets/dollar.svg';
import ConfirmModal from '../../components/common/ConfirmModal.tsx';
import VendaFiltro from './VendaFiltro.tsx';
import { formatarParaBRL } from '../../components/common/Tools';
import './styles.css';

export default function Vendas() {
  type tipoVenda = {
    id: number,
    dtemissao: string,
    nrdocumento: string,
    vrtotal: number,
    ativo: boolean,
    status: string,
    vrrecebido: number,
    pessoaId: number,
    pessoa: {nome: string},
    itemVenda: [{
      id: number,
      quantidade: number,
      vrunit: number,
      ativo: string,
      produtoId: number,
      descricao: string,
      vendaId: number,
      produto: {
        descricao: string,
        unidade: {sigla: string}
      }
    }]
  }

  const { setVenda } = useContext(AppContext);
  const [totalVendas, setTotalVendas] = useState(0);
  const [totalReceber, setTotalReceber] = useState(0);
  const [totalRecebido, setTotalRecebido] = useState(0);

  const [pessoas, setPessoas] = useState([]);
  // const [allVendas, setAllVendas] = useState<tipoVenda[]>([]);
  const [allVendas, setAllVendas] = useState([]);
  const [vendas, setVendas] = useState([]);
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [idParaExcluir, setIdParaExcluir] = useState<number | null>(null);

  const [nomePessoa, setNomePessoa] = useState("");
  const [valorVenda, setValorVenda] = useState(0);

  const [mostrarFiltro, setMostrarFiltro] = useState(false);
  const [filtros, setFiltros] = useState({
    dataInicio: '',
    dataFim: '',
    pessoaId: 0,
    status: [],
    ativo: false,
  });

  function confirmarExclusao(id: number, vrTotal: number, nomePessoa: string) {
    if (id !== null) {
      setNomePessoa(nomePessoa);
      setValorVenda(vrTotal);
    }

    setIdParaExcluir(id);
    setShowModal(true);
  }

  function handleConfirmarExclusao() {
    if (idParaExcluir !== null) {
      deleteVenda(idParaExcluir);
    }
    setShowModal(false);
    setIdParaExcluir(null);
  }

  function handleCancelarExclusao() {
    setShowModal(false);
    setIdParaExcluir(null);
  }

  function adicionaVenda() {
    navigate('/vendas/add');
  }

  function alteraVenda(data: tipoVenda) {
    setVenda(data);
    navigate('/vendas/edit');
  }

  function quitarVenda(data: tipoVenda) {
    setVenda(data);
    navigate('/vendas/receive');
  }

  async function deleteVenda(id: number) {
    try {
      const response = await api.delete(`/venda/${id}`);
      if (response) {
        toast.success('Venda excluída com sucesso! 🎉');
        setTimeout(() => navigate('/vendas'), 3000); // Aguarda 3s antes de redirecionar
      } else {
        toast.error('Erro ao excluir a venda. Verifique os dados e tente novamente.');
      }
    } catch (error) {
      toast.error(`Erro inesperado: ${error.message}`);
    }
    getVendas();
  }

  function desfazerFiltros() {
    setFiltros({ dataInicio:'', dataFim:'', pessoaId:0, status:[], ativo:false });
    setVendas(allVendas);
  }

  function filtrarVendas() {
    let vendasFiltradas = [...allVendas];
    if (filtros.dataInicio) {
      vendasFiltradas = vendasFiltradas.filter(v => v.dtemissao.substring(0,10) >= filtros.dataInicio);
    }
    if (filtros.dataFim) {
      vendasFiltradas = vendasFiltradas.filter(v => v.dtemissao.substring(0,10) <= filtros.dataFim);
    }
    if (filtros.pessoaId && filtros.pessoaId !== 0) {
      vendasFiltradas = vendasFiltradas.filter(v => v.pessoaId === filtros.pessoaId);
    }
    if (filtros.status.length > 0) {
      vendasFiltradas = vendasFiltradas.filter(v => filtros.status.includes(v.status));
    }
    if (filtros.ativo) {
      vendasFiltradas = vendasFiltradas.filter(v => v.ativo);
    }
    setVendas(vendasFiltradas);
  }

  useEffect(() => {
    atuTotais();
  }, [vendas]);

  async function getVendas() {
    const vendasFromApi = await api.get('/venda');
    setVendas(vendasFromApi.data);
    setAllVendas(vendasFromApi.data);
  }

  async function getPessoas() {
    const pessoasFromApi = await api.get('/pessoa');
    setPessoas(pessoasFromApi.data);
  }

  useEffect(() => {
    getPessoas();
    getVendas();
  }, []);

  function atuTotais() {
    let total = vendas?.reduce((acc, item) => acc + item.vrtotal, 0) || 0;
    setTotalVendas(total);
    total = vendas?.reduce((acc, item) => acc + (item.vrtotal - item.vrrecebido), 0) || 0;
    setTotalReceber(total);
    total = vendas?.reduce((acc, item) => acc + item.vrrecebido, 0) || 0;
    setTotalRecebido(total);
  }

  return (
    <div className="corpo">
      <div className="titOpcoes">
        <h2>Lista de Vendas</h2>
        <button className='butAdd' aria-label="Adicionar produto" onClick={adicionaVenda}>
          <img alt='Imagem plus' src={Plus} />
        </button>
        <button className='filtros' onClick={() => setMostrarFiltro(!mostrarFiltro)}>🔍 Filtros</button>
      </div>
      <div className="info-container">
        <div className="row">
          <div className="col">Total das vendas: {formatarParaBRL(totalVendas)}</div>
          <div className="col">Total a receber: {formatarParaBRL(totalReceber)}</div>
          <div className="col">Total recebido: {formatarParaBRL(totalRecebido)}</div>
        </div>
      </div>
      {mostrarFiltro && (
        <VendaFiltro
          pessoas={pessoas}
          filtros={filtros}
          setFiltros={setFiltros}
          aplicarFiltros={filtrarVendas}
          desfazerFiltros={desfazerFiltros}
        />
      )}
      {vendas.map((venda:tipoVenda) => (
        <div key={venda.id} className='item-tabela'>
          <div className="row">
            <div className="col-10"><h5>Cliente: {venda.pessoa.nome}</h5></div>
            <div className="col-2 p-0 m-0 text-end">
              <div className='pe-2'>
                <button type='button' aria-label="Quitar Venda" color='blue' className="butRow"
                  onClick={() => { quitarVenda(venda)}}
                >
                <img alt='Imagem editar' src={Dollar} />
                </button>

                <button type='button' aria-label="Alterar registro" color='blue' className="butRow"
                  onClick={() => { alteraVenda(venda)}}
                >
                <img alt='Imagem editar' src={Edit} />
                </button>

                <button type='button' className="butRow" onClick={
                  () => confirmarExclusao(venda.id, venda.vrtotal, venda.pessoa.nome)}>
                  <img alt='Imagem lixeira' src={Delete} />
                </button>

              </div>
            </div>
          </div>

          <div className='container-cab'>
            <div className='row pb-2 cabecalho'>
              <div className='col p-0'>Documento: {venda.nrdocumento}</div>
              <div className='col p-0'>{`Emissão: ${venda.dtemissao.substring(8,10)}/${venda.dtemissao.substring(5,7)}/${venda.dtemissao.substring(0,4)}`}</div>
              <div className='col p-0 text-end'>Total: {formatarParaBRL(venda.vrtotal)}</div>
            </div>
          </div>

            <table className="table-responsive text-start w-100">
              <thead>
                <tr>
                  <th className="col-6">Produto</th>
                  <th className="col-1">Unid.</th>
                  <th className="col-1 me-1 text-end">Quant.</th>
                  <th className="col-2 text-end">Vr. Unit.</th>
                  <th className="col-2 text-end">Vr. Total</th>
                </tr>
              </thead>
              <tbody className="table-group-divider cor-grupo">
                {venda.itemVenda.map((item) => (
                  <tr key={item.id}>
                    <td>{item.produto.descricao}</td>
                    <td>{item.produto.unidade.sigla}</td>
                    <td className="col-1 me-1 text-end">{item.quantidade}</td>
                    <td className="col-2 text-end">{formatarParaBRL(item.vrunit)}</td>
                    <td className="col-2 text-end">{formatarParaBRL((item.quantidade * item.vrunit))}</td>
                  </tr>
                ))}
              </tbody>
            </table>
        </div>
      ))}
      <ToastContainer position="top-center" />
      {showModal && idParaExcluir !== null && (
        <ConfirmModal
          mensagem={`Deseja realmente excluir a venda de ${nomePessoa} no valor de R$ ${valorVenda.toFixed(2)} ?`}
          onConfirmar={handleConfirmarExclusao}
          onCancelar={handleCancelarExclusao}
        />
      )}

    </div>
  );
}
