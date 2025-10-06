// src/components/compra/CompraFiltro.tsx
import React from 'react';

type Props = {
  pessoas: { id: number; nome: string }[];
  filtros: { dataInicio: string; dataFim: string; pessoaId: number; ativo: boolean};
  setFiltros: (f: any) => void;
  aplicarFiltros: () => void;
  desfazerFiltros: () => void;
};

export default function CompraFiltro({ pessoas, filtros, setFiltros, aplicarFiltros, desfazerFiltros }: Props) {
  return (
    <div className="filtro-container">
      <div className="titulo-adic">Filtros</div>
      {/* <div className='container-itens'> */}
        <div className="mb-0 text-start">
          <label htmlFor="dataInicio">Data Inicial:</label>
          <input
            className='input-venda'
            id='dataInicio'
            type="date"
            value={filtros.dataInicio}
            onChange={(e) => setFiltros({ ...filtros, dataInicio: e.target.value })}
          />
          <label htmlFor="dataFim">Data Final:</label>
          <input
            className='input-venda'
            id='dataFim'
            type="date"
            value={filtros.dataFim}
            onChange={(e) => setFiltros({ ...filtros, dataFim: e.target.value })} />
        </div>
      {/* </div> */}

      <div className="input-linha">
        <label htmlFor="pessoaId">Pessoa:</label>
        <select id='pessoaId' value={filtros.pessoaId} onChange={(e) => setFiltros({ ...filtros, pessoaId: Number(e.target.value) })}>
          <option value={0}>Todas</option>
          {pessoas.map(p => <option key={p.id} value={p.id}>{p.nome}</option>)}
        </select>
      </div>

      <div className="ckBoxes">
        <div className="itemBox">
          <label>
            <input
              className='input-status'
              type="checkbox"
              checked={filtros.ativo}
              onChange={(e) => setFiltros({ ...filtros, ativo: e.target.checked })}
            />
            Somente ativos
          </label>
        </div>
      </div>

      <div className='container-itens'>
        <button className='button filtros' onClick={aplicarFiltros}>Aplicar Filtros</button>
        <button className='button cancel' onClick={desfazerFiltros}>Limpar Filtros</button>
      </div>
    </div>
  );
}
