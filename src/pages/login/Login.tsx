import { useForm } from 'react-hook-form';
import { setCookie } from 'nookies';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useContext, useEffect } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Login.css';

type FormData = {
  email: string;
  password: string;
};

export default function Login() {
  const { register, handleSubmit } = useForm<FormData>();
  const { login } = useContext(AuthContext); // 👈 Aqui usamos o contexto
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const erro = params.get('erro');

  useEffect(() => {
    if (erro) {
      const mensagens = {
        token_expirado: 'Sessão expirada. Faça login novamente.',
        token_ausente: 'Você precisa estar logado.',
      };

      toast.warn(mensagens[erro] || 'Erro desconhecido.');
    }
  }, [erro]);

  const navigate = useNavigate();

  async function handleSignIn({ email, password }: FormData) {
    try {
      const response = await fetch('http://localhost:8080/user/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const { user, token } = await response.json();

        localStorage.setItem('token', token);

        login(user); // 👈 Salva user no contexto
        navigate('/dashboard');
      } else {
        console.error('Credenciais inválidas');
      }
    } catch (error: any) {
      console.error('Erro ao fazer login:', error.message);
    }
  }

  return (
    <div className="tela-login">
      <div className="mycard">
        <h2 className="title">Login</h2>
        <form onSubmit={handleSubmit(handleSignIn)} className="form">
          <input
            {...register('email')}
            className="input-login"
            type="email"
            placeholder="Seu e-mail"
            required
          />
          <input
            {...register('password')}
            className="input-login"
            type="password"
            placeholder="Sua senha"
            required
          />
          <button className="button" type="submit">Entrar</button>
        </form>
      </div>
      <ToastContainer position="top-center" autoClose={4000} />
    </div>
  );
}
