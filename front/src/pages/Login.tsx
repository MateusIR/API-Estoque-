import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '../contexts/AuthContext';
import { authService } from '../services/auth';
import { loginSchema, type LoginInput } from '../schemas';
import LoadingSpinner from '../components/LoadingSpinner';
import Navbar from '../components/Navbar';
import '../App.css';

const Login: React.FC = () => {
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isDarkMode] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginInput) => {
    try {
      setIsLoading(true);
      setError('');
      const { token, user } = await authService.login(data);
      login(token, user);
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Erro ao fazer login');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className={`loading-container ${isDarkMode ? 'dark' : 'light'}`}>
        <LoadingSpinner size="large" text="Autenticando..." />
      </div>
    );
  }

  return (
    <div className="main-container">
      <Navbar />

      {/* Conteúdo do Login */}
      <div className={`login-container ${isDarkMode ? 'dark' : 'light'}`}>
        <div className="login-content">
          {/* Logo */}
          <div className="login-logo-container">
            <div className="login-logo">
              <span className="material-symbols-outlined" style={{ color: 'var(--primary)', fontSize: '32px' }}>
                inventory_2
              </span>
            </div>
          </div>

          {/* Título */}
          <h1 className="login-title">
            Bem-vindo ao Estocando
          </h1>

          <p className="login-subtitle">
            Entre no seu estoque
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="login-form">
            {/* Erro da API */}
           {error && (
          <div className="alert-error">
            <span className="material-symbols-outlined">error</span>
            {error}
          </div>
        )}


            {/* Email */}
            <div>
              <label className="login-label">
                Endereço de Email
              </label>
              <div className="input-container">
                <span className="material-symbols-outlined input-icon">
                  mail
                </span>

                <input
                  {...register('email')}
                  placeholder="Digite seu email"
                  className="login-input"
                />

                {errors.email && (
                  <p className="error-text">{errors.email.message}</p>
                )}
              </div>
            </div>

            {/* Senha */}
            <div>
              <label className="login-label">
                Senha
              </label>
              <div className="input-container">
                <span className="material-symbols-outlined input-icon">
                  lock
                </span>

                <input
                  {...register('password')}
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Digite sua senha"
                  className="login-input"
                />

                {/* Mostrar/ocultar senha */}
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <span className="material-symbols-outlined">
                    {showPassword ? "visibility" : "visibility_off"}
                  </span>
                </button>

                {errors.password && (
                  <p className="error-text">{errors.password.message}</p>
                )}
              </div>
            </div>

            {/* Botão Login */}
            <div style={{ paddingTop: '32px', paddingBottom: '24px', width: '100%' }}>
              <button
                type="submit"
                className="login-button"
              >
                Entrar
              </button>
            </div>

            {/* Link para cadastro */}
            <div className="signup-text">
              <p>
                Não tem uma conta?{' '}
                <Link to="/register" className="signup-link">
                  Cadastre-se
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
