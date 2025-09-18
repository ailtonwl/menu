// src/AppRoutes.jsx
import { Routes, Route, Navigate } from 'react-router-dom';

// Páginas e componentes
import Dashboard from './pages/home/Dashboard';
import Pessoas from './pages/pessoa/Pessoas';
import PessoaAdd from './pages/pessoa/PessoaAdd';
import PessoaEdit from './pages/pessoa/PessoaEdit';

import Produtos from './pages/produto/Produtos';
import ProdutoAdd from './pages/produto/ProdutoAdd';
import ProdutoEdit from './pages/produto/ProdutoEdit';

import Unidades from './pages/unidade/Unidades';
import UnidadeAdd from './pages/unidade/UnidadeAdd';
import UnidadeEdit from './pages/unidade/UnidadeEdit';

import Compras from './pages/compra/Compra';
import CompraAdd from './pages/compra/CompraAdd';
import CompraEdit from './pages/compra/CompraEdit';

import Vendas from './pages/venda/Venda';
import VendaAdd from './pages/venda/VendaAdd';
import VendaEdit from './pages/venda/VendaEdit';
import VendaQuitar from './pages/venda/VendaQuitar';

import Login from './pages/login/Login';

import ProtectedRoute from './routes/ProtectedRoute';

export default function AppRoutes() {
  return (
    <Routes>
      {/* <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} /> */}

      <Route
        path="/"
        element={
          localStorage.getItem('user')
            ? <Navigate to="/dashboard" />
            : <Navigate to="/login" />
        }
      />


      <Route path="/login" element={<Login />} />

      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />

      <Route path="/pessoas" element={<ProtectedRoute><Pessoas /></ProtectedRoute>} />
      <Route path="/pessoas/add" element={<ProtectedRoute><PessoaAdd /></ProtectedRoute>} />
      <Route path="/pessoas/edit" element={<ProtectedRoute><PessoaEdit /></ProtectedRoute>} />

      <Route path="/produtos" element={<ProtectedRoute><Produtos /></ProtectedRoute>} />
      <Route path="/produtos/add" element={<ProtectedRoute><ProdutoAdd /></ProtectedRoute>} />
      <Route path="/produtos/edit" element={<ProtectedRoute><ProdutoEdit /></ProtectedRoute>} />

      <Route path="/unidades" element={<ProtectedRoute><Unidades /></ProtectedRoute>} />
      <Route path="/unidades/add" element={<ProtectedRoute><UnidadeAdd /></ProtectedRoute>} />
      <Route path="/unidades/edit" element={<ProtectedRoute><UnidadeEdit /></ProtectedRoute>} />

      <Route path="/compras" element={<ProtectedRoute><Compras /></ProtectedRoute>} />
      <Route path="/compras/add" element={<ProtectedRoute><CompraAdd /></ProtectedRoute>} />
      <Route path="/compras/edit" element={<ProtectedRoute><CompraEdit /></ProtectedRoute>} />

      <Route path="/vendas" element={<ProtectedRoute><Vendas /></ProtectedRoute>} />
      <Route path="/vendas/add" element={<ProtectedRoute><VendaAdd /></ProtectedRoute>} />
      <Route path="/vendas/edit" element={<ProtectedRoute><VendaEdit /></ProtectedRoute>} />
      <Route path="/vendas/receive" element={<ProtectedRoute><VendaQuitar /></ProtectedRoute>} />
    </Routes>
  );
}
