// components/Navbar.tsx
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom'; // 1. Importei useLocation
import '../App.css';

interface NavbarProps {
  user?: { name: string };
  showLogout?: boolean;
  showlinks?: boolean;
  onLogout?: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ user, showLogout, showlinks = false, onLogout }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const location = useLocation(); // 2. Pegamos a localização atual

  useEffect(() => {
    const htmlElement = document.documentElement;
    const isDark = htmlElement.classList.contains('dark');
    setIsDarkMode(isDark);
  }, []);

  const toggleTheme = () => {
    const htmlElement = document.documentElement;
    if (htmlElement.classList.contains('dark')) {
      htmlElement.classList.remove('dark');
      htmlElement.classList.add('light');
    } else {
      htmlElement.classList.remove('light');
      htmlElement.classList.add('dark');
    }
    setIsDarkMode(!isDarkMode);
  };

  // 3. Função auxiliar para definir a classe CSS
  const getLinkClass = (path: string) => {
    // Se o caminho atual for igual ao do link, usa o estilo "primary" (destaque)
    // Caso contrário, usa "secondary"
    return location.pathname === path 
      ? "nav-link nav-link-primary" 
      : "nav-link nav-link-secondary";
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-content">
          <div className="navbar-left">
            <h1 className="navbar-logo">Estocando</h1>
            {showlinks && (
            <div className="navbar-nav">
              {/* 4. Aplicando a lógica dinâmica nas classes */}
              <Link 
                to="/" 
                className={getLinkClass('/')}
              >
                Itens
              </Link>
              <Link 
                to="/reports" 
                className={getLinkClass('/reports')}
              >
                Relatórios
              </Link>
            </div>
            )}
            
          </div>
          <div className="navbar-right">
            

            {/* Informações do usuário e logout (se necessário) */}
            {user && (
              <>
                <span className="user-greeting">Olá, {user.name}</span>
              </>
            )}
            {/* Botão Dark Mode */}
            <button 
              onClick={toggleTheme}
              className="theme-toggle-btn"
               style={{ marginLeft: '1rem' }}
            >
              {isDarkMode ? (
                <>
                  <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>
                    light_mode
                  </span>
                  Light Mode
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>
                    dark_mode
                  </span>
                  Dark Mode
                </>
              )}
            </button>
            {showLogout && (
              <button
                  onClick={onLogout}
                  className="logout-button"
                  style={{ marginLeft: '1rem' }}
                >
                  Sair
                </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;