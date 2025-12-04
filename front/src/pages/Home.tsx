import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCrudApi } from '../hooks/useApi';
import { itemService } from '../services/item';
import type { Item } from '../types';
import LoadingSpinner from '../components/LoadingSpinner';
import '../App.css';
import Navbar from '../components/Navbar';

const Home: React.FC = () => {
  const { user, logout } = useAuth();
  
  const {
    items,
    isLoading,
    error,
    list,
    remove,
  } = useCrudApi<Item, { name: string; quantity: number; description?: string }, any>(itemService);

  useEffect(() => {
    list();
  }, [list]);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Tem certeza que deseja excluir este item?')) return;
    
    try {
      await remove(id);
    } catch (err) {
      // Erro já tratado pelo hook
    }
  };

  return (
    <div className="main-container">
    <Navbar showlinks={true} user={user || undefined} showLogout={true} onLogout={logout} />

      <div className="items-container">
        <div className="items-header">
          <h2 className="items-title">Itens em Estoque</h2>
          <Link to="/items/new" className="create-item-button">
            Novo Item
          </Link>
        </div>

        {error && (
          <div className="item-form-error" style={{ marginBottom: '1rem' }}>
            {error.message}
          </div>
        )}

        {isLoading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem 0' }}>
            <LoadingSpinner size="large" text="Carregando itens..." />
          </div>
        ) : items.length === 0 ? (
          <div className="empty-state">
            <p className="empty-state-title">Nenhum item cadastrado</p>
            <Link to="/items/new" className="empty-state-button">
              Criar primeiro item
            </Link>
          </div>
        ) : (
          <div className="items-list">
            {items.map((item) => (
              <div key={item.id} className="item-card">
                <div className="item-header">
                  <h3 className="item-name">{item.name}</h3>
                  <span className={`item-quantity ${item.quantity > 0 ? 'quantity-available' : 'quantity-unavailable'}`}>
                    {item.quantity} unidades
                  </span>
                </div>
                {item.description && (
                  <p className="item-description">{item.description}</p>
                )}
                <div className="item-footer">
                  <p className="item-date">
                    Criado em: {new Date(item.createdAt).toLocaleDateString()}
                  </p>
                  <div className="item-actions">
                    <Link
                      to={`/items/${item.id}/edit`}
                      className="item-action-button edit-button"
                    >
                      Editar
                    </Link>
                    <Link
                      to={`/items/${item.id}/adjust`}
                      className="item-action-button adjust-button"
                    >
                      Ajustar
                    </Link>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="item-action-button delete-button"
                    >
                      Excluir
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;