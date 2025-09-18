// src/components/form/ItemCompraList.tsx
import React from 'react';
import '../../declarations.d.ts';
import Delete from '../../assets/delete.svg';
import '../../pages/compra/styles.css';

type Item = {
  id: number;
  descricao: string;
  sigla: string;
  quantidade: number;
  vrunit: number;
};

type Props = {
  itens: Item[];
  onRemove?: (id: number) => void;
};

export default function ItemCompraList({ itens, onRemove }: Props) {
  return (
    // <div className="container">
    <>
      <div className="row grid-cab">
        <div className="col-5 ps-0 text-start">Produto</div>
        <div className="col-2 ps-0 text-start">Unid.</div>
        <div className="col-2 ps-0 text-end">Quant.</div>
        <div className="col-2 ps-0 text-end">Vr.Total</div>
        <div className="col-1 text-end">Ação</div>
      </div>
      <div className="row grid-itens">
        {itens.map((item, index) => (
          <div key={index} className='div-limpa'>
            <div className="col-5 ps-0 text-start">{item.descricao}</div>
            <div className="col-2 ps-0 text-start">{item.sigla}</div>  {/* introduzir item.sigla */}
            <div className="col-2 ps-0 text-end">{item.quantidade.toFixed(2)}</div>
            <div className="col-2 ps-0 text-end">{(item.quantidade * item.vrunit).toFixed(2)}</div>
            {onRemove && (
              <div className="col-1 text-end">
                <button onClick={() => onRemove(item.id)} className="butRow">
                  <img alt='Imagem lixeira' src={Delete} />
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </>
    // {/* </div> */}
  );
}
