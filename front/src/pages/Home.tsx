import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCrudApi } from '../hooks/useApi';
import { itemService } from '../services/item';
import type { Item } from '../types';
import LoadingSpinner from '../components/LoadingSpinner';
import '../App.css';
import Navbar from '../components/Navbar';

const LOW_STOCK = 10 as number;


const Home: React.FC = () => {
  const { user, logout } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredItems, setFilteredItems] = useState<Item[]>([]);
  
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

  // Filtrar itens quando a lista ou o termo de busca mudar
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredItems(items);
    } else {
      const lowercasedSearch = searchTerm.toLowerCase();
      const filtered = items.filter(item => 
        item.name.toLowerCase().includes(lowercasedSearch) ||
        (item.description && item.description.toLowerCase().includes(lowercasedSearch))
      );
      setFilteredItems(filtered);
    }
  }, [items, searchTerm]);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Tem certeza que deseja excluir este item?')) return;
    
    try {
      await remove(id);
    } catch (err) {
      // Erro já tratado pelo hook
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleClearSearch = () => {
    setSearchTerm('');
  };

  // Função para determinar a classe de quantidade com base no estoque
  const getQuantityClass = (quantity: number) => {
    if (quantity === 0) return 'quantity-unavailable';
    if (quantity <= LOW_STOCK) return 'quantity-low'; // Estoque baixo em amarelo
    return 'quantity-available';
  };

  // Função para determinar o texto do indicador de quantidade
  const getQuantityText = (quantity: number) => {
    if (quantity === 0) return 'Esgotado';
    if (quantity <= LOW_STOCK) return 'Baixo';
    return 'Disponível';
  };

  return (
    <div className="main-container">
      <Navbar showlinks={true} user={user || undefined} showLogout={true} onLogout={logout} />

      <div className="reports-container" style={{ maxWidth: '1200px' }}>
        {/* Cabeçalho com título e botão */}
        <div className="items-header">
          <h1 className="items-title">Itens em Estoque</h1>
          <div className="items-actions">
            <Link to="/items/new" className="create-item-button">
              <span className="material-symbols-outlined" style={{ verticalAlign: 'middle', marginRight: '0.5rem' }}>
                add
              </span>
              Novo Item
            </Link>
          </div>
        </div>

        {/* Barra de pesquisa */}
        <div className="search-container">
          <div className="search-input-container">
            <span className="material-symbols-outlined search-icon">
              search
            </span>
            <input
              type="text"
              placeholder="Buscar itens por nome ou descrição..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="search-input"
            />
            {searchTerm && (
              <button
                onClick={handleClearSearch}
                className="search-clear"
                title="Limpar busca"
              >
                <span className="material-symbols-outlined">
                  close
                </span>
              </button>
            )}
          </div>
          
          {/* Contador de resultados */}
          <div className="search-results">
            {searchTerm ? (
              <>
                Mostrando {filteredItems.length} de {items.length} itens
                {filteredItems.length === 0 && ' - Nenhum resultado encontrado'}
              </>
            ) : (
              `Total: ${items.length} item${items.length !== 1 ? 's' : ''}`
            )}
          </div>
        </div>

        {/* Mensagem de erro */}
        {error && (
          <div className="error-message">
            {error.message || 'Erro ao carregar itens'}
          </div>
        )}

        {/* Loading state */}
        {isLoading ? (
          <div className="loading-container">
            <LoadingSpinner size="large" text="Carregando itens..." />
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="empty-state">
            <span className="material-symbols-outlined empty-state-icon">
              {searchTerm ? 'search_off' : 'inventory_2'}
            </span>
            <p className="empty-state-title">
              {searchTerm ? 'Nenhum item encontrado' : 'Nenhum item cadastrado'}
            </p>
            <p style={{ marginTop: '0.5rem', color: 'var(--text-light-secondary)' }}>
              {searchTerm 
                ? 'Tente buscar com outros termos'
                : 'Comece adicionando seu primeiro item ao estoque'
              }
            </p>
            {!searchTerm && (
              <Link to="/items/new" className="empty-state-button">
                Criar primeiro item
              </Link>
            )}
            {searchTerm && (
              <button
                onClick={handleClearSearch}
                className="empty-state-button"
                style={{ background: 'transparent', color: 'var(--primary)', border: '1px solid var(--primary)' }}
              >
                Limpar busca
              </button>
            )}
          </div>
        ) : (
          <>
            {/* Lista de itens em grid */}
            <div className="items-list">
              {filteredItems.map((item) => (
                <div key={item.id} className="item-card">
                  <div className="item-header">
                    <h3 className="item-name">{item.name}</h3>
                    <span className={`item-quantity ${getQuantityClass(item.quantity)}`}>
                      {item.quantity} {item.quantity === 1 ? 'unidade' : 'unidades'}
                      <span style={{ 
                        fontSize: '0.75rem', 
                        marginLeft: '0.5rem',
                        opacity: 0.8 
                      }}>
                        ({getQuantityText(item.quantity)})
                      </span>
                    </span>
                  </div>
                  
                  {item.description && (
                    <p className="item-description">{item.description}</p>
                  )}
                  
                  {/* Indicador visual de nível de estoque */}
                  <div style={{ 
                    height: '4px', 
                    backgroundColor: 'var(--border-light)', 
                    borderRadius: '2px',
                    margin: '1rem 0',
                    overflow: 'hidden'
                  }}>
                    <div style={{ 
                      height: '100%',
                      width: `${Math.min(100, (item.quantity / 10) * 100)}%`,
                      backgroundColor: item.quantity === 0 ? '#ff3b30' : 
                                      item.quantity <= LOW_STOCK ? '#ffcc00' : 'var(--primary)',
                      borderRadius: '2px',
                      transition: 'width 0.3s ease'
                    }} />
                  </div>
                  
                  <div className="item-footer">
                    <p className="item-date">
                      <span className="material-symbols-outlined" style={{ 
                        fontSize: '14px', 
                        verticalAlign: 'middle', 
                        marginRight: '0.25rem',
                        opacity: 0.7
                      }}>
                        calendar_today
                      </span>
                      Criado em: {new Date(item.createdAt).toLocaleDateString('pt-BR')}
                    </p>
                    
                    <div className="item-actions">
                      <Link
                        to={`/items/${item.id}/edit`}
                        className="item-action-button edit-button"
                        title="Editar item"
                      >
                        <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>
                          edit
                        </span>
                      </Link>
                      
                      <Link
                        to={`/items/${item.id}/adjust`}
                        className="item-action-button adjust-button"
                        title="Ajustar estoque"
                      >
                        <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>
                          inventory
                        </span>
                      </Link>
                      
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="item-action-button delete-button"
                        title="Excluir item"
                      >
                        <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>
                          delete
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

           {/* Estatísticas do estoque */}
          <div className="stats-home">
            <h3 className="stats-title">Resumo do Estoque</h3>

            <div className="stats-grid">

              <div>
                <div className="stats-row">
                  <div className="dot dot-green" />
                  <span className="stats-text">
                    Estoque Bom ({items.filter(i => i.quantity > LOW_STOCK).length})
                  </span>
                </div>
              </div>

              <div>
                <div className="stats-row">
                  <div className="dot dot-yellow" />
                  <span className="stats-text">
                    Estoque Baixo ({items.filter(i => i.quantity > 0 && i.quantity <= LOW_STOCK).length})
                  </span>
                </div>
              </div>

              <div>
                <div className="stats-row">
                  <div className="dot dot-red" />
                  <span className="stats-text">
                    Esgotado ({items.filter(i => i.quantity === 0).length})
                  </span>
                </div>
              </div>

            </div>
          </div>

          </>
        )}
      </div>
    </div>
  );
};

export default Home;