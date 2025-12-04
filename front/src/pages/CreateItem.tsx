import React, { useState, useEffect } from 'react';
import { useNavigate, } from 'react-router-dom';
import { itemService } from '../services/item';
import { createItemSchema } from '../schemas';
import { type CreateItemInput } from '../schemas';
import '../App.css';
import Navbar from '../components/Navbar';

const CreateItem: React.FC = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [quantity, setQuantity] = useState(0);
  const [error, setError] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  const navigate = useNavigate();

  // Verificar modo escuro ao carregar
  useEffect(() => {
    const htmlElement = document.documentElement;
    const isDark = htmlElement.classList.contains('dark');
    setIsDarkMode(isDark);
  }, []);



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const data: CreateItemInput = { name, quantity, description };
    const validation = createItemSchema.safeParse(data);
    if (!validation.success) {
      setError(validation.error.issues[0].message);
      return;
    }

    try {
      await itemService.create(data);
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Erro ao criar item');
    }
  };

  return (
    <div className="main-container">
     <Navbar showlinks={true}  showLogout={false}  />

      {/* Conteúdo do Formulário */}
      <div className={`item-form-container ${isDarkMode ? 'dark' : 'light'}`}>
        <div className="item-form-content">
          {/* Cabeçalho */}
          <div className="item-form-header">
            <h1 className="item-form-title">Criar Novo Item</h1>
            <button 
              onClick={() => navigate('/')}
              className="back-button"
            >
              <span className="material-symbols-outlined">arrow_back</span>
              Voltar
            </button>
          </div>

          <form onSubmit={handleSubmit} className="item-form">
            {/* Erro */}
            {error && (
              <div className="item-form-error">
                {error}
              </div>
            )}

            {/* Nome */}
            <div className="form-group">
              <label className="form-label">
                Nome do Item
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Digite o nome do item"
                className="form-input"
                required
              />
            </div>

            {/* Descrição */}
            <div className="form-group">
              <label className="form-label">
                Descrição
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Digite uma descrição para o item (opcional)"
                className="form-textarea"
              />
            </div>

            {/* Quantidade */}
            <div className="form-group">
              <label className="form-label">
                Quantidade
              </label>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                placeholder="0"
                className="form-number-input"
                required
                min="0"
              />
            </div>

            {/* Botões */}
            <div className="form-buttons">
              <button
                type="button"
                onClick={() => navigate('/')}
                className="form-button form-button-secondary"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="form-button form-button-primary"
              >
                Criar Item
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateItem;