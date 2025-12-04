import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { authService } from '../services/auth';
import { registerSchema } from '../schemas';
import { type RegisterInput } from '../schemas';
import Navbar from '../components/Navbar';
import '../App.css';

const Register: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  // Verificar modo escuro ao carregar
  useEffect(() => {
    const htmlElement = document.documentElement;
    const isDark = htmlElement.classList.contains('dark');
    setIsDarkMode(isDark);
  }, []);

  // Validação de senha
  const validatePassword = () => {
    const requirements = {
      length: password.length >= 6,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      match: password === confirmPassword && password !== ''
    };
    return requirements;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validação básica
    if (password !== confirmPassword) {
      setError('As senhas não coincidem');
      return;
    }

    const credentials: RegisterInput = { name, email, password };
    const validation = registerSchema.safeParse(credentials);
    if (!validation.success) {
      setError(validation.error.issues[0].message);
      return;
    }

    try {
      const { token, user } = await authService.register(credentials);
      login(token, user);
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Erro ao criar conta');
    }
  };

  const passwordRequirements = validatePassword();

  return (
    <div className="main-container">
      <Navbar />

      {/* Conteúdo do Registro */}
      <div className={`register-container ${isDarkMode ? 'dark' : 'light'}`}>
        <div className="register-content">
          {/* Cabeçalho com título e botão voltar */}
          <div style={{ 
            width: '100%', 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginBottom: '1.5rem'
          }}>
            <Link 
              to="/"
              className="back-button"
              style={{ margin: 0 }}
            >
              <span className="material-symbols-outlined">arrow_back</span>
              Voltar
            </Link>
            
            {/* Logo */}
            <div className="register-logo-container" style={{ margin: 0 }}>
              <div className="register-logo">
                <span className="material-symbols-outlined" style={{ color: 'var(--primary)', fontSize: '32px' }}>
                  person_add
                </span>
              </div>
            </div>
            
            {/* Espaço vazio para balancear o layout */}
            <div style={{ width: '100px' }}></div>
          </div>

          {/* Título */}
          <h1 className="register-title">
            Criar Conta
          </h1>

          <p className="register-subtitle">
            Junte-se ao nosso sistema de gestão de estoque
          </p>

          <form onSubmit={handleSubmit} className="register-form">
            {/* Erro */}
            {error && (
              <div className="register-error">
                {error}
              </div>
            )}

            {/* Nome */}
            <div>
              <label className="register-label">
                Nome Completo
              </label>
              <div style={{ position: 'relative' }}>
                <span className="material-symbols-outlined input-icon">
                  person
                </span>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Digite seu nome completo"
                  className="register-input"
                  style={{ paddingLeft: '3rem' }}
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="register-label">
                Endereço de Email
              </label>
              <div style={{ position: 'relative' }}>
                <span className="material-symbols-outlined input-icon">
                  mail
                </span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Digite seu email"
                  className="register-input"
                  style={{ paddingLeft: '3rem' }}
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="register-label">
                Senha
              </label>
              <div style={{ position: 'relative' }}>
                <span className="material-symbols-outlined input-icon">
                  lock
                </span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Crie uma senha"
                  className="register-input"
                  style={{ paddingLeft: '3rem', paddingRight: '3rem' }}
                  required
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <span className="material-symbols-outlined">
                    {showPassword ? "visibility" : "visibility_off"}
                  </span>
                </button>
              </div>

              {/* Password Requirements - Traduzido */}
              <div className="password-requirements">
                <div className={`requirement ${passwordRequirements.length ? 'valid' : 'invalid'}`}>
                  <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>
                    {passwordRequirements.length ? 'check_circle' : 'radio_button_unchecked'}
                  </span>
                  Pelo menos 6 caracteres
                </div>
                <div className={`requirement ${passwordRequirements.uppercase ? 'valid' : 'invalid'}`}>
                  <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>
                    {passwordRequirements.uppercase ? 'check_circle' : 'radio_button_unchecked'}
                  </span>
                  Pelo menos uma letra maiúscula
                </div>
                <div className={`requirement ${passwordRequirements.lowercase ? 'valid' : 'invalid'}`}>
                  <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>
                    {passwordRequirements.lowercase ? 'check_circle' : 'radio_button_unchecked'}
                  </span>
                  Pelo menos uma letra minúscula
                </div>
                <div className={`requirement ${passwordRequirements.number ? 'valid' : 'invalid'}`}>
                  <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>
                    {passwordRequirements.number ? 'check_circle' : 'radio_button_unchecked'}
                  </span>
                  Pelo menos um número
                </div>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="register-label">
                Confirmar Senha
              </label>
              <div style={{ position: 'relative' }}>
                <span className="material-symbols-outlined input-icon">
                  lock_reset
                </span>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirme sua senha"
                  className="register-input"
                  style={{ paddingLeft: '3rem', paddingRight: '3rem' }}
                  required
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  <span className="material-symbols-outlined">
                    {showConfirmPassword ? "visibility" : "visibility_off"}
                  </span>
                </button>
              </div>
              
              {/* Password Match Indicator - Traduzido */}
              {confirmPassword && (
                <div style={{ marginTop: '0.5rem' }}>
                  <div className={`requirement ${passwordRequirements.match ? 'valid' : 'invalid'}`}>
                    <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>
                      {passwordRequirements.match ? 'check_circle' : 'error'}
                    </span>
                    {passwordRequirements.match ? 'Senhas coincidem' : 'Senhas não coincidem'}
                  </div>
                </div>
              )}
            </div>

            {/* Botão Registrar */}
            <button
              type="submit"
              className="register-button"
              disabled={!passwordRequirements.match || !name || !email}
              style={{
                opacity: (!passwordRequirements.match || !name || !email) ? 0.5 : 1,
                cursor: (!passwordRequirements.match || !name || !email) ? 'not-allowed' : 'pointer'
              }}
            >
              Criar Conta
            </button>

            {/* Link para Login - Traduzido */}
            <div className="login-text">
              <p>
                Já tem uma conta?{' '}
                <Link to="/login" className="login-link">
                  Faça Login
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;