import React from 'react';
import './ConfirmModal.css';

type ModalProps = {
  mensagem: string;
  onConfirmar: () => void;
  onCancelar: () => void;
};

export default function ConfirmModal({ mensagem, onConfirmar, onCancelar }: ModalProps) {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="#f3d52d" className="bi bi-exclamation-triangle-fill" viewBox="0 0 16 16">
            <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5m.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2"/>
          </svg>
        </div>
        <h4>Confirmação</h4>
        <p>{mensagem}</p>
        <div className="modal-buttons">
          <button onClick={onConfirmar} className="btn-confirm">Sim</button>
          <button onClick={onCancelar} className="btn-cancel">Não</button>
        </div>
      </div>
    </div>
  );
}
