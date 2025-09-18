// src/components/common/Navbar.jsx
import { Link, useNavigate } from 'react-router-dom';
import { destroyCookie } from 'nookies';
import { useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import './Navbar.css';

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout(); // 👈 limpa o contexto e localStorage
    // destroyCookie(null, 'appmenu.token');
    destroyCookie(null, 'token');
    navigate('/login'); // redireciona
  };

  if (!user) return null; // Esconde a navbar se não estiver logado

  return (
    <nav className="navbar bg-body-tertiary fixed-top px-4">
      <div className="col-4 text-start">
        <a className="navbar-brand" href="#">Controle</a>
      </div>
      <div className="col-8 text-end lh-1">
        <button className="but-logout" type="button" onClick={handleLogout} aria-label="Logout">
          Logout
        </button>
        <button className="navbar-toggler" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasNavbar" aria-controls="offcanvasNavbar" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="offcanvas offcanvas-end w-25" tabIndex={-1} id="offcanvasNavbar" aria-labelledby="offcanvasNavbarLabel">
          <div className="offcanvas-header">
            <h5 className="offcanvas-title" id="offcanvasNavbarLabel">Menu</h5>
            <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
          </div>
          <div className="offcanvas-body">
            <ul className="navbar-nav justify-content-start text-start flex-grow-1 pe-3">
              <li className="nav-item">
                <Link className='nav-link' to="/dashboard">Dashboard</Link>
              </li>
              <li className="nav-item">
                <Link className='nav-link' to="/pessoas">Pessoas</Link>
              </li>
              <li className="nav-item dropdown">
                <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                  Venda
                </a>
                <ul className="dropdown-menu ps-2">
                  <li>
                    <Link className='nav-link' to="/vendas">Vendas</Link>
                  </li>
                  <li>
                    <Link className='nav-link' to="/">Formas de Recebimento</Link>
                  </li>
                  {/* <li>
                    <hr className="dropdown-divider" />
                  </li>
                  <li><a className="dropdown-item" href="#">Something else here</a></li> */}
                </ul>
              </li>
              <li className="nav-item">
                <Link className='nav-link' to="/compras">Compras</Link>
              </li>
              <li className="nav-item dropdown">
                <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                  Produto
                </a>
                <ul className="dropdown-menu ps-2">
                  <li>
                    <Link className='nav-link' to="/produtos">Produtos</Link>
                  </li>
                  <li>
                    <Link className='nav-link' to="/unidades">Unidades</Link>
                  </li>
                  {/* <li>
                    <hr className="dropdown-divider" />
                  </li>
                  <li><a className="dropdown-item" href="#">Something else here</a></li> */}
                </ul>
              </li>
              <li className="nav-item">
                <Link className='nav-link' to="/usuarios">Usuários</Link>
              </li>
            </ul>
            {/* <form className="d-flex mt-3" role="search">
              <input className="form-control me-2" type="search" placeholder="Search" aria-label="Search" />
              <button className="btn btn-outline-success" type="submit">Search</button>
            </form> */}
          </div>
        </div>
      </div>
    </nav>
  )
}

/*
return (

    <nav className="navbar">
      <h1>Controle de Estoque</h1>
      <ul className="navbar-links">
        <li><Link to="/">Dashboard</Link></li>
        <li><Link to="/pessoas">Pessoas</Link></li>
        <li>
          <Link to="/produtos">Produtos</Link>
          <ul>
            <li><Link to="/produtos">Produtos</Link></li>
            <li><Link to="/unidades">Unidades</Link></li>
          </ul>
        </li>
        <li><Link to="/unidades">Unidades</Link></li>
        <li><Link to="/compras">Compras</Link></li>
      </ul>
      <button onClick={handleLogout}>Sair</button>
    </nav>
  );
*/
