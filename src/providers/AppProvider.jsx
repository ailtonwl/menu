// src/providers/AppProvider.jsx
import React, { useState } from 'react';
import { AppContext } from '../contexts/AppContext';

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState({});
  const [pessoa, setPessoa] = useState({});
  const [produto, setProduto] = useState({});
  const [unidade, setUnidade] = useState({});
  const [compra, setCompra] = useState({});
  const [venda, setVenda] = useState({});

  return (
    <AppContext.Provider value={{
      user, setUser,
      pessoa, setPessoa,
      produto, setProduto,
      unidade, setUnidade,
      compra, setCompra,
      venda, setVenda,
    }}>
      {children}
    </AppContext.Provider>
  );
};
