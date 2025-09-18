// src/App.jsx
import Navbar from './components/common/Navbar';
import AppRoutes from './AppRoutes';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap';

export default function App() {
  return (
    <>
      <Navbar />
      <AppRoutes />
    </>
  );
}
