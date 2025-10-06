// src/pages/compra/Compra.tsx
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
import ConfirmModal from '../../components/common/ConfirmModal.tsx';
import CompraFiltro from './CompraFiltro.tsx';
import { formatarParaBRL } from '../../components/common/Tools';
import './styles.css';

export default function Compras() {
  type tipoCompra = {
    id: number,
    dtemissao: string,
    nrdocumento: string,
    vrtotal: number,
    ativo: boolean,
    pessoaId: number,
    pessoa: {nome: string},
    itemCompra: [{
      id: number,
      quantidade: number,
      vrunit: number,
      ativo: string,
      produtoId: number,
      descricao: string,
      compraId: number,
      produto: {
        descricao: string,
        unidade: {sigla: string}
      }
    }]
  }

  const { setCompra } = useContext(AppContext);
  const [totalCompras, setTotalCompras] = useState(0);
  const [pessoas, setPessoas] = useState([]);
  const [allCompras, setAllCompras] = useState([]);
  const [compras, setCompras] = useState([]);
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [idParaExcluir, setIdParaExcluir] = useState<number | null>(null);

  const [nomePessoa, setNomePessoa] = useState("");
  const [valorCompra, setValorCompra] = useState(0);

  const [mostrarFiltro, setMostrarFiltro] = useState(false);
  const [filtros, setFiltros] = useState({
    dataInicio: '',
    dataFim: '',
    pessoaId: 0,
    ativo: false,
  });

  function confirmarExclusao(id: number, vrTotal: number, nomePessoa: string) {
    if (id !== null) {
      setNomePessoa(nomePessoa);
      setValorCompra(vrTotal);
    }

    setIdParaExcluir(id);
    setShowModal(true);
  }

  function handleConfirmarExclusao() {
    if (idParaExcluir !== null) {
      deleteCompra(idParaExcluir);
    }
    setShowModal(false);
    setIdParaExcluir(null);
  }

  function handleCancelarExclusao() {
    setShowModal(false);
    setIdParaExcluir(null);
  }

  function adicionaCompra() {
    navigate('/compras/add');
  }

  function alteraCompra(data: tipoCompra) {

    setCompra(data);
    navigate('/compras/edit');
  }

  async function deleteCompra(id: number) {

    try {
      const response = await api.delete(`/compra/${id}`);
      if (response) {
        toast.success('Compra excluída com sucesso! 🎉');
        setTimeout(() => navigate('/compras'), 2000); // Aguarda 2s antes de redirecionar

      } else {
        toast.error('Erro ao excluir a compra. Verifique os dados e tente novamente.');
      }
    } catch (error) {
      toast.error(`Erro inesperado: ${error.message}`);
    }

    getCompras();
  }

  async function getPessoas() {
    const pessoasFromApi = await api.get('/pessoa');
    setPessoas(pessoasFromApi.data);
  }

  useEffect(() => {
    getPessoas();
    getCompras();
   }, []);

  function desfazerFiltros() {
    setFiltros({ dataInicio:'', dataFim:'', pessoaId:0, ativo:false });
    setCompras(allCompras);
  }

  function filtrarCompras() {
    let comprasFiltradas = [...allCompras];
    if (filtros.dataInicio) {
      comprasFiltradas = comprasFiltradas.filter(v => v.dtemissao.substring(0,10) >= filtros.dataInicio);
    }
    if (filtros.dataFim) {
      comprasFiltradas = comprasFiltradas.filter(v => v.dtemissao.substring(0,10) <= filtros.dataFim);
    }
    if (filtros.pessoaId && filtros.pessoaId !== 0) {
      comprasFiltradas = comprasFiltradas.filter(v => v.pessoaId === filtros.pessoaId);
    }
    if (filtros.ativo) {
      comprasFiltradas = comprasFiltradas.filter(v => v.ativo);
    }
    setCompras(comprasFiltradas);
  }

  useEffect(() => {
    atuTotais();
  }, [compras]);

  async function getCompras() {

    const comprasFromApi = await api.get('/compra');
    setCompras(comprasFromApi.data);
    setAllCompras(comprasFromApi.data);
  }

  const [isLoading, setIsLoading] = useState(true);

  if (isLoading) {
    getCompras();
    setIsLoading(false);
  }

  function atuTotais() {
    let total = compras?.reduce((acc, item) => acc + item.vrtotal, 0) || 0;
    setTotalCompras(total);
  }

  return (
    <div className="corpo">
      <div className="titOpcoes">
        <h2>Lista de Compras</h2>
        <button className='butAdd' aria-label="Adicionar produto" onClick={adicionaCompra}>
          <img alt='Imagem plus' src={Plus} />
        </button>
        {
          (!filtros.ativo && filtros.dataFim==='' && filtros.dataInicio==='' && filtros.pessoaId===0)
          ? <button className='filtros-vazio' onClick={() => setMostrarFiltro(!mostrarFiltro)}>🔍 Filtros</button>
          : <button className='filtros' onClick={() => setMostrarFiltro(!mostrarFiltro)}>🔍 Filtros</button>
        }
      </div>
      <div className="info-container larg-900">
        <div className="row">
          <div className="col">Total das compras: {formatarParaBRL(totalCompras)}</div>
        </div>
      </div>
      {mostrarFiltro && (
        <CompraFiltro
          pessoas={pessoas}
          filtros={filtros}
          setFiltros={setFiltros}
          aplicarFiltros={filtrarCompras}
          desfazerFiltros={desfazerFiltros}
        />
      )}
      {compras.map((compra:tipoCompra) => (
        <div key={compra.id} className='item-tabela'>
          <div className="row">
            <div className="col-10 p-0 m-0 text-start"><h5>Cliente: {compra.pessoa.nome}</h5></div>
            <div className="col-2 p-0 m-0 text-end">
              <div className='pe-2'>
                <button type='button' aria-label="Alterar registro" color='blue' className="butRow"
                  onClick={() => { alteraCompra(compra)}}
                >
                <img alt='Imagem editar' src={Edit} />
                </button>

                <button type='button' className="butRow" onClick={
                  () => confirmarExclusao(compra.id, compra.vrtotal, compra.pessoa.nome)}>
                  <img alt='Imagem lixeira' src={Delete} />
                </button>

              </div>
            </div>
          </div>

          <div className='container-cab'>
            <div className='row cabecalho'>
              <div className='col p-0'>Documento: {compra.nrdocumento}</div>
              <div className='col p-0'>{`Emissão: ${compra.dtemissao.substring(8,10)}/${compra.dtemissao.substring(5,7)}/${compra.dtemissao.substring(0,4)}`}</div>
              <div className='col p-0 text-end'>Total: {formatarParaBRL(compra.vrtotal)}</div>
            </div>
          </div>

          <div>
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
                {compra.itemCompra.map((item) => (
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
        </div>
      ))}
      <ToastContainer position="top-center" />
      {showModal && idParaExcluir !== null && (
        <ConfirmModal
          mensagem={`Deseja realmente excluir a compra de ${nomePessoa} no valor de R$ ${valorCompra.toFixed(2)} ?`}
          onConfirmar={handleConfirmarExclusao}
          onCancelar={handleCancelarExclusao}
        />
      )}

    </div>
  );
}
