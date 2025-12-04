import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCrudApi } from '../hooks/useApi';
import { itemService } from '../services/item';
import { reportService } from '../services/report';
import type { Item, StockAdjustment } from '../types';
import LoadingSpinner from '../components/LoadingSpinner';
import '../App.css';
import Navbar from '../components/Navbar';

const LOW_STOCK = 10 as number;

// Tipo para os filtros de estoque
type StockFilter = 'all' | 'high' | 'low' | 'out';

// Tipo para o modal
type ModalData = {
  item: Item;
  adjustments: StockAdjustment[];
  isLoadingAdjustments: boolean;
} | null;

const Home: React.FC = () => {
  const { user, logout } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [stockFilter, setStockFilter] = useState<StockFilter>('all');
  const [filteredItems, setFilteredItems] = useState<Item[]>([]);
  const [modalData, setModalData] = useState<ModalData>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'details' | 'history'>('details');
  const [isLoadingAdjustments, setIsLoadingAdjustments] = useState(false);
  
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

  // Filtrar itens quando a lista, termo de busca ou filtro mudar
  useEffect(() => {
    let filtered = items;
    
    // Aplicar filtro de busca por texto
    if (searchTerm.trim() !== '') {
      const lowercasedSearch = searchTerm.toLowerCase();
      filtered = filtered.filter(item => 
        item.name.toLowerCase().includes(lowercasedSearch) ||
        (item.description && item.description.toLowerCase().includes(lowercasedSearch))
      );
    }
    
    // Aplicar filtro por nível de estoque
    if (stockFilter !== 'all') {
      filtered = filtered.filter(item => {
        const quantity = item.quantity;
        switch(stockFilter) {
          case 'high':
            return quantity > LOW_STOCK;
          case 'low':
            return quantity > 0 && quantity <= LOW_STOCK;
          case 'out':
            return quantity === 0;
          default:
            return true;
        }
      });
    }
    
    setFilteredItems(filtered);
  }, [items, searchTerm, stockFilter]);

  // Função para abrir o modal com detalhes do item
  const handleOpenItemModal = async (item: Item) => {
    setIsModalOpen(true);
    setActiveTab('details');
    setIsLoadingAdjustments(true);
    
    try {
      // Buscar ajustes de estoque do item
      const adjustments = await reportService.getAdjustmentsByItemId(item.id, 20);
      
      setModalData({
        item,
        adjustments,
        isLoadingAdjustments: false
      });
    } catch (error) {
      console.error('Erro ao carregar ajustes:', error);
      setModalData({
        item,
        adjustments: [],
        isLoadingAdjustments: false
      });
    } finally {
      setIsLoadingAdjustments(false);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setModalData(null);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Tem certeza que deseja excluir este item?')) return;
    
    try {
      await remove(id);
      if (modalData?.item.id === id) {
        handleCloseModal();
      }
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

  const handleStockFilterClick = (filter: StockFilter) => {
    // Se clicar no filtro ativo, remove o filtro
    setStockFilter(prev => prev === filter ? 'all' : filter);
  };

  const handleClearAllFilters = () => {
    setSearchTerm('');
    setStockFilter('all');
  };

  // Função para determinar a classe de quantidade com base no estoque
  const getQuantityClass = (quantity: number) => {
    if (quantity === 0) return 'quantity-unavailable';
    if (quantity <= LOW_STOCK) return 'quantity-low';
    return 'quantity-available';
  };

  // Função para determinar o texto do indicador de quantidade
  const getQuantityText = (quantity: number) => {
    if (quantity === 0) return 'Esgotado';
    if (quantity <= LOW_STOCK) return 'Baixo';
    return 'Disponível';
  };

  // Calcular contadores para os filtros
  const highStockCount = items.filter(i => i.quantity > LOW_STOCK).length;
  const lowStockCount = items.filter(i => i.quantity > 0 && i.quantity <= LOW_STOCK).length;
  const outStockCount = items.filter(i => i.quantity === 0).length;

  // Formatar data para exibição
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  // Formatar data e hora para exibição
  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('pt-BR');
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
            {searchTerm || stockFilter !== 'all' ? (
              <>
                Mostrando {filteredItems.length} de {items.length} itens
                {(filteredItems.length === 0 && items.length > 0) && ' - Nenhum resultado encontrado'}
              </>
            ) : (
              `Total: ${items.length} item${items.length !== 1 ? 's' : ''}`
            )}
            {(searchTerm || stockFilter !== 'all') && (
              <button
                onClick={handleClearAllFilters}
                className="clear-filters-button"
                style={{ marginLeft: '0.75rem' }}
              >
                Limpar filtros
              </button>
            )}
          </div>
        </div>

        {/* Estatísticas do estoque com filtros */}
        <div className="stats-home">
          <h3 className="stats-title">Resumo do Estoque</h3>

          <div className="stats-grid">
            <div 
              className={`stats-row ${stockFilter === 'high' ? 'active-filter' : ''}`}
              onClick={() => handleStockFilterClick('high')}
              style={{ cursor: 'pointer' }}
            >
              <div className="dot dot-green" />
              <span className="stats-text">
                Estoque Bom ({highStockCount})
              </span>
              {stockFilter === 'high' && (
                <span className="material-symbols-outlined" style={{ marginLeft: 'auto', fontSize: '16px' }}>
                  check_circle
                </span>
              )}
            </div>

            <div 
              className={`stats-row ${stockFilter === 'low' ? 'active-filter' : ''}`}
              onClick={() => handleStockFilterClick('low')}
              style={{ cursor: 'pointer' }}
            >
              <div className="dot dot-yellow" />
              <span className="stats-text">
                Estoque Baixo ({lowStockCount})
              </span>
              {stockFilter === 'low' && (
                <span className="material-symbols-outlined" style={{ marginLeft: 'auto', fontSize: '16px' }}>
                  check_circle
                </span>
              )}
            </div>

            <div 
              className={`stats-row ${stockFilter === 'out' ? 'active-filter' : ''}`}
              onClick={() => handleStockFilterClick('out')}
              style={{ cursor: 'pointer' }}
            >
              <div className="dot dot-red" />
              <span className="stats-text">
                Esgotado ({outStockCount})
              </span>
              {stockFilter === 'out' && (
                <span className="material-symbols-outlined" style={{ marginLeft: 'auto', fontSize: '16px' }}>
                  check_circle
                </span>
              )}
            </div>
          </div>

          {/* Indicador de filtro ativo */}
          {stockFilter !== 'all' && (
            <div className="active-filter-info">
              <span className="material-symbols-outlined" style={{ fontSize: '16px', marginRight: '0.5rem' }}>
                filter_alt
              </span>
              Filtrando por: 
              <strong style={{ marginLeft: '0.25rem' }}>
                {stockFilter === 'high' ? 'Estoque Bom' : 
                 stockFilter === 'low' ? 'Estoque Baixo' : 'Esgotado'}
              </strong>
              <button 
                onClick={() => setStockFilter('all')}
                className="clear-filter-button"
                style={{ marginLeft: '1rem' }}
              >
                Remover filtro
              </button>
            </div>
          )}
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
              {searchTerm || stockFilter !== 'all' ? 'search_off' : 'inventory_2'}
            </span>
            <p className="empty-state-title">
              {searchTerm || stockFilter !== 'all' ? 'Nenhum item encontrado' : 'Nenhum item cadastrado'}
            </p>
            <p style={{ marginTop: '0.5rem', color: 'var(--text-light-secondary)' }}>
              {searchTerm || stockFilter !== 'all' 
                ? 'Tente ajustar os filtros de busca'
                : 'Comece adicionando seu primeiro item ao estoque'
              }
            </p>
            {!searchTerm && stockFilter === 'all' && (
              <Link to="/items/new" className="empty-state-button">
                Criar primeiro item
              </Link>
            )}
            {(searchTerm || stockFilter !== 'all') && (
              <button
                onClick={handleClearAllFilters}
                className="empty-state-button"
                style={{ background: 'transparent', color: 'var(--primary)', border: '1px solid var(--primary)' }}
              >
                Limpar todos os filtros
              </button>
            )}
          </div>
        ) : (
          <>
            {/* Lista de itens em grid */}
            <div className="items-list">
              {filteredItems.map((item) => (
                <div 
                  key={item.id} 
                  className="item-card"
                  onClick={() => handleOpenItemModal(item)}
                  style={{ cursor: 'pointer' }}
                >
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
                      Criado em: {formatDate(item.createdAt)}
                    </p>
                    
                    <div className="item-actions" onClick={(e) => e.stopPropagation()}>
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
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(item.id);
                        }}
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
          </>
        )}

        {/* Modal de detalhes do item */}
        {isModalOpen && modalData && (
          <div className="modal-overlay" onClick={handleCloseModal}>
            <div className="item-modal" onClick={(e) => e.stopPropagation()}>
              {/* Cabeçalho do modal */}
              <div className="modal-header">
                <h2 className="modal-title">{modalData.item.name}</h2>
                <button 
                  className="modal-close"
                  onClick={handleCloseModal}
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>

              {/* Abas do modal */}
              <div className="modal-tabs">
                <button 
                  className={`modal-tab ${activeTab === 'details' ? 'active' : ''}`}
                  onClick={() => setActiveTab('details')}
                >
                  <span className="material-symbols-outlined" style={{ marginRight: '0.5rem' }}>
                    info
                  </span>
                  Detalhes
                </button>
                <button 
                  className={`modal-tab ${activeTab === 'history' ? 'active' : ''}`}
                  onClick={() => setActiveTab('history')}
                >
                  <span className="material-symbols-outlined" style={{ marginRight: '0.5rem' }}>
                    history
                  </span>
                  Histórico ({modalData.adjustments.length})
                </button>
              </div>

              {/* Conteúdo do modal */}
              <div className="modal-content">
                {activeTab === 'details' ? (
                  <div className="modal-details">
                    <div className="detail-row">
                      <span className="detail-label">Nome:</span>
                      <span className="detail-value">{modalData.item.name}</span>
                    </div>
                    
                    <div className="detail-row">
                      <span className="detail-label">Quantidade:</span>
                      <span className={`detail-value ${getQuantityClass(modalData.item.quantity)}`}>
                        {modalData.item.quantity} unidades
                        <span style={{ 
                          fontSize: '0.875rem', 
                          marginLeft: '0.5rem',
                          opacity: 0.8 
                        }}>
                          ({getQuantityText(modalData.item.quantity)})
                        </span>
                      </span>
                    </div>
                    
                    {modalData.item.description && (
                      <div className="detail-row">
                        <span className="detail-label">Descrição:</span>
                        <span className="detail-value">{modalData.item.description}</span>
                      </div>
                    )}
                    
                    <div className="detail-row">
                      <span className="detail-label">Criado em:</span>
                      <span className="detail-value">
                        {formatDate(modalData.item.createdAt)}
                      </span>
                    </div>
                    
                    <div className="detail-row">
                      <span className="detail-label">Última atualização:</span>
                      <span className="detail-value">
                        {formatDate(modalData.item.updatedAt)}
                      </span>
                    </div>
                    
                    {/* Barra de estoque */}
                    <div className="detail-row">
                      <span className="detail-label">Nível de estoque:</span>
                      <div className="stock-level-bar-modal">
                        <div 
                          className="stock-level-fill-modal"
                          style={{
                            width: `${Math.min(100, (modalData.item.quantity / 10) * 100)}%`,
                            backgroundColor: modalData.item.quantity === 0 ? '#ff3b30' : 
                                            modalData.item.quantity <= LOW_STOCK ? '#ffcc00' : 'var(--primary)'
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="modal-history">
                    {isLoadingAdjustments ? (
                      <div className="loading-adjustments">
                        <LoadingSpinner size="small" text="Carregando histórico..." />
                      </div>
                    ) : modalData.adjustments.length === 0 ? (
                      <div className="empty-history">
                        <span className="material-symbols-outlined" style={{ fontSize: '3rem', opacity: 0.5 }}>
                          history_toggle_off
                        </span>
                        <p>Nenhum ajuste de estoque registrado</p>
                      </div>
                    ) : (
                      <div className="adjustments-list">
                        {modalData.adjustments.map((adjustment) => (
                          <div key={adjustment.id} className="adjustment-item">
                            <div className="adjustment-header">
                              <span className="adjustment-type">
                                <span className={`type-badge type-${adjustment.type.toLowerCase()}`}>
                                  {adjustment.type === 'IN' ? 'Entrada' : 'Saída'}
                                </span>
                              </span>
                              <span className="adjustment-date">
                                {formatDateTime(adjustment.createdAt)}
                              </span>
                            </div>
                            <div className="adjustment-details">
                              <span className="adjustment-quantity">
                                {adjustment.quantity} unidades
                              </span>
                            </div>
                            {adjustment.user && (
                              <div className="adjustment-user">
                                <small>Por: {adjustment.user.name}</small>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Ações do modal */}
              <div className="modal-actions">
                <Link
                  to={`/items/${modalData.item.id}/edit`}
                  className="modal-action-button edit"
                  onClick={handleCloseModal}
                >
                  <span className="material-symbols-outlined" style={{ marginRight: '0.5rem' }}>
                    edit
                  </span>
                  Editar Item
                </Link>
                
                <Link
                  to={`/items/${modalData.item.id}/adjust`}
                  className="modal-action-button adjust"
                  onClick={handleCloseModal}
                >
                  <span className="material-symbols-outlined" style={{ marginRight: '0.5rem' }}>
                    inventory
                  </span>
                  Ajustar Estoque
                </Link>
                
                <button
                  onClick={() => {
                    if (window.confirm('Tem certeza que deseja excluir este item?')) {
                      handleDelete(modalData.item.id);
                    }
                  }}
                  className="modal-action-button delete"
                >
                  <span className="material-symbols-outlined" style={{ marginRight: '0.5rem' }}>
                    delete
                  </span>
                  Excluir Item
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;